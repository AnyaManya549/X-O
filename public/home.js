//кнопка  регистрации = [0], войти = [1] 
const button_log = document.querySelectorAll("button.header");
//затемнение экрана
const dark = document.querySelector('.dark-screen');
//форма входа/регистрации
const form_log = document.querySelector('form');
//Кнопка новой игры
const new_game = document.querySelector('.new_game')
//Строки таблицы открытых комнат
const tables = document.querySelectorAll('tbody');
console.log(tables[1]);
TableRoom();//Заполнение таблицы доступных игр
//TableRating(); Пока не работает

//запросить у сервера данные
/*fetch('/rooms')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Ошибка:', error))*/
async function getData(url) {
  const response = await fetch(url, { method: "POST"});
  const json = await response.json();
  return json;// читает тело ответа в формате JSON 
}

async function TableRoom() {
  let rooms = await getData('/rooms');
  for (let data of rooms) {
    let td = `<td>${data.url}</td>`;
    tables[1].insertAdjacentHTML('beforeend', td);
  }
}

//пока не работает
async function TableRating() {
  let rating = await getData('/rating');
  for (let data of rating) {
    let td = `<td>${data}</td>`;
    tables[0].insertAdjacentHTML('beforeend', td);
  }
}

//const data = getData("http://localhost:8124/Anya/?user=Manya");

function Log_Reg(i) {
  //текстовые поля формы, которые надо изменить в зависимости от способа входа заголовок = 0 кнопка действия = 1
  const form_log_text = document.querySelectorAll('.log');
  //Если человек хочет войти/посмотреть свой аккаунт и нажал на кнопку.[1]
  if (i === 1) {
    //И на его кнопке было написано "войти"
    if (button_log[i].innerText == "Вход") {
      form_log_text[0].innerText = "Вход";
      form_log_text[1].value = "Войти";
      //включили затемнение и показали форму
      dark.style.visibility = 'visible';
      form_log.style.visibility = 'visible';
    }
    //Если человек хочет посмотреть свой аккаунт
    else {
      return alert("Эта страница находится в разработке");
    }
  }
  //Если человек вместо входа хочет зарегестрироваться
  else {
    //И на кнопке написано Регистрация, меняем надписи в форме
    if (button_log[i].innerText == "Регистрация") {
      form_log_text[0].innerText = "Регистрация";
      form_log_text[1].value = "Зарегестрироваться";
      //включили затемнение и показали форму
      dark.style.visibility = 'visible';
      form_log.style.visibility = 'visible';
    }
    //Если человек уже вошёл, то на кнопке будет написано "Выход", она перенапрявляет человека на главную страницу
    //И удаляет его имя
    else {
      location.replace('/');
      sessionStorage.removeItem('id');
    }
  }
}


//Кнопка входа
button_log[1].addEventListener('click', function (event) {
  // event.preventDefault();
  Log_Reg(1);

});
//кнопка регистрации
button_log[0].addEventListener('click', function (event) {
  // event.preventDefault();
  Log_Reg(0);

});

//При отправки формы любым способ создаёт запрос на сервер для проверки данных
form_log.addEventListener('submit', function (event) {
  event.preventDefault();
  const Login = document.getElementById("login")
  const Password = document.getElementById("password");
  const Log = document.getElementsByName('log')[0];
  const Alert = document.getElementById('alert')
  if (Login.value === '') {
    //сделать надпись в форме
    return Alert.innerText = 'Введите Логин';
  }
  if (Password.value === '') {
    //сделать надпись в форме
    return Alert.innerText = 'Введите Пароль';
  }
  const data = {
    login: Login.value,
    password: Password.value,
    log: Log.value
  }
  fetch('/', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(json => {
      Alert.innerText = json;
      if (Alert.innerText === 'Успех!') {
        //location.replace(`/home?user=${data.login}`, {method : "POST"})
        sessionStorage.setItem('id', data.login);
        console.log(sessionStorage.getItem('id'))
        form_log.action = '/home';
        form_log.submit();
      }
    })
})

//Если человек нажал на кнопку Выхода внутри формы
document.getElementsByName('log')[1].addEventListener('click', function (event) {
  //Прячем темноту и форму. Форму очищаем
  dark.style.visibility = 'hidden';
  form_log.style.visibility = 'hidden';
  form_log.reset();
});


//Кнопка новой игры
new_game.addEventListener('click', function (event) {
  if (button_log[1].innerText == "Вход") {
    return alert("Войдите для того, чтобы начать новую игру");
  }

  //Отправляет запрос на сервер для создания новой игры 

  location.replace("/game");
});


//ПРОВЕРКА НА НАЖАТИЕ НА URL КОМНАТЫ





/*const promise = new Promise(function(resolve, reject) {
  if(true){
    reject('Правда')
  }
console.log(reject);
})*/

/*async function getData() {
  const url = "http://localhost:8124/users";
  try {
    const response = await fetch(url,{method: 'GET'});
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
//let data = getData();
getData();
})



  /*fetch('/users',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));*/


/*async function test() {
  const response = fetch('/users', {
    method: 'GET'
  });
  const data = await response.json();
  return data;
}
 
test().then(data => alert(data));
});





//--------------------------------------------------------------------------------Соккеты
/*let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = function(e) {
alert("[open] Соединение установлено");
alert("Отправляем данные на сервер");
socket.send("Меня зовут Джон");
};

socket.onmessage = function(event) {
alert(`[message] Данные получены с сервера: ${event.data}`);
};

socket.onclose = function(event) {
if (event.wasClean) {
  alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
} else {
  // например, сервер убил процесс или сеть недоступна
  // обычно в этом случае event.code 1006
  alert('[close] Соединение прервано');
}
};

socket.onerror = function(error) {
alert(`[error]`);
};*/

