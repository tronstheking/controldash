# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te mostrará cómo desplegar tu dashboard en GitHub Pages para que esté disponible en internet.

## 📋 Requisitos Previos

- Una cuenta de GitHub ([crear cuenta gratis](https://github.com/join))
- Git instalado en tu computadora ([descargar Git](https://git-scm.com/downloads))
- Firebase ya configurado (ver FIREBASE_SETUP.md)

---

## Paso 1: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Configura el repositorio:
   - **Repository name**: `dashboard-academia-ctd` (o el nombre que prefieras)
   - **Description** (opcional): `Dashboard de Control Estudiantil`
   - **Public** o **Private**: Selecciona según tu preferencia
     - ⚠️ Si es privado, necesitas GitHub Pro para GitHub Pages
   - **NO** marques "Initialize this repository with a README"
5. Haz clic en **"Create repository"**
6. **COPIA** la URL del repositorio (ejemplo: `https://github.com/TU-USUARIO/dashboard-academia-ctd.git`)

---

## Paso 2: Inicializar Git en tu Proyecto Local

Abre la terminal/PowerShell en la carpeta de tu proyecto:

```powershell
# Navegar a la carpeta del proyecto
cd C:\Users\usuario\Desktop\DASHBOARD

# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "Initial commit - Dashboard Academia CTD con Firebase"

# Renombrar rama a 'main'
git branch -M main

# Conectar con el repositorio remoto (REEMPLAZA CON TU URL)
git remote add origin https://github.com/TU-USUARIO/dashboard-academia-ctd.git

# Subir los archivos
git push -u origin main
```

**Nota**: Si es la primera vez que usas Git, te pedirá que configures tu nombre y email:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@ejemplo.com"
```

---

## Paso 3: Configurar GitHub Pages

### Opción A: Deployment Automático con GitHub Actions (RECOMENDADO)

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** (Configuración)
3. En el menú lateral izquierdo, haz clic en **"Pages"**
4. En **"Source"**, selecciona **"GitHub Actions"**
5. **¡Listo!** El workflow ya está configurado en tu proyecto

El workflow se ejecutará automáticamente en cada `push` a la rama `main`.

### Opción B: Deployment Manual

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"**
3. Haz clic en **"Pages"** en el menú lateral
4. En **"Source"**:
   - **Branch**: Selecciona `main`
   - **Folder**: Selecciona `/ (root)`
5. Haz clic en **"Save"**
6. Espera 2-3 minutos

---

## Paso 4: Verificar el Deployment

### Si usaste GitHub Actions:

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Deberías ver un workflow ejecutándose o completado
3. Si está en verde ✅, el deployment fue exitoso
4. Si está en rojo ❌, haz clic para ver los errores

### Si usaste deployment manual:

1. Regresa a **Settings** > **Pages**
2. Verás un mensaje: "Your site is published at https://TU-USUARIO.github.io/dashboard-academia-ctd/"

---

## Paso 5: Acceder a tu Dashboard

1. Abre la URL de tu sitio:
   ```
   https://TU-USUARIO.github.io/dashboard-academia-ctd/
   ```

2. Deberías ver la página de login
3. Inicia sesión con tus credenciales de Firebase
4. **¡Listo!** Tu dashboard está en línea

---

## 🔄 Actualizar tu Dashboard

Cada vez que hagas cambios en el código:

```powershell
# Navegar a la carpeta del proyecto
cd C:\Users\usuario\Desktop\DASHBOARD

# Agregar los cambios
git add .

# Crear un commit con descripción
git commit -m "Descripción de los cambios"

# Subir los cambios
git push
```

**Con GitHub Actions**: Los cambios se desplegarán automáticamente en 1-2 minutos.

**Con deployment manual**: Los cambios pueden tomar 5-10 minutos en reflejarse.

---

## 🌐 Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio (ejemplo: `dashboard.tuacademia.com`):

1. Ve a **Settings** > **Pages**
2. En **"Custom domain"**, ingresa tu dominio
3. Haz clic en **"Save"**
4. En tu proveedor de dominio, configura un registro CNAME:
   - **Name**: `dashboard` (o el subdominio que quieras)
   - **Value**: `TU-USUARIO.github.io`
5. Marca la opción **"Enforce HTTPS"** (después de que el DNS se propague)

---

## 🔒 Seguridad

### Reglas de Firestore

Asegúrate de que las reglas de Firestore estén configuradas correctamente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Limitar Dominios Autorizados

1. Ve a Firebase Console > **Authentication** > **Settings**
2. En **"Authorized domains"**:
   - Agrega tu dominio de GitHub Pages: `TU-USUARIO.github.io`
   - Si tienes dominio personalizado, agrégalo también

---

## 📊 Monitorear el Uso

### GitHub Pages

1. Ve a **Settings** > **Pages**
2. Podrás ver estadísticas básicas de uso

### Firebase

1. Ve a Firebase Console
2. **Authentication** > **Usage**: Ver número de usuarios activos
3. **Firestore** > **Usage**: Ver lecturas/escrituras
4. **Usage and billing**: Ver límites del plan gratuito

### Límites del Plan Gratuito de Firebase:

- **Authentication**: 50,000 usuarios activos/mes
- **Firestore**:
  - 50,000 lecturas/día
  - 20,000 escrituras/día
  - 20,000 eliminaciones/día
  - 1 GB almacenamiento

Para una academia pequeña, estos límites son más que suficientes.

---

## 🚨 Solución de Problemas

### Error 404 - Página no encontrada

**Causas posibles**:
- GitHub Pages aún no se ha activado (espera 5 minutos)
- La rama o carpeta configurada es incorrecta
- El repositorio es privado y no tienes GitHub Pro

**Solución**:
1. Verifica en **Settings** > **Pages** que esté configurado correctamente
2. Revisa que el workflow en **Actions** se haya ejecutado exitosamente

### Los cambios no se reflejan

**Solución**:
1. Limpia la caché del navegador (Ctrl + Shift + R)
2. Espera 10-15 minutos
3. Verifica que el commit se haya subido correctamente (`git log`)

### Error en el Workflow de GitHub Actions

**Solución**:
1. Ve a **Actions** y haz clic en el workflow fallido
2. Revisa los logs para ver el error específico
3. Corrige el error y haz un nuevo push

### Firebase no funciona en GitHub Pages

**Posibles causas**:
- Las credenciales de Firebase no están configuradas correctamente
- El dominio no está autorizado en Firebase

**Solución**:
1. Verifica que `firebase-config.js` tenga las credenciales correctas
2. Agrega tu dominio de GitHub Pages en Firebase Console > Authentication > Settings > Authorized domains

---

## 📝 Comandos Git Útiles

```powershell
# Ver el estado de los archivos
git status

# Ver el historial de commits
git log --oneline

# Ver cambios antes de hacer commit
git diff

# Deshacer cambios locales
git checkout -- nombre-archivo.js

# Ver remotes configurados
git remote -v

# Actualizar desde GitHub (si trabajas en equipo)
git pull
```

---

## 🎯 Mejores Prácticas

1. **Commits frecuentes**: Haz commits pequeños y descriptivos
   ```powershell
   git commit -m "Agregado filtro de búsqueda en estudiantes"
   ```

2. **Branches para features**: Para cambios grandes, usa ramas
   ```powershell
   git checkout -b feature/nueva-funcionalidad
   # ... hacer cambios ...
   git commit -m "Implementada nueva funcionalidad"
   git checkout main
   git merge feature/nueva-funcionalidad
   ```

3. **Backup regular**: Haz push frecuentemente
   ```powershell
   git push
   ```

4. **No subir archivos sensibles**: El `.gitignore` ya está configurado

---

## 🎉 ¡Felicidades!

Tu dashboard ahora está:
- ✅ Conectado a Firebase (base de datos en la nube)
- ✅ Desplegado en GitHub Pages (accesible desde internet)
- ✅ Con deployment automático (cada push actualiza el sitio)

**URL de tu dashboard**: `https://TU-USUARIO.github.io/dashboard-academia-ctd/`

---

## 📞 Próximos Pasos

1. Comparte la URL con tus instructores
2. Cambia las contraseñas por defecto en Firebase
3. Personaliza los colores y logos según tu academia
4. Agrega más funcionalidades según tus necesidades

**¡Tu academia ahora tiene un sistema profesional de gestión! 🚀**
