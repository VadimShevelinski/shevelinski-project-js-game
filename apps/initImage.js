'use strict';

const backImage = new Image();

const building1 = {
    x: 0,
    y: canvas.height+300,
    size: 2313,
    speed: 4,
    image: new Image()
};

const building2 = {
    x: 2314,
    y: canvas.height+300,
    size: 2313,
    speed: 4,
    image: new Image()
};

const star = {
    x: 1032,
    y: 125,
    size: 32,
    xSpeed: 2,
    ySpeed: 4,
    image: new Image()
};


let playerAnimation = [];
for(let i = 0; i < 5; i++){
    playerAnimation[i] = new Image();
}

let botAnimation = [];
for(let i = 0; i < 5; i++){
    botAnimation[i] = new Image();
}

//игрок
playerAnimation[0].src = "image/player1.png";
playerAnimation[1].src = "image/player2.png";
playerAnimation[2].src = "image/player3.png";
playerAnimation[3].src = "image/player4.png";
playerAnimation[4].src = "image/player5.png";
//боты
botAnimation[0].src = "image/bot1.png";
botAnimation[1].src = "image/bot2.png";
botAnimation[2].src = "image/bot3.png";
botAnimation[3].src = "image/bot4.png";
botAnimation[4].src = "image/bot5.png";
//фон и элементы игры
backImage.src = "image/bg.jpg";
building1.image.src = "image/building1.png";
building2.image.src = "image/building1.png";
star.image.src = "image/star.png";

function managePlayerAnimation(){//анимация движения игрока
    if(player.jumping){
        player.image = playerAnimation[3];
    }
    else if(player.falling){
        player.image = playerAnimation[3];
    }
    else{
        player.image = playerAnimation[playerFrame];
        playerFrame ++;
        if(playerFrame > playerAnimation.length - 1){
            playerFrame = 0;
        }
    }
}

function manageBotAnimation(){//анимация ботов
    for(let i = 0; i < bots.length; i++){
        bots[i].image = botAnimation[botFrame];
    }
    botFrame ++;
    if(botFrame > botAnimation.length - 1){
        botFrame = 0;
    }
}