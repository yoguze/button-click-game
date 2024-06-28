from flask import Flask, request, jsonify
import time

app = Flask(__name__)
click_count = 0
game_started = False
start_time = 0
game_duration = 30  # seconds

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    global game_started, click_count, start_time
    if not game_started:
        game_started = True
        click_count = 0
        start_time = time.time()
        return jsonify({'message': 'Game started!'})
    else:
        return jsonify({'message': 'Game already started!'})

@app.route('/increment_count', methods=['POST'])
def increment_count():
    global click_count
    if game_started:
        click_count += 1
        return jsonify({'click_count': click_count})
    else:
        return jsonify({'message': 'Game not started!'})

@app.route('/get_time_left', methods=['GET'])
def get_time_left():
    global game_started, start_time
    if game_started:
        elapsed_time = time.time() - start_time
        time_left = max(0, game_duration - int(elapsed_time))
        return jsonify({'time_left': time_left})
    else:
        return jsonify({'time_left': 0})

if __name__ == '__main__':
    app.run(debug=True)
