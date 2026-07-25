const Klotski = {
    size: 4,
    board: [],
    moves: 0,
    timer: null,
    seconds: 0,
    started: false,
    won: false,
    emptyIndex: -1,

    init() {
        document.getElementById('mode3').addEventListener('click', () => this.setMode(3));
        document.getElementById('mode4').addEventListener('click', () => this.setMode(4));
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());

        this.setMode(4);
    },

    setMode(size) {
        this.size = size;
        document.getElementById('mode3').classList.toggle('active', size === 3);
        document.getElementById('mode4').classList.toggle('active', size === 4);
        this.newGame();
    },

    solvedBoard() {
        const total = this.size * this.size;
        return Array.from({ length: total }, (_, i) => (i + 1) % total);
    },

    shuffleBoard() {
        let board = this.solvedBoard();
        let empty = board.indexOf(0);
        const total = this.size * this.size;
        const shuffleMoves = this.size === 3 ? 120 : 250;

        for (let i = 0; i < shuffleMoves; i++) {
            const neighbors = this.getNeighbors(empty);
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            board[empty] = board[next];
            board[next] = 0;
            empty = next;
        }

        if (this.isSolved(board)) {
            const neighbors = this.getNeighbors(empty);
            const next = neighbors[0];
            board[empty] = board[next];
            board[next] = 0;
            empty = next;
        }

        this.board = board;
        this.emptyIndex = empty;
    },

    getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / this.size);
        const col = index % this.size;

        if (row > 0) neighbors.push(index - this.size);
        if (row < this.size - 1) neighbors.push(index + this.size);
        if (col > 0) neighbors.push(index - 1);
        if (col < this.size - 1) neighbors.push(index + 1);

        return neighbors;
    },

    newGame() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.started = false;
        this.won = false;
        this.updateStats();
        this.setMessage('');
        this.shuffleBoard();
        this.render();
    },

    resetGame() {
        this.newGame();
    },

    startTimer() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateTime();
        }, 1000);
    },

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    updateStats() {
        document.getElementById('moveCount').textContent = this.moves;
        this.updateTime();
    },

    updateTime() {
        const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const s = (this.seconds % 60).toString().padStart(2, '0');
        document.getElementById('timeDisplay').textContent = `${m}:${s}`;
    },

    setMessage(text) {
        document.getElementById('gameMessage').textContent = text;
    },

    render() {
        const boardEl = document.getElementById('klotskiBoard');
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

        const tileSize = this.size === 3 ? 90 : 68;
        boardEl.style.width = `${this.size * tileSize + (this.size - 1) * 8 + 20}px`;

        this.board.forEach((value, index) => {
            const tile = document.createElement('div');
            tile.className = 'klotski-tile';
            tile.style.height = `${tileSize}px`;
            if (value === 0) {
                tile.classList.add('empty');
            } else {
                tile.textContent = value;
                if (this.canMove(index)) tile.classList.add('movable');
                if (this.won) tile.classList.add('won');
                tile.addEventListener('click', () => this.handleTileClick(index));
            }
            boardEl.appendChild(tile);
        });
    },

    canMove(index) {
        return this.getNeighbors(this.emptyIndex).includes(index);
    },

    handleTileClick(index) {
        if (this.won || !this.canMove(index)) return;

        this.board[this.emptyIndex] = this.board[index];
        this.board[index] = 0;
        this.emptyIndex = index;
        this.moves++;

        if (!this.started) {
            this.started = true;
            this.startTimer();
        }

        if (this.isSolved(this.board)) {
            this.won = true;
            this.stopTimer();
            const wonText = (typeof I18N !== 'undefined' && I18N.t('tools.klotski.won')) || 'You solved it!';
            this.setMessage(`${wonText} ${this.moves} moves · ${this.formatTime(this.seconds)}`);
        }

        this.updateStats();
        this.render();
    },

    isSolved(board) {
        for (let i = 0; i < board.length - 1; i++) {
            if (board[i] !== i + 1) return false;
        }
        return board[board.length - 1] === 0;
    },

    formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Klotski.init();
});
