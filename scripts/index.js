let secretNumber = Math.floor (Math.random() * 100) + 1 //Esto crea un numero aleatorio del 1 al 100 

function startGame(){
let number;
let intentos = 0;

while (number != secretNumber){
    number = parseInt(prompt("Adivina el numero (del 1 al 100), intenta lograrlo con la menor cantidad de intentos"));
    intentos++; //añade intentos
    if ( number < secretNumber)
        alert ("Demasiado bajo, prueba con uno mas alto")
    else if (number > secretNumber)
        alert ("Demasiado alto, prueba con uno mas bajo")
} 
alert("¡Muy bienn! Lograste adivinar el numero en tan solo " + intentos + " intentos y el numero era " + secretNumber + ".")
}
document.getElementById('game-number').addEventListener('click', startGame);   