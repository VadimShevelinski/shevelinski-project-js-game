const canvas = document.getElementById("canvas");
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight - 80;//минус высота header
//canvas.style.position = 'absolute';
//canvas.style.left = ((canvas.width/7) * 1.5) + 'px';
const ctx = canvas.getContext("2d");
let audio = document.getElementById('audio');

document.getElementById('canvas').addEventListener("mousedown", click);
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
        //audio.play();

    } else {









      /*  audio.pause();

        window.navigator.vibrate(200);
        switchToNameValid();
        console.log(points);
        score = points;
        if ( navigator.vibrate ) { // есть поддержка Vibration API?
            if ( longFlag )
                window.navigator.vibrate(100); // вибрация 100мс
            else
                window.navigator.vibrate(500); // вибрация 3 раза по 100мс с паузами 50мс
        }*/
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


//функция окончания игры
function gameOver() {
    //подсчет заработанных очков
    let scores = points;
    console.log(scores);
    //предложение ввести имя для внесения в таблицу рекордов
    let UserName = prompt('Game over!! \nЕсли хотите попасть в таблицу рекордов, введите Ваше имя', '');
    //проверка на ввод имени пользователем, отсутствие имени равносильно отказу занесения в таблицу рекордов
    if ((UserName === null) || (UserName === '')) return;
    //регулярное выражение для проверки имени
    let nameReg = /^[а-яёА-Яa-zA-Z0-9-_\\s]{0,20}$/ ;
    while (UserName.match(nameReg) === null) {
        UserName = prompt('Имя должно быть не более 20 символов. Можно использовать буквы, цифры, нижнеее подчеркивание или точки','');
        if ((UserName === null) || (UserName === '')) return;
    }
    //собираем информацию о прошедшей игре для нового участника для добавления в таблицу победителей
    WinnerNew =
        {userName: UserName, scores : scores};
    return WinnerNew;

    //вызываем функцию добавления в таблицу победителей
    AddWinners();

}

setInterval(update, 1000 / FPS);
