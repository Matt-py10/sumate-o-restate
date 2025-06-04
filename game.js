// Variables globales
let usuario = localStorage.getItem('usuario') || 'Jugador';
let categoria = localStorage.getItem('categoria') || 'Suma';
let score = 0;
let vidas = 3;
let fallosConsecutivos = 0;
let juegoTerminado = false;
let currentExercise = null;
let timer = null;

// Inicializar el juego cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const categoriaElem = document.getElementById('cat');
    const ejercicioElem = document.getElementById('ejercicio');
    const respuestaElem = document.getElementById('respuesta');
    const resultadoElem = document.getElementById('resultado');
    const scoreElem = document.getElementById('score');
    const vidasElem = document.getElementById('vidas');
    const siguienteBtn = document.getElementById('siguiente');
    const procesoElem = document.getElementById('proceso');
    const verificarBtn = document.getElementById('verificar');
    const terminarJuegoBtn = document.getElementById('terminarJuego');

    // Inicializar la UI
    categoriaElem.textContent = `Hola ${usuario}, La operación es: ${categoria}`;
    scoreElem.textContent = `Puntaje: ${score}`;
    vidasElem.textContent = `Vidas: ${vidas}`;
    siguienteBtn.style.display = 'none';

    // Asignar eventos
    if (verificarBtn) {
        verificarBtn.addEventListener('click', verificar);
    }
    
    if (siguienteBtn) {
        siguienteBtn.addEventListener('click', siguienteEjercicio);
    }
    
    if (terminarJuegoBtn) {
        terminarJuegoBtn.addEventListener('click', function() {
            finalizarJuego('Juego terminado por el usuario.', true);
        });
    }
    
    if (respuestaElem) {
        respuestaElem.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !respuestaElem.disabled && !juegoTerminado) {
                verificar();
            }
        });
    }

    // Añadir estilos para las animaciones y el modal
    const style = document.createElement('style');
    style.textContent = `
        .pocas-vidas {
            color: #e74c3c !important;
            animation: parpadeo 1s infinite;
        }
        @keyframes parpadeo {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .operacion {
            font-size: 1.2em;
            margin-bottom: 5px;
        }
        .resultado {
            font-weight: bold;
            color: #3498db;
            font-size: 1.4em;
        }
    `;
    document.head.appendChild(style);

    // Generar primer ejercicio
    currentExercise = generarEjercicio();
});

// Generar un ejercicio
function generarEjercicio() {
    if (juegoTerminado) return null;

    const ejercicioElem = document.getElementById('ejercicio');
    const procesoElem = document.getElementById('proceso');
    const respuestaElem = document.getElementById('respuesta');
    const resultadoElem = document.getElementById('resultado');
    const siguienteBtn = document.getElementById('siguiente');
    const verificarBtn = document.getElementById('verificar');

    let num1, num2, resultado;
    let operator = '';
    const min = 1;
    let max;

    switch (categoria) {
        case 'Suma':
            max = 9999999;
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;
            resultado = num1 + num2;
            operator = '+';
            break;
        case 'Resta':
            max = 9999999;
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (num1 - min + 1)) + min;
            resultado = num1 - num2;
            operator = '-';
            break;
        case 'Multiplicación':
            max = 99999;
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;
            resultado = num1 * num2;
            operator = '×';
            break;
        case 'División':
            max = 9999999;
            num2 = Math.floor(Math.random() * (99 - min + 1)) + min;
            resultado = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * resultado;
            operator = '÷';
            break;
        default:
            max = 9999999;
            num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            num2 = Math.floor(Math.random() * (max - min + 1)) + min;
            resultado = num1 + num2;
            operator = '+';
    }

    ejercicioElem.textContent = `Resuelve: ${num1} ${operator} ${num2}`;
    procesoElem.innerHTML = '';
    respuestaElem.value = '';
    resultadoElem.textContent = '';
    siguienteBtn.style.display = 'none';
    
    respuestaElem.disabled = false;
    if (verificarBtn) verificarBtn.disabled = false;
    respuestaElem.focus();
    
    return { num1, num2, operator, resultado };
}

// Verificar respuesta
function verificar() {
    if (juegoTerminado || !currentExercise) return;
    
    const respuestaElem = document.getElementById('respuesta');
    const resultadoElem = document.getElementById('resultado');
    const scoreElem = document.getElementById('score');
    const vidasElem = document.getElementById('vidas');
    const procesoElem = document.getElementById('proceso');
    const siguienteBtn = document.getElementById('siguiente');
    const verificarBtn = document.getElementById('verificar');
    
    const respuesta = parseFloat(respuestaElem.value);
    
    
    if (isNaN(respuesta)) {
        resultadoElem.textContent = 'Por favor ingresa un número válido.';
        resultadoElem.style.color = 'orange';
        return;
    }

    if (respuesta !== currentExercise.resultado) {
        procesoElem.innerHTML =`
        <style>
          .operacion.operator {
              position: relative;
              left: -120px;
          }
        </style>
        <div class="operacion">${currentExercise.num1}</div>
        <div class="operacion operator">${currentExercise.operator}</div>
        <div class="operacion">${currentExercise.num2}</div>
        <div class="linea">_______________</div>
        <div class="resultado">${currentExercise.resultado}</div>
        `;
        fallosConsecutivos++;
        vidas--;
        resultadoElem.textContent = `Incorrecto. Te quedan ${vidas} vidas.`;
        resultadoElem.style.color = '#e74c3c';
    } else {
        procesoElem.innerHTML = `
        <style>
          .operacion.operator {
              position: relative;
              left: -120px;
          }
        </style>
        <div class="operacion">${currentExercise.num1}</div>
        <div class="operacion operator">${currentExercise.operator}</div>
        <div class="operacion">${currentExercise.num2}</div>
        <div class="linea">_______________</div>
        <div class="resultado">${currentExercise.resultado}</div>
        `;
        score += 10;
        resultadoElem.textContent = '¡Correcto! +10 puntos';
        resultadoElem.style.color = '#2ecc71';
        fallosConsecutivos = 0;
    }

    scoreElem.textContent = `Puntaje: ${score}`;
    vidasElem.textContent = `Vidas: ${vidas}`;
    actualizarEstiloVidas();
    
    respuestaElem.disabled = true;
    if (verificarBtn) verificarBtn.disabled = true;
    
    if (vidas <= 0) {
        finalizarJuego('¡Game Over! Te has quedado sin vidas.', false);
        return;
    }
    
    if (fallosConsecutivos >= 3) {
        finalizarJuego('¡Game Over! Has fallado 3 veces consecutivas.', false);
        return;
    }

    siguienteBtn.style.display = 'block';
    resetTimer();
}

// Siguiente ejercicio
function siguienteEjercicio() {
    if (juegoTerminado) return;
    
    clearTimeout(timer);
    currentExercise = generarEjercicio();
}

// Finalizar juego
function finalizarJuego(mensaje, manual) {
    juegoTerminado = true;
    
    const resultadoElem = document.getElementById('resultado');
    const respuestaElem = document.getElementById('respuesta');
    const verificarBtn = document.getElementById('verificar');
    const siguienteBtn = document.getElementById('siguiente');
    
    resultadoElem.textContent = mensaje;
    resultadoElem.style.color = '#e74c3c';
    
    respuestaElem.disabled = true;
    if (verificarBtn) verificarBtn.disabled = true;
    siguienteBtn.style.display = 'none';
    
    clearTimeout(timer);
    
    setTimeout(() => {
        mostrarModalResultado(manual);
    }, 1500);
}

// Mostrar modal con resultado
function mostrarModalResultado(manual) {
    const modal = document.getElementById('modal');
    const mensajeResultadoElem = document.getElementById('mensajeResultado');
    const mensajeMotivacionalElem = document.getElementById('mensajeMotivacional');
    
    let mensajeResultado = `Puntaje final: ${score} | Categoría: ${categoria}`;
    
    let mensajeMotivacional = "";
    if (manual) {
        mensajeMotivacional = "Te esperamos nuevamente. ¡Hasta la próxima!";
    } else {
        if (score >= 100) {
            mensajeMotivacional = "¡Increíble! Eres un genio de las matemáticas. ¡Sigue así!";
        } else if (score >= 50) {
            mensajeMotivacional = "¡Muy bien! Vas por buen camino. Con un poco más de práctica serás imparable.";
        } else {
            mensajeMotivacional = "¡No te rindas! La práctica hace al maestro. ¡Inténtalo de nuevo!";
        }
    }
    
    mensajeResultadoElem.textContent = mensajeResultado;
    mensajeMotivacionalElem.textContent = mensajeMotivacional;
    
    // Asegurarse de que el botón tenga el texto correcto
    const reiniciarBtn = document.querySelector('#modal button:first-of-type');
    if (reiniciarBtn) {
        reiniciarBtn.textContent = 'Volver al inicio';
    }
    
    modal.style.display = 'block';
}

// Volver al inicio
function reiniciarJuego() {
    window.location.href = 'index.html';
}

// Volver al menú principal
function volverAlMenu() {
    window.location.href = 'index.html';
}

// Resetear timer para siguiente ejercicio
function resetTimer() {
    if (juegoTerminado) return;
    
    clearTimeout(timer);
    timer = setTimeout(() => {
        siguienteEjercicio();
    }, 10000);
}

// Actualizar estilo de vidas
function actualizarEstiloVidas() {
    const vidasElem = document.getElementById('vidas');
    if (vidas <= 1) {
        vidasElem.classList.add('pocas-vidas');
    } else {
        vidasElem.classList.remove('pocas-vidas');
    }
}
