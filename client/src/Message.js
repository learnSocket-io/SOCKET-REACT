import React from 'react'
import styled from 'styled-components'

// const Message = ({msgInfo}) => {
const Message = ({msg}) => {
  return (
    <div>
      {/* <img src={msgInfo.img} alt='프로필'/>
      <p>{msgInfo.msg}</p> */}
      {msg.mine?
        <StMyMsg><p>{msg.msg}</p><p>{msg.createdAt}</p></StMyMsg>
      :
        <StComment><p>{msg.msg}</p><p>{msg.createdAt}</p></StComment>      
      }
    </div>
  )
}

export default Message
const StComment = styled.p`
  text-align: left;
`
const StMyMsg = styled.p`
  text-align: right ;
`