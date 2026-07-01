// modules/hud.js (SOLO UN JUGADOR)
export function actualizarHUD(jugador, bolsasMeta, vidasRecolectadas = 0, vidasObjetivo = 0, tiempoRestante = null) {
    const hudContainer = document.getElementById("hud");
    if (!hudContainer) return;
    let tiempoHTML = '';
    if (tiempoRestante !== null && tiempoRestante > 0) {
        const seg = Math.floor(tiempoRestante);
        const min = Math.floor(seg / 60);
        const sec = seg % 60;
        tiempoHTML = `<span style="color:#ff6b6b;font-weight:bold;font-family:'Courier New',monospace;font-size:1.2rem;margin-left:10px;">⏱️ ${min}:${sec.toString().padStart(2,'0')}</span>`;
    }
    hudContainer.innerHTML = `
        <div id="hud-bolsas">
            <img src="../galeria/bolsa.png" alt="bolsa" id="hud-bolsa-icono" style="width:28px;height:28px;image-rendering:pixelated;">
            <span id="hud-bolsas-texto" style="color:#f1c40f;font-size:1.3rem;font-weight:bold;font-family:'Courier New',monospace;">${jugador.bolsas}/${bolsasMeta}</span>
        </div>
        <div id="hud-vidas" style="display:flex;gap:5px;align-items:center;">
            ${Array.from({length: jugador.vidas}, () => `<img src="../galeria/corazon.png" style="width:28px;height:28px;image-rendering:pixelated;">`).join('')}
            ${vidasObjetivo > 0 ? `<span style="color:#fff;font-size:1rem;margin-left:10px;">❤️ ${vidasRecolectadas}/${vidasObjetivo}</span>` : ''}
            ${tiempoHTML}
        </div>
    `;
}