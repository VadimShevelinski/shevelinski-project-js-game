const canvas = document.getElementById("canvas");
canvas.width =  window.innerWidth * 0.7;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.left = ((canvas.width/7) * 1.5) + 'px';
const ctx = canvas.getContext("2d");

document.addEventListener("mousedown", click);
ctx.imageSmoothingEnabled = false;

const FPS = 60;

let points = 0;
let scoreTime = 0;


let spawnTime = 0;
let animationTime = 0;
let playerFrame = 0;
let botFrame = 0;
let bots = [];

function update(){
    draw();
    if(player.alive){
        updatePlayer();
        updateBuilding();
        updateStar();
        updateBots();
        checkBottomCollision();
        checkPlayerCollision();
        trackTime();
    }
}

function trackTime(){
    if(animationTime === 6){
        managePlayerAnimation();
        manageBotAnimation();
        animationTime = 0;
    }
    if(scoreTime === 100){
        points ++;
        scoreTime = 0;
    }
    animationTime ++;
    scoreTime ++;
}

function restartGame(){
    player.alive = true;
    star.x = 1032;
    points = 0;
    bots = [];
}

function click(){
    if(player.alive){
        if(!player.jumping && !player.falling){
            player.jumping = true;
        }
    }
    else{
        restartGame();
    }
}

setInterval(update, 1000 / FPS);
