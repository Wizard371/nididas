<template>
  <div class="wrapper">
    <div v-if="message" :class="['notification', type]">
      {{ message }}
    </div>
    <div
      class="container"
      :class="{ 'right-panel-active': isRightPanelActive }"
      id="container"
    >
      <div class="form-container sign-up-container">
        <form @submit.prevent="createUser">
          <h1>Opret Bruger</h1>
          <div class="social-container">
            <a href="#" class="social" @click="loginWithFacebook"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" class="social" @click="loginWithGoogle"
              ><i class="fab fa-google-plus-g"></i
            ></a>
          </div>
          <span>eller brug din email til at oprette en ny bruger</span>
          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Kodeord" />
          <input
            type="password"
            v-model="repeatPassword"
            placeholder="Gentag Kodeord"
          />
          <p v-if="error">{{ error }}</p>
          <button type="submit">Opret Bruger</button>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <form action="#">
          <h1>Log Ind</h1>
          <div class="social-container">
            <a href="#" class="social" @click="loginWithFacebook"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" class="social" @click="loginWithGoogle"
              ><i class="fab fa-google-plus-g"></i
            ></a>
          </div>
          <span>eller brug din email</span>
          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Password" />
          <a href="#" id="nederenGlemtDitPassword">Glemt dit password?</a>
          <button @click="loginWithEmail">Log Ind</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Velkommen tilbage!</h1>
            <p>For at få mest ud af din købsoplevelse, log ind på din konto.</p>
            <button class="ghost" @click="toggleSignIn" id="signIn">
              Log Ind
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hej</h1>
            <p>Opret en bruger for at få mest ud af dit køb ved os!</p>
            <button class="ghost" @click="toggleSignUp" id="signUp">
              Opret Bruger
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import router from "@/router";

export default {
  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      error: "",
      isRightPanelActive: false,
      message: "",
      type: "success",
    };
  },
  methods: {
    startEmailVerificationCheck(user) {
      const checkInterval = 2000; // 2 seconds

      const intervalId = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            this.$toast.success("Konto oprettelse færdig!");
            clearInterval(intervalId); // Stop checking
            router.push("/konto");
          }
        });
      }, checkInterval);
    },
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          // Save user data to Firestore
          const db = getFirestore();
          const userRef = doc(db, "users", result.user.uid);
          await setDoc(userRef, {
            email: result.user.email,
            uuid: result.user.uid,
            role: "user",
            timestamp: new Date(),
          });

          router.push("/konto");
          console.log("Loggede ind med Google:", result.user);
          this.$toast.success("Loggede ind med Google!");
        }
      } catch (error) {
        console.error("Kunne ikke logge ind med Google:", error.message);
        let errorMessage;
        switch (error.code) {
          case "auth/popup-closed-by-user":
            errorMessage = "Login vinduet blev lukket. Prøv igen.";
            break;
          default:
            errorMessage =
              error.message +
              "Bed en administrator om at tilføje denne fejl kode.";
        }
        this.$toast.error(errorMessage);
      }
    },

    async loginWithFacebook() {
      const provider = new FacebookAuthProvider();
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          // Save user data to Firestore
          const db = getFirestore();
          const userRef = doc(db, "users", result.user.uid);
          await setDoc(userRef, {
            email: result.user.email,
            uuid: result.user.uid,
            role: "user",
            timestamp: new Date(),
          });

          router.push("/konto");
          console.log("Loggede ind med facebook:", result.user);
          this.$toast.success("Loggede ind med facebook!");
        }
      } catch (error) {
        console.error("Kunne ikke logge ind med Facebook:", error.message);
        let errorMessage;
        switch (error.code) {
          case "auth/popup-closed-by-user":
            errorMessage = "Login vinduet blev lukket. Prøv igen.";
            break;
          default:
            errorMessage =
              error.message +
              "Bed en administrator om at tilføje denne fejl kode.";
        }
        this.$toast.error(errorMessage);
      }
    },

    loginWithEmail() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          router.push("/konto");
          console.log("Loggede ind:", user);
        })
        .catch((error) => {
          console.error("Fejl ved login:", error.message);

          let errorMessage;
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage = "Ugyldig e-mailadresse.";
              break;
            case "auth/user-disabled":
              errorMessage = "Brugerkontoen er deaktiveret.";
              break;
            case "auth/user-not-found":
              errorMessage = "Ingen konto matcher denne e-mail.";
              break;
            case "auth/wrong-password":
              errorMessage = "Forkert kodeord. Prøv igen.";
              break;
            case "auth/invalid-login-credentials":
              errorMessage = "Ugyldig e-mailadresse eller kodeord.";
              break;
            case "auth/too-many-requests":
              errorMessage = "For mange forsøg. Prøv igen senere.";
              break;
            default:
              errorMessage = "En fejl opstod ved login. Prøv igen.";
          }

          this.$toast.error(errorMessage);
        });
    },

    toggleSignUp() {
      this.isRightPanelActive = true;
    },

    toggleSignIn() {
      this.isRightPanelActive = false;
    },
    createUser() {
      if (this.password !== this.repeatPassword) {
        this.$toast.error("De 2 kodeord er ikke ens!");

        return;
      }

      if (!this.isPasswordStrong(this.password)) {
        this.$toast.error(
          "Kodeord er for svagt. Det skal mindst være 8 karaktere langt, have et stort bogstav, et lille bogstav, et tal og en speciel karakter."
        );

        return;
      }

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // store additional data in firestore
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid); // assuming you have a 'users' collection

          await setDoc(userRef, {
            email: this.email,
            uuid: user.uid,
            role: "user",
            timestamp: new Date(), // this saves the current date and time
          });

          sendEmailVerification(user);
          this.$toast.info("Verifikations mail er sendt!");
          this.startEmailVerificationCheck(user);
        })
        .catch((error) => {
          console.error("Fejl med at logge ind:", error.message);
          let errorMessage;
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage = "Ugyldig e-mailadresse.";
              break;
            case "auth/user-disabled":
              errorMessage = "Brugerkontoen er deaktiveret.";
              break;
            case "auth/user-not-found":
              errorMessage = "Kunne ikke finde e-mail eller brugernavn.";
              break;
            case "auth/wrong-password":
              errorMessage = "Forkert kodeord. Prøv igen.";
              break;
            case "auth/email-already-in-use":
              errorMessage = "E-mailadressen er allerede i brug.";
              break;
            case "auth/operation-not-allowed":
              errorMessage = "Operationen er ikke tilladt.";
              break;
            case "auth/too-many-requests":
              errorMessage = "For mange anmodninger. Prøv igen senere.";
              break;
            case "auth/weak-password":
              errorMessage = "Kodeordet er for svagt.";
              break;
            default:
              errorMessage = "En ukendt fejl opstod. Prøv igen.";
          }

          this.$toast.error(errorMessage);
        });
    },

    isPasswordStrong(password) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");

* {
  box-sizing: border-box;
  color: var(--primary-text-color);
}

.wrapper {
  display: flex;
  width: 100%;
  height: 85vh;
  margin: auto;
  justify-content: center;
  align-items: center;
}

body {
  background: var(--primary-bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Montserrat", sans-serif;
  height: 100vh;
  margin: -20px 0 50px;
}

h1 {
  font-weight: bold;
  margin: 0;
}

h2 {
  text-align: center;
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

button {
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}

form {
  background-color: var(--primary-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: var(--input-bg-color);
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: #ff416c;
  background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
  background: linear-gradient(to right, #ff4b2b, #ff416c);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid var(--primary-text-color);
  color: var(--primary-text-color);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

footer {
  background-color: #222;
  color: #fff;
  font-size: 14px;
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}

footer p {
  margin: 10px 0;
}

footer i {
  color: red;
}

footer a {
  color: #3c97bf;
  text-decoration: none;
}

#nederenGlemtDitPassword {
  color: var(--primary-text-color);
}
</style>
