let records = new function () {
    let StringName = 'Shevel';
    let password; //переменная для хранения пароля
    let AjaxHandlerScript = 'http://fe.it-academy.by/AjaxStringStorage2.php';
    let recordsLength = 10;

    let userName, score;
    let recordStorage = {};

    this.newPlaeyr = function () {
        userName = prompt('Game over!! \nЕсли хотите попасть в таблицу рекордов, введите Ваше имя', '');
        //проверка на ввод имени пользователем, отсутствие имени равносильно отказу занесения в таблицу рекордов
        if ((userName === null) || (userName === '')) return;
        //регулярное выражение для проверки имени
        let nameReg = /^[а-яёА-Яa-zA-Z0-9-_\\s]{0,20}$/;
        while (userName.match(nameReg) === null) {
            userName = prompt('Имя должно быть не более 20 символов. Можно использовать буквы, цифры, нижнеее подчеркивание или точки', '');
            if ((userName === null) || (userName === '')) return;
        }
        //собираем информацию о прошедшей игре для нового участника для добавления в таблицу победителей
        score = points;
        /*обновлённый массив сообщений сохраняется в сервис операцией "UPDATE",
        с указанием того же пароля, который был сгенерирован при операции "LOCKGET".*/
        addNewResult(userName, score);
    };
    function loadRecords() {
        LoadStorage(ReadReady);
    }

// функция проверяет, наблал ли игрок достаточно очков, чтобы попасть в таблицу рекордов,
// и возвращает это значение, добавляет его в таблицу
    function addRecordToTable() {
        let addPossible = false;
        let userScoreExists;
        let userResult = {
            name: userName,
            score: score
        };
        // пытаемся найти в таблице результат этого игрока
        let existingUserScore = recordStorage.filter(function (result) {
            return userName === result.name;
        });
        userScoreExists = existingUserScore.length > 0;

        // (если нашли) проверям, набрал ли он больше очков, чем в прошлый раз
        if (userScoreExists) {
            if (existingUserScore[0].score < score) {
                // (если да) перезаписываем его очки
                addPossible = true;
                existingUserScore[0].score = score;
            }
        }
        else {
            // (если не нашли) проверяем, есть ли в таблице свободное место
            if (recordStorage.length < recordsLength) {
                // (если да) записываем результат в конец таблицы
                recordStorage.push(userResult);
                addPossible = true;
            }
            else {
                // (если нет) сверяем очки игрока с последним результатом)
                if (recordStorage[recordStorage.length - 1].score < score) {
                    // (если у игрока больше) записываем результат игрока вместо последнего результата
                    recordStorage[recordStorage.length - 1] = userResult;
                    addPossible = true;
                }
            }
        }
        // сортируем таблицу и вызываем UpdateStorage
        recordStorage.sort(Compare);
        UpdateStorage();
        return addPossible;
    }

    function UpdateStorage() {
        $.ajax({
                url: AjaxHandlerScript,
                type: 'POST',
                data: {
                    f: 'UPDATE', n: StringName,
                    v: JSON.stringify(recordStorage), p: password
                },
                cache: false,
                success: UpdateReady,
                error: ErrorHandler
            }
        );
    }


    function LoadStorage() {
        $.ajax({
                url: AjaxHandlerScript,
                type: 'POST',
                data: {f: 'READ', n: StringName},
                cache: false,
                success: ReadReady,
                error: ErrorHandler
            }
        );
    }

// функция получает сообщения и показывает их в виде таблицы
    function ReadReady(ResultH) {
        if (ResultH.error != undefined)
            alert("Извините, таблицы рекордов временно недоступны.\n" + ResultH.error);
        else {
            recordStorage = tableFromString(ResultH.result);
            ShowTable();
        }
    }

//функция отображения таблицы победителей
    function ShowTable() {
        let PageHTML = "",
            name,
            score;
        PageHTML += '<table>';
        PageHTML += '<tr><th>Место</th><th>Имя игрока</th><th>Очки</th></tr>';

        for (let i = 0; i < recordStorage.length; i++) {
            name = recordStorage[i].name;
            score = recordStorage[i].score;
            PageHTML += '<tr><td>' + (i + 1) + '</td><td class="userName">' + name + '</td><td class="userScore">' + score + '</td></td></tr>';
        }

        PageHTML += '</table>';
        $('#IChat').empty().append(PageHTML);
    }

// функция добавляет данные в хэш и отправляет обновленный хэш на сервер
    function AddUsers() {
        password = Math.random();
        $.ajax({
                url: AjaxHandlerScript,
                type: 'POST',
                data: {f: 'LOCKGET', n: StringName, p: password},
                cache: false,
                success: LockGetReady,
                error: ErrorHandler
            }
        );
    }

    function tableFromString(json) {
        let result = [];
        if (json != '') {
            result = JSON.parse(json);
        }
        if (!(result instanceof Array)) {
            result = [];
        }
        return result;
    }


    function LockGetReady(ResultH) {
        if (ResultH.error != undefined) {
            alert("Извините, таблицы рекордов временно недоступны.\n" + ResultH.error);
        } else {
            recordStorage = tableFromString(ResultH.result);


            if (!addRecordToTable()) {
                alert("Вы набрали недостаточно очков для таблицы рекордов");
            }
        }
        showRecords();
    }


// вывод сообщения об ошибке при записи
    function UpdateReady(ResultH) {
        if (ResultH.error !== undefined) {
            alert("Извините, таблицы рекордов временно недоступны.\n" + ResultH.error);
        }

    }

//вывод сообщения об ошибке
    function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
        alert("Извините, таблицы рекордов временно недоступны.\n" + StatusStr + ' ' + ErrorStr);
    }

//функция сравнения по времени для сортировки таблицы
    function Compare(A, B) {
        return B.score - A.score;
    }

     function addNewResult(userNameToSave, scoreToSave) {
        userName = userNameToSave || 'Anonymous';
        score = Math.round(scoreToSave);
        AddUsers();
    }

    this.getHighscores = function () {
        return loadRecords();
    }
};