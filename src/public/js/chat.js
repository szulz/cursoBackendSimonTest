const chatBox = document.getElementById('chat-box');
let nombreUsuario = '';

async function pushChat(user, msg) {
  try {
    const msgChat = { user, msg };
    const response = await fetch('/chat', {
      method: 'post',
      body: JSON.stringify(msgChat),
      headers: {
        'content-type': 'application/json',
      },
    }).then((result) => {
      console.log(JSON.stringify(result));
    });
  } catch (error) {}
}

async function chatMsg() {
  try {
    const url = 'http://localhost:8080/current/user';
    const data = {};
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        nombreUsuario = data.user.email;
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(JSON.stringify(error));
      });
    chatBox.addEventListener('keydown', async function (e) {
      e.stopPropagation();

      if (e.key === 'Enter') {
        const msg = chatBox.value;
        chatBox.value = '';

        await pushChat(nombreUsuario, msg);
        socket.emit('Mensaje pusheado a BD', { msg });
        await renderAllMessages();
      }
    });
  } catch (error) {}
}

async function renderAllMessages() {
  const url = 'http://localhost:8080/chat/getchat';
  const data = {};
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
  const chat = res.chat;
  const html = chat.messages
    .map((elem) => {
      let fragment = `
      <ul id=${elem._id} style='margin-bottom:30px;'>
      <div id="${elem.user}">${elem.user}</div>
      <div id="msg">Message: ${elem.msg}</div>
      <div>ID: ${elem._id}</div>
    </ul>
     `;
      return fragment;
    })
    .join('\n');
  document.getElementById('chat-messages').innerHTML = html;
}



chatMsg();
