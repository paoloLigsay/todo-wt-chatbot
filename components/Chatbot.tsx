import { Message } from '@/models/chat'
import { SendOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [gptResponseMessage, setGptResponseMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [showStreamResponse, setShowStreamResponse] = useState<boolean>(false);
  const [openChat, setOpenChat] = useState<boolean>(false);

  const handleSendChat = () => {
    const fetchData = async () => {
      try {
        setShowStreamResponse(true);

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
        console.log(e);
      }
    };

    fetchData();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/chat')
        const { chat: chatFromAPI, error } = await res.json()
  
        if (error) {
          console.log(`Error encountered: ${error}`);
          return;
        }
  
        setMessages(chatFromAPI);
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    console.log("messges", messages);
  }, [messages])

  return (
    <div className='w-[400px] absolute bottom-0 right-[32px] overflow-hidden'>
      <div
        onClick={() => setOpenChat((prev) => !prev)}
        className='cursor-pointer w-full bg-[#32c4a2] text-white py-[8px] px-[24px] rounded-tl-[12px] rounded-tr-[12px]'
      >
        Chat
      </div>
      <div className={openChat ? 'max-h-[999px]' : 'max-h-0'}>
        <ul className='min-h-[400px] p-[16px] bg-[#23314a] flex flex-col items-start'>
          <li className='flex'>
            <p className='mb-[16px] py-[8px] px-[16px] bg-[#5b6577] rounded-[100px]'>
              Hi! How can I help you today?
            </p>
          </li>
          {messages.map((message: Message) => (
            <li
              className={`mb-[16px] py-[8px] px-[16px] bg-[#5b6577] rounded-[100px] ${message.role === 'user' && 'self-end'}`}
              key={message.id}
            >
              {message.content}
            </li>
          ))}
          {showStreamResponse && (
            <li>
              {gptResponseMessage}
            </li>
          )}
        </ul>
        <div className='flex items-center justify-center px-[16px] py-[24px] bg-[#23314a]'>
          <div className='bg-[#081223] w-[96%] rounded-[8px] relative'>
            <textarea
              className='textarea h-[48px] w-full p-[12px] pr-[15%] text-white resize-none focus:outline-none bg-transparent'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className='absolute right-[16px] bottom-[50%] translate-y-[50%] py-[4px] px-[8px] hover:bg-[#23314a] rounded-[8px]'
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
