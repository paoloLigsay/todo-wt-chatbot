import { Message } from '@/models/chat'
import { AndroidOutlined, SendOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import ChatItem from './ChatItem';

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [gptResponseMessage, setGptResponseMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [showStreamResponse, setShowStreamResponse] = useState<boolean>(false);
  const [openChat, setOpenChat] = useState<boolean>(false);
  const [isHandlingChat, setIsHandlingChat] = useState<boolean>(false);

  const handleSendChat = async () => {
    setIsHandlingChat(true);

    try {
      const refactoredMessages = messages.map(({ id, created_at, ...rest }) => rest)
      const userPrompt = { role: "user", content: prompt }
      const prompts = [...refactoredMessages, userPrompt ]

      const responseAddChat = await fetch('http://localhost:8080/api/addchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: "user",
          prompt,
        }),
      });
      
      const { chat: updatedMessages } = await responseAddChat.json()
      setPrompt("");
      setMessages(updatedMessages);

      const response = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompts,
        }),
      });

      if (response && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let completeResponse = "";
  
          setShowStreamResponse(true);
          while (true) {
            const { done, value } = await reader.read();
  
            if (done) {
              const responseAddChat = await fetch('http://localhost:8080/api/addchat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  role: "assistant",
                  prompt: completeResponse,
                }),
              });

              const { chat: updatedMessages } = await responseAddChat.json()
              setShowStreamResponse(false);
              setMessages(updatedMessages);
              setGptResponseMessage("");

              break;
            }
  
            const chunkValue = decoder.decode(value);
            completeResponse += chunkValue;
  
            setGptResponseMessage(completeResponse);
          }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHandlingChat(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/chat')
        const { chat: chatFromAPI, error } = await res.json()
  
        if (error) {
          console.error(`Error encountered: ${error}`);
          return;
        }
  
        setMessages(chatFromAPI);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, [])

  return (
    <div className='w-[350px] absolute bottom-0 right-[32px] overflow-hidden'>
      <div
        onClick={() => setOpenChat((prev) => !prev)}
        className='flex items-center cursor-pointer w-full bg-[#29b896] text-white text-[18px]  py-[16px] px-[24px] rounded-tl-[12px] rounded-tr-[12px]'
      >
        <AndroidOutlined className='text-[28px] mr-[8px]' />
        <p className='font-bold'> CHATBOT </p>
      </div>
      <div className={`bg-[#23314a] ${openChat ? 'max-h-[999px] pb-[72px]' : 'max-h-0'}`}>
        <ul className='custom-scroll overflow-x-hidden overflow-y-scroll max-h-[500px] min-h-[400px] p-[12px] pt-[20px] flex flex-col items-start'>
          <ChatItem message={{ id:"intialMessage", role: "assistant", content: "Hi! How can I help you today?" }} />
          {messages.map((message: Message) => (
            <ChatItem message={{ id: message.id, role: message.role, content: message.content }} />
          ))}
          {showStreamResponse && (
            <ChatItem message={{ id: "streamingResponse", role: "assistant", content: gptResponseMessage }} />
          )}
        </ul>
        <div className={`absolute bottom-0 w-full bg-transparent flex items-center justify-center p-[8px]${openChat ? "" : " hidden"}`}>
          <div className='bg-[#1c2432] w-[96%] rounded-[16px] relative'>
            <textarea
              className='custom-scroll h-[48px] w-full p-[12px] pr-[15%] text-white resize-none focus:outline-none bg-transparent'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              disabled={isHandlingChat}
              className='absolute right-[16px] bottom-[50%] translate-y-[50%] py-[4px] px-[8px] hover:bg-[#23314a] rounded-[8px] disabled:hover:!bg-transparent'
              onClick={handleSendChat}
              >
                <SendOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
