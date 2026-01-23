/**
 * Firebase Configuration
 * 
 * IMPORTANTE: Debes reemplazar los valores de firebaseConfig con tus credenciales reales de Firebase.
 * 
 * Para obtener estas credenciales:
 * 1. Ve a https://console.firebase.google.com
 * 2. Crea un nuevo proyecto (o selecciona uno existente)
 * 3. Ve a Project Settings (⚙️) > General tab
 * 4. En "Your apps", selecciona Web app (</>) si no existe, créala
 * 5. Copia el objeto firebaseConfig y pégalo aquí
 */

// TODO: Reemplaza esto con tus credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCURPQ6vRI17oDpHSErQO1I38xcsulhUSc",
  authDomain: "control-logic.firebaseapp.com",
  projectId: "control-logic",
  storageBucket: "control-logic.firebasestorage.app",
  messagingSenderId: "183594291673",
  appId: "1:183594291673:web:4f8aad89fb79d1eab949c8"
};

// Inicializar Firebase
let app, auth, db;

// Función para inicializar Firebase
function initializeFirebase() {
    try {
        // Verificar que las credenciales estén configuradas
        if (firebaseConfig.apiKey === "AIzaSyCURPQ6vRI17oDpHSErQO1I38xcsulhUSc") {
            console.warn("⚠️ Firebase no está configurado. Por favor actualiza las credenciales en firebase-config.js");
            return false;
        }

        // Inicializar Firebase usando el SDK modular v9+
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        console.log("✅ Firebase inicializado correctamente");
        return true;
    } catch (error) {
        console.error("❌ Error inicializando Firebase:", error);
        return false;
    }
}

// Exportar para uso global
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
window.initializeFirebase = initializeFirebase;
