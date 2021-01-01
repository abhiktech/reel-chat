const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Obtaining username and room

const username = document.getElementById('username').innerText;
const room = document.getElementById('room-name').innerText;


const socket = io();

// Join chatroom

socket.emit('joinRoom', {username, room});


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

// Add a new user

socket.on('addUser', (new_user) => {
    document.getElementById('users').innerHTML += "<li>" + new_user + "</li>";
});

// Message submit event listener

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Extracting the message

    const msg = e.target.elements.msg.value;

    // Sending the message to the server

    socket.emit('chatMessage', msg, username, room);

    // Clearing input after sending a message

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});


// Output message to DOM

outputMessage = (message) => {
    // Implementing DOM Manipulation
    const d = new Date();
    let hours = d.getHours();
    
    let am_or_pm;

    if(hours < 12) {
        am_or_pm = "am";
    } else {
        am_or_pm = "pm";
    }

    if(hours == 0 || hours == 12) {
        hours = 12;
    } else {
        hours = hours % 12;
    }

    const time = hours  + ":" + d.getMinutes() + " " + am_or_pm;

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

