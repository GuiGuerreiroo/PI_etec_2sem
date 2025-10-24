//CAMADA DE DADOS (DATA LAYER)
class ReservationRepository {
    constructor(storageKey = 'lab_reservations') {
        this.storageKey = storageKey;
        this.userKey = 'current_user';
    }

    getCurrentUser() {
        try {
            const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erro ao recuperar usuário:', error);
            return null;
        }
    }

    isDatePast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
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

    getByUser(userId) {
        const allReservations = this.getAll();
        return allReservations.filter(r => r.userId === userId);
    }

    getDefaultReservations() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        const today = new Date();
        return [
            {
                id: '1',
                userId: currentUser.id,
                lab: 'lab1',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(),
                time: '08:00',
                duration: 2,
                professor: currentUser.name || currentUser.email,
                kits: 'Kit de Química Básica',
                disciplina: 'Química Orgânica',
                turma: '2º A',
                observacoes: 'Prática de destilação'
            },
            {
                id: '2',
                userId: currentUser.id,
                lab: 'lab2',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(),
                time: '10:30',
                duration: 1,
                professor: currentUser.name || currentUser.email,
                kits: 'Kit de Análise',
                disciplina: 'Química Analítica',
                turma: '3º B',
                observacoes: 'Titulação ácido-base'
            }
        ];
    }
}

//CAMADA DE LÓGICA DE NEGÓCIO (BUSINESS LOGIC)
class ReservationService {
    constructor(repository) {
        this.repository = repository;
        this.currentUser = this.repository.getCurrentUser();
        this.reservations = this.currentUser ? this.repository.getByUser(this.currentUser.id) : [];
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

    isDateInPast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    }
}

//CONTROLADOR PRINCIPAL (MAIN CONTROLLER)
class ReservationController {
    constructor() {
        this.repository = new ReservationRepository();
        this.service = new ReservationService(this.repository);
        this.ui = new UIController();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    render() {
        this.renderCalendar();
        this.renderAgenda();
        this.renderFilters();
        this.displayReservationInfo();
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar');
        const monthYearSpan = document.querySelector('.calendar-header span:nth-child(2)');
        if (!calendarGrid || !monthYearSpan) return;

        monthYearSpan.textContent = this.ui.getMonthYearString(this.ui.currentDate);

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

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.backgroundColor = 'transparent';
            emptyDiv.style.cursor = 'default';
            calendarGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            const dayDate = new Date(
                this.ui.currentDate.getFullYear(),
                this.ui.currentDate.getMonth(),
                day
            );

            if (this.ui.isDateInPast(dayDate)) {
                dayDiv.style.opacity = '0.5';
                dayDiv.style.color = '#999';
                dayDiv.style.cursor = 'not-allowed';
                dayDiv.style.pointerEvents = 'none';
            }

            const hasReservations = this.service.hasReservationsOnDate(dayDate, this.ui.selectedLabs);
            if (hasReservations) {
                dayDiv.classList.add('has-reservations');
            }

            if (day === this.ui.selectedDate.getDate() &&
                this.ui.currentDate.getMonth() === this.ui.selectedDate.getMonth() &&
                this.ui.currentDate.getFullYear() === this.ui.selectedDate.getFullYear()) {
                dayDiv.classList.add('selected');
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
        element.addEventListener('click', () => {
            this.displayReservationInfo(reservation);
        });

        return element;
    }

    displayReservationInfo(reservation = null) {
        const form = document.querySelector('.info');
        if (!form) return;

        if (reservation) {
            form.querySelector('p:nth-child(2) span').textContent = reservation.professor;
            form.querySelector('p:nth-child(3) span').textContent = `${reservation.time} (${reservation.duration} aula${reservation.duration > 1 ? 's' : ''})`;
            form.querySelector('p:nth-child(4) span').textContent = this.ui.getLabName(reservation.lab);
            form.querySelector('p:nth-child(5) span').textContent = reservation.kits;
            form.querySelector('textarea').value = reservation.observacoes || '';
        } else {
            form.querySelector('p:nth-child(2) span').textContent = '–';
            form.querySelector('p:nth-child(3) span').textContent = '–';
            form.querySelector('p:nth-child(4) span').textContent = '–';
            form.querySelector('p:nth-child(5) span').textContent = '–';
            form.querySelector('textarea').value = '';
        }

        const button = form.querySelector('button');
        if (button) button.style.display = 'none';
    }

    renderFilters() {
        const checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const labClass = Array.from(checkbox.nextElementSibling.classList).find(cls => cls.startsWith('lab'));
            checkbox.checked = this.ui.selectedLabs.includes(labClass);
        });
    }

    setupEventListeners() {
        const calendarHeader = document.querySelector('.calendar-header');
        if (calendarHeader) {
            const prevBtn = calendarHeader.querySelector('span:first-child');
            const nextBtn = calendarHeader.querySelector('span:last-child');

            if (prevBtn) {
                prevBtn.style.cursor = 'pointer';
                prevBtn.addEventListener('click', () => {
                    this.ui.currentDate.setMonth(this.ui.currentDate.getMonth() - 1);
                    this.renderCalendar();
                });
            }

            if (nextBtn) {
                nextBtn.style.cursor = 'pointer';
                nextBtn.addEventListener('click', () => {
                    this.ui.currentDate.setMonth(this.ui.currentDate.getMonth() + 1);
                    this.renderCalendar();
                });
            }
        }

        const calendarGrid = document.getElementById('calendar');
        if (calendarGrid) {
            calendarGrid.addEventListener('click', (e) => {
                const dayNumber = parseInt(e.target.textContent);
                if (!dayNumber) return;

                const clickedDate = new Date(
                    this.ui.currentDate.getFullYear(),
                    this.ui.currentDate.getMonth(),
                    dayNumber
                );

                if (this.repository.isDatePast(clickedDate)) {
                    return;
                }

                this.ui.selectedDate = clickedDate;
                this.renderCalendar();
                this.renderAgenda();
                this.displayReservationInfo();
            });
        }

        const prevDayBtn = document.querySelector('.prev');
        const nextDayBtn = document.querySelector('.next');

        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', () => {
                const prevDate = new Date(this.ui.selectedDate.getTime() - 86400000);
                
                if (!this.repository.isDatePast(prevDate)) {
                    this.ui.selectedDate = prevDate;
                    this.ui.currentDate = new Date(prevDate);
                    this.render();
                }
            });
        }

        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', () => {
                const nextDate = new Date(this.ui.selectedDate.getTime() + 86400000);
                this.ui.selectedDate = nextDate;
                this.ui.currentDate = new Date(nextDate);
                this.render();
            });
        }

        const filters = document.querySelectorAll('.filters input[type="checkbox"]');
        filters.forEach(filter => {
            filter.addEventListener('change', (e) => {
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
            });
        });
    }
}
//INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.reservationController = new ReservationController();
        
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        }
    } catch (error) {
        console.error('Erro ao inicializar sistema:', error);
    }
});