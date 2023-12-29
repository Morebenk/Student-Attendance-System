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
        <tr v-for="record in records" :key="record.StudentID">
          <td>{{ record.firstName }}</td>
          <td>{{ record.lastName }}</td>
          <td>{{ record.Timestamp }}</td>
          <td>{{ record.AttendanceStatus }}</td>
          <td>{{ record.ClassName }}</td>
          <td>{{ record.MajorName }}</td>
          <td>{{ record.Instructor }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      records: [],
    };
  },
  async created() {
    try {
      const response = await axios.get(
        "https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/attendance"
      );
      this.records = response.data;
      console.log(this.records);
      // For additional data fetching and augmentation, implement here
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  },
};
</script>

<style>
/* Add styles for your table here */
</style>
