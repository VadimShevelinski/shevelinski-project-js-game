'use strict';

const player = {
    size: 64,
    x:300,
    y: 210,
    jumping: false,
    falling: true,
    maxJumpSpeed: 0,
    jumpOriginalValue: 12,
    jumpSpeed: 12,
    jumpAcceleration: 0.4,
    fallSpeed: 0,
    fallAcceleration: 0.6,
    alive: true,
    image: new Image(),
};

let Bot = function (x) {
    this.x = x;
    this.y = 452 - 64;
    this.size = 64;
    this.speed = 6;
    this.image = new Image();
};


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(building1.image, building1.x, building1.y);
    ctx.drawImage(building2.image, building2.x, building2.y);
    ctx.drawImage(star.image, star.x, star.y);
    ctx.drawImage(player.image, player.x, player.y - 30);
    ctx.font = "bold 40px Helvetica";
    ctx.fillStyle = "rgb(219, 186, 19)";
    ctx.textAlign = "center";
    ctx.fillText('СЧЕТ:' +points, 110, 80);
    drawBots();
    //Heroy(player.x, player.y);
   if(!player.alive){
        ctx.fillText('КЛИКНИТЕ ЧТОБЫ НАЧАТЬ ИГРУ', canvas.width*0.50, canvas.height*0.5);
    }
}

function drawBots(){
    for(let i = 0; i < bots.length; i++){
        ctx.drawImage(bots[i].image, bots[i].x, bots[i].y);
    }
}