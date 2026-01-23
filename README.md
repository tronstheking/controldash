# Academia CTD - Dashboard de Control Estudiantil

Sistema de gestión académica moderno y completo para academias y centros educativos.

## 🚀 Características

- **Gestión de Estudiantes**: Control completo de inscripciones, datos y progreso
- **Asistencia**: Registro y seguimiento de asistencia con métricas
- **Pensum Académico**: Gestión de contenido de cursos y módulos
- **Entregables**: Sistema de seguimiento de tareas y proyectos
- **Pagos**: Control de pagos y finanzas
- **Reportes**: Dashboard interactivo con métricas clave
- **Autenticación**: Sistema seguro con Firebase Authentication
- **Base de Datos en la Nube**: Sincronización en tiempo real con Firestore

## 🔥 Configuración de Firebase

### Paso 1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Agregar proyecto"
3. Sigue los pasos de configuración

### Paso 2: Configurar Authentication

1. En tu proyecto Firebase, ve a **Authentication**
2. Haz clic en "Comenzar"
3. Habilita el proveedor **"Correo electrónico/contraseña"**

### Paso 3: Configurar Firestore Database

1. Ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona **"Comenzar en modo de producción"**
4. Elige la ubicación más cercana

### Paso 4: Configurar Reglas de Seguridad

1. En Firestore, ve a la pestaña **"Reglas"**
2. Copia y pega el contenido del archivo `firestore.rules` de este repositorio
3. Haz clic en **"Publicar"**

### Paso 5: Obtener Credenciales

1. Ve a **Configuración del proyecto** (⚙️ > Project Settings)
2. En la sección "Tus apps", selecciona el ícono web (`</>`)
3. Registra una nueva app web
4. Copia el objeto `firebaseConfig`

### Paso 6: Configurar la Aplicación

1. Abre el archivo `firebase-config.js`
2. Reemplaza los valores placeholder con tus credenciales:

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

### Paso 7: Crear Usuarios

#### Opción A: Manual (Firebase Console)

1. Ve a **Authentication > Users > Add user**
2. Crea cada usuario con email y password:
   - `admin@ctd.com` (password: `1234`)
   - `diseno@ctd.com` (password: `1234`)
   - `multimedia@ctd.com` (password: `1234`)
   - `ia@ctd.com` (password: `1234`)
   - `marketing@ctd.com` (password: `1234`)
   - `excel@ctd.com` (password: `1234`)

3. Para cada usuario creado, ve a **Firestore Database > users**
4. Crea un documento con el UID del usuario
5. Agrega los campos correspondientes (ver `firebase-setup.js`)

#### Opción B: Usando el Script

1. Abre `firebase-setup.js` en la consola del navegador
2. Ejecuta: `setupInitialUsers()` para ver la lista
3. Sigue las instrucciones en la consola

### Paso 8: Migrar Datos Existentes (Opcional)

Si ya tienes datos en localStorage:

1. Haz un backup: Abre la consola y ejecuta `backupLocalStorage()`
2. Inicia sesión en la aplicación
3. Ejecuta la migración: `migrateToFirebase()`
4. Espera a que complete

## 📦 Despliegue en GitHub Pages

### Opción A: Automatic (GitHub Actions)

1. Crea un repositorio en GitHub
2. Sube todos los archivos:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

3. Ve a **Settings > Pages**
4. En "Source", selecciona **"GitHub Actions"**
5. El workflow se ejecutará automáticamente en cada push
6. Tu sitio estará disponible en: `https://TU-USUARIO.github.io/TU-REPO/`

### Opción B: Manual

1. Ve a **Settings > Pages**
2. En "Source", selecciona la rama **main** y carpeta **/ (root)**
3. Haz clic en **Save**
4. Espera unos minutos y tu sitio estará disponible

## 🔐 Usuarios por Defecto

| Email | Password | Rol | Departamento |
|-------|----------|-----|--------------|
| admin@ctd.com | 1234 | Admin | Todos |
| diseno@ctd.com | 1234 | Instructor | Diseño Gráfico |
| multimedia@ctd.com | 1234 | Instructor | Multimedia |
| ia@ctd.com | 1234 | Instructor | IA |
| marketing@ctd.com | 1234 | Instructor | Marketing |
| excel@ctd.com | 1234 | Instructor | Excel |

**⚠️ IMPORTANTE**: Cambia las contraseñas después del primer despliegue.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Cloud Firestore
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Iconos**: Lucide Icons
- **Fuentes**: Google Fonts (Inter, Outfit)

## 📁 Estructura del Proyecto

```
DASHBOARD/
├── index.html              # Dashboard principal
├── login.html              # Página de login
├── app.js                  # Lógica principal de la app
├── firebase-config.js      # Configuración de Firebase
├── auth.js                 # Módulo de autenticación
├── db-service.js           # Servicio de base de datos
├── migrate-to-firebase.js  # Script de migración
├── firebase-setup.js       # Script de setup inicial
├── firestore.rules         # Reglas de seguridad
├── style.css               # Estilos principales
├── *.css                   # Estilos modulares
├── *.js                    # Scripts modulares
└── .github/
    └── workflows/
        └── deploy.yml      # Workflow de deployment
```

## 🔄 Actualizar la Aplicación

Para actualizar la aplicación en GitHub Pages:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

El workflow de GitHub Actions se ejecutará automáticamente y desplegará los cambios.

## 🐛 Solución de Problemas

### Error: "Firebase no está configurado"

- Verifica que hayas actualizado `firebase-config.js` con tus credenciales
- Revisa la consola del navegador para errores específicos

### Error: "Usuario no encontrado en la base de datos"

- Asegúrate de haber creado los documentos de usuario en Firestore
- Verifica que el UID del documento coincida con el UID en Authentication

### La aplicación no se despliega en GitHub Pages

- Verifica que GitHub Pages esté habilitado en Settings > Pages
- Revisa el estado del workflow en Actions
- Asegúrate de que el repositorio sea público o tengas GitHub Pro

### Los datos no se sincronizan

- Verifica tu conexión a internet
- Revisa las reglas de seguridad de Firestore
- Comprueba que estés autenticado correctamente

## 📝 Licencia

ISC

## 👨‍💻 Soporte

Para soporte o preguntas, contacta al administrador del sistema.

---

**Desarrollado con ❤️ para Academia CTD**
