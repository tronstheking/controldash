/**
 * Database Service
 * Maneja todas las operaciones con Firestore
 */

const DBService = {
    /**
     * STUDENTS - Operaciones con estudiantes
     */
    async getStudents(department = null) {
        try {
            let query = firebase.firestore().collection('students');

            if (department) {
                query = query.where('department', '==', department);
            }

            const snapshot = await query.get();
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
            const studentId = studentData.id || firebase.firestore().collection('students').doc().id;

            await firebase.firestore().collection('students').doc(studentId).set({
                ...studentData,
                id: studentId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return { success: true, id: studentId };
        } catch (error) {
            console.error('Error guardando estudiante:', error);
            return { success: false, error: error.message };
        }
    },

    async deleteStudent(studentId) {
        try {
            await firebase.firestore().collection('students').doc(studentId).delete();
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
            let query = firebase.firestore().collection('attendance');

            if (filters.studentId) {
                query = query.where('studentId', '==', filters.studentId);
            }

            if (filters.startDate) {
                query = query.where('date', '>=', filters.startDate);
            }

            if (filters.endDate) {
                query = query.where('date', '<=', filters.endDate);
            }

            const snapshot = await query.get();
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
            const recordId = recordData.id || firebase.firestore().collection('attendance').doc().id;

            await firebase.firestore().collection('attendance').doc(recordId).set({
                ...recordData,
                id: recordId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
            let query = firebase.firestore().collection('pensum');

            if (department) {
                query = query.where('department', '==', department);
            }

            const snapshot = await query.get();
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
            await firebase.firestore().collection('pensum').doc(moduleId).set({
                ...moduleData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return { success: true };
        } catch (error) {
            console.error('Error guardando módulo:', error);
            return { success: false, error: error.message };
        }
    },

    async deletePensumModule(moduleId) {
        try {
            await firebase.firestore().collection('pensum').doc(moduleId).delete();
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
            const doc = await firebase.firestore().collection('settings').doc('academy').get();

            if (doc.exists) {
                return doc.data();
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
            await firebase.firestore().collection('settings').doc('academy').set({
                ...settingsData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
            const doc = await firebase.firestore().collection('students').doc(studentId).get();

            if (doc.exists) {
                return doc.data().deliverables || [];
            }

            return [];
        } catch (error) {
            console.error('Error obteniendo deliverables:', error);
            return [];
        }
    },

    async saveDeliverables(studentId, deliverables) {
        try {
            await firebase.firestore().collection('students').doc(studentId).update({
                deliverables: deliverables,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
            const snapshot = await firebase.firestore().collection('payments').get();
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
            const paymentId = paymentData.id || firebase.firestore().collection('payments').doc().id;

            await firebase.firestore().collection('payments').doc(paymentId).set({
                ...paymentData,
                id: paymentId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
        let query = firebase.firestore().collection('students');

        if (department) {
            query = query.where('department', '==', department);
        }

        return query.onSnapshot(snapshot => {
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
        let query = firebase.firestore().collection('pensum');

        if (department) {
            query = query.where('department', '==', department);
        }

        return query.onSnapshot(snapshot => {
            const modules = {};
            snapshot.forEach(doc => {
                modules[doc.id] = doc.data();
            });
            callback(modules);
        });
    }
};

// Exportar para uso global
window.DBService = DBService;
