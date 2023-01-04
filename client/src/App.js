import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [receiveMessage, setReceiveMessage] = useState([]);
  const doAlert = ()=>{
    alert("안녕하세요")
  }
  const sendMessage = () => {
    socket.emit("send_message", { message, room }, doAlert);
    setReceiveMessage((prev) => [...prev, message]);
    // socket.on("sendMessage", (data) => {
    //   console.log(data);
    // });
  };
  //sockets ?????? SIDS?????? rooms??????? <== socket쓰면서 무조건 알아야하는
  //이벤트를 주고 작동 할떄 쓰이는게 3번쨰 함수 인자 😁 // 각각의 이벤트ㅡㄹㄹ 캐치 하는 인자 찾아보기
  //3번째인자로 뭘받는지
  //function 인자를 동작시키므로서 할수있는것들이 많다@@
  //connectTimeOut?????!?!??!? 메소드@
  //on emit join to onEmit 각각 작업해줘야하는 방식 ?
  // 다른 룸에 있는친구 귓속말 보내기 시도해보기 ⭐️
  // 공방이랑 비밀방의 분리 ⭐️
  //시스템메시지 띄우기 ⭐️ 접속했을때 반갑습니다 욕들어가면 제지하는 얼랄트 onEmmit 활용

  const joinRoom = () => {
    console.log(room);
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("FE rece", data);
      setReceiveMessage((prev) => [...prev, data]);
    });
  }, [socket]);
  //[dispatch] ㅁ의존성배열에 socket 최적화 하는방법 @@@
  return (
    <div className="App">
      <input
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <button onClick={joinRoom}>JOIN THE ROOM</button>
      <input
        placeholder="Messages..."
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={sendMessage}>Send message</button>
      <h1>Message:</h1>
      <div>
        {receiveMessage?.map((el, i) => (
          <p key={i}>{el}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
