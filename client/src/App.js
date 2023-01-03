import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Message from "./Message";

const socket = io.connect("http://localhost:3001");

const Chat = () => {
  // {room}
  // room을 props로 받도록 설정
  const room = 3;
  
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [nickName, setNickName] = useState("");

  const sendMessage = (e) => {
    if (e.keyCode === 13) {
      socket.emit("send_message", { msg, room });
      setMsgList((prev) => [...prev, msg]);
    }
  };
  const sendMessageBtn = (e) => {
    socket.emit("send_message", { msg, room });
    setMsgList((prev) => [...prev, msg]);
  };

  useEffect(() => {
    //  socket.emit("nickname", nickName)
    socket.emit("join_room", room);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMsgList((prev) => [...prev, data.msg]);
    });
  }, [socket]);

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
  width: 90%;
  margin: 0 auto;
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
