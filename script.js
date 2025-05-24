const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const xScoreElement = document.getElementById('xScore');
const oScoreElement = document.getElementById('oScore');
let oTurn;
let xScore = 0;
let oScore = 0;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('winning-cell');
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    board.classList.remove('lose-shake');
    statusText.classList.remove('win', 'lose', 'draw');
    xScoreElement.classList.remove('blink');
    oScoreElement.classList.remove('blink');
    setBoardHoverClass();
    statusText.textContent = "X's turn";
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false, currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        statusText.textContent = `${oTurn ? "O" : "X"}'s turn`;
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function getWinningCombination(currentClass) {
    return WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function endGame(draw, winnerClass) {
    if (draw) {
        statusText.textContent = "Draw!";
        statusText.classList.add('draw');
        board.classList.add('lose-shake');
        xScoreElement.classList.remove('blink');
        oScoreElement.classList.remove('blink');
    } else {
        statusText.textContent = `${winnerClass.toUpperCase()} Wins!`;
        statusText.classList.add('win');
        const winningCombo = getWinningCombination(winnerClass);
        winningCombo.forEach(index => {
            cellElements[index].classList.add('winning-cell');
        });
        if (winnerClass === O_CLASS) {
            oScore++;
            oScoreElement.textContent = oScore;
            oScoreElement.classList.add('blink');
            xScoreElement.classList.remove('blink');
        } else {
            xScore++;
            xScoreElement.textContent = xScore;
            xScoreElement.classList.add('blink');
            oScoreElement.classList.remove('blink');
        }
    }
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}
