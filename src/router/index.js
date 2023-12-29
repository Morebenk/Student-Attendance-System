import { createRouter, createWebHistory } from "vue-router";
import AttendanceTable from "../components/AttendanceTable.vue";
import AllAttendanceTable from "../components/AllAttendanceTable.vue";

const routes = [
  {
    path: "/",
    name: "Today",
    component: AttendanceTable,
  },
  {
    path: "/all-records",
    name: "AllRecords",
    component: AllAttendanceTable,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
