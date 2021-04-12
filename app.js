
const express = require('express')
const INDEX = '/index.html';
const app = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server });
var ClientNew = []
var singleRoom = []
var rooms = []
var worlds = []
createRoomsInWorlds()
var clientID = 0
wss.on('connection', function connection(ws) {
  console.log('A new client Connected!:');
  ws.send('Welcome New Client!');
  ws.on('close', function close() {

    for (var i = 0; i < ClientNew.length; i++) {
      if (ClientNew[i].Client == ws) {

        console.log('disconnected:' + ClientNew[i].ClientUserName);
        removeElement(ClientNew, i)
        console.log("client count: " + ClientNew.length)

      }


    }


  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    const obj = JSON.parse(message.toString());
    console.log(obj.method)
    if (obj.method === "connection") {
      clientID = clientID + 1
      const wsclient = {
        "Client": ws,
        "ClientID": clientID,
        "ClientUserName": obj.username
      }
      ClientNew.push(wsclient)

      const payLoad = {
        "ClientID": ClientNew[0].ClientID,
        "ClientUserName": ClientNew[0].ClientUserName
      }

      ws.send("Message: welcome " + JSON.stringify(payLoad));
      //   for (var i=0; i<ClientNew.length; i++) {

      //     ClientNew[i].Client.send("Message:"+ClientNew[i].ClientUserName );
      // }

    }
    if (obj.method === "createRoom") {
      var roomNumber = obj.roomNumber

      //RoomIndividual.pus
      if (roomNumber > 0 && roomNumber < 10) {
        loop1:
        for (i = 0; i < worlds[roomNumber - 1].length; i++) {
          if (worlds[roomNumber - 1][i].length == 1) {

            for (var k = 0; k < ClientNew.length; k++) {
              if (ClientNew[k].Client == ws) {

                var newClientEnter = {
                  "Client": ClientNew[k].Client,
                  "ClientID": ClientNew[k].ClientID,
                  "ClientUserName": ClientNew[k].ClientUserName
                }
                worlds[roomNumber - 1][i].push(newClientEnter)
                worlds[roomNumber - 1][i][0].roomCap = worlds[roomNumber - 1][i][0].roomCap - 1
                ws.send("Message: Create Room Successfully");
                break loop1;
              }
            }

          }
     
          else {
            ws.send("Message: Create Room Unsuccessfully");
          }
        }
      }
      else {
        ws.send("Message: Create Room Unsuccessfully");
      }

      //console.log(worlds[0])
    }
    if (obj.method === "inviteFriends") {
      var UserName=obj.username
      var roomNumber=obj.roomNumber
      var roomNumber = obj.roomNumber
      var FriendsList = obj.Friends

      for (i=0;i<FriendsList.length;i++)
      {
        for (var i = 0; i < ClientNew.length; i++) {
          if (ClientNew[i].ClientUserName == FriendsList[i]) {
            ClientNew[i].Client.send("Message:"+UserName+" invite to room"+roomNumber );
          }
      }
    }
   }
   if (obj.method === "acceptInvitation") {
    var UserName=obj.username
    var roomNumber=obj.roomNumber
    var roomNumber = obj.roomNumber
    loop1:
    for (i = 0; i < worlds[roomNumber - 1].length; i++) {
    if(worlds[roomNumber-1][i][0].roomCap!=0&&worlds[roomNumber-1][i].length>1)
    {
     
      for (var k=0; k<ClientNew.length; k++) {
        if(ClientNew[k].Client==ws)
        {

          var newClientEnter ={
          "ClientID":ClientNew[k].ClientID,
          "ClientUserName":ClientNew[k].ClientUserName}
          worlds[roomNumber-1][i].push(newClientEnter)
          worlds[roomNumber-1][i][0].roomCap=worlds[roomNumber-1][i][0].roomCap-1
          ws.send("Message: Enter Room Successfully");
           break loop1;
        }}
      }
    }
  
 }
 if (obj.method === "getQuiz") {

 }
 if (obj.method === "submitQuiz") {
   
}
if (obj.method === "updateQuizScore") {
   
}
    // wss.clients.forEach(function each(client) {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(message);
    //   }
    // });


  });
});

function removeElement(array, elem) {
  var index = array.indexOf(elem);
  if (elem == 0 && array.length == 1) {
    ClientNew = []
  }

  if (index > -1) {
    array.splice(index, 1);
  }

}

function createRoomsInWorlds() {
  for (i = 1; i <= 9; i++) {
    for (k = 1; k <= 2; k++) {

      var RoomIndividual = { "world": i, "roomNumber": k, "roomCap": 5 }
      singleRoom.push(RoomIndividual)
      // RoomIndividual.value3 = "value3";
      rooms.push(singleRoom)
      singleRoom = []
    }
    worlds.push(rooms)
    rooms = []

  }


}

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(8080, () => console.log(`lisening on port :8080`))