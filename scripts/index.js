let numeroSecreto;
let intentos;
let historialIntentos;

function iniciarJuego() {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    intentos = 0;
    historialIntentos = [];
    document.querySelector(".main__game-number").innerHTML = `
        <h3>Estoy pensando en un número entre 1 y 100...</h3>
        <input type="number" id="adivinanza" min="1" max="100" placeholder="Ingresa tu adivinanza">
        <button onclick="verificarAdivinanza()">Adivinar</button>
        <p id="mensaje"></p>
        <div id="historial"></div>
        <button onclick="reiniciarJuego()">Reiniciar</button>
    `;
}

function verificarAdivinanza() {
    const adivinanzaUsuario = Number(document.getElementById("adivinanza").value);

    // Verificador, para ver si repitio el numero
    if (historialIntentos.includes(adivinanzaUsuario)) {
        const mensaje = document.getElementById("mensaje");
        mensaje.textContent = `Ya intentaste el número ${adivinanzaUsuario}. Intenta con un número diferente.`;
        mensaje.className = "advertencia";
        return false;
    }

    intentos++;
    historialIntentos.push(adivinanzaUsuario); // Agrega la adivinanza actual al historial
    const mensaje = document.getElementById("mensaje");

    if (adivinanzaUsuario <= 0) {
        mensaje.textContent = `Que raro, el número ${adivinanzaUsuario} no lo conozco. Mejor intenta uno del 1 al 100.`;
        mensaje.className = "raro";
    } else if (adivinanzaUsuario === numeroSecreto) {
        mensaje.textContent = `¡Felicidades! Adivinaste el número en ${intentos} intentos. El número era ${numeroSecreto}.`;
        mensaje.className = "exito";
    } else if (adivinanzaUsuario < numeroSecreto) {
        mensaje.textContent = "Demasiado bajo, prueba con uno más alto.";
        mensaje.className = "fallo";
    } else {
        mensaje.textContent = "Demasiado alto, prueba con uno más bajo.";
        mensaje.className = "fallo";
    }

    actualizarHistorial(); // Llama a la función para actualizar el historial de intentos

    // Reinicia el valor del input
    document.getElementById("adivinanza").value = '';
}

function actualizarHistorial() {
    const historial = document.getElementById("historial");
    // Genera la lista de intentos con un contador para cada uno, mostrando los más recientes primero
    historial.innerHTML = `<h2>Historial de Intentos</h2><ul>${historialIntentos.slice().reverse().map((intent, index) => `<li>Intento n°${historialIntentos.length - index}: ${intent}</li>`).join('')}</ul>`;
    // Se usa slice().reverse() para invertir el orden sin modificar el arreglo original
}

function reiniciarJuego() {
    iniciarJuego(); // Reinicia el juego llamando a la función iniciarJuego
}

document.getElementById('game-number').addEventListener('click', iniciarJuego); // Añade un evento de clic para iniciar el juego
