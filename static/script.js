let gameId = null;
let pollTimer = null;

const clickCountEl = document.getElementById("clickCount");
const timeLeftEl = document.getElementById("timeLeft");
const highScoreEl = document.getElementById("highScore");
const messageEl = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const clickBtn = document.getElementById("clickButton");

let highScore = Number(localStorage.getItem("highScore") || 0);
highScoreEl.textContent = highScore;

function setPlayingState(playing) {
  clickBtn.disabled = !playing;
  startBtn.disabled = playing;
}

async function startGame() {
  try {
    const res = await fetch("/start_game", { method: "POST" });
    const data = await res.json();

    gameId = data.game_id;
    clickCountEl.textContent = "0";
    timeLeftEl.textContent = String(data.time_left ?? 30);
    messageEl.textContent = "";
    setPlayingState(true);

    // サーバー時間をポーリング
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(pollTimeLeft, 250);
  } catch (e) {
    messageEl.textContent = "開始に失敗しました…";
    console.error(e);
  }
}

async function pollTimeLeft() {
  if (!gameId) return;
  try {
    const res = await fetch(`/get_time_left?game_id=${encodeURIComponent(gameId)}`);
    const data = await res.json();

    if (data.error) {
      messageEl.textContent = "ゲームIDが無効です。再度開始してください。";
      clearInterval(pollTimer);
      setPlayingState(false);
      return;
    }

    timeLeftEl.textContent = String(data.time_left);
    clickCountEl.textContent = String(data.click_count);

    if (data.is_over) {
      endGame(data.click_count);
    }
  } catch (e) {
    console.error(e);
  }
}

async function incrementCount() {
  if (!gameId) return;
  try {
    const res = await fetch("/increment_count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId })
    });
    const data = await res.json();

    if (data.error) {
      messageEl.textContent = "エラーが発生しました。";
      return;
    }

    if (data.message === "Game over" || data.time_left === 0) {
      endGame(data.click_count);
      return;
    }

    clickCountEl.textContent = String(data.click_count);
    timeLeftEl.textContent = String(data.time_left);
  } catch (e) {
    console.error(e);
  }
}

function endGame(finalScore) {
  clearInterval(pollTimer);
  pollTimer = null;
  setPlayingState(false);
  messageEl.textContent = `ゲーム終了！あなたのスコア: ${finalScore}`;

  if (finalScore > highScore) {
    highScore = finalScore;
    localStorage.setItem("highScore", String(highScore));
    highScoreEl.textContent = String(highScore);
    messageEl.textContent += "（ハイスコア更新！）";
  }
  gameId = null;
}

// イベント登録
startBtn.addEventListener("click", startGame);
clickBtn.addEventListener("click", incrementCount);
