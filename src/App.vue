<template>
  <div id="app">
    <nav>
      <router-link to="/">Today's Attendance</router-link> |
      <router-link to="/all-records">All Attendance Records</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Global styles */
nav {
  padding: 1rem;
}

nav a {
  padding: 0.5rem;
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-exact-active {
  color: #333;
}
</style>
