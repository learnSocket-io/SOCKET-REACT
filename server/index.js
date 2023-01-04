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
  //   console.log(socket.id);
 
  socket["nickName"] = "익명";
  //onAny에서 소켓을 따보면 이벤트에대한 정보를 찾기.
  socket.onAny((e) => {
    //console.log(socket);
    //socket.eventNames() 에 리스들에 대한 정의가 배열로 저장됨.
    console.log(socket.eventNames());
    console.log(`SocketEvent:${e}`);
  });
  //소켓 io의 가장 큰 장점 c

  socket.on("send_message", (data, addMyMessage) => {
    // console.log(data);
    socket.to(data.room).emit("receive_message", data.msg);
    addMyMessage(data.msg);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    socket.to(data).emit("welcome", socket.nickname);
  });

  socket.on("nickName", (nickname) => {
    socket["nickName"] = nickname;

    // 전체 유저에서 필터링 필요. (io.sockets)
    // console.log(io.sockets)
    //socket ==> 내정보가 담겨있는 집합.
    // console.log(socket);
    // console.log("socket nick : ", socket.nickName);
    // console.log("socketid : ", socket.id);
    //
  });

  //////////////////////////////////////////////////////////////////////
  //연습구간
  //1 socket.emit("hello", 1, "2", { 3: "4", 5: Buffer.from([6]) });

  //2
  // socket.on("update item", (arg1, arg2, callback) => {
  //   console.log(arg1); // 1
  //   console.log(arg2); // {name: "updated"}

  //   //callback 함수에 인자가 안들어가는 이유가 뭘까요..?
  //   if (arg2 == "updated") {
  //     callback({
  //       status: "ok",
  //     });
  //   }
  // });

  //3
  // socket.on("update item", (arg1, arg2, callback) => {
  //   console.log(arg1); // 1
  //   console.log(arg2); // {name: "updated"}

  //   // 범용성의 차이가 있다. arg2['~~~'] 로 써야 더 넓은데 알아보기. 필수
  //   arg2["name"] = "updated";
  //   //arg2.name = "asdf";

  //   callback({
  //     status: "ok",
  //     arg2,
  //   });
  // });

  //4  :: 이해 :: emit에 대해 client가  5초안에 응답을 하지 않으면, 요청을 만료시킴.
  // socket.timeout(5000).emit("my-event", (err, response)=>{
  //   if(err){

  //   } else{
  //     console.log(response)
  //   }

  // })

  //5
  // socket.volatile.emit("hello", "might or might not be received");
  // --> 휘발성 이벤트
  // --> 깁노 연결이 준비되지 않은 경우 전송되지 않는 이벤트 이다.
  

  //6   :::: EventEmitter 이벤트 듣기 시작
  // # socket.on(이벤트 이름, 리스너)
      // socket.on("details", (...args) => {
      //   // ...
      // });

  // # socket.once(이벤트 이름, 리스너)



  //////////////////////////////////////////////////////////////////////

  //귓속말을 하기 위한
  // socket.on("whisper", (nickName, msg, addMyMessage) => {
  //   const targetSoc = [...io.sockets.sockets];
  //   const target = targetSoc.filter((el) => el[1].nickName === nickName);
  //   if (target[0][0]) socket.to(target[0][0]).emit("receive_message", msg);
  //   addMyMessage(msg);
  // });
});

//http 연결시 3000으로 진행하기 때문에 다른 port 값을 지정한것?
server.listen(3001, () => {
  console.log("SErver is Listening");
});

//socket.id 값
//settimeout , set interval
// 게임화면 시간바 (백엔드에서 구현해야 시간오차가 없음)
// 생각해보면 좋을것
// 게임을 진행하면서 새로고침 이벤트 발생시 -> 어떻게 대처를 할 것인가.
// 새로고침 이벤트를 발생한 사람이 방으로 나가진다면
// 이후 게임에 참여하고 있는 인원들에게 어떤 영향을 미칠것인지.
