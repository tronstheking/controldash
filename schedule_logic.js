
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
    applyLogic('edit');
}
