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



    function resetSelections() {
        state.selectedLab = null;
        state.selectedLabId = null;
        state.selectedTime = null;
        state.selectedKit = null;


        // timeSlotsContainer.innerHTML = 'Selecione um laboratório...';
        // kitButtonsContainer.innerHTML = 'Selecione um horário e laboratório...';

        updateInfo();
    }



    function updateLabButtons(laboratories) {
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


    }

    function setupLabButtonListeners() {
        labButtonsContainer.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button || button.dataset.available === 'false') return;

            labButtonsContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.add('outline');
            });

            button.classList.remove('outline');
            state.selectedLab = button.dataset.value;
            state.selectedLabId = button.dataset.labId;


            state.selectedTime = null;
            state.selectedKit = null;
            kitButtonsContainer.innerHTML = 'Selecione um horário...';


            updateInfo();
            fetchHorarios();
        });
    }

    async function fetchLaboratories() {
        try {
            const date = formatDate(state.selectedDate);
            const labData = await getLaboratoryStatus(date);

            console.log('Dados dos laboratórios:', labData);
            if (labData && labData.laboratories) {
                updateLabButtons(labData.laboratories);
            }
        }
        catch (error) {
            console.error('Erro ao buscar laboratórios:', error);
            labButtonsContainer.innerHTML = 'Erro ao carregar laboratórios.';
        }
    }



    async function fetchHorarios() {
        // timeSlotsContainer.innerHTML = 'Selecione um laboratório e um kit...';
        state.selectedTime = null;
        updateInfo();

        if (!state.selectedDate || !state.selectedLabId) {
            return;
        }

        // timeSlotsContainer.innerHTML = 'Carregando horários...';
        try {
            const date = formatDate(state.selectedDate);
            const labId = state.selectedLabId;
            const hourData = await getHourStatus(date, labId);

            console.log('Dados dos horários:', hourData);
            if (hourData && hourData.hours && hourData.hours.length > 0) {
                updateHourButtons(hourData.hours);
            } else {
                // timeSlotsContainer.innerHTML = 'Nenhum horário disponível para este lab/data.';
            }
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
            // timeSlotsContainer.innerHTML = 'Erro ao carregar horários.';
        }
    }

    function updateHourButtons(horarios) {
        // timeSlotsContainer.innerHTML = '';
        const ListId = [
            '7h10', '8h00', '8h50', '9h40', '10h50', '11h40',
            '13h00', '13h50', "14h40", '15h50', '16h40', '17h30',
            '18h40', '20h58'
        ]
        for (let i=0; i < horarios.length; i++) {
            const button = document.getElementById(ListId[i])
            button.class = horarios[i].available ? 'btn outline' : 'btn outline disabled';
            button.dataset.available = horarios[i].available;
            button.dataset.value = horarios[i].hour;
            if (!horarios[i].available) {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';
            }
        }
    //     // horarios.forEach(horario => {
    //     //     const button = document.getElementById('7h10');
    //     //     button.class = horario.available ? 'btn outline' : 'btn outline disabled';
    //     //     // button.textContent = horario.hour;
    //     //     // button.dataset.value = horario.hour;
    //     //     button.dataset.available = horario.available;

    //     //     if (!horario.available) {
    //     //         button.disabled = true;
    //     //         button.style.cursor = 'not-allowed';
    //     //         button.style.opacity = '0.6';
    //     //     }
    //         // timeSlotsContainer.appendChild(button);
    //     });
    }

    //     function updateHourButtons(horarios) {
    //     // Limpa apenas os botões dentro das seções, mantendo os rótulos e estrutura
    //     document.querySelectorAll('#time-slots .buttons').forEach(div => div.innerHTML = '');

    //     horarios.forEach(horario => {
    //         // const button = document.createElement('button');
    //         // button.classList.add('btn', 'outline');
    //         // button.textContent = horario.hour;
    //         // button.dataset.value = horario.hour;
    //         // button.dataset.available = horario.available;

    //         if (!horario.available) {
    //             button.disabled = true;
    //             button.classList.add('disabled');
    //         }

    //         // Aqui, escolha o grupo de acordo com o horário
    //         const hour = horario.hour;
    //         let targetDiv;


    //         if (hour.startsWith('7') || hour.startsWith('8') || hour.startsWith('9') || hour.startsWith('10') || hour.startsWith('11')) {
    //             targetDiv = document.querySelector('#time-slots .buttons:nth-of-type(1)'); // manhã
    //         } else if (hour.startsWith('13') || hour.startsWith('14') || hour.startsWith('15') || hour.startsWith('16') || hour.startsWith('17')) {
    //             targetDiv = document.querySelector('#time-slots .buttons:nth-of-type(2)'); // tarde
    //         } else {
    //             targetDiv = document.querySelector('#time-slots .buttons:nth-of-type(3)'); // noite
    //         }

    //         if (targetDiv) targetDiv.appendChild(button);
    //     });
    // }

    // function updateHourButtons(horarios) {
    //     const groups = document.querySelectorAll('#time-slots .buttons');
    //     if (groups.length < 3) return;

    //     groups.forEach(div => div.innerHTML = '');

    //     horarios.forEach(horario => {
    //         const button = document.createElement('button');
    //         button.classList.add('btn', 'outline');
    //         button.textContent = horario.hour;
    //         button.dataset.value = horario.hour;
    //         button.dataset.available = horario.available;

    //         if (!horario.available) {
    //             button.disabled = true;
    //             button.classList.add('disabled');
    //         }

    //         const hour = horario.hour;
    //         let targetDiv = groups[2]; // padrão: noite
    //         if (/^(7|8|9|10|11)/.test(hour)) targetDiv = groups[0];
    //         else if (/^(13|14|15|16|17)/.test(hour)) targetDiv = groups[1];

    //         targetDiv.appendChild(button);
    //     });
    // }



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


            updateInfo();
            fetchKits();
        });
    }



    function updateKitButtons(kits) {
        kitButtonsContainer.innerHTML = '';
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
            kitButtonsContainer.appendChild(button);
        });
    }

    function setupKitButtonListeners() {
        kitButtonsContainer.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button || button.dataset.available === 'false') return;

            kitButtonsContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.add('outline');
            });

            button.classList.remove('outline');
            state.selectedKit = button.dataset.value;


            updateInfo();

        });
    }

    async function fetchKits() {
        kitButtonsContainer.innerHTML = 'Selecione um horário...';
        state.selectedKit = null;
        updateInfo();

        if (!state.selectedDate || !state.selectedLabId || !state.selectedTime) {
            kitButtonsContainer.innerHTML = 'Selecione um horário...';
            return;
        }

        kitButtonsContainer.innerHTML = 'Carregando kits...';
        try {
            const date = formatDate(state.selectedDate);

            const kitData = await getKitStatus(date, state.selectedTime);

            console.log('Dados dos kits:', kitData);
            if (kitData && kitData.kits && kitData.kits.length > 0) {
                updateKitButtons(kitData.kits);
            } else {
                kitButtonsContainer.innerHTML = 'Nenhum kit disponível.';
            }
        }
        catch (error) {
            console.error('Erro ao buscar kits:', error);
            kitButtonsContainer.innerHTML = 'Erro ao carregar kits.';
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

            if (currentDate < normalizedToday || currentDate > maxDate) {
                dayEl.classList.add('disabled');
                dayEl.style.color = '#ccc';
            }

            if (i === state.selectedDate.getDate() && month === state.selectedDate.getMonth() && year === state.selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }
            calendarDaysEl.appendChild(dayEl);
        }

        fetchLaboratories();
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

    prevMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1);
        state.selectedDate.setMonth(state.selectedDate.getMonth() - 1);
        resetSelections();
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        state.selectedDate.setDate(1);
        state.selectedDate.setMonth(state.selectedDate.getMonth() + 1);
        resetSelections();
        renderCalendar();
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
        }
    });

    setupLabButtonListeners();
    setupHourButtonListeners();
    setupKitButtonListeners();

    renderCalendar();
});