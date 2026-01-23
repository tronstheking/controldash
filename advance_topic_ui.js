// =========================================
// ADVANCED TOPIC BUTTONS UI ENHANCEMENT
// =========================================

(function () {
    'use strict';

    console.log('🚀 Loading Topic Advancement UI...');

    function addAdvanceButtons() {
        // Find all student cards
        const studentCards = document.querySelectorAll('.student-smart-card');

        if (studentCards.length === 0) {
            console.log('⏳ Student cards not found yet, retrying...');
            return false;
        }

        studentCards.forEach((card, index) => {
            // Skip if button already exists
            if (card.querySelector('.btn-advance-topic')) return;

            // Find the action buttons container
            let actionsContainer = card.querySelector('.card-action-btns');

            if (!actionsContainer) {
                // If no container exists, create one
                actionsContainer = document.createElement('div');
                actionsContainer.className = 'card-action-btns';
                actionsContainer.style.cssText = 'display:flex;gap:8px;margin-top:10px;';

                // Find footer or create it
                let footer = card.querySelector('.card-footer-actions');
                if (!footer) {
                    footer = document.createElement('div');
                    footer.className = 'card-footer-actions';
                    card.appendChild(footer);
                }
                footer.appendChild(actionsContainer);
            }

            // Get student name from card
            const nameElement = card.querySelector('.card-name');
            const studentName = nameElement ? nameElement.textContent.trim() : '';

            // Create advance button
            const advanceBtn = document.createElement('button');
            advanceBtn.className = 'btn-icon-smart btn-advance-topic';
            advanceBtn.innerHTML = '<i data-lucide="chevron-right" style="width:16px;height:16px;"></i>';
            advanceBtn.title = 'Avanzar al siguiente tema';
            advanceBtn.style.cssText = `
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
            `;

            // Add click handler
            advanceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleAdvance(studentName, index);
            });

            actionsContainer.appendChild(advanceBtn);
        });

        // Re-render Lucide icons
        if (window.lucide) window.lucide.createIcons();

        console.log('✅ Advance buttons added to', studentCards.length, 'cards');
        return true;
    }

    function handleAdvance(studentName, index) {
        if (!studentName) {
            if (window.showToast) {
                window.showToast('No se pudo identificar al estudiante', 'error');
            }
            console.error('❌ Student name not found');
            return;
        }

        // Check if avanzarTema function exists
        if (typeof window.avanzarTema === 'function') {
            try {
                window.avanzarTema(studentName);

                // Show success feedback
                if (window.showToast) {
                    window.showToast(`✅ ${studentName} avanzó al siguiente tema`, 'success');
                }

                // Refresh the view if save exists
                if (typeof window.save === 'function') {
                    window.save();
                }
            } catch (error) {
                console.error('Error advancing topic:', error);
                if (window.showToast) {
                    window.showToast('Error al avanzar tema', 'error');
                }
            }
        } else {
            console.error('❌ avanzarTema function not found');
            if (window.showToast) {
                window.showToast('Función de avance no disponible', 'warning');
            }
        }
    }

    function addBulkAdvanceButton() {
        // Check if there's a dashboard actions bar
        const actionsBar = document.querySelector('.actions-bar');

        if (!actionsBar) return;

        // Check if button already exists
        if (document.querySelector('#bulk-advance-btn')) return;

        // Create bulk advance button
        const bulkBtn = document.createElement('button');
        bulkBtn.id = 'bulk-advance-btn';
        bulkBtn.className = 'modern-action-btn secondary';
        bulkBtn.innerHTML = `
            <i data-lucide="fast-forward"></i>
            Avanzar Todos
        `;

        bulkBtn.addEventListener('click', () => {
            if (confirm('¿Avanzar TODOS los estudiantes al siguiente tema?')) {
                bulkAdvanceAllStudents();
            }
        });

        actionsBar.appendChild(bulkBtn);

        // Re-render icons
        if (window.lucide) window.lucide.createIcons();

        console.log('✅ Bulk advance button added');
    }

    function bulkAdvanceAllStudents() {
        if (typeof window.students === 'undefined' || !Array.isArray(window.students)) {
            if (window.showToast) {
                window.showToast('No se encontraron estudiantes', 'error');
            }
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        window.students.forEach(student => {
            try {
                if (typeof window.avanzarTema === 'function') {
                    window.avanzarTema(student.name);
                    successCount++;
                }
            } catch (error) {
                console.error(`Error advancing ${student.name}:`, error);
                errorCount++;
            }
        });

        // Show results
        if (window.showToast) {
            if (errorCount === 0) {
                window.showToast(`✅ ${successCount} estudiantes avanzados`, 'success');
            } else {
                window.showToast(`⚠️ ${successCount} avanzados, ${errorCount} errores`, 'warning');
            }
        }

        // Refresh view
        if (typeof window.save === 'function') {
            window.save();
        }
    }

    // Initialize with retry logic
    let attempts = 0;
    const maxAttempts = 10;

    function tryInitialize() {
        if (attempts >= maxAttempts) {
            console.log('❌ Failed to add advance buttons after', maxAttempts, 'attempts');
            return;
        }

        const success = addAdvanceButtons();
        if (!success) {
            attempts++;
            setTimeout(tryInitialize, 500);
        } else {
            // Add bulk button after individual buttons are ready
            setTimeout(addBulkAdvanceButton, 100);

            // Setup MutationObserver to watch for card re-renders
            setupMutationObserver();
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInitialize);
    } else {
        tryInitialize();
    }

    // Setup MutationObserver to watch for card re-renders
    function setupMutationObserver() {
        // Find the container where student cards are rendered
        const container = document.querySelector('.students-container') ||
            document.querySelector('.student-list') ||
            document.querySelector('#content-dashboard');

        if (!container) {
            console.log('⚠️ Could not find container to observe');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;

            mutations.forEach((mutation) => {
                // Check if nodes were added or removed
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    // Check if any student cards exist without advance buttons
                    const cardsWithoutButtons = Array.from(
                        document.querySelectorAll('.student-smart-card')
                    ).filter(card => !card.querySelector('.btn-advance-topic'));

                    if (cardsWithoutButtons.length > 0) {
                        shouldRecheck = true;
                    }
                }
            });

            if (shouldRecheck) {
                console.log('🔄 DOM changed, re-adding advance buttons...');
                setTimeout(() => {
                    addAdvanceButtons();
                }, 100);
            }
        });

        // Start observing
        observer.observe(container, {
            childList: true,
            subtree: true
        });

        console.log('👁️ MutationObserver active, watching for card re-renders');
    }

    // Re-initialize on view change
    const originalSwitchView = window.switchView;
    if (originalSwitchView) {
        window.switchView = function (...args) {
            originalSwitchView.apply(this, args);
            setTimeout(() => {
                attempts = 0;
                tryInitialize();
            }, 300);
        };
    }

    console.log('📚 Topic Advancement UI Script Loaded');
})();
