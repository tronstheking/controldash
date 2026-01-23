// Script para limpiar y reinicializar los departamentos
// Ejecutar esto en la consola del navegador

console.log("🧹 Limpiando datos antiguos...");

// Limpiar departamentos antiguos
localStorage.removeItem('availableDepartments');

// Reinicializar con la estructura correcta
const newDepartments = [
    {
        id: 'design',
        name: 'Diseño Gráfico',
        instructor: 'Javier Design',
        specialties: ['Diseño Gráfico', 'Diseño para Redes Sociales']
    },
    {
        id: 'multimedia',
        name: 'Multimedia',
        instructor: 'Carlos Multimedia',
        specialties: ['Diseño Web', 'Edición de Video']
    },
    {
        id: 'admin',
        name: 'Dirección',
        instructor: 'Director Administrativo',
        specialties: []
    }
];

localStorage.setItem('availableDepartments', JSON.stringify(newDepartments));

console.log("✅ Departamentos reinicializados:");
console.log(newDepartments);

console.log("\n🔄 Por favor, recarga la página para aplicar los cambios.");
