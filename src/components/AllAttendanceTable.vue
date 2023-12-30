<template>
  <div>
    <h1>All Attendance Records</h1>
    <table class="attendance-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Timestamp</th>
          <th>Status</th>
          <th>Class Name</th>
          <th>Major</th>
          <th>Instructor</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="record in combinedRecords"
          :key="record.StudentID + record.Timestamp"
        >
          <td>{{ record.firstName }}</td>
          <td>{{ record.lastName }}</td>
          <td>{{ formatTimestamp(record.Timestamp) }}</td>
          <td>{{ record.AttendanceStatus }}</td>
          <td>{{ record.className }}</td>
          <td>{{ record.majorName }}</td>
          <td>{{ record.instructor }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      attendanceRecords: [],
      combinedRecords: [],
      isLoading: false,
      error: null,
    };
  },
  async created() {
    await this.fetchAllAttendanceRecords();
  },
  methods: {
    async fetchAllAttendanceRecords() {
      this.isLoading = true;
      try {
        const attendanceResponse = await axios.get(
          "https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/attendance"
        );
        this.attendanceRecords = attendanceResponse.data;
        await this.combineRecords();
      } catch (error) {
        this.error = "Failed to fetch attendance records: " + error;
      } finally {
        this.isLoading = false;
      }
    },
    async combineRecords() {
      this.combinedRecords = await Promise.all(
        this.attendanceRecords.map(async (record) => {
          const [, classId] = record["Date#ClassID"].split("#");
          try {
            const studentDetails = await this.fetchStudentDetails(
              record.StudentID
            );
            const classDetails = await this.fetchClassDetails(classId);
            const majorDetails = await this.fetchMajorDetails(
              studentDetails.majorId
            );

            return {
              ...record,
              ...studentDetails,
              className: classDetails.ClassName,
              majorName: majorDetails.MajorName,
              instructor: classDetails.Instructor,
            };
          } catch (error) {
            console.error("Error combining records:", error);
            return { ...record, error: "Failed to fetch additional data" };
          }
        })
      );
    },
    async fetchStudentDetails(studentId) {
      const response = await axios.get(
        `https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/Students/${studentId}`
      );
      return response.data;
    },
    async fetchClassDetails(classId) {
      const response = await axios.get(
        `https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/Classes/${classId}`
      );
      return response.data;
    },
    async fetchMajorDetails(majorId) {
      const response = await axios.get(
        `https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/Majors/${majorId}`
      );
      return response.data;
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      // Format date as 'YYYY-MM-DD'
      const formattedDate = date.toISOString().split("T")[0];
      // Format time as 'HH:MM AM/PM'
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      // Combine date and time
      return `${formattedDate} ${formattedHours}:${formattedMinutes} ${ampm}`;
    },
  },
};
</script>

<style>
/* Add your styles for the table */
.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.attendance-table th {
  background-color: #f2f2f2;
}

/* You can customize the styles further as needed */
</style>
