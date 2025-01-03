let juego = {
    numeroSecreto: null,
    intentos: 0,
    historialIntentos: [],
    jugadores: [],

    // Función para iniciar el juego
    iniciar: function() {
        const nombreJugador = prompt("Ingresa tu nombre:");
        this.jugadores.push({ nombre: nombreJugador, intentos: 0 });

        this.numeroSecreto = Math.floor(Math.random() * 100) + 1;
        this.intentos = 0;
        this.historialIntentos = [];
        document.querySelector(".main__game-number").innerHTML = `
            <h3>${nombreJugador}, estoy pensando en un número entre 1 y 100...</h3>
            <input type="number" id="adivinanza" min="1" max="100" placeholder="Ingresa tu adivinanza">
            <button onclick="juego.verificarAdivinanza()">Adivinar</button>
            <p id="mensaje"></p>
            <div id="historial"></div>
            <button onclick="juego.reiniciar()">Reiniciar</button>
            <div id="records"></div>
        `;
        this.mostrarRecords(); // Mostrar los récords en todo momento
    },

    // Función para verificar la adivinanza del jugador
    verificarAdivinanza: function() {
        const adivinanzaUsuario = Number(document.getElementById("adivinanza").value);
        const mensaje = document.getElementById("mensaje");

        // Verificar si el número ya ha sido intentado
        if (this.historialIntentos.includes(adivinanzaUsuario)) {
            mensaje.textContent = `Ya intentaste el número ${adivinanzaUsuario}. Intenta con un número diferente.`;
            mensaje.className = "advertencia";
            return;
        }

        this.intentos++;
        this.historialIntentos.push(adivinanzaUsuario);
        const jugadorActual = this.jugadores[this.jugadores.length - 1];
        jugadorActual.intentos = this.intentos;

        // Comparar la adivinanza con el número secreto
        if (adivinanzaUsuario <= 0) {
            mensaje.textContent = `Que raro, el número ${adivinanzaUsuario} no lo conozco. Mejor intenta uno del 1 al 100.`;
            mensaje.className = "raro";
        } else if (adivinanzaUsuario === this.numeroSecreto) {
            mensaje.textContent = `¡Felicidades, ${jugadorActual.nombre}! Adivinaste el número en ${this.intentos} intentos. El número era ${this.numeroSecreto}.`;
            mensaje.className = "exito";
            this.registrarRecord(jugadorActual); // Registrar el récord del jugador
        } else if (adivinanzaUsuario < this.numeroSecreto) {
            mensaje.textContent = "Demasiado bajo, prueba con uno más alto.";
            mensaje.className = "fallo";
        } else {
            mensaje.textContent = "Demasiado alto, prueba con uno más bajo.";
            mensaje.className = "fallo";
        }

        this.actualizarHistorial();
        document.getElementById("adivinanza").value = ''; // Reiniciar el valor del input
    },

    // Función para actualizar el historial de intentos
    actualizarHistorial: function() {
        const historial = document.getElementById("historial");
        historial.innerHTML = `<h2>Historial de Intentos</h2><ul>${this.historialIntentos.slice().reverse().map((intent, index) => `<li>Intento n°${this.historialIntentos.length - index}: ${intent}</li>`).join('')}</ul>`;
    },

    // Función para registrar los récords de los jugadores
    registrarRecord: function(jugador) {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        records.push(jugador);
        records.sort((a, b) => a.intentos - b.intentos);
        records = records.slice(0, 5); // Mantener solo los 5 mejores récords
        localStorage.setItem('records', JSON.stringify(records));
        this.mostrarRecords();
    },

    // Función para mostrar los récords de los jugadores
    mostrarRecords: function() {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        const recordsDiv = document.getElementById("records");
        recordsDiv.innerHTML = `<h2>Récords de Jugadores</h2><ul>${records.map(record => `<li>${record.nombre}: ${record.intentos} intentos</li>`).join('')}</ul>`;
    },

    // Función para reiniciar el juego
    reiniciar: function() {
        this.iniciar();
    }
};

// Añadir un evento de clic para iniciar el juego
document.getElementById('game-number').addEventListener('click', function() {
    juego.iniciar();
});
