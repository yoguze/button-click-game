from flask import Flask, request, jsonify, render_template
import time, secrets

app = Flask(__name__)

# メモリ上の簡易ゲーム状態 { game_id: {"start": float, "duration": int, "count": int} }
games = {}
GAME_DURATION = 30  # 秒

def get_time_left(game):
    elapsed = time.time() - game["start"]
    return max(0, GAME_DURATION - int(elapsed))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_game", methods=["POST"])
def start_game():
    game_id = secrets.token_urlsafe(16)
    games[game_id] = {"start": time.time(), "duration": GAME_DURATION, "count": 0}
    return jsonify({"game_id": game_id, "time_left": GAME_DURATION})

@app.route("/increment_count", methods=["POST"])
def increment_count():
    data = request.get_json(silent=True) or {}
    game_id = data.get("game_id")
    game = games.get(game_id)
    if not game:
        return jsonify({"error": "Invalid game_id"}), 400

    if get_time_left(game) <= 0:
        return jsonify({"message": "Game over", "click_count": game["count"], "time_left": 0}), 200

    game["count"] += 1
    return jsonify({"click_count": game["count"], "time_left": get_time_left(game)})

@app.route("/get_time_left", methods=["GET"])
def get_time_left_route():
    game_id = request.args.get("game_id")
    game = games.get(game_id)
    if not game:
        return jsonify({"error": "Invalid game_id"}), 400

    time_left = get_time_left(game)
    is_over = time_left <= 0
    return jsonify({
        "time_left": time_left,
        "click_count": game["count"],
        "is_over": is_over
    })

if __name__ == "__main__":
    # 例: http://127.0.0.1:5000 で起動
    app.run(host="0.0.0.0", port=5000, debug=True)

