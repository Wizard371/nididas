<template>
  <nav>
    <div class="img-brand">
      <transition name="fade">
        <img :key="logoSrc" :src="logoSrc" alt="VUE LOGO" />
      </transition>
    </div>
    <div class="mid-nav">
      <ul>
        <li>
          <router-link to="/">Hjem</router-link>
        </li>
        <li>
          <router-link to="/store">Butik</router-link>
        </li>
        <li>
          <router-link to="/about">Om Os</router-link>
        </li>
        <li>
          <router-link to="/contact">Kontakt</router-link>
        </li>
      </ul>
    </div>
    <div class="right-nav">
      <i class="fa-regular fa-cart-shopping"></i>
      <router-link :to="userRoute">
        <i class="fa-regular fa-user"></i>
      </router-link>
      <i class="fa-solid fa-moon" id="darkToggle" @click="toggleDarkMode"></i>
    </div>
  </nav>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "NavBar",
  data() {
    return {
      darkMode: false, // Set the initial value of darkMode to true
      user: null,
    };
  },
  computed: {
    logoSrc() {
      return this.darkMode
        ? require("../assets/logo-white.png")
        : require("../assets/logo-black.png");
    },
    userRoute() {
      return this.user ? "/konto" : "/login";
    },
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("darkMode", "true");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("lightMode", "true");
      }
      this.$emit("themeChanged", this.darkMode);
    },
  },
  mounted() {
    if (localStorage.getItem("lightMode")) {
      this.darkMode = false;
      document.documentElement.removeAttribute("data-theme");
    } else if (localStorage.getItem("darkMode")) {
      this.darkMode = true;
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
};
</script>
<style>
/* Reset and General Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: 0.7s ease;
}

/* Default (light) theme */
:root {
  --primary-bg-color: white;
  --primary-text-color: black;
  --nav-border-color: gray;
  --link-color: black;
  --link-border-color: black;
  --icon-color: black;
  --input-bg-color: white;
  --widget-color: green;
}

/* Dark theme */
[data-theme="dark"] {
  --primary-bg-color: #333;
  --primary-text-color: #fff;
  --nav-border-color: #fff;
  --link-color: #fff;
  --link-border-color: #fff;
  --icon-color: white;
  --input-bg-color: #6d6b6b;
  --widget-color: red;
}

body {
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid var(--nav-border-color);
  padding: 0.5rem 2rem;
  margin-bottom: 2%;
}

.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.img-brand {
  display: flex;
  align-items: center;
}

.img-brand img {
  width: 175px;
}

.mid-nav {
  height: 100%;
  width: 70%;
  display: FLEX;
  justify-content: center;
  align-items: center;
}

.mid-nav ul {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  gap: 1rem;
  list-style: none;
}

.mid-nav li {
  margin: 0;
  padding: 0;
}

.mid-nav a {
  text-decoration: none;
  color: var(--link-color);
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border: 2px solid var(--link-border-color);
  border-radius: 5px;
}

.right-nav i {
  font-size: 1.5rem;
  margin: 0px 10px;
  cursor: pointer;
  color: var(--icon-color);
}

/* General */

input {
  padding: 1rem 2rem;
  outline: none;
  border: 1px solid var(--nav-border-color);
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

#darkToggle {
  transform: rotate(-20deg);
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    padding: 1rem 0.5rem;
  }

  .img-brand img {
    width: 125px; /* Reduce the logo size */
    margin-bottom: 0.5rem; /* Add some margin below the logo */
  }

  .mid-nav ul {
    width: 100%; /* Full width */
    gap: 0.5rem; /* Reduce the gap */
  }

  .mid-nav a {
    display: block;
    text-align: center;
    width: 100%; /* Full width links */
    padding: 0.5rem 0.5rem; /* Adjust padding */
  }

  .right-nav {
    margin-top: 0.5rem;
  }

  .right-nav i {
    margin: 0px 5px; /* Reduce margin for icons */
  }
}

/* Add another breakpoint for tablets and adjust as necessary */
@media (min-width: 769px) and (max-width: 1024px) {
  nav {
    padding: 0.5rem 1rem;
  }

  .img-brand img {
    width: 150px; /* Adjust logo size */
  }

  .mid-nav ul {
    width: 50%; /* Adjust width */
  }
}
</style>
