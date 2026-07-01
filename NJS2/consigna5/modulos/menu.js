// modulos/menu.js

function generarMenu() {
    return `
    <nav class="nav-principal">
        <button class="hamburguesa" id="comp_hamburguesa" aria-label="Abrir menú">☰</button>
        
        <div class="menu-enlaces" id="comp_menuEnlaces">
            <a href="/" class="btn-nav">🏠 Inicio</a>
            <a href="/calculo" class="btn-nav">🧮 Cálculo</a>
            <a href="/texto" class="btn-nav">📝 Texto Local</a>
            <a href="/tiempo" class="btn-nav">⏰ Tiempo</a>
            <a href="/npm-upper" class="btn-nav">🚀 NPM Upper</a>
            <button id="modoBtn" class="btn-modo">🌙 Modo Noche</button>
        </div>
    </nav>

    <script>
        // Lógica para abrir y cerrar el menú hamburguesa
        const hamburguesa = document.getElementById('comp_hamburguesa');
        const menuEnlaces = document.getElementById('comp_menuEnlaces');

        if (hamburguesa && menuEnlaces) {
            hamburguesa.addEventListener('click', () => {
                menuEnlaces.classList.toggle('activo');
                // Cambia el icono de barras a cruz según el estado
                hamburguesa.textContent = menuEnlaces.classList.contains('activo') ? '✖' : '☰';
            });
        }

        // Lógica del Botón de Modo Oscuro global
        const modoBtn = document.getElementById('modoBtn');
        if (modoBtn) {
            modoBtn.addEventListener('click', () => {
                const body = document.body;
                body.classList.toggle('noche');
                const esNoche = body.classList.contains('noche');
                modoBtn.textContent = esNoche ? '☀️ Modo Día' : '🌙 Modo Noche';
            });
        }
    </script>
    `;
}

module.exports = { generarMenu };