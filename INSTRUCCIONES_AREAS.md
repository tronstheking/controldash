# Instrucciones: Sistema de Áreas Separadas

## ✅ Cambios Realizados

Se ha reorganizado el sistema para que cada instructor vea solo los módulos de su área:

### 📋 Áreas Configuradas:

1. **Diseño Gráfico** (Instructor: Javier Design)
   - Diseño Gráfico
   - Diseño para Redes Sociales

2. **Multimedia** (Instructor: Carlos Multimedia)
   - Diseño Web
   - Edición de Video (CapCut)

3. **Administración** (Director)
   - Ve TODAS las áreas y módulos

---

## 🔐 Cómo Usar el Sistema

### Paso 1: Iniciar Sesión
1. Abre `login.html` en tu navegador
2. Ingresa cualquier correo electrónico
3. Ingresa cualquier contraseña
4. **IMPORTANTE:** Selecciona el área/departamento:
   - **Administración (Ver Todo)** - Para ver todos los módulos
   - **Diseño Gráfico** - Para ver solo módulos de diseño
   - **Multimedia (Web & Video)** - Para ver solo módulos de web y video
5. Haz clic en "Iniciar Sesión"

### Paso 2: Verificar la Vista de Pensum
1. Una vez dentro del dashboard, ve a la sección **"Temario"** (icono de libro)
2. Deberías ver solo los módulos correspondientes a tu área seleccionada

---

## 🧪 Pruebas Recomendadas

### Prueba 1: Login como Diseño
- Selecciona "Diseño Gráfico" en el login
- Ve a "Temario"
- Deberías ver SOLO:
  - Diseño Gráfico (con sus módulos)
  - Diseño para Redes Sociales (con sus módulos)
- NO deberías ver: Diseño Web ni Edición de Video

### Prueba 2: Login como Multimedia
- Cierra sesión (o borra localStorage)
- Selecciona "Multimedia (Web & Video)" en el login
- Ve a "Temario"
- Deberías ver SOLO:
  - Diseño Web (con sus módulos)
  - Edición de Video (con sus módulos)
- NO deberías ver: Diseño Gráfico ni Diseño para Redes Sociales

### Prueba 3: Login como Admin
- Cierra sesión
- Selecciona "Administración (Ver Todo)" en el login
- Ve a "Temario"
- Deberías ver TODOS los módulos de todas las áreas

---

## 🔧 Solución de Problemas

### Si sigues viendo todos los módulos:

1. **Limpiar localStorage:**
   - Abre la consola del navegador (F12)
   - Pega este código y presiona Enter:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **O usa el script de limpieza:**
   - Abre la consola del navegador (F12)
   - Copia y pega el contenido de `reset_departments.js`
   - Presiona Enter
   - Recarga la página

3. **Vuelve a iniciar sesión** seleccionando el área correcta

---

## 📝 Notas Técnicas

- El filtrado se hace automáticamente en la función `renderPensumConfig()`
- Cada usuario tiene un array de `specialties` que determina qué módulos ve
- El `currentUser` se guarda en localStorage al hacer login
- Los estudiantes también se filtran por área en otras vistas (Dashboard, Calendario, etc.)

---

## 🎯 Resultado Esperado

✅ **Instructor de Diseño:** Solo ve estudiantes y módulos de diseño gráfico
✅ **Instructor de Multimedia:** Solo ve estudiantes y módulos de web/video  
✅ **Administrador:** Ve todo el sistema completo
