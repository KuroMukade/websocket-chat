const ws = require('ws');

const WebSocketServer = new ws.Server(
  {
    port: 5000,
  },
  () => console.log(`Server started on 5000`),
);

WebSocketServer.on('connection', function connections(ws) {
  ws.id = Date.now();
  ws.on('message', function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case 'message':
        broadcastMessage(message);
        break;
      case 'connection':
        broadcastMessage(message);
        break;
    }
  });
});

const message = {
  event: 'message/connection',
  id: 1,
  date: Date.now(),
  username: 'Timur',
  message: 'Всем привет ребята',
};

const broadcastMessage = (message) => {
  WebSocketServer.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};
