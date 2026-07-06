document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('canvas');
    const statusMsg = document.getElementById('status-message');

    let h1Element = null;
    let imgElement = null;
    let currentImgSize = 300;
    let currentImageIndex = 0;

    // Array de imágenes de Independiente (nuevos enlaces de Bing)
    const imagenesIndependiente = [
        {
            url: 'https://tse3.mm.bing.net/th/id/OIP.eHXhf5nd0XBj9BSPAvAejAHaHa?pid=Api&P=0&h=180',
            desc: 'Escudo'
        },
        {
            url: 'https://tse4.mm.bing.net/th/id/OIP.xoHSWDbECRskZrp3NkVV8wHaEK?pid=Api&P=0&h=180',
            desc: 'equipo'
        },
      
    ];

    function setStatus(text, isSuccess = true) {
        statusMsg.textContent = text;
        statusMsg.style.background = isSuccess ? '#d1fae5' : '#fecaca';
        statusMsg.style.color = isSuccess ? '#065f46' : '#991b1b';
        clearTimeout(statusMsg._timeout);
        statusMsg._timeout = setTimeout(() => {
            statusMsg.textContent = 'Esperando acciones...';
            statusMsg.style.background = '';
            statusMsg.style.color = '';
        }, 3000);
    }

    // ---------- Funciones para el H1 ----------
    function addH1() {
        if (h1Element) h1Element.remove();
        h1Element = document.createElement('h1');
        h1Element.textContent = 'Hola DOM';
        canvas.appendChild(h1Element);
        setStatus('✅ H1 agregado: "Hola DOM"');
    }

    function changeText() {
        if (!h1Element) {
            setStatus('⚠️ Primero agrega un H1', false);
            return;
        }
        h1Element.textContent = 'Chau DOM';
        setStatus('✏️ Texto cambiado a "Chau DOM"');
    }

    function changeColor() {
        if (!h1Element) {
            setStatus('⚠️ Primero agrega un H1', false);
            return;
        }
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        h1Element.style.color = randomColor;
        setStatus(`🎨 Color cambiado a ${randomColor}`);
    }

    // ---------- Funciones para la imagen ----------
    function crearImagen(url, desc, tamaño) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Imagen de Independiente - ${desc}`;
        img.style.width = tamaño + 'px';
        img.onerror = function() {
            // Si falla, mostramos mensaje y pasamos a la siguiente imagen automáticamente
            setStatus(`❌ Error al cargar ${desc}, pasando a la siguiente...`, false);
            this.remove();
            // Avanzamos al siguiente índice
            currentImageIndex = (currentImageIndex + 1) % imagenesIndependiente.length;
            const next = imagenesIndependiente[currentImageIndex];
            const newImg = crearImagen(next.url, next.desc, currentImgSize);
            canvas.appendChild(newImg);
            imgElement = newImg;
            setStatus(`🔄 Mostrando ${next.desc} (${currentImageIndex+1}/${imagenesIndependiente.length})`);
        };
        return img;
    }

    function addImage() {
        if (imgElement) imgElement.remove();
        currentImageIndex = 0;
        const primera = imagenesIndependiente[currentImageIndex];
        imgElement = crearImagen(primera.url, primera.desc, currentImgSize);
        canvas.appendChild(imgElement);
        setStatus(`🖼️ Mostrando ${primera.desc} (${currentImageIndex+1}/${imagenesIndependiente.length})`);
    }

    function changeImage() {
        if (!imgElement) {
            setStatus('⚠️ Primero agrega una imagen', false);
            return;
        }
        currentImageIndex = (currentImageIndex + 1) % imagenesIndependiente.length;
        const siguiente = imagenesIndependiente[currentImageIndex];
        imgElement.src = siguiente.url;
        imgElement.alt = `Imagen de Independiente - ${siguiente.desc}`;
        // Reiniciamos el manejador de error
        imgElement.onerror = function() {
            setStatus(`❌ Error al cambiar a ${siguiente.desc}, pasando a la siguiente...`, false);
            this.remove();
            currentImageIndex = (currentImageIndex + 1) % imagenesIndependiente.length;
            const next = imagenesIndependiente[currentImageIndex];
            const newImg = crearImagen(next.url, next.desc, currentImgSize);
            canvas.appendChild(newImg);
            imgElement = newImg;
            setStatus(`🔄 Mostrando ${next.desc} (${currentImageIndex+1}/${imagenesIndependiente.length})`);
        };
        setStatus(`🔄 Imagen cambiada a ${siguiente.desc} (${currentImageIndex+1}/${imagenesIndependiente.length})`);
    }

    function changeSize() {
        if (!imgElement) {
            setStatus('⚠️ Primero agrega una imagen', false);
            return;
        }
        const sizes = [200, 300, 400, 450];
        let index = sizes.indexOf(currentImgSize);
        index = (index + 1) % sizes.length;
        currentImgSize = sizes[index];
        imgElement.style.width = currentImgSize + 'px';
        setStatus(`📏 Tamaño cambiado a ${currentImgSize}px`);
    }

    // ---------- Tema día/noche ----------
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('btn-theme').textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        setStatus(isDark ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado');
    }

    // ---------- Asignación de eventos ----------
    document.getElementById('btn-add-h1').addEventListener('click', addH1);
    document.getElementById('btn-change-h1').addEventListener('click', changeText);
    document.getElementById('btn-color-h1').addEventListener('click', changeColor);
    document.getElementById('btn-add-img').addEventListener('click', addImage);
    document.getElementById('btn-change-img').addEventListener('click', changeImage);
    document.getElementById('btn-size-img').addEventListener('click', changeSize);
    document.getElementById('btn-theme').addEventListener('click', toggleTheme);

    setStatus('✅ Listo - Imágenes de Independiente (Bing)');
});