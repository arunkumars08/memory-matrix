function Game(size) {
    if(size) this.size = size;
    this.setup();
}

Game.prototype.size = 5;
Game.prototype.matrix = [];
Game.prototype.increaseState = 5;
Game.user = {
    clicks: 0,
    current: [],
    score: 0,
    name: 'Player',
    bonus: 100
}
Game.current = [];
Game.level = 1;

Game.message = function(status) {
    var body = document.getElementsByTagName('body')[0];
    var className = status ? 'correct' : 'wrong';
    body.classList.add(className);
    setTimeout(() => {
        body.classList.remove(className);
        game.start();
    }, 2000);
}

Game.prototype.setup = function () {
    var promise = this.getBlocks();
    promise.then(() => {
        console.log('hi');
        this.start();
    });
    console.log('then');
}

Game.prototype.getBlocks = function () {
    this.width = Math.floor(100 / this.size);
    return new Promise((resolve, reject) => {
        for(var i = 0; i < this.size; ++ i) {
            this.matrix[i] = [];
            for(var j = 0; j < this.size; ++ j) {
                this.matrix[i][j] = {};
                ((i, j, resolve) => {
                    this.createBlock(i, j);
                    if(i === this.size - 1 && j === this.size - 1) {
                        resolve();
                    }
                })(i, j, resolve);
            }
        }
    });
}

var container = document.getElementsByClassName('memory-matrix')[0];
container.addEventListener('click', (event) => {
    var target = event.target;
    if(target.classList.contains('block')) {
        if(Game.user.clicks >= Game.level) return;
        ++ Game.user.clicks;
        var current = target.id.split('block_')[1];
        Game.user.current.push(current);
        target.classList.add('open');
    }
    if(Game.current.indexOf(current) === -1) {
        Game.message(false);
        this.canGrow = false;
        return;
    }
    if(Game.user.clicks === Game.level) {
        Game.message(true);
        Game.user.score += 100;
        game.changeLevel();
    }
});

Game.prototype.createBlock = function(i, j) {
    var block = document.createElement('div');
    block.id = 'block_' + i + j;
    block.classList.add('block');
    block.style.width = this.width + '%';
    block.style.height = this.width + '%';
    container.appendChild(block);
}

Game.prototype.reset = function() {
    Game.user.clicks = 0;
    Game.user.current = [];
    Game.current = [];
    Game.closeBlocks();
}

Game.prototype.openRandom = function() {
    var i = Math.floor(Math.random() * this.size);
    var j = Math.floor(Math.random() * this.size);
    var addUp = i.toString() + j.toString();
    if(Game.current.indexOf(addUp) !== -1)
        this.openRandom();

    document.getElementById('block_' + addUp).classList.add('open');
    Game.current.push(addUp);
}

Game.prototype.changeLevel = function() {
    ++ Game.level;
    Game.user.score += 100;
    Game.user.bonus += 100;
    this.canGrow = true;
}

Game.closeBlocks = function() {
    var opened = document.getElementsByClassName('open');
    var len = opened.length;
    for(var i = 0; i < len; ++ i) {
        ((i) => {
            opened[0].classList.remove('open');
        })(i);
    }
}

Game.prototype.start = function () {
    this.reset();
    if(Game.level % this.increaseState === 0 && this.canGrow) {
        ++ this.size;
        Game.user.bonus += 1000;
        container.innerHTML = '';
        var p = this.getBlocks();
        p.then(() => {
            this.handleProcess();
        });
    } else {
        this.handleProcess();
    }
    
}

Game.prototype.handleProcess = function() {
    var pr = new Promise((resolve, reject) => {
        for(var i = 0; i < Game.level; ++ i) {
            this.openRandom();
        }
        resolve();
    });
    pr.then(() => {
        setTimeout(function () {
            Game.closeBlocks();
        }, 2000)
    });
}

var game = null;
document.getElementById('score').addEventListener('click', (event) => {
    var scoreboard = document.getElementsByClassName('score-board')[0];
    scoreboard.innerHTML = 'Name: ' + Game.user.name + '<br />' + 'Score: ' + Game.user.score + '<br />' + 'Bonus: ' + Game.user.bonus + '<button id="close">Close Score</button>';
    scoreboard.style.display = 'block';
});

document.body.addEventListener('click', (event) => {
    if(event.target.id === 'close') {
        document.getElementsByClassName('score-board')[0].style.display = 'none';
    } else if(event.target.id === 'start') {
        //game.start();
        game = new Game();
    }
});