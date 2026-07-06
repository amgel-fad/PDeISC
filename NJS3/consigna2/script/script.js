document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navegación ----------
    const navBtns = document.querySelectorAll('.nav-btn');
    const components = document.querySelectorAll('.component');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            components.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.target;
            document.getElementById(target).classList.add('active');
        });
    });

    // ---------- Componente 1: Contador ----------
    let counter = 0;
    const counterValue = document.getElementById('counter-value');
    document.getElementById('counter-inc').addEventListener('click', () => {
        counter++;
        counterValue.textContent = counter;
    });
    document.getElementById('counter-dec').addEventListener('click', () => {
        counter--;
        counterValue.textContent = counter;
    });
    document.getElementById('counter-reset').addEventListener('click', () => {
        counter = 0;
        counterValue.textContent = counter;
    });

    // ---------- Componente 2: Colores ----------
    const colorBox = document.getElementById('color-box');
    colorBox.style.background = '#f0f0f0';
    document.getElementById('color-red').addEventListener('click', () => {
        colorBox.style.background = '#ff6b6b';
    });
    document.getElementById('color-teal').addEventListener('click', () => {
        colorBox.style.background = '#4ecdc4';
    });
    document.getElementById('color-yellow').addEventListener('click', () => {
        colorBox.style.background = '#ffe66d';
    });
    document.getElementById('color-random').addEventListener('click', () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        colorBox.style.background = randomColor;
    });

    // ---------- Componente 3: Lista de Tareas (sin alerts) ----------
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    const taskMessage = document.getElementById('task-message');
    const confirmDialog = document.getElementById('confirm-dialog');
    const MAX_TASKS = 10;

    function updateCounter() {
        const total = taskList.children.length;
        taskCounter.textContent = `${total}/${MAX_TASKS} tareas`;
    }

    function showMessage(text, isError = true) {
        taskMessage.textContent = text;
        taskMessage.style.color = isError ? '#ef4444' : '#10b981';
        clearTimeout(taskMessage._timeout);
        taskMessage._timeout = setTimeout(() => {
            taskMessage.textContent = '';
        }, 3000);
    }

    function addTask(text) {
        const total = taskList.children.length;
        if (total >= MAX_TASKS) {
            showMessage(`⚠️ No puedes agregar más de ${MAX_TASKS} tareas.`);
            return;
        }
        const li = document.createElement('li');
        li.textContent = text;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '✖';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            updateCounter();
            showMessage('🗑️ Tarea eliminada', false);
        });
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        updateCounter();
        showMessage('✅ Tarea agregada', false);
    }

    document.getElementById('task-add').addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text === '') {
            showMessage('⚠️ Escribe una tarea primero.');
            return;
        }
        addTask(text);
        taskInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('task-add').click();
        }
    });

    document.getElementById('task-clear-all').addEventListener('click', () => {
        if (taskList.children.length === 0) {
            showMessage('📭 No hay tareas para borrar.', false);
            return;
        }
        confirmDialog.style.display = 'block';
    });

    document.getElementById('confirm-yes').addEventListener('click', () => {
        taskList.innerHTML = '';
        updateCounter();
        confirmDialog.style.display = 'none';
        showMessage('🗑️ Todas las tareas fueron borradas', false);
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        confirmDialog.style.display = 'none';
        showMessage('❌ Operación cancelada', false);
    });

    updateCounter();

    // ---------- Componente 4: Reloj ----------
    let clockInterval = null;
    const clockDisplay = document.getElementById('clock');

    function updateClock() {
        const now = new Date();
        clockDisplay.textContent = now.toLocaleTimeString();
    }

    document.getElementById('clock-start').addEventListener('click', () => {
        if (clockInterval) return;
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    });

    document.getElementById('clock-stop').addEventListener('click', () => {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
    });

    // ---------- Componente 5: Texto Dinámico ----------
    const dynamicInput = document.getElementById('dynamic-input');
    const dynamicOutput = document.getElementById('dynamic-output');

    dynamicInput.addEventListener('input', () => {
        dynamicOutput.textContent = dynamicInput.value || 'Tu texto aparecerá aquí';
    });

    document.getElementById('dynamic-uppercase').addEventListener('click', () => {
        dynamicOutput.textContent = dynamicOutput.textContent.toUpperCase();
        dynamicInput.value = dynamicOutput.textContent;
    });

    document.getElementById('dynamic-lowercase').addEventListener('click', () => {
        dynamicOutput.textContent = dynamicOutput.textContent.toLowerCase();
        dynamicInput.value = dynamicOutput.textContent;
    });

    document.getElementById('dynamic-clear').addEventListener('click', () => {
        dynamicInput.value = '';
        dynamicOutput.textContent = 'Tu texto aparecerá aquí';
    });

    // ---------- Modo Oscuro ----------
    const themeBtn = document.getElementById('btn-theme');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });

});