let clickCount = 0;
let gameStarted = false;
let timeLeft = 30;
let highScore = localStorage.getItem('highScore') || 0;

function incrementCount() {
    if (gameStarted) {
        clickCount++;
        document.getElementById('clickCount').innerText = clickCount;
    }
}

function startGame() {
    resetGame();
    gameStarted = true;
    setTimeout(updateTimeLeft, 1000);
}

function updateTimeLeft() {
    timeLeft--;
    document.getElementById('timeLeft').innerText = timeLeft;
    if (timeLeft > 0) {
        setTimeout(updateTimeLeft, 1000);
    } else {
        endGame();
    }
}

function endGame() {
    gameStarted = false;
    alert('Game Over! Your score: ' + clickCount);
    if (clickCount > highScore) {
        highScore = clickCount;
        localStorage.setItem('highScore', highScore);
        updateHighScore();
    }
}

function resetGame() {
    clickCount = 0;
    timeLeft = 30;
    document.getElementById('clickCount').innerText = clickCount;
    document.getElementById('timeLeft').innerText = timeLeft;
}

function updateHighScore() {
    document.getElementById('highScore').innerText = highScore;
}

// 初期表示時にハイスコアを更新する
window.onload = function() {
    updateHighScore();
};
