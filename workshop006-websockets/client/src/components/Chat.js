import { useEffect, useState } from "react";
import { messagesTypes } from "../context";
import Message from "./Message";

function Chat({ socket, initialMessages }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(initialMessages);

  useEffect(() => {
    socket?.on("message", onMessage);
    socket?.on("userJoined", (name) => {
      alert(`${name} has joined the chat`);
    });

    return () => {
      socket?.off("message");
      socket?.off("userJoined");
    };
  }, [socket]);

  function onMessage(messages) {
    setChatHistory(messages);
    console.log(chatHistory);
  }

  function handleWriteMessage(event) {
    setCurrentMessage(event.target.value);
  }

  function handleSendMessage(event) {
    event.preventDefault();
    socket.emit("message", { message: currentMessage });
    setCurrentMessage("");
  }

  return (
    <div id="chat">
      <div id="messages">
        {chatHistory.map(({ message = "", name, type }, index) => (
          <Message key={index} message={message} name={name} type={type} />
        ))}
      </div>
      <form onSubmit={handleSendMessage} id="text-box">
        <input
          onChange={handleWriteMessage}
          id="message-input"
          value={currentMessage}
        ></input>
        <button id="message-send">send</button>
      </form>
    </div>
  );
}

export default Chat;
