'use strict';

function checkBottomCollision(){
    if(player.y + player.size >= building1.y){
        player.y = building1.y - player.size;
        player.falling = false;
        player.fallSpeed = 0;
        player.jumpSpeed = player.jumpOriginalValue;
    }
}

function checkPlayerCollision(){
    let reduction = 10;
    for(let i = 0; i < bots.length; i++){
        let testBot = bots[i];
        if(testBot.x + reduction < player.x + player.size - reduction &&
            testBot.x + testBot.size - reduction > player.x + reduction &&
            testBot.y + reduction < player.y + player.size - reduction &&
            testBot.y + testBot.size - reduction > player.y + reduction){
            player.alive = false;
            records.newPlaeyr();
            //SwitchToWinnersPage();

        }
    }
    reduction = 5;
    if(star.x + reduction < player.x + player.size - reduction &&
        star.x + star.size - reduction > player.x + reduction &&
        star.y + reduction < player.y + player.size - reduction &&
        star.y + star.size - reduction > player.y + reduction){
        star.x = 1100;
        points += 10;
    }

}



function showRecords() {
    records.getHighscores();
}