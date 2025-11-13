document.addEventListener('DOMContentLoaded', function () {

    const state = {
        selectedDate: new Date(),
        selectedLab: null,
        selectedLabId: null,
        selectedTime: null,
        selectedKit: null,
    };

    
    const monthYearEl = document.getElementById('month-year');
    const calendarDaysEl = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // Seletores da Info-Box (os spans internos)
    const infoDateEl = document.getElementById('info-data');
    const infoLabEl = document.getElementById('info-lab');
    const infoHorarioEl = document.getElementById('info-horario');
    const infoKitsEl = document.getElementById('info-kits');
    
    // 💡 NOVO: Seletor do container principal da Info-Box
    const infoBoxContainer = document.getElementById('info-box-container'); 
    
    const labSection = document.getElementById('lab-buttons'); 
    const timeSlotsContainer = document.getElementById('time-slots');
    const kitSection = document.getElementById('kit-buttons'); 
    
    
    const labButtonsInner = labSection.querySelector('.buttons');
    const kitButtonsInner = kitSection.querySelector('.buttons');
    
    const progressBar = document.getElementById('progress-bar');
    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    
    function toggleVisibility(container, show) {
        if (!container) return;
        if (show) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    function resetSelections() {
        state.selectedLab = null;
        state.selectedLabId = null;
        state.selectedTime = null;
        state.selectedKit = null;

        
        toggleVisibility(labSection, false); 
        toggleVisibility(timeSlotsContainer, false);
        toggleVisibility(kitSection, false);

        // 💡 NOVO: Esconde a Info-Box sempre que as seleções são resetadas
        toggleVisibility(infoBoxContainer, false);

        updateInfo();
    }


    function updateLabButtons(laboratories) {
        // ... (código existente sem alteração) ...
        labButtonsInner.innerHTML = ''; 
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
            labButtonsInner.appendChild(button);
        });
    }

    function setupLabButtonListeners() {
        
        labButtonsInner.addEventListener('click', e => { 
            const button = e.target.closest('button');
            if (!button || button.dataset.available === 'false') return;

            labButtonsInner.querySelectorAll('button').forEach(btn => {
                btn.classList.add('outline');
            });

            button.classList.remove('outline');
            state.selectedLab = button.dataset.value;
            state.selectedLabId = button.dataset.labId;


            state.selectedTime = null;
            state.selectedKit = null;
            
            toggleVisibility(kitSection, false); 
            // 💡 NOVO: Esconde a Info-Box se Lab for re-selecionado (ou seja, falta o Kit)
            toggleVisibility(infoBoxContainer, false);

            updateInfo();
            fetchHorarios();
        });
    }

    async function fetchLaboratories() {
        // ... (código existente sem alteração) ...
        toggleVisibility(timeSlotsContainer, false); 
        toggleVisibility(kitSection, false); 
        toggleVisibility(infoBoxContainer, false); // Garante que é escondido no fetch
        
        try {
            const date = formatDate(state.selectedDate);
            const labData = await getLaboratoryStatus(date);

            console.log('Dados dos laboratórios:', labData);
            if (labData && labData.laboratories) {
                updateLabButtons(labData.laboratories);
                
                
                toggleVisibility(labSection, true); 
            }
        }
        catch (error) {
            console.error('Erro ao buscar laboratórios:', error);
            labButtonsInner.innerHTML = 'Erro ao carregar laboratórios.';
            // Opcional: Mostrar o container para exibir a mensagem de erro
            toggleVisibility(labSection, true); 
        }
    }


    async function fetchHorarios() {
        state.selectedTime = null;
        updateInfo();
        
        
        toggleVisibility(kitSection, false);
        toggleVisibility(infoBoxContainer, false); // Garante que é escondido
        
        if (!state.selectedDate || !state.selectedLabId) {
            return;
        }
        // ... (restante do fetchHorarios) ...
        try {
            const date = formatDate(state.selectedDate);
            const labId = state.selectedLabId;
            const hourData = await getHourStatus(date, labId);

            console.log('Dados dos horários:', hourData);
            if (hourData && hourData.hours && hourData.hours.length > 0) {
                updateHourButtons(hourData.hours);

                toggleVisibility(timeSlotsContainer, true); 
            } else {
                
            }
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
            
        }
    }

    function updateHourButtons(horarios) {
        // ... (código existente sem alteração) ...
        const hourToIdMap = {
            '7:10': '7h10', '8:00': '8h00', '8:50': '8h50', '10:00': '9h40', '10:50': '10h50', '11:40': '11h40',
            '13:00': '13h00', '13:50': '13h50', "14:40": '14h40', '15:50': '15h50', '16:40': '16h40', '17:30': '17h30',
            '18:50': '18h50', '20:58': '20h58'
        };

        
        for (const [jsonHour, id] of Object.entries(hourToIdMap)) {
            const button = document.getElementById(id);
            if (!button) continue;

            const horarioData = horarios.find(h => h.hour === jsonHour);
            const isAvailable = horarioData ? horarioData.available : false;

            button.dataset.available = isAvailable;
            button.dataset.value = horarioData ? horarioData.hour : ''; 
            
            
            if (!isAvailable) {
                // DESABILITADO
                button.className = 'btn outline disabled'; 
                button.disabled = true;
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';
            } else {
                // HABILITADO
                button.className = 'btn outline'; 
                button.disabled = false;
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
            }
        }
    }


    function setupHourButtonListeners() {
        timeSlotsContainer.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button || button.dataset.available === 'false') return;

            timeSlotsContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.add('outline');
            });

            button.classList.remove('outline');
            state.selectedTime = button.dataset.value;


            state.selectedKit = null;

            // 💡 NOVO: Esconde a Info-Box se Horário for re-selecionado (falta o Kit)
            toggleVisibility(infoBoxContainer, false); 

            updateInfo();
            fetchKits();
        });
    }


    function updateKitButtons(kits) {
        // ... (código existente sem alteração) ...
        kitButtonsInner.innerHTML = '';
        kits.forEach(kit => {
            const button = document.createElement('button');

            button.className = kit.available ? 'btn outline' : 'btn outline disabled';
            button.textContent = kit.kit.name;
            button.dataset.value = kit.kit.name;
            button.dataset.kitId = kit.kit.id;
            button.dataset.available = kit.available;

            if (!kit.available) {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';
            }
            kitButtonsInner.appendChild(button);
        });
    }

    function setupKitButtonListeners() {
        kitButtonsInner.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button || button.dataset.available === 'false') return;

            kitButtonsInner.querySelectorAll('button').forEach(btn => {
                btn.classList.add('outline');
            });

            button.classList.remove('outline');
            state.selectedKit = button.dataset.value;


            updateInfo();
            // 💡 NOVO: O updateInfo() agora cuidará de mostrar a Info-Box
        });
    }

    async function fetchKits() {
        // ... (código existente sem alteração) ...
        state.selectedKit = null;
        updateInfo();

        if (!state.selectedDate || !state.selectedLabId || !state.selectedTime) {
            kitButtonsInner.innerHTML = 'Selecione um horário...';
            return;
        }

        kitButtonsInner.innerHTML = 'Carregando kits...';
        try {
            const date = formatDate(state.selectedDate);

            const kitData = await getKitStatus(date, state.selectedTime);

            console.log('Dados dos kits:', kitData);
            if (kitData && kitData.kits && kitData.kits.length > 0) {
                updateKitButtons(kitData.kits);
                toggleVisibility(kitSection, true); 
            } else {
                kitButtonsInner.innerHTML = 'Nenhum kit disponível.';
            }
        }
        catch (error) {
            console.error('Erro ao buscar kits:', error);
            kitButtonsInner.innerHTML = 'Erro ao carregar kits.';
        }
    }

    function renderCalendar() {
        // ... (código existente sem alteração) ...
        calendarDaysEl.innerHTML = '';
        const date = new Date(state.selectedDate);
        
        const month = date.getMonth();
        const year = date.getFullYear();

        monthYearEl.textContent = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        weekdays.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.classList.add('weekday');
            dayEl.textContent = day;
            dayEl.style.border = '2px solid #005b5f';
            calendarDaysEl.appendChild(dayEl);
        });

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.style.cursor = 'default';
            emptyCell.style.background = 'transparent';
            calendarDaysEl.appendChild(emptyCell);
        }


        const today = new Date();
        const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const maxDate = new Date(normalizedToday);
        maxDate.setDate(maxDate.getDate() + 30);

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.textContent = i;
            dayEl.dataset.day = i;
            const currentDate = new Date(year, month, i);

            if (currentDate < normalizedToday || currentDate > maxDate || currentDate.getDay() === 0) {
                dayEl.classList.add('disabled');
                dayEl.style.color = '#ccc';
            }

            if (i === state.selectedDate.getDate() && month === state.selectedDate.getMonth() && year === state.selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }
            calendarDaysEl.appendChild(dayEl);
        }
        
        updateInfo();
    }

    function updateInfo() {
        infoDateEl.textContent = state.selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        infoLabEl.textContent = state.selectedLab || '--';
        infoHorarioEl.textContent = state.selectedTime || '--';
        infoKitsEl.textContent = state.selectedKit || '--';
        
        const allSelected = state.selectedDate && state.selectedLab && state.selectedTime && state.selectedKit;
        toggleVisibility(infoBoxContainer, allSelected);

        updateProgress();
    }

    function updateProgress() {
        let completedSteps = 0;
        if (state.selectedLab) completedSteps++; 
        if (state.selectedTime) completedSteps++;
        if (state.selectedKit) completedSteps++;
        

        const totalSteps = 4; // Data + Lab + Horário + Kit
        let stepsCompleted = state.selectedLab ? 2 : 1; // 1 (Data) + 1 (Lab)
        if (state.selectedTime) stepsCompleted++;
        if (state.selectedKit) stepsCompleted++;
        
        
        let finalSteps = 0;
        if (state.selectedDate) finalSteps++;
        if (state.selectedLab) finalSteps++;
        if (state.selectedTime) finalSteps++;
        if (state.selectedKit) finalSteps++;

        const progressPercentage = (finalSteps / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    
    prevMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1);
        state.selectedDate.setMonth(state.selectedDate.getMonth() - 1);
        resetSelections();
        renderCalendar();
        fetchLaboratories(); 
    });

    
    nextMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1);
        state.selectedDate.setMonth(state.selectedDate.getMonth() + 1);
        resetSelections();
        renderCalendar();
        fetchLaboratories(); 
    });

    
    calendarDaysEl.addEventListener('click', (e) => {
        const dayEl = e.target;
        if (dayEl.dataset.day && !dayEl.classList.contains('disabled')) {
            const day = parseInt(dayEl.dataset.day, 10);


            if (day === state.selectedDate.getDate()) {
                return;
            }

            state.selectedDate.setDate(day);
            resetSelections();
            renderCalendar();
            fetchLaboratories(); 
        }
    });

    setupLabButtonListeners();
    setupHourButtonListeners();
    setupKitButtonListeners();

    
    toggleVisibility(labSection, false);
    toggleVisibility(timeSlotsContainer, false);
    toggleVisibility(kitSection, false);
    toggleVisibility(infoBoxContainer, false); // Garante que a Info-Box está escondida na inicialização

    renderCalendar();
});