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
          :key="record.studentId + record.timestamp"
        >
          <td>{{ record.firstName }}</td>
          <td>{{ record.lastName }}</td>
          <td>{{ record.timestamp }}</td>
          <td>{{ record.attendanceStatus }}</td>
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
        // Replace with your actual API endpoint
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
          try {
            // Fetch additional details for each record
            const studentDetails = await this.fetchStudentDetails(
              record.StudentID
            );
            const classDetails = await this.fetchClassDetails(record.ClassID); // Assume ClassID is part of the record
            const majorDetails = await this.fetchMajorDetails(
              studentDetails.majorId
            );

            // Combine all details into a single object
            return {
              ...record,
              firstName: studentDetails.firstName,
              lastName: studentDetails.lastName,
              className: classDetails.className,
              majorName: majorDetails.majorName,
              instructor: classDetails.instructor,
            };
          } catch (error) {
            console.error("Error combining records:", error);
            return record; // Return original record if any fetch fails
          }
        })
      );
    },
    async fetchStudentDetails(studentId) {
      // Replace with actual API/DB call
    },
    async fetchClassDetails(classId) {
      // Replace with actual API/DB call
    },
    async fetchMajorDetails(majorId) {
      // Replace with actual API/DB call
    },
  },
};
</script>

<style>
/* Add styles for your table here */
</style>
