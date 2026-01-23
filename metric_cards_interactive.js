// ===================================
// ATTENDANCE METRIC CARDS INTERACTIVE
// ===================================

(function () {
    'use strict';

    // Wait for DOM to be ready
    function initializeMetricCards() {
        const metricCards = document.querySelectorAll('.stat-card-eduka');

        if (metricCards.length === 0) {
            console.log('⏳ Metric cards not found yet, retrying...');
            return false;
        }

        metricCards.forEach((card, index) => {
            // Skip if already initialized
            if (card.dataset.initialized) return;

            card.dataset.initialized = 'true';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            // Determine card type based on content or index
            let cardType = 'unknown';
            const heading = card.querySelector('h3');
            if (heading) {
                const text = heading.textContent.toLowerCase();
                if (text.includes('total') || text.includes('estudiantes')) cardType = 'total';
                else if (text.includes('present') || text.includes('hoy')) cardType = 'present';
                else if (text.includes('event') || text.includes('clases')) cardType = 'events';
                else if (text.includes('alert') || text.includes('atención')) cardType = 'alerts';
            }

            // Add click handler
            card.addEventListener('click', function () {
                handleMetricCardClick(cardType, card);
            });

            // Add keyboard support
            card.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMetricCardClick(cardType, card);
                }
            });

            // Add tooltip
            addTooltip(card, cardType);
        });

        console.log('✅ Metric cards initialized:', metricCards.length);
        return true;
    }

    function handleMetricCardClick(type, cardElement) {
        // Remove active class from all cards
        document.querySelectorAll('.stat-card-eduka').forEach(c => c.classList.remove('active'));

        // Add active class to clicked card
        cardElement.classList.add('active');

        // Execute action based on card type
        switch (type) {
            case 'total':
                showAllStudents(cardElement);
                break;
            case 'present':
                filterByPresent(cardElement);
                break;
            case 'events':
                showUpcomingEvents(cardElement);
                break;
            case 'alerts':
                highlightRiskStudents(cardElement);
                break;
            default:
                console.log('Unknown card type:', type);
        }

        // Ripple effect
        createRipple(cardElement, event);
    }

    function showAllStudents(card) {
        // Remove any filters
        const studentCards = document.querySelectorAll('.student-att-card');
        studentCards.forEach(c => {
            c.style.display = '';
            c.classList.remove('highlight-risk');
        });

        if (window.showToast) {
            window.showToast('Mostrando todos los estudiantes', 'info');
        }
        console.log('👥 Showing all students');
    }

    function filterByPresent(card) {
        const studentCards = document.querySelectorAll('.student-att-card');
        let presentCount = 0;

        studentCards.forEach(studentCard => {
            const presentPill = studentCard.querySelector('.status-pill.present.active');
            if (presentPill) {
                studentCard.style.display = '';
                presentCount++;
            } else {
                studentCard.style.display = 'none';
            }
        });

        if (window.showToast) {
            window.showToast(`Mostrando ${presentCount} estudiantes presentes`, 'success');
        }
        console.log('✅ Filtered to present students:', presentCount);
    }

    function showUpcomingEvents(card) {
        if (window.showToast) {
            const valueEl = card.querySelector('.value');
            const count = valueEl ? valueEl.textContent : '0';
            window.showToast(`${count} clases programadas para hoy`, 'info');
        }
        console.log('📅 Showing upcoming events');
    }

    function highlightRiskStudents(card) {
        const studentCards = document.querySelectorAll('.student-att-card');
        let riskCount = 0;

        studentCards.forEach(studentCard => {
            const absentPill = studentCard.querySelector('.status-pill.absent.active');

            // Remove previous highlights
            studentCard.classList.remove('highlight-risk');

            if (absentPill) {
                // Highlight students marked as absent (risk)
                studentCard.classList.add('highlight-risk');
                studentCard.style.display = '';
                riskCount++;

                // Smooth scroll to first risk student
                if (riskCount === 1) {
                    setTimeout(() => {
                        studentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            } else {
                studentCard.style.display = 'none';
            }
        });

        if (window.showToast) {
            if (riskCount > 0) {
                window.showToast(`⚠️ ${riskCount} estudiantes requieren atención`, 'warning');
            } else {
                window.showToast('✅ No hay estudiantes en riesgo', 'success');
            }
        }

        console.log('⚠️ Highlighting risk students:', riskCount);
    }

    function addTooltip(card, type) {
        const tooltips = {
            total: 'Click para ver todos',
            present: 'Click para filtrar presentes',
            events: 'Click para ver eventos',
            alerts: 'Click para resaltar en riesgo'
        };

        const tooltip = tooltips[type] || 'Click para más detalles';
        card.setAttribute('title', tooltip);
    }

    function createRipple(element, clickEvent) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple-effect 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';

        if (clickEvent && clickEvent.clientX) {
            ripple.style.left = (clickEvent.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (clickEvent.clientY - rect.top - size / 2) + 'px';
        } else {
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        }

        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Add CSS for ripple and highlight effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }

        .student-att-card.highlight-risk {
            animation: pulse-risk 1.5s ease-in-out 2;
            border-color: #ef4444 !important;
        }

        @keyframes pulse-risk {
            0%, 100% {
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
            }
            50% {
                box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize with retry logic
    let attempts = 0;
    const maxAttempts = 10;

    function tryInitialize() {
        if (attempts >= maxAttempts) {
            console.log('❌ Failed to initialize metric cards after', maxAttempts, 'attempts');
            return;
        }

        const success = initializeMetricCards();
        if (!success) {
            attempts++;
            setTimeout(tryInitialize, 500);
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInitialize);
    } else {
        tryInitialize();
    }

    // Re-initialize on view change (if switchView is called)
    const originalSwitchView = window.switchView;
    if (originalSwitchView) {
        window.switchView = function (...args) {
            originalSwitchView.apply(this, args);
            // Re-initialize after view switch
            setTimeout(() => {
                attempts = 0;
                tryInitialize();
            }, 300);
        };
    }

    console.log('📊 Metric Cards Interactive Script Loaded');
})();
