// server.js
const http = require('http');
const { URL } = require('url');

// 1. IMPORTAMOS TUS MÓDULOS PROPIOS
const calculo = require('./modulos/calculo');
const textoLocal = require('./modulos/texto');
const tiempo = require('./modulos/tiempo');
const { generarMenu } = require('./modulos/menu');
const { upperCase } = require('upper-case');

// Reemplazar solo esta función en tu server.js
function armarPagina(titulo, contenidoContenedor) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titulo}</title>
        <style>
            /* --- CONFIGURACIÓN GLOBAL DE REINICIO --- */
            * { box-sizing: border-box; margin: 0; padding: 0; }

            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                background: #f1f2f6; 
                color: #2c3e50;
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                min-height: 100vh;
                transition: background 0.3s, color 0.3s;
            }

            /* --- CONTENEDOR DEL NAV --- */
            .nav-principal {
                width: 100%; 
                background: #2f3640; 
                padding: 15px 20px; 
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 4px solid #3498db;
                position: relative;
                z-index: 100;
                transition: background 0.3s, border-color 0.3s;
            }

            /* Contenedor en Escritorio (Línea recta) */
            .menu-enlaces {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 12px;
                max-width: 1000px;
                width: 100%;
            }

            /* BOTÓN HAMBURGUESA (Oculto por defecto en PC) */
            .hamburguesa {
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 5px 10px;
            }

            /* BOTONES DE NAVEGACIÓN COMPONENTES */
            .btn-nav, .btn-modo {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #3d4a5d;
                color: #ffffff; 
                text-decoration: none; 
                font-weight: bold;
                font-size: 1rem;
                padding: 12px 20px;
                border-radius: 10px;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease-in-out;
                width: auto;
            }

            .btn-nav:hover {
                background: #3498db;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
            }

            .btn-modo { background: #f1c40f; color: #2f3640; }
            .btn-modo:hover { background: #f39c12; transform: translateY(-2px); }

            /* --- CONTENEDOR CARD CONTENIDO --- */
            .card { 
                background: white; 
                padding: 40px; 
                border-radius: 20px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
                text-align: center; 
                max-width: 650px; 
                width: 90%; 
                margin: 40px auto; 
                transition: background 0.3s, color 0.3s, box-shadow 0.3s;
            }
            
            h1 { color: #2c3e50; font-size: 2rem; margin-bottom: 15px; }
            p { color: #57606f; font-size: 1.1rem; line-height: 1.6; }
            .badge { background: #3498db; color: white; padding: 8px 18px; border-radius: 30px; display: inline-block; font-size: 0.9rem; margin-top: 20px; font-weight: bold; }
            ul { text-align: left; background: #f8f9fa; padding: 25px 40px; border-radius: 12px; border-left: 6px solid #2ecc71; list-style-type: square; margin-top: 20px; }
            li { margin: 12px 0; color: #2c3e50; font-size: 1.05rem; }

            /* --- MÓVILES (MENÚ HAMBURGUESA DESPLEGABLE) --- */
            @media (max-width: 768px) {
                .nav-principal {
                    justify-content: flex-end; /* Tira el botón del menú a la derecha */
                    padding: 10px 20px;
                }

                .hamburguesa {
                    display: block; /* Muestra el botón ☰ en pantallas chicas */
                }

                .menu-enlaces {
                    display: none; /* Esconde el menú completo por defecto */
                    flex-direction: column;
                    position: absolute;
                    top: 100%; /* Aparece justo abajo del nav */
                    left: 0;
                    width: 100%;
                    background: #2f3640;
                    padding: 20px;
                    gap: 15px;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.15);
                    border-bottom: 4px solid #3498db;
                }

                /* Cuando el script agrega la clase .activo, el menú cae */
                .menu-enlaces.activo {
                    display: flex; 
                }

                .btn-nav, .btn-modo {
                    width: 100%; /* Los botones ocupan todo el ancho del celu, ideales para el dedo */
                    padding: 15px;
                    font-size: 1.05rem;
                }

                .card { padding: 25px 20px; margin: 20px auto; width: 92%; }
                h1 { font-size: 1.6rem; }
                p { font-size: 1rem; }
            }

            /* --- ESTILOS RESPONSIVE PARA MODO NOCHE --- */
            body.noche { background: #1e272e; color: #f5f6fa; }
            body.noche .nav-principal { background: #111417; border-bottom-color: #9b59b6; }
            body.noche .menu-enlaces { background: #111417; border-bottom-color: #9b59b6; }
            body.noche .btn-nav { background: #2f3640; color: #f5f6fa; }
            body.noche .btn-nav:hover { background: #9b59b6; }
            body.noche .btn-modo { background: #f5f6fa; color: #1e272e; }
            body.noche .card { background: #2f3640; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
            body.noche h1 { color: #f5f6fa; }
            body.noche p { color: #dcdde1; }
            body.noche li { color: #f5f6fa; }
            body.noche ul { background: #353b48; }
        </style>
    </head>
    <body>
        ${generarMenu()} 
        <div class="card">
            ${contenidoContenedor}
        </div>
    </body>
    </html>
    `;
}

const server = http.createServer((req, res) => {
    const base = `http://${req.headers.host}`;
    const urlCompleta = new URL(req.url, base);
    const ruta = urlCompleta.pathname;

    console.log(`📡 [URL] Host: ${urlCompleta.host} | Pathname: ${urlCompleta.pathname}`);

    let htmlResultado = '';

    switch (ruta) {
        case '/':
            htmlResultado = armarPagina(
                'Inicio - Consigna 5',
                `<h1>🏠 Página de Inicio</h1>
                 <p>Bienvenido al proyecto unificado. Usá el menú de arriba para navegar por los diferentes módulos creados en las consignas anteriores.</p>
                 <span class="badge">Consigna 5 en ejecución 🚀</span>`
            );
            break;

        case '/calculo':
            const sumaExito = calculo.sumar(15, 25);
            const promExito = calculo.promedio([10, 20, 30, 40]);
            const factExito = calculo.factorial(5);

            htmlResultado = armarPagina(
                'Módulo Cálculo',
                `<h1>🧮 Operaciones Matemáticas</h1>
                 <p>Resultados obtenidos importando tu módulo interno:</p>
                 <ul>
                    <li><strong>Suma (15 + 25):</strong> ${sumaExito}</li>
                    <li><strong>Promedio [10, 20, 30, 40]:</strong> ${promExito}</li>
                    <li><strong>Factorial de 5:</strong> ${factExito}</li>
                 </ul>`
            );
            break;

        case '/texto':
            const txtOriginal = "hola mundo desde node";
            htmlResultado = armarPagina(
                'Módulo Texto Local',
                `<h1>📝 Manipulación de Texto Local</h1>
                 <p>Analizando la cadena: <em>"${txtOriginal}"</em></p>
                 <ul>
                    <li><strong>Capitalizar:</strong> ${textoLocal.capitalizar(txtOriginal)}</li>
                    <li><strong>Invertir texto:</strong> ${textoLocal.invertir(txtOriginal)}</li>
                    <li><strong>Contar letras (sin espacios):</strong> ${textoLocal.contarLetters ? textoLocal.contarLetters(txtOriginal) : textoLocal.contarLetras(txtOriginal)}</li>
                    <li><strong>Contar palabras:</strong> ${textoLocal.contarPalabras(txtOriginal)}</li>
                 </ul>`
            );
            break;

        case '/tiempo':
            htmlResultado = armarPagina(
                'Módulo Tiempo',
                `<h1>⏰ Fecha y Hora del Sistema</h1>
                 <p>Datos provistos por tu módulo de tiempo:</p>
                 <ul>
                    <li><strong>Fecha de hoy:</strong> ${tiempo.fechaActual()}</li>
                    <li><strong>Hora exacta:</strong> ${tiempo.horaActual()}</li>
                    <li><strong>¿El año 2026 es bisiesto?:</strong> ${tiempo.esBisiesto(2026) ? 'Sí' : 'No'}</li>
                 </ul>`
            );
            break;

        case '/npm-upper':
            const fraseNormal = "este texto se procesa con la libreria externa bajada por npm!";
            const fraseTransformada = upperCase(fraseNormal);

            htmlResultado = armarPagina(
                'Módulo Terceros NPM',
                `<h1>🚀 Módulo Externo (NPM)</h1>
                 <p><strong>Original:</strong> ${fraseNormal}</p>
                 <p style="background: #fff3cd; padding: 15px; border-radius: 8px; font-weight: bold; color: #856404; margin-top: 15px;">
                    Transformado: ${fraseTransformada}
                 </p>
                 <span class="badge">upper-case funcionando correctamente</span>`
            );
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - Página no encontrada</h1>');
            return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlResultado);
});

server.listen(3000, () => {
    console.log('✅ Servidor corriendo en http://localhost:3000');
});