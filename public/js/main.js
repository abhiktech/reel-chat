const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from URL

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom

socket.emit('joinRoom', {username, room});

// Catching a message from the server

socket.on('message', (message) => {
    outputMessage(message);

    // Scroll down 

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit event listener

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Extracting the message

    const msg = e.target.elements.msg.value;

    // Sending the message to the server

    socket.emit('chatMessage', msg);

    // Clearing input after sending a message

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});


// Output message to DOM

outputMessage = (message) => {
    // Implementing DOM Manipulation

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};
