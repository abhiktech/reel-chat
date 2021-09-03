# ReelChat
A real-time, synchronous messaging application.<br />
**Link** - https://reel-chat.herokuapp.com/

## Technologies Used
- `Node.js` - Shows good performance for more I/O intensive and less CPU intensive use cases.
- `Express` - Well abstracted and makes tasks such as route handling, API requests, database queries, etc much simpler.
- `MongoDB` - Easy to work with, quick and agile to develop with, and provides a flexible structure.
- `Socket.io` - A JavaScript library that enables the bi-directional, event-based communication between client and server.
- `EJS` - Server-side template engine for rendering dynamic content.
- `Vanilla Javascript` - Used on the frontend to implement Socket.io and update DOM changes.
- `CSS3` - Utilized for basic styling purposes.

## Features
- Allows users to signup and login into accounts.
- Lets users create new chat rooms.
- Permits users to join existing chat rooms.
- Faciliates real-time communcation between users in the same chat room.
- Authorizes users to simultaneously participate in several chat rooms.

## Local Setup
- Clone this repository using `git pull https://github.com/abhiktech/reel-chat.git`.
- Install dependencies using `npm` by looking at `package.json`.
- *Note* : I had `nodemon` as a global dependency and I would recommend you to install it using `npm`.
- Create a `config.env` file in the `config` folder. This file is meant to define configuration variables -> `MONGO_URI` and `SESSION_SECRET`.
  - Create a new database in [MongoDB Atlas](https://account.mongodb.com/account/login) and set `MONGO_URI` to the Cluster URI. Follow the docs [here](https://docs.atlas.mongodb.com/getting-started) if you're new to this. You can even use a locally installed version of MongoDB if you want!
  - Set `SESSION_SECRET` to a secure string of your choice.

## About WebSockets and Socket.io
A `WebSocket` is a persistent connection between client and server which allows the bi-directional communication of data. It’s an alternative to the http protocol (which is strictly unidirectional) and long polling (which essentially persists the connection as long as needed but comes with the demerit that it ties up server resources). A WebSocket uses the existing TCP/IP connection between client and server. It uses the ws and wss protocol and essentially breaks the data down into discrete chunks called frames.

`Socket.io` is a JavaScript library that allows the bidirectional, event-based communication between client and server. It uses WebSockets to enable this sort of communication or falls to long polling if this protocol is unavailable (which generally should not happen for 97% of browsers or if you have a firewall, proxy or something like that). Socket.io essentially allows you to emit events and listen for these events on the other side.

## License
`MIT`
