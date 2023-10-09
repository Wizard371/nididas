<template>
  <footer>
    <div class="img-brand">
      <transition name="fade">
        <img :key="footerLogoSrc" :src="footerLogoSrc" alt="Footer Logo" />
      </transition>
    </div>
    <div class="mid-footer">
      <ul>
        <li>
          <router-link to="/about">About Us</router-link>
        </li>
        <li>
          <router-link to="/contact">Contact</router-link>
        </li>
        <li>
          <router-link to="/privacy">Privacy Policy</router-link>
        </li>
      </ul>
    </div>
    <div class="right-footer">
      <i class="fa-brands fa-facebook"></i>
      <i class="fa-brands fa-twitter"></i>
      <i class="fa-brands fa-instagram"></i>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterBar",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    footerLogoSrc() {
      return this.darkMode
        ? require("../assets/logo-white.png")
        : require("../assets/logo-black.png");
    },
  },
};
</script>

<style scoped>
footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 3px solid var(--nav-border-color);
  padding: 0.5rem 4rem;
  margin-top: 5vh;
  position: fixed;
  bottom: 0;
  background-color: var(--primary-bg-color);
  z-index: 1000;
}

.img-brand {
  display: flex;
  align-items: center;
}

.img-brand img {
  width: 100px;
}

.mid-footer {
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mid-footer ul {
  display: flex;
  justify-content: space-evenly;
  width: 70%; /* slightly more width as we have more links */
  gap: 1rem;
  list-style: none;
}

.mid-footer a {
  text-decoration: none;
  color: var(--link-color);
  text-transform: uppercase;
}

.right-footer i {
  font-size: 1.5rem;
  margin: 0px 10px;
  cursor: pointer;
  color: var(--icon-color);
}

@media (max-width: 768px) {
  footer {
    flex-direction: column;
    padding: 1rem 0.5rem;
  }

  .img-brand img {
    width: 75px; /* Reduce the logo size */
    margin-bottom: 0.5rem; /* Add some margin below the logo */
  }

  .mid-footer ul {
    width: 100%; /* Full width */
    gap: 0.5rem; /* Reduce the gap */
  }

  .mid-footer a {
    display: block;
    text-align: center;
    width: 100%; /* Full width links */
    padding: 0.5rem 0.5rem; /* Adjust padding */
  }

  .right-footer {
    margin-top: 0.5rem;
  }

  .right-footer i {
    margin: 0px 5px; /* Reduce margin for icons */
  }
}

/* Add another breakpoint for tablets and adjust as necessary */
@media (min-width: 769px) and (max-width: 1024px) {
  footer {
    padding: 0.5rem 1rem;
  }

  .img-brand img {
    width: 90px; /* Adjust logo size */
  }

  .mid-footer ul {
    width: 50%; /* Adjust width */
  }
}
</style>
