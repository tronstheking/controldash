/**
 * FIREBASE SETUP SCRIPT
 * 
 * Este script crea los usuarios iniciales en Firebase Authentication y Firestore.
 * Solo debe ejecutarse UNA VEZ durante la configuración inicial.
 * 
 * INSTRUCCIONES:
 * 1. Configura Firebase en firebase-config.js con tus credenciales
 * 2. Abre este archivo en el navegador incluyéndolo en una página HTML
 * 3. Abre la consola del navegador (F12)
 * 4. Ejecuta: setupInitialUsers()
 */

async function setupInitialUsers() {
    console.log("🚀 Iniciando configuración de usuarios...");

    const users = [
        {
            email: 'admin@ctd.com',
            password: '1234',
            userData: {
                id: 'admin',
                name: 'Dirección',
                instructor: 'Director Administrativo',
                specialties: [],
                role: 'admin'
            }
        },
        {
            email: 'diseno@ctd.com',
            password: '1234',
            userData: {
                id: 'design',
                name: 'Diseño Gráfico',
                instructor: 'Javier Design',
                specialties: ['Diseño Gráfico', 'Diseño para Redes Sociales'],
                role: 'instructor'
            }
        },
        {
            email: 'multimedia@ctd.com',
            password: '1234',
            userData: {
                id: 'multimedia',
                name: 'Multimedia',
                instructor: 'Carlos Multimedia',
                specialties: ['Diseño Web', 'Edición de Video'],
                role: 'instructor'
            }
        },
        {
            email: 'ia@ctd.com',
            password: '1234',
            userData: {
                id: 'ai',
                name: 'Inteligencia Artificial',
                instructor: 'Instructor IA',
                specialties: ['Ingeniería de Prompts', 'Creación de Assets con IA'],
                role: 'instructor'
            }
        },
        {
            email: 'marketing@ctd.com',
            password: '1234',
            userData: {
                id: 'marketing',
                name: 'Marketing Digital',
                instructor: 'Instructor Marketing',
                specialties: ['Marketing 5.0'],
                role: 'instructor'
            }
        },
        {
            email: 'excel@ctd.com',
            password: '1234',
            userData: {
                id: 'excel',
                name: 'Excel Empresarial',
                instructor: 'Instructor Excel',
                specialties: ['Excel Básico', 'Excel Intermedio', 'Excel Avanzado'],
                role: 'instructor'
            }
        }
    ];

    console.log("\n⚠️ IMPORTANTE: Este script requiere privilegios de administrador.");
    console.log("Debes ejecutarlo usando Firebase Admin SDK desde el backend,");
    console.log("o manualmente crear cada usuario en Firebase Console > Authentication.\n");

    console.log("📋 USUARIOS A CREAR:\n");

    users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Nombre: ${user.userData.name}`);
        console.log(`   Rol: ${user.userData.role}`);
        console.log('');
    });

    console.log("\n📝 PASOS MANUALES EN FIREBASE CONSOLE:");
    console.log("1. Ve a https://console.firebase.google.com");
    console.log("2. Selecciona tu proyecto");
    console.log("3. Ve a Authentication > Users > Add user");
    console.log("4. Para cada usuario, ingresa el email y password");
    console.log("5. Después de crear en Authentication, copia el UID");
    console.log("6. Ve a Firestore Database > users collection");
    console.log("7. Crea un documento con el UID como ID");
    console.log("8. Agrega los campos correspondientes a cada usuario");

    console.log("\n💡 ALTERNATIVA AUTOMATIZADA (Node.js):");
    console.log("Si tienes Node.js configurado con Firebase Admin SDK:");
    console.log("Ejecuta: await createUsersWithAdmin()");

    return users;
}

/**
 * Crear documentos en Firestore para usuarios ya existentes en Authentication
 * Ejecuta esto después de haber creado los usuarios manualmente
 */
async function createUserDocuments() {
    console.log("📝 Creando documentos de usuario en Firestore...");

    const db = firebase.firestore();

    // Obtener el usuario actual autenticado
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
        console.error("❌ Debes estar autenticado para ejecutar este script.");
        console.log("Por favor inicia sesión primero.");
        return;
    }

    const usersData = [
        {
            uid: 'REEMPLAZA_CON_UID_ADMIN',
            data: {
                id: 'admin',
                name: 'Dirección',
                instructor: 'Director Administrativo',
                specialties: [],
                role: 'admin',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        },
        {
            uid: 'REEMPLAZA_CON_UID_DISENO',
            data: {
                id: 'design',
                name: 'Diseño Gráfico',
                instructor: 'Javier Design',
                specialties: ['Diseño Gráfico', 'Diseño para Redes Sociales'],
                role: 'instructor',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        },
        // ... Agrega los demás usuarios con sus UIDs
    ];

    try {
        for (const user of usersData) {
            if (user.uid.startsWith('REEMPLAZA')) {
                console.warn(`⚠️ Saltando usuario con UID placeholder: ${user.data.name}`);
                continue;
            }

            await db.collection('users').doc(user.uid).set(user.data);
            console.log(`✅ Creado documento para: ${user.data.name}`);
        }

        console.log("\n🎉 Documentos de usuario creados exitosamente!");
    } catch (error) {
        console.error("❌ Error creando documentos:", error);
    }
}

// Exportar funciones
window.setupInitialUsers = setupInitialUsers;
window.createUserDocuments = createUserDocuments;

console.log("📝 Script de setup cargado.");
console.log("Para ver la lista de usuarios a crear, ejecuta: setupInitialUsers()");
console.log("Para crear documentos en Firestore (después de crear en Auth): createUserDocuments()");
