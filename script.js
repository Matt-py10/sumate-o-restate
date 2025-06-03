document.addEventListener('DOMContentLoaded', function () {
  let categoria = '';
  let usuario = '';
  let score = 0;
  let vidas = 3;

  const usuarioInput = document.getElementById('usuario');
  const btnIniciarJuego = document.getElementById('btnIniciarJuego');
  const btnSuma = document.getElementById('btnSuma');
  const btnResta = document.getElementById('btnResta');
  const btnMultiplicacion = document.getElementById('btnMultiplicacion');
  const btnDivision = document.getElementById('btnDivision');

  // Redirige a la página del juego con la categoría seleccionada
  function iniciarJuego() {
    if (usuario.trim() === '') {
      alert('Por favor, ingresa tu nombre antes de iniciar.');
      return;
    }

    // Guarda la categoría y el nombre en el localStorage
    localStorage.setItem('usuario', usuario);
    localStorage.setItem('categoria', categoria);
    localStorage.setItem('score', score);
    localStorage.setItem('vidas', vidas);

    // Redirigir a la página del juego
    window.location.href = 'game.html';
  }

  // Asignación de eventos a los botones de categorías
  btnSuma.addEventListener('click', () => { categoria = 'Suma'; });
  btnResta.addEventListener('click', () => { categoria = 'Resta'; });
  btnMultiplicacion.addEventListener('click', () => { categoria = 'Multiplicación'; });
  btnDivision.addEventListener('click', () => { categoria = 'División'; });

  // Iniciar el juego con nombre de usuario
  btnIniciarJuego.addEventListener('click', iniciarJuego);

  // Validación y manejo del nombre de usuario
  usuarioInput.addEventListener('blur', function () {
    usuario = usuarioInput.value.trim();
  });
});
