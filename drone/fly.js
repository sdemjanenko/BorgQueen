var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/fly.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function now() {
  return Date.now()
}

io.sockets.on('connection', function (socket) {
  socket.on('fly', function (data) {

    client.right(data.x || 0);
    client.front(data.y || 0);
    client.up(data.z || 0);
    client.clockwise(data.r || 0);

    if (data.takeoff)
      client.takeoff();
    if (data.land) {
      client.stop();
      client.land();
    }
  });

});


process.on('SIGINT', function() {
  console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
 	client.stop();
 	client.land();
 	setInterval(function() { process.exit(); }, 800);
});