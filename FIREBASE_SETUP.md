# 🔥 Guía de Configuración de Firebase - Academia CTD

Esta guía te llevará paso a paso a través del proceso de configuración de Firebase para tu dashboard.

## 📋 Requisitos Previos

- Una cuenta de Google
- Acceso a [Firebase Console](https://console.firebase.google.com)
- Tu proyecto del dashboard local

---

## Paso 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com
2. Haz clic en **"Agregar proyecto"** o **"Create a project"**
3. Nombre del proyecto: `academia-ctd` (o el nombre que prefieras)
4. Acepta los términos y condiciones
5. **Google Analytics** (opcional):
   - Puedes habilitarlo o deshabilitarlo según tu preferencia
   - Si lo habilitas, selecciona o crea una cuenta de Analytics
6. Haz clic en **"Crear proyecto"**
7. Espera a que Firebase configure el proyecto (puede tomar 1-2 minutos)
8. Haz clic en **"Continuar"**

---

## Paso 2: Registrar Aplicación Web

1. En la página de overview de tu proyecto, haz clic en el ícono **web** (`</>`)
2. **Nombre de la app**: `Dashboard Academia CTD`
3. **Firebase Hosting**: Déjalo sin marcar (usaremos GitHub Pages)
4. Haz clic en **"Registrar app"**
5. **IMPORTANTE**: Verás un código de configuración similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. **COPIA TODO EL OBJETO `firebaseConfig`** - lo necesitarás en el siguiente paso
7. Haz clic en **"Continuar a la consola"**

---

## Paso 3: Configurar Firebase Authentication

1. En el menú lateral izquierdo, haz clic en **"Authentication"**
2. Haz clic en el botón **"Comenzar"** o **"Get started"**
3. En la pestaña **"Sign-in method"**:
   - Haz clic en **"Correo electrónico/contraseña"** (Email/Password)
   - **Habilita** el método (toggle en ON)
   - **NO** habilites "Email link (passwordless sign-in)"
   - Haz clic en **"Guardar"**

---

## Paso 4: Configurar Firestore Database

1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. **Modo**:
   - Selecciona **"Comenzar en modo de producción"** (production mode)
   - Haz clic en **"Siguiente"**
4. **Ubicación**:
   - Selecciona la región más cercana a ti:
     - Para Venezuela/Colombia: `us-east1 (South Carolina)`
     - Para España: `europe-west1 (Belgium)`
     - Para México: `us-central1 (Iowa)`
   - Haz clic en **"Habilitar"**
5. Espera a que Firestore se provisione (1-2 minutos)

---

## Paso 5: Configurar Reglas de Seguridad

1. Estando en **Firestore Database**, haz clic en la pestaña **"Reglas"** (Rules)
2. **BORRA** todo el contenido actual
3. Abre el archivo `firestore.rules` de tu proyecto
4. **COPIA** todo el contenido y **PÉGALO** en el editor de reglas de Firebase
5. Haz clic en **"Publicar"** o **"Publish"**
6. Confirma haciendo clic en **"Publicar"** nuevamente

---

## Paso 6: Configurar el Archivo `firebase-config.js`

1. Abre el archivo `firebase-config.js` en tu proyecto
2. Encuentra esta sección:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_AUTH_DOMAIN_AQUI",
    projectId: "TU_PROJECT_ID_AQUI",
    storageBucket: "TU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "TU_MESSAGING_SENDER_ID_AQUI",
    appId: "TU_APP_ID_AQUI"
};
```

3. **REEMPLAZA** todos los valores con los datos que copiaste en el **Paso 2**
4. **GUARDA** el archivo

**Ejemplo de configuración completa:**

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "academia-ctd-12345.firebaseapp.com",
    projectId: "academia-ctd-12345",
    storageBucket: "academia-ctd-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop"
};
```

---

## Paso 7: Crear Usuarios en Firebase Authentication

Tienes dos opciones para crear usuarios:

### Opción A: Crear Usuarios Manualmente (RECOMENDADO)

Para cada uno de los 6 usuarios:

1. Ve a **Authentication** > Pestaña **"Users"**
2. Haz clic en **"Agregar usuario"** o **"Add user"**
3. Ingresa el **email** y **password** (usa `1234` para todos):

```
admin@ctd.com          / 1234
diseno@ctd.com         / 1234
multimedia@ctd.com     / 1234
ia@ctd.com             / 1234
marketing@ctd.com      / 1234
excel@ctd.com          / 1234
```

4. Haz clic en **"Agregar usuario"**
5. **IMPORTANTE**: Copia el **UID** (identificador único) del usuario creado
6. Repite para cada usuario

### Opción B: Ejecutar Script de Setup

1. Abre tu dashboard en el navegador
2. Abre la consola del desarrollador (F12)
3. Ejecuta: `setupInitialUsers()`
4. Sigue las instrucciones en la consola

---

## Paso 8: Crear Documentos de Usuario en Firestore

Para cada usuario creado en Authentication:

1. Ve a **Firestore Database** > Pestaña **"Datos"** (Data)
2. Haz clic en **"Iniciar colección"** (Start collection)
3. ID de la colección: `users`
4. Haz clic en **"Siguiente"**
5. **ID del documento**: Pega el **UID** del usuario (del Paso 7)
6. Agrega los siguientes campos:

**Para admin@ctd.com:**
```
id: "admin"                    (string)
name: "Dirección"              (string)
instructor: "Director Administrativo"  (string)
role: "admin"                  (string)
specialties: []                (array - vacío)
createdAt: (timestamp)         (timestamp - haz clic en el reloj)
```

**Para diseno@ctd.com:**
```
id: "design"                   (string)
name: "Diseño Gráfico"         (string)
instructor: "Javier Design"    (string)
role: "instructor"             (string)
specialties: ["Diseño Gráfico", "Diseño para Redes Sociales"] (array)
createdAt: (timestamp)
```

**Para multimedia@ctd.com:**
```
id: "multimedia"               (string)
name: "Multimedia"             (string)
instructor: "Carlos Multimedia" (string)
role: "instructor"             (string)
specialties: ["Diseño Web", "Edición de Video"] (array)
createdAt: (timestamp)
```

**Para ia@ctd.com:**
```
id: "ai"                       (string)
name: "Inteligencia Artificial" (string)
instructor: "Instructor IA"    (string)
role: "instructor"             (string)
specialties: ["Ingeniería de Prompts", "Creación de Assets con IA"] (array)
createdAt: (timestamp)
```

**Para marketing@ctd.com:**
```
id: "marketing"                (string)
name: "Marketing Digital"      (string)
instructor: "Instructor Marketing" (string)
role: "instructor"             (string)
specialties: ["Marketing 5.0"] (array)
createdAt: (timestamp)
```

**Para excel@ctd.com:**
```
id: "excel"                    (string)
name: "Excel Empresarial"      (string)
instructor: "Instructor Excel" (string)
role: "instructor"             (string)
specialties: ["Excel Básico", "Excel Intermedio", "Excel Avanzado"] (array)
createdAt: (timestamp)
```

7. Haz clic en **"Guardar"**
8. Repite para cada usuario

---

## Paso 9: Probar la Configuración

1. Abre `login.html` en tu navegador
2. Intenta iniciar sesión con uno de los usuarios:
   - Email: `admin@ctd.com`
   - Password: `1234`
3. Si todo está correcto:
   - La consola mostrará: "✅ Firebase inicializado correctamente"
   - Deberías ser redirigido al dashboard
4. Verifica en **Authentication** > **Users** que aparezca la fecha de "Last sign-in"

---

## Paso 10: Migrar Datos Existentes (Opcional)

Si ya tienes datos en localStorage:

1. Haz un **backup** primero:
   - Abre la consola (F12)
   - Ejecuta: `backupLocalStorage()`
   - Se descargará un archivo JSON

2. Migra los datos a Firebase:
   - Inicia sesión en el dashboard
   - En la consola, ejecuta: `migrateToFirebase()`
   - Espera a que complete (verás mensajes de progreso)

3. Verifica los datos:
   - Ve a **Firestore Database**
   - Deberías ver colecciones: `students`, `pensum`, `attendance`, `settings`

---

## ✅ Checklist de Verificación

Marca cada item cuando lo completes:

- [ ] Proyecto Firebase creado
- [ ] Aplicación web registrada
- [ ] Credenciales copiadas a `firebase-config.js`
- [ ] Authentication habilitado (Email/Password)
- [ ] Firestore Database creado
- [ ] Reglas de seguridad configuradas
- [ ] 6 usuarios creados en Authentication
- [ ] 6 documentos creados en colección `users`
- [ ] Login probado exitosamente
- [ ] Datos migrados (si aplicable)

---

## 🚨 Solución de Problemas

### Error: "Firebase no está configurado"
**Solución**: Verifica que hayas reemplazado los valores en `firebase-config.js`

### Error: "Usuario no encontrado en la base de datos"
**Solución**: Crea el documento del usuario en Firestore > `users` collection

### Error: "Permission denied"
**Solución**: Verifica que hayas publicado las reglas de seguridad correctamente

### No puedo iniciar sesión
**Solución**: 
1. Verifica que el usuario exista en Authentication
2. Verifica que la contraseña sea correcta (`1234`)
3. Revisa la consola del navegador para errores específicos

---

## 📞 Siguiente Paso

Una vez completada la configuración de Firebase, continúa con la **[Guía de Despliegue en GitHub Pages](GITHUB_DEPLOYMENT.md)**

---

**¡Configuración Completada! 🎉**

Ahora tu dashboard está conectado a Firebase y listo para usar la nube.
