<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <h3>Add a new shoe</h3>
      <label>Name:</label>
      <input v-model="shoe.name" type="text" />

      <label>Description:</label>
      <textarea v-model="shoe.description"></textarea>

      <label>Image URL:</label>
      <input v-model="shoe.image" type="text" />

      <label>Price ($):</label>
      <input
        v-model.number="shoe.price"
        type="number"
        step="0.01"
        placeholder="Enter price"
      />

      <button @click="addShoe">Add Shoe</button>
      <button @click="close">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  props: {
    isOpen: Boolean,
  },
  setup(props, { emit }) {
    const shoe = ref({ name: "", description: "", image: "", price: 0 });

    async function addShoe() {
      try {
        const docRef = await addDoc(collection(db, "shoes"), shoe.value);
        console.log("Document written with ID: ", docRef.id);
        emit("added");
        close();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    function close() {
      emit("close");
    }

    return {
      shoe,
      addShoe,
      close,
    };
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

label,
button {
  margin: 10px;
  color: black;
}

input {
  background-color: white;
  border: 1px solid black;
  padding: 5px 10px;
  color: black;
}

.modal-content {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
  max-width: 100%;
  margin: 10px;
}
</style>
