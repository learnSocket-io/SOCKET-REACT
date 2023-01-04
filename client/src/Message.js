import React from "react";
import styled from "styled-components";

// const Message = ({msgInfo}) => {
const Message = ({ msg }) => {
  return (
    <div>
      {/* <img src={msgInfo.img} alt='프로필'/>
      <p>{msgInfo.msg}</p> */}
      {msg.mine ? (
        <StMyMsg>
          <div>{msg.msg}</div>
          <div>{msg.createdAt}</div>
        </StMyMsg>
      ) : (
        <StComment>
          <div>{msg.msg}</div>
          <div>{msg.createdAt}</div>
        </StComment>
      )}
    </div>
  );
};

export default Message;
const StComment = styled.div`
  text-align: left;
`;
const StMyMsg = styled.div`
  text-align: right;
`;
