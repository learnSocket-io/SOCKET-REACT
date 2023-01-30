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

//변수 설정 부분
const blackCardList = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];
const whiteCardList = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

io.on("connection", (socket) => {
  //   console.log(socket.id);

  socket["nickName"] = "익명";
  // socket.onAny==> 이벤트가 발생할 때 실행될 리스너를 추가
  // 반대의 개념으로 socket.offAny( [리스너] ) :: 범용 리스너를 제거할 수 있음.
  socket.onAny((e) => {
    console.log(socket.eventNames());
    //console.log(socket);
    //socket.eventNames() 에 리스들에 대한 정의가 배열로 저장됨.
    //console.log(socket.eventNames());

    //이벤트 발생시 실행된 리스너의 정보 -> (e) 값을 출력.
    //어떤 리스너를 실행시켰는지 확인 가능하다.
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


  //게임으로 들어가는 부분 test
  socket.on("gameStart", (roomId, userId) => {
    console.log("roomId console", roomId);
    console.log("userId console", userId);
    console.log("socket console", socket.id);
    //요청하는 사람의 Id 잡기. 화상 소켓 채팅
    socket["userId"] = socket.id;

    console.log("socket.userId", socket.userId);
    //console.log("socket.sids", socket.adapter.sids);
    console.log("socket.adapter", io);
    console.log("socket.adapter", io.sockets.adapter.rooms);

    //카드를 분배하는 로직 필요

    //백에서 어떤 값을 저장하고 있어야 하는가 req
    // 카드들의 값, 그 카드가 어떤 userId의 소유인지.
    // room에 해당하는 sids의 값
    // 잔여 카드의 정보.

    //client가 보고 싶어하는 값이 뭔가. res
    // userId, sdis(게임, 채팅, 화상채팅), 보유 카드의 값

    //roomId에 해당하는 유저들의 정보를 찾아서 되돌려준다.
    // {nickname: "~~", chatSids: "일반채팅", videoSids:"화상채팅", card:[[],[]], black: 1  }

  });

  //첫 패를 선택하는 부분
  socket.on("selectFirstCard", (userId, black) => {
    console.log(userId); // userId
    console.log(black); // black card의 수

    //흰색 카드의 수 설정.
    const whiteCard = 3 - Number(black);

    let count = 0;
    let arr1 = [];
    for (let i = 0; count < 3; i++) {
      const number = Math.floor(Math.random() * 13);
      if (blackCardList[number] === null) {
        blackCardList[number] = userId;
        arr1 = [...arr1, { color: "black", value: number }];
        count++;
      }
    }

    count = 0;
    for (let i = 0; count < 3; i++) {
      number = Math.floor(Math.random() * 13);

      if (whiteCardList[number] === null) {
        whiteCardList[number] = userId;
        arr1 = [...arr1, { color: "white", value: number }];
        count++;
      }
    }

    socket["card"] = arr1;

    console.log(
      socket.card
        .sort((a, b) => a.value - b.value)
        .sort((a, b) => {
          if (a.value === b.value) {
            if (a.color < b.color) return -1;
            else if (b.color < a.color) return 1;
            else return 0;
          }
        })
    );

    //userId가 있는 roomId 에도 뿌려줘야한다.
    //마지막 함수를 통해서 param을 던져줘야한다.
    // TODO: 한줄씩 가자.
    // TODO: endstate 말고 구현이 먼저
    // TODO: code가 이쁜건 나중에 리팩토링
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

  //7
  // # socket.once(이벤트 이름, 리스너) // 일회성 리스너 기능을 추가함
  // # socket.off(이벤트 이름, 리스너) // 이벤트에 대한 리스너 배열에서 지정된 리스너를 삭제.
  // # socket.removeAllListeners( [eventName]) 모든 리스너 또는 지정된 eventName의 리스너를 제거한다.
  // // for a specific event
  // socket.removeAllListeners("details");
  // // for all events
  // socket.removeAllListeners();

  //8  :: 오류처리
  // 현재 Socket.IO 라이브러리에는 오류 처리 기능이 내장되어 있지 않음.
  // -> 수신기에서 발생할 수 있는 모든 오류를 잡아줘야함.
  // https://socket.io/docs/v4/listening-to-events/#eventemitter-methods

  //9 :: ROOM
  // `join` 지정된 채널에 소켓을 구독하도록 호출 할 수 있다
  //some room 리스너로 들어오는 user를 data값에 해당하는 room으로 join 한다.
  //data값에 해당하는 room에 emit "welcome" 해준다.
  // socket.on("some room", (data) => {
  //   socket.join(data);
  //   socket.to(data).emit("welcome", socket.nickname);
  //
  //   이렇게 여러개의 방에도 한번에 msg 가능
  //   socket.to("room1").to("room2").to("room3").emit("~~~~")
  // });

  //9 :: 현재 서버에 접속한 사용자 수 Count 하는 방법 두가지.
  //  console.log(io.engine.clientsCount)
  //  console.log(io.of("/").sockets.size);

  //10 :: SocketJoin
  //  모든 소켓인스턴스는 room1에 join한다.
  //  io.socketsJoin("room1")
  //
  //  room1에 있는 모든 소켓인스턴스를 room2 와 room3에서 나가도록 한다.
  //  io.in("room1").socketsLeave(["room2", "room3"])
  //
  //  theSocketId => 한 개의 socketId만 동작 하기도 가능하다.
  //  io.in(theSocketId).socketsJoin("room1");

  //11  :: 20자리? 수의 자동으로 부여되는 Id 값을 꺼내준다.
  //console.log(socket.id); //ojIckSD2jqNzOqIrAGzL
  //
  //  추가로 알면 좋은것. 이 id의 값은 다시 연결할 때마다 자동으로 생성된다.
  //  (끊어지거나, 사용자가 페이지를 새로고침을 할 때도 마찬가지다)
  //

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
