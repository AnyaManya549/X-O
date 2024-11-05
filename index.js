//req - от клиента на сервер 
//res - от сервера клиенту

//Подключаем необходимые модули
const express = require('express');
const url = require('url');
const fs = require('fs');
const pug = require('pug');
// Получаем доступ к объекту URLSearchParams
//const search_params = current_url.searchParams;
//инициализируем экзепляр класса express, который будеет обрабатывать запросы
const app = express();
//Подключаем движок для отображения страниц из шаблонизатора PUG
app.set('view engine', 'pug');
//Подключаем папку статичных файлов,(СSS, иконки) необходимых для отрисовки страницы
app.use(express.static('public'))
//Для корректного получения данных из формы
app.use(express.urlencoded({ extended: false }))
//Для получения данных от клиента в формате .json
app.use(express.json())

//функция которая проверяет введённые данные пользователя
//в зависимости от действия, которое пользователь хочет совершить (init)
//либо добавляет запись в файл (регистрация), либо сравнивает пароли (вход)
function UserCheck(Name, Pass, Init, res) {
  //считываем файл JSON в переменную file-data
  let file_data = fs.readFileSync('users.json', 'utf-8');
  //Делаем преобразование данных для дальнейшей работы
  let data = JSON.parse(file_data);
  //Если пользователь хочет войти
  if (Init === 'Войти') {
    //проходимся по всем записям
    for (let user = 0; user < data.length; user++) {
      //ищем его имя
      if (data[user].login === Name) {
        console.log('Есть такое имя');
        //Проверяем пароль
        if (data[user].password === Pass) {
          console.log('Успешный вход');
          return res.json("Успех!");
        }
        else {
          console.log('Пароль на подходит, нужно ввести пароль заново');
          return res.json("Пароль и Логин не совпадают");
        }
      }
    }
    console.log('Пользователь с таким именем не найден, проверьте имя или зарегестрируйтесь');
    return res.json("Пароль и Логин не совпадают");
    /*res.redirect('/');
    return "Ответ сервера: Пароль и Логин не совпадают";*/
  }
  //Если пользователь хочет зарегестрироваться
  if (Init === 'Зарегестрироваться') {
    //проверяем его имя, в списке не должно быть совпадений
    for (let user = 0; user < data.length; user++) {
      if (data[user].login === Name) {
        console.log('Пользователь с таким именем уже существует');
         return res.json("Это имя занято");
      }
    }

    //записать данные в файл (логин и пароль)
    data[data.length] = { "login": `${Name}`, "password": `${Pass}` };
    fs.writeFileSync('users.json', JSON.stringify(data), { encoding: 'utf-8', flag: 'w' });
    console.log('Регистрация прошла успешно');
    return res.json("Регистрация прошла успешно");

  }
}

app.get('/', (req, res) => {
res.render('home', { Reg_: "Регистрация", In_: "Вход" })
})

app.get('/home', (req, res) => {
  res.render('home', { Reg_: "Регистрация", In_: "Вход" })
})

app.post('/rooms', (req, res) => {
  //считываем файл JSON в переменную file-data
  let file_data = fs.readFileSync('rooms.json', 'utf-8');
  //Делаем преобразование данных для дальнейшей работы
  let data = JSON.parse(file_data);
  res.json(data);
})

//Данные с формы входа/регистрации отправляются на этот адрес, тут сервер проверяет совпадение
app.post('/home', (req, res) => {
  //if(!req.query.user){ res.redirect('/')}
  userName = req.body.login;
  res.render('home', { Reg_: "Выход", In_: `Привет, ${userName}`})
})

//При отправке формы для проверки срабатывает этот метод
app.post('/', (req, res) => {
  let user = req.body;
  console.log(user.login, user.password, user.log);
  UserCheck(user.login, user.password, user.log, res)
})

app.get('/game', (req, res) => {
  res.render('game');
})

app.post('/game/', (req, res) => {
  console.log(req.body);
  //req.body = JSON.parse(req.body);
  //console.log(req.body);
  //console.log(req.headers);
  console.log(req.query);
  //res.json(req.body);
})

/*app.get('/:user', (req, res) => {
  res.render('home');
})*/



app.listen(8124, () => {
  console.log("http://localhost:8124");
});











//-------------------------Проверка чтания и записи данных
/*
let file_data = fs.readFileSync('users.json', 'utf-8');
console.log("Файл: ", file_data);
let data = JSON.parse(file_data);
console.log("Данные: ", data.length);
data[data.length] = {"login":"zxc","password":"zxc","log":"Зарегестрироваться"};
console.log("Данные: ", data.length);
console.log("Данные логина: ", data[0].login);
fs.writeFileSync('users.json', JSON.stringify(data), {encoding:'utf-8', flag: 'w'});
*/





//--------------------------------------------------------------------------------Соккеты
/*const http = require('http');
const ws = require('ws');

const wss = new ws.Server({noServer: true});

function accept(req, res) {
  // все входящие запросы должны использовать websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end();
    return;
  }

  // может быть заголовок Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
  ws.on('message', function (message) {
    let name = message.match(/([\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]+)$/gu) || "Гость";
    ws.send(`Привет с сервера, ${name}!`);

    setTimeout(() => ws.close(1000, "Пока!"), 5000);
  });
}

if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
}*/


// Создаём объект URL
/*const current_url = new URL('http://usefulangle.com/preview?id=123&typ=article');

// Получаем параметры URL
const id = search_params.get('id');
const typ = search_params.get('typ');

// Выводим значения параметров
console.log(id);  // «123»
console.log(typ);  // «article»*/
