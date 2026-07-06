document.addEventListener('DOMContentLoaded', () => {
    
    // --- MAPAS DE DATOS CONTROLADOS (Evita entradas libres extrañas) ---
    const articlesByCategory = {
        Deportes: ["Pelota de Fútbol Profesional", "Raqueta de Tenis Alum", "Gorro de Natación Silicona", "Mancuernas 5kg"],
        Herramientas: ["Taladro Percutor 12V", "Caja de Herramientas Completa", "Amoladora Angular", "Set de Destornilladores x10"],
        Tecnología: ["Mouse Óptico Gamer", "Teclado Mecánico RGB", "Monitor 24 Pulgadas FHD", "Auriculares Bluetooth"]
    };

    const priceByTier = {
        barato: 1500.00,
        medio: 12500.00,
        caro: 85000.00
    };

    // --- ELEMENTOS DEL DOM ---
    const categorySelect = document.getElementById('prod-category');
    const nameSelect = document.getElementById('prod-name');
    const priceTierSelect = document.getElementById('price-tier');
    const priceInput = document.getElementById('prod-price');
    const form = document.getElementById('inventory-form');
    const itemsContainer = document.getElementById('items-container');
    const namesListContainer = document.getElementById('names-list');
    const toastContainer = document.getElementById('toast-container');

    // --- CONFIGURACIÓN NAV FECHA Y MODO NOCHE ---
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    let memoryArray = [];
    updateUI();

    // --- LÓGICA 1: ARTÍCULOS DEPENDIENTES DE LA CATEGORÍA ---
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;

        // Limpiar el select de nombres anteriores
        nameSelect.innerHTML = '';

        if (selectedCategory && articlesByCategory[selectedCategory]) {
            // Habilitar campo y rellenar opciones correctas
            nameSelect.disabled = false;
            
            // Opción por defecto
            const defaultOpt = document.createElement('option');
            defaultOpt.value = "";
            defaultOpt.textContent = "-- Seleccione un Artículo --";
            nameSelect.appendChild(defaultOpt);

            // Inyectar ítems del diccionario
            articlesByCategory[selectedCategory].forEach(article => {
                const opt = document.createElement('option');
                opt.value = article;
                opt.textContent = article;
                nameSelect.appendChild(opt);
            });
        } else {
            // Deshabilitar si no hay categoría seleccionada
            nameSelect.disabled = true;
            const opt = document.createElement('option');
            opt.value = "";
            opt.textContent = "-- Primero elija una categoría --";
            nameSelect.appendChild(opt);
        }
    });

    // --- LÓGICA 2: CONTROL DE PRECIOS AUTOMÁTICO SEGÚN LA GAMA ---
    priceTierSelect.addEventListener('change', () => {
        const tier = priceTierSelect.value;
        if (tier && priceByTier[tier]) {
            // Asigna el precio fijo directamente y bloquea modificaciones raras
            priceInput.value = priceByTier[tier];
        } else {
            priceInput.value = '';
        }
    });

    // --- CONTROLADOR SUBMIT CON VALIDACIONES ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fields = {
            category: { input: categorySelect, error: document.getElementById('error-category') },
            name: { input: nameSelect, error: document.getElementById('error-name') },
            brand: { input: document.getElementById('prod-brand'), error: document.getElementById('error-brand') },
            tier: { input: priceTierSelect, error: document.getElementById('error-tier') },
            price: { input: priceInput, error: document.getElementById('error-price') },
            stock: { input: document.getElementById('prod-stock'), error: document.getElementById('error-stock') },
            date: { input: document.getElementById('prod-date'), error: document.getElementById('error-date') },
            condition: { input: document.getElementById('prod-condition'), error: document.getElementById('error-condition') }
        };

        let isFormValid = true;

        // Limpieza visual preventiva
        Object.values(fields).forEach(f => {
            f.input.classList.remove('input-error');
            if(f.error) f.error.textContent = '';
        });

        // Validar que todos los selectores tengan un valor real seleccionado
        if (fields.category.input.value === "") { setFieldError(fields.category, "Seleccione una categoría."); isFormValid = false; }
        if (fields.name.input.value === "") { setFieldError(fields.name, "Seleccione el artículo."); isFormValid = false; }
        if (fields.brand.input.value === "") { setFieldError(fields.brand, "Debe elegir una marca."); isFormValid = false; }
        if (fields.tier.input.value === "") { setFieldError(fields.tier, "Determine la gama del precio."); isFormValid = false; }
        
        const stockVal = parseInt(fields.stock.input.value, 10);
        if (isNaN(stockVal) || stockVal < 0) { setFieldError(fields.stock, "El stock no puede ser negativo."); isFormValid = false; }
        if (fields.date.input.value === "") { setFieldError(fields.date, "Indique la fecha."); isFormValid = false; }
        if (fields.condition.input.value === "") { setFieldError(fields.condition, "Seleccione la condición."); isFormValid = false; }

        if (!isFormValid) {
            showToast("Error al guardar: Verifique los campos requeridos.", "error");
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            name: fields.name.input.value,
            category: fields.category.input.value,
            brand: fields.brand.input.value,
            price: parseFloat(fields.price.input.value),
            stock: stockVal,
            date: fields.date.input.value,
            condition: fields.condition.input.value,
            featured: document.getElementById('prod-featured').checked
        };

        const storageMethod = document.getElementById('storage-method').value;

        if (storageMethod === 'memory' || storageMethod === 'all') memoryArray.push(newItem);
        if (storageMethod === 'local' || storageMethod === 'all') {
            let localData = JSON.parse(localStorage.getItem('localInventory')) || [];
            localData.push(newItem);
            localStorage.setItem('localInventory', JSON.stringify(localData));
        }
        if (storageMethod === 'session' || storageMethod === 'all') {
            let sessionData = JSON.parse(sessionStorage.getItem('sessionInventory')) || [];
            sessionData.push(newItem);
            sessionStorage.setItem('sessionInventory', JSON.stringify(sessionData));
        }

        showToast(`¡${newItem.name} guardado correctamente!`, "success");
        
        form.reset();
        nameSelect.disabled = true; // Volver a bloquear hasta nueva categoría
        nameSelect.innerHTML = '<option value="">-- Primero elija una categoría --</option>';
        updateUI();
    });

    function setFieldError(fieldObj, message) {
        fieldObj.input.classList.add('input-error');
        if(fieldObj.error) fieldObj.error.textContent = message;
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    function updateUI() {
        itemsContainer.innerHTML = '';
        namesListContainer.innerHTML = '';

        const localArray = JSON.parse(localStorage.getItem('localInventory')) || [];
        const sessionArray = JSON.parse(sessionStorage.getItem('sessionInventory')) || [];

        document.getElementById('count-memory').textContent = memoryArray.length;
        document.getElementById('count-local').textContent = localArray.length;
        document.getElementById('count-session').textContent = sessionArray.length;

        const allItemsCombined = [...memoryArray, ...localArray, ...sessionArray];

        if (allItemsCombined.length === 0) {
            itemsContainer.innerHTML = '<p class="empty-message">No hay artículos cargados.</p>';
            namesListContainer.innerHTML = '<li class="empty-message">No hay nombres registrados.</li>';
            return;
        }

        const uniqueItems = [];
        const checkedIds = new Map();

        for (const item of allItemsCombined) {
            if (!checkedIds.has(item.id)) {
                checkedIds.set(item.id, true);
                uniqueItems.push(item);
            }
        }

        // Renderizado del listado de nombres limpios seleccionados
        uniqueItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            namesListContainer.appendChild(li);
        });

        // Renderizado de las fichas
        uniqueItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';

            const viaMemory = memoryArray.some(m => m.id === item.id) ? '<span class="mini-badge" style="background:var(--badge-memory)">Memoria</span>' : '';
            const viaLocal = localArray.some(l => l.id === item.id) ? '<span class="mini-badge" style="background:var(--badge-local)">Local</span>' : '';
            const viaSession = sessionArray.some(s => s.id === item.id) ? '<span class="mini-badge" style="background:var(--badge-session)">Session</span>' : '';

            card.innerHTML = `
                <div class="item-header">
                    <h4>${item.name}</h4>
                    ${item.featured ? '<span style="font-size:12px">⭐</span>' : ''}
                </div>
                <div class="item-details">
                    <div><b>Cat:</b> ${item.category}</div>
                    <div><b>Marca:</b> ${item.brand}</div>
                    <div><b>Precio:</b> $${item.price.toFixed(2)}</div>
                    <div><b>Stock:</b> ${item.stock} u.</div>
                </div>
                <div style="display:flex; gap:4px; margin-top:8px;">${viaMemory} ${viaLocal} ${viaSession}</div>
            `;
            itemsContainer.prepend(card);
        });
    }
});