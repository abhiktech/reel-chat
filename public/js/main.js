const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const room_name = document.getElementById('room-name');

// Get username and room from URL

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom

socket.emit('joinRoom', {username, room});

// Applying the room name
 
room_name.innerHTML = "<div>" + room + "</div>";


// Catching a message from the server

socket.on('message', (message) => {
    outputMessage(message);
    
    // Scroll down 

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Displaying active users in the room

socket.on('displayUsers', (users) => {
    // Display user names on screen
    
    let users_view = document.getElementById('users'); 
    users_view.innerHTML = "";

    for(let i = 0; i < users.length; ++i) {
        
        users_view.innerHTML += "<li>" + users[i] + "</li>";
    }
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
