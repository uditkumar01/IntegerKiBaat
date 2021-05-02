import React, { useContext, createContext, useState } from "react";

export const ChatContext = createContext();

export  function ChatContextProvider({ children }) {
  const [roomId, setRoomId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [admin, setAdmin] = useState("");
  
  return (
    <ChatContext.Provider value={{  admin,setAdmin,roomId,setRoomId ,participants,setParticipants }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
