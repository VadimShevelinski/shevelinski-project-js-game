
//*****************работа с Ajax jQuery


//переменная с адресом Ajax запросов
let AjaxHandlerScript="http://fe.it-academy.by/AjaxStringStorage2.php";
//пустой хэш для получения таблиц результатов из Ajax
let Winners = {};
//пустой массив для текущей таблицы результатов
let tableWinner = [];
//переменная для генерации пароля для Ajax
let newPassword;
//название типа игры
let nameGame = '';
//информация о новом победителе
let WinnerNew = {};
//флаг отправки через Ajax, чтобы не тормозить отображение
//при добавлении нового победителя
//true -- когда происходит отправка изменений через Ajax
let flagAddAjax = false;


var AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
/*Все отображаемые в окошке чата сообщения будут лежать в массиве MessagesA; для
облегчения работы всегда сразу документируйте, что будет элементом массива;
в данном случае, каждый элемент массива — это хэш со свойствами name и mess,
т.е. имя отправителя и текст сообщения.
Теперь подготовим функции, которые потребуются для работы чата.
*/
var MessagesA; // элемент массива - {name:'Иванов',mess:'Привет'};
var UpdatePassword;

// показывает все сообщения из MessagesA на страницу
/*Функция ShowMessages должна все сообщения из массива MessagesA показать в окошке чата.
Здесь всё просто, обращу внимание только на одну тонкость — и имя, и текст сообщения
обрабатываются функцией EscapeHTML, которая просто заменяет все используемые в HTML-коде
разметочные символы на соответствующие мнемоники. Дело в том, что имя и текст сообщения
получены от пользователей, а мы ВСЕГДА должны проверять информацию, полученную от
пользователей, и не доверять им. Что может случиться? Ну например, кто-то вставит в
своё сообщение тег <script>, который в итоге появится во всех окнах чата у ВСЕХ
 пользователей, тихо и незаметно отработает и вышлет собранную информацию через
 AJAX куда-либо на вражеский сервер. Что может получить такой зловредный код?
 Как минимум, ip-адреса пользователей, что уже немало, т.к. деанонимизирует их.
 Далее, заметьте, что этот код отработает на странице, открытой с домена чата,
 а значит, будет иметь доступ к кукам этого домена, а значит, сможет украсть
 админскую авторизацию в чате… Короче говоря, не допускайте, чтобы на страницу
 без фильтрации тегов попадал введённый пользователем текст!*/
function ShowMessages() {
    var Str = '';
    for (var M = 0; M < MessagesA.length; M++) {
        var MessageH = MessagesA[M];
        Str += "<b>" + EscapeHTML(MessageH.name) + ":</b> "
            + EscapeHTML(MessageH.mess) + "<br />";
    }
    document.getElementById('IChat').innerHTML = Str;
}

function EscapeHTML(text) {
    if (!text)
        return text;
    text = text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

// получает сообщения с сервера и потом показывает
/*Функция RefreshMessages должна запросить свежие сообщения с сервиса и
переотобразить их в окне чата. Она делает AJAX-запрос к сервису с командой
"READ" и именем строки "LOKTEV_CHAT_MESSAGES" — именно под этим именем
чат сохраняет массив сообщений.*/
function RefreshMessages() {
    $.ajax(
        {
            url: AjaxHandlerScript,
            type: 'POST',
            data: {f: 'READ', n: 'LOKTEV_CHAT_MESSAGES'},
            cache: false,
            success: ReadReady,
            error: ErrorHandler
        }
    );
}

function ReadReady(ResultH) // сообщения получены - показывает
{
    if (ResultH.error !== undefined)
        alert(ResultH.error);
    else {
        MessagesA = [];
        if (ResultH.result !== "") // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление массива сообщений
            MessagesA = JSON.parse(ResultH.result);
            // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
            if (!MessagesA.length)
                MessagesA = [];
        }
        ShowMessages();
    }
}
/*Когда строка получена, вызывается функция ReadReady,
и полученная строка содержится в ResultH.result. Она очищает массив
MessagesA и затем распаковывает полученную строку.
Здесь две тонкости.
1.	Проверка на пустую строку. Ведь полученная строка может быть пустой!
Скажем, при самом первом запуске чата. JSON.parse для пустой строки вызывать
нельзя — будет ошибка! В данной же реализации, если строка пустая — MessagesA
остаётся пустым массивом, это и нужно.
2.	После распаковки проверяем, есть ли свойство length в полученном объекте.
Есть вероятность (и такое было реально), что кто-то, копируя себе в проект
код чата, под именем "LOKTEV_CHAT_MESSAGES" вместо массива сообщений чата
сохранит что-то своё, что массивом не является. В этом случае дальнейший код
"сломается" — он ведь ожидает, что MessagesA будет массивом! Данная проверка
очень неполна, скорее просто является поводом ещё раз сказать — проверяйте
полученные по сети данные!
*/

// получает сообщения с сервера, добавляет новое,
// показывает и сохраняет на сервере
/*функция — SendMessage, она должна добавить новое сообщение
из полей формы в чат. И это ей придётся делать
в несколько этапов.*/
function SendMessage() {
    UpdatePassword = Math.random();
    /*Сначала надо получить свежий массив сообщений — вдруг кто-то
    туда уже что-то написал к этому моменту? Запрашиваем у сервиса
    операцию "LOCKGET", и заметьте что мы используем в качестве
    пароля — просто Math.random()  нам же нужна любая уникальная строка,
    Math.random() быстро даёт длинную и уникальную строку.*/
    $.ajax(
        {
            url: AjaxHandlerScript,
            type: 'POST',
            data: {
                f: 'LOCKGET', n: 'LOKTEV_CHAT_MESSAGES',
                p: UpdatePassword
            },
            cache: false,
            success: LockGetReady,
            error: ErrorHandler
        }
    );
}

// сообщения получены, добавляет, показывает, сохраняет
function LockGetReady(ResultH) {
    if (ResultH.error !== undefined)
        alert(ResultH.error);
    else {
        /*Когда свежие сообщения получены, они тут же вносятся
        в массив MessagesA, уже известным нам способом.*/
        MessagesA = [];
        if (ResultH.result != "") // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление массива сообщений
            MessagesA = JSON.parse(ResultH.result);
            // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
            if (!MessagesA.length)
                MessagesA = [];
        }

        var SenderName = document.getElementById('IName').value;
        var Message = document.getElementById('IMess').value;
        MessagesA.push({name: SenderName, mess: Message});
        if (MessagesA.length > 10)
            MessagesA = MessagesA.slice(MessagesA.length - 10);

        ShowMessages();

        /*обновлённый массив сообщений сохраняется в сервис операцией "UPDATE",
        с указанием того же пароля, который был сгенерирован при операции "LOCKGET".*/
        $.ajax(
            {
                url: AjaxHandlerScript,
                type: 'POST',
                data: {
                    f: 'UPDATE', n: 'LOKTEV_CHAT_MESSAGES',
                    v: JSON.stringify(MessagesA), p: UpdatePassword
                },
                cache: false,
                success: UpdateReady,
                error: ErrorHandler
            }
        );
    }
}

// сообщения вместе с новым сохранены на сервере
function UpdateReady(ResultH) {
    if (ResultH.error != undefined)
        alert(ResultH.error);
}

function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
    alert(StatusStr + ' ' + ErrorStr);
}

/*Функции, обеспечивающие работу чата, мы подготовили. Всё что осталось сделать
при открытии страницы с чатом — вызвать уже готовую функцию RefreshMessages,
чтобы она прочитала сообщения, которые сейчас есть в чате, и отобразила их в окошке чата.*/
RefreshMessages();






























//функция для чтения через Ajax jQuery
function RefreshWinners() // получает таблицу победителей с сервера
{
    $.ajax(
        {
            url : AjaxHandlerScript,
            type : 'POST',
            data : { f : 'READ', n : 'shevelinski' },
            cache : false,
            success : ReadReady_My,
            error : ErrorHandler
        }
    );
}


// функция получает сообщения и показывает их в виде таблицы
function ReadReady_My(ResultH)
{
    if ( ResultH.error!=undefined )
        alert("Извините, таблицы рекордов временно недоступны.\n"+ResultH.error);
    else
    {
        if ( ResultH.result!="" ) // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление хэша 4-х таблиц
            Winners = JSON.parse(ResultH.result);
        }
        tableWinner = Winners;
        ShowTable();
    }
}

//функция отображения таблицы победителей
function ShowTable() // показывает таблицу
{
    let nameGame = 'новый рекорд';
    let PageHTML="";
    PageHTML+='<table>';
    PageHTML+='<caption>'nameGame</caption>';
    PageHTML+='<tr><th>Место</th><th>Имя</th><th>Очки</th></tr>';
    let lengthWinners = tableWinner.length;
    if (lengthWinners > 7) lengthWinners = 7;
    for (let i=0; i<lengthWinners; i++) {
        PageHTML+='<tr><td>'+(i+1)+'</td><td class="Name">'+tableWinner[i].userName+'</td>	<td>'+tableWinner[i]['scores']+'</td></tr>';
    }
    PageHTML+='</table>';
    document.getElementById('IPage').innerHTML=PageHTML;
}


// получает сообщения с сервера, добавляет новое, показывает и сохраняет на сервере
function AddWinners()
{
    newPassword=Math.random();
    $.ajax(
        {
            url : AjaxHandlerScript,
            type : 'POST',
            data : { f : 'LOCKGET', n : 'shevelinski', p : newPassword },
            cache : false,
            success : LockGetReady,
            error : ErrorHandler
        }
    );
}

//функция обновления строки для записи
function LockGetReady(ResultH)
{
    if ( ResultH.error!=undefined )
        alert("Извините, таблицы рекордов временно недоступны.\n"+ResultH.error);
    else
    {
        if ( ResultH.result!="" ) // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление хэша 4-х таблиц
            Winners = JSON.parse(ResultH.result);
        }

        //добавляем нового победителя
        tableWinner.push(WinnerNew);
        //сортируем таблицу по очкам
        tableWinner.sort(CompareScores);

        //чтобы не ждать обновления через Ajax меняем флаг
        flagAddAjax = true;

        //переходим на закладку с таблицей победителей
        SwitchToWinnersPage();


        //отправляем через Ajax обновленную информацию Winners
        $.ajax(
            {
                url : AjaxHandlerScript,
                type : 'POST',
                data : { f : 'UPDATE', n : 'shevelinski',
                    v : JSON.stringify(Winners), p : newPassword },
                cache : false,
                //	async : false,
                success : UpdateReady,
                error : ErrorHandler
            }
        );
    }
}

// вывод сообщения об ошибке при записи
function UpdateReady(ResultH)
{
    if ( ResultH.error!== undefined )
        alert("Извините, таблицы рекордов временно недоступны.\n"+ResultH.error);
}

//вывод сообщения об ошибке
function ErrorHandler(jqXHR,StatusStr,ErrorStr)
{
    alert("Извините, таблицы рекордов временно недоступны.\n"+StatusStr+' '+ErrorStr);

}


//------------------------------------

// отмена обработки события по умолчанию
// EventObj - объект с информацией о событии
function PreventDefault(EventObj)
{
    if ( EventObj.preventDefault )
        EventObj.preventDefault();
    else
        EventObj.returnValue=false;
}

//функция сравнения по очкам для сортировки таблицы
function CompareScores(A,B) {
    return B.scores - A.scores;
}
