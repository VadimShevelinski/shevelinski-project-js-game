const canvas = document.getElementById("canvas");
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight - 80;//минус высота меню
const ctx = canvas.getContext("2d");
let audio = document.getElementById('audio');

document.getElementById('canvas').addEventListener("mousedown", click);

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
        checkPlayerCollision();
        checkBottomCollision();
        trackTime();
       audio.play();

    } else {
       audio.pause();
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
