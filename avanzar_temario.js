// GUÍA: Cómo Avanzar por el Temario
// ===================================

/* 
 * MÉTODO 1: Avance Manual Tema por Tema
 * --------------------------------------
 * Para avanzar al siguiente tema, usa esta función desde la consola:
 */

function avanzarTema(nombreEstudiante) {
    // Buscar el estudiante
    const idx = students.findIndex(s => s.name.toLowerCase().includes(nombreEstudiante.toLowerCase()));

    if (idx === -1) {
        console.error("❌ Estudiante no encontrado");
        return;
    }

    const s = students[idx];
    const topics = pensumContent[s.module] || [];
    const currentIdx = topics.indexOf(s.topic);

    if (currentIdx === -1) {
        console.error("❌ Tema actual no encontrado en el pensum");
        return;
    }

    if (currentIdx >= topics.length - 1) {
        console.log("✅ El estudiante ya completó todos los temas de este módulo");
        console.log("💡 Usa promoteStudent(" + idx + ") para promoverlo al siguiente módulo");
        return;
    }

    const nextTopic = topics[currentIdx + 1];
    updateTopic(idx, nextTopic);

    console.log("✅ " + s.name + " avanzó a: " + nextTopic);
}

/* 
 * MÉTODO 2: Saltar a un Tema Específico
 * --------------------------------------
 */

function cambiarTema(nombreEstudiante, numeroTema) {
    const idx = students.findIndex(s => s.name.toLowerCase().includes(nombreEstudiante.toLowerCase()));

    if (idx === -1) {
        console.error("❌ Estudiante no encontrado");
        return;
    }

    const s = students[idx];
    const topics = pensumContent[s.module] || [];

    if (numeroTema < 1 || numeroTema > topics.length) {
        console.error("❌ Número de tema inválido. Este módulo tiene " + topics.length + " temas");
        return;
    }

    const newTopic = topics[numeroTema - 1];
    updateTopic(idx, newTopic);

    console.log("✅ " + s.name + " cambió a: " + newTopic);
}

/* 
 * MÉTODO 3: Promover al Siguiente Módulo
 * ---------------------------------------
 */

function promoverModulo(nombreEstudiante) {
    const idx = students.findIndex(s => s.name.toLowerCase().includes(nombreEstudiante.toLowerCase()));

    if (idx === -1) {
        console.error("❌ Estudiante no encontrado");
        return;
    }

    promoteStudent(idx);
}

/* 
 * MÉTODO 4: Ver Progreso del Estudiante
 * --------------------------------------
 */

function verProgreso(nombreEstudiante) {
    const idx = students.findIndex(s => s.name.toLowerCase().includes(nombreEstudiante.toLowerCase()));

    if (idx === -1) {
        console.error("❌ Estudiante no encontrado");
        return;
    }

    const s = students[idx];
    const topics = pensumContent[s.module] || [];
    const currentIdx = topics.indexOf(s.topic);
    const progress = topics.length > 0 ? Math.round(((currentIdx + 1) / topics.length) * 100) : 0;

    console.log("📊 PROGRESO DE " + s.name.toUpperCase());
    console.log("━".repeat(50));
    console.log("📚 Especialidad: " + s.specialty);
    console.log("📖 Módulo Actual: " + s.module);
    console.log("📍 Tema Actual: " + s.topic + " (" + (currentIdx + 1) + "/" + topics.length + ")");
    console.log("📈 Progreso: " + progress + "%");
    console.log("━".repeat(50));
    console.log("\n📝 TODOS LOS TEMAS:");
    topics.forEach((t, i) => {
        const status = i < currentIdx ? "✅" : (i === currentIdx ? "▶️" : "⭕");
        console.log(status + " " + (i + 1) + ". " + t);
    });
}

/* 
 * EJEMPLOS DE USO:
 * ================
 * 
 * 1. Avanzar al siguiente tema:
 *    avanzarTema("Darlianis")
 * 
 * 2. Cambiar a un tema específico (ej: tema 5):
 *    cambiarTema("Darlianis", 5)
 * 
 * 3. Promover al siguiente módulo:
 *    promoverModulo("Darlianis")
 * 
 * 4. Ver progreso completo:
 *    verProgreso("Darlianis")
 * 
 * 5. Listar todos los estudiantes:
 *    students.forEach((s, i) => console.log(i + ". " + s.name + " - " + s.module + " - " + s.topic))
 */

console.log("✅ Funciones de avance de temario cargadas");
console.log("💡 Usa: verProgreso('nombre') para ver el progreso de un estudiante");
