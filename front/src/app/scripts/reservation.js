document.addEventListener('DOMContentLoaded', function () {
    // Estado da aplicação
    const state = {
        selectedDate: new Date(),
        // selectedTeacher: null,
        selectedLab: null,
        selectedTime: null,
        selectedKit: null,
    };

    // Elementos do DOM
    const monthYearEl = document.getElementById('month-year');
    const calendarDaysEl = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const infoDateEl = document.getElementById('info-data');
    // const infoTeacherEl = document.getElementById('info-professor');
    const infoLabEl = document.getElementById('info-lab');
    const infoHorarioEl = document.getElementById('info-horario');
    const infoKitsEl = document.getElementById('info-kits');

    const labButtonsContainer = document.getElementById('lab-buttons');
    // const teacherButtonsContainer = document.getElementById('teacher-buttons');
    const timeSlotsContainer = document.getElementById('time-slots');
    const kitButtonsContainer = document.getElementById('kit-buttons');
    const progressBar = document.getElementById('progress-bar');

    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    function renderCalendar() {
        calendarDaysEl.innerHTML = '';
        const date = new Date(state.selectedDate);
        const month = date.getMonth();
        const year = date.getFullYear();

        monthYearEl.textContent = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adiciona os dias da semana
        weekdays.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.classList.add('weekday');
            dayEl.textContent = day;
            dayEl.style.border = '2px solid #005b5f'; // <-- Define a borda para os dias da semana, pode ser verde como os outros itens ou preto, depense do solicitado
            calendarDaysEl.appendChild(dayEl);
        });

        // Adiciona células vazias
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.style.cursor = 'default';
            emptyCell.style.background = 'transparent';
            calendarDaysEl.appendChild(emptyCell);
        }

        // Adiciona os dias do mês
        const today = new Date();
        // Normaliza 'hoje' para o início do dia (meia-noite)
        const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); 
        
        // Calcula a data máxima selecionável (30 dias a partir de hoje)
        const maxDate = new Date(normalizedToday);
        maxDate.setDate(maxDate.getDate() + 30); // Este é o último dia que pode ser selecionado( nos foi passado que deveria ser em até 30 dias)

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.textContent = i;
            dayEl.dataset.day = i;

            const currentDate = new Date(year, month, i);

            // Verifica se o dia é passado OU se está além do limite de 30 dias
            if (currentDate < normalizedToday || currentDate > maxDate) {
                dayEl.classList.add('disabled');
                dayEl.style.color = '#ccc'; // <-- Define a cor cinza para dias não selecionáveis( qualquer alteração será possivel)
            }

            if (i === state.selectedDate.getDate() && month === state.selectedDate.getMonth() && year === state.selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }
            calendarDaysEl.appendChild(dayEl);
        }
        // --- FIM DA MODIFICAÇÃO ---

        updateInfo();
    }

    function updateInfo() {
        infoDateEl.textContent = state.selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        // infoTeacherEl.textContent = state.selectedTeacher || '--';
        infoLabEl.textContent = state.selectedLab || '--';
        infoHorarioEl.textContent = state.selectedTime || '--';
        infoKitsEl.textContent = state.selectedKit || '--';
        updateProgress();
    }

    function updateProgress() {
        let completedSteps = 0;
        if (state.selectedDate) completedSteps++;
        // if (state.selectedTeacher) completedSteps++;
        if (state.selectedLab) completedSteps++;
        if (state.selectedTime) completedSteps++;
        if (state.selectedKit) completedSteps++;

        const progressPercentage = (completedSteps / 4) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function handleSelection(container, stateKey, isSingleSelection = true) {
        container.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button) return;

            if (isSingleSelection) {
                // Remove a seleção de todos os botões no grupo
                container.querySelectorAll('button').forEach(btn => {
                    btn.classList.add('outline');
                });
                // Adiciona a seleção ao botão clicado
                button.classList.remove('outline');
                state[stateKey] = button.dataset.value;
            }
            updateInfo();
        });
    }
    // --- Event Listeners ---
    prevMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1); // Evita pular meses
        state.selectedDate.setMonth(state.selectedDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1); // Evita pular meses
        state.selectedDate.setMonth(state.selectedDate.getMonth() + 1);
        renderCalendar();
    });

    calendarDaysEl.addEventListener('click', (e) => {
        const dayEl = e.target;
        // A lógica original (verificar 'disabled') já impede o clique
        if (dayEl.dataset.day && !dayEl.classList.contains('disabled')) {
            const day = parseInt(dayEl.dataset.day, 10);
            state.selectedDate.setDate(day);
            renderCalendar();
        }
    });

    // handleSelection(teacherButtonsContainer, 'selectedTeacher');
    handleSelection(labButtonsContainer, 'selectedLab');
    handleSelection(timeSlotsContainer, 'selectedTime');
    handleSelection(kitButtonsContainer, 'selectedKit');

    // Inicialização
    renderCalendar();
});