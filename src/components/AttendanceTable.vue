<template>
  <div>
    <h1>Today's Attendance Records</h1>
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
        <tr v-for="record in todaysRecords" :key="record.StudentID">
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
      todaysRecords: [],
    };
  },
  async created() {
    try {
      const response = await axios.get(
        "https://843ix1dpk7.execute-api.eu-west-2.amazonaws.com/prod/attendance"
      );
      this.records = response.data;
      this.filterTodaysRecords();
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  },
  methods: {
    filterTodaysRecords() {
      const today = new Date().toISOString().split("T")[0];
      this.todaysRecords = this.records.filter((record) =>
        record.Timestamp.startsWith(today)
      );
      // Here you would also fetch additional data for each record and augment the todaysRecords objects accordingly
    },
  },
};
</script>

<style>
/* Add styles for your table here */
</style>
