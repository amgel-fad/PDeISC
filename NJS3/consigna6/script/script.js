document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('register-form');
    const recordsList = document.getElementById('records-list');
    const themeBtn = document.getElementById('btn-theme');

    // Array para almacenar todos los registros
    let registros = [];

    // Función para renderizar todos los registros en la columna derecha
    function renderRecords() {
        if (registros.length === 0) {
            recordsList.innerHTML = `<p class="empty-message">Aún no hay registros. Completa el formulario y haz clic en "Registrar".</p>`;
            return;
        }

        let html = '';
        registros.forEach((data, index) => {
            const intereses = data.intereses && data.intereses.length > 0 
                ? data.intereses.join(', ') 
                : 'Ninguno';
            html += `
                <div class="record-item">
                    <p><strong>Registro #${index + 1}</strong></p>
                    <p><strong>Nombre:</strong> ${data.nombre}</p>
                    <p><strong>Género:</strong> ${data.genero}</p>
                    <p><strong>País:</strong> ${data.pais}</p>
                    <p><strong>Intereses:</strong> ${intereses}</p>
                    <p><strong>Edad:</strong> ${data.edad}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                </div>
            `;
        });
        recordsList.innerHTML = html;
    }

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar nombre (solo letras y espacios)
        const nombreInput = document.getElementById('nombre');
        const nombre = nombreInput.value.trim();
        if (!/^[A-Za-záéíóúñÑ\s]+$/.test(nombre)) {
            alert('El nombre solo puede contener letras y espacios.');
            return;
        }

        // Recoger datos
        const genero = form.querySelector('input[name="genero"]:checked');
        const pais = document.getElementById('pais').value;
        const interesesCheckboxes = form.querySelectorAll('input[name="intereses"]:checked');
        const intereses = Array.from(interesesCheckboxes).map(cb => cb.value);
        const edad = document.getElementById('edad').value;
        const email = document.getElementById('email').value.trim();

        // Validaciones adicionales
        if (!genero) {
            alert('Por favor selecciona un género.');
            return;
        }
        if (!pais) {
            alert('Por favor selecciona un país.');
            return;
        }
        if (!edad || edad < 1 || edad > 120) {
            alert('Ingresa una edad válida (1-120).');
            return;
        }
        if (!email || !email.includes('@')) {
            alert('Ingresa un correo electrónico válido.');
            return;
        }

        // Construir objeto con los datos
        const user = {
            nombre,
            genero: genero.value,
            pais,
            intereses,
            edad,
            email
        };

        // Agregar al array de registros
        registros.push(user);

        // Renderizar todos los registros
        renderRecords();

        // Limpiar el formulario para un nuevo registro
        form.reset();

        // Opcional: mostrar un mensaje de éxito
        // (podríamos usar un pequeño feedback, pero no usamos alerts)
        // En su lugar, hacemos scroll suave hacia la columna de registros
        document.querySelector('.records-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Modo oscuro
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });

});