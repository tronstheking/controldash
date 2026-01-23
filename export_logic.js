
// Export to CSV (Excel compatible)
window.exportToExcel = () => {
    const list = getFilteredStudents(); // Export visible students
    if (list.length === 0) return alert("No hay alumnos para exportar.");

    // BOM for Excel to read UTF-8 correctly
    let csv = "\uFEFF";
    csv += "Nombre,Teléfono,Especialidad,Módulo,Tema Actual,Avance %,Rendimiento,Asistencia %\n";

    list.forEach(s => {
        // Safe strings
        const name = (s.name || "").replace(/,/g, " ");
        const phone = (s.phone || "").replace(/,/g, " ");
        const spec = (s.specialty || "").replace(/,/g, " ");
        const mod = (s.module || "").replace(/,/g, " ");
        const topic = (s.topic || "").replace(/,/g, " ");

        // Calculations
        const t = pensumContent[s.module] || [];
        const i = t.indexOf(s.topic);
        const prog = t.length > 0 ? Math.round(((i + 1) / t.length) * 100) : 0;

        let perf = "-";
        if (typeof window.calculatePerformance === 'function') {
            perf = window.calculatePerformance(s).label.replace(/,/g, "");
        }

        let att = "-";
        if (typeof window.getAttendanceStats === 'function') {
            att = window.getAttendanceStats(s.name).percent + "%";
        }

        csv += `${name},${phone},${spec},${mod},${topic},${prog},${perf},${att}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Reporte_Alumnos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
