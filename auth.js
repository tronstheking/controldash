/**
 * Authentication Module
 * Handles all authentication operations with Firebase (Modular SDK)
 */

import { auth, db } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const AuthService = {
    /**
     * Iniciar sesión con email y contraseña
     */
    async login(email, password) {
        try {
            // Normalization: Handle "ñ" -> "n" (e.g., diseño@ctd.com -> diseno@ctd.com)
            // This allows the user to type "diseño" but authenticates against the "diseno" account in Firebase
            const normalizedEmail = email.toLowerCase().replace(/ñ/g, 'n');

            const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            const user = userCredential.user;

            // Obtener datos adicionales del usuario desde Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                let userData = userDoc.data();

                // FORCE LEGACY MAPPING: Ensure ID matches the dashboard expected ID based on email
                const legacyMapping = {
                    'diseno@ctd.com': { id: 'design', name: 'Diseño Gráfico', role: 'instructor' },
                    'multimedia@ctd.com': { id: 'multimedia', name: 'Multimedia', role: 'instructor' },
                    'admin@ctd.com': { id: 'admin', name: 'Dirección', role: 'admin' },
                    'ia@ctd.com': { id: 'ai', name: 'Inteligencia Artificial', role: 'instructor' },
                    'marketing@ctd.com': { id: 'marketing', name: 'Marketing Digital', role: 'instructor' },
                    'excel@ctd.com': { id: 'excel', name: 'Excel Empresarial', role: 'instructor' }
                };

                const mappedData = legacyMapping[email.toLowerCase()];
                if (mappedData) {
                    // Merge mapped data but preserve existing firestore data if needed, or overwrite?
                    // Overwrite critical fields to ensure system works
                    userData = { ...userData, ...mappedData };
                }

                // Guardar datos del usuario en memoria y localStorage (para compatibilidad)
                const currentUser = {
                    uid: user.uid,
                    email: user.email,
                    id: userData.id || user.uid,
                    name: userData.name,
                    instructor: userData.instructor,
                    specialties: userData.specialties || [],
                    role: userData.role || 'instructor'
                };

                window.currentUser = currentUser;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                return { success: true, user: currentUser };
            } else {
                throw new Error('Usuario no encontrado en la base de datos');
            }
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.code)
            };
        }
    },

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            await signOut(auth);
            localStorage.removeItem('currentUser');
            window.currentUser = null;
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error en logout:', error);
        }
    },

    /**
     * Verificar si el usuario está autenticado
     */
    async checkAuth() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // Usuario autenticado, cargar datos
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
                        const userDoc = await getDoc(userDocRef);

                        if (userDoc.exists()) {
                            let userData = userDoc.data();

                            // RE-APPLY LEGACY MAPPING ON RELOAD
                            const legacyMapping = {
                                'diseno@ctd.com': { id: 'design', name: 'Diseño Gráfico', role: 'instructor' },
                                'multimedia@ctd.com': { id: 'multimedia', name: 'Multimedia', role: 'instructor' },
                                'admin@ctd.com': { id: 'admin', name: 'Dirección', role: 'admin' },
                                'ia@ctd.com': { id: 'ai', name: 'Inteligencia Artificial', role: 'instructor' },
                                'marketing@ctd.com': { id: 'marketing', name: 'Marketing Digital', role: 'instructor' },
                                'excel@ctd.com': { id: 'excel', name: 'Excel Empresarial', role: 'instructor' }
                            };

                            const mappedData = legacyMapping[user.email.toLowerCase()];
                            if (mappedData) {
                                userData = { ...userData, ...mappedData };
                            }

                            const currentUser = {
                                uid: user.uid,
                                email: user.email,
                                id: userData.id || user.uid,
                                name: userData.name,
                                instructor: userData.instructor,
                                specialties: userData.specialties || [],
                                role: userData.role || 'instructor'
                            };
                            window.currentUser = currentUser;
                            localStorage.setItem('currentUser', JSON.stringify(currentUser));
                            resolve(currentUser);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        console.error('Error cargando datos del usuario:', error);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        });
    },

    /**
     * Proteger páginas que requieren autenticación
     */
    async requireAuth() {
        const user = await this.checkAuth();
        if (!user) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    /**
     * Crear nuevo usuario (solo para admin)
     */
    async createUser(email, password, userData) {
        try {
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                id: userData.id,
                name: userData.name,
                instructor: userData.instructor,
                specialties: userData.specialties || [],
                role: userData.role || 'instructor',
                createdAt: serverTimestamp()
            });

            return { success: true, uid: user.uid };
        } catch (error) {
            console.error('Error creando usuario:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.code)
            };
        }
    },

    /**
     * Traducir códigos de error de Firebase
     */
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'Usuario no encontrado',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/email-already-in-use': 'El correo ya está registrado',
            'auth/weak-password': 'La contraseña es muy débil',
            'auth/invalid-email': 'Correo electrónico inválido',
            'auth/user-disabled': 'Usuario deshabilitado',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        };

        return errorMessages[errorCode] || 'Error de autenticación. Intenta nuevamente.';
    }
};

// Exportar para uso global y modulo
window.AuthService = AuthService;
export default AuthService;

