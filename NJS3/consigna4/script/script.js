document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navegación (por si agregas más componentes) ----------
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

    // ---------- Variables globales ----------
    const linksContainer = document.getElementById('links-container');
    const feedbackLog = document.getElementById('feedback-log');
    let linkCount = 0;
    const linkData = [
        { text: 'Google', href: 'https://www.google.com' },
        { text: 'YouTube', href: 'https://www.youtube.com' },
        { text: 'GitHub', href: 'https://www.github.com' },
        { text: 'Wikipedia', href: 'https://www.wikipedia.org' },
        { text: 'independiente', href: 'https://clubaindependiente.com.ar/' }
    ];

    // ---------- Funciones auxiliares ----------
    function addFeedback(message, type = 'info') {
        const p = document.createElement('p');
        p.textContent = `🕒 ${new Date().toLocaleTimeString()} - ${message}`;
        p.className = `feedback-${type}`;
        feedbackLog.appendChild(p);
        // Scroll al final
        feedbackLog.scrollTop = feedbackLog.scrollHeight;
        // Limitar a 50 mensajes para no saturar
        while (feedbackLog.children.length > 50) {
            feedbackLog.removeChild(feedbackLog.firstChild);
        }
    }

    function clearFeedback() {
        feedbackLog.innerHTML = '';
        addFeedback('Registro limpiado', 'warning');
    }

    function createLink(index) {
        const data = linkData[index];
        if (!data) return;

        // Verificar si ya existe un enlace con ese índice
        const existing = document.querySelector(`#link-${index}`);
        if (existing) {
            addFeedback(`⚠️ El enlace "${data.text}" ya existe.`, 'warning');
            return;
        }

        const a = document.createElement('a');
        a.id = `link-${index}`;
        a.textContent = data.text;
        a.href = data.href;
        a.target = '_blank';
        a.title = `Enlace a ${data.text}`;
        linksContainer.appendChild(a);
        linkCount++;

        // Eliminar el mensaje de "Aquí aparecerán..."
        const placeholder = linksContainer.querySelector('p');
        if (placeholder && linkCount === 1) {
            placeholder.remove();
        }

        addFeedback(`✅ Enlace creado: "${data.text}" → ${data.href}`, 'success');
    }

    // ---------- Crear enlaces (5 botones) ----------
    document.getElementById('create-link1').addEventListener('click', () => createLink(0));
    document.getElementById('create-link2').addEventListener('click', () => createLink(1));
    document.getElementById('create-link3').addEventListener('click', () => createLink(2));
    document.getElementById('create-link4').addEventListener('click', () => createLink(3));
    document.getElementById('create-link5').addEventListener('click', () => createLink(4));

    // ---------- Modificar href de todos los enlaces ----------
    document.getElementById('modify-href').addEventListener('click', () => {
        const links = linksContainer.querySelectorAll('a');
        if (links.length === 0) {
            addFeedback('⚠️ No hay enlaces para modificar.', 'warning');
            return;
        }

        // Generar un nuevo destino (ejemplo: a un sitio de prueba)
        const newHref = `https://example.com/page-${Math.floor(Math.random() * 100)}`;
        let modifiedCount = 0;

        links.forEach((link, index) => {
            const oldHref = link.href;
            link.href = newHref;
            modifiedCount++;
            // Guardar el cambio en el atributo data-old para mostrar después
            link.dataset.oldHref = oldHref;
        });

        addFeedback(`🔗 Se modificaron ${modifiedCount} enlaces. Nuevo href: ${newHref}`, 'info');
        // Mostrar el cambio detallado en el feedback
        addFeedback(`   (Detalle: todos los enlaces ahora apuntan a ${newHref})`, 'info');
    });

    // ---------- Modificar target a _blank ----------
    document.getElementById('modify-target').addEventListener('click', () => {
        const links = linksContainer.querySelectorAll('a');
        if (links.length === 0) {
            addFeedback('⚠️ No hay enlaces para modificar.', 'warning');
            return;
        }

        let modifiedCount = 0;
        links.forEach(link => {
            const oldTarget = link.target || '(no definido)';
            link.target = '_blank';
            modifiedCount++;
            link.dataset.oldTarget = oldTarget;
        });

        addFeedback(`🎯 Se modificó el target de ${modifiedCount} enlaces a "_blank".`, 'success');
    });

    // ---------- Restablecer enlaces (eliminar todos) ----------
    document.getElementById('reset-links').addEventListener('click', () => {
        const links = linksContainer.querySelectorAll('a');
        if (links.length === 0) {
            addFeedback('📭 No hay enlaces para eliminar.', 'warning');
            return;
        }

        const count = links.length;
        links.forEach(link => link.remove());
        linkCount = 0;

        // Restaurar mensaje de placeholder
        if (linksContainer.children.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Aquí aparecerán los enlaces creados...';
            p.style.color = '#6b7280';
            linksContainer.appendChild(p);
        }

        addFeedback(`🗑️ Se eliminaron ${count} enlaces.`, 'danger');
    });

    // ---------- Modo oscuro ----------
    const themeBtn = document.getElementById('btn-theme');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        addFeedback(isDark ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado', 'info');
    });

    // ---------- Inicializar feedback ----------
    addFeedback('🚀 Gestor de enlaces listo. ¡Crea tus enlaces!', 'info');
});