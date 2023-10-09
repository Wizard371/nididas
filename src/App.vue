<template>
  <div id="app">
    <NavBar @themeChanged="updateTheme" />

    <router-view></router-view>

    <FooterBar :darkMode="darkMode" />
  </div>
</template>

<style>
body {
  max-width: 100vw;
  margin: 0;
}
</style>

<script>
import NavBar from "@/components/NavBar.vue";
import FooterBar from "@/components/FooterBar.vue";

export default {
  components: {
    NavBar,
    FooterBar,
  },
  data() {
    return {
      darkMode: false,
    };
  },
  methods: {
    updateTheme(value) {
      this.darkMode = value;
    },
  },
};
</script>
