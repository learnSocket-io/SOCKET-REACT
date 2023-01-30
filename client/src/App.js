import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styled, { withTheme } from "styled-components";
import Message from "./Message";

const socket = io.connect("localhost:3001");

const Chat = () => {
  // {room}
  // room을 props로 받도록 설정
  const room = 3;
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [nickName, setNickName] = useState("");
  const createdAt = new Date().toLocaleString();
  const addMyMessage = (msg) => {
    const myMsg = { msg, mine: true, createdAt };
    setMsgList((prev) => [...prev, myMsg]);
  };
  const fn = (a) => {
    console.log(a);
  };
  const sendMessage = (e) => {
    //e.keycode === 13 :::: enter
    if (e.keyCode === 13) {
      //socket.emit("send_message", { msg, room }, addMyMessage);
      // socket.emit("selectFirstCard", { userId: 1 }, { black: 2 }, addMyCard);
      // socket.emit("selectFirstCard", { userId: 2 }, { black: 1 }, addMyCard);
      // socket.emit("selectFirstCard", { userId: 3 }, { black: 3 }, addMyCard);
      //socket.emit("ready", { userID: 99, roomID: 102 });
      socket.emit("test-line");
    }
  };
  const sendMessageBtn = (e) => {
    //socket.emit("first-draw", (0, 2, 0), addMyMessage);
  };

  const number1 = (e) => {
    socket.emit("sql-read");
  };

  const number2 = (e) => {
    socket.emit("sql-update");
  };

  const number3 = (e) => {
    socket.emit("sql-delete");
  };
  const join = (e) => {
    socket.emit("joined", 3, 0, fn);
  };
  const join2 = (e) => {
    socket.emit("joined", 4, 0, fn);
  };
  const ready = (e) => {
    socket.emit("ready", 3, fn);
  };
  const ready2 = (e) => {
    socket.emit("ready", 4, fn);
  };
  const firstdraw = (e) => {
    socket.emit("first-draw", 3, 2, fn);
  };
  const firstdraw2 = (e) => {
    socket.emit("first-draw", 4, 1, fn);
  };
  const colorSelectedBlack = (e) => {
    socket.emit("color-selected", 3, "black", fn);
  };
  const colorSelectedWhite = (e) => {
    socket.emit("color-selected", 4, "white", fn);
  };

  const guess = (e) => {
    socket.emit("guess", 4, { index: 1, value: 3 });
  };
  const changeSecurity = (e) => {
    socket.emit("select-card-as-security", 4, "white", 99);
  };
  const nextTurn = (e) => {
    socket.emit("next-turn");
  };
  const placeJoker = (e) => {
    socket.emit("place-joker", 3);
  };

  useEffect(() => {
    //  socket.emit("nickname", nickName) // 카카오 닉네임으로 소켓 설정하기
    socket.emit("you-joined", { userID: 99, roomID: 102 }, fn);
    //socket.emit("ready-to-join", { userId: 0 }, fn);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("game-start", () => {
      console.log("game 스타트 콘솔");
      // socket.emit("getPlace", { roomId: 3, userId: 3, people: 3 }, hi);
    });
  });

  useEffect(() => {
    socket.on("add-ready", (e) => {
      console.log(e);
      // socket.emit("getPlace", { roomId: 3, userId: 3, people: 3 }, hi);
    });
  });
  useEffect(() => {
    socket.on("draw-result", (e) => {
      console.log(e);
      // socket.emit("getPlace", { roomId: 3, userId: 3, people: 3 }, hi);
    });
  });
  useEffect(() => {
    socket.on("result-select", (e) => {
      console.log(e);
    });
  });
  useEffect(() => {
    socket.on("result-joined", (e) => {
      console.log(e);
    });
  });
  useEffect(() => {
    socket.on("result-guess", (a, b, c) => {
      console.log(a);
      console.log(b);
      console.log(c);
    });
  });
  useEffect(() => {
    socket.on("next-gameinfo", (e) => {
      console.log(e);
    });
  });

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const myMsg = { msg, mine: false, createdAt };
      setMsgList((prev) => [...prev, myMsg]);
    });
  }, [socket]);
  //////////////////////////////////////////////////////////////////////
  //연습구간
  //1
  // socket.on('hello', (arg1,arg2,arg3)=>{
  //   console.log("num1",arg1)
  //   console.log("num2",arg2)
  //   console.log("num3",arg3)
  // })
  //2
  // socket.emit("update item", "1", { name: "updated" }, (response) => {
  //   console.log(response.status); // ok
  // });
  //3
  // socket.emit("update item", "1", { name: "updated" }, (response) => {
  //   console.log("ㅁㄴㅇㄻㄴㅇㄻ", response);
  //   if (response.arg2.name == "updated") {
  //     console.log(response.status); // ok
  //   }
  // });
  //4
  // socket.on("my-event"ㅌㅌ,  (response)=>{
  // })
  //11 :: client 와 server 동일한 값을 갖는다.
  // socket.on("connect", () => {
  //  console.log(socket.id); )};// ojIckSD2jqNzOqIrAGzL
  //////////////////////////////////////////////////////////////////////
  return (
    <StWrapper>
      <input value={nickName} onChange={(e) => setNickName(e.target.value)} />
      <button
        onClick={() => {
          socket.emit("nickName", nickName);
        }}
      >
        닉네임 변경
      </button>
      <StMsgContainer>
        {msgList?.map((el, i) => {
          return <Message key={`comment${i}`} msg={el} />;
        })}
      </StMsgContainer>
      <StBtnContainer>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="메시지를 입력하세요."
          onKeyUp={sendMessage}
        />
        <button onClick={sendMessageBtn}>Enter</button>
      </StBtnContainer>
      <button onClick={number1}>read</button>
      <button onClick={number2}>update</button>
      <button onClick={number3}>delete</button>
      <button onClick={join}>user3-join</button>
      <button onClick={ready}>user-3ready</button>
      <button onClick={firstdraw}>user3 firstdraw</button>
      <button onClick={join2}>user4-join</button>
      <button onClick={ready2}>user4-ready</button>
      <button onClick={firstdraw2}>user4 firstdraw</button>
      <button onClick={colorSelectedBlack}>color Black</button>
      <button onClick={colorSelectedWhite}>color White</button>
      <button onClick={guess}>guess</button>
      <button onClick={changeSecurity}>changeSecurity</button>
      <button onClick={nextTurn}>nextTurn</button>
    </StWrapper>
  );
};
export default Chat;
const StWrapper = styled.div`
  display: flex;
  width: 40%;
  height: 600px;
  border-radius: 12px;
  box-shadow: 2px 2px 6px #333;
  padding: 5px;
  flex-direction: column;
  gap: 10px;
`;
const StMsgContainer = styled.div`
  display: flex;
  width: 100%;
  height: 90%;
  overflow: auto;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  gap: 10px;
`;
const StBtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
/*
 const addMyMessage=(msg)=>{
    const myMsg = {msg, mine:true, createdAt}
    setMsgList((prev) => [...prev, myMsg]);
    setMsg('')
  }
  const sendMessage = (e) => {
    if(e.keyCode===13){
      nickName?
      socket.emit("whisper", nickName, msg, addMyMessage):
      socket.emit("send_message", { msg, room },addMyMessage);
    }
  };
  */
