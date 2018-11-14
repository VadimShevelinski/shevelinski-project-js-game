'use strict';
//анимация звезды
function updateStar(){
    if(star.y <= 125){
        star.ySpeed = 4;
    }
    if(star.y >= 275){
        star.ySpeed = - 4;
    }
    if(star.x + star.size < 0){
        star.x = 1032;
    }
    star.x -= star.xSpeed;
    star.y += star.ySpeed;
}

//анимация прыжка героя
function updatePlayer(){
    if(player.jumping){
        if(player.jumpSpeed > player.maxJumpSpeed){
            player.y -= player.jumpSpeed;
            player.jumpSpeed -= player.jumpAcceleration;
        }
        else{
            player.jumpSpeed = player.jumpOriginalValue;
            player.jumping = false;
            player.falling = true;
        }
    }
    else if(player.falling){
        player.y += player.fallSpeed;
        player.fallSpeed += player.fallAcceleration;
    }
}

//анимация стен
function updateBuilding(){
    if(building1.x + building1.size < 0){
        building1.x = building2.x + building2.size;
    }
    if(building2.x + building2.size < 0){
        building2.x = building1.x + building1.size;
    }
    building1.x -= building1.speed;
    building2.x -= building2.speed;
}

//появление и движение ботов
function updateBots(){
    if(spawnTime === 200){
        generatePacksOfBots();
        spawnTime = 0;
    }
    spawnTime ++;
    for(let i = 0; i < bots.length; i++){
        if(bots[i].x + bots[i].size < 0){
            bots.splice(i, 1);
        }
        bots[i].x -= bots[i].speed;
    }
}

//генерируем группу или одного ботов
function generatePacksOfBots(){
    const numBots = Math.floor(Math.random() * 2);
    switch(numBots){
        case 0:
            bots.push(new bot(canvas.width));
            break;
        case 1:
            bots.push(new bot(canvas.width));
            bots.push(new bot(canvas.width + 70));
            break;
        case 2:
            bots.push(new bot(canvas.width));
            bots.push(new bot(canvas.width + 70));
            bots.push(new bot(canvas.width + 140));
            break;
    }
}
