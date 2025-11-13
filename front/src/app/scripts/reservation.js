document.addEventListener('DOMContentLoaded', function () {

    console.log('=== DEBUG COMPLETO RESERVATION ===');
    console.log('LocalStorage completo:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`"${key}":`, localStorage.getItem(key));
    }

    console.log('Axios disponível:', typeof axios !== 'undefined');
    console.log('URL da API:', 'http://localhost:3000/api/reservation');

    const user = localStorage.getItem('user');
    console.log('Usuário no localStorage:', user);
    if (user) {
        try {
            const userObj = JSON.parse(user);
            console.log('Objeto usuário:', userObj);
            console.log('Role do usuário:', userObj.role);
        } catch (e) {
            console.log('Erro ao parsear usuário:', e);
        }
    }
    console.log('=== FIM DEBUG ===');

    const state = {
        selectedDate: new Date(),
        selectedLab: null,
        selectedLabId: null,
        selectedTime: null,
        selectedKit: null,
        selectedKitName: null,
    };

    const monthYearEl = document.getElementById('month-year');
    const calendarDaysEl = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const infoDateEl = document.getElementById('info-data');
    const infoLabEl = document.getElementById('info-lab');
    const infoHorarioEl = document.getElementById('info-horario');
    const infoKitsEl = document.getElementById('info-kits');
    
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
        state.selectedKitName = null; 

        toggleVisibility(labSection, false); 
        toggleVisibility(timeSlotsContainer, false);
        toggleVisibility(kitSection, false);
        toggleVisibility(infoBoxContainer, false);

        updateInfo();
    }

    function updateLabButtons(laboratories) {
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
            toggleVisibility(infoBoxContainer, false);

            updateInfo();
            fetchHorarios();
        });
    }

    async function fetchLaboratories() {
        toggleVisibility(timeSlotsContainer, false); 
        toggleVisibility(kitSection, false); 
        toggleVisibility(infoBoxContainer, false);
        
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
            toggleVisibility(labSection, true); 
        }
    }

    async function fetchHorarios() {
        state.selectedTime = null;
        updateInfo();
        
        toggleVisibility(kitSection, false);
        toggleVisibility(infoBoxContainer, false);
        
        if (!state.selectedDate || !state.selectedLabId) {
            return;
        }

        try {
            const date = formatDate(state.selectedDate);
            const labId = state.selectedLabId;
            const hourData = await getHourStatus(date, labId);

            console.log('Dados dos horários:', hourData);
            if (hourData && hourData.hours && hourData.hours.length > 0) {
                updateHourButtons(hourData.hours);
                toggleVisibility(timeSlotsContainer, true); 
            }
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
        }
    }

    function updateHourButtons(horarios) {
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
                button.className = 'btn outline disabled'; 
                button.disabled = true;
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';
            } else {
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

            toggleVisibility(infoBoxContainer, false); 
            updateInfo();
            fetchKits();
        });
    }

    function updateKitButtons(kits) {
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
            state.selectedKit = button.dataset.kitId;
            state.selectedKitName = button.dataset.value;

            updateInfo();
        });
    }

    async function fetchKits() {
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

            // Esta condição já desabilita domingos (currentDate.getDay() === 0)
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

    function updateProfessorInfo() {
        const infoProfessorEl = document.getElementById('info-professor');
        const user = localStorage.getItem('user');
        
        if (user) {
            try {
                const userObj = JSON.parse(user);
                infoProfessorEl.textContent = userObj.name || '--';
            } catch (error) {
                console.error('Erro ao carregar informações do professor:', error);
                infoProfessorEl.textContent = '--';
            }
        } else {
            infoProfessorEl.textContent = '--';
        }
    }

    function updateInfo() {
        updateProfessorInfo();
        infoDateEl.textContent = state.selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });infoLabEl.textContent = state.selectedLab || '--';
        infoHorarioEl.textContent = state.selectedTime || '--';
        infoKitsEl.textContent = state.selectedKitName || '--';
        
        const allSelected = state.selectedDate && state.selectedLab && state.selectedTime && state.selectedKit;
        toggleVisibility(infoBoxContainer, allSelected);

        updateProgress();
    }

    // Esta é a função corrigida, sem o conflito de merge
    function updateProgress() {
        const totalSteps = 4;
        let finalSteps = 0;
        
        // A data está sempre selecionada para o progresso começar
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
        // Esta condição já impede o clique em dias desabilitados (como domingos)
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

    async function saveReservation() {
        console.log('=== INICIANDO saveReservation ===');
        
        if (!state.selectedDate || !state.selectedTime || !state.selectedLabId || !state.selectedKit) {
            alert('Por favor, preencha todas as informações da reserva.');
            return;
        }

        try {
            const reservationData = {
                date: formatDate(state.selectedDate),
                hour: state.selectedTime,
                labId: state.selectedLabId,
                kitId: state.selectedKit
            };

            console.log('Dados da reserva a serem enviados:', reservationData);

            let token = localStorage.getItem('token') || 
                        localStorage.getItem('authToken') ||
                        sessionStorage.getItem('token') ||
                        sessionStorage.getItem('authToken');

            console.log('Token original:', token);

            if (!token) {
                alert('Usuário não autenticado. Faça login novamente.');
                window.location.href = '../index.html';
                return;
            }

            token = token.trim().replace(/\s+/g, '').replace(/"/g, '');
            console.log('Token limpo:', token);

            if (!token || token.split('.').length !== 3) {
                console.error('Token mal formatado:', token);
                alert('Token de autenticação inválido. Faça login novamente.');
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                window.location.href = '../index.html';
                return;
            }

            console.log('Enviando requisição para API...');
            const response = await axios.post('http://localhost:3000/api/reservation', reservationData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 10000
            });

            console.log('Resposta da API:', response);

            if (response.status === 200 || response.status === 201) {
                alert('Reserva realizada com sucesso!');
                resetSelections();
                renderCalendar();
            } else {
                alert('Erro ao realizar reserva. Tente novamente.');
            }

        } catch (error) {
            console.error('Erro detalhado ao salvar reserva:', error);
            
            if (error.response) {
                console.log('Status do erro:', error.response.status);
                console.log('Dados do erro:', error.response.data);
                
                if (error.response.status === 401) {
                    alert('Token inválido ou expirado. Faça login novamente.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('authToken');
                    window.location.href = '../index.html';
                } else if (error.response.status === 400) {
                    alert('Dados inválidos: ' + (error.response.data.message || 'Verifique as informações.'));
                } else if (error.response.status === 403) {
                    alert('Acesso negado. Você não tem permissão para fazer esta reserva.');
                } else {
                    alert(`Erro do servidor: ${error.response.status}`);
                }
            } else if (error.request) {
                console.log('Não houve resposta do servidor');
                alert('Servidor não respondeu. Verifique sua conexão.');
            } else {
                console.log('Erro de configuração:', error.message);
                alert('Erro ao configurar a requisição.');
            }
        }
    }
    
    document.querySelector('.concluir-btn').addEventListener('click', saveReservation);
    updateProfessorInfo();
    setupLabButtonListeners();
    setupHourButtonListeners();
    setupKitButtonListeners();

    toggleVisibility(labSection, false);
    toggleVisibility(timeSlotsContainer, false);
    toggleVisibility(kitSection, false);
    toggleVisibility(infoBoxContainer, false);

    renderCalendar();
});