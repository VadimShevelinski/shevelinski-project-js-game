
//при начальной загрузке присваиваем класс 'Active' закладке "Главная"
$('input[value="Главная"]').toggleClass('Active');
$('#Menu').on('click', 'input', function() {
    let self = $(this);
    $('.Active').toggleClass();
    self.toggleClass('Active');
});

// в закладке УРЛа будем хранить разделённые подчёркиваниями слова
// #Main - главная
// #Game - сама игра
// #Winners - таблица рекордов

// отслеживаем изменение закладки в УРЛе
// оно происходит при любом виде навигации
// в т.ч. при нажатии кнопок браузера ВПЕРЁД/НАЗАД
window.onhashchange=SwitchToStateFromURLHash;

// текущее состояние приложения
let SPAStateH={};

// устанавливает полученное состояние приложения как текущее
// и обновляет ВСЮ вариабельную часть веб-страницы
// соответственно этому состоянию
function UpdateToState(NewStateH)
{
    SPAStateH=NewStateH; // устанавливаем - это теперь текущее состояние
    // обновляем вариабельную часть страницы под текущее состояние
    let PageHTML="";
    let prizeNum = -1;
    switch ( SPAStateH.pagename )
    {
        case 'Main':
            //предварительная информация об игре и ее правилах
            $('.Active').toggleClass();
            $('input[value="Главная"]').toggleClass('Active');
            PageHTML+="</br></br><h1>НАПАДЕНИЕ БАГОВ</h1>";
            PageHTML+="<p>ВСЕ мы неоднократно встречаемся с багами, и конечно же нам хочется научиться их избегать.</p>";
            PageHTML+="<p>Данная игра предоставляет такую возможность, и более того это и есть главная задача игры!</p>";
            PageHTML+="<p>Давайте сыграем и посмотрим насколько хорошо вы справитесь с багами!</br>И главное - насколько хорошо я, как разработчик справился с этой задачей </p>";
            PageHTML+="<h3>Правила игры</h3>";
            PageHTML+="<p>Правила очень просты - кликайте, либо нажимайте на тачпад чтобы перепрыгнуть злых багов</p>";
            canvas.style.display = 'none';
            document.getElementById('IPage').style.display = 'block';
            document.getElementById('IChat').style.display = 'none';
            player.alive = false;
            break;

        case 'Game':
            //непосредственно игра
            $('.Active').toggleClass();
            $('input[value="Играть"]').toggleClass('Active');
            PageHTML+='<div id="mainFrame">';
            PageHTML+='</div>';
            canvas.style.display = 'block';
            document.getElementById('IChat').style.display = 'none';
            document.getElementById('IPage').style.display = 'none';
            break;

        case 'Winners':
            let block  = document.getElementById('IChat');
            block.style.display = 'block';
            player.alive = false;
            canvas.style.display = 'none';
            showRecords();
            break;

    }
    //вставляем новое содержимое для блока IPage
    document.getElementById('IPage').innerHTML=PageHTML;

    //если Winners осуществляем изменение параметров для игры
    if (SPAStateH.pagename == "Winners") {
        //меняем цвет текущего игрока в таблице победителей
        $('tr').eq(prizeNum).css('color','red');
    }
}

// вызывается при изменении закладки УРЛа
// а также при первом открытии страницы
// читает нужное состояние приложения из закладки УРЛа
// и устанавливает+отображает его
function SwitchToStateFromURLHash() {
    let URLHash=window.location.hash;

    // убираем из закладки УРЛа решётку
    // (по-хорошему надо ещё убирать восклицательный знак, если есть)
    let StateStr=URLHash.substr(1);

    if ( StateStr !== "" ) // если закладка непустая, читаем из неё состояние и отображаем
    {
        let PartsA=StateStr.split("_");
        let NewStateH={ pagename: PartsA[0] }; // первая часть закладки - номер страницы
        UpdateToState(NewStateH);
    }
    else
        UpdateToState( { pagename:'Main' } ); // иначе показываем главную страницу
}

// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function SwitchToState(NewStateH)
{
    // устанавливаем закладку УРЛа
    // нужно для правильной работы кнопок навигации браузера
    // (т.к. записывается новый элемент истории просмотренных страниц)
    // и для возможности передачи УРЛа другим лицам
    let StateStr=NewStateH.pagename;
    location.hash=StateStr;

    // АВТОМАТИЧЕСКИ вызовется SwitchToStateFromURLHash()
    // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
}

function SwitchToMainPage() {
    SwitchToState( { pagename:'Main' } );
}

function SwitchToWinnersPage() {
    SwitchToState( { pagename:'Winners' } );
}

function SwitchToGame() {
    SwitchToState( { pagename:'Game' } );
}

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
SwitchToStateFromURLHash();