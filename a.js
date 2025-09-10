const startBtn = document.getElementById("startBtn");
const clickBtn = document.getElementById("clickButton");
const status = document.getElementById("status");
// 状態を切り替える関数
function setPlayingState(playing) { 
  clickBtn.disabled = !playing; // プレイ中ならクリックボタン有効
  startBtn.disabled = playing;  // プレイ中ならスタートボタン無効
  status.textContent = playing ? "状態: プレイ中" : "状態: 待機中";
}
// 仮のゲーム開始処理
function startGame() {
  setPlayingState(true);
}
// 仮のクリック処理
function incrementCount() {
  setPlayingState(false);
}
// イベント登録
startBtn.addEventListener("click", startGame);
clickBtn.addEventListener("click", incrementCount);
