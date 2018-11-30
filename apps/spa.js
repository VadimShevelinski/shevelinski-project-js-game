
//при начальной загрузке присваиваем класс 'Active' закладке "Главная"
$('input[value="Главная"]').toggleClass('Active');
$('#Menu').on('click', 'input', function() {
    let self = $(this);
    $('.Active').toggleClass();
    self.toggleClass('Active');
});

// в закладке УРЛа будем хранить разделённые подчёркиваниями слова
// #Main - главная
// #Game - сама игра в пятнашки
// #Settings - настройки для игры в пятнашки
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
    //место в общем зачете
    let prizeNum = -1;
    switch ( SPAStateH.pagename )
    {
        case 'Main':
            //предварительная информация об игре и ее правилах
            $('.Active').toggleClass();
            $('input[value="Главная"]').toggleClass('Active');
            PageHTML+="</br></br><h3>игра НАПАДЕНИЕ БАГОВ</h3>";
            PageHTML+="<p>ВСЕ мы неоднократно встречаемся с багами, и конечно же нам хочеться научиться их избегать.</p>";
            PageHTML+="<p>Данная игра предоставляет такую возможность, и более того это и есть главная задача игры!</p>";
            PageHTML+="<p>Давайте сыграем и посмотрим насколько хорошо вы справитесь с багами!</br>И главное - насколько хорошо я, как разработчик справился с этой задачей </p>";
            PageHTML+="<h4>Правила игры</h4>";
            PageHTML+="<p>Правила очень просты - кликайте, либо нажимайте на тачпад чтобы перепрыгнуть злых багов</p>";
            canvas.style.display = 'none';
            break;

        case 'Game':
            //непосредственно игра
            $('.Active').toggleClass();
            $('input[value="Играть"]').toggleClass('Active');
            PageHTML+='<div id="mainFrame"> \
							      <button id="start1" onclick="restartGame()">Начать игру сначала</button>\
                    </div>';
            canvas.style.display = 'block';
            break;


        case 'Winners':
            //таблица победителей
            $('.Active').toggleClass();
            $('input[value="Таблица рекордов"]').toggleClass('Active');
            //если сейчас не происходит отправка изменений
            if (flagAddAjax === false) {
                //обновляем таблицу победителей используя Ajax
                RefreshWinners();
            } else {
                //обновляем таблицу победителей данными, которые  сейчас отправляются через Ajax

                nameGame = 'jnkjn';
                PageHTML+='<table>';
                PageHTML+='<tr><th>Место</th><th>Имя</th><th>Очки</th></tr>';
                //текст поздравления или сожаления
                let textOut =""
                for (let i=0; i<tableWinner.length; i++) {
                    //выводим только семь победителей
                    if (i<7) {
                        PageHTML+='<tr><td>'+(i+1)+'</td><td class="Name">'+tableWinner[i].userName+'</td>	<td>'+tableWinner[i]['scores']+'</td></tr>';
                    };
                    if (tableWinner[i] == WinnerNew) prizeNum = i+1;
                };
                if (prizeNum < 7) { textOut = 'Поздравляем!! Вы заняли '+prizeNum+'-е место';
                } else {
                    textOut = 'К сожалению, Вы заняли в общем зачете '+prizeNum+'&#8209е место и не вошли в семерку лидеров.';
                };
                PageHTML+='</table>';
                if (textOut !='') {
                    PageHTML+='<p>'+textOut+'</p>';
                    PageHTML+='<p>Количество набранных очков: '+ tableWinner[prizeNum-1].scores +'.</br>Время игры: ' +tableWinner[prizeNum-1].timeGame +'. </br>Количество перемешиваний: '+ tableWinner[prizeNum-1].stepsMix+'. </br>Количество сделанных ходов: '+ tableWinner[prizeNum-1].steps +'.</p>'
                };
                //очищаем информацию про нового игрока
                WinnerNew = undefined;
                //снимаем флаг отправки сообщения через Ajax
                flagAddAjax = false;
            }
            canvas.style.display = 'none';
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

    if ( StateStr!="" ) // если закладка непустая, читаем из неё состояние и отображаем
    {
        let PartsA=StateStr.split("_")

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

function SwitchToMainPage()
{
    SwitchToState( { pagename:'Main' } );
}

function SwitchToWinnersPage()
{
    SwitchToState( { pagename:'Winners' } );
}

function SwitchToGame()
{
    SwitchToState( { pagename:'Game' } );
}

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
SwitchToStateFromURLHash();