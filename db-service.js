/**
 * Database Service
 * Handles all Firestore operations (Modular SDK)
 */

import { db } from './firebase-config.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const DBService = {
    /**
     * STUDENTS - Operaciones con estudiantes
     */
    async getStudents(department = null) {
        try {
            let q = collection(db, 'students');

            if (department) {
                q = query(q, where('department', '==', department));
            }

            const snapshot = await getDocs(q);
            const students = [];

            snapshot.forEach(doc => {
                students.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return students;
        } catch (error) {
            console.error('Error obteniendo estudiantes:', error);
            return [];
        }
    },

    async saveStudent(studentData) {
        try {
            const studentId = studentData.id || doc(collection(db, 'students')).id;
            const studentRef = doc(db, 'students', studentId);

            await setDoc(studentRef, {
                ...studentData,
                id: studentId,
                updatedAt: serverTimestamp()
            }, { merge: true });

            return { success: true, id: studentId };
        } catch (error) {
            console.error('Error guardando estudiante:', error);
            return { success: false, error: error.message };
        }
    },

    async deleteStudent(studentId) {
        try {
            await deleteDoc(doc(db, 'students', studentId));
            return { success: true };
        } catch (error) {
            console.error('Error eliminando estudiante:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * ATTENDANCE - Operaciones con asistencia
     */
    async getAttendance(filters = {}) {
        try {
            let q = collection(db, 'attendance');

            if (filters.studentId) {
                q = query(q, where('studentId', '==', filters.studentId));
            }

            if (filters.startDate) {
                q = query(q, where('date', '>=', filters.startDate));
            }

            if (filters.endDate) {
                q = query(q, where('date', '<=', filters.endDate));
            }

            const snapshot = await getDocs(q);
            const records = [];

            snapshot.forEach(doc => {
                records.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return records;
        } catch (error) {
            console.error('Error obteniendo asistencia:', error);
            return [];
        }
    },

    async saveAttendance(recordData) {
        try {
            const recordId = recordData.id || doc(collection(db, 'attendance')).id;
            const recordRef = doc(db, 'attendance', recordId);

            await setDoc(recordRef, {
                ...recordData,
                id: recordId,
                updatedAt: serverTimestamp()
            }, { merge: true });

            return { success: true, id: recordId };
        } catch (error) {
            console.error('Error guardando asistencia:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * PENSUM - Operaciones con contenido del pensum
     */
    async getPensumContent(department = null) {
        try {
            let q = collection(db, 'pensum');

            if (department) {
                q = query(q, where('department', '==', department));
            }

            const snapshot = await getDocs(q);
            const modules = {};

            snapshot.forEach(doc => {
                modules[doc.id] = doc.data();
            });

            return modules;
        } catch (error) {
            console.error('Error obteniendo pensum:', error);
            return {};
        }
    },

    async savePensumModule(moduleId, moduleData) {
        try {
            await setDoc(doc(db, 'pensum', moduleId), {
                ...moduleData,
                updatedAt: serverTimestamp()
            }, { merge: true });

            return { success: true };
        } catch (error) {
            console.error('Error guardando módulo:', error);
            return { success: false, error: error.message };
        }
    },

    async deletePensumModule(moduleId) {
        try {
            await deleteDoc(doc(db, 'pensum', moduleId));
            return { success: true };
        } catch (error) {
            console.error('Error eliminando módulo:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * SETTINGS - Operaciones con configuración
     */
    async getSettings() {
        try {
            const docRef = doc(db, 'settings', 'academy');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            }

            // Valores por defecto si no existen
            return {
                name: 'Academia CTD',
                maxCapacity: 10,
                riskPercent: 75,
                riskAbsences: 2,
                avatar: 'https://ui-avatars.com/api/?name=Academia+CTD&background=random&color=fff&bold=true&size=128'
            };
        } catch (error) {
            console.error('Error obteniendo configuración:', error);
            return {};
        }
    },

    async saveSettings(settingsData) {
        try {
            await setDoc(doc(db, 'settings', 'academy'), {
                ...settingsData,
                updatedAt: serverTimestamp()
            }, { merge: true });

            return { success: true };
        } catch (error) {
            console.error('Error guardando configuración:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * DELIVERABLES - Operaciones con entregables
     */
    async getDeliverables(studentId) {
        try {
            const docRef = doc(db, 'students', studentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().deliverables || [];
            }

            return [];
        } catch (error) {
            console.error('Error obteniendo deliverables:', error);
            return [];
        }
    },

    async saveDeliverables(studentId, deliverables) {
        try {
            const docRef = doc(db, 'students', studentId);
            await updateDoc(docRef, {
                deliverables: deliverables,
                updatedAt: serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error guardando deliverables:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * PAYMENTS - Operaciones con pagos
     */
    async getPayments() {
        try {
            const snapshot = await getDocs(collection(db, 'payments'));
            const payments = [];

            snapshot.forEach(doc => {
                payments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return payments;
        } catch (error) {
            console.error('Error obteniendo pagos:', error);
            return [];
        }
    },

    async savePayment(paymentData) {
        try {
            const paymentId = paymentData.id || doc(collection(db, 'payments')).id;
            const paymentRef = doc(db, 'payments', paymentId);

            await setDoc(paymentRef, {
                ...paymentData,
                id: paymentId,
                updatedAt: serverTimestamp()
            }, { merge: true });

            return { success: true, id: paymentId };
        } catch (error) {
            console.error('Error guardando pago:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * REAL-TIME LISTENERS
     */
    listenToStudents(department, callback) {
        let q = collection(db, 'students');

        if (department) {
            q = query(q, where('department', '==', department));
        }

        return onSnapshot(q, (snapshot) => {
            const students = [];
            snapshot.forEach(doc => {
                students.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(students);
        });
    },

    listenToPensum(department, callback) {
        let q = collection(db, 'pensum');

        if (department) {
            q = query(q, where('department', '==', department));
        }

        return onSnapshot(q, (snapshot) => {
            const modules = {};
            snapshot.forEach(doc => {
                modules[doc.id] = doc.data();
            });
            callback(modules);
        });
    },

    /**
     * Listen to Settings changes in real-time
     */
    listenToSettings(callback) {
        const docRef = doc(db, 'settings', 'academy');
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data());
            } else {
                // Return defaults if no settings exist
                callback({
                    name: 'Academia CTD',
                    maxCapacity: 10,
                    riskPercent: 75,
                    riskAbsences: 2,
                    avatar: 'https://ui-avatars.com/api/?name=Academia+CTD&background=random&color=fff&bold=true&size=128'
                });
            }
        });
    },

    /**
     * Listen to Departments changes in real-time
     */
    listenToDepartments(callback) {
        return onSnapshot(collection(db, 'departments'), (snapshot) => {
            const departments = [];
            snapshot.forEach(doc => {
                departments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(departments);
        });
    },

    /**
     * DEPARTMENTS - Save all departments
     */
    async saveDepartments(departments) {
        try {
            // Save each department as a separate document
            for (const dept of departments) {
                const deptRef = doc(db, 'departments', dept.id);
                await setDoc(deptRef, {
                    ...dept,
                    updatedAt: serverTimestamp()
                }, { merge: true });
            }
            return { success: true };
        } catch (error) {
            console.error('Error guardando departamentos:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * PENSUM - Save entire pensum content
     */
    async savePensumContent(pensumData) {
        try {
            // Save as a single document for simplicity
            const pensumRef = doc(db, 'pensum_content', 'all');
            await setDoc(pensumRef, {
                modules: pensumData,
                updatedAt: serverTimestamp()
            }, { merge: true });
            return { success: true };
        } catch (error) {
            console.error('Error guardando pensum:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * PENSUM - Get entire pensum content
     */
    /**
     * PENSUM - Get entire pensum content
     */
    async getPensumContent() {
        try {
            const docRef = doc(db, 'pensum_content', 'all');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Support both nested 'modules' and root-level data
                if (data.modules) return data.modules;

                // If no modules key, return data directly (excluding metadata)
                const cleanData = { ...data };
                delete cleanData.updatedAt;
                return cleanData;
            }
            return null; // Will use defaults
        } catch (error) {
            console.error('Error obteniendo pensum:', error);
            return null;
        }
    },

    /**
     * Listen to Pensum Content changes in real-time
     */
    listenToPensumContent(callback) {
        const docRef = doc(db, 'pensum_content', 'all');
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                console.log("🔥 Pensum Snapshot received!");
                const data = docSnap.data();

                // Support both nested 'modules' and root-level data
                if (data.modules) {
                    console.log("📦 Parsed Nested 'modules' field");
                    callback(data.modules);
                } else {
                    console.log("📂 Parsed Root-level fields");
                    // If no modules key, return data directly (excluding metadata)
                    const cleanData = { ...data };
                    delete cleanData.updatedAt;
                    callback(cleanData);
                }
            } else {
                console.warn("⚠️ Pensum doc does not exist, using defaults.");
                callback(null); // Will trigger defaults
            }
        });
    }
};

// Exportar para uso global
window.DBService = DBService;
// Helper for recovery
window.DBServiceModule = DBService;

// Dispatch event to notify listeners that DB is ready
window.dispatchEvent(new Event('DBServiceReady'));
console.log("✅ DBService initialized and event dispatched");

export default DBService;

