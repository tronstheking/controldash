/**
 * MIGRATION SCRIPT: LocalStorage to Firebase
 * 
 * INSTRUCCIONES:
 * 1. Asegúrate de tener Firebase configurado correctamente en firebase-config.js
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega esta función en la consola
 * 4. Ejecuta: migrateToFirebase()
 * 5. Espera a que complete la migración
 * 
 * ADVERTENCIA: Este script solo debe ejecutarse UNA VEZ para migrar datos existentes
 */

async function migrateToFirebase() {
    console.log("🚀 Iniciando migración de datos a Firebase...");

    if (!firebase.auth().currentUser) {
        console.error("❌ Debes estar autenticado para migrar datos. Primero inicia sesión.");
        return;
    }

    try {
        const db = firebase.firestore();
        let totalMigrated = 0;

        // 1. MIGRAR ESTUDIANTES
        console.log("\n📚 Migrando estudiantes...");
        const studentsData = localStorage.getItem('design_students');
        if (studentsData) {
            const students = JSON.parse(studentsData);
            const batch = db.batch();

            students.forEach(student => {
                const studentRef = db.collection('students').doc(student.id || db.collection('students').doc().id);
                batch.set(studentRef, {
                    ...student,
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                totalMigrated++;
            });

            await batch.commit();
            console.log(`✅ Migrados ${students.length} estudiantes`);
        }

        // 2. MIGRAR PENSUM CONTENT
        console.log("\n📖 Migrando contenido del pensum...");
        const pensumData = localStorage.getItem('design_pensum_content');
        if (pensumData) {
            const pensum = JSON.parse(pensumData);
            const batch = db.batch();

            Object.entries(pensum).forEach(([moduleId, content]) => {
                const moduleRef = db.collection('pensum').doc(moduleId);
                batch.set(moduleRef, {
                    content: content,
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                totalMigrated++;
            });

            await batch.commit();
            console.log(`✅ Migrados ${Object.keys(pensum).length} módulos del pensum`);
        }

        // 3. MIGRAR ATTENDANCE RECORDS
        console.log("\n✅ Migrando registros de asistencia...");
        const attendanceData = localStorage.getItem('attendanceRecords');
        if (attendanceData) {
            const records = JSON.parse(attendanceData);
            const batch = db.batch();

            Object.entries(records).forEach(([key, record]) => {
                const recordRef = db.collection('attendance').doc();
                batch.set(recordRef, {
                    ...record,
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                totalMigrated++;
            });

            await batch.commit();
            console.log(`✅ Migrados ${Object.keys(records).length} registros de asistencia`);
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

        await db.collection('settings').doc('academy').set({
            ...settingsData,
            migratedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Configuración migrada`);
        totalMigrated++;

        // 5. MIGRAR PAYMENTS (si existen)
        console.log("\n💰 Migrando pagos...");
        const paymentsData = localStorage.getItem('payments');
        if (paymentsData) {
            const payments = JSON.parse(paymentsData);
            const batch = db.batch();

            payments.forEach(payment => {
                const paymentRef = db.collection('payments').doc();
                batch.set(paymentRef, {
                    ...payment,
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                totalMigrated++;
            });

            await batch.commit();
            console.log(`✅ Migrados ${payments.length} pagos`);
        }

        console.log("\n\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE!");
        console.log(`📊 Total de documentos migrados: ${totalMigrated}`);
        console.log("\n⚠️ RECOMENDACIÓN: Haz un backup de tu localStorage antes de continuar:");
        console.log("Ejecuta: backupLocalStorage()");

    } catch (error) {
        console.error("❌ Error durante la migración:", error);
        console.error("Detalles:", error.message);
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

console.log("📝 Script de migración cargado.");
console.log("Para migrar datos, ejecuta: migrateToFirebase()");
console.log("Para hacer backup, ejecuta: backupLocalStorage()");
