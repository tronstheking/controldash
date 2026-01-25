
// ==========================================
// PENSUM / CURRICULUM DISPLAY (DYNAMIC)
// ==========================================

// Global Definitions (Fallback if app.js fails)
const GLOBAL_SPECIALTIES_MAP = {
    "Diseño Gráfico": [
        "Photoshop Básico",
        "Photoshop Avanzado",
        "Illustrator Básico",
        "Illustrator Avanzado",
        "Elementos Gráficos RRSS"
    ],
    "Diseño para Redes Sociales": [
        "Photoshop Básico",
        "Illustrator Básico",
        "Elementos Gráficos para Redes"
    ],
    "Multimedia": [
        "Maquetación Web",
        "WordPress",
        "Fundamentos de CapCut",
        "Edición Dinámica"
    ],
    "Diseño Web": [
        "Maquetación Web",
        "WordPress"
    ],
    "Edición de Video": [
        "Fundamentos de CapCut",
        "Edición Dinámica",
        "Efectos y Transiciones",
        "Audio y Colorización",
        "Proyecto Final Viral"
    ],
    "Inteligencia Artificial": [
        "Ingeniería de Prompts",
        "Creación de Assets con IA"
    ],
    "Marketing Digital": [
        "Marketing 5.0"
    ],
    "Marketing 5.0": [
        "Fundamentos de Marketing 5.0",
        "Investigación con IA",
        "Estrategia de Contenidos & Copy",
        "Business Manager (Meta)",
        "Google Ads & Analytics",
        "Automatización & Chatbots"
    ],
    "Excel Empresarial": [
        "Experto en Excel"
    ],
    "Experto en Excel": [
        "Excel Básico",
        "Excel Intermedio",
        "Excel Avanzado"
    ]
};

// ---------------------------------------------------------
// MODAL LOGIC
// ---------------------------------------------------------

window.openEditPensumModal = (title, currentDuration) => {
    const modal = document.getElementById('edit-pensum-modal');
    if (!modal) return;

    // Load Data
    const contentMap = window.pensumContent || JSON.parse(localStorage.getItem('design_pensum_content')) || {};
    const topics = contentMap[title] || [];

    // Set Fields
    document.getElementById('edit-module-id').value = title; // using title as ID
    document.getElementById('edit-module-title').value = title;
    document.getElementById('edit-module-title').disabled = true; // Disable title edit for existing

    // Hide Department Select for edit
    const deptGroup = document.getElementById('edit-module-department-group');
    if (deptGroup) deptGroup.style.display = 'none';

    document.getElementById('edit-module-duration').value = currentDuration;
    document.getElementById('edit-module-topics').value = topics.join('\n');

    // Show Modal
    modal.classList.add('active');
};

window.closeEditPensumModal = () => {
    const modal = document.getElementById('edit-pensum-modal');
    if (modal) modal.classList.remove('active');
};

window.openAddModuleModal = () => {
    const modal = document.getElementById('edit-pensum-modal');
    if (!modal) return;

    // Clear Fields for New Entry
    document.getElementById('edit-module-id').value = '';
    document.getElementById('edit-module-title').value = '';
    document.getElementById('edit-module-title').disabled = false;
    document.getElementById('edit-module-duration').value = '';
    document.getElementById('edit-module-topics').value = '';

    // SHOW Department Select for new
    const deptGroup = document.getElementById('edit-module-department-group');
    const deptSelect = document.getElementById('edit-module-department');
    if (deptGroup) {
        deptGroup.style.display = 'block';

        // Smart default: Select current active filter if matches one of the options
        const currentActiveChip = document.querySelector('.filter-chip.active');
        if (currentActiveChip && deptSelect) {
            const oc = currentActiveChip.getAttribute('onclick');
            const match = oc.match(/'([^']+)'/);
            if (match) {
                const activeCat = match[1];
                // Try to set value
                deptSelect.value = activeCat;
                // If value didn't stick (because activeCat isn't in options, e.g. "all"), default to first
                if (deptSelect.value !== activeCat) deptSelect.selectedIndex = 0;
            }
        }
    }

    modal.classList.add('active');
};

window.savePensumChanges = () => {
    let title = document.getElementById('edit-module-id').value;
    const isNew = title === '';

    // If new, validate title
    if (isNew) {
        title = document.getElementById('edit-module-title').value.trim();
        if (!title) return alert("El título es obligatorio");
    }

    const newDuration = document.getElementById('edit-module-duration').value;
    const rawTopics = document.getElementById('edit-module-topics').value;
    const newTopics = rawTopics.split('\n').map(t => t.trim()).filter(t => t.length > 0);

    // 0. CAPTURE OLD STATE FOR SYNC
    if (!window.pensumContent) window.pensumContent = {};
    const oldTopics = [...(window.pensumContent[title] || [])];

    // 1. Save Content (Topics)
    window.pensumContent[title] = newTopics;
    localStorage.setItem('design_pensum_content', JSON.stringify(window.pensumContent));

    // SYNC TO FIREBASE
    if (window.DBService && window.DBService.savePensumContent) {
        window.DBService.savePensumContent(window.pensumContent)
            .then(() => console.log("✅ Pensum synced to Firebase"))
            .catch(err => console.error("❌ Error syncing pensum:", err));
    }

    // 1.5 SMART SYNC: Update Students currently on these topics
    if (window.students && !isNew) {
        let studentsUpdated = false;
        window.students.forEach(s => {
            if (s.module === title) {
                const oldIdx = oldTopics.indexOf(s.topic);
                // If the student's topic was found in the old list and we have a corresponding new topic
                if (oldIdx !== -1 && newTopics[oldIdx]) {
                    if (s.topic !== newTopics[oldIdx]) {
                        console.log(`Syncing student ${s.name}: ${s.topic} -> ${newTopics[oldIdx]}`);
                        s.topic = newTopics[oldIdx];
                        studentsUpdated = true;
                    }
                } else if (oldIdx === -1 && s.topic) {
                    // Safety: If topic wasn't found (maybe deleted or modified heavily), 
                    // and there's at least one topic, reset to first to avoid broken UI
                    // but usually, we keep index consistency
                }
            }
        });

        if (studentsUpdated && typeof window.save === 'function') {
            window.save(); // Save and re-render students
        }
    }

    // 2. Save Duration Override
    const durations = JSON.parse(localStorage.getItem('pensumDurations') || '{}');
    durations[title] = newDuration;
    localStorage.setItem('pensumDurations', JSON.stringify(durations));

    // 3. Handle NEW Module Assignment to Category
    if (isNew) {
        const deptSelect = document.getElementById('edit-module-department');
        let selectedCategory = deptSelect ? deptSelect.value : 'Diseño Gráfico';

        const customMap = JSON.parse(localStorage.getItem('customModules') || '{}');
        if (!customMap[selectedCategory]) customMap[selectedCategory] = [];

        if (!customMap[selectedCategory].includes(title)) {
            customMap[selectedCategory].push(title);
            localStorage.setItem('customModules', JSON.stringify(customMap));

            // SYNC METADATA TO FIREBASE
            if (window.DBService && window.DBService.savePensumMetadata) {
                window.DBService.savePensumMetadata(customMap)
                    .then(() => console.log("✅ Metadata (Categories) synced"))
                    .catch(e => console.error("❌ Metadata sync failed", e));
            }
        }
    }

    // 4. Revive if previously deleted logic
    const deleted = JSON.parse(localStorage.getItem('deletedModules') || '[]');
    if (deleted.includes(title)) {
        const newDeleted = deleted.filter(t => t !== title);
        localStorage.setItem('deletedModules', JSON.stringify(newDeleted));
    }

    window.closeEditPensumModal();
    refreshCurrentPensumView();

    // 5. GLOBAL UI REFRESH: Ensure all areas reflect changes
    if (typeof window.renderStudents === 'function') window.renderStudents();
    if (typeof window.updateStats === 'function') window.updateStats();
    if (window.showToast) window.showToast("Pensum sincronizado en tiempo real.", "success");
};

window.deleteModule = async () => {
    const title = document.getElementById('edit-module-id').value;

    // If it's a new module (empty ID), just close modal
    if (!title) {
        window.closeEditPensumModal();
        return;
    }

    if (!confirm(`⚠️ PELIGRO: ¿Estás seguro que deseas ELIMINAR PERMANENTEMENTE el módulo "${title}"?\n\nEsta acción NO se puede deshacer y borrará el módulo de la base de datos para TODOS los usuarios.`)) return;

    // Determine current category from UI or Metadata
    const currentActiveChip = document.querySelector('.filter-chip.active');
    let currentCategory = null;

    // Attempt to find category in metadata
    if (window.pensumMetadata) {
        Object.keys(window.pensumMetadata).forEach(cat => {
            if (window.pensumMetadata[cat].includes(title)) {
                currentCategory = cat;
            }
        });
    }

    // Cloud Delete
    if (window.DBService && window.DBService.deletePensumModule) {
        window.showToast("Eliminando de la nube...", "info");
        const result = await window.DBService.deletePensumModule(title, currentCategory);
        if (result.success) {
            console.log("✅ Module deleted from cloud");
            window.showToast("Módulo eliminado permanentemente.", "success");
        } else {
            console.error("❌ Cloud delete failed:", result.error);
            window.showToast("Error al eliminar de la nube: " + result.error, "error");
            return;
        }
    }

    // Local Cleanup (Legacy/Cache)
    const deleted = JSON.parse(localStorage.getItem('deletedModules') || '[]');
    if (!deleted.includes(title)) {
        deleted.push(title);
        localStorage.setItem('deletedModules', JSON.stringify(deleted));
    }

    // Update Local Metadata Cache
    if (currentCategory && window.pensumMetadata && window.pensumMetadata[currentCategory]) {
        window.pensumMetadata[currentCategory] = window.pensumMetadata[currentCategory].filter(m => m !== title);
        localStorage.setItem('customModules', JSON.stringify(window.pensumMetadata));
    }

    window.closeEditPensumModal();
    // Force refresh
    if (typeof refreshCurrentPensumView === 'function') refreshCurrentPensumView();
    // Also refresh "All" view to ensure it disappears
    setTimeout(() => {
        if (typeof window.renderPensumConfig === 'function') window.renderPensumConfig();
    }, 500);
};

function refreshCurrentPensumView() {
    const currentActiveChip = document.querySelector('.filter-chip.active');
    let currentCategory = 'all';
    if (currentActiveChip) {
        const oc = currentActiveChip.getAttribute('onclick');
        const match = oc.match(/'([^']+)'/);
        if (match) currentCategory = match[1];
    }
    window.filterPensumByCategory(currentCategory);
}

// ---------------------------------------------------------
// RENDER LOGIC
// ---------------------------------------------------------

// Helper to render a specific list of module names
window.renderModulesList = (list, activeCategory = 'all') => {
    const container = document.getElementById('pensum-grid-container');
    if (!container) return;

    container.innerHTML = '';

    // EXPANSION LOGIC
    let expandedList = [];
    const specialtiesMap = window.specialties || GLOBAL_SPECIALTIES_MAP;

    list.forEach(item => {
        if (specialtiesMap[item]) {
            expandedList = [...expandedList, ...specialtiesMap[item]];
        } else {
            expandedList.push(item);
        }
    });

    // MERGE CUSTOM MODULES
    // Priority: 1. Cloud Metadata (window.pensumMetadata), 2. LocalStorage
    const customMap = window.pensumMetadata || JSON.parse(localStorage.getItem('customModules') || '{}');

    // Get Current User for Permission Checking
    const currentUser = window.currentUser || JSON.parse(localStorage.getItem('currentUser')) || { id: 'admin' };
    const userRole = currentUser.id;
    // Determine allowed categories for this user
    let allowedCategories = [];
    if (userRole === 'admin') {
        allowedCategories = ['*'];
    } else {
        allowedCategories = currentUser.specialties || [];
        // Fallback IDs if specialties missing
        if (allowedCategories.length === 0) {
            if (userRole === 'design') allowedCategories = ['Diseño Gráfico', 'Diseño para Redes Sociales'];
            else if (userRole === 'multimedia') allowedCategories = ['Diseño Web', 'Edición de Video', 'Multimedia'];
            else if (userRole === 'ai') allowedCategories = ['Inteligencia Artificial'];
            else if (userRole === 'marketing') allowedCategories = ['Marketing Digital', 'Marketing 5.0'];
            else if (userRole === 'excel') allowedCategories = ['Excel Empresarial', 'Experto en Excel'];
        }
    }

    // Logic: If on 'all', show all custom modules but FILTERED by user permissions.
    if (activeCategory === 'all') {
        Object.keys(customMap).forEach(category => {
            // Only show if user is admin OR has this category in their allowed list
            if (allowedCategories.includes('*') || allowedCategories.includes(category)) {
                expandedList = [...expandedList, ...customMap[category]];
            }
        });

        // Handling Uncategorized / Orphaned Modules from Firebase
        // Only show these to Admin to prevent clutter for instructors
        if (allowedCategories.includes('*') && window.pensumContent) {
            Object.keys(window.pensumContent).forEach(key => {
                // Only add if not already in list (avoid duplicates)
                if (!expandedList.includes(key)) {
                    // Check if it's truly uncategorized (not in any customMap category)
                    let isCategorized = false;
                    Object.values(customMap).forEach(arr => {
                        if (arr.includes(key)) isCategorized = true;
                    });

                    if (!isCategorized) expandedList.push(key);
                }
            });
        }
    } else {
        if (customMap[activeCategory]) {
            expandedList = [...expandedList, ...customMap[activeCategory]];
        }
    }

    expandedList = [...new Set(expandedList)];

    // RENDER CARDS
    let html = '';
    expandedList.forEach((modName, i) => {
        // Color Logic
        let colorClass = 'color-blue';
        const s = modName.toLowerCase();
        if (s.includes('photoshop')) colorClass = 'color-blue';
        else if (s.includes('illustrator')) colorClass = 'color-orange';
        else if (s.includes('redes') || s.includes('social')) colorClass = 'color-pink';
        else if (s.includes('web')) colorClass = 'color-cyan';
        else if (s.includes('video') || s.includes('capcut')) colorClass = 'color-purple';
        else if (s.includes('ia') || s.includes('prompts')) colorClass = 'color-indigo';
        else if (s.includes('excel')) colorClass = 'color-green';
        else if (s.includes('marketing') || s.includes('investigación') || s.includes('copy') || s.includes('business') || s.includes('ads') || s.includes('chatbots')) colorClass = 'color-red';

        html += renderSpecialtyCard(modName, `pensum-mod-${i}`, colorClass, activeCategory);
    });

    // ADD BUTTON CARD (Appended at the end)
    html += `
    <div onclick="openAddModuleModal()" class="module-card" style="border: 2px dashed #cbd5e1; background: #f8fafc !important; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; box-shadow: none; cursor: pointer; transition: all 0.3s ease;">
        <div style="width: 60px; height: 60px; background: #e0f2fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); margin-bottom: 15px;">
            <i data-lucide="plus" style="width: 32px; height: 32px;"></i>
        </div>
        <h3 style="color: var(--text-muted); font-size: 16px; font-weight:600;">Añadir Nuevo Módulo</h3>
    </div>
    `;

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}


// ---------------------------------------------------------
// RENDER LOGIC
// ---------------------------------------------------------

// Helper Function: Render Specialty Card
window.renderSpecialtyCard = (title, id, colorClass, activeCategory = 'all') => {
    // 0. Check if Deleted
    const deleted = JSON.parse(localStorage.getItem('deletedModules') || '[]');
    if (deleted.includes(title)) return '';

    // 1. Data Retrieval
    const contentMap = window.pensumContent || JSON.parse(localStorage.getItem('design_pensum_content')) || {};
    const topics = contentMap[title] || [];
    const count = topics.length;

    // 2. Icon Logic
    let icon = "book-open";
    if (title.includes("Photoshop")) icon = "image";
    else if (title.includes("Illustrator")) icon = "pen-tool";
    else if (title.includes("Video") || title.includes("CapCut")) icon = "video";
    else if (title.includes("Web") || title.includes("WordPress")) icon = "globe";
    else if (title.includes("Excel")) icon = "table";
    else if (title.includes("Marketing") || title.includes("Ads")) icon = "bar-chart-2";
    else if (title.includes("IA") || title.includes("Prompts")) icon = "cpu";

    // 3. Duration Logic
    let duration = "4 Semanas"; // Default default

    // Check LocalStorage Override
    const savedDurations = JSON.parse(localStorage.getItem('pensumDurations') || '{}');

    if (savedDurations[title]) {
        // Priority 1: Manual Override
        duration = savedDurations[title];
    } else {
        // Priority 2: Hardcoded Rules
        const designModules = [
            "Photoshop Básico",
            "Photoshop Avanzado",
            "Illustrator Básico",
            "Illustrator Avanzado",
            "Elementos Gráficos RRSS"
        ];

        // Explicit Override for Redes Sociales
        if (activeCategory === 'Diseño para Redes Sociales') {
            duration = "4 Semanas";
        }
        else if (designModules.includes(title)) {
            // For Graphic Design or All, default these to 6 weeks
            duration = "6 Semanas";
        }
    }

    // 4. Render HTML
    // Added Edit Button to Header
    return `
    <div class="module-card ${colorClass}">
        <div onclick="togglePensumDetails('${id}')" style="cursor:pointer;">
            <div class="module-category">${count} Temas</div>
            <h3 class="module-title">${title}</h3>
            <p class="module-description">
                ${topics.length > 0 ? topics.slice(0, 2).join(', ') + '...' : 'Programa profesional intensivo.'}
            </p>
        </div>
        
        <div class="module-stats">
            <div class="module-stat">
               <i data-lucide="book"></i> ${count} Lecciones
            </div>
            <div class="module-stat">
               <i data-lucide="clock"></i> ${duration}
            </div>
            <!-- Edit Button (Only visible on hover usually, but let's make it always visible or subtle) -->
            <button class="edit-btn" onclick="openEditPensumModal('${title}', '${duration}')" style="margin-left:auto; background:none; border:none; color:rgba(255,255,255,0.8); cursor:pointer; padding:5px;">
                <i data-lucide="pencil" style="width:16px; height:16px;"></i>
            </button>
        </div>

        <div class="module-topics" id="${id}">
            ${topics.map((t, idx) => `
                <div class="topic-item">
                    <span class="topic-name">${t}</span>
                </div>
            `).join('')}
        </div>

        <img src="logo-academy.png" class="module-icon" alt="icon">
    </div>
    `;
};


// Main Entry Point
window.renderPensumConfig = () => {
    console.log("Rendering Pensum View (Multi-Module Logic)...");

    const container = document.getElementById('pensum-grid-container');
    const filterContainer = document.getElementById('pensum-filters-container');

    if (!container) return;

    // --- DATA FALLBACKS ---
    if (!window.pensumContent || Object.keys(window.pensumContent).length === 0) {
        // Check storage
        const stored = JSON.parse(localStorage.getItem('design_pensum_content'));
        if (stored) {
            window.pensumContent = stored;
        } else {
            // Fallback Content
            window.pensumContent = {
                "Photoshop Básico": ["Interfaz y Entorno", "Capas y Máscaras", "Herramientas de Selección", "Retoque Fotográfico Basico"],
                "Photoshop Avanzado": ["Montajes Complejos", "Efectos y Filtros", "Automatización", "Arte Digital"],
                "Illustrator Básico": ["Vectores vs Píxeles", "Pluma y Trazos", "Formas Geométricas", "Color y Degradados"],
                "Illustrator Avanzado": ["Mallas de Degradado", "Perspectiva 3D", "Vectorización de Imágenes", "Identidad Corporativa"],
                "Elementos Gráficos RRSS": ["Diseño de Posts", "Historias y Reels", "Carruseles Educativos", "Branding para Redes"],
                "Elementos Gráficos para Redes": ["Formatos de Redes", "Diseño de Miniaturas", "Banners Publicitarios"],
                "Maquetación Web": ["HTML5 Estructura", "CSS3 Estilos", "Flexbox Layout", "Responsive Design"],
                "WordPress": ["Instalación CMS", "Elementor Page Builder", "WooCommerce", "SEO Básico"],
                "Fundamentos de CapCut": ["Interfaz Móvil", "Cortes y Ritmo", "Música y Audio"],
                "Edición Dinámica": ["Keyframes", "Curvas", "Transiciones", "Efectos Visuales"],
                "Efectos y Transiciones": ["Tracking", "Máscaras", "Chroma Key"],
                "Audio y Colorización": ["Diseño Sonoro", "Corrección de Color", "LUTs"],
                "Proyecto Final Viral": ["Guionización", "Grabación", "Edición Final", "Publicación"],
                "Ingeniería de Prompts": ["Fundamentos LLM", "Zero-shot prompting", "Chain of thought", "Generación de Imágenes"],
                "Creación de Assets con IA": ["Midjourney Avanzado", "Stable Diffusion", "Copyright y Ética", "Integración Workflows"],
                // Marketing Specifics
                "Fundamentos de Marketing 5.0": ["Evolución 1.0 a 5.0", "Psicología Consumidor", "Avatar con IA"],
                "Investigación con IA": ["Prompt Engineering", "Análisis Competencia", "Google Trends"],
                "Estrategia de Contenidos & Copy": ["Pillares Virales", "Copywriting AIDA", "Calendario Editorial"],
                "Business Manager (Meta)": ["Estructura Campañas", "Segmentación", "Pixel API"],
                "Google Ads & Analytics": ["Search", "Keywords", "GA4"],
                "Automatización & Chatbots": ["ManyChat", "WhatsApp API", "Email Marketing"],
                // Excel Specifics
                "Excel Básico": ["Interfaz", "Fórmulas Suma/Promedio", "Formatos de Celda"],
                "Excel Intermedio": ["Tablas Dinámicas", "Gráficos Estadísticos", "Funciones Lógicas (SI)"],
                "Excel Avanzado": ["Macros Grabadas", "Introducción VBA", "Power Query"]
            };
        }
    }

    // Determine current user
    let currentUser = window.currentUser || JSON.parse(localStorage.getItem('currentUser')) || { id: 'admin' };

    // DEBUG: Log current user info
    console.log('🔍 PENSUM FILTER DEBUG:');
    console.log('Current User:', currentUser);
    console.log('User ID:', currentUser.id);
    console.log('User Specialties:', currentUser.specialties);

    // --- DETERMINE WHICH MODULES TO SHOW (DEPARTMENT FILTERING) ---
    // Each department should only see modules that belong to their specialties
    // Admin users see ALL modules across all departments
    let modulesList = [];
    let specialtiesMap = window.specialties || GLOBAL_SPECIALTIES_MAP;

    // Use helper function if available (from app.js), otherwise use fallback logic
    if (typeof window.getDepartmentModules === 'function') {
        console.log('✅ Using getDepartmentModules() helper');
        modulesList = window.getDepartmentModules();
        console.log('Modules from helper:', modulesList);
    } else {
        console.log('⚠️ Using fallback filtering logic');
        // Fallback: Manual filtering logic
        // 1. Get User's Roles/Specialties (e.g. ["Diseño Gráfico", "Diseño Web"])
        let userRoles = [];
        if (currentUser.id === 'admin') {
            console.log('👑 Admin user detected - showing all modules');
            userRoles = Object.keys(specialtiesMap); // Admin sees everything
        } else {
            userRoles = currentUser.specialties || [];
            console.log('User roles/specialties:', userRoles);
        }

        // 2. Map Roles to MODULE NAMES using the Map
        userRoles.forEach(role => {
            if (specialtiesMap[role]) {
                console.log(`Mapping specialty "${role}" to modules:`, specialtiesMap[role]);
                modulesList = [...modulesList, ...specialtiesMap[role]];
            } else {
                console.log(`No mapping found for "${role}", adding as-is`);
                modulesList.push(role);
            }
        });

        // Remove duplicates
        modulesList = [...new Set(modulesList)];
    }

    console.log('📚 Final modules list to display:', modulesList);
    console.log('Total modules:', modulesList.length);

    // Render Filter Chips (Categories)
    if (filterContainer) {
        let filterHTML = `<button class="filter-chip active" onclick="filterPensumByCategory('all')" style="background:var(--primary); color:white;">Todos</button>`;

        let userRoles = [];
        if (currentUser.id === 'admin') {
            userRoles = Object.keys(specialtiesMap);
        } else {
            userRoles = currentUser.specialties || [];
            if (userRoles.length === 0) {
                // Fallback Mapping based on ID
                if (currentUser.id === 'design') userRoles = ['Diseño Gráfico', 'Diseño para Redes Sociales'];
                else if (currentUser.id === 'multimedia') userRoles = ['Diseño Web', 'Edición de Video', 'Multimedia'];
                else if (currentUser.id === 'ai') userRoles = ['Inteligencia Artificial'];
                else if (currentUser.id === 'marketing') userRoles = ['Marketing Digital', 'Marketing 5.0'];
                else if (currentUser.id === 'excel') userRoles = ['Excel Empresarial', 'Experto en Excel'];
            }
        }

        userRoles.forEach(role => {
            let label = role;
            if (role === 'Diseño para Redes Sociales') label = 'Redes Sociales';
            filterHTML += `<button class="filter-chip" onclick="filterPensumByCategory('${role}')">${label}</button>`;
        });

        filterContainer.innerHTML = filterHTML;
    }

    // Initial Render
    renderModulesList(modulesList);
};



window.filterPensumByCategory = (category) => {
    // 1. Update Chips
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(c => {
        let match = false;
        if (category === 'all' && c.innerText === 'Todos') match = true;
        else if (c.getAttribute('onclick').includes(`'${category}'`) && category !== 'all') match = true;

        if (match) {
            c.style.background = 'var(--primary)';
            c.style.color = 'white';
            c.classList.add('active');
        } else {
            c.style.background = '#f1f5f9';
            c.style.color = '#64748b';
            c.classList.remove('active');
        }
    });

    // 2. Determine List based on Category
    let currentUser = window.currentUser || JSON.parse(localStorage.getItem('currentUser')) || { id: 'admin' };
    let specialtiesMap = window.specialties || GLOBAL_SPECIALTIES_MAP;

    let modulesToShow = [];

    if (category === 'all') {
        let userRoles = [];
        if (currentUser.id === 'admin') userRoles = Object.keys(specialtiesMap);
        else {
            userRoles = currentUser.specialties || [];
            if (userRoles.length === 0) {
                // Fallback Mapping based on ID (Same as above)
                if (currentUser.id === 'design') userRoles = ['Diseño Gráfico', 'Diseño para Redes Sociales'];
                else if (currentUser.id === 'multimedia') userRoles = ['Diseño Web', 'Edición de Video', 'Multimedia'];
                else if (currentUser.id === 'ai') userRoles = ['Inteligencia Artificial'];
                else if (currentUser.id === 'marketing') userRoles = ['Marketing Digital', 'Marketing 5.0'];
                else if (currentUser.id === 'excel') userRoles = ['Excel Empresarial', 'Experto en Excel'];
            }
        }

        userRoles.forEach(role => {
            if (specialtiesMap[role]) modulesToShow = [...modulesToShow, ...specialtiesMap[role]];
            else modulesToShow.push(role);
        });
    } else {
        if (specialtiesMap[category]) {
            modulesToShow = specialtiesMap[category];
        } else {
            modulesToShow = [category];
        }
    }

    modulesToShow = [...new Set(modulesToShow)];
    renderModulesList(modulesToShow, category);
};

window.togglePensumDetails = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const card = el.closest('.module-card');
    if (card.classList.contains('expanded')) card.classList.remove('expanded');
    else card.classList.add('expanded');
};
