//CAMADA DE DADOS (DATA LAYER)
class ReservationRepository {
    constructor(storageKey = 'lab_reservations') {
        this.storageKey = storageKey;
        this.validateStorage();
    }

    validateStorage() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.error('LocalStorage não disponível:', error);
            return false;
        }
    }

    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultReservations();
        } catch (error) {
            console.error('Erro ao recuperar reservas:', error);
            return this.getDefaultReservations();
        }
    }

    save(reservations) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(reservations));
            return true;
        } catch (error) {
            console.error('Erro ao salvar reservas:', error);
            return false;
        }
    }

    getDefaultReservations() {
        const today = new Date();
        return [
            {
                id: this.generateId(),
                lab: 'lab1',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(),
                time: '08:00',
                duration: 2,
                professor: 'Prof. Silva',
                kits: 'Kit 1, Kit 2',
                disciplina: 'Física Experimental',
                turma: '3º Ano A',
                observacoes: 'Necessita de tomadas extras'
            },
            {
                id: this.generateId(),
                lab: 'lab2',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(),
                time: '10:30',
                duration: 1,
                professor: 'Prof. Oliveira',
                kits: 'Kit 3',
                disciplina: 'Química Analítica',
                turma: '2º Ano B',
                observacoes: 'Material frágil'
            }
        ];
    }

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

//CAMADA DE LÓGICA DE NEGÓCIO (BUSINESS LOGIC)
class ReservationValidator {
    static validateReservation(reservation) {
        const errors = [];

        if (!reservation.professor || reservation.professor.trim() === '') {
            errors.push('Professor é obrigatório');
        }

        if (!reservation.time || !/^\d{2}:\d{2}$/.test(reservation.time)) {
            errors.push('Horário inválido');
        }

        if (!reservation.duration || reservation.duration < 1 || reservation.duration > 6) {
            errors.push('Duração deve estar entre 1 e 6 aulas');
        }

        if (!reservation.lab || !['lab1', 'lab2', 'lab3'].includes(reservation.lab)) {
            errors.push('Laboratório inválido');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

class ReservationService {
    constructor(repository) {
        this.repository = repository;
        this.reservations = this.repository.getAll();
    }

    hasTimeConflict(newReservation, excludeId = null) {
        return this.reservations.some(reservation => {
            if (excludeId && reservation.id === excludeId) return false;
            if (reservation.lab !== newReservation.lab) return false;

            const newDateStr = new Date(newReservation.date).toISOString().split('T')[0];
            const existingDateStr = new Date(reservation.date).toISOString().split('T')[0];
            if (newDateStr !== existingDateStr) return false;

            const newStart = this.timeToMinutes(newReservation.time);
            const newEnd = newStart + (newReservation.duration * 50);
            const existingStart = this.timeToMinutes(reservation.time);
            const existingEnd = existingStart + (reservation.duration * 50);

            return newStart < existingEnd && newEnd > existingStart;
        });
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    create(reservationData) {
        const validation = ReservationValidator.validateReservation(reservationData);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        if (this.hasTimeConflict(reservationData)) {
            return { success: false, errors: ['Conflito de horário detectado'] };
        }

        const newReservation = {
            id: this.repository.generateId(),
            createdAt: new Date().toISOString(),
            ...reservationData
        };

        this.reservations.push(newReservation);

        if (this.repository.save(this.reservations)) {
            return { success: true, data: newReservation };
        }

        return { success: false, errors: ['Erro ao salvar reserva'] };
    }

    getById(id) {
        return this.reservations.find(r => r.id === id);
    }

    getByDateAndLabs(date, labs = ['lab1', 'lab2', 'lab3']) {
        const dateStr = new Date(date).toISOString().split('T')[0];
        return this.reservations.filter(r => {
            const resDateStr = new Date(r.date).toISOString().split('T')[0];
            return resDateStr === dateStr && labs.includes(r.lab);
        });
    }

    hasReservationsOnDate(date, labs = ['lab1', 'lab2', 'lab3']) {
        return this.getByDateAndLabs(date, labs).length > 0;
    }

    update(id, updates) {
        const reservationIndex = this.reservations.findIndex(r => r.id === id);
        if (reservationIndex === -1) {
            return { success: false, errors: ['Reserva não encontrada'] };
        }

        const updatedReservation = {
            ...this.reservations[reservationIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        const validation = ReservationValidator.validateReservation(updatedReservation);
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        if (this.hasTimeConflict(updatedReservation, id)) {
            return { success: false, errors: ['Conflito de horário detectado'] };
        }

        this.reservations[reservationIndex] = updatedReservation;

        if (this.repository.save(this.reservations)) {
            return { success: true, data: updatedReservation };
        }

        return { success: false, errors: ['Erro ao atualizar reserva'] };
    }

    delete(id) {
        const initialLength = this.reservations.length;
        this.reservations = this.reservations.filter(r => r.id !== id);

        if (this.reservations.length < initialLength) {
            if (this.repository.save(this.reservations)) {
                return { success: true };
            }
        }

        return { success: false, errors: ['Erro ao deletar reserva'] };
    }

    getTimeSlots() {
        return [
            '07:10', '08:00', '08:50', '09:40', '10:30', '11:20',
            '12:10', '13:00', '13:50', '14:40', '15:30', '16:20',
            '17:10', '18:00', '18:50'
        ];
    }
}


//CAMADA DE APRESENTAÇÃO (UI LAYER)
class UIController {
    constructor() {
        const today = new Date();
        this.currentDate = new Date(today);
        this.selectedDate = new Date(today);
        this.selectedLabs = ['lab1', 'lab2', 'lab3'];
        
        this.monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        this.dayNames = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];
        this.labNames = {
            'lab1': 'Laboratório 01',
            'lab2': 'Laboratório 02',
            'lab3': 'Laboratório 03'
        };
    }

    getLabName(labCode) {
        return this.labNames[labCode] || 'Laboratório Desconhecido';
    }

    getMonthYearString(date) {
        return `${this.monthNames[date.getMonth()]} de ${date.getFullYear()}`;
    }

    getDayName(date) {
        return this.dayNames[date.getDay()];
    }

    /**VERIFICA SE DIA JÁ PASSOU */
    isDateInPast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    }

    isValidDate(date) {
        return !this.isDateInPast(date);
    }

    showNotification(message, type = 'info') {
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showErrorMessages(errors) {
        errors.forEach(error => this.showNotification(error, 'error'));
    }
}

//CONTROLADOR PRINCIPAL (MAIN CONTROLLER)
class ReservationController {
    constructor() {
        this.repository = new ReservationRepository();
        this.service = new ReservationService(this.repository);
        this.ui = new UIController();
        this.currentReservationId = null;
        this.init();
    }

    init() {
        this.injectStyles();
        this.setupEventListeners();
        this.render();
        console.log('Sistema inicializado - v3.0');
        console.log('Dias passados bloqueados');
        console.log('Navegação por agenda ativa');
        console.log('Navegação livre entre meses');
    }

    render() {
        this.renderCalendar();
        this.renderAgenda();
        this.renderFilters();
        this.clearForm();
    }

    /**RENDERIZA CALENDÁRIO COM DIAS PASSADOS BLOQUEADOS */
    renderCalendar() {
        const calendarGrid = document.getElementById('calendar');
        const monthYearSpan = document.querySelector('.calendar-header span:nth-child(2)');

        if (!calendarGrid || !monthYearSpan) return;

        monthYearSpan.textContent = this.ui.getMonthYearString(this.ui.currentDate);

        //Limpa dias antigos (mantém os 7 nomes da semana)
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        const firstDay = new Date(
            this.ui.currentDate.getFullYear(),
            this.ui.currentDate.getMonth(),
            1
        ).getDay();

        const daysInMonth = new Date(
            this.ui.currentDate.getFullYear(),
            this.ui.currentDate.getMonth() + 1,
            0
        ).getDate();

        //Espaços vazios antes do primeiro dia
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.backgroundColor = 'transparent';
            emptyDiv.style.cursor = 'default';
            calendarGrid.appendChild(emptyDiv);
        }

        //Gera todos os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;

            const dayDate = new Date(
                this.ui.currentDate.getFullYear(),
                this.ui.currentDate.getMonth(),
                day
            );

            //BLOQUEIA DIAS QUE JÁ PASSARAM 
            if (this.ui.isDateInPast(dayDate)) {
                dayDiv.classList.add('past-day');
                dayDiv.style.cursor = 'not-allowed';
                dayDiv.style.pointerEvents = 'none';
                dayDiv.style.opacity = '0.5';
                dayDiv.style.color = '#999';
            } else {
                dayDiv.style.cursor = 'pointer';
                dayDiv.style.pointerEvents = 'auto';

                const hasReservations = this.service.hasReservationsOnDate(dayDate, this.ui.selectedLabs);
                if (hasReservations) {
                    dayDiv.classList.add('has-reservations');
                }

                if (day === this.ui.selectedDate.getDate() &&
                    this.ui.currentDate.getMonth() === this.ui.selectedDate.getMonth() &&
                    this.ui.currentDate.getFullYear() === this.ui.selectedDate.getFullYear()) {
                    dayDiv.classList.add('selected');
                }
            }

            calendarGrid.appendChild(dayDiv);
        }
    }

    renderAgenda() {
        const agendaBody = document.getElementById('agendaBody');
        const agendaDay = document.querySelector('.agenda-header h4');
        const agendaDate = document.querySelector('.agenda-date');

        if (!agendaBody || !agendaDay || !agendaDate) return;

        agendaDay.textContent = this.ui.getDayName(this.ui.selectedDate);
        agendaDate.textContent = `${this.ui.selectedDate.getDate()} de ${this.ui.getMonthYearString(this.ui.selectedDate).split(' de ')[0]}`;

        agendaBody.innerHTML = '';

        const timeSlots = this.service.getTimeSlots();
        const reservationsForDay = this.service.getByDateAndLabs(this.ui.selectedDate, this.ui.selectedLabs);

        timeSlots.forEach(time => {
            const hourElement = document.createElement('div');
            hourElement.className = 'hour';

            const timeSpan = document.createElement('span');
            timeSpan.textContent = time;
            hourElement.appendChild(timeSpan);

            const reservationsAtTime = reservationsForDay.filter(r => r.time === time);

            if (reservationsAtTime.length > 0) {
                reservationsAtTime.forEach(reservation => {
                    const eventElement = this.createEventElement(reservation);
                    hourElement.appendChild(eventElement);
                });
            } else if (this.ui.isValidDate(this.ui.selectedDate)) {
                hourElement.style.cursor = 'pointer';
                hourElement.addEventListener('click', () => this.showNewReservationForm(time));
            }

            agendaBody.appendChild(hourElement);
        });
    }

    createEventElement(reservation) {
        const element = document.createElement('div');
        element.className = `event ${reservation.lab}`;
        element.style.height = `${reservation.duration * 50}px`;
        element.innerHTML = `
            <strong>${reservation.professor}</strong>
            <span>${this.ui.getLabName(reservation.lab)}</span>
        `;

        element.style.cursor = 'pointer';
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showReservationForm(reservation);
        });
        
        element.addEventListener('mouseenter', (e) => this.showTooltip(reservation, e.target));
        element.addEventListener('mouseleave', (e) => this.hideTooltip(e.target));

        return element;
    }

    showTooltip(reservation, element) {
        this.hideTooltip(element);

        const tooltip = document.createElement('div');
        tooltip.className = 'reservation-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${reservation.disciplina}</h4>
                <p><strong>Professor:</strong> ${reservation.professor}</p>
                <p><strong>Turma:</strong> ${reservation.turma}</p>
                <p><strong>Horário:</strong> ${reservation.time} (${reservation.duration} aula${reservation.duration > 1 ? 's' : ''})</p>
                <p><strong>Kits:</strong> ${reservation.kits}</p>
                <p><strong>Lab:</strong> ${this.ui.getLabName(reservation.lab)}</p>
                ${reservation.observacoes ? `<p><strong>Observações:</strong> ${reservation.observacoes}</p>` : ''}
            </div>
        `;

        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.zIndex = '10000';

        document.body.appendChild(tooltip);
        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            element._tooltip = null;
        }
    }

    renderFilters() {
        const checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const labClass = Array.from(checkbox.nextElementSibling.classList).find(cls => cls.startsWith('lab'));
            checkbox.checked = this.ui.selectedLabs.includes(labClass);
        });
    }

    handleFilterChange = (e) => {
        const labClass = Array.from(e.target.nextElementSibling.classList).find(cls => cls.startsWith('lab'));

        if (e.target.checked) {
            if (!this.ui.selectedLabs.includes(labClass)) {
                this.ui.selectedLabs.push(labClass);
            }
        } else {
            this.ui.selectedLabs = this.ui.selectedLabs.filter(lab => lab !== labClass);
        }

        this.renderCalendar();
        this.renderAgenda();
    }

    showNewReservationForm(time) {
        const form = document.querySelector('.info');
        if (!form) return;

        this.currentReservationId = null;

        form.querySelector('p:nth-child(2) span').textContent = '–';
        form.querySelector('p:nth-child(3) span').textContent = time;
        form.querySelector('p:nth-child(4) span').textContent = 
            this.ui.selectedLabs.length === 1 ? 
            this.ui.getLabName(this.ui.selectedLabs[0]) : 
            'Selecione um laboratório';
        form.querySelector('p:nth-child(5) span').textContent = '–';
        form.querySelector('textarea').value = '';

        const button = form.querySelector('button');
        button.textContent = 'Criar Reserva';
        button.onclick = () => this.createReservation(time);
    }

    showReservationForm(reservation) {
        const form = document.querySelector('.info');
        if (!form) return;

        this.currentReservationId = reservation.id;

        form.querySelector('p:nth-child(2) span').textContent = reservation.professor;
        form.querySelector('p:nth-child(3) span').textContent = `${reservation.time} (${reservation.duration} aula${reservation.duration > 1 ? 's' : ''})`;
        form.querySelector('p:nth-child(4) span').textContent = this.ui.getLabName(reservation.lab);
        form.querySelector('p:nth-child(5) span').textContent = reservation.kits;
        form.querySelector('textarea').value = reservation.observacoes || '';

        const button = form.querySelector('button');
        button.textContent = 'Atualizar';
        button.onclick = () => this.updateReservation(reservation.id);
    }

    clearForm() {
        const form = document.querySelector('.info');
        if (!form) return;

        this.currentReservationId = null;

        form.querySelector('p:nth-child(2) span').textContent = '–';
        form.querySelector('p:nth-child(3) span').textContent = '–';
        form.querySelector('p:nth-child(4) span').textContent = '–';
        form.querySelector('p:nth-child(5) span').textContent = '–';
        form.querySelector('textarea').value = '';

        const button = form.querySelector('button');
        button.textContent = 'Atribuir';
        button.onclick = null;
    }

    createReservation(time) {
        const professor = prompt('Nome do professor:');
        if (!professor) return;

        const durationStr = prompt('Duração (em aulas de 50min):');
        const duration = parseInt(durationStr) || 1;

        const kits = prompt('Kits necessários:') || '–';
        const observacoes = document.querySelector('.info textarea').value;

        const labToUse = this.ui.selectedLabs.length === 1 ? 
            this.ui.selectedLabs[0] : 
            prompt('Qual laboratório? (lab1, lab2, lab3):');

        const result = this.service.create({
            lab: labToUse,
            date: this.ui.selectedDate.toISOString(),
            time: time,
            duration: duration,
            professor: professor,
            kits: kits,
            disciplina: prompt('Disciplina:') || 'A definir',
            turma: prompt('Turma:') || 'A definir',
            observacoes: observacoes
        });

        if (result.success) {
            this.ui.showNotification('✅ Reserva criada com sucesso!', 'success');
            this.render();
        } else {
            this.ui.showErrorMessages(result.errors);
        }
    }

    updateReservation(id) {
        const observacoes = document.querySelector('.info textarea').value;

        const result = this.service.update(id, {
            observacoes: observacoes
        });

        if (result.success) {
            this.ui.showNotification('✅ Reserva atualizada!', 'success');
            this.render();
        } else {
            this.ui.showErrorMessages(result.errors);
        }
    }

    /*CONFIGURA LISTENERS DE EVENTOS*/
    setupEventListeners() {
        // Menu Mobile
        const menuToggle = document.querySelector('.menu-toggle');
        const navbar = document.querySelector('.sidebar');

        if (menuToggle && navbar) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navbar.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && !menuToggle.contains(e.target) && navbar.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navbar.classList.remove('active');
                }
            });
        }

        // NAVEGAÇÃO DO CALENDÁRIO 
        const calendarHeader = document.querySelector('.calendar-header');
        if (calendarHeader) {
            const prevBtn = calendarHeader.querySelector('span:first-child');
            const nextBtn = calendarHeader.querySelector('span:last-child');

            prevBtn?.addEventListener('click', () => {
                this.ui.currentDate.setMonth(this.ui.currentDate.getMonth() - 1);
                this.renderCalendar();
            });

            nextBtn?.addEventListener('click', () => {
                this.ui.currentDate.setMonth(this.ui.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }

        // Seleção de Dias no Calendário
        const calendarGrid = document.getElementById('calendar');
        calendarGrid?.addEventListener('click', (e) => {
            const dayNumber = parseInt(e.target.textContent);
            if (!dayNumber || e.target.classList.contains('past-day')) return;

            this.ui.selectedDate = new Date(
                this.ui.currentDate.getFullYear(),
                this.ui.currentDate.getMonth(),
                dayNumber
            );

            this.renderCalendar();
            this.renderAgenda();
            this.clearForm();
        });

        //NAVEGAÇÃO DA AGENDA 
        const prevDayBtn = document.querySelector('.prev');
        const nextDayBtn = document.querySelector('.next');
        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const prevDate = new Date(this.ui.selectedDate.getTime() - 86400000);
                if (this.ui.isValidDate(prevDate)) {
                    this.ui.selectedDate = new Date(prevDate);
                    this.ui.currentDate = new Date(prevDate);
                    this.render();
                } else {
                    this.ui.showNotification('⚠️ Não é possível selecionar dias passados', 'warning');
                }
            });
        }

        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const nextDate = new Date(this.ui.selectedDate.getTime() + 86400000);
                this.ui.selectedDate = new Date(nextDate);
                this.ui.currentDate = new Date(nextDate);
                this.render();
            });
        }

        // Filtros de Laboratório
        const filters = document.querySelectorAll('.filters input[type="checkbox"]');
        filters.forEach(filter => {
            filter.addEventListener('change', this.handleFilterChange);
        });

        // Menu de Navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.querySelector('span').textContent;
                this.handleNavigation(action);
            });
        });
    }

    handleNavigation(action) {
        switch (action) {
            case 'RESERVAS':
                break;
            case 'AGENDAMENTO':
                break;
            case 'KITS':
                break;
        }
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }

            .past-day {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                color: #999 !important;
            }

            .has-reservations::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background: #8a1d1b;
                border-radius: 50%;
            }

            .reservation-tooltip {
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                max-width: 320px;
                font-size: 0.9em;
            }

            .tooltip-content h4 {
                margin: 0 0 10px 0;
                color: #0d4043;
                font-size: 1.1em;
                border-bottom: 2px solid #8a1d1b;
                padding-bottom: 8px;
            }

            .tooltip-content p {
                margin: 6px 0;
                line-height: 1.5;
                color: #333;
            }

            .calendar-header span:first-child,
            .calendar-header span:last-child {
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
                padding: 5px;
            }

            .calendar-header span:first-child:hover,
            .calendar-header span:last-child:hover {
                opacity: 0.7;
                transform: scale(1.1);
            }

            .agenda-header div:last-child span {
                cursor: pointer !important;
                user-select: none;
                transition: all 0.2s ease;
                padding: 5px 10px;
                display: inline-block;
            }

            .agenda-header div:last-child span:hover {
                opacity: 0.7;
                transform: scale(1.2);
                background: #f0f0f0;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }
}

//INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.reservationController = new ReservationController();
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema:', error);
    }
});