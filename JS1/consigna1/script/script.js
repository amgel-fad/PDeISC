document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN DEL NAV (FECHA ACTUAL) ---
    const dateSpan = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = new Date().toLocaleDateString('es-ES', options);

    // --- 2. BOTÓN DÍA Y NOCHE ---
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Modo Día';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️ Modo Día';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙 Modo Noche';
            localStorage.setItem('theme', 'light');
        }
    });

    // --- 3. PROCESAMIENTO DEL FORMULARIO Y VALIDACIÓN ---
    const userForm = document.getElementById('user-form');
    const usersContainer = document.getElementById('users-container');
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('username-error');

    userForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        // REQUERIMIENTO: Validar que sean solo palabras (Letras de la A a la Z, espacios, acentos, ñ)
        // ^[a-zA-ZÀ-ÿ\s]+$ significa: desde el inicio al fin solo letras con o sin acento y espacios.
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        const currentNameValue = usernameInput.value.trim();

        if (currentNameValue === "") {
            showError("El nombre no puede estar vacío.");
            return;
        } else if (!nameRegex.test(currentNameValue)) {
            showError("El nombre solo debe contener letras (sin números ni signos).");
            return;
        } else {
            clearError(); // Si está todo bien, removemos alertas visuales
        }

        const method = document.getElementById('read-method').value;
        let userData = {};

        // --- DEMOSTRACIÓN DE LAS 3 FORMAS DE LECTURA ---
        if (method === 'elements') {
            const elements = userForm.elements;
            userData = {
                username: elements.username.value,
                email: elements.email.value,
                role: elements.role.value,
                capturedBy: "Propiedad .elements"
            };
        } else if (method === 'formdata') {
            const formData = new FormData(userForm);
            userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                role: formData.get('role'),
                capturedBy: "Objeto FormData"
            };
        } else if (method === 'individual') {
            userData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                role: document.getElementById('role').value,
                capturedBy: "Selectores Individuales"
            };
        }

        // --- 4. INSERCIÓN DINÁMICA ---
        createUserCard(userData);

        // Resetear formulario
        userForm.reset();
    });

    // Funciones de ayuda para la validación visual
    function showError(msg) {
        usernameInput.classList.add('invalid');
        usernameError.textContent = msg;
    }

    function clearError() {
        usernameInput.classList.remove('invalid');
        usernameError.textContent = "";
    }

    // Limpiar error dinámicamente mientras el usuario escribe de nuevo
    usernameInput.addEventListener('input', () => {
        if (usernameInput.classList.contains('invalid')) {
            clearError();
        }
    });


    // --- 5. CREACIÓN DE TARJETA Y FUNCIÓN PARA BORRAR ---
    function createUserCard(user) {
        const emptyMsg = usersContainer.querySelector('.empty-message');
        if (emptyMsg) emptyMsg.remove();

        // Creamos el nodo contenedor de la tarjeta
        const card = document.createElement('div');
        card.className = 'user-card';

        // Estructura interna incluyendo el nuevo botón para borrar (&times; es una 'X')
        card.innerHTML = `
            <button class="btn-delete" title="Eliminar Registro">&times;</button>
            <h4>${escapeHTML(user.username)}</h4>
            <p>${escapeHTML(user.email)}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span class="badge">${user.role}</span>
                <small style="font-size: 11px; color: var(--text-secondary)">Vía: ${user.capturedBy}</small>
            </div>
        `;

        // REQUERIMIENTO: Agregar evento para borrar esta tarjeta en específico
        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            card.remove(); // Remueve el elemento directamente del DOM sin recargar la página
            
            // Si ya no quedan más usuarios, volvemos a poner el aviso de lista vacía
            if (usersContainer.children.length === 0) {
                usersContainer.innerHTML = '<p class="empty-message">No hay usuarios registrados aún.</p>';
            }
        });

        // Insertar al inicio de la lista
        usersContainer.prepend(card);
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
});