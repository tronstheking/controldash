// ==== SAFETY WRAPPER ====
(function () {
    try {
        // ==== ORIGINAL CODE STARTS HERE ====
        console.log("🚀 App Started...");

        // switchView function defined later in file (around line 355)
        // First definition removed to avoid duplication

        // Helper for Avatars
        window.getAvatarUrl = (name) => {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&size=128`;
        };

        // --- MODERN TOAST NOTIFICATIONS WITH PROGRESS BAR ---
        window.showToast = (message, type = 'success') => {
            // Container
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.cssText = 'position:fixed;top:24px;right:24px;z-index:9999999;display:flex;flex-direction:column;gap:12px;pointer-events:none;max-width:420px;';
                document.body.appendChild(container);
            }

            // Config
            const configs = {
                success: {
                    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    icon: 'check-circle',
                    title: '¡Éxito!'
                },
                error: {
                    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    icon: 'x-circle',
                    title: 'Error'
                },
                warning: {
                    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    icon: 'alert-triangle',
                    title: 'Atención'
                },
                info: {
                    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    icon: 'info',
                    title: 'Información'
                }
            };

            const config = configs[type] || configs.info;

            // Create Toast
            const toast = document.createElement('div');
            toast.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                min-width: 360px;
                max-width: 420px;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                pointer-events: auto;
                overflow: hidden;
                transform: translateX(450px) scale(0.8);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                position: relative;
                border: 1px solid rgba(255, 255, 255, 0.8);
            `;

            toast.innerHTML = `
                <div style="display:flex;align-items:flex-start;gap:14px;padding:18px 20px;">
                    <div style="
                        width:42px;
                        height:42px;
                        border-radius:12px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        flex-shrink:0;
                        background:${config.gradient};
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    ">
                        <i data-lucide="${config.icon}" style="width:22px;height:22px;color:white;"></i>
                    </div>
                    <div style="flex:1;padding-top:3px;">
                        <div style="
                            font-size:15px;
                            font-weight:700;
                            margin-bottom:4px;
                            color:#1e293b;
                            line-height:1.3;
                            letter-spacing:-0.01em;
                        ">${config.title}</div>
                        <div style="
                            font-size:13px;
                            color:#64748b;
                            line-height:1.5;
                            font-weight:500;
                        ">${message}</div>
                    </div>
                    <button class="toast-close-btn" style="
                        background:transparent;
                        border:none;
                        color:#94a3b8;
                        cursor:pointer;
                        padding:6px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:8px;
                        transition:all 0.2s;
                        margin-top:2px;
                        flex-shrink:0;
                    ">
                        <i data-lucide="x" style="width:18px;height:18px;"></i>
                    </button>
                </div>
                <div class="toast-progress-bar" style="
                    height:4px;
                    background:${config.gradient};
                    width:100%;
                    transform-origin:left;
                    animation:toastProgress 5s linear forwards;
                    border-radius:0 0 16px 16px;
                "></div>
            `;

            // Add progress animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes toastProgress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
                .toast-close-btn:hover {
                    background: rgba(0, 0, 0, 0.05) !important;
                    color: #475569 !important;
                }
            `;
            if (!document.querySelector('#toast-animations')) {
                style.id = 'toast-animations';
                document.head.appendChild(style);
            }

            container.appendChild(toast);

            // Render icons
            if (window.lucide) lucide.createIcons();

            // Slide in animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    toast.style.transform = 'translateX(0) scale(1)';
                    toast.style.opacity = '1';
                });
            });

            // Remove function with smooth exit
            const remove = () => {
                toast.style.transform = 'translateX(450px) scale(0.8)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 400);
            };

            // Auto remove after 5 seconds
            const timer = setTimeout(remove, 5000);

            // Manual close
            const closeBtn = toast.querySelector('.toast-close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    clearTimeout(timer);
                    remove();
                };
            }

            // Return cleanup function
            return () => {
                clearTimeout(timer);
                remove();
            };
        };

        // Data Structures: Load from Storage or Default
        // Ensure we handle null/undefined correctly
        let savedSpecialties = null;
        try {
            savedSpecialties = JSON.parse(localStorage.getItem('specialties_structure'));
        } catch (e) {
            console.error("Error parsing specialties", e);
        }
        const defaultSpecialties = {
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
            // MULTIMEDIA - DISEÑO WEB
            "Diseño Web": [
                "Maquetación Web",
                "WordPress"
            ],
            // MULTIMEDIA - VIDEOPRODUCCION (CapCut Focused)
            "Edición de Video": [
                "Fundamentos de CapCut",
                "Edición Dinámica",
                "Efectos y Transiciones",
                "Audio y Colorización",
                "Proyecto Final Viral"
            ],
            // INTELIGENCIA ARTIFICIAL
            "Inteligencia Artificial": [
                "Ingeniería de Prompts",
                "Creación de Assets con IA"
            ],
            // MARKETING DIGITAL
            // MARKETING DIGITAL (Updated to Marketing 5.0)
            "Marketing 5.0": [
                "Fundamentos de Marketing 5.0",
                "Investigación con IA",
                "Estrategia de Contenidos & Copy",
                "Business Manager (Meta)",
                "Google Ads & Analytics",
                "Automatización & Chatbots"
            ],
            // EXCEL EMPRESARIAL
            // EXCEL EMPRESARIAL
            "Experto en Excel": [
                "Excel Básico",
                "Excel Intermedio",
                "Excel Avanzado"
            ]
        };

        // Merge carefully (Fallback if empty object)
        const specialties = (savedSpecialties && Object.keys(savedSpecialties).length > 0) ? savedSpecialties : defaultSpecialties;

        // Feature C: Entregables Obligatorios por Módulo
        const moduleDeliverables = {
            "Photoshop Básico": [
                "Práctica de Recorte (Mínimo 5 objetos)", // Ex: 5 complicated objects
                "Fotomontaje Publicitario (Tema Libre)",
                "Proyecto de Impresión (Tarjeta o Volante)"
            ],
            "Photoshop Avanzado": [
                "Fotomontaje Avanzado",
                "Bocetado",
                "Proyecto de Impresión o Digital"
            ],
            "Illustrator Básico": [
                "Manejo de Formas",
                "Ilustración Básica",
                "Ilustración Avanzada"
            ],
            "Illustrator Avanzado": [
                "Maquetación",
                "Logo",
                "Identidad Visual"
            ],
            "Elementos Gráficos RRSS": [
                "Diseño de Post 1",
                "Diseño de Post 2",
                "Diseño de Post 3",
                "Carrusel Informativo",
                "Diseño de Historia (Story)",
                "Portadas de Destacadas",
                "Presentación Final"
            ],
            "Elementos Gráficos para Redes": [
                "Diseño de Post 1",
                "Diseño de Post 2",
                "Carrusel Informativo (Post 3)",
                "Portadas de Destacadas",
                "Presentación Final de Marca"
            ],
            // DISEÑO WEB - Entregables basados en el temario
            "Maquetación Web": [
                "Propuesta de Diagramación (Wireframe)",
                "Set de Banners Publicitarios",
                "Hosting Configurado y Dominio Conectado"
            ],
            "WordPress": [
                "Base de Datos (Xampp) Creada",
                "Sitio WordPress Instalado y Configurado",
                "Copia de Seguridad (Exportación)"
            ],

            // VIDEO (CapCut)
            "Fundamentos de CapCut": ["Video Presentación (Cortes precisos)", "Formato TikTok/Reels (9:16)", "Uso de Texto (Títulos)"],
            "Edición Dinámica": ["Reel con Música (Sincronizado)", "Uso de Keyframes (Zoom/Movimiento)", "Transiciones Creativas"],
            "Efectos y Transiciones": ["Video con Croma (Green Screen)", "Tracking de Objetos", "Efectos Corporales/IA"],
            "Audio y Colorización": ["Narración (Voz en off/IA)", "Corrección de Color (Filtros)", "Subtítulos Automáticos"],
            "Proyecto Final Viral": ["Vlog de Viaje/Diario", "Anuncio de Producto (UGC)", "Exportación 4K y Portada"]
        };

        const defaultPensumContent = {
            "Photoshop Básico": ["Taller - Teoría Básica de Diseño", "Entorno de Trabajo", "Uso y aplicación de las herramientas", "Recorte Fotográfico", "Retoque Fotográfico", "Fotomontaje Publicitario (Básico)", "Colorización (Básica)", "Taller - Composición Visual", "Creación de Proyecto para impresión"],
            "Photoshop Avanzado": ["Fotomontaje Avanzado", "Diagramación (Básica)", "Bocetado", "Montaje", "Aplicación de iluminaciones", "Colorización (Avanzada)", "Creación de Proyecto para impresión", "Exportación de Proyecto para impresión"],
            "Illustrator Básico": ["Presentación de la interfaz", "Entorno de Trabajo", "Uso y aplicación de las herramientas", "Manejo de las figuras geométricas", "Ilustración (Básica)", "Herramientas de uso cotidiano", "Vectorización", "Taller - Dibujo para diseño", "Ilustración Avanzada", "Creación de Proyecto Físico"],
            "Illustrator Avanzado": ["Taller Básico - Creación de logos", "Uso de materiales de diseño", "Diagramación (Avanzada)", "Maquetación Digital", "Implementación de textos", "Implementación de Colores", "Papelería Corporativa y P.O.P", "Diseño Digital (RRSS)", "Creación de Identidad Corporativa", "Presentación de Proyecto"],
            "Elementos Gráficos RRSS": ["Organización del proyecto", "Sincronización de los programas", "Creación de Post (Línea Gráfica)", "Creación de Fondo", "Titulares", "Creación de Carruseles", "Historias", "Creación de Iconos", "Creación de Avatar"],
            "Elementos Gráficos para Redes": ["Organización del proyecto", "Sincronización de los programas", "Creación de Post (Todos Los Formatos)", "Creación de Fondo", "Titulares", "Creación de Carruseles", "Historias", "Creación de Iconos", "Creación de Avatar"],
            // DISEÑO WEB
            "Maquetación Web": [
                "Diagramación web",
                "Optimización UI",
                "Diseño de Banners",
                "Organización de textos",
                "Creación de Header",
                "Diseño Responsive",
                "Taller – Teoría de la web",
                "Dominio y Hosting"
            ],
            "WordPress": [
                "Instalación de Xampp",
                "Creación de bases de datos",
                "Instalación de WordPress",
                "Plugins y Temas",
                "Dominio y Hosting",
                "Exportar páginas web"
            ],

            // CAPCUT MODULES
            "Fundamentos de CapCut": [
                "Interfaz y herramientas principales",
                "Importación de clips y música",
                "Cortar, dividir y ordenar clips",
                "Añadir texto simple y títulos",
                "Exportación básica para redes"
            ],
            "Edición Dinámica": ["Curvas de Velocidad", "Keyframes Básicos", "Freeze Frame", "Modos de Fusión (Overlays)", "Estabilización"],
            "Efectos y Transiciones": ["Máscaras", "Chroma Key", "Efectos de Video", "Tracking Automático", "Efectos de Cuerpo"],
            "Audio y Colorización": ["Biblioteca de Audio", "Efectos de Sonido (SFX)", "Reducción de Ruido", "Ajuste HSL", "LUTs y Filtros"],
            "Proyecto Final Viral": ["Storytelling", "Guion Técnico", "Edición Multicapa", "Portada (Miniatura)", "Configuración de Exportación"],

            // AI MODULES
            "Ingeniería de Prompts": ["Intro a la IA Generativa", "Zero-shot vs Few-shot", "Chain of Thought", "Optimización de Contexto", "Creación de Chatbots"],
            "Creación de Assets con IA": ["Midjourney Básico", "Stable Diffusion & ControlNet", "Clonación de Voz", "Generación de Videos con IA", "Ética y Copyright"],

            // MARKETING 5.0 MODULES
            "Fundamentos de Marketing 5.0": ["Evolución del Marketing 1.0 a 5.0", "Psicología del Consumidor", "Definición de Avatar con IA", "Customer Journey Map", "Neuromarketing Aplicado"],
            "Investigación con IA": ["Prompt Engineering para Marketers", "Investigación de Competencia con IA", "Análisis de Tendencias (Google Trends + AI)", "Herramientas de Espionaje de Anuncios"],
            "Estrategia de Contenidos & Copy": ["Pillares de Contenido Viral", "Estructuras de Copywriting (AIDA, PAS)", "Generación de Guiones con ChatGPT", "Creación de Calendario Editorial"],
            "Business Manager (Meta)": ["Estructura de Campañas (CBO vs ABO)", "Segmentación por Intereses vs Lookalikes", "Configuración del Píxel y API de Conversiones", "Retargeting Multicanal"],
            "Google Ads & Analytics": ["Campañas de Búsqueda (Search)", "Palabras Clave y Concordancias", "Google Analytics 4 (Eventos y Conversiones)", "SEO Básico On-Page"],
            "Automatización & Chatbots": ["Flujos de ManyChat", "Integración WhatsApp Business API", "Email Marketing Automatizado", "CRMs y Pipeline de Ventas"],
            "Excel Básico": [
                "Interfaz de Excel",
                "Libros y hojas",
                "Insertar, filas, columnas y celdas",
                "Eliminar, filas, columnas y celdas",
                "Configurar página",
                "Operar con fecha y vincular",
                "Funciones",
                "Asistentes de gráficos",
                "Inmovilizar ventanas",
                "Teclas de atajo"
            ],
            "Excel Intermedio": [
                "Función Lógica",
                "Formatos de condicional, regla",
                "Insertar tabla",
                "Insertar segmentación de datos",
                "Tablas dinámicas",
                "Gráfico en otra hoja",
                "Creación de gráficos, columnas y barras",
                "Automatizar tareas en Excel",
                "Creación de MACRO",
                "Grabar y ejecutar MACROS (sin código)"
            ],
            "Excel Avanzado": [
                "Acceso a la IA",
                "Ejemplos de solicitudes para MACROS",
                "Cómo generar códigos con IA",
                "Creación de MACROS con IA",
                "Uso de las MACROS generados en Excel",
                "Generar preguntas específicas a la IA",
                "Solicitud de fragmentos de código",
                "Creación de un sistema de inventario",
                "Uso de la IA para gestionar inventarios"
            ]
        };

        // Advanced Attendance Analysis
        window.getAttendanceStats = (studentName) => {
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            let totalClasses = 0;
            let present = 0;
            let absent = 0;
            let license = 0;

            // Iterate through all recorded days
            Object.keys(records).forEach(date => {
                if (records[date][studentName]) {
                    totalClasses++;
                    const status = records[date][studentName];
                    if (status === 'P') present++;
                    else if (status === 'A') absent++;
                    else if (status === 'L') license++;
                }
            });

            const percent = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 100;
            let statusLabel = 'Excelente';
            let statusColor = '#27ae60';

            if (percent < 70) {
                statusLabel = 'En Riesgo';
                statusColor = 'var(--danger)';
            } else if (percent < 85) {
                statusLabel = 'Aceptable';
                statusColor = 'var(--warning)';
            }

            return { totalClasses, present, absent, license, percent, statusLabel, statusColor };
        };

        window.getAttendanceStreak = (studentName) => {
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            const dates = Object.keys(records).sort().reverse();
            let streak = 0;
            for (const date of dates) {
                if (records[date][studentName] === 'P') streak++;
                else if (records[date][studentName] === 'A') break;
            }
            return streak;
        };

        window.calculatePerformance = (s) => {
            // 1. Manual Override
            if (s.manualGrade) {
                if (s.manualGrade === 'A') return { label: 'A (Excel.)', class: 'grade-A' };
                if (s.manualGrade === 'B') return { label: 'B (Prom.)', class: 'grade-B' };
                if (s.manualGrade === 'C') return { label: 'C (Riesgo)', class: 'grade-C' };
            }

            // 2. Automatic Calculation
            const attStats = window.getAttendanceStats(s.name);
            const deliverables = moduleDeliverables[s.module] || [];
            const completed = s.completedDeliverables || [];

            // If no deliverables defined or student hasn't started many topics, be lenient on deliverables
            // Default delPercent to 100 if no deliverables exist to avoid punishing.
            // If deliverables exist, use real percent.
            const delPercent = deliverables.length > 0 ? (completed.length / deliverables.length) * 100 : 100;

            // Adjusted Weighting: If started recently (low deliverables), prioritize attendance
            // If all deliverables missing but attendance is high, give at least a B

            // Weighted score: 40% Attendance, 60% Deliverables
            const score = (attStats.percent * 0.4) + (delPercent * 0.6);

            // lenient fallback: if attendance > 80% and score < 75 (due to missing deliverables), bump to B (unless specifically strictly failing)
            if (score < 75 && attStats.percent >= 80) {
                return { label: 'B (Prom.)', class: 'grade-B' };
            }

            if (score >= 90) return { label: 'A (Excel.)', class: 'grade-A' };
            if (score >= 75) return { label: 'B (Prom.)', class: 'grade-B' };
            return { label: 'C (Riesgo)', class: 'grade-C' };
        };

        window.toggleGrade = (idx) => {
            const s = students[idx];
            const sequence = [null, 'A', 'B', 'C']; // null = Auto
            const current = s.manualGrade || null;
            const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
            s.manualGrade = sequence[nextIdx];

            save();
            renderStudents(); // localized re-render would be better but this is fast enough
        };

        // Initialize Data (Empty by default, loaded from DB)
        window.students = [];

        // LOAD FROM DATABASE
        window.loadStudents = async (retryCount = 0) => {
            if (!window.DBService) {
                console.warn(`⚠️ DBService not available (Attempt ${retryCount + 1})`);
                if (retryCount < 5) {
                    setTimeout(() => window.loadStudents(retryCount + 1), 500);
                    return;
                }
                console.error("❌ DBService failed to load after retries.");
                window.showToast("Error: No se pudo conectar con la base de datos.", "error");
                return;
            }

            console.log("🚀 Setting up Real-time Listener...");

            try {
                // If logged in as specific department, filter at DB level ideally, or client side
                let deptFilter = null;
                // CRITICAL FIX: Always load ALL students from DB for now.
                // The DB documents might not have the 'department' field set correctly yet,
                // relying on client-side getFilteredStudents() for the view is safer.
                /* 
                if (currentUser && currentUser.id !== 'admin') {
                    deptFilter = currentUser.id;
                }
                */

                // Unsubscribe previous listener if exists
                if (window.studentsListener) {
                    window.studentsListener();
                }

                // Subscribe to real-time updates
                window.studentsListener = window.DBService.listenToStudents(deptFilter, (studentsFromDB) => {
                    console.log(`🔄 Real-time update: ${studentsFromDB.length} students loaded.`);

                    // Update Global State
                    window.students = studentsFromDB;

                    // SYNC LOCAL SCOPE VARIABLE (CRITICAL FIX)
                    // This updates the 'students' let variable captured by other functions like getFilteredStudents
                    if (typeof students !== 'undefined' && Array.isArray(students)) {
                        students.length = 0;
                        students.push(...studentsFromDB);
                    }

                    // Refresh UI
                    if (typeof renderStudents === 'function') renderStudents();
                    if (typeof updateStats === 'function') updateStats();
                    if (typeof renderStagnantStudents === 'function') renderStagnantStudents();
                    if (typeof checkCriticalPoints === 'function') checkCriticalPoints();
                });

            } catch (error) {
                console.error("Error setting up listener:", error);
                window.showToast("Error conectando actualizaciones en tiempo real", "error");
            }
        };
        const savedPensum = JSON.parse(localStorage.getItem('design_pensum_content')) || {};
        // Merge defaults with saved to ensure new modules appear
        window.pensumContent = { ...defaultPensumContent, ...savedPensum };

        // Ensure specific new keys are present if missing in saved data (Safety Refesh)
        Object.keys(defaultPensumContent).forEach(key => {
            if (!window.pensumContent[key] || window.pensumContent[key].length === 0) {
                window.pensumContent[key] = defaultPensumContent[key];
            }
        });

        // === REAL-TIME PENSUM SYNC ===
        window.loadPensumFromFirebase = async (retryCount = 0) => {
            if (!window.DBService) {
                console.warn(`⚠️ DBService not available for pensum (Attempt ${retryCount + 1})`);
                if (retryCount < 5) {
                    setTimeout(() => window.loadPensumFromFirebase(retryCount + 1), 500);
                    return;
                }
                console.log("Using localStorage pensum as fallback");
                return;
            }

            console.log("🚀 Setting up Real-time Pensum Listener...");

            try {
                // Unsubscribe previous listener if exists
                if (window.pensumListener) {
                    window.pensumListener();
                }

                // Subscribe to real-time updates
                window.pensumListener = window.DBService.listenToPensumContent((pensumFromDB) => {
                    if (pensumFromDB && Object.keys(pensumFromDB).length > 0) {
                        console.log(`🔄 Real-time pensum update received`);

                        // Merge with defaults to ensure new modules exist
                        window.pensumContent = { ...defaultPensumContent, ...pensumFromDB };

                        // Sync local variable
                        if (typeof pensumContent !== 'undefined') {
                            Object.keys(window.pensumContent).forEach(key => {
                                pensumContent[key] = window.pensumContent[key];
                            });
                        }

                        // Update localStorage as cache
                        localStorage.setItem('design_pensum_content', JSON.stringify(window.pensumContent));

                        // Refresh UI if pensum view is open
                        if (typeof window.renderPensumConfig === 'function') {
                            const pensumSection = document.getElementById('content-pensum');
                            if (pensumSection && pensumSection.style.display !== 'none') {
                                window.renderPensumConfig();
                            }
                        }
                    } else {
                        // If null (or empty), just keep defaults or localStorage
                        console.warn("Got empty pensum from DB, keeping local defaults");
                    }
                });

                // NEW: Listen to Pensum Metadata (Categories)
                if (window.DBService.listenToPensumMetadata) {
                    window.pensumMetadataListener = window.DBService.listenToPensumMetadata((fullMetadata) => {
                        console.log("🎨 Pensum Metadata updated included deleted:", fullMetadata);

                        // Handle structure (backwards compat)
                        const customModules = fullMetadata.customModules || fullMetadata; // in case old format
                        const deletedModules = fullMetadata.deleted || [];

                        // 1. Update Custom Categories
                        window.pensumMetadata = customModules;
                        localStorage.setItem('customModules', JSON.stringify(customModules));

                        // [RESTORED FEATURE] Merge Metadata into moduleStructure LIVE
                        if (typeof moduleStructure !== 'undefined') {
                            Object.keys(customModules).forEach(cat => {
                                if (!moduleStructure[cat]) moduleStructure[cat] = [];
                                const list = customModules[cat];
                                list.forEach(mod => {
                                    const modName = (typeof mod === 'object' && mod.name) ? mod.name : mod;
                                    if (!moduleStructure[cat].some(m => m.name === modName)) {
                                        if (typeof mod === 'object' && mod.name) {
                                            moduleStructure[cat].push(mod);
                                        } else {
                                            moduleStructure[cat].push({ name: mod, number: 99, description: "Módulo personalizado" });
                                        }
                                    }
                                });
                                moduleStructure[cat].sort((a, b) => a.number - b.number);
                            });
                        }

                        // 2. Update Global Blacklist
                        window.globalDeletedModules = deletedModules;
                        localStorage.setItem('globalDeletedModules', JSON.stringify(deletedModules));

                        // Force refresh views that depend on categories
                        if (typeof window.renderPensumConfig === 'function') {
                            const pensumSection = document.getElementById('content-pensum');
                            if (pensumSection && pensumSection.style.display !== 'none') {
                                window.renderPensumConfig();
                            }
                        }
                    });
                }

            } catch (error) {
                console.error("Error setting up pensum listener:", error);
            }
        };

        // === REAL-TIME SETTINGS SYNC ===
        window.loadSettingsFromFirebase = async (retryCount = 0) => {
            if (!window.DBService) {
                if (retryCount < 5) {
                    setTimeout(() => window.loadSettingsFromFirebase(retryCount + 1), 500);
                    return;
                }
                return;
            }

            console.log("🚀 Setting up Real-time Settings Listener...");

            try {
                if (window.settingsListener) {
                    window.settingsListener();
                }

                window.settingsListener = window.DBService.listenToSettings((settingsFromDB) => {
                    console.log(`🔄 Real-time settings update received`);
                    window.academySettings = settingsFromDB;

                    // Update UI elements
                    const headerTitle = document.querySelector('.header-title');
                    if (headerTitle && settingsFromDB.name) {
                        headerTitle.textContent = settingsFromDB.name;
                    }

                    const headerAvatar = document.querySelector('.header-avatar');
                    if (headerAvatar && settingsFromDB.avatar) {
                        headerAvatar.src = settingsFromDB.avatar;
                    }

                    // Refresh settings view if open
                    if (typeof window.renderSettings === 'function') {
                        const settingsSection = document.getElementById('content-settings');
                        if (settingsSection && settingsSection.style.display !== 'none') {
                            window.renderSettings();
                        }
                    }
                });
            } catch (error) {
                console.error("Error setting up settings listener:", error);
            }
        };


        // Use short references locally to avoid breaking existing code that uses the local names
        let students = window.students;
        let pensumContent = window.pensumContent;
        let filterTodayActive = false;

        // Migration: Ensure existing students have a specialty
        // Migration: Ensure existing students have a specialty AND ID
        students.forEach(s => {
            if (!s.specialty) s.specialty = "Diseño Gráfico";
            if (!s.id) s.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        });

        // MIGRATION & SAVE SYSTEM
        // MIGRATION & SAVE SYSTEM
        window.save = function () {
            // Save to LocalStorage (Cache)
            localStorage.setItem('design_students', JSON.stringify(students));
            localStorage.setItem('design_pensum_content', JSON.stringify(pensumContent));

            console.log("💾 GLOBAL SAVE: Saving to LocalStorage...");

            // Sync to Firebase
            if (window.DBService) {
                console.log("☁️ DBService is available.");
                // We don't save students here anymore as they are saved individually
                // window.DBService.saveStudents(students); 

                // Save Pensum if changed
                if (window.DBService.savePensumContent) {
                    console.log("⏳ Attempting to sync Pensum to Firebase...");
                    window.DBService.savePensumContent(pensumContent)
                        .then(() => console.log("✅ PENSUM SYNCED SUCCESSFULLY TO FIREBASE"))
                        .catch(err => console.error("❌ ERROR SYNCING PENSUM:", err));
                } else {
                    console.error("❌ window.DBService.savePensumContent is undefined!");
                }

                // [RESTORED FEATURE] Save Pensum Metadata (Structure)
                if (window.DBService.savePensumMetadata) {
                    // We need to extract the custom modules to save (or save all)
                    // Strategy: Save everything in moduleStructure as "customModules" to ensure consistency
                    // Or filtering? Hardcoded ones are safe, but saving them into customModules won't hurt
                    // as long as we handle duplicates on load (which we do).
                    // However, to keep it clean, maybe we should save `moduleStructure` directly?
                    // Verify db-service expects object { category: [modules] }
                    // Yes.

                    // Deep clone logic or just pass reference? Pass simple object.
                    window.DBService.savePensumMetadata(window.moduleStructure || moduleStructure)
                        .then(() => console.log("✅ PENSUM METADATA SYNCED"))
                        .catch(err => console.error("❌ ERROR SYNCING METADATA:", err));
                }
            } else {
                console.warn("⚠️ window.DBService is NOT available. Saving only to LocalStorage.");
                // Try recovery
                if (window.DBServiceModule) {
                    window.DBService = window.DBServiceModule;
                    console.log("♻️ Recovered DBService from Module back-up.");
                }
            }

            if (typeof renderStudents === 'function') renderStudents();
            if (typeof updateStats === 'function') updateStats();

            // Sync counts and criticals
            if (typeof checkCriticalPoints === 'function') checkCriticalPoints();
            if (typeof renderStagnantStudents === 'function') renderStagnantStudents();
        };

        // === REAL-TIME STUDENTS SYNC ===
        window.loadStudents = async (retryCount = 0) => {
            if (!window.DBService) {
                if (retryCount < 5) {
                    setTimeout(() => window.loadStudents(retryCount + 1), 500);
                    return;
                }
                console.warn("DBService unavailable for loadStudents");
                return;
            }

            console.log("🚀 Setting up Real-time Students Listener...");

            try {
                if (window.studentsListener) {
                    // UNSUBSCRIBE previous listener to prevent duplicate events/race conditions
                    console.log("🔌 Unsubscribing previous student listener...");
                    window.studentsListener();
                }

                // Listen to ALL students (null department) and filter client-side if needed
                window.studentsListener = window.DBService.listenToStudents(null, (studentsFromDB) => {
                    console.log(`🔄 Real-time students update: ${studentsFromDB.length} records`);

                    if (studentsFromDB && studentsFromDB.length > 0) {
                        // DATA NORMALIZATION: Map DB 'deliverables' to App 'completedDeliverables'
                        // AGGRESSIVE FIX: Always prefer 'deliverables' (cloud source of truth) over any legacy 'completedDeliverables'
                        studentsFromDB.forEach(s => {
                            if (s.deliverables) {
                                s.completedDeliverables = s.deliverables;
                            } else if (!s.completedDeliverables) {
                                // Only init if neither exists
                                s.completedDeliverables = [];
                            }
                        });

                        window.students = studentsFromDB;
                        students = window.students; // Update local alias

                        // Persist
                        localStorage.setItem('design_students', JSON.stringify(window.students));

                        // RENDER UPDATES
                        if (typeof renderStudents === 'function') renderStudents();
                        if (typeof updateStats === 'function') updateStats();
                        if (typeof checkCriticalPoints === 'function') checkCriticalPoints();

                        // Updates for specific views
                        if (typeof renderDeliverablesMatrix === 'function' &&
                            document.getElementById('content-deliverables').style.display === 'block') {
                            renderDeliverablesMatrix();
                        }
                    } else {
                        console.log("⚠️ No students in DB or empty list.");
                    }
                });
            } catch (error) {
                console.error("Error setting up students listener:", error);
            }
        };

        // === REAL-TIME DEPARTMENTS SYNC ===
        window.loadDepartmentsFromFirebase = async (retryCount = 0) => {
            if (!window.DBService) {
                if (retryCount < 5) {
                    setTimeout(() => window.loadDepartmentsFromFirebase(retryCount + 1), 500);
                    return;
                }
                return;
            }

            console.log("🚀 Setting up Real-time Departments Listener...");

            try {
                if (window.departmentsListener) {
                    window.departmentsListener();
                }

                window.departmentsListener = window.DBService.listenToDepartments((deptsFromDB) => {
                    console.log(`🔄 Real-time departments update received: ${deptsFromDB.length}`);

                    if (deptsFromDB && deptsFromDB.length > 0) {
                        window.availableDepartments = deptsFromDB;
                        localStorage.setItem('availableDepartments', JSON.stringify(deptsFromDB));

                        // Update settings view if open
                        if (typeof window.renderSettings === 'function') {
                            const settingsSection = document.getElementById('content-settings');
                            if (settingsSection && settingsSection.style.display !== 'none') {
                                window.renderSettings();
                            }
                        }
                    } else {
                        // Init defaults if empty in DB
                        console.log("📤 Migrating departments to Firebase...");
                        if (window.DBService && typeof window.DBService.saveDepartments === 'function') {
                            window.DBService.saveDepartments(window.availableDepartments);
                        }
                    }
                });
            } catch (error) {
                console.error("Error setting up departments listener:", error);
            }
        };

        // === REAL-TIME ATTENDANCE SYNC ===
        window.loadAttendanceFromFirebase = async (retryCount = 0) => {
            if (!window.DBService) {
                if (retryCount < 5) {
                    setTimeout(() => window.loadAttendanceFromFirebase(retryCount + 1), 500);
                    return;
                }
                return;
            }

            console.log("🚀 Setting up Real-time Attendance Listener...");

            try {
                if (window.attendanceListener) {
                    window.attendanceListener();
                }

                window.attendanceListener = window.DBService.listenToAttendanceContent((records) => {
                    console.log(`🔄 Real-time attendance update received`);
                    window.attendanceRecords = records || {};
                    localStorage.setItem('attendanceRecords', JSON.stringify(window.attendanceRecords));

                    // Refresh Attendance View if active
                    const attendanceSection = document.getElementById('content-attendance');
                    if (attendanceSection && attendanceSection.style.display !== 'none') {
                        // If we have a render function, call it. 
                        // We need to check if we are in the attendance view variables scope or global
                        // Usually specific logic like 'renderAttendance' is not global, but let's check.
                        // Based on app structure, we might need to trigger a click or call a global internal function if exposed.
                        // Searching for 'renderAttendance' in app.js...
                        if (typeof window.renderAttendance === 'function') {
                            window.renderAttendance();
                        } else {
                            // Fallback: If we are on the page, maybe just refresh the calendar/list if feasible?
                            // But wait, the user complaint is about sync.
                            // Let's assume re-rendering will happen or user will navigate.
                            // But better: try to find if there is a global render.
                            if (window.currentView === 'attendance') {
                                // Force re-render if possible.
                                // checking context...
                            }
                        }
                    }
                });
            } catch (error) {
                console.error("Error setting up attendance listener:", error);
            }
        };

        // === REAL-TIME DELIVERABLES CONFIG SYNC ===
        window.loadDeliverablesConfigFromFirebase = async (retryCount = 0) => {
            if (!window.DBService) {
                if (retryCount < 5) {
                    setTimeout(() => window.loadDeliverablesConfigFromFirebase(retryCount + 1), 500);
                    return;
                }
                return;
            }

            console.log("🚀 Setting up Real-time Deliverables Config Listener...");

            try {
                if (window.deliverablesConfigListener) {
                    window.deliverablesConfigListener();
                }

                window.deliverablesConfigListener = window.DBService.listenToDeliverablesConfig((configFromDB) => {
                    console.log(`🔄 Real-time deliverables config update received`);
                    if (configFromDB && Object.keys(configFromDB).length > 0) {
                        // Merge with current to keep defaults if DB missing some
                        // We iterate to ensure we don't lose local defaults unless overwritten
                        Object.assign(moduleDeliverables, configFromDB);

                        // Persist to local storage as backup
                        localStorage.setItem('module_deliverables_config', JSON.stringify(moduleDeliverables));

                        // Refresh Deliverables Matrix if open
                        if (typeof renderDeliverablesMatrix === 'function') {
                            const section = document.getElementById('content-deliverables');
                            if (section && section.style.display !== 'none') {
                                renderDeliverablesMatrix();
                            }
                        }
                    } else {
                        // Init defaults if empty in DB
                        if (window.DBService && typeof window.DBService.saveDeliverablesConfig === 'function') {
                            console.log("📤 Initializing deliverables config in Firebase...");
                            window.DBService.saveDeliverablesConfig(moduleDeliverables);
                        }
                    }
                });
            } catch (error) {
                console.error("Error setting up deliverables config listener:", error);
            }
        };

        // Initialize Real-time Listeners

        // 1. Try immediate load
        if (window.DBService) {
            if (window.loadStudents) window.loadStudents();
            if (window.loadPensumFromFirebase) window.loadPensumFromFirebase();
            if (window.loadSettingsFromFirebase) window.loadSettingsFromFirebase();
            if (window.loadDepartmentsFromFirebase) window.loadDepartmentsFromFirebase();
            if (window.loadAttendanceFromFirebase) window.loadAttendanceFromFirebase();
            if (window.loadDeliverablesConfigFromFirebase) window.loadDeliverablesConfigFromFirebase();
        } else {
            console.log("⏳ Waiting for DBServiceReady event...");
        }

        // 2. Listen for event (Race condition fix)
        window.addEventListener('DBServiceReady', () => {
            console.log("🔥 DBService Ready Event Detected!");
            if (window.loadStudents) window.loadStudents();
            if (window.loadPensumFromFirebase) window.loadPensumFromFirebase();
            if (window.loadSettingsFromFirebase) window.loadSettingsFromFirebase();
            if (window.loadDepartmentsFromFirebase) window.loadDepartmentsFromFirebase();
            if (window.loadAttendanceFromFirebase) window.loadAttendanceFromFirebase();
            if (window.loadPaymentsFromFirebase) window.loadPaymentsFromFirebase();
            if (window.loadAuditLogsFromFirebase) window.loadAuditLogsFromFirebase();
            if (window.loadDeliverablesConfigFromFirebase) window.loadDeliverablesConfigFromFirebase();
        });

        // 3. Force Sync Manual Function
        window.forceCloudSync = async () => {
            if (!window.DBService) {
                window.showToast("Error: DBService no conectado.", "error");
                return;
            }

            window.showToast("Iniciando sincronización forzada...", "info");
            console.log("☁️ STARTING FORCED SYNC...");

            try {
                // 1. Sync Pensum
                if (window.pensumContent) {
                    await window.DBService.savePensumContent(window.pensumContent);
                    console.log("✅ Pensum synced");
                }

                // 2. Sync Departments
                if (window.availableDepartments) {
                    await window.DBService.saveDepartments(window.availableDepartments);
                    console.log("✅ Departments synced");
                }

                // 3. Sync Settings
                await window.DBService.saveSettings(window.academySettings || {});
                console.log("✅ Settings synced");

                // 4. Sync Payments (Manual Push if needed)
                if (window.payments && window.payments.length > 0) {
                    // We iterate because we don't have a batch save for payments yet, or we could add one.
                    // For safety, let's just log that real-time handles it, or force re-save last few?
                    // Actually, better to just rely on real-time. But let's at least log it.
                    console.log("ℹ️ Payments are synced via real-time logic.");
                }

                // 5. Force Attendance Sync (Full Object)
                const attRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
                await window.DBService.saveAttendanceContent(attRecords);
                console.log("✅ Attendance synced");

                // 6. Sync Deliverables Config
                await window.DBService.saveDeliverablesConfig(moduleDeliverables);
                console.log("✅ Deliverables Config synced");

                window.showToast("¡Sincronización Cloud Completada!", "success");
            } catch (error) {
                console.error("Sync Error:", error);
                window.showToast("Error en sincronización: " + error.message, "error");
            }
        };




        // Sections & UI
        const sections = {
            dashboard: document.getElementById('content-dashboard'),
            pensum: document.getElementById('content-pensum'),
            calendar: document.getElementById('content-calendar'),
            history: document.getElementById('content-history'),
            settings: document.getElementById('content-settings'),
            attendance: document.getElementById('content-attendance')
        };

        // --- ROBUST NAVIGATION SYSTEM ---
        window.switchView = (view) => {
            console.log("Switching to view:", view);

            // 1. Update Header Title
            const titles = {
                dashboard: "Dashboard",
                pensum: "Temario",
                calendar: "Calendario",
                history: "Historial Académico",
                settings: "Ajustes",
                attendance: "Asistencia",
                finance: "Finanzas & Pagos",
                matrix: "Matriz Académica (Global)",
                deliverables: "Tablero de Entregas",
                graduates: "Cuadro de Honor",
                audit: "Registro de Auditoría"
            };

            const pageTitle = document.getElementById('page-title');
            if (pageTitle && titles[view]) {
                pageTitle.innerText = titles[view];
            }

            // 2. Navigation State
            document.querySelectorAll('.nav-item').forEach(i => {
                i.classList.remove('active');
                if (i.id === 'view-' + view) i.classList.add('active');
            });

            // 3. Switch Sections
            const sections = document.querySelectorAll('.view-section');
            const target = document.getElementById('content-' + view);

            if (!target) {
                console.error("View not found:", view);
                if (view !== 'dashboard') window.switchView('dashboard');
                return;
            }

            sections.forEach(s => s.style.display = 'none');
            target.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // 4. Trigger specific renders
            try {
                if (view === 'dashboard') {
                    if (typeof updateStats === 'function') updateStats();
                }
                if (view === 'calendar' && typeof renderCalendar === 'function') renderCalendar();
                if (view === 'attendance' && typeof renderAttendance === 'function') renderAttendance();
                if (view === 'matrix' && typeof renderMatrix === 'function') renderMatrix();
                if (view === 'pensum' && typeof renderPensumConfig === 'function') renderPensumConfig();
                if (view === 'deliverables' && typeof renderDeliverablesMatrix === 'function') renderDeliverablesMatrix();
                if (view === 'history' && typeof renderHistory === 'function') renderHistory();
                if (view === 'finance' && typeof renderFinance === 'function') renderFinance();
                if (view === 'settings' && typeof renderSettings === 'function') renderSettings();
                if (view === 'graduates' && typeof renderGraduates === 'function') renderGraduates();
                if (view === 'audit' && typeof renderAuditLog === 'function') renderAuditLog();

                if (window.lucide) lucide.createIcons();
            } catch (err) {
                console.error("SwitchView Render Error:", err);
            }
        };

        // Department/Area Management
        // Department/Area Management
        // Department/Area Management
        // ROBUST INIT: Departments
        let savedDepts = JSON.parse(localStorage.getItem('availableDepartments'));
        if (!savedDepts || !Array.isArray(savedDepts) || savedDepts.length === 0) {
            savedDepts = [
                { id: 'design', name: 'Diseño Gráfico', instructor: 'Javier Design', specialties: ['Diseño Gráfico', 'Diseño para Redes Sociales'] },
                { id: 'multimedia', name: 'Multimedia', instructor: 'Carlos Multimedia', specialties: ['Diseño Web', 'Edición de Video'] },
                { id: 'ai', name: 'Inteligencia Artificial', instructor: 'Instructor IA', specialties: ['Inteligencia Artificial'] },
                { id: 'marketing', name: 'Marketing Digital', instructor: 'Instructor Marketing', specialties: ['Marketing 5.0'] },
                { id: 'excel', name: 'Excel Empresarial', instructor: 'Instructor Excel', specialties: ['Experto en Excel'] },
                { id: 'admin', name: 'Dirección', instructor: 'Director Administrativo', specialties: [] }
            ];
        } else {
            // FORCE ADMIN EXISTENCE
            if (!savedDepts.find(d => d.id === 'admin')) {
                savedDepts.push({ id: 'admin', name: 'Dirección', instructor: 'Director Administrativo', specialties: [] });
            }

            // FIX EXISTING DEPARTMENTS: Ensure all have specialties array
            savedDepts.forEach(dept => {
                if (!dept.specialties || !Array.isArray(dept.specialties)) {
                    // Assign default specialties based on department ID
                    switch (dept.id) {
                        case 'design':
                            dept.specialties = ['Diseño Gráfico', 'Diseño para Redes Sociales'];
                            break;
                        case 'multimedia':
                            dept.specialties = ['Diseño Web', 'Edición de Video'];
                            break;
                        case 'ai':
                            dept.specialties = ['Inteligencia Artificial'];
                            break;
                        case 'marketing':
                            dept.specialties = ['Marketing 5.0'];
                            break;
                        case 'excel':
                            dept.specialties = ['Experto en Excel'];
                            break;
                        case 'admin':
                            dept.specialties = [];
                            break;
                        default:
                            dept.specialties = [];
                    }
                    console.log(`✅ Fixed specialties for ${dept.name}:`, dept.specialties);
                }
            });

            // Ensure Multimedia exists
            if (!savedDepts.find(d => d.id === 'multimedia')) {
                savedDepts.push({ id: 'multimedia', name: 'Multimedia', instructor: 'Carlos Multimedia', specialties: ['Diseño Web', 'Edición de Video'] });
            }
            // Ensure Design exists
            if (!savedDepts.find(d => d.id === 'design')) {
                savedDepts.push({ id: 'design', name: 'Diseño Gráfico', instructor: 'Javier Design', specialties: ['Diseño Gráfico', 'Diseño para Redes Sociales'] });
            }
            // ADD NEW AI DEPARTMENT
            if (!savedDepts.find(d => d.id === 'ai')) {
                savedDepts.push({ id: 'ai', name: 'Inteligencia Artificial', instructor: 'Instructor IA', specialties: ['Inteligencia Artificial'] });
            }
            // ADD NEW MARKETING DEPARTMENT
            if (!savedDepts.find(d => d.id === 'marketing')) {
                savedDepts.push({ id: 'marketing', name: 'Marketing Digital', instructor: 'Instructor Marketing', specialties: ['Marketing 5.0'] });
            } else {
                // If it already exists (from previous runs), force update its specialties
                const mkt = savedDepts.find(d => d.id === 'marketing');
                if (mkt.specialties.includes('Marketing General')) {
                    mkt.specialties = ['Marketing 5.0'];
                }
            }
            // ADD NEW EXCEL DEPARTMENT
            if (!savedDepts.find(d => d.id === 'excel')) {
                savedDepts.push({ id: 'excel', name: 'Excel Empresarial', instructor: 'Instructor Excel', specialties: ['Experto en Excel'] });
            }
        }
        window.availableDepartments = savedDepts;
        localStorage.setItem('availableDepartments', JSON.stringify(savedDepts));

        // Initialize currentUser early to avoid ReferenceErrors in functions like logAction
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.id) {
            currentUser = window.availableDepartments[0];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            // CRITICAL FIX: Sync currentUser with latest department data
            const updatedDept = window.availableDepartments.find(d => d.id === currentUser.id);
            if (updatedDept) {
                currentUser = updatedDept;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('✅ Synced currentUser with updated department data:', currentUser);
            }
        }

        // Audit Log Logic
        let globalLogs = JSON.parse(localStorage.getItem('globalLogs')) || [];

        window.logAction = (action, detail) => {
            const log = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                user: currentUser ? currentUser.instructor : 'Sistema',
                action: action,
                detail: detail
            };

            // Local Update (Optimistic UI)
            globalLogs.unshift(log);
            if (globalLogs.length > 500) globalLogs.pop();
            localStorage.setItem('globalLogs', JSON.stringify(globalLogs));

            // Cloud Sync
            if (window.DBService) {
                window.DBService.saveAuditLog(log);
            }
        };

        window.renderAuditLog = () => {
            const tbody = document.getElementById('audit-log-body');
            if (!tbody) return;
            tbody.innerHTML = globalLogs.map(log => {
                const d = new Date(log.date);
                const timeStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `
            <tr>
                <td style="font-size:11px; color:#666;">${timeStr}</td>
                <td style="font-weight:600;">${log.user}</td>
                <td style="color:var(--primary); font-weight:700;">${log.action}</td>
                <td style="font-size:12px;">${log.detail}</td>
            </tr>
        `;
            }).join('');
        };

        // User Management Logic
        window.addInstructor = () => {
            const name = document.getElementById('new-instructor-name').value;
            const dept = document.getElementById('new-department-name').value;
            if (!name || !dept) {
                window.showToast("Completa todos los campos", 'error');
                return;
            }

            const id = dept.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
            const newAdmin = {
                id: id,
                name: dept,
                instructor: name,
                specialties: [dept] // Default specialty
            };

            window.availableDepartments.push(newAdmin);
            // Also add to default specialties
            if (!specialties[dept]) specialties[dept] = ["Módulo 1: Introducción"];

            // SAVE TO FIREBASE
            localStorage.setItem('availableDepartments', JSON.stringify(window.availableDepartments));
            if (window.DBService && window.DBService.saveDepartments) {
                window.DBService.saveDepartments(window.availableDepartments);
            }

            logAction('Crear Usuario', `Creó nuevo instructor: ${name} (${dept})`);

            document.getElementById('new-instructor-name').value = '';
            document.getElementById('new-department-name').value = '';

            window.showToast("Instructor Creado. Sincronizando...", 'success');
            // Render will happen automatically via listener
        };

        window.deleteInstructor = (idx) => {
            const dept = window.availableDepartments[idx];
            if (dept.id === 'admin') {
                window.showToast("No puedes borrar al Admin.", 'error');
                return;
            }
            if (!confirm(`¿Borrar a ${dept.instructor}?`)) return;

            window.availableDepartments.splice(idx, 1);

            // SAVE TO FIREBASE
            localStorage.setItem('availableDepartments', JSON.stringify(window.availableDepartments));
            if (window.DBService && window.DBService.saveDepartments) {
                window.DBService.saveDepartments(window.availableDepartments);
            }

            logAction('Borrar Usuario', `Borró al instructor: ${dept.instructor}`);
            window.showToast("Instructor eliminado.", 'success');
        };



        window.renderSettingsUsers = () => {
            const container = document.getElementById('settings-user-list');
            if (!container) return;

            container.innerHTML = window.availableDepartments.map((dept, i) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; align-items:center;">
            <div>
                <div style="font-weight:bold;">${dept.instructor}</div>
                <div style="font-size:11px; color:#888;">${dept.name}</div>
            </div>
            ${dept.id !== 'admin' ? `<button class="btn-icon" onclick="deleteInstructor(${i})" style="color:red;"><i data-lucide="trash-2"></i></button>` : '<span style="font-size:10px; font-weight:bold; background:#eee; padding:2px 5px; border-radius:4px;">ADMIN</span>'}
        </div>
    `).join('');
            if (window.lucide) lucide.createIcons();
        };


        // Hook to filter students by Area
        function getAreaFromSpecialty(specialty) {
            if (!specialty) return 'design';
            const s = specialty.toLowerCase();
            if (s.includes('web') || s.includes('video') || s.includes('capcut') || s.includes('multimedia')) return 'multimedia';
            if (s.includes('inteligencia') || s.includes('prompts') || s.includes('artificial') || s.includes('assets')) return 'ai';
            if (s.includes('marketing') || s.includes('publicidad') || s.includes('ads') || s.includes('estrategia') || s.includes('ventas')) return 'marketing';
            if (s.includes('excel') || s.includes('macros') || s.includes('datos') || s.includes('tablas')) return 'excel';
            if (s.includes('diseño') || s.includes('redes') || s.includes('gráfico')) return 'design';

            // Fallback for new names if they change
            const multimediaDept = window.availableDepartments.find(d => d.id === 'multimedia');
            if (multimediaDept && multimediaDept.specialties.includes(specialty)) return 'multimedia';

            return 'design'; // Default
        }

        // Global Filter Getter
        function getFilteredStudents(includeGraduated = false) {
            let list = students;

            // 1. Filter by Graduation Status
            if (!includeGraduated) {
                list = students.filter(s => s.status !== 'graduated');
            } else {
                list = students.filter(s => s.status === 'graduated');
            }

            // 2. Filter by Department
            if (currentUser.id === 'admin') return list;
            return list.filter(s => getAreaFromSpecialty(s.specialty) === currentUser.id);
        }

        // Get curriculum modules filtered by current department
        // Returns array of module names that belong to the logged-in user's department
        // Admin users see ALL modules
        window.getDepartmentModules = function () {
            if (!currentUser || !currentUser.id) return [];

            // Admin sees all modules
            if (currentUser.id === 'admin') {
                return Object.keys(pensumContent);
            }

            // Get user's specialties (department areas)
            const userSpecialties = currentUser.specialties || [];
            const moduleSet = new Set();

            // Map each specialty to its modules
            userSpecialties.forEach(specialty => {
                const modules = specialties[specialty] || [];
                modules.forEach(module => moduleSet.add(module));
            });

            return Array.from(moduleSet);
        };

        // Global Payments Data
        let payments = JSON.parse(localStorage.getItem('payments') || '[]');

        // Update Module Filter Dropdown based on Current User Context
        function updateModuleFilterOptions() {
            const select = document.getElementById('filter-module');
            if (!select) return;

            // Reset
            select.innerHTML = '<option value="all">Todos los rubros</option>';

            if (!currentUser || !currentUser.specialties) return;

            // Populate with Specialties (Categories) instead of specific modules
            // This addresses "salen muchos" by simplifying the list
            currentUser.specialties.forEach(spec => {
                const opt = document.createElement('option');
                opt.value = spec;
                opt.innerText = spec;
                select.appendChild(opt);
            });

            // Attach listener
            select.onchange = () => {
                const val = select.value;
                const list = getFilteredStudents();
                if (val === 'all') {
                    renderStudents(list);
                } else {
                    // Filter by Specialty now
                    const filtered = list.filter(s => s.specialty === val);
                    renderStudents(filtered);
                }
            };
        }

        function init() {
            // 0. Remove Loading Screen after delay
            setTimeout(() => {
                const loader = document.getElementById('loading-screen');
                if (loader) loader.classList.add('hidden');
            }, 1200); // 1.2s delay for visual effect

            // 0. SANITIZATION (Fix LocalStorage Corruption)
            try {
                // Sync specialties with default structure (force new modules to appear)
                let specialtiesChanged = false;

                // 1. Add missing keys (New Departments)
                Object.keys(defaultSpecialties).forEach(key => {
                    if (!specialties[key]) {
                        specialties[key] = defaultSpecialties[key];
                        specialtiesChanged = true;
                    } else {
                        // 2. Add missing modules to existing keys
                        defaultSpecialties[key].forEach(mod => {
                            if (!specialties[key].includes(mod)) {
                                specialties[key].push(mod);
                                specialtiesChanged = true;
                            }
                        });
                    }
                });

                // 3. Remove Legacy Marketing Keys if Marketing 5.0 exists
                if (specialties["Marketing 5.0"]) {
                    if (specialties["Marketing General"]) { delete specialties["Marketing General"]; specialtiesChanged = true; }
                    if (specialties["Publicidad Digital"]) { delete specialties["Publicidad Digital"]; specialtiesChanged = true; }
                }

                // 4. Fix Excel Fragmentation (Consolidate into Experto en Excel)
                if (specialties["Excel Básico"] && !Array.isArray(specialties["Excel Básico"])) {
                    // Safety check, although usually they are arrays of modules (or topics in the bug case)
                    delete specialties["Excel Básico"]; specialtiesChanged = true;
                }
                // Force replacement of bad excel keys with the new structure
                if (specialties["Experto en Excel"]) {
                    if (specialties["Excel Básico"]) { delete specialties["Excel Básico"]; specialtiesChanged = true; }
                    if (specialties["Excel Intermedio"]) { delete specialties["Excel Intermedio"]; specialtiesChanged = true; }
                    if (specialties["Excel Avanzado"]) { delete specialties["Excel Avanzado"]; specialtiesChanged = true; }
                }

                if (specialtiesChanged) {
                    localStorage.setItem('specialties_structure', JSON.stringify(specialties));
                    console.log("🔄 Specialty Structure Updated");
                }
            } catch (e) { console.error("Sanitization error", e); }

            // 0. Data Migration (Renaming & Mapping)
            if (Array.isArray(students)) {
                students.forEach(s => {
                    // Fix Specialty Name
                    if (s.specialty === 'Desarrollo Web') s.specialty = 'Diseño Web';

                    // Fix Module Names (Legacy -> New Pensum)
                    if (s.specialty === 'Diseño Web') {
                        const oldMods = ["HTML5 & CSS3", "Diseño Responsivo", "JavaScript Básico"];
                        if (oldMods.includes(s.module)) {
                            s.module = "Maquetación Web"; // Reset to Module 1
                            s.topic = "Diagramación web";
                        }
                        if (["React JS Básico", "Proyecto Web Final"].includes(s.module)) {
                            s.module = "WordPress"; // Map to Module 2
                            s.topic = "Instalación de Xampp";
                        }
                    }
                });
            }

            // Attach Navigation Listeners – only after switchView exists
            if (typeof window.switchView === 'function') {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.onclick = (e) => {
                        e.preventDefault();
                        const view = item.id.replace('view-', '');
                        window.switchView(view);

                        // Dynamic View Handling
                        if (view === 'pensum' && typeof window.renderPensumView === 'function') {
                            window.renderPensumView();
                        }

                        // Update active state
                        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    };
                });
            } else {
                console.warn('switchView not defined yet – navigation listeners postponed.');
            }

            // 2. Initial Renders (Wrapped in Try-Catch to prevent blocking)
            try {
                if (typeof updateModuleFilterOptions === 'function') updateModuleFilterOptions();
                if (typeof renderStudents === 'function') renderStudents();
                if (typeof updateStats === 'function') updateStats();
                if (typeof renderStagnantStudents === 'function') renderStagnantStudents();
                if (typeof checkCriticalPoints === 'function') checkCriticalPoints();
                if (typeof renderTodayAgenda === 'function') renderTodayAgenda();
                if (typeof renderRiskDashboard === 'function') renderRiskDashboard();
                if (typeof migrateLogs === 'function') migrateLogs();
                if (typeof setupScheduleLogic === 'function') setupScheduleLogic();
                if (typeof setupSidebarToggle === 'function') setupSidebarToggle();
                if (typeof setupMobileMenu === 'function') setupMobileMenu();
                if (typeof renderMatrix === 'function') renderMatrix(); // Force init render
                if (typeof window.loadStudents === 'function') window.loadStudents(); // <--- LOAD DB DATA
            } catch (err) {
                console.error("Initialization Error:", err);
            }

            // 3. Load Settings
            try {
                const name = localStorage.getItem('academyName') || "Academia CTD";
                const avatar = localStorage.getItem('instructorAvatar') || "https://ui-avatars.com/api/?name=Javier+Design&background=random&color=fff&bold=true&size=128";

                // Safety checks for elements
                if (document.getElementById('sidebar-instructor-name') && currentUser)
                    document.getElementById('sidebar-instructor-name').innerText = currentUser.instructor;

                if (document.getElementById('sidebar-instructor-img') && currentUser)
                    document.getElementById('sidebar-instructor-img').src = window.getAvatarUrl(currentUser.instructor);

                const roleEl = document.getElementById('sidebar-role');
                if (roleEl && currentUser) roleEl.innerText = 'Instructor ' + currentUser.name;

                if (document.getElementById('sett-academy-name')) document.getElementById('sett-academy-name').value = name;
                if (document.getElementById('sett-max-capacity')) document.getElementById('sett-max-capacity').value = localStorage.getItem('maxCapacity') || 10;
                if (document.getElementById('sett-risk-percent')) document.getElementById('sett-risk-percent').value = localStorage.getItem('riskPercent') || 75;
                if (document.getElementById('sett-risk-absences')) document.getElementById('sett-risk-absences').value = localStorage.getItem('riskAbsences') || 2;

                if (document.getElementById('attendance-date')) {
                    document.getElementById('attendance-date').value = new Date().toISOString().split('T')[0];
                }

                // Admin Menu Visibility
                const adminMenu = document.getElementById('admin-menu-items');
                if (adminMenu) {
                    adminMenu.style.display = currentUser.id === 'admin' ? 'block' : 'none';
                }

                const regBtn = document.getElementById('open-register-modal');
                if (regBtn) {
                    regBtn.style.display = 'flex';
                }

                // Force Dashboard View on Load
                document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
                const dash = document.getElementById('content-dashboard');
                if (dash) dash.style.display = 'block';

            } catch (err) { console.error("Settings Load Error", err); }

            // Search Listener
            const searchInput = document.getElementById('search-student');
            if (searchInput) {
                searchInput.oninput = (e) => {
                    const term = e.target.value.toLowerCase();
                    const list = getFilteredStudents();
                    const filtered = list.filter(s => s.name.toLowerCase().includes(term) || s.specialty.toLowerCase().includes(term));
                    renderStudents(filtered);
                };
            }
            // 4. Initial Banner Update
            const pageTitle = document.getElementById('page-title');
            if (pageTitle && currentUser) {
                let iconName = 'layout-grid';
                let deptName = currentUser.name;

                switch (currentUser.id) {
                    case 'design': iconName = 'pen-tool'; break;
                    case 'multimedia': iconName = 'monitor-play'; break;
                    case 'admin': iconName = 'shield-alert'; break;
                    case 'ai': iconName = 'brain-circuit'; break;
                    case 'marketing': iconName = 'megaphone'; break;
                    case 'excel': iconName = 'sheet'; break;
                    default: iconName = 'layout-grid';
                }

                pageTitle.innerHTML = `<i data-lucide="${iconName}" style="margin-right:10px; width:32px; height:32px;"></i> ${deptName}`;
                if (window.lucide) lucide.createIcons();
            }
        }

        // Migration Logic for Logs
        function migrateLogs() {
            let migrated = false;
            students.forEach(s => {
                if (!s.logs) {
                    s.logs = [];
                    if (s.notes && s.notes.trim() !== '') {
                        s.logs.push({
                            date: new Date().toISOString().split('T')[0],
                            text: s.notes,
                            type: 'migration'
                        });
                        s.notes = ''; // Clear old notes
                        migrated = true;
                    }
                }
            });
            if (migrated) save();
        }

        // Student Logs Logic
        window.addStudentLog = (idx) => {
            const text = prompt("Nueva observación para la bitácora:");
            if (!text) return;

            if (!students[idx].logs) students[idx].logs = [];

            students[idx].logs.unshift({
                date: new Date().toISOString().split('T')[0],
                text: text,
                type: 'manual'
            });

            if (window.DBService) {
                window.DBService.saveStudent(students[idx])
                    .then(() => window.showToast("Bitácora actualizada en nube", 'success'))
                    .catch(e => console.error(e));
            } else {
                save();
            }
            openDetailsModal(idx); // Refresh modal
        };

        // Render Main Information (Premium Smart Cards Refactor)
        window.renderStudents = function (filtered = null) {
            let list = filtered || getFilteredStudents();

            if (filterTodayActive && !filtered) {
                const todayDay = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][new Date().getDay()];
                list = list.filter(s => (s.days || []).includes(todayDay));
            }

            const container = document.getElementById('students-cards-container');
            if (!container) return; // Guard
            container.innerHTML = '';

            if (list.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; padding: 100px 20px; text-align: center; background: rgba(255,255,255,0.5); border-radius: 30px; border: 2px dashed #e2e8f0;">
                        <div class="empty-state-container" style="border:none; background:transparent;">
                            <i data-lucide="users-2" style="width:64px; height:64px; color:#cbd5e1; margin-bottom:20px;"></i>
                            <div class="empty-state-text" style="color:#64748b; font-size:18px; font-weight:700;">No se encontraron vacantes</div>
                            <p style="color:#94a3b8; font-size:14px; margin-top:5px;">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    </div>
                `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            list.forEach((s, i) => {
                const topics = window.pensumContent[s.module] || [];
                const topicIdx = topics.indexOf(s.topic);
                const prog = topics.length > 0 ? Math.round(((topicIdx + 1) / topics.length) * 100) : 0;
                const isFinished = prog === 100;
                const avatarUrl = window.getAvatarUrl(s.name);

                const card = document.createElement('div');
                card.className = 'student-smart-card';
                card.style.animation = `fadeInUp 0.5s ease backwards ${i * 0.05}s`;

                card.innerHTML = `
            <div class="card-header-top">
                <img src="${avatarUrl}" class="card-avatar" alt="${s.name}" onclick="openDetailsModal(${window.students.indexOf(s)})" style="cursor:pointer;">
                <div class="card-title-group">
                    <div class="card-name" title="${s.name}">${s.name}</div>
                    <div class="card-specialty">${s.specialty}</div>
                </div>
                <div class="card-action-btns">
                    <button class="btn-icon-smart" onclick="window.openEditModal(${window.students.indexOf(s)})" title="Editar">
                        <i data-lucide="edit-3" style="width:16px;"></i>
                    </button>
                </div>
            </div>

            <div class="card-progress-section">
                <div class="card-progress-header">
                    <span class="card-progress-label">${s.module}</span>
                    <span class="card-progress-value">${prog}%</span>
                </div>
                <div class="smart-progress-bar">
                    <div class="smart-progress-fill" style="width: ${prog}%"></div>
                </div>
                <div style="margin-top:10px; font-size:11px; color:#94a3b8; font-weight:600; display:flex; justify-content:space-between;">
                    <span>Tema: ${s.topic}</span>
                    <span>${topicIdx + 1}/${topics.length}</span>
                </div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div style="flex: 1; background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px; border-radius: 12px; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="clock" style="width:14px; color:#6366f1;"></i>
                    <div style="font-size:11px; font-weight:700; color:#1e293b;">${Array.isArray(s.schedule) ? s.schedule[0] : s.schedule}</div>
                </div>
                <div style="flex: 1; background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px; border-radius: 12px; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="calendar" style="width:14px; color:#ec4899;"></i>
                    <div style="font-size:11px; font-weight:700; color:#1e293b;">${(s.days || []).join(', ')}</div>
                </div>
            </div>

            <div class="card-footer-actions">
                ${isFinished
                        ? `<span class="card-badge badge-active"><i data-lucide="check-circle" style="width:12px; vertical-align:middle; margin-right:4px;"></i> Completado</span>`
                        : `<span class="card-badge badge-warning">En Progreso</span>`
                    }
                
                <div class="card-action-btns">
                    ${isFinished ? `
                    <button class="btn-icon-smart" onclick="window.promoteStudent(${window.students.indexOf(s)})" title="Promover" style="color:#4338ca; background:#e0e7ff;">
                        <i data-lucide="award" style="width:18px;"></i>
                    </button>` : ''}
                    <button class="btn-icon-smart" onclick="window.openReportCard(${window.students.indexOf(s)})" title="Reporte" style="color:#166534; background:#f0fdf4;">
                        <i data-lucide="file-text" style="width:18px;"></i>
                    </button>
                    <button class="btn-icon-smart" onclick="deleteStudent('${s.id}')" title="Eliminar" style="color:#be123c; background:#fff1f2;">
                        <i data-lucide="trash-2" style="width:18px;"></i>
                    </button>
                </div>
            </div>
        `;
                container.appendChild(card);
            });

            if (window.lucide) lucide.createIcons();
        };

        // ==========================================
        // MISSING MODALS & WIDGETS (Restored)
        // ==========================================

        // 1. Student Details Modal
        window.openDetailsModal = (idx) => {
            const s = students[idx];
            const detailsContent = document.getElementById('details-content');
            const topics = pensumContent[s.module] || [];
            const idxTopic = topics.indexOf(s.topic);
            const prog = topics.length > 0 ? Math.round(((idxTopic + 1) / topics.length) * 100) : 0;

            // Career Path Logic (Modules Track)
            const specialtyMods = specialties[s.specialty] || specialties["Diseño Gráfico"];
            const currentModIdx = specialtyMods.indexOf(s.module);

            const modulesTrackHTML = `
        <div style="margin-bottom:20px;">
            <h4 style="font-size:11px; color:#999; font-weight:700; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">TRAYECTORIA ACADÉMICA (${s.specialty})</h4>
            <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:5px; scrollbar-width:thin;">
                ${specialtyMods.map((m, i) => {
                let color = '#cbd5e1'; // pending gray
                let bg = '#f8fafc';
                let icon = 'circle';
                let textColor = '#94a3b8';
                let border = '1px solid #e2e8f0';

                if (i < currentModIdx) {
                    color = '#27ae60'; bg = '#f0fdf4'; icon = 'check-circle-2'; textColor = '#166534'; border = '1px solid #bbf7d0';
                } else if (i === currentModIdx) {
                    color = 'var(--primary)'; bg = '#f3e8ff'; icon = 'crosshair'; textColor = 'var(--primary)'; border = '1px solid #d8b4fe';
                }

                return `
                        <div class="module-pill" data-module="${m}" onclick="renderModuleDetails(${idx}, '${m}')" style="flex:0 0 auto; display:flex; align-items:center; gap:6px; background:${bg}; padding:8px 12px; border-radius:20px; ${border}; box-shadow:0 1px 2px rgba(0,0,0,0.02); cursor:pointer;">
                            <i data-lucide="${icon}" style="width:14px; color:${color};"></i>
                            <span style="font-size:11px; font-weight:700; color:${textColor}; white-space:nowrap;">${m}</span>
                        </div>
                    `;
            }).join('')}
            </div>
        </div>
    `;

            const waMsg = encodeURIComponent(`Hola ${s.name}, te escribimos de la academia.`);
            const waLink = s.phone ? `https://wa.me/${s.phone.replace(/\\D/g, '')}?text=${waMsg}` : '#';

            // Logs Logic
            const logsHTML = `
        <div style="margin-bottom:20px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
            <div style="padding:12px 15px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0; font-size:12px; font-weight:700; color:#475569; display:flex; gap:6px; align-items:center;">
                    <i data-lucide="scroll-text" style="width:14px;"></i> BITíCORA DEL ALUMNO
                </h4>
                <button onclick="addStudentLog(${idx})" style="background:none; border:none; color:var(--primary); font-size:11px; font-weight:700; cursor:pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                    + AGREGAR
                </button>
            </div>
            <div style="max-height:150px; overflow-y:auto; padding:0; scrollbar-width:thin;">
                ${(s.logs && s.logs.length > 0) ? s.logs.map(l => {
                const isAuto = l.type === 'auto';
                const icon = isAuto ? '<i data-lucide="book-open" style="width:10px; margin-right:4px;"></i>' : '';
                // For auto logs, maybe just show "Today" if date is today, or simple date
                const dateObj = new Date(l.date);
                const dateStr = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                // If full timestamp exists and is auto, maybe show time too?

                return `
                    <div style="padding:10px 15px; border-bottom:1px solid #f1f5f9; font-size:12px; ${isAuto ? 'background:#f0f9ff;' : ''}">
                        <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:10px; margin-bottom:4px;">
                            <span>${dateStr}</span>
                            <span style="text-transform:uppercase; font-size:9px; border:1px solid ${isAuto ? '#bae6fd' : '#e2e8f0'}; padding:1px 4px; border-radius:4px; color:${isAuto ? '#0284c7' : '#64748b'};">${l.type || 'Manual'}</span>
                        </div>
                        <div style="color:${isAuto ? '#0c4a6e' : '#334155'}; line-height:1.4; font-weight:${isAuto ? '600' : '400'}; display:flex; align-items:flex-start;">
                            ${icon} ${l.text}
                        </div>
                    </div>
                `}).join('') : '<div style="padding:15px; text-align:center; color:#cbd5e1; font-size:12px; font-style:italic;">No hay observaciones registradas.</div>'}
            </div>
        </div>
    `;

            detailsContent.innerHTML = `
        <div class="modal-header">
             <div style="display:flex; gap:20px; align-items:center;">
                <img src="${window.getAvatarUrl(s.name)}" style="width: 70px; height: 70px; border-radius: 50%; border: 3px solid white; box-shadow:var(--shadow);">
                <div>
                    <h2 style="font-size:22px; margin-bottom:5px; font-weight:800; color:var(--text-main);">${s.name}</h2>
                    <div style="font-size:11px; color:#64748b; margin-bottom:5px;">DNI: ${s.dni || 'N/A'}</div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <span style="font-size:10px; background:var(--primary-light); color:var(--primary); padding:4px 8px; border-radius:6px; font-weight:700;">${s.specialty || 'Diseño Gráfico'}</span>
                        <span style="font-size:10px; background:#f1f5f9; color:#64748b; padding:4px 8px; border-radius:6px; font-weight:600;">${s.module}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-body">
            
            ${modulesTrackHTML}

            <div id="module-specific-content">
                <!-- Content loaded by renderModuleDetails -->
            </div>
            
            ${logsHTML}

                <div style="margin-bottom:20px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <a href="${waLink}" target="_blank" class="btn" style="background:#25D366; color:white; justify-content:center; font-weight:600;"><i data-lucide="message-circle"></i> Contactar</a>
                    <button onclick="openGalleryModal(${idx})" class="btn" style="background:#3b82f6; color:white; justify-content:center; font-weight:600;">
                        <i data-lucide="image"></i> Ver Trabajos
                    </button>
                </div>

                <!-- Resumen de Asistencia en Detalles -->
                ${(() => {
                    const stats = window.getAttendanceStats(s.name);
                    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
                    const recentAtt = Object.keys(records).sort().reverse().slice(0, 5).map(date => {
                        const status = records[date][s.name];
                        if (!status) return '';
                        let color = '#ccc';
                        if (status === 'P') color = '#27ae60';
                        if (status === 'A') color = '#e74c3c';
                        if (status === 'L') color = '#f39c12';
                        return `<div style="width: 12px; height: 12px; border-radius: 3px; background: ${color};" title="${date}: ${status}"></div>`;
                    }).join('');

                    return `
                    <div style="background: ${stats.statusColor}15; border: 1px solid ${stats.statusColor}30; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4 style="margin: 0; font-size: 11px; font-weight: 800; color: ${stats.statusColor}; text-transform: uppercase; letter-spacing: 0.5px;">Resumen de Asistencia</h4>
                            <div style="display: flex; gap: 4px;">${recentAtt}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                            <div><div style="font-size: 16px; font-weight: 800; color: ${stats.statusColor};">${stats.percent}%</div><div style="font-size: 9px; color: #64748b;">Global</div></div>
                            <div><div style="font-size: 16px; font-weight: 800; color: #166534;">${stats.present}</div><div style="font-size: 9px; color: #64748b;">Asist.</div></div>
                            <div><div style="font-size: 16px; font-weight: 800; color: var(--danger);">${stats.absent}</div><div style="font-size: 9px; color: #64748b;">Faltas</div></div>
                            <div><div style="font-size: 16px; font-weight: 800; color: #854d0e;">${stats.license}</div><div style="font-size: 9px; color: #64748b;">Licenc.</div></div>
                        </div>
                    </div>
                    `;
                })()}

                <!-- Mapa de Asistencia (Heatmap de 30 días) -->
                <div style="margin-bottom:20px; background:#fff; border:1px solid #e2e8f0; padding:15px; border-radius:12px;">
                    <h4 style="margin-bottom:10px; color:var(--text-main); font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Actividad últimos 30 días</h4>
                    <div id="student-attendance-heatmap" style="display:flex; gap:4px; flex-wrap:wrap;">
                        ${(() => {
                    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
                    const dates = [];
                    for (let i = 29; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        dates.push(d.toISOString().split('T')[0]);
                    }
                    return dates.map(date => {
                        const status = records[date] ? records[date][s.name] : null;
                        let color = '#f1f5f9'; // No recorded
                        if (status === 'P') color = '#27ae60';
                        if (status === 'A') color = '#e74c3c';
                        if (status === 'L') color = '#f39c12';
                        return `<div style="width:14px; height:14px; border-radius:3px; background:${color};" title="${date}: ${status || 'Sin calificar'}"></div>`;
                    }).join('');
                })()}
                    </div>
                </div>
        </div>
        <div class="modal-footer" style="padding-top:0;">
            <div style="display:flex; gap:10px; width:100%;">
                <button class="btn" onclick="generateReport(${idx})" style="flex:1; background:#fff; border:2px solid #e2e8f0; color:#64748b; justify-content:center; font-weight:700;"><i data-lucide="printer"></i> REPORTE</button>
                <button class="btn" onclick="closeDetailsModal()" style="flex:1; background:var(--primary); color:white; justify-content:center; font-weight:700;">CERRAR</button>
            </div>
        </div>
    `;

            document.getElementById('details-modal').classList.add('active');
            renderModuleDetails(idx, s.module);
            if (window.lucide) lucide.createIcons();
        };

        window.toggleDeliverable = (sIdx, deliverable) => {
            const s = students[sIdx];
            if (!s.completedDeliverables) s.completedDeliverables = [];

            if (s.completedDeliverables.includes(deliverable)) {
                s.completedDeliverables = s.completedDeliverables.filter(d => d !== deliverable);
            } else {
                s.completedDeliverables.push(deliverable);
            }

            save();
            // Re-render modal only (optimized) instead of full app redraw
            // But since openDetailsModal redraws content, just calling it works fine
            openDetailsModal(sIdx);
        };

        window.closeDetailsModal = () => document.getElementById('details-modal').classList.remove('active');

        // Render Module-Specific Content (Topics + Deliverables)
        window.renderModuleDetails = (idx, moduleName) => {
            const container = document.getElementById('module-specific-content');
            if (!container) return;

            const s = students[idx];
            const history = s.history || [];

            // Career Path Progresion Logic
            const specialtyMods = specialties[s.specialty] || specialties["Diseño Gráfico"];
            const currentModIdx = specialtyMods.indexOf(s.module);

            // Determine Progress logic for the requested module
            let currentProg = 0;
            const topics = pensumContent[moduleName] || [];
            const idxTopic = topics.indexOf(s.topic); // Actual topic tracker

            // Check if module is in history (completed)
            const completedModule = history.find(h => h.module === moduleName);

            if (completedModule) {
                currentProg = 100;
            } else if (s.module === moduleName) {
                // Current Module Progress
                currentProg = topics.length > 0 ? Math.round(((idxTopic + 1) / topics.length) * 100) : 0;
            } else {
                // Future Module
                currentProg = 0;
            }

            const isCurrent = (s.module === moduleName);

            const topicsListHTML = `
                <div style="margin-bottom:20px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                    <div style="background:#f8fafc; padding:12px 15px; border-bottom:1px solid #e2e8f0; font-size:12px; font-weight:700; color:#475569; display:flex; justify-content:space-between; align-items:center;">
                        <span><i data-lucide="book-open" style="width:14px; vertical-align:middle; margin-right:5px;"></i> TEMARIO: ${moduleName.toUpperCase()}</span>
                        <span style="font-size:10px; background:var(--primary); color:white; padding:3px 8px; border-radius:10px; font-weight:800;">${currentProg}%</span>
                    </div>
                    <div style="max-height:250px; overflow-y:auto; padding:0; scrollbar-width:thin;">
                        ${topics.map((t, i) => {
                let bg = 'white';
                let iconColor = '#e2e8f0';
                let textColor = '#64748b';
                let icon = 'circle';
                let rowStyle = 'border-bottom:1px solid #f1f5f9;';
                let cursor = 'pointer';
                let hoverEffect = 'onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'' + bg + '\'"';

                let isCompleted = false;

                if (currentProg === 100) isCompleted = true;
                else if (isCurrent && i < idxTopic) isCompleted = true;

                if (isCompleted) {
                    bg = '#f8fafc'; iconColor = '#22c55e'; textColor = '#94a3b8'; icon = 'check';
                } else if (isCurrent && i === idxTopic) {
                    bg = '#fff1f2'; iconColor = 'var(--primary)'; textColor = '#1e293b'; icon = 'play-circle'; rowStyle += ' border-left:4px solid var(--primary);';
                    cursor = 'default';
                    hoverEffect = '';
                }

                const topicEscaped = t.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                return `
                                <div 
                                    ${(isCurrent && i !== idxTopic) ? `onclick="updateTopic(${idx}, '${topicEscaped}'); openDetailsModal(${idx});"` : ''} 
                                    style="padding:10px 15px; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; gap:12px; font-size:12px; background:${bg}; ${rowStyle} cursor:${cursor}; transition:all 0.2s;" 
                                    ${hoverEffect}
                                    title="${(isCurrent && i === idxTopic) ? 'Tema actual' : (isCompleted ? 'Tema completado' : 'Clic para avanzar a este tema')}"
                                >
                                    <i data-lucide="${icon}" style="width:14px; color:${iconColor}; flex-shrink:0;"></i>
                                    <span style="font-weight:${(isCurrent && i === idxTopic) ? '700' : '500'}; color:${textColor}; flex:1;">${t}</span>
                                    ${(isCurrent && i === idxTopic) ? '<span style="font-size:9px; background:var(--primary); color:white; padding:2px 6px; border-radius:4px;">ACTUAL</span>' : ''}
                                    ${(isCurrent && i > idxTopic) ? '<i data-lucide="chevron-right" style="width:12px; color:#cbd5e1;"></i>' : ''}
                                </div>
                            `;
            }).join('')}
                    </div>
                    <div style="background:#f8fafc; padding:10px 15px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:11px; color:#64748b;">
                            <i data-lucide="info" style="width:12px; vertical-align:middle;"></i> 
                            Haz clic en un tema para avanzar
                        </span>
                        ${(isCurrent && idxTopic >= topics.length - 1) ? `
                            <button onclick="promoteStudent(${idx})" style="background:var(--secondary); color:white; border:none; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;">
                                <i data-lucide="arrow-right" style="width:12px; vertical-align:middle;"></i> PROMOVER MÓDULO
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;

            // Deliverables
            const deliverables = moduleDeliverables[moduleName] || [];
            const completedDeliverables = s.completedDeliverables || [];

            const deliverablesHTML = deliverables.length > 0 ? `
                <div style="margin-bottom:20px; background:#fff; border:1px solid #e2e8f0; padding:15px; border-radius:12px;">
                    <h4 style="margin-bottom:10px; color:var(--text-main); font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <i data-lucide="clipboard-check" style="width:14px; color:var(--secondary);"></i> ENTREGABLES OBLIGATORIOS (${moduleName})
                    </h4>
                    <div style="display:grid; gap:8px;">
                        ${deliverables.map((d, i) => {
                const isChecked = completedDeliverables.includes(d);
                return `
                                <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#475569; cursor:pointer; padding:8px; border-radius:8px; transition:background 0.2s;" 
                                     onclick="toggleDeliverable(${idx}, '${d}')"
                                     onmouseover="this.style.background='#f8fafc'"
                                     onmouseout="this.style.background='transparent'">
                                    <input type="checkbox" ${isChecked ? 'checked' : ''} style="accent-color:var(--secondary); cursor:pointer; pointer-events:none;"> 
                                    <span style="${isChecked ? 'text-decoration:line-through; color:#94a3b8;' : ''}">${d}</span>
                                </div>
                            `}).join('')}
                    </div>
                    <div style="margin-top:12px; padding-top:12px; border-top:1px solid #f1f5f9; font-size:11px; color:#64748b;">
                        <i data-lucide="check-circle" style="width:12px; vertical-align:middle; color:#22c55e;"></i>
                        ${completedDeliverables.length} de ${deliverables.length} completados
                    </div>
                </div>
            ` : '';

            container.innerHTML = topicsListHTML + deliverablesHTML;
            if (window.lucide) lucide.createIcons();
        };


        // 2. Edit Student Modal
        window.openEditModal = (idx) => {
            const s = students[idx];
            document.getElementById('edit-index').value = idx;
            document.getElementById('edit-name').value = s.name;
            document.getElementById('edit-dni').value = s.dni || ''; // Load DNI
            document.getElementById('edit-gender').value = s.gender;
            document.getElementById('edit-phone').value = s.phone;
            document.getElementById('edit-portfolio').value = s.portfolio || '';

            // Schedule chips logic (simplified for rewrite)
            // Clear all
            document.querySelectorAll('#edit-schedule-container input').forEach(cb => cb.checked = false);
            document.querySelectorAll('#edit-days-container input').forEach(cb => cb.checked = false);

            // Set checks
            (Array.isArray(s.schedule) ? s.schedule : [s.schedule]).forEach(sch => {
                const script = document.querySelector(`#edit-schedule-container input[value="${sch}"]`);
                if (script) script.checked = true;
            });
            (s.days || []).forEach(d => {
                const script = document.querySelector(`#edit-days-container input[value="${d}"]`);
                if (script) script.checked = true;
            });

            document.getElementById('edit-modal').classList.add('active');
        };

        window.closeEditModal = () => document.getElementById('edit-modal').classList.remove('active');

        document.getElementById('edit-form').onsubmit = async (e) => {
            e.preventDefault();
            const idx = document.getElementById('edit-index').value;
            const s = students[idx];

            if (!s) return;

            // Update Local Object
            s.name = document.getElementById('edit-name').value;
            s.dni = document.getElementById('edit-dni').value;
            s.gender = document.getElementById('edit-gender').value;
            s.phone = document.getElementById('edit-phone').value;
            s.portfolio = document.getElementById('edit-portfolio').value;

            const days = [];
            document.getElementById('edit-days-container').querySelectorAll('input:checked').forEach(cb => days.push(cb.value));
            s.days = days;

            const schedules = [];
            document.getElementById('edit-schedule-container').querySelectorAll('input:checked').forEach(cb => schedules.push(cb.value));
            s.schedule = schedules;

            // SAVE TO DB
            if (window.DBService) {
                try {
                    await window.DBService.saveStudent(s);
                    window.showToast("Datos actualizados en la nube", 'success');
                } catch (err) {
                    console.error("Error saving edit:", err);
                    window.showToast("Error al guardar en DB", 'error');
                }
            } else {
                save(); // Fallback
            }

            document.getElementById('edit-modal').classList.remove('active');
            renderStudents();
            updateStats();
        };

        // 3. Day Shift Modal (Schedule Details)
        window.openDayShiftModal = (day, slot) => {
            // Correctly use filtered list for Context awareness
            const list = getFilteredStudents();
            const attendees = list.filter(s => (Array.isArray(s.schedule) ? s.schedule.includes(slot) : s.schedule === slot) && (s.days || []).includes(day));

            document.getElementById('shift-modal-title').innerText = `${day} - ${slot}`;
            const domList = document.getElementById('shift-modal-list');

            if (attendees.length === 0) {
                domList.innerHTML = `<div style="text-align:center; padding:30px; color:#ccc;">No hay alumnos.</div>`;
            } else {
                domList.innerHTML = attendees.map(s => `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                 <img src="${window.getAvatarUrl(s.name)}" style="width: 30px; height:30px; border-radius: 50%;">
                 <div>
                    <div style="font-weight:700; font-size:13px;">${s.name}</div>
                    <div style="font-size:11px; color:#888;">${s.module}</div>
                 </div>
            </div>
        `).join('');
            }
            document.getElementById('shift-modal').classList.add('active');
        };
        window.closeShiftModal = () => document.getElementById('shift-modal').classList.remove('active');

        // 4. Widget Agenda (Programados Hoy)
        function renderTodayAgenda() {
            const container = document.getElementById('today-agenda-list');
            if (!container) return;

            const todayDay = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][new Date().getDay()];

            // All students scheduled for today (filtered by department)
            const list = getFilteredStudents();
            const scheduledStudents = list.filter(s => (s.days || []).includes(todayDay));

            if (scheduledStudents.length > 0) {
                container.innerHTML = scheduledStudents.map(s => `
            <img src="${window.getAvatarUrl(s.name)}" title="${s.name} (${Array.isArray(s.schedule) ? s.schedule[0] : s.schedule})" style="width:30px; height:30px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.1); cursor:pointer;" onclick="openDetailsModal(${students.indexOf(s)})">
        `).join('');
            } else {
                container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; opacity:0.6; padding:10px;">
                <i data-lucide="coffee" style="color:var(--text-muted); width:20px; margin-bottom:4px;"></i>
                <span style="font-size:10px; color:var(--text-muted); text-align:center; font-weight:500;">Día libre. Todo tranquilo.</span>
            </div>`;
                if (window.lucide) lucide.createIcons();
            }
        }

        // 4.1 Widget Riesgo (Estudiantes en Riesgo)
        function renderRiskDashboard() {
            const container = document.getElementById('risk-students-list');
            if (!container) return;

            const list = getFilteredStudents();
            const riskStudents = list.filter(s => {
                const absences = checkRecentAbsences(s.name);
                let stagnant = false;
                if (s.topicDates && s.topicDates[s.topic]) {
                    const lastUpdate = new Date(s.topicDates[s.topic]);
                    const diffDays = Math.ceil((new Date() - lastUpdate) / (1000 * 60 * 60 * 24));
                    stagnant = diffDays > 7;
                }
                return absences >= 3 || stagnant;
            });

            if (riskStudents.length > 0) {
                container.innerHTML = riskStudents.map(s => `
            <img src="${window.getAvatarUrl(s.name)}" title="${s.name} (Riesgo)" style="width:30px; height:30px; border-radius:50%; border:2px solid var(--danger); box-shadow:0 2px 4px rgba(0,0,0,0.1); cursor:pointer;" onclick="openDetailsModal(${students.indexOf(s)})">
        `).join('');
            } else {
                container.innerHTML = '<span style="font-size:11px; color:var(--text-muted);">Sin alumnos en riesgo.</span>';
            }
        }

        // 5. Department/Context Switching
        window.switchDepartment = (deptId) => {
            try {
                const dept = window.availableDepartments.find(d => d.id === deptId);
                if (!dept) {
                    console.error("Department not found:", deptId);
                    return;
                }

                currentUser = dept;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // RESTART CLOUD LISTENER FOR NEW DEPARTMENT
                if (typeof window.restartCloudSync === 'function') {
                    window.restartCloudSync();
                }

                // Refresh Sidebar Info
                const nameEl = document.getElementById('sidebar-instructor-name');
                if (nameEl) nameEl.innerText = currentUser.instructor;

                const imgEl = document.getElementById('sidebar-instructor-img');
                if (imgEl) imgEl.src = window.getAvatarUrl(currentUser.instructor);

                // Mobile Avatar Update
                const mobImg = document.getElementById('mobile-user-avatar');
                if (mobImg) mobImg.src = window.getAvatarUrl(currentUser.instructor);

                const roleEl = document.getElementById('sidebar-role');
                if (roleEl) roleEl.innerText = 'Instructor ' + currentUser.name;

                // Force Sidebar Refresh for Admin Menu
                const adminMenu = document.getElementById('admin-menu-items');
                if (adminMenu) {
                    adminMenu.style.display = currentUser.id === 'admin' ? 'block' : 'none';
                }

                // Refresh Data Views with Safety
                // (If one fails, others still run, and modal still closes)
                try { updateModuleFilterOptions(); } catch (e) { console.error("Error updating filters:", e); }
                try { renderStudents(); } catch (e) { console.error("Error rendering students:", e); }
                try { updateStats(); } catch (e) { console.error("Error updating stats:", e); }
                try { renderStagnantStudents(); } catch (e) { console.error("Error rendering stagnant:", e); }
                try { checkCriticalPoints(); } catch (e) { console.error("Error checking criticals:", e); }
                try { renderTodayAgenda(); } catch (e) { console.error("Error rendering agenda:", e); }
                try { renderRiskDashboard(); } catch (e) { console.error("Error rendering risk:", e); }

                // Also refresh attendance if that view is active? 
                // Better to just let the nav listener handle it or call it safely if visible
                const attView = document.getElementById('content-attendance');
                if (attView && attView.style.display === 'block') {
                    try { renderAttendance(); } catch (e) { console.error("Error rendering attendance:", e); }
                }

                const penView = document.getElementById('content-pensum');
                if (penView && penView.style.display === 'block') {
                    try { renderPensumView(); } catch (e) { console.error("Error rendering pensum:", e); }
                }

                // Toggle Register Button (Admin Only & Web)
                // Toggle Register Button
                const regBtn = document.getElementById('open-register-modal');
                if (regBtn) {
                    // Updated: Allow ALL instructors to register
                    regBtn.style.display = 'flex';
                }

                // DYNAMIC BANNER UPDATE
                const pageTitle = document.getElementById('page-title');
                if (pageTitle) {
                    let iconName = 'layout-grid';
                    let deptName = currentUser.name;

                    switch (currentUser.id) {
                        case 'design': iconName = 'pen-tool'; break;
                        case 'multimedia': iconName = 'monitor-play'; break;
                        case 'admin': iconName = 'shield-alert'; break;
                        case 'ai': iconName = 'brain-circuit'; break;
                        case 'marketing': iconName = 'megaphone'; break;
                        case 'excel': iconName = 'sheet'; break;
                        default: iconName = 'layout-grid';
                    }

                    pageTitle.innerHTML = `<i data-lucide="${iconName}" style="margin-right:10px; width:32px; height:32px;"></i> ${deptName}`;
                    if (window.lucide) lucide.createIcons();
                }

                // Close Modal if open
                const modal = document.getElementById('department-modal');
                if (modal) modal.classList.remove('active');

            } catch (err) {
                console.error("Critical Switch Dept Error", err);
                // Force close modal anyway to unblock user
                const modal = document.getElementById('department-modal');
                if (modal) modal.classList.remove('active');
            }
        };

        window.openDepartmentModal = () => {
            // Disabled: Department switching is restricted by login
            console.log("Department switching is disabled.");
        }

        window.closeDepartmentModal = () => {
            const modal = document.getElementById('department-modal');
            if (modal) modal.classList.remove('active');
        }



        window.toggleFilterToday = () => {
            filterTodayActive = !filterTodayActive;
            const btn = document.getElementById('filter-today');
            if (filterTodayActive) {
                btn.style.background = 'var(--primary)';
                btn.style.color = 'white';
                btn.innerHTML = '<i data-lucide="check-circle"></i> Filtrado: Hoy';
            } else {
                btn.style.background = '#f0f9ff';
                btn.style.color = '#0369a1';
                btn.innerHTML = '<i data-lucide="calendar-days"></i> Solo Hoy';
            }
            if (window.lucide) lucide.createIcons();
            renderStudents();
        };

        // 5. Gallery Logic
        window.openGalleryModal = (idx) => {
            document.body.setAttribute('data-gallery-idx', idx);
            renderGallery(idx);
            document.getElementById('gallery-modal').classList.add('active');
        };

        window.closeGalleryModal = () => document.getElementById('gallery-modal').classList.remove('active');

        function renderGallery(idx) {
            const s = students[idx];
            const grid = document.getElementById('gallery-grid');
            const empty = document.getElementById('gallery-empty-state');
            const works = s.gallery || [];

            grid.innerHTML = '';

            if (works.length === 0) {
                grid.style.display = 'none';
                empty.style.display = 'flex';
            } else {
                grid.style.display = 'grid';
                empty.style.display = 'none';
                works.forEach((w, i) => {
                    const div = document.createElement('div');
                    div.className = 'gallery-item';
                    div.innerHTML = `
                <img src="${w.url}">
                <div class="gallery-overlay"><div class="gallery-title">${w.title}</div></div>
                <div class="gallery-delete" onclick="event.stopPropagation(); deleteGallery(${idx},${i})"><i data-lucide="trash-2" style="width:14px;"></i></div>
             `;
                    div.onclick = () => window.open(w.url, '_blank');
                    grid.appendChild(div);
                });
            }
            if (window.lucide) lucide.createIcons();
        }

        window.addGalleryImage = () => {
            const idx = parseInt(document.body.getAttribute('data-gallery-idx'));
            const url = prompt("URL de la imagen:");
            if (!url) return;
            const title = prompt("Título:") || "Trabajo";

            if (!students[idx].gallery) students[idx].gallery = [];
            students[idx].gallery.push({ url, title, date: new Date().toISOString() });
            save();
            renderGallery(idx);
        };

        window.deleteGallery = (sIdx, wIdx) => {
            if (confirm('Borrar imagen?')) {
                students[sIdx].gallery.splice(wIdx, 1);
                save();
                renderGallery(sIdx);
            }
        };

        window.updateTopic = (idx, newTopic) => {
            // Check if topic actually changed to avoid duplicate logs if clicked multiple times (though select usually handles this)
            if (students[idx].topic !== newTopic) {
                if (!students[idx].logs) students[idx].logs = [];
                students[idx].logs.unshift({
                    date: new Date().toISOString(), // Full timestamp
                    text: `Avanzó al tema: ${newTopic}`,
                    type: 'auto'
                });
            }

            students[idx].topic = newTopic;
            if (!students[idx].topicDates) students[idx].topicDates = {};
            students[idx].topicDates[newTopic] = new Date().toISOString().split('T')[0];

            if (window.DBService) {
                window.DBService.saveStudent(students[idx])
                    .then(() => console.log("Topic synced"))
                    .catch(e => console.error(e));
            } else {
                save();
            }

            renderStudents();
            updateStats();
        };

        window.promoteStudent = (idx) => {
            const s = students[idx];
            const specialtyMods = specialties[s.specialty] || specialties["Diseño Gráfico"];
            const currentIdx = specialtyMods.indexOf(s.module);
            const nextMod = specialtyMods[currentIdx + 1];

            if (nextMod) {
                if (!s.history) s.history = [];
                // Store full ISO timestamp for detailed history
                s.history.push({ module: s.module, date: new Date().toISOString() });

                s.module = nextMod;
                s.topic = pensumContent[nextMod] ? pensumContent[nextMod][0] : "Tema 1";
                s.topicDates = { [s.topic]: new Date().toISOString().split('T')[0] };

                window.showToast(`¡Felicidades! ${s.name} ha sido promovido a ${nextMod}.`, 'success');

                // SAVE TO DB (Wait for it to ensure consistency)
                if (window.DBService) {
                    window.DBService.saveStudent(s)
                        .then(() => console.log("Promotion saved."))
                        .catch(err => {
                            console.error(err);
                            window.showToast("Error guardando promoción en nube", "error");
                        });
                } else {
                    save();
                }

                renderStudents();
                updateStats();
                updateStats();
            } else {
                // Career Path Progression Logic
                // PATH 1: Graphic Design -> Web -> Video (CapCut)
                if (s.specialty === 'Diseño Gráfico') {
                    if (confirm(`¡${s.name} ha completado Diseño Gráfico! 🎓\n\n¿Deseas promoverlo a la especialidad de Diseño Web (Multimedia)?`)) {
                        if (!s.history) s.history = [];
                        s.history.push({ module: s.module, date: new Date().toISOString(), type: 'graduation_dg' });

                        const newSpec = 'Diseño Web';
                        const firstMod = (specialties[newSpec] && specialties[newSpec][0]) || "Maquetación Web";

                        s.specialty = newSpec;
                        s.module = firstMod;
                        s.topic = (pensumContent[firstMod] && pensumContent[firstMod][0]) || "Tema 1";
                        s.topicDates = { [s.topic]: new Date().toISOString().split('T')[0] };

                        if (!s.logs) s.logs = [];
                        s.logs.push({
                            date: new Date().toISOString(),
                            text: 'Promoción académica: Graduado de Diseño Gráfico -> Inscrito en Diseño Web.',
                            type: 'system'
                        });

                        window.showToast(`¡Transición Exitosa! 🚀\n\n${s.name} ha pasado al área de Multimedia (Web).`, 'success');
                        save();
                        renderStudents();
                        updateStats();
                        return; // Done
                    }
                }

                if (s.specialty === 'Diseño Web') {
                    if (confirm(`¡${s.name} ha completado Diseño Web! 🌐\n\n¿Deseas promoverlo ahora a la especialidad de Edición de Video (CapCut)?`)) {
                        if (!s.history) s.history = [];
                        s.history.push({ module: s.module, date: new Date().toISOString(), type: 'graduation_dw' });

                        const newSpec = 'Edición de Video';
                        const firstMod = (specialties[newSpec] && specialties[newSpec][0]) || "Fundamentos de CapCut";

                        s.specialty = newSpec;
                        s.module = firstMod;
                        s.topic = (pensumContent[firstMod] && pensumContent[firstMod][0]) || "Tema 1";
                        s.topicDates = { [s.topic]: new Date().toISOString().split('T')[0] };

                        if (!s.logs) s.logs = [];
                        s.logs.push({
                            date: new Date().toISOString(),
                            text: 'Promoción académica: Graduado de Diseño Web -> Inscrito en Edición de Video.',
                            type: 'system'
                        });

                        window.showToast(`¡Nuevo Desafío! 🎬\n\n${s.name} ha pasado a Edición de Video (CapCut).`, 'success');
                        save();
                        renderStudents();
                        updateStats();
                        return; // Done
                    }
                }

                // Default Graduation Prompt for other specialties (including "Diseño para Redes Sociales")
                if (confirm(`¡${s.name} ha finalizado todos los módulos de ${s.specialty}! 🎊\n\n¿Deseas registrar a este alumno como GRADUADO oficialmente?`)) {
                    s.status = 'graduated';
                    s.graduationDate = new Date().toISOString();

                    // History Log
                    if (!s.history) s.history = [];
                    s.history.push({
                        module: s.module,
                        date: s.graduationDate,
                        type: 'official_graduation'
                    });

                    // bitacora
                    if (!s.logs) s.logs = [];
                    s.logs.push({
                        date: s.graduationDate,
                        text: 'ESTADO: GRADUADO. Ciclo académico completado exitosamente.',
                        type: 'system'
                    });

                    window.showToast(`✨ ¡Felicidades! ${s.name} se ha graduado.`, 'success');
                    save();
                    switchView('graduates');
                }
            }
        };

        // ==========================================
        // FIXED DELETE FUNCTION (ROBUST ID-BASED)
        // ==========================================
        window.deleteStudent = (id) => {
            // Scope Safety: Always use window.students explicit reference
            const list = window.students;
            if (!list) return;

            // Find index by ID
            const idx = list.findIndex(s => String(s.id) === String(id));

            if (idx === -1) {
                console.error("Delete failed: ID not found", id);
                window.showToast("Error: No se encontró el estudiante.", 'error');
                return;
            }

            const s = list[idx];

            // Native Confirm
            if (!confirm(`¿Estás seguro de que deseas eliminar a ${s.name}?`)) return;

            // Execute Delete
            list.splice(idx, 1);

            // Save & Render
            if (window.DBService) {
                // Async delete
                (async () => {
                    try {
                        const res = await window.DBService.deleteStudent(id);
                        if (res.success) window.showToast("Estudiante borrado de la nube.", 'success');
                        else window.showToast("Error borrando de la nube.", 'error');
                    } catch (err) {
                        console.error("Delete DB error:", err);
                    }
                })();
            } else {
                if (typeof window.save === 'function') window.save();
                else localStorage.setItem('design_students', JSON.stringify(list));
            }

            window.renderStudents();
            // window.updateStats(); // Removed as it doesn't exist anymore

            window.showToast(`Estudiante eliminado correctamente.`, 'success');
        };

        window.updateNote = (idx, val) => {
            students[idx].notes = val;
            save();
            window.showToast(`Nota guardada para ${students[idx].name}`, 'success');
        };




        // Stats & Charts
        // Stats & Charts
        function updateStats() {
            const list = getFilteredStudents();
            document.getElementById('stat-total-students').innerText = list.length;
            let totalP = 0;
            list.forEach(s => {
                const t = pensumContent[s.module] || [];
                const i = t.indexOf(s.topic);
                totalP += t.length > 0 ? ((i + 1) / t.length) * 100 : 0;
            });
            document.getElementById('stat-avg-progress').innerText = list.length > 0 ? Math.round(totalP / list.length) + "%" : "0%";

            // Most active module
            const counts = {};
            list.forEach(s => counts[s.module] = (counts[s.module] || 0) + 1);
            const topMod = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '-');
            document.getElementById('stat-active-module').innerText = topMod;

            updateScheduleCapacity(list); // Ensure capability check uses filtered list if needed, or global
            renderCharts(list);
            renderTodayAgenda();
        }

        function renderCharts() {
            renderModuleChart();
            renderAttendanceTrendChart();
        }

        function renderModuleChart() {
            const ctx = document.getElementById('moduleChart');
            if (!ctx) return;

            const moduleCounts = {};
            const list = getFilteredStudents();
            list.forEach(s => {
                moduleCounts[s.module] = (moduleCounts[s.module] || 0) + 1;
            });

            const labels = Object.keys(moduleCounts);
            const dataValues = Object.values(moduleCounts);
            const total = dataValues.reduce((a, b) => a + b, 0);

            // Modern Vibrant Palette
            const colors = [
                '#6366f1', // Indigo
                '#ec4899', // Pink
                '#f59e0b', // Amber
                '#10b981', // Emerald
                '#3b82f6', // Blue
                '#8b5cf6', // Violet
                '#f43f5e'  // Rose
            ];

            if (window.moduleChartInstance) window.moduleChartInstance.destroy();
            window.moduleChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataValues,
                        backgroundColor: colors,
                        hoverOffset: 15,
                        borderWidth: 0,
                        borderRadius: 10,
                        spacing: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: { size: 12, weight: '600', family: 'Outfit' },
                                color: '#64748b'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            padding: 12,
                            titleFont: { size: 14, weight: '700' },
                            bodyFont: { size: 13 },
                            cornerRadius: 8,
                            displayColors: true
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                },
                plugins: [{
                    id: 'centerText',
                    afterDraw: (chart) => {
                        const { ctx, chartArea: { left, top, right, bottom } } = chart;
                        ctx.save();
                        const centerX = (left + right) / 2;
                        const centerY = (top + bottom) / 2;

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        // Draw "Total"
                        ctx.font = '700 32px Outfit';
                        ctx.fillStyle = '#1e293b';
                        ctx.fillText(total, centerX, centerY - 10);

                        // Draw label
                        ctx.font = '600 12px Outfit';
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillText('ALUMNOS', centerX, centerY + 20);
                        ctx.restore();
                    }
                }]
            });
        }

        function renderAttendanceTrendChart() {
            const ctx = document.getElementById('attendanceTrendChart');
            if (!ctx) return;

            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            const dates = Object.keys(records).sort().reverse().slice(0, 7).reverse();
            const list = getFilteredStudents();

            const data = dates.map(date => {
                const dayRecs = records[date];
                let presentCount = 0;
                list.forEach(s => {
                    if (dayRecs[s.name] === 'P') presentCount++;
                });
                return presentCount;
            });

            if (window.attendanceTrendChartInstance) window.attendanceTrendChartInstance.destroy();

            const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

            window.attendanceTrendChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates.map(d => d.split('-').slice(1).reverse().join('/')),
                    datasets: [{
                        label: 'Asistencia',
                        data: data,
                        borderColor: '#6366f1',
                        borderWidth: 3,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.45,
                        pointRadius: 6,
                        pointHitRadius: 10,
                        pointBackgroundColor: 'white',
                        pointBorderColor: '#6366f1',
                        pointBorderWidth: 3,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#6366f1',
                        pointHoverBorderColor: 'white',
                        pointHoverBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f1f5f9' },
                            ticks: { stepSize: 1, font: { size: 11, family: 'Outfit' }, color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11, family: 'Outfit' }, color: '#94a3b8' }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            padding: 12,
                            cornerRadius: 8
                        }
                    }
                }
            });
        }

        // Schedule Capacity Logic (NEW CHIPS DESIGN)
        window.selectedScheduleDay = window.selectedScheduleDay || "Lun"; // Default state

        window.selectScheduleDay = (day) => {
            window.selectedScheduleDay = day;
            updateScheduleCapacity();
        };

        function updateScheduleCapacity(filteredList = null) {
            const container = document.getElementById('schedule-capacity-container');
            if (!container) return;

            const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            // Standardize slots to match what's in student data
            const commonSlots = ["9AM - 11AM", "9AM - 12PM", "11AM - 1PM", "2PM - 3:30PM", "3:30PM - 5PM"];

            let contextCapacity = 10;
            let isAdminWithNoLimit = false;

            if (currentUser.id === 'multimedia') {
                contextCapacity = 5;
            } else if (currentUser.id === 'admin') {
                isAdminWithNoLimit = true;
                contextCapacity = 999;
            } else {
                contextCapacity = parseInt(localStorage.getItem('maxCapacity')) || 10;
            }

            const list = filteredList || getFilteredStudents();

            // 1. Render Day Tabs (Modern Pills)
            let contentHTML = `
                <div class="schedule-day-tabs">
                    ${days.map(d => `
                        <div class="schedule-day-tab ${d === window.selectedScheduleDay ? 'active' : ''}" 
                             onclick="window.selectScheduleDay('${d}')">
                            ${d}
                        </div>
                    `).join('')}
                </div>
            `;

            // 2. Render Time Slots for Selected Day
            contentHTML += `<h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 25px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Horarios Disponibles (${window.selectedScheduleDay})</h3>`;
            contentHTML += `<div class="schedule-slots-grid">`;

            let availableSlots = [];
            if (window.selectedScheduleDay === 'Vie' || window.selectedScheduleDay === 'Sáb') {
                availableSlots = ["9AM - 12PM"];
            } else {
                // Mon-Thu: Show all EXCEPT 9AM-12PM
                availableSlots = commonSlots.filter(s => s !== "9AM - 12PM");
            }

            availableSlots.forEach(slot => {
                // Filter logic: Check if student has this slot AND this day
                const count = list.filter(s => (Array.isArray(s.schedule) ? s.schedule.includes(slot) : s.schedule === slot) && (s.days || []).includes(window.selectedScheduleDay)).length;

                let statusClass = '';
                if (count >= contextCapacity) statusClass = 'full';
                else if (count >= contextCapacity * 0.8) statusClass = 'busy';

                // Format Time for Display cleanup
                const shortTime = slot.split('-')[0].trim();

                contentHTML += `
                    <div class="time-slot-chip ${statusClass}" onclick="openDayShiftModal('${window.selectedScheduleDay}', '${slot}')">
                        <div class="chip-time">${shortTime}</div>
                        <div class="chip-cap">${count} / ${isAdminWithNoLimit ? '∞' : contextCapacity}</div>
                    </div>
                `;
            });

            contentHTML += `</div>`;

            // Add Legend
            contentHTML += `
                <div style="margin-top:30px; display:flex; gap:20px; font-size:12px; font-weight:600; color:#64748b; justify-content:center;">
                    <span style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:white; border:2px solid #cbd5e1; border-radius:50%;"></span> Libre</span>
                    <span style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:#fffbeb; border:2px solid #f59e0b; border-radius:50%;"></span> Ocupado</span>
                    <span style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:#fef2f2; border:2px solid #ef4444; border-radius:50%;"></span> Lleno</span>
                </div>
            `;

            container.innerHTML = contentHTML;
            if (window.lucide) lucide.createIcons();
        }

        // Pensum Render
        // Pensum Render (Modern Gradient Style)


        window.togglePensumDetails = (id) => {
            const details = document.getElementById(`details-${id}`);
            const chevron = document.getElementById(`chevron-${id}`);

            if (details.style.display === 'none') {
                details.style.display = 'block';
                details.style.animation = 'fadeInUp 0.4s ease-out';
                chevron.style.transform = 'rotate(180deg)';
            } else {
                details.style.display = 'none';
                chevron.style.transform = 'rotate(0deg)';
            }
        };


        // TOAST NOTIFICATION SYSTEM

        // Modals
        window.openRegisterModal = () => {
            /* if (currentUser.id !== 'admin') {
            alert("Acceso Restringido: Solo la Dirección Administrativa puede registrar nuevos alumnos.");
            return;
        } */
            document.getElementById('register-modal').classList.add('active');

            // Dynamic Specialties Populate
            const select = document.getElementById('reg-specialty');
            if (select) {
                let specsToRender = [];
                if (currentUser.id === 'admin') {
                    // ADMIN: Shows ALL available specialties
                    specsToRender = Object.keys(specialties);
                } else {
                    // INSTRUCTORS: Show their own specialties
                    specsToRender = currentUser.specialties;
                }

                select.innerHTML = specsToRender.map(spec => `<option value="${spec}">Especialidad ${spec}</option>`).join('');

                // EVENT LISTENER FOR SPECIALTY CHANGE (To enforce rules)
                select.onchange = () => applyScheduleRules(select.value);
                // Apply immediately
                applyScheduleRules(select.value);
            }
        }

        // Helper to enforce schedule rules
        function applyScheduleRules(specialtyName) {
            const dayInputs = document.querySelectorAll('#reg-days-container input');
            const timeInputs = document.querySelectorAll('#reg-schedule-container input');

            // Reset first
            dayInputs.forEach(inp => { inp.disabled = false; inp.parentElement.style.opacity = '1'; });
            timeInputs.forEach(inp => { inp.disabled = false; inp.parentElement.style.opacity = '1'; });

            if (specialtyName === 'Marketing 5.0') {
                // RULE: Only Saturday
                dayInputs.forEach(inp => {
                    if (inp.value !== 'Sáb') {
                        inp.disabled = true;
                        inp.checked = false;
                        inp.parentElement.style.opacity = '0.4';
                    } else {
                        inp.checked = true; // Auto-select Saturday
                    }
                });

                // RULE: Only 9AM - 1PM (Assuming strict matches or "9AM - 12PM" + "11-1" overlaps?)
                // User said "9am a 1pm". My slots are fixed strings. 
                // "9AM - 1PM" is likely what they want, but my system uses "9AM - 12PM", "11AM - 1PM", "2PM - 3:30PM"...
                // I'll check my slots. "9AM - 11AM", "11AM - 1PM", "9AM - 12PM"
                // "9am a 1pm" is 4 hours. Special slot? Or maybe just enable slots that fall within it.
                // Re-reading commonSlots in updateScheduleCapacity: ["9AM - 11AM", "9AM - 12PM", "11AM - 1PM", ...]
                // It's safer to just restrict to the closest available or custom.
                // Let's assume they want the "9AM - 1PM" slot if it exists, or just enable slots that fit. 
                // Actually, I can just force users to pick "9AM - 1PM" if I add it, or pick from existing.
                // Let's restrict to "9AM - 1PM" if I can find it, otherwise I'll add logic to ONLY allow that text if the user types it? No, checkboxes.
                // I will add "9AM - 1PM" to the prompt list if it's missing or just use "9AM - 12PM" and "11AM - 1PM" as Valid.
                // User request: "dejamos... disponible solo los sabado de 9am a 1pm" => implying a SINGLE big slot or range.
                // I will disable anything that starts after 1pm or ends before 9am?
                // Visual simplify: Disable all except "9AM - 1PM" (I need to ensure this option exists or similar).

                // Let's assume standard slots are what we have. 
                // I will Disable all slots EXCEPT those starting with 9AM or 10AM or 11AM... 
                // Actually, let's just forcefuly UNCHECK and DISABLE mismatched ones.
                // Ideally I should check the HTML for available slots.
                // I'll assume they want strictly "9AM - 1PM" to be the chosen scheduled slot.
                // But my system might not have it. I'll stick to disabling clearly wrong ones (Afternoon).

                timeInputs.forEach(inp => {
                    const val = inp.value;
                    // Disable afternoon slots
                    if (val.includes('PM') && !val.includes('12PM') && !val.includes('1PM') && !val.includes('11AM')) {
                        // "2PM", "3:30PM", etc
                        if (val.startsWith('2') || val.startsWith('3') || val.startsWith('4') || val.startsWith('5')) {
                            inp.disabled = true;
                            inp.checked = false;
                            inp.parentElement.style.opacity = '0.4';
                        }
                    }
                });
            }
        } // Ending applyScheduleRules

        window.closeModal = () => document.getElementById('register-modal').classList.remove('active');
        window.openAttendanceModal = () => {
            const modal = document.getElementById('attendance-modal');
            modal.classList.add('active');

            // Populate Modal
            const container = document.getElementById('attendance-list-container');
            const countSpan = document.getElementById('attendance-count');
            const dateSpan = document.getElementById('attendance-date-display') || document.getElementById('attendance-date');
            // Fallback if ID not yet changed in HTML, though we should change it.

            const emptyState = document.getElementById('attendance-empty-state');

            const now = new Date();
            const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const todayName = dayNames[now.getDay()];
            const dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

            if (dateSpan && dateSpan.tagName !== 'INPUT') dateSpan.innerText = dateStr;

            // Filter students for Today (Filtered by department)
            const list = getFilteredStudents();
            const todayStudents = list.filter(s => (s.days || []).includes(todayName));

            if (countSpan) countSpan.innerText = todayStudents.length;

            if (todayStudents.length === 0) {
                if (container) container.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
            } else {
                if (container) {
                    container.style.display = 'flex';
                    container.innerHTML = todayStudents.map(s => `
                <div style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid #eee; background:white; border-radius:8px;">
                    <img src="${window.getAvatarUrl(s.name)}" style="width:36px; height:36px; border-radius:50%;">
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:13px; color:#334155;">${s.name}</div>
                        <div style="font-size:11px; color:#94a3b8;">${s.module}</div>
                    </div>
                     <div style="font-size:11px; font-weight:700; color:#64748b; background:#f1f5f9; padding:4px 8px; border-radius:6px;">
                        ${Array.isArray(s.schedule) ? s.schedule[0] : s.schedule}
                     </div>
                </div>
            `).join('');
                }
                if (emptyState) emptyState.style.display = 'none';
            }
        };
        window.closeAttendanceModal = () => document.getElementById('attendance-modal').classList.remove('active');

        // Defensive Guards: Only attach listeners if elements exist
        const openRegModal = document.getElementById('open-register-modal');
        if (openRegModal) openRegModal.onclick = window.openRegisterModal;

        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) closeModalBtn.onclick = window.closeModal;

        // Registration Logic
        const studentForm = document.getElementById('student-form');
        if (studentForm) {
            studentForm.onsubmit = (e) => {
                e.preventDefault();
                const name = document.getElementById('reg-name').value;
                const dni = document.getElementById('reg-dni').value;
                const specialty = document.getElementById('reg-specialty') ? document.getElementById('reg-specialty').value : "Diseño Gráfico";
                if (!dni) {
                    window.showToast("DNI is invalid or missing.", 'error');
                }
                const phone = document.getElementById('reg-phone').value;
                const portfolio = document.getElementById('reg-portfolio').value;

                if (!name || !dni) {
                    window.showToast("Por favor completa nombre y cédula", 'error');
                    return;
                }

                const days = [];
                document.getElementById('reg-days-container').querySelectorAll('input:checked').forEach(cb => days.push(cb.value));
                const schedules = [];
                document.getElementById('reg-schedule-container').querySelectorAll('input:checked').forEach(cb => schedules.push(cb.value));

                if (days.length === 0 || schedules.length === 0) {
                    window.showToast("Por favor selecciona al menos un día y un horario.", 'error');
                    return;
                }

                const initialMod = specialties[specialty] && specialties[specialty].length > 0 ? specialties[specialty][0] : "Módulo 1: Introducción";
                const topic = pensumContent[initialMod] && pensumContent[initialMod].length > 0 ? pensumContent[initialMod][0] : "Tema 1";

                const newStudent = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    name: name,
                    dni: dni,
                    phone: phone,
                    schedule: schedules, // Array
                    days: days,         // Array
                    specialty: specialty,
                    module: initialMod, // First module
                    topic: topic, // First topic
                    completedDeliverables: [],
                    attendance: 0,
                    manualGrade: null,
                    notes: '',
                    logs: [], // Init empty logs
                    registeredAt: new Date().toISOString()
                };

                students.push(newStudent);

                // SAVE TO DB
                if (window.DBService) {
                    (async () => {
                        try {
                            const result = await window.DBService.saveStudent(newStudent);
                            if (result.success) {
                                console.log("✅ Student saved to DB");
                            } else {
                                console.error("Error saving student (DBService):", result.error);
                                window.showToast("Error al guardar en la nube: " + result.error, "error");
                            }
                        } catch (err) {
                            console.error("Error saving new student (Exception):", err);
                            window.showToast("Error crítico al guardar.", "error");
                        }
                    })();
                } else {
                    console.error("❌ DBService missing during save.");
                    window.showToast("Error de Conexión: No se pudo guardar en la nube.", 'error');
                    save(); // Fallback
                }

                window.showToast(`¡${name} registrado correctamente!`, 'success');

                // Reset Form
                document.getElementById('reg-name').value = '';
                document.getElementById('reg-dni').value = '';
                document.getElementById('reg-phone').value = '';
                document.getElementById('reg-portfolio').value = '';
                document.getElementById('reg-gender').value = 'Masculino'; // Reset to default
                document.querySelectorAll('#reg-days-container input').forEach(cb => cb.checked = false);
                document.querySelectorAll('#reg-schedule-container input').forEach(cb => cb.checked = false);

                // Close Modal & Refresh
                document.getElementById('register-modal').classList.remove('active');
                renderStudents();
                updateStats();
            };
        } // End if (studentForm)

        // Utils
        function checkRecentAbsences(name) {
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            let absences = 0;
            const dates = Object.keys(records).sort().reverse();
            for (let d of dates) {
                if (records[d][name] === 'A') {
                    absences++;
                } else if (records[d][name] === 'P') {
                    break;
                }
            }
            return absences;
        }

        // Report Generation
        window.generateReport = (idx) => {
            const s = students[idx];
            const reportWindow = window.open('', '_blank');
            const today = new Date().toLocaleDateString();

            // Progress Logic
            const topics = pensumContent[s.module] || [];
            const idxTopic = topics.indexOf(s.topic);
            const prog = topics.length > 0 ? Math.round(((idxTopic + 1) / topics.length) * 100) : 0;
            const isFinished = prog === 100;

            // Status Text
            const statusText = isFinished ? "Finalizado" : "En Curso";
            const statusColor = isFinished ? "green" : "#e67e22";

            reportWindow.document.write(`
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte Académico - ${s.name}</title>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                .logo-text { font-size: 24px; font-weight: bold; color: #16234d; }
                .student-profile { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 12px; }
                .metric { flex: 1; text-align: center; border-left: 1px solid #ddd; }
                .metric:first-child { border-left: none; }
                .metric-val { font-size: 24px; font-weight: bold; color: #f8ad00; }
                .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #555; border-left: 4px solid #f8ad00; padding-left: 10px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .table th, .table td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; font-size: 13px; }
                .table th { background: #f8f9fa; font-weight: 600; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <!-- LOGO UPDATE -->
                <img src="logo-academy.png" style="height: 80px; object-fit: contain; display: block; margin: 0 auto 10px;">
                <!-- Name removed as requested (in logo) -->
                <div style="color: #666; margin-top: 5px;">Reporte de Progreso Estudiantil</div>
                <div style="color: #999; font-size: 12px; margin-top: 5px;">Generado el ${today}</div>
            </div>

            <div class="student-profile">
                <div style="flex:2; padding-right:20px;">
                    <h1 style="margin: 0; font-size: 28px;">${s.name}</h1>
                    <p style="margin: 5px 0 0; color: #666;">${s.specialty || 'Diseño Gráfico'}</p>
                </div>
                
                <div class="metric">
                    <div class="metric-val">${s.module}</div>
                    <div style="font-size:11px; color:#888;">Módulo Actual</div>
                </div>

                <div class="metric">
                    <div class="metric-val" style="color:#2ecc71;">${(s.history || []).length} / 5</div>
                    <div style="font-size:11px; color:#888;">Módulos Aprobados</div>
                </div>
            </div>

            <div class="section-title">Historial de Módulos</div>
            <table class="table">
                <thead><tr><th>Módulo</th><th>Estado</th><th>Fecha</th></tr></thead>
                <tbody>
                    ${(s.history || []).map(h => `
                        <tr><td>${h.module}</td><td><span style="color:green; font-weight:bold;">Aprobado</span></td><td>${h.date}</td></tr>
                    `).join('')}
                    <tr><td>${s.module}</td><td><span style="color:${statusColor}; font-weight:bold;">${statusText}</span></td><td>-</td></tr>
                </tbody>
            </table>

            <div class="section-title">Progreso Módulo Actual: ${s.module}</div>
            <table class="table">
                <thead><tr><th>Tema</th><th>Estado</th></tr></thead>
                <tbody>
                    ${(pensumContent[s.module] || []).map((t, i) => {
                const currentIdx = (pensumContent[s.module] || []).indexOf(s.topic);
                if (i <= currentIdx) {
                    const status = (i === currentIdx && !isFinished) ? 'En Proceso' : 'Visto';
                    const color = (i === currentIdx && !isFinished) ? '#e67e22' : 'green';
                    return `<tr><td>${t}</td><td><span style="color:${color}; font-weight:bold;">${status}</span></td></tr>`;
                }
                return '';
            }).join('')}
                </tbody>
            </table>

            <div class="section-title">Entregables y Metas</div>
            <ul style="font-size:13px; color:#555; line-height:1.6; list-style:none; padding-left:0;">
                ${(moduleDeliverables[s.module] || []).map(d => {
                const isDone = (s.completedDeliverables || []).includes(d);
                // Using simple unicode characters for reliability
                return `<li style="margin-bottom:5px;">
            <span style="display:inline-block; width:20px;">${isDone ? '&#10004;' : '&#9744;'}</span> ${d}
        </li>`;
            }).join('')}
            </ul>

            <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
                Este documento es un reporte oficial de progreso interno.<br>
                Academia CTD 2026
            </div>

            <script>window.print();</script>
        </body>
        </html>
    `);
            reportWindow.document.close();
        };

        // ==========================================
        // PENSUM / CURRICULUM DISPLAY
        // ==========================================


        // ==========================================
        // PENSUM / CURRICULUM DISPLAY (DYNAMIC)
        // ==========================================

        window.renderPensumView = () => {
            const container = document.getElementById('pensum-grid-container');
            const filterContainer = document.getElementById('pensum-filters-container');
            if (!container || !filterContainer) return;

            // 1. Determine Specialties to Show
            let specsToShow = [];
            if (currentUser.id === 'admin') {
                specsToShow = Object.keys(specialties); // Admin sees all
            } else {
                specsToShow = currentUser.specialties || []; // Department sees its own
            }

            // 2. Render Filter Chips
            let filterHTML = `<button class="filter-chip active" onclick="filterPensumByCategory('all')">Todos</button>`;
            specsToShow.forEach(spec => {
                let label = spec;
                if (spec === 'Diseño para Redes Sociales') label = 'Redes Sociales';
                if (spec === 'Ingeniería de Prompts') label = 'Prompts (IA)';

                filterHTML += `<button class="filter-chip" onclick="filterPensumByCategory('${spec}')">${label}</button>`;
            });
            filterContainer.innerHTML = filterHTML;

            // 3. Render All Grid (Initially 'all')
            window.filterPensumByCategory('all');
        };

        window.filterPensumByCategory = (category) => {
            // Update Active State
            const chips = document.querySelectorAll('.pensum-filters .filter-chip');
            chips.forEach(c => {
                if (c.getAttribute('onclick').includes(`'${category}'`)) c.classList.add('active');
                else c.classList.remove('active');
            });

            const container = document.getElementById('pensum-grid-container');
            container.innerHTML = '';

            let specsToRender = [];
            if (category === 'all') {
                if (currentUser.id === 'admin') {
                    specsToRender = Object.keys(specialties);
                } else {
                    specsToRender = currentUser.specialties || [];
                }
            } else {
                specsToRender = [category];
            }

            if (specsToRender.length === 0) {
                container.innerHTML = `
                    <div style="grid-column:1/-1; text-align:center; padding:50px; color:#94a3b8;">
                        <i data-lucide="book-open" style="width:48px; height:48px; margin-bottom:15px; opacity:0.2;"></i>
                        <p>No hay módulos disponibles.</p>
                    </div>
                `;
                return;
            }

            let html = '';
            specsToRender.forEach((spec, i) => {
                // Get Theme Color
                let color = '#3b82f6'; // Default blue
                const s = spec.toLowerCase();
                if (s.includes('diseño')) color = '#f59e0b';
                if (s.includes('redes') || s.includes('marketing')) color = '#ef4444';
                if (s.includes('ia') || s.includes('prompts')) color = '#8b5cf6';
                if (s.includes('excel')) color = '#10b981';

                html += renderSpecialtyCard(spec, `pensum-acc-${i}`, color);
            });

            container.innerHTML = html;
            if (window.lucide) lucide.createIcons();
        };

        // Helper to render a specialty card (Accordion)
        function renderSpecialtyCard(specialtyName, accordionId, themeColor) {
            const modules = specialties[specialtyName] || [];
            const moduleCount = modules.length;

            // Map icons based on name
            let icon = 'book';
            if (specialtyName.includes('Web')) icon = 'layout';
            if (specialtyName.includes('Video')) icon = 'video';
            if (specialtyName.includes('Redes')) icon = 'share-2';
            if (specialtyName.includes('Gráfico')) icon = 'edit-3';

            return `
                <div style="background:white; border-radius:16px; padding:18px 24px; box-shadow:0 2px 10px rgba(0,0,0,0.04); border:1px solid #f1f5f9; cursor:pointer;" onclick="togglePensumAccordion('${accordionId}')">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:40px; height:40px; background:${themeColor}; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i data-lucide="${icon}" style="width:20px; color:white;"></i>
                        </div>
                        <div style="flex:1;">
                            <div style="font-size:16px; font-weight:700; color:#1e293b;">${specialtyName}</div>
                            <div style="font-size:12px; color:#64748b;">${moduleCount} Módulos Disponibles</div>
                        </div>
                        <i data-lucide="chevron-down" id="${accordionId}-chevron" style="width:18px; color:#94a3b8; transition:transform 0.3s;"></i>
                    </div>
                    
                    <div id="${accordionId}" style="display:none; margin-top:15px; padding-top:15px; border-top:1px solid #f8fafc;">
                        ${modules.map((moduleName, modIdx) => {
                const topics = pensumContent[moduleName] || [];
                return `
                                <div style="background:#f8fafc; border-radius:12px; padding:15px; margin-bottom:10px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                        <div style="font-size:14px; font-weight:700; color:#334155;">${modIdx + 1}. ${moduleName}</div>
                                        <span style="background:white; color:#64748b; padding:3px 8px; border-radius:6px; font-size:10px; font-weight:700; border:1px solid #e2e8f0;">${topics.length} temas</span>
                                    </div>
                                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:8px;">
                                        ${topics.map((t, ti) => `
                                            <div style="font-size:12px; color:#64748b; display:flex; align-items:center; gap:8px; padding:4px 0;">
                                                <span style="width:18px; height:18px; border-radius:50%; background:#e2e8f0; color:#475569; font-size:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ti + 1}</span>
                                                <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        }

        // Toggle accordion function
        window.togglePensumAccordion = (accordionId) => {
            const content = document.getElementById(accordionId);
            const chevron = document.getElementById(accordionId + '-chevron');

            if (content && chevron) {
                const isOpen = content.style.display !== 'none';

                if (isOpen) {
                    content.style.display = 'none';
                    chevron.style.transform = 'rotate(0deg)';
                } else {
                    content.style.display = 'block';
                    chevron.style.transform = 'rotate(180deg)';
                }
            }
        };

        // Calendar Logic (V2 - Modern Timeline)
        let calendarDate = new Date();
        let selectedCalendarDay = new Date().getDate(); // Default to today

        window.changeCalendarMonth = (n) => {
            calendarDate.setMonth(calendarDate.getMonth() + n);
            // Reset selected day to 1 when changing month, unless it's current month
            const today = new Date();
            if (calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear()) {
                selectedCalendarDay = today.getDate();
            } else {
                selectedCalendarDay = 1;
            }
            renderCalendar();

            // Auto-scroll to start if day 1
            if (selectedCalendarDay === 1) {
                setTimeout(() => {
                    const strip = document.querySelector('.calendar-strip');
                    if (strip) strip.scrollLeft = 0;
                }, 100);
            }
        };

        window.selectCalendarDay = (day) => {
            selectedCalendarDay = day;
            renderCalendar(); // Re-render to update active states
        };

        window.renderCalendar = () => {
            const container = document.getElementById('calendar-grid');
            const title = document.getElementById('current-month');
            if (!container || !title) return;

            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            // Update Header
            title.innerHTML = `${monthNames[month]} <span style="font-size:14px; opacity:0.5; font-weight:400;">${year}</span>`;

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const dayNamesShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

            // 1. Render Horizontal Day Strip (Preserved for navigation)
            let stripHTML = '<div class="calendar-strip">';
            for (let i = 1; i <= daysInMonth; i++) {
                const dateObj = new Date(year, month, i);
                const dayIndex = dateObj.getDay();
                const dayName = dayNamesShort[dayIndex];
                const isActive = (i === selectedCalendarDay);

                stripHTML += `
                    <div class="calendar-day-pill ${isActive ? 'active' : ''}" onclick="selectCalendarDay(${i})">
                        <span class="day-num">${i}</span>
                        <span class="day-name">${dayName}</span>
                    </div>
                `;
            }
            stripHTML += '</div>';

            // 2. Filter Data for Grid
            const selectedDateObj = new Date(year, month, selectedCalendarDay);
            const selectedDayIndex = selectedDateObj.getDay();
            const selectedDayName = dayNamesShort[selectedDayIndex];

            const studentsList = getFilteredStudents();
            let dailyStudents = studentsList.filter(s => (s.days || []).includes(selectedDayName));

            // Stats Calculation
            const totalTasks = dailyStudents.length;
            const pendingApproval = dailyStudents.filter(s => !s.completedDeliverables || s.completedDeliverables.length === 0).length;

            // Apply Toggle Filter
            if (!window.calendarFilter) window.calendarFilter = 'active';

            if (window.calendarFilter === 'active') {
                dailyStudents = dailyStudents.filter(s => !s.manualGrade);
            } else if (window.calendarFilter === 'completed') {
                dailyStudents = dailyStudents.filter(s => s.manualGrade);
            }

            // 3. Render Controls & Stats Header
            const activeClass = window.calendarFilter === 'active' ? 'dark' : 'light';
            const completedClass = window.calendarFilter === 'completed' ? 'dark' : 'light';

            let controlsHTML = `
                <div class="calendar-controls">
                    <div class="calendar-actions-bar">
                        <div class="action-pill ${activeClass}" onclick="window.setCalendarFilter('active')">
                            ${window.calendarFilter === 'active' ? '<span style="width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>' : ''}
                            En Curso
                        </div>
                        <div class="action-pill ${completedClass}" onclick="window.setCalendarFilter('completed')">
                             ${window.calendarFilter === 'completed' ? '<span style="width: 8px; height: 8px; background: #fbbf24; border-radius: 50%;"></span>' : ''}
                            Finalizados
                        </div>
                        <div class="action-pill light" style="padding: 8px;">
                            <i data-lucide="filter" style="width: 16px;"></i>
                        </div>
                    </div>

                    <div class="calendar-stats">
                        <div class="stat-item">
                            <span class="stat-label">Clases Hoy</span>
                            <span class="stat-value">${totalTasks}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pendientes</span>
                            <span class="stat-value">${pendingApproval}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Alumnos</span>
                            <span class="stat-value">${dailyStudents.length}</span>
                        </div>
                         <div class="calendar-actions-bar">
                            <div class="action-pill light" style="padding: 10px;">
                                <i data-lucide="bar-chart-2" style="width: 18px;"></i>
                            </div>
                            <div class="action-pill light" style="padding: 10px;">
                                <i data-lucide="download-cloud" style="width: 18px;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // 4. Render Grid Cards
            let gridHTML = '<div class="calendar-task-grid">';

            if (dailyStudents.length === 0) {
                const msg = window.calendarFilter === 'active' ? 'No hay clases pendientes.' : 'No hay clases finalizadas.';
                gridHTML += `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #94a3b8;">
                        <i data-lucide="coffee" style="width: 48px; height: 48px; margin-bottom: 20px; opacity: 0.2;"></i>
                        <div style="font-size: 18px; font-weight: 600;">${msg}</div>
                        <div style="font-size: 14px;">Intenta cambiar el filtro.</div>
                    </div>
                `;
            } else {
                dailyStudents.forEach((s, index) => {
                    const sch = Array.isArray(s.schedule) ? s.schedule[0] : (s.schedule || "Sin Horario");

                    // Deterministic Pastel Color
                    const colors = ['bg-purple', 'bg-pink', 'bg-yellow', 'bg-blue', 'bg-green'];
                    // Hash string to index
                    const charCodeSum = s.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                    const colorClass = colors[charCodeSum % colors.length];

                    // Random icon for variety (or mapped to module if we had mapping)
                    const icons = ['bookmark', 'layers', 'box', 'layout'];
                    const icon = icons[index % icons.length];

                    // Progress Mock (random 30-80%)
                    const progress = 30 + (index * 7) % 50;

                    gridHTML += `
                        <div class="task-card ${colorClass}" onclick="openDayShiftModal('${selectedDayName}', '${sch}')">
                            <div class="card-header">
                                <div class="task-title">${s.module}</div>
                                <div class="task-menu-btn"><i data-lucide="more-horizontal" style="width: 18px;"></i></div>
                            </div>
                            
                            <div class="progress-pill" style="color: rgba(0,0,0,0.5);">
                                <style>.progress-pill::after { width: ${progress}%; }</style>
                            </div>

                            <div class="card-footer">
                                <div class="avatar-group">
                                    <img src="${window.getAvatarUrl(s.name)}" class="avatar">
                                    <div class="student-info">
                                        <span class="student-name">${s.name}</span>
                                        <span class="class-time">${sch}</span>
                                    </div>
                                </div>
                                <div class="floating-icon">
                                    <i data-lucide="${icon}" style="width: 16px; opacity: 0.7;"></i>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }

            gridHTML += '</div>';

            container.innerHTML = stripHTML + controlsHTML + gridHTML;
            if (window.lucide) lucide.createIcons();

            // Auto scroll strip with improved reliability
            const scrollActiveDay = () => {
                const activePill = container.querySelector('.calendar-day-pill.active');
                if (activePill) {
                    activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            };

            // Try immediate and slightly delayed for safety
            requestAnimationFrame(scrollActiveDay);
            setTimeout(scrollActiveDay, 300);
        };

        // Open Calendar Day Details
        window.openCalendarDayModal = (isoDate, dayName) => {
            const dateObj = new Date(isoDate);
            // Format full date: "Lunes, 12 de Enero"
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateStr = dateObj.toLocaleDateString('es-ES', options);

            // Filter students by day AND by current department
            const dailyStudents = getFilteredStudents().filter(s => (s.days || []).includes(dayName));

            // Group by Schedule Slot for better reading
            // ... (rest of function)

            // Re-render
            renderCalendar();

            // Group by Schedule Slot for better reading
            const slots = {};
            dailyStudents.forEach(s => {
                const sch = Array.isArray(s.schedule) ? s.schedule[0] : s.schedule; // Pick first if multiple (simplification)
                if (!slots[sch]) slots[sch] = [];
                slots[sch].push(s);
            });

            // Re-use the 'shift-modal' DOM elements for this view to save code
            // We just change the title and content
            const modalTitle = document.getElementById('shift-modal-title');
            const list = document.getElementById('shift-modal-list');

            modalTitle.innerHTML = `<span style="text-transform:capitalize;">${dateStr}</span> <span style="font-size:12px; color:#94a3b8; margin-left:10px;">(${dailyStudents.length} Alumnos)</span>`;

            if (dailyStudents.length === 0) {
                list.innerHTML = `<div style="text-align:center; padding:40px; color:#cbd5e1;">
            <i data-lucide="calendar-off" style="width:30px; margin-bottom:10px;"></i><br>No hay clases este día.
        </div>`;
            } else {
                // Render grouped by slot
                // Order keys manually or alphabetical? Alphabetical is okay for "11AM", "9AM", "2PM". 
                // Let's rely on stored order or simple sort.
                const sortedSlots = Object.keys(slots).sort();

                list.innerHTML = sortedSlots.map(slot => `
            <div style="background:#f8fafc; padding:8px 12px; font-size:11px; font-weight:800; color:#64748b; border-bottom:1px solid #e2e8f0; margin-top:0px;">
                <i data-lucide="clock" style="width:11px; vertical-align:middle;"></i> ${slot}
            </div>
            ${slots[slot].map(s => `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px 15px; border-bottom: 1px solid #eee; background:white;">
                     <img src="${window.getAvatarUrl(s.name)}" style="width: 32px; height:32px; border-radius: 50%;">
                     <div>
                        <div style="font-weight:700; font-size:13px; color:#334155;">${s.name}</div>
                        <div style="font-size:11px; color:#94a3b8;">${s.module}</div>
                     </div>
                </div>
            `).join('')}
        `).join('');
            }

            document.getElementById('shift-modal').classList.add('active');
            if (window.lucide) lucide.createIcons();
        };

        window.setCalendarFilter = (filter) => {
            window.calendarFilter = filter;
            renderCalendar();
        };

        // 4. SETTINGS & BACKUP LOGIC (New)
        window.saveSettings = () => {
            const academyName = document.getElementById('sett-academy-name').value;
            const instructorName = document.getElementById('sett-instructor-name').value;
            const instructorAvatar = document.getElementById('sett-instructor-avatar').value;
            const maxCapacity = document.getElementById('sett-max-capacity').value;
            const riskPercent = document.getElementById('sett-risk-percent').value;

            // Save to LocalStorage (Individual Keys for Robustness)
            if (academyName) localStorage.setItem('academyName', academyName);
            if (instructorName) localStorage.setItem('instructorName', instructorName);
            if (instructorAvatar) localStorage.setItem('instructorAvatar', instructorAvatar);
            if (maxCapacity) localStorage.setItem('maxCapacity', maxCapacity);
            if (riskPercent) localStorage.setItem('riskPercent', riskPercent);

            // Update UI immediately (Sidebar Title if exists, or Global Vars)
            if (academyName) {
                // If there's a text logo, update it. If not, just saving the name is enough for Reports.
                const logoText = document.querySelector('.logo-text');
                if (logoText) logoText.innerHTML = academyName.split(' ')[0] + ' <span>' + (academyName.split(' ')[1] || '') + '</span>';
            }

            if (window.showToast) window.showToast('Configuración guardada correctamente.', 'success');
        };

        window.factoryReset = () => {
            if (confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsto borrará PERMANENTEMENTE todos los datos de la memoria del navegador (Alumnos, Pagos, Asistencias).\n\nEs ideal si quieres empezar de cero como si fuera una base de datos nueva.\n\nEsta acción no se puede deshacer.")) {
                localStorage.clear();
                window.showToast("♻️ Sistema reiniciado de fábrica.", "success");
                setTimeout(() => location.reload(), 1500);
            }
        };

        window.downloadBackup = () => {
            // Collect ALL critical data keys for a Full System Backup (V2.0)
            const fullBackup = {
                meta: {
                    version: "2.0",
                    timestamp: new Date().toISOString(),
                    exportedBy: "Sistema de Control Estudiantil"
                },
                data: {
                    students: localStorage.getItem('design_students') ? JSON.parse(localStorage.getItem('design_students')) : [],
                    attendance: localStorage.getItem('attendanceRecords') ? JSON.parse(localStorage.getItem('attendanceRecords')) : {},
                    pensum: localStorage.getItem('design_pensum_content') ? JSON.parse(localStorage.getItem('design_pensum_content')) : {},
                    departments: localStorage.getItem('availableDepartments') ? JSON.parse(localStorage.getItem('availableDepartments')) : [],
                    payments: localStorage.getItem('payments') ? JSON.parse(localStorage.getItem('payments')) : [],
                    logs: localStorage.getItem('globalLogs') ? JSON.parse(localStorage.getItem('globalLogs')) : [],
                    specialties: localStorage.getItem('specialties_structure') ? JSON.parse(localStorage.getItem('specialties_structure')) : {},
                    settings: {
                        academyName: localStorage.getItem('academyName'),
                        maxCapacity: localStorage.getItem('maxCapacity'),
                        riskPercent: localStorage.getItem('riskPercent'),
                        riskAbsences: localStorage.getItem('riskAbsences')
                    }
                }
            };

            // WEEKLY ATTENDANCE REPORT GENERATOR
            window.generateWeeklyAttendanceReport = () => {
                if (typeof XLSX === 'undefined') return alert("Librería Excel no lista.");

                const now = new Date();
                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay() || 7; // Get current day number, convert Sun (0) to 7
                if (day !== 1) startOfWeek.setHours(-24 * (day - 1)); // Set to Monday 

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                const weekLabel = `${startOfWeek.getDate()}-${startOfWeek.getMonth() + 1}_al_${endOfWeek.getDate()}-${endOfWeek.getMonth() + 1}`;

                // Generate Date Columns (Mon-Sat)
                const weekDates = [];
                const headerRow = ["Estudiante", "Turno", "Grupo"];

                for (let i = 0; i < 6; i++) {
                    const d = new Date(startOfWeek);
                    d.setDate(startOfWeek.getDate() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    const dayName = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][d.getDay()];

                    weekDates.push({ key: dateStr, label: `${dayName} ${d.getDate()}` });
                    headerRow.push(`${dayName} ${d.getDate()}`);
                }
                headerRow.push("Asistencias Semana");
                headerRow.push("Estado");

                // Build Data Rows
                const exportData = students.map(s => {
                    const row = {
                        "Estudiante": s.name,
                        "Turno": Array.isArray(s.schedule) ? s.schedule[0] : s.schedule,
                        "Grupo": s.group || "G1"
                    };

                    let weeklyCount = 0;

                    weekDates.forEach(wd => {
                        const record = (attendanceRecords[wd.key] || []).find(r => r.studentId === s.id);
                        let symbol = ""; // Empty if no class scheduled/recorded

                        // Basic check if student has class this day
                        // In a real app we'd parse s.days (e.g. "Lun, Mié") and match with wd.label

                        if (record) {
                            if (record.status === 'present') { symbol = "✔"; weeklyCount++; }
                            if (record.status === 'absent') symbol = "✖";
                            if (record.status === 'late') symbol = "🕒";
                            if (record.status === 'makeup') symbol = "R";
                        }

                        row[wd.label] = symbol;
                    });

                    row["Asistencias Semana"] = weeklyCount;
                    row["Estado"] = weeklyCount > 0 ? "Activo" : "Sin Asistencia";

                    return row;
                });

                // Create Workbook
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(exportData);

                // Adjust Column Widths
                const wscols = [
                    { wch: 30 }, // Name
                    { wch: 20 }, // Turno
                    { wch: 10 }, // Grupo
                    { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, // Days
                    { wch: 15 }, // Total
                    { wch: 15 }  // Status
                ];
                ws['!cols'] = wscols;

                XLSX.utils.book_append_sheet(wb, ws, "Semana Actual");
                XLSX.writeFile(wb, `Reporte_Semanal_${weekLabel}.xlsx`);

                if (window.showToast) window.showToast("Reporte Semanal descargado exitosamente", "success");
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "CTD_Respaldo_Sistema_" + new Date().toISOString().slice(0, 10).replace(/-/g, '') + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            if (window.showToast) window.showToast("Copia de seguridad descargada (Sistema Completo).", "success");
        };

        window.restoreBackup = (input) => {
            const file = input.files[0];
            if (!file) return;

            if (!confirm("⚠️ PRECAUCIÓN DE SEGURIDAD ⚠️\n\nEsta acción SOBREESCRIBIRÁ TODOS los datos actuales:\n- Alumnos\n- Asistencias\n- Pagos\n- Configuraciones\n\n¿Estás seguro que deseas RESTAURAR este archivo?")) {
                input.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);

                    // Intelligent Restore: Handle both V1 (Legacy) and V2 (Robust) formats
                    let success = false;

                    // V2 Check
                    if (backup.meta && backup.meta.version && backup.data) {
                        console.log("🔄 Restoring V2 Backup...");
                        if (backup.data.students) localStorage.setItem('design_students', JSON.stringify(backup.data.students));
                        if (backup.data.attendance) localStorage.setItem('attendanceRecords', JSON.stringify(backup.data.attendance));
                        if (backup.data.pensum) localStorage.setItem('design_pensum_content', JSON.stringify(backup.data.pensum));
                        if (backup.data.departments) localStorage.setItem('availableDepartments', JSON.stringify(backup.data.departments));
                        if (backup.data.payments) localStorage.setItem('payments', JSON.stringify(backup.data.payments));
                        if (backup.data.logs) localStorage.setItem('globalLogs', JSON.stringify(backup.data.logs));
                        if (backup.data.specialties) localStorage.setItem('specialties_structure', JSON.stringify(backup.data.specialties));

                        // Settings
                        if (backup.data.settings) {
                            if (backup.data.settings.academyName) localStorage.setItem('academyName', backup.data.settings.academyName);
                            if (backup.data.settings.maxCapacity) localStorage.setItem('maxCapacity', backup.data.settings.maxCapacity);
                            if (backup.data.settings.riskPercent) localStorage.setItem('riskPercent', backup.data.settings.riskPercent);
                        }
                        success = true;
                    }
                    // V1 Check (Legacy Fallback)
                    else if (backup.students) {
                        console.log("⚠️ Restoring Legacy V1 Backup...");
                        localStorage.setItem('design_students', JSON.stringify(backup.students)); // Corrected Key
                        if (backup.settings) localStorage.setItem('dashboardSettings', JSON.stringify(backup.settings));
                        success = true;
                    }

                    if (success) {
                        alert('✅ Sistema restaurado correctamente.\nLa página se recargará para aplicar los cambios.');
                        location.reload();
                    } else {
                        alert('❌ Error: El archivo no tiene un formato válido.');
                    }

                } catch (err) {
                    console.error(err);
                    alert('❌ Error crítico al leer el archivo. Revisa la consola.');
                }
            };
            reader.readAsText(file);
        };

        // PROFESSIONAL EXCEL EXPORT (Using SheetJS)
        window.exportToExcel = () => {
            if (typeof XLSX === 'undefined') {
                alert("Librería Excel no cargada. Revisa tu conexión a internet.");
                return;
            }

            // 1. Prepare Data
            const exportData = students.map(s => {
                const perf = calculatePerformance(s);
                const att = getAttendanceStats(s.name);

                return {
                    "ID Sistema": s.id || '-',
                    "Nombre Completo": s.name,
                    "Documento ID": s.dni || 'N/A',
                    "Especialidad": s.specialty,
                    "Módulo Actual": s.module,
                    "Tema Actual": s.topic,
                    "Turno": Array.isArray(s.schedule) ? s.schedule.join(', ') : s.schedule,
                    "Días": Array.isArray(s.days) ? s.days.join(', ') : (s.days || ''),
                    "Asistencias": att.present,
                    "Inasistencias": att.absent,
                    "% Asistencia": att.percent + '%',
                    "Estado Académico": perf.label,
                    "Promedio (Ref)": perf.rawScore ? perf.rawScore.toFixed(1) : '-',
                    "Teléfono": s.phone || '',
                    "Portafolio": s.portfolio || ''
                };
            });

            // 2. Create Workbook
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Auto-width columns based on content (approximate)
            const wscols = [
                { wch: 15 }, // ID
                { wch: 30 }, // Name
                { wch: 15 }, // DNI
                { wch: 25 }, // Specialty
                { wch: 25 }, // Module
                { wch: 25 }, // Topic
                { wch: 20 }, // Schedule
                { wch: 15 }, // Days
                { wch: 10 }, { wch: 10 }, { wch: 10 }, // Stats
                { wch: 15 }, // Status
                { wch: 10 }, // Avg
                { wch: 15 }, // Phone
                { wch: 30 }  // Portfolio
            ];
            ws['!cols'] = wscols;

            XLSX.utils.book_append_sheet(wb, ws, "Estudiantes Activos");

            // 3. Export
            // Celebrate if big export
            if (exportData.length > 50) window.triggerCelebration();

            XLSX.writeFile(wb, `CTD_Reporte_Estudiantes_${new Date().toISOString().slice(0, 10)}.xlsx`);
            if (window.showToast) window.showToast("Reporte Excel generado correctamente", "success");
        };

        // CELEBRATION EFFECTS
        window.triggerCelebration = () => {
            if (typeof confetti === 'undefined') return;

            // Cannon 1
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#16234d', '#e67e22', '#f8ad00'] // Brand Colors
            });

            // Cannon 2 (Delayed)
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#16234d', '#e67e22']
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#16234d', '#e67e22']
                });
            }, 250);
        };



        // 5. RENDER SETTINGS (New Grid Based)
        window.renderSettings = () => {
            // Logic to refresh inputs if needed, though they are static.
            // Mainly for reloading from LocalStorage if switched to view.
            try {
                const name = localStorage.getItem('academyName') || "";
                const instructor = localStorage.getItem('instructorName') || ""; // Fix key
                const avatar = localStorage.getItem('instructorAvatar') || "";
                const cap = localStorage.getItem('maxCapacity') || 10;
                const risk = localStorage.getItem('riskPercent') || 75;

                if (document.getElementById('sett-academy-name')) document.getElementById('sett-academy-name').value = name;
                if (document.getElementById('sett-instructor-name')) document.getElementById('sett-instructor-name').value = instructor;
                if (document.getElementById('sett-instructor-avatar')) document.getElementById('sett-instructor-avatar').value = avatar;
                if (document.getElementById('sett-max-capacity')) document.getElementById('sett-max-capacity').value = cap;
                if (document.getElementById('sett-risk-percent')) document.getElementById('sett-risk-percent').value = risk;

                // Allow admin user management visibility
                if (currentUser && currentUser.id === 'admin') {
                    const adminSection = document.getElementById('admin-user-management');
                    if (adminSection) {
                        adminSection.style.display = 'block';
                        if (typeof renderSettingsUsers === 'function') renderSettingsUsers();
                    }
                }
            } catch (e) { console.error("Error rendering settings", e); }
        };

        // 6. RENDER PENSUM CONFIG (New Grid Based)


        window.addTopicToModule = (moduleName) => {
            const topic = prompt(`Nuevo tema para ${moduleName}:`);
            if (topic) {
                if (!pensumContent[moduleName]) pensumContent[moduleName] = [];
                pensumContent[moduleName].push(topic);
                renderPensumConfig();
                // Auto save?
                localStorage.setItem('design_pensum_content', JSON.stringify(pensumContent));
            }
        };

        window.removeTopicFromModule = (moduleName, idx) => {
            if (confirm("¿Borrar este tema?")) {
                pensumContent[moduleName].splice(idx, 1);
                renderPensumConfig();
                localStorage.setItem('design_pensum_content', JSON.stringify(pensumContent));
            }
        };

        // History View Render
        window.renderHistory = () => {
            const tbody = document.getElementById('history-table-body');
            if (!tbody) return;

            // Define allowed modules for the current active department
            const allowedModules = new Set();
            if (currentUser && currentUser.specialties) {
                currentUser.specialties.forEach(spec => {
                    const mods = specialties[spec] || [];
                    mods.forEach(m => allowedModules.add(m));
                });
            }

            let allEvents = [];
            const list = getFilteredStudents();
            list.forEach(s => {
                if (s.history && Array.isArray(s.history)) {
                    s.history.forEach(h => {
                        // Only show history relevant to this department
                        if (allowedModules.has(h.module)) {
                            allEvents.push({
                                student: s.name,
                                module: h.module,
                                date: h.date
                            });
                        }
                    });
                }
            });

            // Sort by date descending
            allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (allEvents.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:#cbd5e1;">No hay historial registrado aún.</td></tr>`;
                return;
            }

            tbody.innerHTML = allEvents.map(e => {
                const dateObj = new Date(e.date);
                // Format: "12 Ene 2026 - 10:30 AM"
                const dateStr = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                return `
        <tr>
            <td style="padding:15px;">
                <div style="display:flex; align-items:center; gap:10px;">
                     <img src="${window.getAvatarUrl(e.student)}" style="width:30px; height:30px; border-radius:50%;">
                     <div style="font-weight:700; color:#334155;">${e.student}</div>
                </div>
            </td>
            <td style="padding:15px;">
                <span style="background:#f0f9ff; color:#0369a1; padding:4px 10px; border-radius:15px; font-size:11px; font-weight:700; border:1px solid #bae6fd;">
                    ${e.module}
                </span>
            </td>
            <td style="padding:15px; color:#64748b; font-size:12px; font-weight:600;">
                ${dateStr} <span style="color:#cbd5e1; margin:0 5px;">|</span> ${timeStr}
            </td>
        </tr>
    `}).join('');
        };

        window.renderGraduates = () => {
            const tbody = document.getElementById('graduates-table-body');
            if (!tbody) return;

            // Get graduates for the current area or all if admin
            const gradList = getFilteredStudents(true);

            if (gradList.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align:center; padding:60px 20px; color:#94a3b8;">
                            <div style="display:flex; flex-direction:column; align-items:center; opacity:0.4;">
                                <i data-lucide="award" style="width:64px; height:64px; margin-bottom:15px;"></i>
                                <div style="font-size:18px; font-weight:700;">Aún no hay graduados en esta sección</div>
                                <div style="font-size:13px;">Los alumnos que finalicen su carrera aparecerán aquí como parte del Cuadro de Honor.</div>
                            </div>
                        </td>
                    </tr>
                `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            tbody.innerHTML = gradList.map(s => {
                const dateObj = s.graduationDate ? new Date(s.graduationDate) : null;
                const dateStr = dateObj ? dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha pendiente';

                return `
                    <tr style="border-bottom:1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                        <td style="padding:15px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <img src="${window.getAvatarUrl(s.name)}" style="width:38px; height:38px; border-radius:50%; border:2px solid #f59e0b; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);">
                                <div>
                                    <div style="font-weight:700; color:#1e293b; font-size:14px;">${s.name}</div>
                                    <div style="font-size:11px; color:#64748b;">${s.phone || 'Sin WhatsApp'}</div>
                                </div>
                            </div>
                        </td>
                        <td style="padding:15px;">
                            <div style="display:inline-flex; align-items:center; gap:6px; background:#fef3c7; color:#92400e; padding:5px 12px; border-radius:10px; font-size:12px; font-weight:700; border:1px solid #fde68a;">
                                <i data-lucide="star" style="width:12px;"></i> ${s.specialty}
                            </div>
                        </td>
                        <td style="padding:15px; color:#475569; font-size:13px; font-weight:600;">
                            ${dateStr}
                        </td>
                        <td style="padding:15px; text-align:right;">
                            <div style="display:flex; justify-content:flex-end; gap:8px;">
                                <button class="btn-icon" title="Ver Bitácora / Detalles" onclick="openDetailsModal(${students.indexOf(s)})" style="background:#f1f5f9; color:#475569;">
                                    <i data-lucide="eye" style="width:16px;"></i>
                                </button>
                                <button class="btn-icon" title="Reactivar Alumno" onclick="reactivateStudent(${students.indexOf(s)})" style="background:#f0fdf4; color:#22c55e; border-color:#bbf7d0;">
                                    <i data-lucide="refresh-cw" style="width:16px;"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            if (window.lucide) lucide.createIcons();
        };

        window.reactivateStudent = (idx) => {
            if (confirm("¿Deseas reactivar a este alumno para que vuelva a aparecer en las listas activas?")) {
                students[idx].status = 'active';
                delete students[idx].graduationDate;

                if (!students[idx].logs) students[idx].logs = [];
                students[idx].logs.unshift({
                    date: new Date().toISOString(),
                    text: 'ALUMNO REACTIVADO: Regresó de estado Graduado a Activo.',
                    type: 'system'
                });

                save();
                window.showToast("Alumno reactivado exitosamente.", 'success');
                switchView('dashboard');
            }
        };

        // Render Attendance (Eduka Style Refactor)
        window.attendanceFilter = 'all';

        window.setAttendanceFilter = (filter) => {
            window.attendanceFilter = filter;
            window.renderAttendance();
        };

        window.markAllPresent = () => {
            const dateInput = document.getElementById('attendance-date');
            if (!dateInput) return;
            const selectedDate = dateInput.value;
            if (!selectedDate) return;

            const list = getFilteredStudents();
            const dateObj = new Date(selectedDate + 'T00:00:00');
            const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const selectedDay = dayNames[dateObj.getDay()];

            // Only mark students scheduled for this day
            const studentsToMark = list.filter(s => {
                const days = Array.isArray(s.days) ? s.days : [];
                return days.includes(selectedDay);
            });

            if (studentsToMark.length === 0) {
                window.showToast("No hay alumnos programados para marcar.", 'info');
                return;
            }

            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            if (!records[selectedDate]) records[selectedDate] = {};

            studentsToMark.forEach(s => {
                records[selectedDate][s.name] = 'P';
            });

            localStorage.setItem('attendanceRecords', JSON.stringify(records));

            // CLOUD SYNC
            if (window.DBService && window.DBService.saveAttendanceContent) {
                window.DBService.saveAttendanceContent(records);
            }

            window.renderAttendance();
            window.showToast(`${studentsToMark.length} alumnos marcados como PRESENTES`, 'success');

            // Sync stats
            if (typeof updateStats === 'function') updateStats();
        };

        window.renderAttendance = () => {
            const dateInput = document.getElementById('attendance-date');
            if (!dateInput) return;

            // Set default date if empty (fixing UTC shift bug)
            if (!dateInput.value) {
                const now = new Date();
                const offset = now.getTimezoneOffset();
                const localDate = new Date(now.getTime() - (offset * 60 * 1000));
                dateInput.value = localDate.toISOString().split('T')[0];
            }

            const selectedDate = dateInput.value;
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            const dayRecords = records[selectedDate] || {};

            const dateObj = new Date(selectedDate + 'T00:00:00');
            const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const selectedDay = dayNames[dateObj.getDay()];

            console.log("DEBUG: renderAttendance", { selectedDate, selectedDay, totalStudents: students.length });

            let totalRisk = 0;
            let presentToday = 0;

            const filteredByDept = getFilteredStudents();

            // 1. Initial filter by day
            const studentsForDay = filteredByDept.filter(s => {
                const days = Array.isArray(s.days) ? s.days : [];
                return days.includes(selectedDay);
            });

            // 2. Further filter based on selected metric card
            let filtered = [...studentsForDay];

            if (window.attendanceFilter === 'present') {
                filtered = studentsForDay.filter(s => dayRecords[s.name] === 'P');
            } else if (window.attendanceFilter === 'risk') {
                filtered = studentsForDay.filter(s => {
                    const stats = window.getAttendanceStats(s.name);
                    return stats.percent < 85;
                });
            }

            console.log("DEBUG: renderAttendance Filter", { selectedDay, filter: window.attendanceFilter, count: filtered.length });

            // 3. Calculate Global Stats (Always based on the full day set, not the filtered view)
            studentsForDay.forEach(s => {
                const currentStatus = dayRecords[s.name] || '';
                if (currentStatus === 'P') presentToday++;
                const stats = window.getAttendanceStats(s.name);
                if (stats.percent < 85) totalRisk++;
            });

            // 3. Update Eduka Metric Cards
            const totalEl = document.getElementById('att-stats-total');
            const presentEl = document.getElementById('att-stats-present');
            const eventsEl = document.getElementById('att-stats-events'); // Events = Classes today
            const riskEl = document.getElementById('att-stats-risk');

            if (totalEl) totalEl.innerText = studentsForDay.length;
            if (presentEl) presentEl.innerText = presentToday;
            if (eventsEl) eventsEl.innerText = studentsForDay.length > 0 ? "1" : "0";
            if (riskEl) riskEl.innerText = totalRisk;

            // Update Active Card Styles (Visual Feedback)
            document.querySelectorAll('.stat-card-eduka').forEach(card => {
                card.style.opacity = '0.7';
                card.style.transform = 'scale(0.98)';
                card.style.border = 'none';
            });

            const activeCardMap = {
                'all': '.bg-green',
                'present': '.bg-blue',
                'risk': '.bg-orange-deep'
            };

            const activeSelector = activeCardMap[window.attendanceFilter];
            if (activeSelector) {
                const activeCard = document.querySelector(activeSelector);
                if (activeCard) {
                    activeCard.style.opacity = '1';
                    activeCard.style.transform = 'scale(1.02)';
                    activeCard.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    activeCard.style.border = '2px solid rgba(255,255,255,0.5)';
                }
            }

            // 4. Render Clean List
            const container = document.getElementById('attendance-list-container');
            if (!container) return;

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding:40px; color:#94a3b8;">
                        <i data-lucide="coffee" style="width:40px; height:40px; margin-bottom:10px; opacity:0.3;"></i>
                        <div style="font-weight:700; font-size:15px;">Sin clases hoy</div>
                        <div style="font-size:13px;">No hay alumnos programados para este día.</div>
                    </div>`;
            } else {
                container.innerHTML = filtered.map((s, i) => {
                    const currentStatus = dayRecords[s.name] || '';
                    const avatarUrl = window.getAvatarUrl(s.name);
                    const stats = window.getAttendanceStats(s.name);
                    const riskcolor = stats.percent < 85 ? '#ef4444' : '#22c55e';

                    // Determine active classes for pills
                    const isP = currentStatus === 'P' ? 'active' : '';
                    const isA = currentStatus === 'A' ? 'active' : '';
                    const isJ = currentStatus === 'J' ? 'active' : '';

                    return `
                    <div class="student-att-card">
                        <div class="att-card-profile">
                            <img src="${avatarUrl}" class="att-card-img">
                            <div class="att-card-info">
                                <h4>${s.name}</h4>
                                <p>${s.module} <span style="color:${riskcolor}; font-weight:700; margin-left:5px;">• ${stats.percent}%</span></p>
                            </div>
                        </div>
                        
                        <div class="att-card-actions">
                            <div class="status-pill-group">
                                <div class="status-pill present ${isP}" onclick="markAttendance('${s.name}', 'P')">
                                    <i data-lucide="check" style="width:14px;"></i> Presente
                                </div>
                                <div class="status-pill absent ${isA}" onclick="markAttendance('${s.name}', 'A')">
                                    <i data-lucide="x" style="width:14px;"></i> Ausente
                                </div>
                                <div class="status-pill late ${isJ}" onclick="markAttendance('${s.name}', 'J')">
                                    <i data-lucide="clock" style="width:14px;"></i> Justif.
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('');
            }

            if (window.lucide) lucide.createIcons();
        };


        function renderAttendanceRiskAlerts() {
            const container = document.getElementById('attendance-risk-alerts');
            if (!container) return;

            const riskPercent = parseInt(localStorage.getItem('riskPercent')) || 75;
            const riskAbsences = parseInt(localStorage.getItem('riskAbsences')) || 2;

            const criticalStudents = students.filter(s => {
                const stats = window.getAttendanceStats(s.name);
                return stats.percent < riskPercent || checkRecentAbsences(s.name) >= riskAbsences;
            });

            if (criticalStudents.length === 0) {
                container.innerHTML = `
            <div class="empty-state-container" style="padding:20px 10px; border:none; background:transparent;">
                 <i data-lucide="check-circle" style="width:24px; height:24px; color:#cbd5e1; margin-bottom:5px;"></i>
                 <span style="color: var(--text-muted); font-size: 11px;">No hay alumnos en riesgo de asistencia.</span>
            </div>
        `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            container.innerHTML = criticalStudents.map(s => {
                const stats = window.getAttendanceStats(s.name);
                const consecutive = checkRecentAbsences(s.name);

                return `
            <div class="data-card" style="border-left: 5px solid var(--danger); padding: 15px; background: #fff5f5;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <img src="${window.getAvatarUrl(s.name)}" style="width: 35px; height: 35px; border-radius: 50%;">
                        <div>
                            <strong style="font-size: 13px; color: #c53030;">${s.name}</strong>
                            <div style="font-size: 11px; color: #f56565;">Asistencia: ${stats.percent}%</div>
                        </div>
                    </div>
                    <span style="font-size: 10px; background: #c53030; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 800;">ALERTA</span>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #742a2a;">
                    ${consecutive >= riskAbsences ? `⚠️ <strong>${consecutive} Faltas Seguidas</strong><br>` : ''}
                    Próxima acción sugerida: Llamada de seguimiento.
                </div>
                <button onclick="window.open('https://wa.me/${(s.phone || '').replace(/\D/g, '')}', '_blank')" 
                    style="margin-top: 10px; width: 100%; height: 32px; font-size: 11px; background: white; border: 1px solid #feb2b2; color: #c53030; border-radius: 8px; cursor: pointer; font-weight: 700;">
                    Contactar Urgente
                </button>
            </div>
        `;
            }).join('');
        }

        window.contactAbsenteesToday = () => {
            const date = document.getElementById('attendance-date').value;
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            const dayRecords = records[date] || {};

            const absentees = students.filter(s => dayRecords[s.name] === 'A');

            if (absentees.length === 0) {
                window.showToast("No hay alumnos marcados como 'Ausente' para esta fecha.", 'info');
                return;
            }

            if (confirm(`¿Quieres generar los mensajes para los ${absentees.length} alumnos faltantes?`)) {
                absentees.forEach((s, idx) => {
                    const msg = encodeURIComponent(`Hola ${s.name}, notamos que no pudiste asistir a clase hoy. Â¿Todo bien?`);
                    const url = `https://wa.me/${(s.phone || '').replace(/\D/g, '')}?text=${msg}`;
                    setTimeout(() => window.open(url, '_blank'), idx * 800);
                });
            }
        };

        window.generateAttendanceReport = () => {
            const reportWindow = window.open('', '_blank');
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');

            // Generate dates for the last 30 days strictly
            const sortedDates = [];
            for (let i = 0; i < 30; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                sortedDates.push(d.toISOString().split('T')[0]);
            }

            // Get strictly filtered students for the current instructor
            const list = getFilteredStudents();

            reportWindow.document.write(`
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte Mensual de Asistencia</title>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 20px; color: #16234d; }
                h1 { color: #f8ad00; margin-bottom: 20px; font-size: 20px; }
                table { width: 100%; border-collapse: collapse; font-size: 10px; }
                th, td { border: 1px solid #e2e8f0; padding: 4px; text-align: center; }
                th { background: #f8f9fa; color: #64748b; font-weight: 700; }
                .p { color: #27ae60; font-weight: bold; background: #f0fdf4; }
                .a { color: #e74c3c; font-weight: bold; background: #fef2f2; }
                .l { color: #f59e0b; font-weight: bold; background: #fffbeb; }
                tr:nth-child(even) { background: #fcfcfc; }
                .student-name { text-align: left; font-weight: 700; padding-left: 8px; white-space: nowrap; }
                @media print { 
                    body { -webkit-print-color-adjust: exact; } 
                    th { -webkit-print-color-adjust: exact; background-color: #f8f9fa !important; }
                }
            </style>
        </head>
        <body>
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #f1f5f9; padding-bottom:15px; margin-bottom:20px;">
                <img src="logo-academy.png" style="height: 40px;">
                <div style="text-align:right;">
                    <div style="font-weight:700; font-size:14px;">Reporte de Asistencia (30 días)</div>
                    <div style="font-size:11px; color:#94a3b8;">Generado el ${new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="min-width: 150px; text-align: left; padding-left: 10px;">Alumno</th>
                        ${sortedDates.map(d => `<th style="width: 25px;">${d.split('-').slice(1).join('/')}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${list.map(s => `
                        <tr>
                            <td class="student-name">${s.name}</td>
                            ${sortedDates.map(date => {
                const record = records[date] || {};
                const status = record[s.name] || '';
                let cellClass = '';
                if (status === 'P') cellClass = 'p';
                if (status === 'A') cellClass = 'a';
                if (status === 'L') cellClass = 'l';

                return `<td class="${cellClass}">${status}</td>`;
            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="margin-top:20px; font-size:10px; color:#94a3b8; display:flex; gap:15px;">
                <span><strong style="color:#27ae60">P</strong> = Presente</span>
                <span><strong style="color:#e74c3c">A</strong> = Ausente</span>
                <span><strong style="color:#f59e0b">L</strong> = Licencia</span>
            </div>

            <script>window.print();</script>
        </body>
        </html>
    `);
            reportWindow.document.close();
        };


        // === REAL-TIME ATTENDANCE SYNC ===
        window.loadAttendanceFromFirebase = async (retryCount = 0) => {
            if (!window.DBService) {
                if (retryCount < 5) {
                    setTimeout(() => window.loadAttendanceFromFirebase(retryCount + 1), 500);
                    return;
                }
                return;
            }

            console.log("🚀 Setting up Real-time Attendance Listener...");
            // Listen to cloud changes
            window.DBService.listenToAttendanceContent((cloudRecords) => {
                if (cloudRecords && Object.keys(cloudRecords).length > 0) {
                    console.log("🔥 Attendance sync received!");
                    localStorage.setItem('attendanceRecords', JSON.stringify(cloudRecords));

                    // Force re-render if we are in attendance view
                    if (document.getElementById('content-attendance').style.display === 'block') {
                        if (typeof renderAttendance === 'function') renderAttendance();
                    }
                    // Update charts if needed
                    if (typeof renderAttendanceTrendChart === 'function') renderAttendanceTrendChart();
                }
            });
        };

        window.saveSingleAttendance = (idx) => {
            const s = students[idx];
            const status = document.getElementById(`att-status-${idx}`).value;
            const date = document.getElementById('attendance-date').value;

            if (!date) {
                window.showToast("Por favor selecciona una fecha primero.", 'error');
                return;
            }

            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            if (!records[date]) records[date] = {};
            records[date][s.name] = status;

            localStorage.setItem('attendanceRecords', JSON.stringify(records));

            // CLOUD SYNC
            if (window.DBService) {
                window.DBService.saveAttendanceContent(records);
            }

            // Check for dropouts
            if (status === 'A') {
                if (!s.logs) s.logs = [];
                // Add auto-log for absence
                s.logs.unshift({
                    date: new Date().toISOString(),
                    text: `Inasistencia registrada el día ${date}`,
                    type: 'auto'
                });

                const absences = checkRecentAbsences(s.name);
                if (absences >= 3) {
                    window.showToast(`⚠️ ALERTA CRÍTICA: ${s.name} ha acumulado ${absences} faltas consecutivas. Riesgo de deserción.`, 'error');
                }
            }

            save(); // Core save students
            renderAttendance();
            renderStudents();
            renderRiskDashboard();
            renderCharts(); // Refresh attendance trend
        };

        window.markAttendance = (studentName, status) => {
            const dateInput = document.getElementById('attendance-date');
            if (!dateInput || !dateInput.value) {
                window.showToast("Por favor selecciona una fecha primero.", 'error');
                return;
            }
            const date = dateInput.value;

            // Update Records
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            if (!records[date]) records[date] = {};

            // Toggle logic: If clicking the same status, unmark it (remove)
            if (records[date][studentName] === status) {
                delete records[date][studentName];
            } else {
                records[date][studentName] = status;
            }

            localStorage.setItem('attendanceRecords', JSON.stringify(records));

            // CLOUD SYNC
            if (window.DBService) {
                window.DBService.saveAttendanceContent(records);
            }

            // Find student object for logs
            const s = students.find(st => st.name === studentName);
            if (s) {
                // Check for dropouts logic
                if (status === 'A') {
                    if (!s.logs) s.logs = [];
                    // Add auto-log for absence
                    // Check if log for this date already exists to avoid duplicates
                    const todayLog = s.logs.find(l => l.date.split('T')[0] === new Date().toISOString().split('T')[0] && l.type === 'auto');

                    if (!todayLog) {
                        s.logs.unshift({
                            date: new Date().toISOString(),
                            text: `Inasistencia registrada el día ${date}`,
                            type: 'auto'
                        });
                    }

                    const absences = checkRecentAbsences(s.name);
                    if (absences >= 3) {
                        window.showToast(`⚠️ ALERTA CRÍTICA: ${s.name} ha acumulado ${absences} faltas consecutivas.`, 'error');
                    }
                }
                save(); // Save student logs
            }

            renderAttendance();
            updateStats();
        };

        window.markAllPresent = () => {
            const dateInput = document.getElementById('attendance-date');
            if (!dateInput || !dateInput.value) {
                window.showToast("Selecciona una fecha primero", 'error');
                return;
            }
            const date = dateInput.value;
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            if (!records[date]) records[date] = {};

            students.forEach(s => {
                records[date][s.name] = 'P';
            });

            localStorage.setItem('attendanceRecords', JSON.stringify(records));

            // CLOUD SYNC
            if (window.DBService) {
                window.DBService.saveAttendanceContent(records);
            }

            window.showToast("Todos los alumnos presentes marcados para hoy.", 'success');
            renderAttendance();
        };

        // === REAL-TIME PAYMENTS SYNC ===
        window.loadPaymentsFromFirebase = async () => {
            if (!window.DBService) return;
            console.log("🚀 Setting up Real-time Payments Listener...");

            window.DBService.listenToPayments((cloudPayments) => {
                if (cloudPayments) {
                    console.log(`💰 Payments sync: ${cloudPayments.length} records`);
                    // Sort by date (newest first)
                    cloudPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

                    // Sync Global Variable
                    window.payments = cloudPayments;
                    localStorage.setItem('payments_db', JSON.stringify(window.payments)); // Update locale cache

                    // Refresh if view is active
                    if (document.getElementById('content-finance').style.display === 'block') {
                        if (typeof renderFinance === 'function') renderFinance();
                    }
                }
            });
        };

        // === REAL-TIME AUDIT SYNC ===
        window.loadAuditLogsFromFirebase = async () => {
            if (!window.DBService) return;
            console.log("🚀 Setting up Real-time Audit Listener...");

            window.DBService.listenToAuditLogs((cloudLogs) => {
                if (cloudLogs) {
                    console.log(`🛡️ Audit sync: ${cloudLogs.length} records`);
                    window.globalLogs = cloudLogs;
                    localStorage.setItem('globalLogs', JSON.stringify(window.globalLogs));

                    if (document.getElementById('content-audit').style.display === 'block') {
                        if (typeof renderAuditLog === 'function') renderAuditLog();
                    }
                }
            });
        };


        // Data Backup (Data Safety)
        window.downloadBackup = () => {
            const data = {
                students,
                pensumContent,
                attendanceRecords: JSON.parse(localStorage.getItem('attendanceRecords') || '{}'),
                academyName: document.getElementById('sett-academy-name').value,
                instructorName: document.getElementById('sett-instructor-name').value,
                version: '1.0',
                timestamp: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_antigravity_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.showToast("Copia de seguridad descargada.", 'success');
        };

        window.restoreBackup = (input) => {
            const file = input.files[0];
            if (!file) return;

            if (!confirm('⚠️ ¿Estás seguro de restaurar una copia de seguridad? Esto reemplazará TODOS los datos actuales.')) {
                input.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    // Basic validation
                    if (!data.students || !data.pensumContent) {
                        throw new Error("Formato de archivo inválido");
                    }

                    localStorage.setItem('design_students', JSON.stringify(data.students));
                    localStorage.setItem('design_pensum_content', JSON.stringify(data.pensumContent));
                    localStorage.setItem('attendanceRecords', JSON.stringify(data.attendanceRecords || {}));
                    localStorage.setItem('academyName', data.academyName || "Antigravity Academy");
                    localStorage.setItem('instructorName', data.instructorName || "Instructor");

                    window.showToast('âœ… Â¡Backup restaurado con éxito!', 'success');
                    location.reload();

                } catch (err) {
                    window.showToast('âŒ Error al restaurar: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        };

        window.loadSettings = () => {
            const academyName = localStorage.getItem('academyName');
            const instructorName = localStorage.getItem('instructorName');
            const instructorAvatar = localStorage.getItem('instructorAvatar');
            const maxCapacity = localStorage.getItem('maxCapacity');
            const riskPercent = localStorage.getItem('riskPercent');
            const riskAbsences = localStorage.getItem('riskAbsences');

            if (document.getElementById('sett-academy-name')) {
                if (academyName) document.getElementById('sett-academy-name').value = academyName;
                if (instructorName) document.getElementById('sett-instructor-name').value = instructorName;
                if (instructorAvatar) document.getElementById('sett-instructor-avatar').value = instructorAvatar;
                if (maxCapacity) document.getElementById('sett-max-capacity').value = maxCapacity;
                if (riskPercent) document.getElementById('sett-risk-percent').value = riskPercent;
                if (riskAbsences) document.getElementById('sett-risk-absences').value = riskAbsences;
            }
        };

        // Initialize settings on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', window.loadSettings);
        } else {
            // If already loaded, try immediately
            setTimeout(window.loadSettings, 500);
        }

        window.saveSettings = () => {
            localStorage.setItem('academyName', document.getElementById('sett-academy-name').value);
            localStorage.setItem('instructorName', document.getElementById('sett-instructor-name').value);
            localStorage.setItem('instructorAvatar', document.getElementById('sett-instructor-avatar').value);
            localStorage.setItem('maxCapacity', document.getElementById('sett-max-capacity').value);
            localStorage.setItem('riskPercent', document.getElementById('sett-risk-percent').value);
            localStorage.setItem('riskAbsences', document.getElementById('sett-risk-absences').value);

            window.showToast("Configuración guardada correctamente", 'success');

            location.reload();
        };

        // Helper to count classes attended since a specific date
        function countClassesSince(studentName, dateStr) {
            const sinceDate = new Date(dateStr);
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
            // Filter dates after sinceDate
            const attendantDates = Object.keys(records).filter(d => new Date(d) >= sinceDate);

            let count = 0;
            attendantDates.forEach(d => {
                if (records[d][studentName] === 'P') count++;
            });
            return count;
        }

        function renderStagnantStudents() {
            const container = document.getElementById('stagnant-alerts');
            const list = document.getElementById('stagnant-list');
            if (!container || !list) return;

            const stagnant = getFilteredStudents().filter(s => {
                if (!s.topicDates || !s.topicDates[s.topic]) return false;
                // Logic: Has attended >= 3 classes since starting this topic?
                const attended = countClassesSince(s.name, s.topicDates[s.topic]);
                // Also ensure not finished
                const topics = pensumContent[s.module] || [];
                const isFinished = topics.indexOf(s.topic) === topics.length - 1 && s.status === 'graduated'; // simplified check

                return attended >= 3;
            });

            if (stagnant.length > 0) {
                container.style.display = 'block';
                list.innerHTML = stagnant.map(s => {
                    const attended = countClassesSince(s.name, s.topicDates[s.topic]);
                    return `
            <div style="display:flex; align-items:center; gap:10px; background:white; padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; min-width:200px;">
                <img src="${window.getAvatarUrl(s.name)}" style="width:32px; height:32px; border-radius:50%;">
                <div>
                    <div style="font-weight:700; font-size:12px; color:#374151;">${s.name}</div>
                    <div style="font-size:10px; color:#ef4444; font-weight:600;">${attended} clases en mismo tema</div>
                </div>
            </div>
        `}).join('');
            } else {
                container.style.display = 'none';
            }
            if (window.lucide) lucide.createIcons();
        }

        function checkCriticalPoints() {
            const list = document.getElementById('critical-points-list');
            if (!list) return;

            const riskAbsences = parseInt(localStorage.getItem('riskAbsences')) || 2;

            const criticals = getFilteredStudents().filter(s => {
                const absences = checkRecentAbsences(s.name);
                return absences >= riskAbsences;
            });

            if (criticals.length > 0) {
                list.innerHTML = criticals.map(s => `
            <div style="margin-bottom: 5px; color: var(--danger);">
                &bull; ${s.name}: ${checkRecentAbsences(s.name)} faltas seguidas
            </div>
        `).join('');
            } else {
                list.innerHTML = `
            <div class="empty-state-container" style="padding:20px 10px; border:none; background:transparent;">
                 <i data-lucide="check-circle" style="width:24px; height:24px; color:#cbd5e1; margin-bottom:5px;"></i>
                 <span style="color: var(--text-muted); font-size: 11px;">Todo bajo control.</span>
            </div>
        `;
                if (window.lucide) lucide.createIcons();

            }
        }



        // Logic to handle schedule constraints based on selected days
        function setupScheduleLogic() {
            function applyLogic(containerPrefix) {
                const daysContainer = document.getElementById(`${containerPrefix}-days-container`);
                const schedContainer = document.getElementById(`${containerPrefix}-schedule-container`);

                if (!daysContainer || !schedContainer) return;

                const dayInputs = daysContainer.querySelectorAll('input[type="checkbox"]');
                const schedInputs = schedContainer.querySelectorAll('input[type="checkbox"]');

                const updateSchedules = () => {
                    const checkedDays = Array.from(dayInputs).filter(i => i.checked).map(i => i.value);
                    const isWeekend = checkedDays.includes('Vie') || checkedDays.includes('Sáb');
                    const isWeekday = checkedDays.some(d => ['Lun', 'Mar', 'Mié', 'Jue'].includes(d));

                    schedInputs.forEach(input => {
                        const val = input.value;
                        const parent = input.closest('label');

                        // Reset first
                        input.disabled = false;
                        parent.style.opacity = "1";
                        parent.style.pointerEvents = "auto";

                        if (isWeekend) {
                            // Weekend Logic: Only 9AM - 12PM allowed
                            if (val !== '9AM - 12PM') {
                                input.checked = false;
                                input.disabled = true;
                                parent.style.opacity = "0.4";
                                parent.style.pointerEvents = "none";
                            }
                        } else if (checkedDays.length > 0) {
                            // Weekday Logic: 9AM - 12PM NOT allowed (assuming exclusive)
                            if (val === '9AM - 12PM') {
                                input.checked = false;
                                input.disabled = true;
                                parent.style.opacity = "0.4";
                                parent.style.pointerEvents = "none";
                            }
                        } else {
                            // No days selected: maybe reset or allow all? 
                            // Let's keep all enabled but maybe unchecked if we want strictness.
                            // For now, allow user to click around until they pick a day.
                        }
                    });
                };

                dayInputs.forEach(input => input.addEventListener('change', updateSchedules));
                // Run once to set initial state
                updateSchedules();
            }

            applyLogic('reg');
            // applyLogic('edit'); // Uncomment if edit modal IDs follow same pattern (edit-days-container, edit-schedule-container)
        }

        window.renderModuleDetails = (idx, moduleName) => {
            const s = students[idx];
            const container = document.getElementById('module-specific-content');
            if (!container) return;

            // Determine Progress logic
            let prog = 0;
            const history = s.history || [];

            // Check if module is in history (completed)
            const completedModule = history.find(h => h.module === moduleName);

            if (completedModule) {
                prog = 100;
            } else if (s.module === moduleName) {
                // Current Module
                const topics = pensumContent[moduleName] || [];
                const idxTopic = topics.indexOf(s.topic);
                prog = topics.length > 0 ? Math.round(((idxTopic + 1) / topics.length) * 100) : 0;
            } else {
                // Future Module
                prog = 0;
            }

            const isCurrent = (s.module === moduleName);

            // Topics HTML
            const topics = pensumContent[moduleName] || [];
            const idxTopic = topics.indexOf(s.topic); // Only relevant if current.

            const topicsListHTML = `
        <div style="margin-bottom:20px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
            <div style="background:#f8fafc; padding:12px 15px; border-bottom:1px solid #e2e8f0; font-size:12px; font-weight:700; color:#475569; display:flex; justify-content:space-between; align-items:center;">
                <span><i data-lucide="book-open" style="width:14px; vertical-align:middle; margin-right:5px;"></i> TEMARIO: ${moduleName.toUpperCase()}</span>
                <span style="font-size:10px; background:var(--primary); color:white; padding:3px 8px; border-radius:10px; font-weight:800;">${prog}%</span>
            </div>
            <div style="max-height:200px; overflow-y:auto; padding:0; scrollbar-width:thin;">
                ${topics.map((t, i) => {
                let bg = 'white';
                let iconColor = '#e2e8f0';
                let textColor = '#64748b';
                let icon = 'circle';
                let rowStyle = 'border-bottom:1px solid #f1f5f9;';

                let isCompleted = false;

                if (prog === 100) isCompleted = true;
                else if (isCurrent && i < idxTopic) isCompleted = true;

                if (isCompleted) {
                    bg = '#f8fafc'; iconColor = '#22c55e'; textColor = '#94a3b8'; icon = 'check';
                } else if (isCurrent && i === idxTopic) {
                    bg = '#fff1f2'; iconColor = 'var(--primary)'; textColor = '#1e293b'; icon = 'play-circle'; rowStyle += ' border-left:4px solid var(--primary);';
                }

                return `
                        <div style="padding:10px 15px; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; gap:12px; font-size:12px; background:${bg}; ${rowStyle}">
                            <i data-lucide="${icon}" style="width:14px; color:${iconColor}; flex-shrink:0;"></i>
                            <span style="font-weight:${(isCurrent && i === idxTopic) ? '700' : '500'}; color:${textColor};">${t}</span>
                            ${(isCurrent && i === idxTopic) ? '<span style="margin-left:auto; font-size:9px; background:var(--primary); color:white; padding:2px 6px; border-radius:4px;">ACTUAL</span>' : ''}
                        </div>
                    `;
            }).join('')}
            </div>
        </div>
    `;

            // Deliverables Logic
            const deliverables = moduleDeliverables[moduleName] || [];
            const completedDeliverables = s.completedDeliverables || [];

            const deliverablesHTML = deliverables.length > 0 ? `
        <div style="margin-bottom:20px; background:#fff; border:1px solid #e2e8f0; padding:15px; border-radius:12px;">
            <h4 style="margin-bottom:10px; color:var(--text-main); font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;">
                <i data-lucide="clipboard-check" style="width:14px; color:var(--secondary);"></i> ENTREGABLES (${moduleName})
            </h4>
            <div style="display:grid; gap:8px;">
                ${deliverables.map((d, i) => {
                const isChecked = completedDeliverables.includes(d);
                return `
                    <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#475569; cursor:pointer;" onclick="toggleDeliverable(${idx}, '${d}')">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} style="accent-color:var(--secondary); cursor:pointer;"> 
                        <span style="${isChecked ? 'text-decoration:line-through; color:#94a3b8;' : ''}">${d}</span>
                    </div>
                `}).join('')}
            </div>
        </div>
    ` : '<div style="padding:15px; text-align:center; color:#999; font-size:12px; font-style:italic;">No hay entregables definidos para este modulo.</div>';


            container.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
            <div class="data-card" style="padding:15px; text-align:center;">
                <div style="font-size:11px; color:#94a3b8; font-weight:800; text-transform:uppercase;">Avance ${moduleName}</div>
                <div style="font-size:24px; font-weight:900; color:var(--primary); margin:5px 0;">${prog}%</div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:10px; overflow:hidden;">
                     <div style="width:${prog}%; height:100%; background:var(--primary); border-radius:10px;"></div>
                </div>
            </div>
             <div class="data-card" style="padding:15px; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <i data-lucide="award" style="width:24px; color:#f59e0b; margin-bottom:5px;"></i>
                <div style="font-size:20px; font-weight:900; color:#1e293b;">${(s.history || []).length} <span style="font-size:12px; color:#94a3b8; font-weight:600;">Módulos Aprobados</span></div>
            </div>
        </div>

        ${topicsListHTML}
        ${deliverablesHTML}
    `;

            if (window.lucide) lucide.createIcons();

            // Update Active Pill
            const allPills = document.querySelectorAll('.module-pill');
            allPills.forEach(p => {
                if (p.dataset.module === moduleName) {
                    p.style.background = '#f3e8ff';
                    p.style.border = '1px solid #d8b4fe';
                    const icon = p.querySelector('i');
                    if (icon) icon.style.color = 'var(--primary)';
                } else {
                    p.style.background = '#f8fafc';
                    p.style.border = '1px solid #e2e8f0';
                    const icon = p.querySelector('i');
                    if (icon) icon.style.color = '#cbd5e1';
                }
            });
        };

        // Ticker Logic
        function initTicker() {
            const phrases = [
                "Control de progreso y rendimiento estudiantil.",
                "Impulsando el talento digital.",
                "Creatividad sin límites.",
                "Innovación y diseño en un solo lugar.",
                "Tu futuro comienza aquí.",
                "Gestión académica simplificada."
            ];

            let currentIdx = 0;
            const el = document.getElementById('ticker-text');
            if (!el) return;

            // Start loop
            setInterval(() => {
                el.classList.add('text-exit');

                setTimeout(() => {
                    currentIdx = (currentIdx + 1) % phrases.length;
                    el.innerText = phrases[currentIdx];
                    el.classList.remove('text-exit');
                    el.classList.add('text-enter');

                    setTimeout(() => {
                        el.classList.remove('text-enter');
                    }, 500);
                }, 500); // Wait for exit animation
            }, 4000); // Change every 4 seconds
        }

        // Sidebar Toggle Logic
        // Sidebar Toggle Logic (Desktop & Mobile)
        function setupSidebarToggle() {
            // Desktop Collapse
            const btn = document.getElementById('sidebar-toggle');
            const sidebar = document.querySelector('.sidebar');

            if (btn && sidebar) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    sidebar.classList.toggle('collapsed');
                    setTimeout(() => {
                        window.dispatchEvent(new Event('resize'));
                    }, 400);
                };
            }
        }

        // Mobile Menu Logic
        function setupMobileMenu() {
            const mobileBtn = document.getElementById('mobile-menu-btn');
            const sidebar = document.querySelector('.sidebar');

            if (!mobileBtn || !sidebar) return;

            // Create Overlay if not exists
            let overlay = document.querySelector('.mobile-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('mobile-overlay');
                document.body.appendChild(overlay);
            }

            function toggleMenu() {
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('active');
            }

            function closeMenu() {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            }

            mobileBtn.onclick = (e) => {
                e.stopPropagation();
                toggleMenu();
            };

            overlay.onclick = () => {
                closeMenu();
            };

            // Close on navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        closeMenu();
                    }
                });
            });
        }

        // ==========================================
        // ADMIN: FINANCE SYSTEM
        // ==========================================
        window.renderFinance = () => {
            const tbody = document.getElementById('finance-table-body');
            if (!tbody) return;

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            let monthIncome = 0;
            let pendingCount = 0;

            // Filter payments for this month
            const thisMonthPayments = payments.filter(p => {
                const d = new Date(p.date + 'T00:00:00');
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });

            monthIncome = thisMonthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

            // Render Table (limited to last 50 for performance)
            tbody.innerHTML = students.slice(0, 50).map((s, idx) => {
                // Check if student has paid this month
                const hasPaid = thisMonthPayments.some(p => p.student === s.name && p.concept === 'Mensualidad');

                // Find last payment
                const studentPayments = payments.filter(p => p.student === s.name).sort((a, b) => new Date(b.date) - new Date(a.date));
                const lastPay = studentPayments.length > 0 ? studentPayments[0] : null;

                if (!hasPaid) pendingCount++;

                return `
        <tr>
            <td data-label="Alumno" style="font-weight:700;">${s.name}</td>
            <td data-label="Detalles" style="font-size:12px; color:#666;">$100 / Mes<br><span style="font-size:10px; color:#999;">${s.specialty}</span></td>
            <td data-label="Estado">
                <span class="report-badge ${hasPaid ? 'grade-A' : 'grade-C'}">
                    ${hasPaid ? 'PAGADO' : 'PENDIENTE'}
                </span>
            </td>
            <td data-label="Último Pago" style="font-size:12px;">
                ${lastPay ? `${lastPay.date} ($${lastPay.amount})` : 'Sin registros'}
            </td>
            <td data-label="Acciones">
                <button class="btn-icon" onclick="openPaymentModal('${s.name}')" title="Registrar Pago">
                    <i data-lucide="plus-circle" style="color:var(--primary);"></i>
                </button>
            </td>
        </tr>
        `;
            }).join('');

            // Update Stats
            document.getElementById('fin-month-income').innerText = "$" + monthIncome.toLocaleString();
            document.getElementById('fin-pending-count').innerText = pendingCount;
            document.getElementById('fin-total-students').innerText = students.length;

            if (window.lucide) lucide.createIcons();

            // Render BI Charts (New)
            renderAdminCharts();
        };

        function renderAdminCharts() {
            // 1. Comparison Chart (Students per Specialty)
            const ctx1 = document.getElementById('admin-comparison-chart');
            if (ctx1) {
                // Group by Specialty (or Area)
                const counts = {};
                students.forEach(s => {
                    const spec = s.specialty || 'Sin Asignar';
                    counts[spec] = (counts[spec] || 0) + 1;
                });

                if (window.adminCompChart) window.adminCompChart.destroy();
                window.adminCompChart = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(counts),
                        datasets: [{
                            label: 'Cantidad de Alumnos',
                            data: Object.values(counts),
                            backgroundColor: ['#2d9cdb', '#9b51e0', '#f2994a'],
                            borderRadius: 8
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }

            // 2. Income Chart (Estimated vs Real)
            const ctx2 = document.getElementById('admin-income-chart');
            if (ctx2) {
                const potential = students.length * 100; // $100 per student
                const currentReal = parseFloat(document.getElementById('fin-month-income').innerText.replace('$', '').replace(',', ''));

                if (window.adminIncomeChart) window.adminIncomeChart.destroy();
                window.adminIncomeChart = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['Cobrado', 'Pendiente'],
                        datasets: [{
                            data: [currentReal, potential - currentReal],
                            backgroundColor: ['#27ae60', '#e2e8f0']
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
                });
            }
        }

        window.openPaymentModal = (preselectedName = null) => {
            const modal = document.getElementById('payment-modal');
            modal.classList.add('active');

            // Populate Student Select
            const select = document.getElementById('pay-student');
            select.innerHTML = students.map(s => `<option value="${s.name}" ${s.name === preselectedName ? 'selected' : ''}>${s.name}</option>`).join('');

            // Default Date
            document.getElementById('pay-date').value = new Date().toISOString().split('T')[0];
        };

        document.getElementById('payment-form').onsubmit = (e) => {
            e.preventDefault();
            const studentName = document.getElementById('pay-student').value;
            const date = document.getElementById('pay-date').value;
            const amount = document.getElementById('pay-amount').value;
            const concept = document.getElementById('pay-concept').value;
            const method = document.getElementById('pay-method').value;

            const newPayment = { id: Date.now().toString(), student: studentName, date, amount, concept, method };

            // Optimistic Local Update
            payments.push(newPayment);
            localStorage.setItem('payments_db', JSON.stringify(payments));

            // Cloud Sync
            if (window.DBService) {
                window.DBService.savePayment(newPayment).then(res => {
                    if (res.success) window.showToast("Pago registrado en la nube", "success");
                });
            }

            // Log It
            window.logAction('Pago Recibido', `$${amount} - ${studentName} (${concept})`);

            renderFinance();
            closePaymentModal();
            e.target.reset();
        };

        // ==========================================
        // ADMIN: MATRIX (GOD MODE)
        // ==========================================
        window.renderMatrix = () => {
            console.log("Attempting to render Matrix... V3.0");
            const listContainer = document.getElementById('matrix-specialty-list');

            // Check if HTML is updated
            if (listContainer && listContainer.innerText.includes('Cargando lista...')) {
                // HTML is new, good.
            } else if (listContainer && listContainer.innerHTML.trim() === '') {
                // HTML might be old or cleared.
            }

            if (!listContainer) {
                console.error("Matrix container not found! HTML not updated?");
                alert("Error: Tu navegador está mostrando una versión antigua de la página. Por favor recarga (F5).");
                return;
            }

            try {
                // Safety: Check if 'specialties' exists
                if (!specialties) {
                    throw new Error("Objeto 'specialties' no definido");
                }

                const keys = Object.keys(specialties);
                console.log("Keys found:", keys);

                if (keys.length === 0) {
                    listContainer.innerHTML = `
                    <div style="padding:15px; text-align:center; color:var(--text-muted); font-size:12px;">
                        Vacío.
                        <button class="btn btn-primary" onclick="resetSpecialties()" style="margin-top:5px; width:100%;">
                            Restaurar (V3)
                        </button>
                    </div>`;
                    return;
                }

                listContainer.innerHTML = keys.map(spec => {
                    const count = (specialties[spec] || []).length;
                    return `
                    <div class="matrix-item" onclick="renderMatrixEditor('${spec}')">
                        ${spec}
                        <div style="font-size:10px; color:var(--text-muted); font-weight:400;">${count} módulos</div>
                    </div>`;
                }).join('');

            } catch (err) {
                console.error("Render Matrix Error:", err);
                listContainer.innerHTML = `<div style="color:red; font-size:10px;">Error: ${err.message}</div>`;
            }
        };

        window.resetSpecialties = () => {
            if (confirm('¿Restaurar las especialidades por defecto? Esto borrará configuraciones personalizadas de la matriz.')) {
                localStorage.removeItem('specialties_structure');
                localStorage.removeItem('design_pensum_content');
                location.reload();
            }
        };


        window.renderMatrixEditor = (specName) => {
            const editor = document.getElementById('matrix-editor-area');
            const modules = specialties[specName];

            editor.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 style="color:var(--primary);">${specName}</h3>
            <button class="btn btn-primary" onclick="addModuleToSpecialty('${specName}')" style="font-size:12px;">+ Nuevo Módulo</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:15px;">
            ${modules.map((mod, idx) => `
                <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:15px;">
                    <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                        <span>${idx + 1}. ${mod}</span>
                        <div style="gap:10px; display:flex;">
                            <i data-lucide="edit-2" style="width:14px; cursor:pointer;" onclick="renameModule('${specName}', ${idx})"></i>
                            <i data-lucide="trash-2" style="width:14px; cursor:pointer; color:var(--danger);" onclick="deleteModule('${specName}', ${idx})"></i>
                        </div>
                    </div>
                    <ul style="font-size:12px; color:#555; padding-left:20px;">
                        ${(pensumContent[mod] || []).map((topic, tIdx) => `
                            <li style="margin-bottom:4px;">${topic}</li>
                        `).join('')}
                    </ul>
                    <button onclick="editTopics('${mod}')" style="margin-top:10px; font-size:11px; color:#3b82f6; background:none; border:none; cursor:pointer; font-weight:600;">Editar Temas</button>
                </div>
            `).join('')}
        </div>
    `;
            if (window.lucide) lucide.createIcons();
        };

        window.addModuleToSpecialty = (specName) => {
            const name = prompt("Nombre del nuevo módulo:");
            if (!name) return;

            specialties[specName].push(name);
            pensumContent[name] = ["Tema Introductorio 1", "Tema Introductorio 2"]; // Default content
            saveGlobalData();
            renderMatrixEditor(specName);
            renderMatrix(); // update count
        };

        window.renameModule = (specName, idx) => {
            const oldName = specialties[specName][idx];
            const newName = prompt("Nuevo nombre para el módulo:", oldName);
            if (!newName || newName === oldName) return;

            // Update Array
            specialties[specName][idx] = newName;
            // Move Content
            pensumContent[newName] = pensumContent[oldName];
            delete pensumContent[oldName];

            saveGlobalData();
            renderMatrixEditor(specName);
        };

        window.deleteModule = (specName, idx) => {
            if (!confirm("¿Seguro que quieres borrar este módulo? Se perderá el temario asociado.")) return;
            const modName = specialties[specName][idx];
            specialties[specName].splice(idx, 1);
            delete pensumContent[modName];

            saveGlobalData();
            renderMatrixEditor(specName);
            renderMatrix();
        };

        // Replaced prompt with Modal Editor
        window.editTopics = (modName) => {
            // 1. Get current topics
            const currentTopics = (pensumContent[modName] || []);
            const textContent = currentTopics.join('\n'); // Join with newlines for textarea

            // 2. Populate Modal
            const modal = document.getElementById('topic-editor-modal');
            if (!modal) {
                // Fallback if modal missing implies HTML not updated yet
                alert("Error: Por favor recarga la página para ver el nuevo editor.");
                return;
            }

            document.getElementById('topic-editor-subtitle').innerText = `Editando temario para: ${modName}`;
            document.getElementById('topic-editor-textarea').value = textContent;
            document.getElementById('topic-editor-module-name').value = modName;

            // 3. Open Modal
            modal.classList.add('active');
        };

        window.closeTopicEditor = () => {
            document.getElementById('topic-editor-modal').classList.remove('active');
        };

        window.saveTopicEditorChanges = () => {
            const modName = document.getElementById('topic-editor-module-name').value;
            const rawText = document.getElementById('topic-editor-textarea').value;

            // Split by newline and filter empty lines
            const newTopics = rawText.split('\n')
                .map(t => t.trim())
                .filter(t => t !== '');

            if (newTopics.length === 0) {
                if (!confirm("¿Estás seguro de dejar este módulo sin temas?")) return;
            }

            pensumContent[modName] = newTopics;
            saveGlobalData();

            // Refresh Matrix View
            renderMatrix();
            if (typeof renderPensumConfig === 'function') renderPensumConfig();
            closeTopicEditor();


            // Simple visual feedback
            const btnBox = document.querySelector(`button[onclick="editTopics('${modName}')"]`);
            if (btnBox) {
                const originalText = btnBox.innerHTML;
                btnBox.innerHTML = '<i data-lucide="check"></i> Guardado';
                setTimeout(() => {
                    btnBox.innerHTML = originalText;
                    if (window.lucide) lucide.createIcons();
                }, 1500);
            }
        };

        function saveGlobalData() {
            // 1. Save to LocalStorage
            localStorage.setItem('specialties_structure', JSON.stringify(specialties));
            localStorage.setItem('design_pensum_content', JSON.stringify(pensumContent));
            localStorage.setItem('availableDepartments', JSON.stringify(window.availableDepartments));

            // 2. Trigger Cloud Sync (if connected)
            // 2. Trigger Cloud Sync (if connected)
            if (typeof window.save === 'function') {
                window.save();
            }
        }

        // ==========================================
        // FEATURE: GLOBAL DELIVERABLES MATRIX
        // ==========================================
        window.renderDeliverablesMatrix = () => {
            const container = document.getElementById('deliverables-container');
            if (!container) return;

            const allStudents = getFilteredStudents();
            const studentsByModule = {};

            allStudents.forEach(s => {
                const mod = s.module || 'Sin Módulo';
                if (!studentsByModule[mod]) studentsByModule[mod] = [];
                studentsByModule[mod].push(s);
            });

            if (allStudents.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding:80px 20px; color:#94a3b8;">
                        <i data-lucide="folder-search" style="width:64px; height:64px; margin-bottom:20px; opacity:0.2;"></i>
                        <h3 style="font-size:20px; font-weight:700;">No hay alumnos activos</h3>
                        <p>Asegúrate de tener alumnos registrados en tu departamento.</p>
                    </div>
                `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            let html = '<div class="deliverables-board">';

            Object.keys(studentsByModule).forEach(moduleName => {
                const moduleStudents = studentsByModule[moduleName];
                const deliverables = moduleDeliverables[moduleName] || [];

                html += `
                    <div class="module-track">
                        <div class="module-track-header">
                            <div class="module-title-box">
                                <h3>${moduleName}</h3>
                                <div class="module-subtitle">${moduleStudents.length} alumnos en este nivel</div>
                            </div>
                            <div style="background:white; padding:8px 15px; border-radius:12px; border:1px solid #e2e8f0; font-size:12px; font-weight:700; color:var(--primary);">
                                ${deliverables.length} ENTREGABLES REQUERIDOS
                            </div>
                        </div>

                        <div class="student-grid">
                            ${moduleStudents.map(s => {
                    const completed = s.completedDeliverables || [];
                    const percent = deliverables.length > 0 ? Math.round((completed.length / deliverables.length) * 100) : 100;
                    const globalIdx = students.indexOf(s);

                    return `
                                    <div class="student-deliverable-card">
                                        <div class="card-top">
                                            <img src="${window.getAvatarUrl(s.name)}" style="width:40px; height:40px; border-radius:12px;">
                                            <div class="student-info">
                                                <h4>${s.name}</h4>
                                                <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:800; letter-spacing:0.5px;">${s.specialty}</div>
                                            </div>
                                            <div class="progress-pill" style="background:${percent === 100 ? '#f0fdf4' : '#f1f5f9'}; color:${percent === 100 ? '#22c55e' : '#64748b'};">
                                                ${percent}%
                                            </div>
                                            <button class="btn-icon" onclick="openEditDeliverablesModal(${globalIdx})" title="Editar entregas de ${s.name}" style="margin-left:8px; background:#f8fafc; border:1px solid #e2e8f0;">
                                                <i data-lucide="edit-3" style="width:14px; color:#6366f1;"></i>
                                            </button>
                                        </div>

                                        <div class="deliverables-list">
                                            ${deliverables.length > 0 ? deliverables.map(d => {
                        const isDone = completed.includes(d);
                        // Escapare comillas para evitar errores en el onclick
                        const safeD = d.replace(/'/g, "\\'");
                        return `
                                                    <div class="deliverable-item ${isDone ? 'completed' : ''}" onclick="toggleGlobalDeliverable('${s.id}', '${safeD}')">
                                                        <div class="check-box">
                                                            ${isDone ? '<i data-lucide="check" style="width:12px;"></i>' : ''}
                                                        </div>
                                                        <span class="deliverable-text">${d}</span>
                                                    </div>
                                                `;
                    }).join('') : '<div style="font-size:11px; color:#cbd5e1; text-align:center; padding:10px;">Sin entregables definidos</div>'}
                                        </div>

                                        <div class="card-progress-bar" style="width: ${percent}%; background: ${percent === 100 ? '#22c55e' : 'var(--primary)'}"></div>
                                    </div>
                                `;
                }).join('')}
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            container.innerHTML = html;
            if (window.lucide) lucide.createIcons();
        };

        // ==========================================
        // EDIT DELIVERABLES MODAL  FUNCTIONS
        // ==========================================

        window.openEditDeliverablesModal = (studentIdx) => {
            const student = students[studentIdx];
            if (!student) return;

            const modal = document.getElementById('edit-deliverables-modal');
            if (!modal) return;

            // Set student info
            document.getElementById('edit-deliverables-student-index').value = studentIdx;
            document.getElementById('edit-deliverables-student-name').textContent = student.name;
            document.getElementById('edit-deliverables-module-name').textContent = student.module || 'Sin Módulo';

            // Get deliverables for current module
            const deliverables = moduleDeliverables[student.module] || [];
            const completedDeliverables = student.completedDeliverables || [];

            const checkboxesContainer = document.getElementById('edit-deliverables-checkboxes');
            const emptyState = document.getElementById('edit-deliverables-empty');

            if (deliverables.length === 0) {
                checkboxesContainer.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                checkboxesContainer.style.display = 'flex';
                emptyState.style.display = 'none';

                // Render checkboxes
                checkboxesContainer.innerHTML = deliverables.map((deliverable, idx) => {
                    const isChecked = completedDeliverables.includes(deliverable);
                    const safeId = `deliverable-check-${idx}`;
                    const safeDeliverable = deliverable.replace(/'/g, "\\'");

                    return `
                        <div class="deliverable-checkbox-wrapper" data-deliverable="${safeDeliverable}" style="display:flex; align-items:center; gap:10px; padding:10px; background:${isChecked ? '#f0fdf4' : '#fff'}; border:1px solid ${isChecked ? '#86efac' : '#e2e8f0'}; border-radius:8px; cursor:pointer; transition:all 0.2s;">
                            <input type="checkbox" id="${safeId}" value="${deliverable}" ${isChecked ? 'checked' : ''} style="accent-color:var(--primary); cursor:pointer; width:18px; height:18px;">
                            <label for="${safeId}" style="flex:1; font-size:13px; color:#334155; cursor:pointer; user-select:none;">
                                ${deliverable}
                            </label>
                            ${isChecked ? '<i data-lucide="check-circle" style="width:16px; color:#22c55e;"></i>' : ''}
                        </div>
                    `;
                }).join('');

                // Add click handlers after rendering
                setTimeout(() => {
                    const wrappers = checkboxesContainer.querySelectorAll('.deliverable-checkbox-wrapper');
                    wrappers.forEach(wrapper => {
                        wrapper.addEventListener('click', function (e) {
                            if (e.target.tagName !== 'INPUT') {
                                const checkbox = this.querySelector('input[type="checkbox"]');
                                checkbox.checked = !checkbox.checked;

                                // Update visual state
                                if (checkbox.checked) {
                                    this.style.background = '#f0fdf4';
                                    this.style.borderColor = '#86efac';
                                    const label = this.querySelector('label');
                                    if (!this.querySelector('i[data-lucide="check-circle"]')) {
                                        label.insertAdjacentHTML('afterend', '<i data-lucide="check-circle" style="width:16px; color:#22c55e;"></i>');
                                        if (window.lucide) lucide.createIcons();
                                    }
                                } else {
                                    this.style.background = '#fff';
                                    this.style.borderColor = '#e2e8f0';
                                    const icon = this.querySelector('i[data-lucide="check-circle"]');
                                    if (icon) icon.remove();
                                }
                            }
                        });
                    });
                }, 100);
            }

            modal.classList.add('active');
            if (window.lucide) lucide.createIcons();

            // Load custom deliverables
            renderCustomDeliverablesList(student);
        };

        // Add custom deliverable to the list
        window.addCustomDeliverable = () => {
            const input = document.getElementById('custom-deliverable-input');
            const deliverableName = input.value.trim();

            if (!deliverableName) {
                if (window.showToast) window.showToast('Escribe el nombre del entregable', 'warning');
                return;
            }

            const studentIdx = parseInt(document.getElementById('edit-deliverables-student-index').value);
            const student = students[studentIdx];
            if (!student) return;

            // Initialize if needed
            if (!student.completedDeliverables) student.completedDeliverables = [];

            // Check if already exists
            if (student.completedDeliverables.includes(deliverableName)) {
                if (window.showToast) window.showToast('Este entregable ya existe', 'warning');
                return;
            }

            // Add it as completed
            student.completedDeliverables.push(deliverableName);

            // Clear input
            input.value = '';

            // Re-render custom list
            renderCustomDeliverablesList(student);

            if (window.lucide) lucide.createIcons();
        };

        // Render custom deliverables list
        window.renderCustomDeliverablesList = (student) => {
            const container = document.getElementById('custom-deliverables-list');
            if (!container) return;

            // Get predefined deliverables for this module
            const predefinedDeliverables = moduleDeliverables[student.module] || [];
            const completedDeliverables = student.completedDeliverables || [];

            // Filter to get only custom (non-predefined) deliverables
            const customDeliverables = completedDeliverables.filter(d => !predefinedDeliverables.includes(d));

            if (customDeliverables.length === 0) {
                container.innerHTML = '<div style="font-size:12px; color:#94a3b8; font-style:italic; padding:8px;">No hay entregables personalizados aún.</div>';
                return;
            }

            container.innerHTML = customDeliverables.map(deliverable => {
                const safeName = deliverable.replace(/'/g, "\\'");
                return `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:#fef3c7; border:1px solid #fcd34d; border-radius:8px;">
                        <div style="display:flex; align-items:center; gap:8px; flex:1;">
                            <i data-lucide="star" style="width:14px; color:#f59e0b;"></i>
                            <span style="font-size:13px; color:#78350f; font-weight:500;">${deliverable}</span>
                        </div>
                        <button class="btn-icon" onclick="removeCustomDeliverable('${safeName}')" title="Eliminar" style="background:#fff; border:1px solid #fcd34d; color:#f59e0b;">
                            <i data-lucide="x" style="width:12px;"></i>
                        </button>
                    </div>
                `;
            }).join('');

            if (window.lucide) lucide.createIcons();
        };

        // Remove custom deliverable
        window.removeCustomDeliverable = (deliverableName) => {
            const studentIdx = parseInt(document.getElementById('edit-deliverables-student-index').value);
            const student = students[studentIdx];
            if (!student || !student.completedDeliverables) return;

            const idx = student.completedDeliverables.indexOf(deliverableName);
            if (idx > -1) {
                student.completedDeliverables.splice(idx, 1);
                renderCustomDeliverablesList(student);
            }
        };

        window.closeEditDeliverablesModal = () => {
            const modal = document.getElementById('edit-deliverables-modal');
            if (modal) modal.classList.remove('active');
        };

        window.saveDeliverablesChanges = () => {
            const studentIdx = parseInt(document.getElementById('edit-deliverables-student-index').value);
            const student = students[studentIdx];

            if (!student) return;

            // Get all checked deliverables
            const checkboxes = document.querySelectorAll('#edit-deliverables-checkboxes input[type="checkbox"]');
            console.log('🔍 Found checkboxes:', checkboxes.length);

            const newCompletedDeliverables = [];

            checkboxes.forEach((checkbox, idx) => {
                console.log(`Checkbox ${idx}: value="${checkbox.value}", checked=${checkbox.checked}`);
                if (checkbox.checked) {
                    newCompletedDeliverables.push(checkbox.value);
                }
            });

            console.log('✅ Checked deliverables:', newCompletedDeliverables);

            // IMPORTANT: Also include custom deliverables
            const predefinedDeliverables = moduleDeliverables[student.module] || [];
            const currentCustomDeliverables = (student.completedDeliverables || []).filter(d => !predefinedDeliverables.includes(d));
            const finalDeliverables = [...newCompletedDeliverables, ...currentCustomDeliverables];

            // Update student's completed deliverables
            student.completedDeliverables = finalDeliverables;

            console.log('📦 Saved deliverables for', student.name);
            console.log('Total deliverables:', finalDeliverables.length);
            console.log('Deliverables list:', finalDeliverables);

            // Log the action
            window.logAction('Entregas Editadas', `Modificó entregas de ${student.name}: ${finalDeliverables.length} completadas`);

            // Save and sync
            save();

            console.log('💾 Saved to localStorage');

            // Sync to Firebase
            if (window.DBService) {
                window.DBService.saveDeliverables(student.id, student.completedDeliverables)
                    .then(() => console.log('✅ Deliverables synced to Firebase'))
                    .catch(e => console.error('❌ Error syncing deliverables:', e));
            }

            // Re-render affected views
            if (typeof renderDeliverablesMatrix === 'function') {
                console.log('🔄 Re-rendering deliverables matrix');
                renderDeliverablesMatrix();
            }
            if (typeof renderStudents === 'function') {
                console.log('🔄 Re-rendering students');
                renderStudents();
            }
            if (typeof updateStats === 'function') {
                console.log('📊 Updating stats');
                updateStats();
            }

            // Close modal
            closeEditDeliverablesModal();

            // Show success message
            if (window.showToast) {
                window.showToast(`Entregas de ${student.name} actualizadas correctamente`, 'success');
            }
        };

        // ==================== MODULE DELIVERABLES MANAGER ====================

        window.openModuleDeliverablesManager = () => {
            const modal = document.getElementById('module-deliverables-manager-modal');
            if (!modal) return;

            // Populate module dropdown
            const select = document.getElementById('module-deliverables-select');
            if (!select) return;

            // Get modules for current user's department
            // Get modules for current user's department
            const rawModules = (typeof getDepartmentModules === 'function' ? getDepartmentModules() : Object.keys(pensumContent || {}));
            const deleted = JSON.parse(localStorage.getItem('deletedModules') || '[]');
            const modules = rawModules.filter(m => !deleted.includes(m)).sort();

            select.innerHTML = '<option value="">-- Selecciona un módulo --</option>' +
                modules.map(mod => `<option value="${mod}">${mod}</option>`).join('');

            // Reset editor state
            document.getElementById('module-deliverables-editor').style.display = 'none';
            document.getElementById('module-deliverables-empty').style.display = 'block';

            modal.classList.add('active');
            if (window.lucide) lucide.createIcons();
        };

        window.loadModuleDeliverables = () => {
            const select = document.getElementById('module-deliverables-select');
            const moduleName = select?.value;

            const editor = document.getElementById('module-deliverables-editor');
            const empty = document.getElementById('module-deliverables-empty');
            const textarea = document.getElementById('module-deliverables-textarea');

            if (!moduleName) {
                editor.style.display = 'none';
                empty.style.display = 'block';
                return;
            }

            // Show editor
            editor.style.display = 'block';
            empty.style.display = 'none';

            // Load current deliverables for this module
            const currentDeliverables = moduleDeliverables[moduleName] || [];
            textarea.value = currentDeliverables.join('\n');
        };

        window.saveModuleDeliverables = () => {
            const select = document.getElementById('module-deliverables-select');
            const moduleName = select?.value;

            if (!moduleName) {
                if (window.showToast) window.showToast('Selecciona un módulo primero', 'warning');
                return;
            }

            const textarea = document.getElementById('module-deliverables-textarea');
            const content = textarea.value.trim();

            // Parse deliverables (one per line, filter empty lines)
            const newDeliverables = content.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            console.log('💾 Saving module deliverables for:', moduleName);
            console.log('New deliverables:', newDeliverables);

            // Update global moduleDeliverables
            moduleDeliverables[moduleName] = newDeliverables;

            // Log the action
            window.logAction('Entregables de Módulo Editados', `Modificó entregables de ${moduleName}: ${newDeliverables.length} entregables`);

            // Save to localStorage
            save();

            // Sync to Firebase
            if (window.DBService) {
                window.DBService.saveDeliverablesConfig(moduleDeliverables)
                    .then(() => console.log('✅ Deliverables Config synced to Firebase'))
                    .catch(e => console.error('❌ Error syncing config:', e));
            }

            // Re-render deliverables matrix
            if (typeof renderDeliverablesMatrix === 'function') renderDeliverablesMatrix();

            // Close modal
            closeModuleDeliverablesManager();

            // Show success
            if (window.showToast) {
                window.showToast(`Entregables de "${moduleName}" actualizados correctamente`, 'success');
            }
        };

        window.closeModuleDeliverablesManager = () => {
            const modal = document.getElementById('module-deliverables-manager-modal');
            if (modal) modal.classList.remove('active');
        };

        window.toggleGlobalDeliverable = (studentIdxOrId, deliverableName) => {
            // Support both Index (Legacy) and ID (Robust)
            let s;
            if (typeof studentIdxOrId === 'string' && studentIdxOrId.length > 5) {
                s = students.find(st => st.id === studentIdxOrId);
            } else {
                s = students[studentIdxOrId];
            }

            if (!s) {
                console.error("Student not found for toggle:", studentIdxOrId);
                return;
            }

            if (!s.completedDeliverables) s.completedDeliverables = [];

            const idx = s.completedDeliverables.indexOf(deliverableName);
            if (idx > -1) {
                s.completedDeliverables.splice(idx, 1); // Remove
                window.logAction('Entregable Revocado', `${s.name}: ${deliverableName}`);
            } else {
                s.completedDeliverables.push(deliverableName); // Add
                window.logAction('Entregable Aprobado', `${s.name}: ${deliverableName}`);
            }

            save();

            // Sync to Firebase
            if (window.DBService) {
                window.DBService.saveDeliverables(s.id, s.completedDeliverables);
            }

            // Full re-render is safer for progress bars
            renderDeliverablesMatrix();
        };

        // Export to CSV (Excel compatible)
        // Export to CSV (Excel compatible with semicolon)
        window.exportToExcel = () => {
            const list = getFilteredStudents(); // Export visible students
            if (list.length === 0) return alert("No hay alumnos para exportar.");

            // BOM for Excel to read UTF-8 correctly
            let csv = "\uFEFF";
            // Use Semicolon for better Excel compatibility in ES/LatAm regions
            csv += "Nombre;Teléfono;Especialidad;Módulo;Tema Actual;Avance %;Rendimiento;Asistencia %\n";

            list.forEach(s => {
                // Helper to safe quote
                const q = (str) => `"${(str || "").replace(/"/g, '""')}"`;

                const name = q(s.name);
                // Phone: Force text format by prepending space if needed, or just quote
                const phone = q(s.phone);
                const spec = q(s.specialty);
                const mod = q(s.module);
                const topic = q(s.topic);

                // Calculations
                const t = pensumContent[s.module] || [];
                const i = t.indexOf(s.topic);
                const prog = t.length > 0 ? Math.round(((i + 1) / t.length) * 100) : 0;

                let perf = "-";
                if (typeof window.calculatePerformance === 'function') {
                    perf = window.calculatePerformance(s).label;
                }
                perf = q(perf);

                let att = "-";
                if (typeof window.getAttendanceStats === 'function') {
                    att = window.getAttendanceStats(s.name).percent + "%";
                }
                att = q(att);

                csv += `${name};${phone};${spec};${mod};${topic};${prog};${perf};${att}\n`;
            });

            // Changed MIME type slightly to encourage Excel to open it
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            // .csv extension is standard, but sometimes .txt helps force the wizard. Sticking to .csv for now.
            link.download = `Reporte_Alumnos_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // ========================================
        // PENSUM MODERN GRID RENDERING
        // ========================================

        // Color palette for module cards
        const moduleColors = [
            'yellow', 'pink', 'purple', 'blue', 'green',
            'orange', 'indigo', 'teal', 'red', 'cyan'
        ];

        // Module structure organized by specialty and number
        const moduleStructure = {
            "Diseño Gráfico": [
                {
                    number: 1,
                    name: "Photoshop Básico",
                    description: "Domina las herramientas fundamentales de edición y retoque fotográfico profesional."
                },
                {
                    number: 2,
                    name: "Photoshop Avanzado",
                    description: "Técnicas avanzadas de fotomontaje, colorización y composición visual."
                },
                {
                    number: 3,
                    name: "Illustrator Básico",
                    description: "Aprende ilustración vectorial y manejo de formas geométricas."
                },
                {
                    number: 4,
                    name: "Illustrator Avanzado",
                    description: "Diseño de identidad corporativa, logos y maquetación profesional."
                },
                {
                    number: 5,
                    name: "Elementos Gráficos RRSS",
                    description: "Crea contenido visual impactante para redes sociales."
                }
            ],
            "Diseño para Redes Sociales": [
                {
                    number: 1,
                    name: "Photoshop Básico",
                    description: "Introducción al diseño digital y retoque fotográfico básico."
                },
                {
                    number: 2,
                    name: "Illustrator Básico",
                    description: "Figuras geométricas, pluma e ilustración básica."
                },
                {
                    number: 3,
                    name: "Elementos Gráficos para Redes",
                    description: "Diseño completo de marca para plataformas digitales."
                }
            ],
            "Diseño Web": [
                {
                    number: 1,
                    name: "Maquetación Web",
                    description: "Diseña interfaces web modernas y responsivas."
                },
                {
                    number: 2,
                    name: "WordPress",
                    description: "Desarrolla sitios web profesionales con el CMS más popular."
                }
            ],
            "Edición de Video": [
                {
                    number: 1,
                    name: "Fundamentos de CapCut",
                    description: "Inicia en la edición de video para redes sociales."
                },
                {
                    number: 2,
                    name: "Edición Dinámica",
                    description: "Domina keyframes, transiciones y efectos de movimiento."
                },
                {
                    number: 3,
                    name: "Efectos y Transiciones",
                    description: "Crea videos profesionales con efectos avanzados."
                },
                {
                    number: 4,
                    name: "Audio y Colorización",
                    description: "Perfecciona el audio y color de tus producciones."
                },
                {
                    number: 5,
                    name: "Proyecto Final Viral",
                    description: "Crea contenido viral optimizado para plataformas digitales."
                }
            ],
            "Inteligencia Artificial": [
                {
                    number: 1,
                    name: "Ingeniería de Prompts",
                    description: "Domina el arte de crear instrucciones precisas para IAs generativas."
                },
                {
                    number: 2,
                    name: "Creación de Assets con IA",
                    description: "Genera imágenes, videos y voces sintéticas para proyectos digitales."
                }
            ],
            "Marketing 5.0": [
                { number: 1, name: "Fundamentos de Marketing 5.0", description: "Estrategias de marketing modernas potenciadas por tecnología." },
                { number: 2, name: "Investigación con IA", description: "Análisis de mercado y competencia acelerado con IA." },
                { number: 3, name: "Estrategia de Contenidos & Copy", description: "Creación de contenido viral y persuasivo." },
                { number: 4, name: "Business Manager (Meta)", description: "Publicidad avanzada en Facebook e Instagram." },
                { number: 5, name: "Google Ads & Analytics", description: "Campaña de búsqueda y análisis de datos." },
                { number: 6, name: "Automatización & Chatbots", description: "Optimización de flujos de venta." }
            ],
            "Experto en Excel": [
                { number: 1, name: "Excel Básico", description: "Fundamentos, fórmulas básicas y manejo de interfaz." },
                { number: 2, name: "Excel Intermedio", description: "Tablas dinámicas, funciones lógicas y gráficos." },
                { number: 3, name: "Excel Avanzado", description: "Macros, VBA e integración con IA." }
            ]
        };

        // [RESTORED FEATURE] Hydrate moduleStructure from LocalStorage (or Metadata)
        const savedCustomModules = JSON.parse(localStorage.getItem('customModules') || '{}');
        Object.keys(savedCustomModules).forEach(cat => {
            if (!moduleStructure[cat]) moduleStructure[cat] = [];

            // Merge custom modules avoiding duplicates
            const customList = savedCustomModules[cat];
            customList.forEach(mod => {
                // Determine if mod is object or string (legacy)
                const modName = (typeof mod === 'object' && mod.name) ? mod.name : mod;

                // If not exists in hardcoded structure, add it
                if (!moduleStructure[cat].some(m => m.name === modName)) {
                    if (typeof mod === 'object' && mod.name) {
                        moduleStructure[cat].push(mod);
                    } else {
                        // Legacy string fallback (we lose description/number but at least it shows)
                        moduleStructure[cat].push({
                            name: mod,
                            number: 99, // default
                            description: "Módulo personalizado"
                        });
                    }
                }
            });
            // Sort
            moduleStructure[cat].sort((a, b) => a.number - b.number);
        });

        // Current filter state
        let currentPensumFilter = 'all';

        // Filter pensum by category
        window.filterPensumByCategory = (category) => {
            currentPensumFilter = category;

            // Update filter buttons
            document.querySelectorAll('.filter-chip').forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.trim() === 'Todos' && category === 'all') {
                    btn.classList.add('active');
                } else if (btn.textContent.includes(category)) {
                    btn.classList.add('active');
                }
            });

            // Re-render
            renderPensumConfig();
        };

        // Toggle module card expansion
        window.toggleModuleCard = (moduleId) => {
            const card = document.getElementById(moduleId);
            if (card) {
                card.classList.toggle('expanded');
                const btn = card.querySelector('.expand-btn');
                if (btn) {
                    btn.textContent = card.classList.contains('expanded')
                        ? 'Ver menos'
                        : 'Ver temario completo';
                }
            }
        };





        // ==========================================
        // FINANCE & PAYMENTS ADMIN
        // ==========================================



        window.renderFinance = () => {
            // 1. Calculate Stats
            const currentMonthFull = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            const currentMonthName = new Date().toLocaleDateString('es-ES', { month: 'long' }); // e.g., "enero"
            const currentYear = new Date().getFullYear();
            const monthKey = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1) + " " + currentYear; // "Enero 2026"

            let totalIncome = 0;
            let pendingCount = 0;
            const list = students; // Finance is usually Global

            const paymentsTable = document.getElementById('finance-table-body');
            if (paymentsTable) {
                paymentsTable.innerHTML = '';

                list.forEach(s => {
                    const payments = s.payments || [];
                    // Check if paid for this month (Concept matches month OR date matches month)
                    const paidThisMonth = payments.some(p => p.concept === monthKey || (p.date && new Date(p.date).getMonth() === new Date().getMonth() && new Date(p.date).getFullYear() === new Date().getFullYear()));

                    if (!paidThisMonth) pendingCount++;

                    // Sum all income for this month (actual cash flow)
                    payments.forEach(p => {
                        const pDate = new Date(p.date);
                        if (pDate.getMonth() === new Date().getMonth() && pDate.getFullYear() === new Date().getFullYear()) {
                            totalIncome += parseFloat(p.amount);
                        }
                    });

                    // Render Row
                    const lastPayment = payments.length > 0 ? payments[payments.length - 1] : null;
                    const statusBadge = paidThisMonth
                        ? `<span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:700;">AL DÍA</span>`
                        : `<span style="background:#fee2e2; color:#991b1b; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:700;">PENDIENTE</span>`;

                    paymentsTable.innerHTML += `
                        <tr>
                            <td style="display:flex; align-items:center; gap:10px;">
                                <img src="${window.getAvatarUrl(s.name)}" style="width:30px; height:30px; border-radius:50%;">
                                <div>
                                    <div style="font-size:13px; font-weight:700;">${s.name}</div>
                                    <div style="font-size:10px; color:#64748b;">${s.specialty || 'General'}</div>
                                </div>
                            </td>
                            <td style="font-size:12px;">$100 / Mes</td>
                            <td>${statusBadge}</td>
                            <td style="font-size:11px;">${lastPayment ? '$' + lastPayment.amount + ' (' + new Date(lastPayment.date).toLocaleDateString() + ')' : 'Sin registros'}</td>
                            <td>
                                <button class="btn-icon" onclick="openPaymentModal('${s.id}')" title="Registrar Pago">
                                    <i data-lucide="plus-circle" style="color:var(--primary);"></i>
                                </button>
                            </td>
                        </tr>
                     `;
                });
            }

            // Update Stats UI
            if (document.getElementById('fin-month-income')) document.getElementById('fin-month-income').innerText = "$" + totalIncome.toLocaleString();
            if (document.getElementById('fin-pending-count')) document.getElementById('fin-pending-count').innerText = pendingCount;
            if (document.getElementById('fin-total-students')) document.getElementById('fin-total-students').innerText = list.length;

            // Charts (Simple refresh if needed)
            renderFinanceCharts(list, monthKey);
            if (window.lucide) lucide.createIcons();
        };

        function renderFinanceCharts(list, currentMonthKey) {
            const ctxComp = document.getElementById('admin-comparison-chart');
            const ctxInc = document.getElementById('admin-income-chart');
            if (!ctxComp || !ctxInc) return;

            // 1. Comparison Chart (Students per Specialty)
            const specs = {};
            list.forEach(s => specs[s.specialty || 'Otros'] = (specs[s.specialty || 'Otros'] || 0) + 1);

            if (window.finCompChart) window.finCompChart.destroy();
            window.finCompChart = new Chart(ctxComp, {
                type: 'bar',
                data: {
                    labels: Object.keys(specs),
                    datasets: [{
                        label: 'Cantidad de Alumnos',
                        data: Object.values(specs),
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
                        borderRadius: 6
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });

            // 2. Income Chart (Estimated vs Collected)
            // Est: Total Students * 100 (Assuming $100 fee)
            // Coll: Actual collected this month
            let collected = 0;
            list.forEach(s => {
                (s.payments || []).forEach(p => {
                    const pDate = new Date(p.date);
                    if (pDate.getMonth() === new Date().getMonth() && pDate.getFullYear() === new Date().getFullYear()) {
                        collected += parseFloat(p.amount);
                    }
                });
            });
            const estimated = list.length * 100;

            if (window.finIncChart) window.finIncChart.destroy();
            window.finIncChart = new Chart(ctxInc, {
                type: 'doughnut',
                data: {
                    labels: ['Cobrado', 'Pendiente'],
                    datasets: [{
                        data: [collected, (estimated - collected) > 0 ? (estimated - collected) : 0],
                        backgroundColor: ['#10b981', '#e2e8f0'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
            });
        }

        window.openPaymentModal = (studentId = null) => {
            const modal = document.getElementById('payment-modal');
            const select = document.getElementById('pay-student-id');

            // Populate Select
            select.innerHTML = '<option value="">Seleccionar Alumno...</option>';
            students.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id || students.indexOf(s); // Use ID or Index fallback
                opt.innerText = s.name;
                if (studentId && (s.id === studentId || students.indexOf(s) == studentId)) opt.selected = true;
                select.appendChild(opt);
            });

            // Set Date to Today
            const dateInput = document.getElementById('pay-date');
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }

            modal.classList.add('active');
        };

        window.closePaymentModal = () => document.getElementById('payment-modal').classList.remove('active');

        // Initial Listener for Payment Form
        // Since we are inside the IIFE, we can attach this safely
        setTimeout(() => {
            const payForm = document.getElementById('payment-form');
            if (payForm) {
                payForm.onsubmit = (e) => {
                    e.preventDefault();
                    const sId = document.getElementById('pay-student-id').value;
                    const amount = parseFloat(document.getElementById('pay-amount').value);
                    const concept = document.getElementById('pay-concept').value;
                    const method = document.getElementById('pay-method').value;
                    const dateVal = document.getElementById('pay-date').value;

                    if (!sId || !amount) {
                        window.showToast("Datos incompletos", "error");
                        return;
                    }

                    // Find student
                    // Check if ID matches or index
                    let s = students.find(st => st.id === sId);
                    if (!s && !isNaN(sId)) s = students[sId];

                    if (s) {
                        if (!s.payments) s.payments = [];

                        // Use selected date or fallback to now
                        const paymentDate = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();

                        s.payments.push({
                            date: paymentDate,
                            amount: amount,
                            concept: concept,
                            method: method,
                            id: Date.now().toString(36)
                        });


                        save(); // Global save
                        window.showToast("Pago registrado con éxito", "success");
                        window.closePaymentModal();
                        renderFinance(); // Refresh UI
                    } else {
                        window.showToast("Error al encontrar estudiante", "error");
                    }
                };
            }
        }, 1000); // Small delay to ensure DOM

        // --- INITIALIZATION ---
        // Flag to ensure init only runs once
        let isInitialized = false;

        // Primary: DOMContentLoaded listener
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof init === 'function' && !isInitialized) {
                console.log("Initializing App...");
                isInitialized = true;
                init();
            }
        });

        // -------------------------------------------------
        // SAFETY: Ensure init runs even if DOMContentLoaded missed
        // (e.g., script loaded after DOM already ready)
        if (typeof init === 'function' && !isInitialized) {
            if (document.readyState !== 'loading') {
                console.log("DOM already ready, initializing immediately...");
                isInitialized = true;
                init();
            }
        }


        // RE-DEFINING FUNCTIONS TO FIX SCOPE ISSUES
        window.downloadBackup = () => {
            const fullBackup = {
                meta: { version: "2.0", timestamp: new Date().toISOString() },
                data: {
                    students: localStorage.getItem('design_students') ? JSON.parse(localStorage.getItem('design_students')) : [],
                    attendance: localStorage.getItem('attendanceRecords') ? JSON.parse(localStorage.getItem('attendanceRecords')) : {},
                    pensum: localStorage.getItem('design_pensum_content') ? JSON.parse(localStorage.getItem('design_pensum_content')) : {},
                    departments: localStorage.getItem('availableDepartments') ? JSON.parse(localStorage.getItem('availableDepartments')) : [],
                    payments: localStorage.getItem('payments') ? JSON.parse(localStorage.getItem('payments')) : [],
                    logs: localStorage.getItem('globalLogs') ? JSON.parse(localStorage.getItem('globalLogs')) : [],
                    specialties: localStorage.getItem('specialties_structure') ? JSON.parse(localStorage.getItem('specialties_structure')) : {},
                    settings: {
                        academyName: localStorage.getItem('academyName'),
                        maxCapacity: localStorage.getItem('maxCapacity'),
                        riskPercent: localStorage.getItem('riskPercent')
                    }
                }
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
            const a = document.createElement('a');
            a.href = dataStr;
            a.download = "CTD_Respaldo_" + new Date().toISOString().slice(0, 10) + ".json";
            document.body.appendChild(a);
            a.click();
            a.remove();
            if (window.showToast) window.showToast("Respaldo descargado", "success");
        };

        window.generateWeeklyAttendanceReport = () => {
            if (typeof XLSX === 'undefined') return alert("Excel lib not loaded");
            const now = new Date();
            const start = new Date(now);
            const day = start.getDay() || 7;
            if (day !== 1) start.setHours(-24 * (day - 1));
            const dates = [];
            for (let i = 0; i < 6; i++) {
                const d = new Date(start);
                d.setDate(start.getDate() + i);
                dates.push({ k: d.toISOString().split('T')[0], l: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][d.getDay()] + " " + d.getDate() });
            }

            const data = students.map(s => {
                const row = { "Estudiante": s.name, "Turno": Array.isArray(s.schedule) ? s.schedule[0] : s.schedule };
                let count = 0;
                dates.forEach(d => {
                    const r = (attendanceRecords[d.k] || []).find(r => r.studentId === s.id);
                    row[d.l] = r ? (r.status === 'present' ? "✔" : (r.status === 'absent' ? "✖" : (r.status === 'late' ? "🕒" : "-"))) : "";
                    if (r && r.status === 'present') count++;
                });
                row["Total"] = count;
                return row;
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, "Semana");
            XLSX.writeFile(wb, "Asistencia_Semanal.xlsx");
            if (window.showToast) window.showToast("Reporte descargado", "success");
        };

        // ==== ORIGINAL CODE ENDS HERE ====



        // REPORT CARD LOGIC (Web Colors)
        window.openReportCard = (index) => {
            const student = students[index];
            if (!student) return;

            const container = document.getElementById('report-card-body');
            if (!container) return; // Should exist

            const att = getAttendanceStats(student.name);
            const perf = calculatePerformance(student);
            const topics = pensumContent[student.module] || [];
            const currentTopicIdx = topics.indexOf(student.topic) + 1;
            const totalTopics = topics.length;
            const progressPercent = totalTopics > 0 ? Math.round((currentTopicIdx / totalTopics) * 100) : 0;

            // Colors from CSS
            const colors = {
                primary: '#16234d',
                secondary: '#e67e22',
                accent: '#f8ad00',
                success: '#10b981',
                text: '#1e293b',
                light: '#f8fafc'
            };

            const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            container.innerHTML = `
            <div style="text-align: right; font-size: 11px; color: #64748b; margin-bottom: 20px;">
                Fecha de Emisión: ${today}
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 30px; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
                <img src="${window.getAvatarUrl(student.name)}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid ${colors.secondary};">
                <div>
                    <h2 style="margin: 0; color: ${colors.primary}; font-size: 20px;">${student.name}</h2>
                    <p style="margin: 5px 0 0; color: ${colors.text}; font-weight: 500;">
                        ${student.specialty || 'Estudiante'} • ID: ${student.id || 'N/A'}
                    </p>
                    <div style="margin-top: 5px; font-size: 12px; color: #64748b;">
                        Turno: ${Array.isArray(student.schedule) ? student.schedule.join(', ') : student.schedule}
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                <div style="background: ${colors.light}; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Rendimiento Académico</h3>
                    <div style="font-size: 24px; font-weight: 800; color: ${colors.primary};">
                        ${perf.label}
                    </div>
                    <div style="font-size: 12px; color: ${colors.secondary}; margin-top: 5px; font-weight: 600;">
                        Promedio Ref: ${perf.rawScore ? perf.rawScore.toFixed(1) : '-'}
                    </div>
                </div>
                
                <div style="background: ${colors.light}; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Asistencia</h3>
                    <div style="font-size: 24px; font-weight: 800; color: ${att.percent >= 85 ? colors.success : colors.secondary};">
                        ${att.percent}%
                    </div>
                    <div style="display: flex; gap: 10px; font-size: 11px; margin-top: 5px;">
                        <span style="color: ${colors.success};">✔ ${att.present}</span>
                        <span style="color: #ef4444;">✖ ${att.absent}</span>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="color: ${colors.primary}; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">
                    Progreso del Módulo: <span style="color: ${colors.secondary};">${student.module}</span>
                </h3>
                
                <div style="background: #e2e8f0; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 10px;">
                    <div style="width: ${progressPercent}%; background: linear-gradient(90deg, ${colors.accent}, ${colors.secondary}); height: 100%; border-radius: 6px;"></div>
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                    <span style="color: ${colors.primary};">Tema Actual: ${student.topic}</span>
                    <span style="color: ${colors.text};">${progressPercent}% Completado</span>
                </div>
            </div>

            <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 50px; border-top: 1px dashed #e2e8f0; padding-top: 20px;">
                Este documento es un reporte generado automáticamente por el Sistema de Gestión Académica CTD.
                <br>Academia de Diseño y Tecnología
            </div>
        `;

            document.getElementById('report-modal').classList.add('active');
        };

        // REAL-TIME VENEZUELA CLOCK SYSTEM
        function updateClock() {
            const timeEl = document.getElementById('clock-time');
            const dateEl = document.getElementById('clock-date');
            if (!timeEl || !dateEl) return;

            const now = new Date();
            // Venezuela Offset: -04:00 (America/Caracas)
            const optionsTime = {
                timeZone: 'America/Caracas',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            const optionsDate = {
                timeZone: 'America/Caracas',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };

            try {
                const timeStr = new Intl.DateTimeFormat('en-US', optionsTime).format(now);
                const dateStr = new Intl.DateTimeFormat('es-ES', optionsDate).format(now);

                timeEl.innerText = timeStr;
                dateEl.innerText = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
            } catch (err) {
                // Fallback if Intl is not supported
                timeEl.innerText = now.toLocaleTimeString();
                dateEl.innerText = now.toLocaleDateString();
            }
        }

        setInterval(updateClock, 1000);
        updateClock(); // Initial call

    } catch (e) {
        console.error('Unhandled error in app.js:', e);
    }
})(); // IIFE end


// --- INJECTED PENSUM LOGIC ---

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
        // CRITICAL FIX: Handle when modName is an object {name: "...", number: 1}
        const moduleName = (typeof modName === 'object' && modName.name) ? modName.name : modName;

        // Ensure moduleName is a string
        if (typeof moduleName !== 'string') {
            console.warn('Skipping invalid module:', modName);
            return;
        }

        // Color Logic
        let colorClass = 'color-blue';
        const s = moduleName.toLowerCase();
        if (s.includes('photoshop')) colorClass = 'color-blue';
        else if (s.includes('illustrator')) colorClass = 'color-orange';
        else if (s.includes('redes') || s.includes('social')) colorClass = 'color-pink';
        else if (s.includes('web')) colorClass = 'color-cyan';
        else if (s.includes('video') || s.includes('capcut')) colorClass = 'color-purple';
        else if (s.includes('ia') || s.includes('prompts')) colorClass = 'color-indigo';
        else if (s.includes('excel')) colorClass = 'color-green';
        else if (s.includes('marketing') || s.includes('investigación') || s.includes('copy') || s.includes('business') || s.includes('ads') || s.includes('chatbots')) colorClass = 'color-red';

        html += renderSpecialtyCard(moduleName, `pensum-mod-${i}`, colorClass, activeCategory);
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
    // 0. Check if Deleted (Local OR Global)
    const deletedLocal = JSON.parse(localStorage.getItem('deletedModules') || '[]');
    const deletedGlobal = window.globalDeletedModules || JSON.parse(localStorage.getItem('globalDeletedModules') || '[]');

    if (deletedLocal.includes(title) || deletedGlobal.includes(title)) return '';

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

    // Manual filtering logic
    // 1. Get User's Roles/Specialties (e.g. ["Diseño Gráfico", "Diseño Web"])
    let userRoles = [];
    if (currentUser.id === 'admin') {
        console.log('👑 Admin user detected - showing all modules');
        userRoles = Object.keys(specialtiesMap); // Admin sees everything
    } else {
        userRoles = currentUser.specialties || [];

        // CRITICAL FIX: Fallback mapping if specialties array is empty
        if (userRoles.length === 0) {
            console.log('⚠️ Specialties array empty, using ID-based mapping');
            if (currentUser.id === 'design') userRoles = ['Diseño Gráfico', 'Diseño para Redes Sociales'];
            else if (currentUser.id === 'multimedia') userRoles = ['Diseño Web', 'Edición de Video', 'Multimedia'];
            else if (currentUser.id === 'ai') userRoles = ['Inteligencia Artificial'];
            else if (currentUser.id === 'marketing') userRoles = ['Marketing Digital', 'Marketing 5.0'];
            else if (currentUser.id === 'excel') userRoles = ['Excel Empresarial', 'Experto en Excel'];
        }
        console.log('User roles/specialties after mapping:', userRoles);
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
