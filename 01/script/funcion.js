/**
 * ============================================================
 * script.js – Imágenes Unsplash temáticas por noticia
 * ============================================================
 */

(function() {
    'use strict';

    // --------------------------------------------------------------
    // 1. MODO CLARO / OSCURO
    // --------------------------------------------------------------
    const body = document.body;
    const botonModo = document.getElementById('botonModoDiaNoche');
    const iconoModo = document.getElementById('iconoModo');
    const textoModo = document.getElementById('textoModo');

    function aplicarModo(esNoche) {
        if (esNoche) {
            body.classList.add('modo-noche');
            if (iconoModo) iconoModo.textContent = '🌙';
            if (textoModo) textoModo.textContent = 'Modo Noche';
            localStorage.setItem('modoActualidad', 'noche');
        } else {
            body.classList.remove('modo-noche');
            if (iconoModo) iconoModo.textContent = '☀️';
            if (textoModo) textoModo.textContent = 'Modo Día';
            localStorage.setItem('modoActualidad', 'dia');
        }
    }
    function toggleModo() { aplicarModo(!body.classList.contains('modo-noche')); }
    if (botonModo) botonModo.addEventListener('click', toggleModo);

    const modoGuardado = localStorage.getItem('modoActualidad');
    if (modoGuardado === 'noche') aplicarModo(true);
    else if (modoGuardado === 'dia') aplicarModo(false);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) aplicarModo(true);

    // --------------------------------------------------------------
    // 2. FECHA Y CLIMA
    // --------------------------------------------------------------
    function actualizarFecha() {
        const fechaElem = document.getElementById('fechaDinamica');
        if (fechaElem) {
            const ahora = new Date();
            let fechaForm = ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            fechaForm = fechaForm.charAt(0).toUpperCase() + fechaForm.slice(1);
            fechaElem.textContent = fechaForm;
        }
        const tempSpan = document.getElementById('temperaturaClima');
        if (tempSpan) tempSpan.textContent = '8°C';
    }
    actualizarFecha();
    setInterval(actualizarFecha, 60000);

    // --------------------------------------------------------------
    // 3. NOTICIAS CON IMÁGENES UNSPLASH TEMÁTICAS
    //    Cada noticia tiene una imagen específica acorde a su contenido
    // --------------------------------------------------------------
    const secciones = ['Deportes', 'Mar del Plata', 'Buenos Aires', 'Escuelas', 'Política', 'Economía', 'Tecnología', 'Cultura'];

    // Unsplash Source: formato https://images.unsplash.com/photo-{ID}?w=400&h=250&fit=crop&auto=format
    // Cada imagen fue seleccionada para coincidir con el tema de la noticia

    const todasLasNoticias = [

        // ── DEPORTES ──────────────────────────────────────────────
        {
            seccion: 'Deportes', categoria: 'Deportes',
            titulo: 'River Plate golea en el clásico y se afianza en la punta',
            resumen: 'El Millonario venció 3-0 a su eterno rival con goles de Borja, Barco y Solari.',
            fecha: 'Hace 2 hs',
            imagen: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop&auto=format'  // estadio fútbol
        },
        {
            seccion: 'Deportes', categoria: 'Deportes',
            titulo: 'Argentina clasifica al Mundial 2026 tras vencer a Brasil',
            resumen: 'La Scaloneta selló su pase al mundial con un contundente 2-0 en el Monumental.',
            fecha: 'Hace 4 hs',
            imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop&auto=format'  // festejo selección
        },
        {
            seccion: 'Deportes', categoria: 'Deportes',
            titulo: 'Lionel Messi anuncia su retiro de la selección',
            resumen: 'El capitán argentino confirmó que dejará la albiceleste tras la Copa América.',
            fecha: 'Hace 6 hs',
            imagen: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400&h=250&fit=crop&auto=format'  // pelota fútbol campo
        },
        {
            seccion: 'Deportes', categoria: 'Deportes',
            titulo: 'Boca Juniors ficha a estrella europea para la próxima temporada',
            resumen: 'El Xeneize negocia con un delantero inglés para reforzar el ataque.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=250&fit=crop&auto=format'  // jugador fútbol
        },
        {
            seccion: 'Deportes', categoria: 'Deportes',
            titulo: 'Tenis: Argentina avanza a semifinales de la Copa Davis',
            resumen: 'La escuadra argentina venció a Australia y espera rival en la final.',
            fecha: 'Hace 7 hs',
            imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop&auto=format'  // cancha tenis
        },
        {
            seccion: 'Deportes', categoria: 'Deportes',
            titulo: 'Fórmula 1: Franco Colapinto logra su primer podio',
            resumen: 'El piloto argentino sorprendió con un tercer puesto en el Gran Premio de Italia.',
            fecha: 'Hace 9 hs',
            imagen: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=250&fit=crop&auto=format'  // auto de carrera
        },

        // ── MAR DEL PLATA ─────────────────────────────────────────
        {
            seccion: 'Mar del Plata', categoria: 'Mar del Plata',
            titulo: 'Mar del Plata: inauguran el nuevo paseo costero',
            resumen: 'Con una inversión de 500 millones, el paseo ya está abierto al público.',
            fecha: 'Hace 1 hs',
            imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop&auto=format'  // playa costera
        },
        {
            seccion: 'Mar del Plata', categoria: 'Mar del Plata',
            titulo: 'Ola de calor extremo en la ciudad: recomendaciones',
            resumen: 'Las temperaturas superarán los 38°C; piden extremar cuidados.',
            fecha: 'Hace 3 hs',
            imagen: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&h=250&fit=crop&auto=format'  // sol playa calor
        },
        {
            seccion: 'Mar del Plata', categoria: 'Mar del Plata',
            titulo: 'Cierran el puerto por fuertes vientos y marejada',
            resumen: 'Las autoridades decidieron cerrar la actividad pesquera por seguridad.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400&h=250&fit=crop&auto=format'  // puerto barcos mar
        },
        {
            seccion: 'Mar del Plata', categoria: 'Mar del Plata',
            titulo: 'Fiesta Nacional del Mar: edición 2026 con récord de asistentes',
            resumen: 'Más de 50 mil personas disfrutaron de los shows y la gastronomía local.',
            fecha: 'Hace 8 hs',
            imagen: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop&auto=format'  // festival multitud
        },
        {
            seccion: 'Mar del Plata', categoria: 'Mar del Plata',
            titulo: 'Mar del Plata tendrá su propio aeropuerto internacional',
            resumen: 'El gobierno nacional anunció la ampliación de la terminal aérea.',
            fecha: 'Hace 10 hs',
            imagen: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop&auto=format'  // aeropuerto avión
        },
        {
            seccion: 'Mar del Plata', categoria: 'Mar del Plata',
            titulo: 'Robo millonario a una joyería en pleno centro',
            resumen: 'Los delincuentes ingresaron por un túnel y se llevaron joyas por 2 millones de dólares.',
            fecha: 'Hace 11 hs',
            imagen: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=250&fit=crop&auto=format'  // joyería diamantes
        },

        // ── BUENOS AIRES ──────────────────────────────────────────
        {
            seccion: 'Buenos Aires', categoria: 'Buenos Aires',
            titulo: 'Aumento del boleto de colectivo en el AMBA',
            resumen: 'El nuevo tarifazo entró en vigencia: el mínimo pasó a $450.',
            fecha: 'Hace 2 hs',
            imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop&auto=format'  // colectivo bus
        },
        {
            seccion: 'Buenos Aires', categoria: 'Buenos Aires',
            titulo: 'Llega la vacuna contra el dengue a la provincia',
            resumen: 'El gobierno bonaerense inició la campaña de vacunación gratuita.',
            fecha: 'Hace 4 hs',
            imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop&auto=format'  // vacuna jeringa
        },
        {
            seccion: 'Buenos Aires', categoria: 'Buenos Aires',
            titulo: 'Corte de luz masivo afecta a 30 mil usuarios en La Plata',
            resumen: 'Un desperfecto en una subestación dejó sin luz a varios barrios.',
            fecha: 'Hace 6 hs',
            imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&auto=format'  // cables electricidad
        },
        {
            seccion: 'Buenos Aires', categoria: 'Buenos Aires',
            titulo: 'Nuevo sistema de estacionamiento medido en microcentro',
            resumen: 'Se implementa una app para pagar el estacionamiento desde el celular.',
            fecha: 'Hace 7 hs',
            imagen: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=250&fit=crop&auto=format'  // estacionamiento autos
        },
        {
            seccion: 'Buenos Aires', categoria: 'Buenos Aires',
            titulo: 'La provincia lanza plan de viviendas sociales para 10 mil familias',
            resumen: 'El gobernador Kicillof anunció el proyecto en Lanús.',
            fecha: 'Hace 9 hs',
            imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&auto=format'  // viviendas construcción
        },
        {
            seccion: 'Buenos Aires', categoria: 'Buenos Aires',
            titulo: 'Incendio en un depósito de combustibles en Dock Sud',
            resumen: 'Las llamas afectaron un área de 5000 m²; no hay heridos.',
            fecha: 'Hace 11 hs',
            imagen: 'https://images.unsplash.com/photo-1625466247501-b3e77ac6c9e0?w=400&h=250&fit=crop&auto=format'  // incendio llamas
        },

        // ── ESCUELAS ──────────────────────────────────────────────
        {
            seccion: 'Escuelas', categoria: 'Escuelas',
            titulo: 'Paro docente en escuelas de la provincia',
            resumen: 'Los gremios reclaman aumento salarial y paritarias abiertas.',
            fecha: 'Hace 3 hs',
            imagen: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop&auto=format'  // protesta marcha
        },
        {
            seccion: 'Escuelas', categoria: 'Escuelas',
            titulo: 'Nuevo plan de alfabetización para nivel primario',
            resumen: 'El ministerio presentó un programa con materiales didácticos innovadores.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop&auto=format'  // niños leyendo
        },
        {
            seccion: 'Escuelas', categoria: 'Escuelas',
            titulo: 'Escuelas técnicas recibirán fondos para talleres',
            resumen: 'Se destinarán 1000 millones de pesos para equipamiento.',
            fecha: 'Hace 6 hs',
            imagen: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=250&fit=crop&auto=format'  // taller técnico herramientas
        },
        {
            seccion: 'Escuelas', categoria: 'Escuelas',
            titulo: 'Jornada extendida: se suman 200 escuelas',
            resumen: 'La medida beneficiará a 50 mil alumnos de zonas vulnerables.',
            fecha: 'Hace 8 hs',
            imagen: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop&auto=format'  // aula alumnos
        },
        {
            seccion: 'Escuelas', categoria: 'Escuelas',
            titulo: 'Comenzaron las inscripciones para el ciclo lectivo 2027',
            resumen: 'El plazo vence el 30 de noviembre; se espera alta demanda.',
            fecha: 'Hace 10 hs',
            imagen: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=250&fit=crop&auto=format'  // libros escuela
        },
        {
            seccion: 'Escuelas', categoria: 'Escuelas',
            titulo: 'Alertan por bullying: lanzan campaña en secundarias',
            resumen: 'La campaña \'Basta de silencio\' incluye talleres y líneas de ayuda.',
            fecha: 'Hace 12 hs',
            imagen: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?w=400&h=250&fit=crop&auto=format'  // adolescentes escuela
        },

        // ── POLÍTICA ──────────────────────────────────────────────
        {
            seccion: 'Política', categoria: 'Política',
            titulo: 'Elecciones 2026: balotaje entre Massa y Bullrich',
            resumen: 'La segunda vuelta será el 22 de noviembre; encuestas muestran empate.',
            fecha: 'Hace 1 hs',
            imagen: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop&auto=format'  // urnas votación
        },
        {
            seccion: 'Política', categoria: 'Política',
            titulo: 'El gobierno anuncia nuevo paquete de medidas económicas',
            resumen: 'Incluyen rebaja de retenciones y créditos para Pymes.',
            fecha: 'Hace 3 hs',
            imagen: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop&auto=format'  // conferencia gobierno
        },
        {
            seccion: 'Política', categoria: 'Política',
            titulo: 'Senado debate la reforma judicial impulsada por el oficialismo',
            resumen: 'La oposición critica la iniciativa por considerar que concentra poder.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&auto=format'  // parlamento congreso
        },
        {
            seccion: 'Política', categoria: 'Política',
            titulo: 'Cristina Kirchner reaparece en un acto en La Plata',
            resumen: 'La ex presidenta encabezó un multitudinario evento en el estadio.',
            fecha: 'Hace 6 hs',
            imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop&auto=format'  // mitin político multitud
        },
        {
            seccion: 'Política', categoria: 'Política',
            titulo: 'Acuerdo con el FMI: se espera la firma esta semana',
            resumen: 'El ministro de Economía viajará a Washington para cerrar detalles.',
            fecha: 'Hace 8 hs',
            imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format'  // negociación firma documentos
        },
        {
            seccion: 'Política', categoria: 'Política',
            titulo: 'Milei propone dolarización total: reacciones encontradas',
            resumen: 'El economista libertario generó polémica con su propuesta radical.',
            fecha: 'Hace 11 hs',
            imagen: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=250&fit=crop&auto=format'  // dólares billetes
        },

        // ── ECONOMÍA ──────────────────────────────────────────────
        {
            seccion: 'Economía', categoria: 'Economía',
            titulo: 'Dólar blue hoy: a cuánto cotiza y expectativas',
            resumen: 'El paralelo se mantiene en $1.095 mientras el oficial sube lentamente.',
            fecha: 'Hace 1 hs',
            imagen: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=250&fit=crop&auto=format'  // billetes dólares
        },
        {
            seccion: 'Economía', categoria: 'Economía',
            titulo: 'Inflación de octubre: 3,2% y acumulado anual del 120%',
            resumen: 'El INDEC confirmó una desaceleración, pero la meta anual sigue siendo alta.',
            fecha: 'Hace 3 hs',
            imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&auto=format'  // gráfico economía inflación
        },
        {
            seccion: 'Economía', categoria: 'Economía',
            titulo: 'El BCRA baja la tasa de interés al 60%',
            resumen: 'La medida busca incentivar el crédito y reactivar la economía.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&auto=format'  // banco finanzas
        },
        {
            seccion: 'Economía', categoria: 'Economía',
            titulo: 'Bolsas argentinas: el Merval sube 5% en la semana',
            resumen: 'Los papeles financieros lideran ganancias por expectativas electorales.',
            fecha: 'Hace 7 hs',
            imagen: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&h=250&fit=crop&auto=format'  // gráfico bolsa valores
        },
        {
            seccion: 'Economía', categoria: 'Economía',
            titulo: 'Gobierno lanza nuevo bono para ahorristas minoristas',
            resumen: 'El título ajustable por CER ofrece rendimiento del 4% mensual.',
            fecha: 'Hace 9 hs',
            imagen: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&auto=format'  // ahorro inversión
        },
        {
            seccion: 'Economía', categoria: 'Economía',
            titulo: 'Exportaciones récord: soja y carne impulsan el ingreso de divisas',
            resumen: 'El campo liquidó más de 2000 millones de dólares en el mes.',
            fecha: 'Hace 11 hs',
            imagen: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop&auto=format'  // campo soja cosecha
        },

        // ── TECNOLOGÍA ────────────────────────────────────────────
        {
            seccion: 'Tecnología', categoria: 'Tecnología',
            titulo: 'ChatGPT-5 ya está disponible en Argentina',
            resumen: 'OpenAI lanzó la versión gratuita con razonamiento avanzado.',
            fecha: 'Hace 2 hs',
            imagen: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop&auto=format'  // inteligencia artificial
        },
        {
            seccion: 'Tecnología', categoria: 'Tecnología',
            titulo: 'Starlink conecta a 200 localidades rurales',
            resumen: 'El servicio satelital de Musk ya cubre zonas apartadas del país.',
            fecha: 'Hace 4 hs',
            imagen: 'https://images.unsplash.com/photo-1446776709462-d6b525b97512?w=400&h=250&fit=crop&auto=format'  // satélite espacio
        },
        {
            seccion: 'Tecnología', categoria: 'Tecnología',
            titulo: 'China presenta el procesador más rápido del mundo',
            resumen: 'El chip \'Tianhe-6\' supera a los de Intel y AMD en pruebas.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&auto=format'  // chip procesador
        },
        {
            seccion: 'Tecnología', categoria: 'Tecnología',
            titulo: 'Meta lanza su nueva plataforma de realidad virtual',
            resumen: 'El metaverso de Facebook ahora integra avatares hiperrealistas.',
            fecha: 'Hace 7 hs',
            imagen: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=250&fit=crop&auto=format'  // realidad virtual VR
        },
        {
            seccion: 'Tecnología', categoria: 'Tecnología',
            titulo: 'Ciberseguridad: ataques a empresas argentinas aumentan un 40%',
            resumen: 'Se reportaron más de 100 incidentes críticos en el último trimestre.',
            fecha: 'Hace 9 hs',
            imagen: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=250&fit=crop&auto=format'  // hacker ciberseguridad
        },
        {
            seccion: 'Tecnología', categoria: 'Tecnología',
            titulo: 'Argentina aprueba ley de inteligencia artificial',
            resumen: 'La normativa regula el uso ético de IA y protege datos personales.',
            fecha: 'Hace 11 hs',
            imagen: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=250&fit=crop&auto=format'  // ley regulación tecnología
        },

        // ── CULTURA ───────────────────────────────────────────────
        {
            seccion: 'Cultura', categoria: 'Cultura',
            titulo: 'Descubrimiento arqueológico en Mendoza: restos de civilización',
            resumen: 'Hallan herramientas y cerámicas que datan del año 800 d.C.',
            fecha: 'Hace 3 hs',
            imagen: 'https://images.unsplash.com/photo-1599413987323-b2b8c0d7d9c8?w=400&h=250&fit=crop&auto=format'  // arqueología excavación
        },
        {
            seccion: 'Cultura', categoria: 'Cultura',
            titulo: 'Feria del Libro de Buenos Aires: récord de visitantes',
            resumen: 'Más de 2 millones de personas pasaron por la feria en 20 días.',
            fecha: 'Hace 5 hs',
            imagen: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop&auto=format'  // feria libros
        },
        {
            seccion: 'Cultura', categoria: 'Cultura',
            titulo: 'Estreno mundial: nueva película de Almodóvar en el festival',
            resumen: 'El cineasta español presenta su obra más personal y crítica.',
            fecha: 'Hace 6 hs',
            imagen: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop&auto=format'  // cine películas festival
        },
        {
            seccion: 'Cultura', categoria: 'Cultura',
            titulo: 'El teatro Colón cumple 100 años con una gala especial',
            resumen: 'El emblemático teatro ofrecerá una función única con artistas internacionales.',
            fecha: 'Hace 8 hs',
            imagen: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=250&fit=crop&auto=format'  // teatro ópera
        },
        {
            seccion: 'Cultura', categoria: 'Cultura',
            titulo: 'Museo de Bellas Artes: exhibición de arte contemporáneo',
            resumen: 'La muestra incluye obras de artistas argentinos y extranjeros.',
            fecha: 'Hace 10 hs',
            imagen: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=250&fit=crop&auto=format'  // museo arte
        },
        {
            seccion: 'Cultura', categoria: 'Cultura',
            titulo: 'Recuperan patrimonio histórico en el norte del país',
            resumen: 'Se restauraron documentos coloniales que estaban en riesgo.',
            fecha: 'Hace 12 hs',
            imagen: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=250&fit=crop&auto=format'  // documentos históricos patrimonio
        }
    ];

    // --------------------------------------------------------------
    // 4. RENDERIZADO DE LA GRILLA Y SIDEBAR
    // --------------------------------------------------------------
    const contenedorGrid = document.getElementById('contenedorNoticias');
    const contadorSpan = document.getElementById('contadorSeccion');
    const sidebarNav = document.getElementById('listaSecciones');
    const sidebar = document.getElementById('sidebarSecciones');
    const overlay = document.getElementById('overlaySidebar');
    const botonAbrirSidebar = document.getElementById('botonAbrirSidebar');
    const botonCerrarSidebar = document.getElementById('cerrarSidebarBtn');

    let seccionActiva = 'Todas';

    function renderNoticias(seccion) {
        seccionActiva = seccion;
        let filtradas = (seccion === 'Todas') ? todasLasNoticias : todasLasNoticias.filter(n => n.seccion === seccion);

        if (contadorSpan) contadorSpan.textContent = `(${filtradas.length} historias)`;

        if (!contenedorGrid) return;
        contenedorGrid.innerHTML = '';
        filtradas.forEach(noti => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta-noticia';
            tarjeta.innerHTML = `
                <img class="imagen-noticia" src="${noti.imagen}" alt="${noti.titulo}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop'">
                <div class="contenido-noticia">
                    <span class="categoria">${noti.categoria}</span>
                    <h3 class="titulo-noticia">${noti.titulo}</h3>
                    <p class="resumen-noticia">${noti.resumen}</p>
                    <div class="fecha-publicacion">🕒 ${noti.fecha} · 📰 Actualidad 360</div>
                </div>
            `;
            contenedorGrid.appendChild(tarjeta);
        });

        document.querySelectorAll('.btn-filtro-sidebar').forEach(btn => {
            btn.classList.toggle('activo', btn.dataset.seccion === seccion);
        });
    }

    function crearSidebar() {
        if (!sidebarNav) return;
        sidebarNav.innerHTML = '';
        const todas = ['Todas', ...secciones];
        todas.forEach(sec => {
            const btn = document.createElement('button');
            btn.className = 'btn-filtro-sidebar';
            btn.dataset.seccion = sec;
            btn.textContent = sec === 'Todas' ? '📰 Todas' : sec;
            btn.addEventListener('click', function() {
                renderNoticias(sec);
                cerrarSidebar();
                document.querySelector('.seccion-noticias').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            sidebarNav.appendChild(btn);
        });
        document.querySelector('.btn-filtro-sidebar[data-seccion="Todas"]')?.classList.add('activo');
    }

    function abrirSidebar() {
        sidebar.classList.add('abierto');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    function cerrarSidebar() {
        sidebar.classList.remove('abierto');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    if (botonAbrirSidebar) botonAbrirSidebar.addEventListener('click', abrirSidebar);
    if (botonCerrarSidebar) botonCerrarSidebar.addEventListener('click', cerrarSidebar);
    if (overlay) overlay.addEventListener('click', cerrarSidebar);

    crearSidebar();
    renderNoticias('Todas');

    // --------------------------------------------------------------
    // 5. CARRUSEL TIKTOK – imágenes temáticas específicas
    // --------------------------------------------------------------
    const noticiasTikTok = [
        {
            id: 1,
            titulo: '🔥 BALAZO EN RECITAL: pánico en el estadio',
            descripcion: 'Dos heridos leves tras incidentes afuera del Movistar Arena. La policía investiga.',
            imagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop&auto=format',  // recital concierto
            categoria: 'Último Momento'
        },
        {
            id: 2,
            titulo: '💰 DÓLAR BLUE a $1.095: qué esperar esta semana',
            descripcion: 'Economistas proyectan estabilidad tras el acuerdo con el FMI. Mirá el análisis completo.',
            imagen: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=600&fit=crop&auto=format',  // billetes dólares
            categoria: 'Economía'
        },
        {
            id: 3,
            titulo: '🎾 ARGENTINA CAMPEÓN: Davis Cup emocionante',
            descripcion: 'La selección argentina de tenis vence a Australia en definición vibrante. Celebraciones.',
            imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=600&fit=crop&auto=format',  // tenis cancha
            categoria: 'Deportes'
        },
        {
            id: 4,
            titulo: '🤖 CHATGPT-5 disponible gratis en Argentina',
            descripcion: 'OpenAI lanza la nueva versión con razonamiento avanzado. Millones de usuarios.',
            imagen: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=600&fit=crop&auto=format',  // inteligencia artificial
            categoria: 'Tecnología'
        },
        {
            id: 5,
            titulo: '🌧️ Alerta meteorológica: tormentas fuertes',
            descripcion: 'El SMN anuncia lluvias intensas para el AMBA. Recomiendan no circular.',
            imagen: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=400&h=600&fit=crop&auto=format',  // tormenta lluvia
            categoria: 'Clima'
        },
        {
            id: 6,
            titulo: '🚇 Nuevo subte: ampliación de la Línea H',
            descripcion: 'El gobierno porteño inaugura dos estaciones más. Beneficio para 200 mil usuarios.',
            imagen: 'https://images.unsplash.com/photo-1474487548417-781cb6d646b2?w=400&h=600&fit=crop&auto=format',  // subte metro
            categoria: 'Ciudad'
        },
        {
            id: 7,
            titulo: '🎬 Estreno mundial: nueva película de Almodóvar',
            descripcion: 'El cineasta español presenta su obra más personal. Críticas positivas.',
            imagen: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format',  // cine festival
            categoria: 'Espectáculos'
        },
        {
            id: 8,
            titulo: '💡 Corte de luz masivo en CABA: 30 mil afectados',
            descripcion: 'Un desperfecto técnico dejó sin servicio a varios barrios. Ya restablecieron.',
            imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&auto=format',  // cables electricidad
            categoria: 'Sociedad'
        },
        {
            id: 9,
            titulo: '⚽ Boca vs River: la final de copa se acerca',
            descripcion: 'El superclásico definirá el campeón. Expectativa total en el mundo futbolero.',
            imagen: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=600&fit=crop&auto=format',  // estadio fútbol
            categoria: 'Deportes'
        },
        {
            id: 10,
            titulo: '🚀 SpaceX lanza satélites argentinos',
            descripcion: 'Misión exitosa: mejorarán la conectividad en zonas rurales del país.',
            imagen: 'https://images.unsplash.com/photo-1446776709462-d6b525b97512?w=400&h=600&fit=crop&auto=format',  // cohete lanzamiento
            categoria: 'Innovación'
        }
    ];

    const carruselDiv = document.getElementById('carruselTikTok');
    function llenarCarrusel() {
        if (!carruselDiv) return;
        carruselDiv.innerHTML = '';
        noticiasTikTok.forEach(noti => {
            const slide = document.createElement('div');
            slide.className = 'tarjeta-tiktok';
            slide.innerHTML = `
                <img class="img-tiktok" src="${noti.imagen}" alt="${noti.titulo}" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=600&fit=crop'">
                <div class="info-tiktok">
                    <span class="categoria-tiktok">${noti.categoria}</span>
                    <div class="titulo-tiktok">${noti.titulo}</div>
                    <div class="descripcion-tiktok">${noti.descripcion}</div>
                    <div style="font-size:0.7rem; margin-top:8px;">🔄 Desliza ➕ Más noticias</div>
                </div>
            `;
            carruselDiv.appendChild(slide);
        });

        let bloqueo = false;
        carruselDiv.addEventListener('scroll', function() {
            if (bloqueo) return;
            const scrollTop = carruselDiv.scrollTop;
            const scrollHeight = carruselDiv.scrollHeight;
            const clientHeight = carruselDiv.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight - 30) {
                bloqueo = true;
                carruselDiv.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => { bloqueo = false; }, 800);
            }
        });
    }

    // Modal TikTok
    const modal = document.getElementById('modalTikTok');
    const abrirBtn = document.getElementById('botonAbrirTikTok');
    const cerrarBtn = document.getElementById('cerrarTikTokBtn');

    function abrirModal() {
        if (!modal) return;
        if (carruselDiv && carruselDiv.children.length === 0) llenarCarrusel();
        modal.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        if (carruselDiv) carruselDiv.scrollTop = 0;
    }
    function cerrarModal() {
        modal.classList.remove('abierto');
        document.body.style.overflow = '';
    }
    if (abrirBtn) abrirBtn.addEventListener('click', abrirModal);
    if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

    window.addEventListener('load', llenarCarrusel);

    const dolarSpan = document.querySelector('.dolar-hoy');
    if (dolarSpan && !dolarSpan.innerHTML.includes('1.095')) {
        dolarSpan.innerHTML = '<span>💵 Dólar hoy</span> $1.095';
    }

})();