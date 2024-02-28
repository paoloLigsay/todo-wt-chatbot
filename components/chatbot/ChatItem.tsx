import { Message } from '@/models/chat'
import React from 'react'

const ChatItem = ({ message }: { message: Message }) => {
  return (
    <li className={`flex w-full${message.role === 'user' ? ' justify-end' : ""}`}>
      <p className={`mb-[16px] py-[8px] px-[16px] rounded-[12px] ${message.role === 'user' ? 'bg-[#5b6577]' : "bg-[#284272]"}`}>
        {message.content}
      </p>
    </li>
  )
}

export default ChatItem
