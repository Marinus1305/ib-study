import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA1veBarnntTg_FN9-hi0o1iUpaW227hBw",
    authDomain: "ib-study-f09f6.firebaseapp.com",
    projectId: "ib-study-f09f6",
    storageBucket: "ib-study-f09f6.firebasestorage.app",
    messagingSenderId: "170171466402",
    appId: "1:170171466402:web:18a33ae562d86f3956cdfb"
};

const auth = getAuth(initializeApp(firebaseConfig));
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const authScreen = document.getElementById("authScreen");
const appShell = document.getElementById("appShell");
const signInButton = document.getElementById("googleSignIn");
const signInLabel = signInButton.querySelector("span");
const signOutButton = document.getElementById("signOutButton");
const authStatus = document.getElementById("authStatus");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");

function setBusy(busy) {
    signInButton.disabled = busy;
    signInLabel.textContent = busy ? "Signing in…" : "Continue with Google";
}

signInButton.addEventListener("click", async () => {
    authStatus.textContent = "";
    setBusy(true);
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        if (error.code === "auth/unauthorized-domain") {
            authStatus.textContent = "Add this website to Firebase Authentication → Authorized domains.";
        } else if (error.code !== "auth/popup-closed-by-user") {
            authStatus.textContent = "Google sign-in could not be completed. Please try again.";
            console.error(error);
        }
    } finally {
        setBusy(false);
    }
});

signOutButton.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, user => {
    authScreen.hidden = Boolean(user);
    appShell.hidden = !user;
    if (user) {
        userName.textContent = user.displayName || user.email || "Student";
        userPhoto.src = user.photoURL || "";
        userPhoto.hidden = !user.photoURL;
    } else {
        userName.textContent = "";
        userPhoto.removeAttribute("src");
    }
});
