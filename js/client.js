
const socket = io('http://localhost:8000');
//Get DOM variables in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio will play on receiving messages
var audio=new Audio('ting.mp3');

// //Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

// // if the form get submitted,send message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You:${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

//ask new user for name and let the server know
const name = prompt("Enter your Name to join");
socket.emit('new-user-joined',name);

//If new user joins,receive the event from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
});
 
// //If servers sends a message,receive it
socket.on('receive', data => {
    append(`${data.name}:${data.message}`, 'left')
});

// //If user leave the chat,append the info to the container
socket.on('left', data => {
    append(`${data.name} left the chat`, 'left')
});