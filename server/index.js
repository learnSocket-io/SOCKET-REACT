//require은 임포트 업그레이드 버전?? import > require
//바벨에서 찍어보면 불안한 경우가 있다 import했을떄 뜨는 에러가 있다@@
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

//왜 http가 소켓을 하는데 코드안에 포함되어있을까
//stomp sub프로토콜

//첫 연결을 위해서 http신을 준비
const server = http.createServer(app);
// require로 불러온 class Server의 인스턴스를 만들어주고
const io = new Server(server, {
  //연결할때 사용할 cors..?
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //onAny 모든 요청들
  socket.onAny((e) => {
    console.log(`SocketEvent:${e}`);
  });
  //   console.log(socket.id);

  //소켓 io의 가장 큰 장점

  socket.on("nickName", (nickname) => {
    
    socket["nickname"] = nickname;
    console.log(socket["nickname"]);
    
  });

  socket.on("send_message", (data, func) => {
    
    data['nickname'] = 'player'; //socket.nickname 필요
    console.log("asdfasdfasdf",data)
    
    socket.to(data.room).emit("receive_message", data);
    func();
    //func(data.state);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });
});

//http 연결시 3000으로 진행하기 때문에 다른 port 값을 지정한것?
server.listen(3001, () => {
  console.log("SErver is Listening");
});



//내가 치는것과 남이 치는것. 구분