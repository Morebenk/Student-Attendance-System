<template>
  <div>
    <h1>Today's Attendance Records</h1>
    <table class="attendance-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Time</th>
          <th>Status</th>
          <th>Class Name</th>
          <th>Major</th>
          <th>Instructor</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="record in todaysRecords"
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
      records: [],
      todaysRecords: [],
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
        this.records = attendanceResponse.data;
        await this.filterTodaysRecords();
      } catch (error) {
        this.error = "Failed to fetch attendance records: " + error;
      } finally {
        this.isLoading = false;
      }
    },
    async filterTodaysRecords() {
      const today = new Date().toISOString().split("T")[0]; // Gets the date as 'YYYY-MM-DD'
      this.todaysRecords = this.records.filter((record) =>
        record.Timestamp.startsWith(today)
      );
      this.todaysRecords = await Promise.all(
        this.todaysRecords.map(async (record) => {
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
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
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
  },
};
</script>

<style>
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

.attendance-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.attendance-table tr:hover {
  background-color: #ddd;
}
</style>
