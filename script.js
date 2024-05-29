const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;
const friction = 0.9;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    dx: 0,
    dy: 1,
    speed: 5
};

const obstacles = [];
const obstacleWidth = 100;
const obstacleHeight = 20;
const obstacleGap = 200;

let gameOver = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        ball.dx = -ball.speed;
    } else if (e.key === 'ArrowRight') {
        ball.dx = ball.speed;
    }
});

document.addEventListener('keyup', () => {
    ball.dx = 0;
});

function createObstacle() {
    const obstacleX = Math.random() * (canvas.width - obstacleWidth);
    const obstacleY = -obstacleHeight;
    obstacles.push({ x: obstacleX, y: obstacleY });
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#00f';
    ctx.fill();
    ctx.closePath();
}

function drawObstacles() {
    ctx.fillStyle = '#f00';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx * friction;
    }

    if (ball.y + ball.radius > canvas.height) {
        gameOver = true;
    }

    ball.dy += gravity;
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += ball.speed;
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
        }

        if (
            ball.x + ball.radius > obstacle.x &&
            ball.x - ball.radius < obstacle.x + obstacleWidth &&
            ball.y + ball.radius > obstacle.y &&
            ball.y - ball.radius < obstacle.y + obstacleHeight
        ) {
            gameOver = true;
        }
    });

    if (obstacles.length < 5) {
        createObstacle();
    }
}

function draw() {
    if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '48px serif';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawObstacles();
    updateBall();
    updateObstacles();

    requestAnimationFrame(draw);
}

draw();
