<template>
  <div>
    <h1>KONTO SIDE</h1>
    <div v-if="user">
      <p>Your email: {{ user.email }}</p>
      <button @click="handleLogout">Log Ud</button>
      <button @click="openModal" class="add-btn">Tilføj Sko</button>
      <AddShoeModal
        :isOpen="isModalOpen"
        @close="closeModal"
        @added="shoeAdded"
      ></AddShoeModal>
      <button v-if="role === 'admin'" @click="openAdminPanel">
        Admin Panel
      </button>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import router from "@/router";
import AddShoeModal from "@/components/AddShoeModal.vue";

export default {
  components: {
    AddShoeModal,
  },
  data() {
    return {
      isModalOpen: false,
      user: null,
      role: null,
    };
  },
  created() {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        this.user = currentUser;

        // Fetch role from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          this.role = userDocSnap.data().role;
        }
      } else {
        if (router.currentRoute.path !== "/login") {
          router.push("/login");
        }
      }
    });
  },
  methods: {
    async handleLogout() {
      try {
        const auth = getAuth();
        await signOut(auth);
        this.user = null;
        this.$toast.success("Loggede ud.");
      } catch (error) {
        console.error("Kunne ikke logge ud:", error);
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    shoeAdded() {
      this.isModalOpen = false;
    },
  },
};
</script>
