const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird;
let pipes = [];
let gravity = 0.6;
let birdSpeed = 0;
let score = 0;
let gameInterval;
let gameStarted = false;

canvas.width = 320;
canvas.height = 480;

function startGame() {
    gameStarted = true;
    bird = new Bird();
    pipes = [];
    score = 0;
    birdSpeed = 0;
    gameInterval = setInterval(gameLoop, 1000 / 60);
    document.getElementById("startScreen").style.display = "none";
}
function Bird() {
    this.x = 50;
    this.y = 150;
    this.width = 40;
    this.height = 50;
    
    this.image = new Image();
    this.image.src = 'image.png';

    this.draw = function() {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    this.update = function() {
        birdSpeed += gravity;
        this.y += birdSpeed;

        if (this.y + this.height > canvas.height) {
            endGame();
        }
    }

    this.flap = function() {
        birdSpeed = -10;
    }
}


function Pipe(lastPipeX) {
    this.x = lastPipeX + Math.floor(Math.random() * 200 + 150); 
    this.width = 50;
    this.gap = 170;
    this.height = Math.floor(Math.random() * (canvas.height - this.gap));

    this.draw = function() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, 0, this.width, this.height);
        ctx.fillRect(this.x, this.height + this.gap, this.width, canvas.height - this.height - this.gap);
    }

    this.update = function() {
        this.x -= 2; // Velocidade dos pipes
        if (this.x + this.width < 0) {
            pipes.shift(); 
            score++;
        }
    }

    this.collidesWithBird = function() {
        if (bird.x + bird.width > this.x && bird.x < this.x + this.width) {
            if (bird.y < this.height || bird.y + bird.height > this.height + this.gap) {
                endGame();
            }
        }
    }
}


    this.update = function() {
        this.x -= 2;
        if (this.x + this.width < 0) {
            pipes.shift();
            score++;
        }
    }

    this.collidesWithBird = function() {
        if (bird.x + bird.width > this.x && bird.x < this.x + this.width) {
            if (bird.y < this.height || bird.y + bird.height > this.height + this.gap) {
                endGame();
            }
        }
    }


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bird.update();
    bird.draw();
    
    if (Math.random() < 0.02) {
        let lastPipeX = pipes.length > 0 ? pipes[pipes.length - 1].x : 0;
        pipes.push(new Pipe(lastPipeX));
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].update();
        pipes[i].draw();
        pipes[i].collidesWithBird();
    }

    if(score > 1) {
        voceGanhou();
    }
    

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 30);
}


function endGame() {
    clearInterval(gameInterval);
    alert("Tenta ai de novo fi! Sua pontuação foi: " + score);
    document.getElementById("startScreen").style.display = "block";
    gameStarted = false;
}

function voceGanhou() {
    criarConfetes();
    clearInterval(gameInterval);
    alert("AEEE VOCÊ GANHOU! FELIZ ANIVERSÁRIO :) ");
    setTimeout(() => {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley";
    }, 3000); 
}

function criarConfetes() {
    const duration = 10 * 1000,
          animationEnd = Date.now() + duration,
          defaults = { 
              startVelocity: 30, 
              spread: 360, 
              ticks: 100,   
              zIndex: 0,
              colors: ['#ff0000', '#ff6600', '#ffcc00', '#33cc33', '#3399ff', '#9933cc'] // Cores vibrantes
          };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval); 
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        );
    }, 250);
}
document.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "ArrowUp") {
        bird.flap();
    }
});
