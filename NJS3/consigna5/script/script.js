document.addEventListener('DOMContentLoaded', () => {

    // ---------- Elementos del DOM ----------
    const container = document.getElementById('html-container');
    const feedbackLog = document.getElementById('feedback-log');
    let objectCount = 0;

    // ---------- Funciones auxiliares ----------
    function addFeedback(message, type = 'info') {
        const firstChild = feedbackLog.firstChild;
        if (firstChild && firstChild.tagName === 'P' && firstChild.textContent.includes('Esperando acciones')) {
            feedbackLog.innerHTML = '';
        }
        const p = document.createElement('p');
        p.textContent = `🕒 ${new Date().toLocaleTimeString()} - ${message}`;
        p.className = `feedback-${type}`;
        feedbackLog.appendChild(p);
        feedbackLog.scrollTop = feedbackLog.scrollHeight;
        while (feedbackLog.children.length > 50) {
            feedbackLog.removeChild(feedbackLog.firstChild);
        }
    }

    function clearFeedback() {
        feedbackLog.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = `🕒 ${new Date().toLocaleTimeString()} - 📋 Registro borrado`;
        p.className = 'feedback-warning';
        feedbackLog.appendChild(p);
    }

    function addHTML(htmlString, objectName) {
        const placeholder = container.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        container.innerHTML += htmlString;
        objectCount++;
        addFeedback(`✅ ${objectName} agregado (${objectCount} objetos en total)`, 'success');
    }

    // ---------- Botones de agregar ----------
    document.getElementById('add-paragraph').addEventListener('click', () => {
        const html = `
            <p style="font-size:1.1rem; padding:10px; background:var(--card-bg); border-radius:8px; border-left:4px solid #10b981;">
                📝 Este es un párrafo agregado con <strong>innerHTML</strong>.
                Puedes incluir cualquier etiqueta HTML.
            </p>
        `;
        addHTML(html, 'Párrafo');
    });

    document.getElementById('add-image').addEventListener('click', () => {
        const randomId = Math.floor(Math.random() * 1000);
        const html = `
            <div style="margin:10px 0;">
                <img src="https://placehold.co/400x200/3b82f6/white?text=Imagen+${randomId}" alt="Imagen de prueba" style="max-width:100%; border-radius:8px; box-shadow: var(--shadow);">
                <p style="font-size:0.8rem; color: #6b7280; margin-top:4px;">Imagen de prueba (ID: ${randomId})</p>
            </div>
        `;
        addHTML(html, 'Imagen');
    });

    document.getElementById('add-list').addEventListener('click', () => {
        const html = `
            <div style="background:var(--card-bg); padding:15px; border-radius:8px; margin:10px 0;">
                <h4 style="margin-bottom:8px;">📋 Lista de tareas</h4>
                <ul style="padding-left:20px; margin:0;">
                    <li>Aprender Express</li>
                    <li>Practicar innerHTML</li>
                    <li>Hacer el proyecto 5</li>
                    <li>Disfrutar del código</li>
                </ul>
            </div>
        `;
        addHTML(html, 'Lista');
    });

    document.getElementById('add-card').addEventListener('click', () => {
        const html = `
            <div class="card" style="background:var(--card-bg); padding:15px; border-radius:8px; box-shadow:var(--shadow); margin:10px 0; border-left:4px solid #f59e0b;">
                <h4>🃏 Tarjeta informativa</h4>
                <p>Esta tarjeta fue creada usando <strong>innerHTML</strong> en JavaScript. Puedes incluir estilos, imágenes, listas, etc.</p>
                <p style="font-size:0.85rem; color:#6b7280;">Agregada el ${new Date().toLocaleDateString()}</p>
            </div>
        `;
        addHTML(html, 'Tarjeta');
    });

    document.getElementById('add-table').addEventListener('click', () => {
        const html = `
            <table style="width:100%; border-collapse:collapse; margin:10px 0; background:var(--card-bg);">
                <thead>
                    <tr>
                        <th style="border:1px solid var(--border-color); padding:8px; background:var(--nav-btn-active); color:white;">Producto</th>
                        <th style="border:1px solid var(--border-color); padding:8px; background:var(--nav-btn-active); color:white;">Precio</th>
                        <th style="border:1px solid var(--border-color); padding:8px; background:var(--nav-btn-active); color:white;">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border:1px solid var(--border-color); padding:8px;">Laptop</td>
                        <td style="border:1px solid var(--border-color); padding:8px;">$1200</td>
                        <td style="border:1px solid var(--border-color); padding:8px;">3</td>
                    </tr>
                    <tr>
                        <td style="border:1px solid var(--border-color); padding:8px;">Mouse</td>
                        <td style="border:1px solid var(--border-color); padding:8px;">$25</td>
                        <td style="border:1px solid var(--border-color); padding:8px;">10</td>
                    </tr>
                    <tr>
                        <td style="border:1px solid var(--border-color); padding:8px;">Teclado</td>
                        <td style="border:1px solid var(--border-color); padding:8px;">$45</td>
                        <td style="border:1px solid var(--border-color); padding:8px;">5</td>
                    </tr>
                </tbody>
            </table>
        `;
        addHTML(html, 'Tabla');
    });

    // ---------- Limpiar todo ----------
    document.getElementById('clear-all').addEventListener('click', () => {
        if (container.children.length === 0) {
            addFeedback('📭 No hay objetos para limpiar.', 'warning');
            return;
        }
        const count = container.children.length;
        container.innerHTML = `<p class="placeholder">Aquí aparecerán los objetos HTML que agregues...</p>`;
        objectCount = 0;
        addFeedback(`🗑️ Se eliminaron ${count} objetos.`, 'danger');
    });

    // ---------- Borrar registro ----------
    document.getElementById('clear-feedback').addEventListener('click', clearFeedback);

    // ---------- Modo oscuro ----------
    const themeBtn = document.getElementById('btn-theme');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        addFeedback(isDark ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado', 'info');
    });

    // ---------- Botón "Volver arriba" ----------
    const scrollBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Inicialización ----------
    addFeedback('🚀 Inyector HTML listo. ¡Agrega objetos!', 'info');
});