<template>
  <div>
    <h1>All Attendance Records</h1>
    <table>
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
          <td>{{ record.Timestamp }}</td>
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
        // Replace with your actual API endpoint for attendance records
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
          const [date, classId] = record["Date#ClassID"].split("#");
          try {
            // Fetch additional details for each record
            const studentDetails = await this.fetchStudentDetails(
              record.StudentID
            );
            const classDetails = await this.fetchClassDetails(classId);
            const majorDetails = await this.fetchMajorDetails(
              studentDetails.majorId
            );

            // Combine all details into a single object
            return {
              ...record,
              ...studentDetails,
              className: classDetails.ClassName,
              majorName: majorDetails.MajorName,
              instructor: classDetails.Instructor,
            };
          } catch (error) {
            console.error("Error combining records:", error);
            return { ...record, error: "Failed to fetch additional data" }; // Return original record with error note
          }
        })
      );
    },
    async fetchStudentDetails(studentId) {
      const response = await axios.get(
        `https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/students/${studentId}`
      );
      return response.data; // Transform this as needed based on your API response
    },
    async fetchClassDetails(classId) {
      const response = await axios.get(
        `https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/classes/${classId}`
      );
      return response.data; // Transform this as needed based on your API response
    },
    async fetchMajorDetails(majorId) {
      const response = await axios.get(
        `https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/majors/${majorId}`
      );
      return response.data; // Transform this as needed based on your API response
    },
  },
};
</script>

<style>
/* Add styles for your table here */
</style>
