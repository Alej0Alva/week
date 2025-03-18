document.addEventListener('DOMContentLoaded', function() {
    // Constantes
    const START_DATE = new Date(1999, 4, 10); // 10 de mayo de 1999
    const END_DATE = new Date(2099, 11, 31); // 31 de diciembre de 2099
    const TOTAL_WEEKS = 5218; // Número total de semanas en el período
    
    // Referencias a elementos del DOM
    const calendarContainer = document.getElementById('calendarContainer');
    const weekContainer = document.getElementById('weekContainer');
    const todayBtn = document.getElementById('todayBtn');
    const weekViewBtn = document.getElementById('weekViewBtn');
    const calendarView = document.getElementById('calendarView');
    const weekView = document.getElementById('weekView');
    const currentDateTimeEl = document.getElementById('currentDateTime');
    const weekProgressEl = document.getElementById('weekProgress');
    const timeElapsedEl = document.getElementById('timeElapsed');
    
    // Variables globales
    let currentView = 'calendar';
    let todayElement = null;
    
    // Función para cambiar entre vistas
    function toggleView() {
        if (currentView === 'calendar') {
            calendarView.classList.replace('view-active', 'view-hidden');
            weekView.classList.replace('view-hidden', 'view-active');
            currentView = 'week';
        } else {
            weekView.classList.replace('view-active', 'view-hidden');
            calendarView.classList.replace('view-hidden', 'view-active');
            currentView = 'calendar';
        }
    }
    
    // Función para obtener el número de semana desde el inicio
    function getWeekNumber(date) {
        const diff = date.getTime() - START_DATE.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return Math.floor(days / 7) + 1;
    }
    
    // Función para verificar si una fecha es especial (9 de mayo)
    function isSpecialDate(date) {
        return date.getDate() === 9 && date.getMonth() === 4; // 9 de mayo
    }
    
    // Función para generar el calendario
    function generateCalendar() {
        // Vaciar el contenedor
        calendarContainer.innerHTML = '';
        
        // Generar años desde 1999 hasta 2099
        for (let year = 1999; year <= 2099; year++) {
            // Crear contenedor del año
            const yearContainer = document.createElement('div');
            yearContainer.className = 'year-container';
            yearContainer.id = `year-${year}`;
            
            // Crear encabezado del año
            const yearHeader = document.createElement('h2');
            yearHeader.className = 'year-header';
            yearHeader.textContent = year;
            yearContainer.appendChild(yearHeader);
            
            // Crear grid para los meses
            const monthsGrid = document.createElement('div');
            monthsGrid.className = 'months-grid';
            
            // Para cada mes del año
            for (let month = 0; month < 12; month++) {
                // Omitir enero-abril de 1999
                if (year === 1999 && month < 4) continue;
                
                // Crear contenedor del mes
                const monthContainer = document.createElement('div');
                monthContainer.className = 'month-container';
                
                // Crear encabezado del mes
                const monthHeader = document.createElement('h3');
                monthHeader.className = 'month-header';
                monthHeader.textContent = new Date(year, month, 1).toLocaleString('es', { month: 'long' });
                monthContainer.appendChild(monthHeader);
                
                // Crear grid para los nombres de los días
                const dayNamesGrid = document.createElement('div');
                dayNamesGrid.className = 'day-names-grid';
                
                // Agregar nombres de días
                const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
                dayNames.forEach(day => {
                    const dayName = document.createElement('div');
                    dayName.className = 'day-name';
                    dayName.textContent = day;
                    dayNamesGrid.appendChild(dayName);
                });
                
                monthContainer.appendChild(dayNamesGrid);
                
                // Obtener el primer día del mes
                const firstDay = new Date(year, month, 1);
                // Ajustar para que lunes sea 0 y domingo sea 6
                let firstDayIndex = firstDay.getDay() - 1;
                if (firstDayIndex < 0) firstDayIndex = 6;
                
                // Obtener el número de días en el mes
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                // Fecha actual para comparaciones
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Organizar los días en semanas
                let currentDay = 1;
                let currentDayOfWeek = firstDayIndex;
                
                while (currentDay <= daysInMonth) {
                    // Crear contenedor de semana
                    const weekContainer = document.createElement('div');
                    weekContainer.className = 'week-container';
                    
                    // Obtener el número de semana para el primer día de esta fila
                    const currentDate = new Date(year, month, currentDay);
                    let weekNumber = null;
                    
                    if (currentDate >= START_DATE) {
                        weekNumber = getWeekNumber(currentDate);
                        
                        // Crear indicador de número de semana
                        const weekNumberIndicator = document.createElement('div');
                        weekNumberIndicator.className = 'week-number-indicator';
                        weekNumberIndicator.textContent = weekNumber;
                        weekContainer.appendChild(weekNumberIndicator);
                    } else {
                        // Espacio en blanco para alineación
                        const emptyWeekNumber = document.createElement('div');
                        weekContainer.appendChild(emptyWeekNumber);
                    }
                    
                    // Crear grid para los días de esta semana
                    const weekDaysGrid = document.createElement('div');
                    weekDaysGrid.className = 'week-days-grid';
                    
                    // Agregar días vacíos al principio de la semana si es necesario
                    for (let i = 0; i < currentDayOfWeek; i++) {
                        const emptyDay = document.createElement('div');
                        emptyDay.className = 'day empty';
                        weekDaysGrid.appendChild(emptyDay);
                    }
                    
                    // Agregar los días de la semana
                    for (let i = currentDayOfWeek; i < 7 && currentDay <= daysInMonth; i++) {
                        const dayDate = new Date(year, month, currentDay);
                        
                        // Crear elemento del día
                        const dayElement = document.createElement('div');
                        dayElement.className = 'day';
                        dayElement.textContent = currentDay;
                        
                        // Marcar días especiales
                        if (dayDate.getTime() === today.getTime()) {
                            dayElement.classList.add('today');
                            todayElement = dayElement;
                        } else if (isSpecialDate(dayDate)) {
                            dayElement.classList.add('special');
                        }
                        
                        // Marcar días pasados
                        if (dayDate < today) {
                            dayElement.classList.add('past');
                        }
                        
                        weekDaysGrid.appendChild(dayElement);
                        currentDay++;
                        currentDayOfWeek++;
                    }
                    
                    weekContainer.appendChild(weekDaysGrid);
                    monthContainer.appendChild(weekContainer);
                    
                    // Reiniciar el día de la semana para la siguiente semana
                    currentDayOfWeek = 0;
                }
                
                monthsGrid.appendChild(monthContainer);
            }
            
            yearContainer.appendChild(monthsGrid);
            calendarContainer.appendChild(yearContainer);
        }
    }
    
    // Función para generar la vista de semanas
    function generateWeekView() {
        // Vaciar el contenedor
        weekContainer.innerHTML = '';
        
        // Fecha actual para comparaciones
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Generar bloques para cada semana
        for (let week = 1; week <= TOTAL_WEEKS; week++) {
            const weekBlock = document.createElement('div');
            weekBlock.className = 'week-block';
            weekBlock.textContent = week;
            
            // Calcular la fecha aproximada de esta semana
            const weekDate = new Date(START_DATE);
            weekDate.setDate(START_DATE.getDate() + (week - 1) * 7);
            
            // Marcar las semanas pasadas
            if (weekDate < today) {
                weekBlock.classList.add('past');
            }
            
            weekContainer.appendChild(weekBlock);
        }
    }
    
    // Función para actualizar la información de tiempo
    function updateTimeInfo() {
        const now = new Date();
        
        // Formatear fecha y hora actual
        const dateTimeOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        currentDateTimeEl.textContent = now.toLocaleDateString('es-CO', dateTimeOptions);
        
        // Calcular semanas transcurridas
        const weeksPassed = getWeekNumber(now); // CORRECCIÓN: ya no restamos 1
        const weekPercentage = (weeksPassed / TOTAL_WEEKS * 100).toFixed(2);
        weekProgressEl.textContent = `Semana ${weeksPassed} de ${TOTAL_WEEKS} (${weekPercentage}%)`;
        
        // Calcular tiempo transcurrido desde el inicio
        const timeDiff = now.getTime() - START_DATE.getTime();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(days / 365.25);
        
        const remainingMonths = Math.floor((days % 365.25) / 30.44);
        const remainingWeeks = Math.floor(((days % 365.25) % 30.44) / 7);
        const remainingDays = Math.floor(((days % 365.25) % 30.44) % 7);
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        
        timeElapsedEl.textContent = `Tiempo transcurrido: ${years} años, ${remainingMonths} meses, ${remainingWeeks} semanas, ${remainingDays} días, ${remainingHours} horas, ${remainingMinutes} minutos, ${remainingSeconds} segundos`;
    }
    
    // Función para desplazarse al día actual
    function scrollToToday() {
        if (todayElement) {
            const todayYear = new Date().getFullYear();
            const yearElement = document.getElementById(`year-${todayYear}`);
            
            if (yearElement) {
                yearElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Resaltar brevemente el día actual
                todayElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    todayElement.style.transform = 'scale(1)';
                }, 1000);
            }
        }
    }
    
    // Inicializar el calendario
    generateCalendar();
    generateWeekView();
    updateTimeInfo();
    
    // Configurar temporizador para actualizar la información de tiempo
    setInterval(updateTimeInfo, 1000);
    
    // Configurar eventos de botones
    todayBtn.addEventListener('click', () => {
        if (currentView !== 'calendar') {
            toggleView();
        }
        setTimeout(scrollToToday, 100);
    });
    
    weekViewBtn.addEventListener('click', toggleView);
    
    // Desplazar al día actual al cargar
    setTimeout(scrollToToday, 100);
});
