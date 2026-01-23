/**
 * MIGRATION SCRIPT: LocalStorage to Firebase
 * 
 * INSTRUCCIONES:
 * 1. Agrega este script a tu HTML temporalmente: <script type="module" src="migrate-to-firebase.js"></script>
 * 2. Abre la consola
 * 3. Ejecuta window.migrateToFirebase()
 */

import { db } from './firebase-config.js';
import { writeBatch, doc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

async function migrateToFirebase() {
    console.log("🚀 Iniciando migración de datos a Firebase (Modular SDK)...");

    // Verificar si hay usuario (usando la variable global que expone auth.js)
    if (!window.currentUser && !window.firebaseAuth.currentUser) {
        console.error("❌ Debes estar autenticado para migrar datos. Primero inicia sesión.");
        return;
    }

    try {
        let totalMigrated = 0;
        const batch = writeBatch(db);
        let operationCount = 0;

        const commitBatch = async () => {
            if (operationCount > 0) {
                await batch.commit();
                console.log(`💾 Lote guardado (${operationCount} operaciones)`);
                operationCount = 0;
                // Re-instantiate batch is not needed for the same batch instance? 
                // writeBatch returns a new batch. We need to create a new one after commit.
                // Actually commit() writes it. We need a new batch for next ops.
                // But let's keep it simple: simpler to just use DBService or single writes if batching is complex in a loop with generic logic.
                // But batch is better.
            }
        };

        // 1. MIGRAR ESTUDIANTES
        console.log("\n📚 Migrando estudiantes...");
        const studentsData = localStorage.getItem('design_students');
        if (studentsData) {
            const students = JSON.parse(studentsData);

            for (const student of students) {
                const studentId = student.id || doc(collection(db, 'students')).id;
                const studentRef = doc(db, 'students', studentId);
                batch.set(studentRef, {
                    ...student,
                    id: studentId,
                    migratedAt: serverTimestamp()
                });
                totalMigrated++;
                operationCount++;
            }
        }

        // 2. MIGRAR PENSUM CONTENT
        console.log("\n📖 Migrando contenido del pensum...");
        const pensumData = localStorage.getItem('design_pensum_content');
        if (pensumData) {
            const pensum = JSON.parse(pensumData);

            for (const [moduleId, content] of Object.entries(pensum)) {
                const moduleRef = doc(db, 'pensum', moduleId);
                batch.set(moduleRef, {
                    content: content,
                    migratedAt: serverTimestamp()
                });
                totalMigrated++;
                operationCount++;
            }
        }

        // 3. MIGRAR ATTENDANCE RECORDS
        console.log("\n✅ Migrando registros de asistencia...");
        const attendanceData = localStorage.getItem('attendanceRecords');
        if (attendanceData) {
            const records = JSON.parse(attendanceData);

            for (const record of Object.values(records)) {
                const recordRef = doc(collection(db, 'attendance'));
                batch.set(recordRef, {
                    ...record,
                    migratedAt: serverTimestamp()
                });
                totalMigrated++;
                operationCount++;
            }
        }

        // 4. MIGRAR SETTINGS
        console.log("\n⚙️ Migrando configuración...");
        const settingsData = {
            name: localStorage.getItem('academyName') || 'Academia CTD',
            maxCapacity: parseInt(localStorage.getItem('maxCapacity')) || 10,
            riskPercent: parseInt(localStorage.getItem('riskPercent')) || 75,
            riskAbsences: parseInt(localStorage.getItem('riskAbsences')) || 2,
            avatar: localStorage.getItem('instructorAvatar') || 'https://ui-avatars.com/api/?name=Academia+CTD&background=random&color=fff&bold=true&size=128'
        };

        const settingsRef = doc(db, 'settings', 'academy');
        batch.set(settingsRef, {
            ...settingsData,
            migratedAt: serverTimestamp()
        });
        totalMigrated++;
        operationCount++;

        // 5. MIGRAR PAYMENTS (si existen)
        console.log("\n💰 Migrando pagos...");
        const paymentsData = localStorage.getItem('payments');
        if (paymentsData) {
            const payments = JSON.parse(paymentsData);

            for (const payment of payments) {
                const paymentRef = doc(collection(db, 'payments'));
                batch.set(paymentRef, {
                    ...payment,
                    migratedAt: serverTimestamp()
                });
                totalMigrated++;
                operationCount++;
            }
        }

        // Commit final
        if (operationCount > 0) {
            await batch.commit();
        }

        console.log("\n\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE!");
        console.log(`📊 Total de documentos migrados: ${totalMigrated}`);

    } catch (error) {
        console.error("❌ Error durante la migración:", error);
    }
}

/**
 * Crear un backup del localStorage
 */
function backupLocalStorage() {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backup[key] = localStorage.getItem(key);
    }

    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `localstorage_backup_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    console.log("✅ Backup descargado:", exportFileDefaultName);
}

// Hacer disponibles las funciones globalmente
window.migrateToFirebase = migrateToFirebase;
window.backupLocalStorage = backupLocalStorage;

console.log("📝 Script de migración cargado (Modular).");

