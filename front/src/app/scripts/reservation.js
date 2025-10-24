document.addEventListener('DOMContentLoaded', function () {
    // Estado da aplicação
    const state = {
        selectedDate: new Date(),
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
    const infoLabEl = document.getElementById('info-lab');
    const infoHorarioEl = document.getElementById('info-horario');
    const infoKitsEl = document.getElementById('info-kits');

    const labButtonsContainer = document.getElementById('lab-buttons');
    const timeSlotsContainer = document.getElementById('time-slots');
    const kitButtonsContainer = document.getElementById('kit-buttons');
    const progressBar = document.getElementById('progress-bar');

    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

   
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function updateLabButtons(laboratories) {
        const labButtonsContainer = document.getElementById('lab-buttons');
        
       
        labButtonsContainer.innerHTML = '';
        
        
        laboratories.forEach(lab => {
            const button = document.createElement('button');
            button.className = lab.available ? 'btn outline' : 'btn outline disabled';
            button.textContent = lab.laboratory;
            button.dataset.value = lab.laboratory;
            button.dataset.labId = lab.laboratoryId;
            button.dataset.available = lab.available;
            
            
            if (!lab.available) {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';
            }
            
            labButtonsContainer.appendChild(button);
        });
        
        
        setupLabButtonListeners();
    }

    
    function setupLabButtonListeners() {
        const labButtonsContainer = document.getElementById('lab-buttons');
        
        labButtonsContainer.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button) return;
            
            
            if (button.dataset.available === 'false') {
                return; 
            }
            
            
            labButtonsContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.add('outline');
            });
            
           
            button.classList.remove('outline');
            state.selectedLab = button.dataset.value;
            
            updateInfo();
        });
    }

    async function getLaboratory() {
        try {
            const date = formatDate(state.selectedDate);

            const response = await axios.get(
                `http://localhost:3000/api/lab-status?date=${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                }
            );
            
            console.log('Dados dos laboratórios:', response.data);
            
            // Atualiza os botões com os dados recebidos
            if (response.data && response.data.laboratories) {
                updateLabButtons(response.data.laboratories);
            }
        }
        catch(error) {
            console.error('Erro ao buscar laboratórios:', error);
        }
    }

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
            dayEl.style.border = '2px solid #005b5f';
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
        const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); 
        
        const maxDate = new Date(normalizedToday);
        maxDate.setDate(maxDate.getDate() + 30);

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.textContent = i;
            dayEl.dataset.day = i;

            const currentDate = new Date(year, month, i);

            if (currentDate < normalizedToday || currentDate > maxDate) {
                dayEl.classList.add('disabled');
                dayEl.style.color = '#ccc';
            }

            if (i === state.selectedDate.getDate() && month === state.selectedDate.getMonth() && year === state.selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }
            calendarDaysEl.appendChild(dayEl);
        }

        // Busca os laboratórios sempre que o calendário é renderizado
        getLaboratory();
        updateInfo();
    }

    function updateInfo() {
        infoDateEl.textContent = state.selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        infoLabEl.textContent = state.selectedLab || '--';
        infoHorarioEl.textContent = state.selectedTime || '--';
        infoKitsEl.textContent = state.selectedKit || '--';
        updateProgress();
    }

    function updateProgress() {
        let completedSteps = 0;
        if (state.selectedDate) completedSteps++;
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
                container.querySelectorAll('button').forEach(btn => {
                    btn.classList.add('outline');
                });
                button.classList.remove('outline');
                state[stateKey] = button.dataset.value;
            }
            updateInfo();
        });
    }

    // --- Event Listeners ---
    prevMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1);
        state.selectedDate.setMonth(state.selectedDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1);
        state.selectedDate.setMonth(state.selectedDate.getMonth() + 1);
        renderCalendar();
    });

    calendarDaysEl.addEventListener('click', (e) => {
        const dayEl = e.target;
        if (dayEl.dataset.day && !dayEl.classList.contains('disabled')) {
            const day = parseInt(dayEl.dataset.day, 10);
            state.selectedDate.setDate(day);
            renderCalendar();
        }
    });

    // Configura os event listeners
    handleSelection(timeSlotsContainer, 'selectedTime');
    handleSelection(kitButtonsContainer, 'selectedKit');

    // Inicialização
    renderCalendar();
});