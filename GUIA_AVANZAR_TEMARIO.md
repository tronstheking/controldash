# 📚 Guía Completa: Cómo Avanzar por el Temario

## ✨ **Método Visual (Recomendado)**

### Paso 1: Abrir el Modal del Estudiante
1. En la **Lista de Alumnos**, haz clic en el **icono de lápiz** (✏️) de cualquier estudiante
2. Se abrirá un modal con todos los detalles del estudiante

### Paso 2: Ver el Temario del Módulo Actual
En el modal verás:
- **Trayectoria Académica**: Pills con todos los módulos de la especialidad
- **Temario del Módulo Actual**: Lista de todos los temas
  - ✅ **Check verde**: Temas completados
  - ▶️ **Play morado con "ACTUAL"**: Tema en el que está actualmente
  - ⭕ **Círculo gris con flecha**: Temas pendientes

### Paso 3: Avanzar a un Tema
**¡NUEVO!** Ahora puedes hacer clic directamente en cualquier tema para avanzar:

1. **Haz clic en cualquier tema pendiente** (los que tienen el círculo gris)
2. El sistema automáticamente:
   - Marca ese tema como "ACTUAL"
   - Registra el cambio en la bitácora del estudiante
   - Actualiza el progreso
   - Recarga el modal con la información actualizada

### Paso 4: Completar el Módulo
Cuando el estudiante complete todos los temas:
- Aparecerá un botón **"PROMOVER MÓDULO"** en la parte inferior del temario
- Haz clic en ese botón para promoverlo al siguiente módulo
- El sistema automáticamente:
  - Lo moverá al siguiente módulo de su especialidad
  - Reiniciará el progreso en el tema 1 del nuevo módulo
  - Guardará el historial académico

---

## 🎯 **Características del Sistema**

### Indicadores Visuales
- **Tema Actual**: Fondo rosa claro, borde morado a la izquierda, badge "ACTUAL"
- **Temas Completados**: Fondo gris claro, check verde
- **Temas Pendientes**: Fondo blanco, círculo gris, flecha derecha
- **Hover**: Los temas pendientes cambian a fondo gris claro al pasar el mouse

### Información Adicional
- **Porcentaje de Progreso**: Se muestra en la esquina superior derecha del temario
- **Tooltip**: Al pasar el mouse sobre un tema, verás:
  - "Tema actual" (si es el tema actual)
  - "Tema completado" (si ya lo completó)
  - "Clic para avanzar a este tema" (si es un tema pendiente)

### Entregables
- Debajo del temario verás la lista de **Entregables Obligatorios**
- Haz clic en cada checkbox para marcar/desmarcar entregables completados
- El contador muestra cuántos ha completado del total

---

## 🔧 **Método Alternativo: Consola del Navegador**

Si prefieres usar comandos, puedes abrir la consola (F12) y usar:

### 1. Ver Progreso de un Estudiante
```javascript
verProgreso("Darlianis")
```
Muestra:
- Especialidad
- Módulo actual
- Tema actual
- Progreso en %
- Lista completa de temas con estado

### 2. Avanzar al Siguiente Tema
```javascript
avanzarTema("Darlianis")
```
Avanza automáticamente al siguiente tema en la lista

### 3. Cambiar a un Tema Específico
```javascript
cambiarTema("Darlianis", 5)
```
Salta directamente al tema número 5

### 4. Promover al Siguiente Módulo
```javascript
promoverModulo("Darlianis")
```
Promociona al estudiante al siguiente módulo de su especialidad

### 5. Listar Todos los Estudiantes
```javascript
students.forEach((s, i) => console.log(i + ". " + s.name + " - " + s.module + " - " + s.topic))
```

---

## 📊 **Flujo Completo de Avance**

```
1. Estudiante inicia en Módulo 1, Tema 1
   ↓
2. Instructor hace clic en temas para avanzar
   ↓
3. Estudiante completa todos los temas del módulo
   ↓
4. Aparece botón "PROMOVER MÓDULO"
   ↓
5. Instructor hace clic en "PROMOVER MÓDULO"
   ↓
6. Estudiante pasa al Módulo 2, Tema 1
   ↓
7. Se repite el proceso...
   ↓
8. Al completar TODOS los módulos de la especialidad:
   - Si es "Diseño Gráfico": Pregunta si quiere pasar a "Diseño Web"
   - Si es otra especialidad: Mensaje de finalización
```

---

## 💡 **Consejos y Buenas Prácticas**

### ✅ **Recomendaciones**
1. **Avanza tema por tema**: No saltes temas a menos que sea necesario
2. **Marca los entregables**: Ayuda a trackear el progreso real del estudiante
3. **Revisa la bitácora**: Todos los cambios quedan registrados automáticamente
4. **Usa la trayectoria académica**: Los pills de colores te muestran el progreso global

### ⚠️ **Advertencias**
- No puedes retroceder a temas anteriores haciendo clic (solo avanzar)
- Si necesitas retroceder, usa la consola: `cambiarTema("nombre", numeroTema)`
- Los cambios se guardan automáticamente en localStorage

---

## 🎨 **Ejemplo Práctico**

**Estudiante**: Darlianis
**Módulo Actual**: Photoshop Avanzado
**Tema Actual**: Fotomontaje Avanzado (13% de progreso)

### Para avanzar al siguiente tema:
1. Abre el modal de Darlianis (clic en el lápiz)
2. Ve la sección "TEMARIO: PHOTOSHOP AVANZADO"
3. Verás "Fotomontaje Avanzado" con el badge "ACTUAL"
4. Haz clic en "Diagramación (Básica)" (el siguiente tema)
5. ¡Listo! Darlianis ahora está en ese tema

### Para promover al siguiente módulo:
1. Avanza tema por tema hasta llegar al último
2. Cuando esté en el último tema, aparecerá el botón "PROMOVER MÓDULO"
3. Haz clic en ese botón
4. Darlianis pasará a "Illustrator Básico" (siguiente módulo en Diseño Gráfico)

---

## 🚀 **Resultado Final**

Con este sistema puedes:
- ✅ Ver el progreso de cada estudiante en tiempo real
- ✅ Avanzar temas con un solo clic
- ✅ Promover módulos automáticamente
- ✅ Trackear entregables
- ✅ Mantener un historial completo en la bitácora
- ✅ Filtrar por área (Diseño vs Multimedia)

¡Todo de forma visual e intuitiva! 🎉
