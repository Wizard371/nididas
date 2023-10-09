<template>
  <div>
    <div class="frontpage-container">
      <div class="frontpage-parent">
        <h1>Velkommen til NIDIDAS</h1>
        <h2>Frigør skoens ekspertise</h2>
        <p>
          Opdag NIDIDAS - hvor hvert skridt fortæller en historie. Fra de
          tidløse klassikere til de mest dristige nyskabelser, vores sko er mere
          end bare fodtøj. De er en livsstil, et udtryk og et vidnesbyrd om
          upåklagelig design og håndværk. Dyk ned i vores kuraterede kollektion
          og lad dine fødder nyde komforten, stilen og elegance, der er unikt
          for NIDIDAS.
        </p>
        <p>Interesseret i at lære mere om os? Du er kun et skridt væk.</p>
      </div>

      <section class="showShoes">
        <h3>Nogle Af Vores Sko</h3>
        <transition name="fade" mode="out-in">
          <div class="single-shoe" v-if="shoes.length" :key="currentShoeIndex">
            <img
              :src="shoes[currentShoeIndex].image"
              :alt="shoes[currentShoeIndex].name"
            />

            <h3>{{ shoes[currentShoeIndex].name }}</h3>
            <p>{{ shoes[currentShoeIndex].description }}</p>
            <h4><strong>Pris:</strong> {{ shoes[currentShoeIndex].price }}</h4>
            <button>Se Dette Produkt [VIRKER IKKE]</button>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Define light theme colors */
:root {
  --primary-bg-color: #ffffff;
  --secondary-bg-color: #f7f7f7;
  --primary-text-color: #333333;
  --secondary-text-color: #666666;
  --btn-color: #e91e63;
  --border-color: black;
}

/* Define dark theme colors */
[data-theme="dark"] {
  --primary-bg-color: #333333;
  --secondary-bg-color: #444444;
  --primary-text-color: #ffffff;
  --secondary-text-color: #bbbbbb;
  --btn-color: #ff4081;
  --border-color: white;
}

.frontpage-container {
  padding: 2rem;
  color: var(--primary-text-color);
  display: flex;
  justify-content: space-between;
}

h4 {
  margin-top: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromBottom {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

.showShoes {
  text-align: center;
  padding: 2rem;
  width: 25%;
  background-color: var(--secondary-bg-color);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.showShoes h3 {
  font-size: 1.5rem;
  margin-bottom: 5%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.single-shoe {
  width: 80%;
  height: 100%;
  border-radius: 5px;
  padding: 1rem;
  border: 2px solid var(--primary-text-color);
  font-size: 1.5rem;
}

.single-shoe p {
  margin-top: 1rem;
  font-size: 1rem;
}

.single-shoe img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

/* Intro Side */
.frontpage-parent {
  width: 60%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.frontpage-parent h1 {
  color: var(--primary-text-color);
  font-size: 3rem;
  margin-bottom: 1rem;
}

.frontpage-parent h2 {
  color: var(--primary-text-color);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.frontpage-parent p {
  color: var(--primary-text-color);
  font-size: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .frontpage-parent {
    width: 100%;
  }
  .frontpage-container {
    flex-direction: column;
  }
  .showShoes {
    width: 100%;
  }
  .single-shoe {
    width: 100%;
  }
}
</style>

<script>
import { getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      firebaseCheckMsg: "",
      currentShoeIndex: 0,
      userName: "",
      API_KEY: "XhTXaEmjhKFZiHgCgD6bYUi8",
      REMOVE_BG_API_URL: "https://api.remove.bg/v1.0/removebg",
      shoes: [],
    };
  },
  computed: {
    randomShoes() {
      return [...this.shoes].sort(() => 0.5 - Math.random()).slice(0, 5);
    },
  },
  methods: {
    async removeBackgroundFromShoe(imageURL) {
      try {
        const response = await axios.post(
          this.REMOVE_BG_API_URL,
          {
            image_url: imageURL,
            size: "auto",
          },
          {
            headers: {
              "X-Api-Key": this.API_KEY,
            },
          }
        );
        return `data:image/png;base64,${response.data.result}`;
      } catch (error) {
        console.error("Error removing background:", error);
        throw error;
      }
    },
    nextShoe() {
      if (this.shoes.length) {
        this.currentShoeIndex = (this.currentShoeIndex + 1) % this.shoes.length;
      }
    },
    async fetchShoes() {
      try {
        const db = getFirestore();
        const shoesCollection = collection(db, "shoes");
        const shoeSnapshot = await getDocs(shoesCollection);
        let shoesData = shoeSnapshot.docs.map((doc) => doc.data());

        this.shoes = shoesData;
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    },

    checkFirebase() {
      const apps = getApps();
      if (apps.length) {
        this.firebaseCheckMsg = "Firebase er online!";
      } else {
        this.firebaseCheckMsg = "Firebase er offline!";
      }
    },
  },
  created() {
    this.fetchShoes();
    const auth = getAuth();
    if (auth.currentUser) {
      this.userName = auth.currentUser.email || "User";
    }
    setInterval(this.nextShoe, 5000);
  },
};
</script>
