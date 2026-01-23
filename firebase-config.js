/**
 * Firebase Configuration
 * Using Firebase v9+ Modular SDK
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Tu configuración de Firebase
// TODO: Reemplaza esto con tus credenciales de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCURPQ6vRI17oDpHSErQO1I38xcsulhUSc",
    authDomain: "control-logic.firebaseapp.com",
    projectId: "control-logic",
    storageBucket: "control-logic.firebasestorage.app",
    messagingSenderId: "183594291673",
    appId: "1:183594291673:web:4f8aad89fb79d1eab949c8"
};

// Initialize Firebase
let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    console.log("✅ Firebase (Modular) inicializado correctamente");
} catch (error) {
    console.error("❌ Error inicializando Firebase:", error);
}

// Export for use in other modules
export { app, auth, db };

// Attach to window for legacy support and debugging
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;

// Legacy initialization check helper (kept for compatibility with existing checks)
window.initializeFirebase = () => {
    return !!app;
};

