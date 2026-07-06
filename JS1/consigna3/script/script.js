document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAV FECHA Y MODO NOCHE ---
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // --- ELEMENTOS CONDICIONALES LÓGICOS ---
    const hasChildrenSelect = document.getElementById('p-has-children');
    const childrenWrapper = document.getElementById('children-count-wrapper');
    const childrenInput = document.getElementById('p-children-count');

    hasChildrenSelect.addEventListener('change', () => {
        if (hasChildrenSelect.value === 'Si') {
            childrenWrapper.classList.remove('hidden-field');
        } else {
            childrenWrapper.classList.add('hidden-field');
            childrenInput.value = '1';
        }
    });

    // --- MANEJO DE FORMULARIO ---
    const form = document.getElementById('person-form');
    const cardsContainer = document.getElementById('people-cards-container');
    const namesListContainer = document.getElementById('people-names-list');
    const toastContainer = document.getElementById('toast-container');

    updateUI();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fields = {
            name: { input: document.getElementById('p-name'), error: document.getElementById('error-name') },
            lastname: { input: document.getElementById('p-lastname'), error: document.getElementById('error-lastname') },
            doc: { input: document.getElementById('p-doc'), error: document.getElementById('error-doc') },
            phone: { input: document.getElementById('p-phone'), error: document.getElementById('error-phone') },
            mail: { input: document.getElementById('p-mail'), error: document.getElementById('error-mail') },
            birth: { input: document.getElementById('p-birth'), error: document.getElementById('error-birth') },
            age: { input: document.getElementById('p-age'), error: document.getElementById('error-age') },
            gender: { input: document.getElementById('p-gender'), error: document.getElementById('error-gender') },
            civil: { input: document.getElementById('p-civil'), error: document.getElementById('error-civil') },
            nationality: { input: document.getElementById('p-nationality'), error: document.getElementById('error-nationality') },
            childrenCount: { input: childrenInput, error: document.getElementById('error-children') }
        };

        let isFormValid = true;

        // Limpieza visual preventiva
        Object.values(fields).forEach(f => {
            f.input.classList.remove('input-error');
            if (f.error) f.error.textContent = '';
        });

        // --- 1. VALIDACIÓN DE TEXTO PURO (Nombre y Apellido) ---
        // Expresión regular: solo letras (con tildes y diéresis) y espacios
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        
        if (!nameRegex.test(fields.name.input.value.trim()) || fields.name.input.value.trim().length < 2) {
            setFieldError(fields.name, "El nombre solo debe contener letras (mínimo 2).");
            isFormValid = false;
        }
        if (!nameRegex.test(fields.lastname.input.value.trim()) || fields.lastname.input.value.trim().length < 2) {
            setFieldError(fields.lastname, "El apellido solo debe contener letras (mínimo 2).");
            isFormValid = false;
        }
        
        // --- 2. VALIDACIÓN DE COHERENCIA EN DNI (6 a 8 dígitos) ---
        const docValue = fields.doc.input.value.trim();
        const docRegex = /^\d{6,8}$/; // Fuerza a que sean solo dígitos, entre 6 y 8 de largo
        if (!docRegex.test(docValue)) {
            setFieldError(fields.doc, "El documento debe tener entre 6 y 8 dígitos numéricos.");
            isFormValid = false;
        }
        
        // --- 3. VALIDACIÓN DE TELÉFONO Y MAIL ---
        if (fields.phone.input.value.trim().length < 6) { 
            setFieldError(fields.phone, "Ingrese un teléfono válido."); 
            isFormValid = false; 
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fields.mail.input.value.trim())) { 
            setFieldError(fields.mail, "Formato de e-mail inválido."); 
            isFormValid = false; 
        }
        
        // --- 4. VALIDACIÓN DE COHERENCIA DE FECHA Y EDAD ---
        const birthValue = fields.birth.input.value;
        const ageVal = parseInt(fields.age.input.value, 10);
        
        if (birthValue === "") { 
            setFieldError(fields.birth, "Seleccione la fecha de nacimiento."); 
            isFormValid = false; 
        } else {
            const birthDate = new Date(birthValue);
            const today = new Date();
            
            // Validación A: Que no tiren una fecha en el futuro
            if (birthDate > today) {
                setFieldError(fields.birth, "La fecha de nacimiento no puede ser futura.");
                isFormValid = false;
            } else {
                // Validación B: Cruzar la fecha de nacimiento con la edad puesta para ver si coincide
                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                const monthDifference = today.getMonth() - birthDate.getMonth();
                
                // Ajustar si todavía no cumplió años este año
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAge--;
                }

                if (isNaN(ageVal) || ageVal !== calculatedAge) {
                    setFieldError(fields.age, `La edad no coincide con la fecha de nacimiento (debería ser ${calculatedAge}).`);
                    isFormValid = false;
                }
            }
        }
        
        // --- 5. SELECTORES DE ESTADO ---
        if (fields.gender.input.value === "") { setFieldError(fields.gender, "Seleccione una opción."); isFormValid = false; }
        if (fields.civil.input.value === "") { setFieldError(fields.civil, "Seleccione estado civil."); isFormValid = false; }
        if (fields.nationality.input.value === "") { setFieldError(fields.nationality, "Seleccione nacionalidad."); isFormValid = false; }

        // --- 6. HIJOS (CONDICIONAL) ---
        let finalChildrenCount = 0;
        if (hasChildrenSelect.value === 'Si') {
            finalChildrenCount = parseInt(fields.childrenCount.input.value, 10);
            if (isNaN(finalChildrenCount) || finalChildrenCount < 1) {
                setFieldError(fields.childrenCount, "Indique la cantidad (mínimo 1).");
                isFormValid = false;
            }
        }

        // Freno si algo falló
        if (!isFormValid) {
            showToast("Error al guardar: Datos incoherentes o campos vacíos.", "error");
            return;
        }

        // Si todo es coherente, se guarda en LocalStorage
        const newPerson = {
            id: Date.now().toString(),
            name: fields.name.input.value.trim(),
            lastname: fields.lastname.input.value.trim(),
            doc: parseInt(docValue, 10),
            phone: fields.phone.input.value.trim(),
            mail: fields.mail.input.value.trim(),
            birth: birthValue,
            age: ageVal,
            gender: fields.gender.input.value,
            civil: fields.civil.input.value,
            nationality: fields.nationality.input.value,
            hasChildren: hasChildrenSelect.value,
            childrenCount: finalChildrenCount
        };

        let currentStorage = JSON.parse(localStorage.getItem('peopleDatabase')) || [];
        currentStorage.push(newPerson);
        localStorage.setItem('peopleDatabase', JSON.stringify(currentStorage));

        showToast(`¡Legajo de ${newPerson.name} guardado con éxito!`, "success");
        
        form.reset();
        childrenWrapper.classList.add('hidden-field'); 
        updateUI();
    });

    function setFieldError(fieldObj, message) {
        fieldObj.input.classList.add('input-error');
        if (fieldObj.error) fieldObj.error.textContent = message;
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    function updateUI() {
        cardsContainer.innerHTML = '';
        namesListContainer.innerHTML = '';

        const people = JSON.parse(localStorage.getItem('peopleDatabase')) || [];

        if (people.length === 0) {
            cardsContainer.innerHTML = '<p class="empty-message">No hay registros de legajos en la base de datos.</p>';
            namesListContainer.innerHTML = '<li class="empty-message">No hay personas registradas aún.</li>';
            return;
        }

        people.forEach(person => {
            const li = document.createElement('li');
            li.textContent = `${person.lastname}, ${person.name}`;
            namesListContainer.appendChild(li);
        });

        people.forEach(person => {
            const card = document.createElement('div');
            card.className = 'item-card';
            const childrenText = person.hasChildren === 'Si' ? `${person.childrenCount}` : 'No tiene';

            card.innerHTML = `
                <h4>${escapeHTML(person.lastname)}, ${escapeHTML(person.name)}</h4>
                <div class="card-details">
                    <span><b>Documento:</b> ${person.doc}</span>
                    <span><b>Edad:</b> ${person.age} años</span>
                    <span><b>Nacimiento:</b> ${person.birth}</span>
                    <span><b>Sexo:</b> ${person.gender}</span>
                    <span><b>Estado Civil:</b> ${person.civil}</span>
                    <span><b>Nacionalidad:</b> ${person.nationality}</span>
                    <span><b>Teléfono:</b> ${escapeHTML(person.phone)}</span>
                    <span><b>E-mail:</b> ${escapeHTML(person.mail)}</span>
                    <span><b>Hijos:</b> ${childrenText}</span>
                </div>
            `;
            cardsContainer.prepend(card);
        });
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
});