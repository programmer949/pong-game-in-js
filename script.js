const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const body = document.body;
const width = canvas.width;
const height = canvas.height;
const paddle = {
    width: 20,
    height: 120,
    x: 10,
    y: height / 2 - 60,
    speed: 6,
    velocity: 0,
    score: 0,
};
const paddle2 = {
    x: width - 30,
    y: height / 2 - 60,
    speed: 6,
    velocity: 0,
    score: 0,
};
const comp = {
    x: width - 30,
    y: height / 2 - 60,
    score: 0,
};
const ball = {
    x: width / 2,
    y: height / 2,
    radius: 10,
    dx: 8,
    dy: 2,
};
const hitSound = new Audio("./sfx/hit.wav");
const pressed = {
    w: false,
    up: false,
    s: false,
    down: false,
};
const gameMode = { 1: false, 2: false };
let gameStarted = false;
let names;

if (!gameStarted) {
    context.fillStyle = "white";
    context.font = "80px consolas";
    context.fillText("Pong", width / 2 - 80, 80);
    context.font = "56px consolas";
    context.fillText("Press 1 to play with someone", 50.75, height / 2);
    context.fillText("Press 2 to play with computer", 50.75, height / 2 + 100);
    window.addEventListener("keydown", (e) => {
        if (!gameStarted && e.key == "1") {
            names = {
                1: prompt("Enter name for first player: ").slice(0, 30),
                2: prompt("Enter name for second player: ").slice(0, 30),
            };
            gameMode[1] = true;
            gameStarted = true;
        } else if (!gameStarted && e.key == "2") {
            gameMode[2] = true;
            gameStarted = true;
        }
    });
}

body.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() == "w") {
        pressed.w = true;
        if (paddle.velocity == paddle.speed) {
            paddle.velocity = -paddle.speed;
        }
        if (pressed.w && pressed.down) {
            paddle.velocity = -paddle.speed;
            paddle2.velocity = paddle2.speed;
        } else {
            paddle.velocity = -paddle.speed;
        }
    }
    if (gameMode[1] && e.key == "ArrowUp") {
        pressed.up = true;
        if (paddle2.velocity == paddle2.speed) {
            paddle2.velocity = -paddle2.speed;
        }
        if (pressed.up && pressed.s) {
            paddle2.velocity = -paddle.speed;
            paddle.velocity = paddle.speed;
        } else {
            paddle2.velocity = -paddle2.speed;
        }
    }
    if (e.key.toLowerCase() == "s") {
        pressed.s = true;
        if (paddle.velocity == -paddle.speed) {
            paddle.velocity = paddle.speed;
        }
        if (pressed.s && pressed.up) {
            paddle.velocity = paddle.speed;
            paddle2.velocity = -paddle2.speed;
        } else {
            paddle.velocity = paddle.speed;
        }
    }
    if (gameMode[1] && e.key == "ArrowDown") {
        pressed.down = true;
        if (paddle2.velocity == -paddle2.speed) {
            paddle2.velocity = paddle2.speed;
        }
        if (pressed.down && pressed.w) {
            paddle2.velocity = paddle2.speed;
            paddle.velocity = -paddle.speed;
        } else {
            paddle2.velocity = paddle2.speed;
        }
    }
});

body.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() == "w") {
        pressed.w = false;
        if (pressed.s) {
            paddle.velocity = paddle.speed;
        } else {
            paddle.velocity = 0;
        }
    }
    if (gameMode[1] && e.key == "ArrowUp") {
        pressed.up = false;
        if (pressed.down) {
            paddle2.velocity = paddle2.speed;
        } else {
            paddle2.velocity = 0;
        }
    }
    if (e.key.toLowerCase() == "s") {
        pressed.s = false;
        if (pressed.w) {
            paddle.velocity = -paddle.speed;
        } else {
            paddle.velocity = 0;
        }
    }
    if (gameMode[1] && e.key == "ArrowDown") {
        pressed.down = false;
        if (pressed.up) {
            paddle2.velocity = -paddle2.speed;
        } else {
            paddle2.velocity = 0;
        }
    }
});

const clear = () => context.clearRect(0, 0, width, height);

const drawPaddles = () => {
    context.fillStyle = "white";
    if (gameMode[1]) {
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        context.fillRect(paddle2.x, paddle2.y, paddle.width, paddle.height);
    } else {
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        context.fillRect(comp.x, comp.y, paddle.width, paddle.height);
    }
};

const movePaddles = () => {
    if (gameMode[1]) {
        paddle.y += paddle.velocity;
        paddle2.y += paddle2.velocity;
    } else {
        paddle.y += paddle.velocity;
        if (
            ball.y - ball.radius * 2 > paddle.height / 2 &&
            ball.y + ball.radius * 2 < height - paddle.height / 2
        ) {
            comp.y = ball.y - paddle.height / 2;
        }
    }
};

const drawBall = () => {
    context.beginPath();
    context.arc(
        Math.floor(ball.x),
        Math.floor(ball.y),
        ball.radius,
        Math.PI * 2,
        false
    );
    context.closePath();
    context.fill();
};

const moveBall = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;
};

const collisions = () => {
    const ballLeft = ball.x - ball.radius;
    const ballTop = ball.y - ball.radius;
    const ballRight = ball.x + ball.radius;
    const ballBottom = ball.y + ball.radius;
    const paddleLeft = paddle.x;
    const paddleTop = paddle.y;
    const paddleRight = paddle.x + paddle.width;
    const paddleBottom = paddle.y + paddle.height;
    const paddle2Left = paddle2.x;
    const paddle2Top = paddle2.y;
    const paddle2Bottom = paddle2.y + paddle.height;
    const compLeft = comp.x;
    const compTop = comp.y;
    const compBottom = comp.y + paddle.height;
    if (ballRight >= width - ball.radius) {
        ball.dx = -ball.dx;
        ball.dx = -8;
        paddle.score++;
    }
    if (gameMode[1] && ballLeft <= paddleLeft) {
        ball.dx = -ball.dx;
        ball.dx = 8;
        paddle2.score++;
    }
    if (gameMode[2] && ballLeft <= paddleLeft) {
        ball.dx = -ball.dx;
        ball.dx = 8;
        comp.score++;
    }
    if (ballTop <= ball.radius * 2) {
        ball.y += ball.radius;
        ball.dy = -ball.dy;
        hitSound.play();
    }
    if (ballBottom >= height - ball.radius * 2) {
        ball.y -= ball.radius;
        ball.dy = -ball.dy;
        hitSound.play();
    }
    if (ballLeft <= paddleRight + 10) {
        if (
            ballLeft <= paddleRight &&
            ballBottom >= paddleTop &&
            ballTop <= paddleBottom
        ) {
            ball.x += ball.radius * 2;
            ball.dx = -ball.dx;
            ball.dx += 0.1;
            hitSound.play();
        }
    }
    if (gameMode[1] && ballRight >= paddle2Left - 10) {
        if (
            ballRight >= paddle2Left &&
            ballBottom >= paddle2Top &&
            ballTop <= paddle2Bottom
        ) {
            ball.x -= ball.radius * 2;
            ball.dx = -ball.dx;
            ball.dx += -0.1;
            hitSound.play();
        }
    }
    if (gameMode[2] && ballRight >= compLeft - 10) {
        if (
            ballRight >= compLeft &&
            ballBottom >= compTop &&
            ballTop <= compBottom
        ) {
            ball.x -= ball.radius * 2;
            ball.dx = -ball.dx;
            ball.dx > -0.1;
            hitSound.play();
        }
    }
    if (paddleTop < 20) {
        paddle.velocity = 0;
        paddle.y = 20;
    }
    if (gameMode[1] && paddle2Top < 20) {
        paddle2.velocity = 0;
        paddle2.y = 20;
    }
    if (paddleBottom > height - 20) {
        paddle.velocity = 0;
        paddle.y = height - paddle.height - 20;
    }
    if (gameMode[1] && paddle2Bottom > height - 20) {
        paddle2.velocity = 0;
        paddle2.y = height - paddle.height - 20;
    }
};

const drawScore = () => {
    context.fillStyle = "white";
    context.font = "32px consolas";
    context.fillText(paddle.score, width / 2 - 32, 40);
    gameMode[1]
        ? context.fillText(paddle2.score, width / 2 + 15, 40)
        : context.fillText(comp.score, width / 2 + 15, 40);
};

const drawNet = () => context.fillRect(width / 2 - 1, 0, 2, height);

const checkGame = () => {
    if (gameMode[1]) {
        if (paddle.score == 10) {
            gameStarted = false;
            location.reload(),
                alert(`Winner: ${names[1] ? names[1] : "Player 1"}`);
        }
        if (paddle2.score == 10) {
            gameStarted = false;
            location.reload(),
                alert(`Winner: ${names[2] ? names[2] : "Player 2"}`);
        }
    } else {
        if (paddle.score == 10) {
            gameStarted = false;
            location.reload(), alert("Winner: You");
        }
        if (comp.score == 10) {
            gameStarted = false;
            location.reload(), alert("Winner: Computer");
        }
    }
};

const mainLoop = () => {
    if (gameStarted) {
        clear();
        drawPaddles();
        movePaddles();
        drawBall();
        moveBall();
        collisions();
        drawScore();
        drawNet();
        checkGame();
    }
    requestAnimationFrame(mainLoop);
};

mainLoop();
