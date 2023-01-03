import React from 'react'
import styled from 'styled-components'

// const Message = ({msgInfo}) => {
const Message = ({msg}) => {
  return (
    <div>
      {/* <img src={msgInfo.img} alt='프로필'/>
      <p>{msgInfo.msg}</p> */}
      <StComment>{msg}</StComment> 
    </div>
  )
}

export default Message
const StComment = styled.p`
  text-align: left;
`