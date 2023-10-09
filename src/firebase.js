import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importing Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAcWjhwyWbVuNAU62obFsko2pXEvdoIiqo",
  authDomain: "noahnielsen.dk",
  projectId: "my-project-93058-1688072688174",
  storageBucket: "my-project-93058-1688072688174.appspot.com",
  messagingSenderId: "951726509664",
  appId: "1:951726509664:web:46395643a69d50fe2b7d05",
  measurementId: "G-5RF7WRM47R",
};

const app = initializeApp(firebaseConfig);

// If you want to use Firebase Authentication, export the auth instance
export const auth = getAuth(app);

// Initialize Firestore and export
export const db = getFirestore(app);
