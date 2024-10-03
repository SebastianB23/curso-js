// Borra el contenido del localStorage al cargar la página
localStorage.clear();

const cards = [
    [ { id: 1, value: '😀' }, { id: 2, value: '😀' }, { id: 3, value: '😡' }, { id: 4, value: '😡' } ],
    [ { id: 5, value: '😈' }, { id: 6, value: '😈' }, { id: 7, value: '🚀' }, { id: 8, value: '🚀' } ],
    [ { id: 9, value: '😱' }, { id: 10, value: '😱' }, { id: 11, value: '🤯' }, { id: 12, value: '🤯' } ],
    [ { id: 13, value: '🐉' }, { id: 14, value: '🐉' }, { id: 15, value: '🐧' }, { id: 16, value: '🐧' } ],
    [ { id: 17, value: '🐝' }, { id: 18, value: '🐝' }, { id: 19, value: '🦭' }, { id: 20, value: '🦭' } ],
    [ { id: 21, value: '🐢' }, { id: 22, value: '🐢' }, { id: 23, value: '🦈' }, { id: 24, value: '🦈' } ]
];

let flippedCards = [];
let matchedPairs = JSON.parse(localStorage.getItem('matchedPairs')) || [];
const totalPairs = 12; // Hay 12 parejas de cartas
let remainingTime = 180; // 3 minutos en segundos
let intervalId = null; // Variable para guardar el identificador del intervalo
let gameActive = true; // Variable que controla si el juego está activo o no

const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const divAlertaRoja = document.getElementById("alertaRoja");
const divAlertaVerde = document.getElementById("alertaVerde");
const reiniciarBtn = document.getElementById('reiniciar');

// Funciones alerta
function alertaRoja(mensaje) {
    divAlertaRoja.innerHTML = `<p>${mensaje}</p>`;
}
function alertaVerde(mensaje) {
    divAlertaVerde.innerHTML = `<p>${mensaje}</p>`;
}

// Desactivar cartas cuando el juego se detiene
function disableCards() {
    gameActive = false;
}

// Habilitar cartas cuando se reinicia el juego
function enableCards() {
    gameActive = true;
}

// Mezcla las cartas de forma individual y las agrupa nuevamente en sub-arrays de 4

function shuffleAndGroup(array) {
    
    const flattened = array.flat();
    const shuffled = flattened.sort(() => Math.random() - 0.5);
    const grouped = [];
    
    
    while (shuffled.length) {
        grouped.push(shuffled.splice(0, 4));
    }
    
    return grouped;
}

// Cargar las cartas
function loadGame() {
    
    gameBoard.innerHTML = '';
    divAlertaRoja.innerHTML = '';
    divAlertaVerde.innerHTML = '';
    
    const shuffledCards = shuffleAndGroup(cards);
    shuffledCards.flat().forEach(card => {
        
        
    const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = card.id;
        cardElement.dataset.value = card.value;
        cardElement.textContent = '💥';
        cardElement.addEventListener('click', flipCard);

        // Mostrar las cartas que ya han sido emparejadas
        
        if (matchedPairs.includes(card.id)) {
            cardElement.classList.add('matched');
            cardElement.textContent = card.value;
        }

        gameBoard.appendChild(cardElement);
    });

    enableCards(); // Permitir jugar
    startTimer(); // Iniciar el temporizador
}

// Temporizador regresivo

function startTimer() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            alertaRoja("Se acabó el tiempo");
            disableCards(); // Desactivar las cartas
            return;
        }

        remainingTime--;
        updateTimerDisplay();
    }, 1000);
}

// Actualizar el temporizador en pantalla

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Voltear la carta

function flipCard(event) {
    if (!gameActive) return; // No hacer nada si el juego está inactivo

    const clickedCard = event.target;

    if (clickedCard.classList.contains('matched') || flippedCards.includes(clickedCard)) {
        return;
    }

    clickedCard.classList.add('flipped');
    clickedCard.textContent = clickedCard.dataset.value;
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Verificar si las cartas coinciden
function checkForMatch() {
    const firstCardValue = flippedCards[0].dataset.value;
    const secondCardValue = flippedCards[1].dataset.value;

    if (firstCardValue === secondCardValue) {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');

        const firstCardId = Number(flippedCards[0].dataset.id);
        const secondCardId = Number(flippedCards[1].dataset.id);

        matchedPairs.push(firstCardId);
        matchedPairs.push(secondCardId);
        localStorage.setItem('matchedPairs', JSON.stringify(matchedPairs));

        resetTurn();
        checkWinCondition(); // Verificar si se han encontrado todas las parejas
    } 
    
    else {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.textContent = '💥';
            });
            resetTurn();
        }, 1000);
    }
}

// Verificar si el jugador ha encontrado todas las parejas

function checkWinCondition() {
    if (matchedPairs.length === totalPairs * 2) {
        alertaVerde("¡Felicitaciones, has encontrado todas las parejas!");
        clearInterval(intervalId); // Detener el temporizador
        disableCards(); // Desactivar las cartas
    }
}

// Resetear el turno

function resetTurn() {
    flippedCards = [];
}

// Función para reiniciar el juego

function resetGame() {
    localStorage.clear();
    matchedPairs = [];
    flippedCards = [];
    remainingTime = 180; // Resetear el tiempo a 3 minutos
    loadGame(); // Cargar el juego desde el inicio
}

// Escuchar el botón de reinicio
reiniciarBtn.addEventListener('click', resetGame);

// Iniciar el juego
loadGame();