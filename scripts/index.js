let juego = {
    numeroSecreto: null,
    intentos: 0,
    historialIntentos: [],
    jugadorActual: null, // Añadimos una referencia al jugador actual

    // Función para iniciar el juego
    iniciar: function () {
        Swal.fire({
            title: 'Ingresa tu nombre:',
            input: 'text',
            inputPlaceholder: 'Tu nombre (3-9 caracteres)',
            inputAttributes: {
                minlength: 3,
                maxlength: 9
            },
            showCancelButton: true,
            confirmButtonText: 'Empezar',
            cancelButtonText: 'Cancelar',
            background: '#f0f0f0', // Fondo de la alerta
            confirmButtonColor: '#4ea8de', // Color del botón de confirmación
            cancelButtonColor: '#d33', // Color del botón de cancelación
            preConfirm: (nombre) => {
                if (nombre.length < 3 || nombre.length > 9) {
                    Swal.showValidationMessage('El nombre debe tener entre 3 y 9 caracteres');
                }
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const nombreJugador = result.value.trim();
                let records = JSON.parse(localStorage.getItem('records')) || [];

                // Verificar si el nombre ya existe en los records
                this.jugadorActual = records.find(record => record.nombre.toLowerCase() === nombreJugador.toLowerCase());

                if (this.jugadorActual) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Jugador encontrado',
                        text: `¡Bienvenido de nuevo, ${nombreJugador}!`,
                        confirmButtonColor: '#4ea8de'
                    });
                } else {
                    this.jugadorActual = { nombre: nombreJugador, intentos: 0, adivinanzasCorrectas: 0, menorIntentos: Infinity };
                    records.push(this.jugadorActual);
                }

                this.numeroSecreto = Math.floor(Math.random() * 100) + 1;
                this.intentos = 0;
                this.historialIntentos = [];
                document.querySelector(".main__game-number").innerHTML = `
                    <h3>${nombreJugador}, estoy pensando en un número entre 1 y 100...</h3>
                    <input type="number" id="adivinanza" min="1" max="100" placeholder="Ingresa tu adivinanza">
                    <button id="btn-adivinar">Adivinar</button>
                    <p id="mensaje"></p>
                    <div id="historial"></div>
                    <button id="btn-reiniciar">Reiniciar</button>
                    <button id="btn-volver-a-jugar">Volver a Jugar</button>
                    <div id="records"></div>
                `;
                this.mostrarRecords(); // Mostrar los récords en todo momento

                // Detectar eventos de usuario
                document.getElementById("btn-adivinar").addEventListener("click", () => this.verificarAdivinanza());
                document.getElementById("adivinanza").addEventListener("keypress", (event) => {
                    if (event.key === 'Enter') {
                        this.verificarAdivinanza();
                    }
                });
                document.getElementById("btn-reiniciar").addEventListener("click", () => this.reiniciar());
                document.getElementById("btn-volver-a-jugar").addEventListener("click", () => {
                    this.volverAJugar();
                    Toastify({
                        text: "¡Se ha generado un nuevo número!",
                        duration: 3000,
                        gravity: "top", // `top` o `bottom`
                        position: "right", // `left`, `center` o `right`
                        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                        stopOnFocus: true, // Evita que se descarte el Toastify al pasar el mouse
                    }).showToast();
                });

                localStorage.setItem('records', JSON.stringify(records)); // Actualizar el localStorage con el nuevo jugador
            }
        });
    },

    // Función para verificar la adivinanza del jugador
    verificarAdivinanza: function () {
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
        this.jugadorActual.intentos++;

        // Comparar la adivinanza con el número secreto
        if (adivinanzaUsuario <= 0 || adivinanzaUsuario > 100) {
            mensaje.textContent = `Que raro, el número ${adivinanzaUsuario} no lo conozco. Mejor intenta uno del 1 al 100.`;
            mensaje.className = "raro";
        } else if (adivinanzaUsuario === this.numeroSecreto) {
            mensaje.textContent = `¡Felicidades, ${this.jugadorActual.nombre}! Adivinaste el número en ${this.intentos} intentos. El número era ${this.numeroSecreto}.`;
            mensaje.className = "exito";
            this.jugadorActual.adivinanzasCorrectas++;
            this.jugadorActual.menorIntentos = Math.min(this.jugadorActual.menorIntentos, this.intentos);
            this.registrarRecord(); // Registrar el récord del jugador
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
    actualizarHistorial: function () {
        const historial = document.getElementById("historial");
        historial.innerHTML = `<h2>Historial de Intentos</h2><ul>${this.historialIntentos.slice().reverse().map((intent, index) => `<li>Intento n°${this.historialIntentos.length - index}: ${intent}</li>`).join('')}</ul>`;
    },

    // Función para registrar los récords de los jugadores
    registrarRecord: function () {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        const index = records.findIndex(record => record.nombre === this.jugadorActual.nombre);
        if (index !== -1) {
            records[index] = this.jugadorActual;
        } else {
            records.push(this.jugadorActual);
        }
        records.sort((a, b) => a.menorIntentos - b.menorIntentos);
        localStorage.setItem('records', JSON.stringify(records));
        this.mostrarRecords();
    },

    // Función para mostrar los récords de los jugadores
    mostrarRecords: function () {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        const recordsDiv = document.getElementById("records");
        recordsDiv.innerHTML = `
            <h2>Récords de Jugadores</h2>
            <ul>
                ${records.map(record => `
                    <li>
                        ${record.nombre}: ${record.menorIntentos} intentos (mejor)
                        <button onclick="juego.mostrarEstadisticas('${record.nombre}')"><i class="fas fa-info-circle"></i></button>
                        <button onclick="juego.confirmarEliminar('${record.nombre}')"><i class="fas fa-trash-alt"></i></button>
                    </li>`).join('')}
            </ul>`;
    },

    // Función para mostrar las estadísticas de un jugador
    mostrarEstadisticas: function (nombre) {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        const jugador = records.find(record => record.nombre === nombre);
        if (jugador) {
            Swal.fire({
                title: `Estadísticas de ${jugador.nombre}`,
                html: `
                    <p>Total de intentos: ${jugador.intentos}</p>
                    <p>Total de adivinanzas correctas: ${jugador.adivinanzasCorrectas}</p>
                `,
                confirmButtonColor: '#4ea8de'
            });
        }
    },

    // Función para confirmar eliminación de un jugador
    confirmarEliminar: function (nombre) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.eliminarJugador(nombre);
                Swal.fire({
                    icon: 'success',
                    title: 'Jugador eliminado',
                    text: 'El jugador ha sido eliminado del historial.',
                    confirmButtonColor: '#4ea8de'
                });
            }
        });
    },

    // Función para eliminar un jugador del historial
    eliminarJugador: function (nombre) {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        records = records.filter(record => record.nombre !== nombre);
        localStorage.setItem('records', JSON.stringify(records));
        this.mostrarRecords();
    },

    // Función para reiniciar el juego
    reiniciar: function () {
        this.iniciar();
    },

    // Función para volver a jugar con un nuevo número
    volverAJugar: function () {
        this.numeroSecreto = Math.floor(Math.random() * 100) + 1;
        this.intentos = 0;
        this.historialIntentos = [];
        document.querySelector(".main__game-number").innerHTML = `
            <h3>${this.jugadorActual.nombre}, estoy pensando en un nuevo número entre 1 y 100...</h3>
            <input type="number" id="adivinanza" min="1" max="100" placeholder="Ingresa tu adivinanza">
            <button id="btn-adivinar">Adivinar</button>
            <p id="mensaje"></p>
            <div id="historial"></div>
            <button id="btn-reiniciar">Reiniciar</button>
            <button id="btn-volver-a-jugar">Volver a Jugar</button>
            <div id="records"></div>
        `;
        this.mostrarRecords(); // Mostrar los récords en todo momento

        // Detectar eventos de usuario
        document.getElementById("btn-adivinar").addEventListener("click", () => this.verificarAdivinanza());
        document.getElementById("btn-reiniciar").addEventListener("click", () => this.reiniciar());
        document.getElementById("btn-volver-a-jugar").addEventListener("click", () => this.volverAJugar());
    }
};

// Añadir un evento de clic para iniciar el juego
document.getElementById('game-number').addEventListener('click', function () {
    juego.iniciar();
});
