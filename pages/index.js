import Head from "next/head";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import UsernameField from "./components/UsernameField";

import styles from "../styles/Home.module.css";

export default function Home() {
  //save the socket
  const [socket, setSocket] = useState(null);

  //whether the username is set

  const [usernameConfirmed, setUsernameConfirmed] = useState(false);

  // state for username

  const [username, setUsername] = useState("");

  // state for the form field

  const [message, setMessage] = useState("");

  // state for message history

  const [history, setHistory] = useState([
    /*
    {
      username: "Santa Claus",
      message: "ho ho ho"
    }
    */
  ]);

  const connectSocket = () => {
    fetch("/api/chat");

    if (!socket) {
      const newSocket = io();

      newSocket.on("connect", () => {
        console.log("Chat app connected! YAY");
      });

      newSocket.on("message", (msg) => {
        setHistory((history) => [...history, msg]);
      });

      newSocket.on("disconnect", () => {
        console.warn("WARNING: chat app disconnected");
      });

      setSocket(() => newSocket);
    }
  };

  //the websocket code

  useEffect(() => {
    connectSocket();
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    //make sure chatroom is running
    if (!socket) {
      alert("Chatroom not connected yet. Please try again in a little bit.");
      return;
    }

    //prevent empty submissions
    if (!message || !usernameConfirmed) {
      return;
    }

    socket.emit("message-submitted", { message, username });
    setMessage("");
  };

  return (
    <div>
      {/* This is the the page's title / icon */}
      <Head>
        <title>My Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* username field area */}
      <UsernameField
        completed={usernameConfirmed}
        value={username}
        onChange={(value) => setUsername(value)}
        onSubmit={() => setUsernameConfirmed(true)}
      />
      {/* Form submission */}
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Type your message:
            <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                username ? "Enter your message..." : "Set username..."
              }
              disabled={!usernameConfirmed}
            />
          </label>
          <input type="submit" value="Submit" disabled={!usernameConfirmed} />
        </form>
      </div>

      {/* List of messages */}
      <div>
        {history.map(({ username, message }, i) => (
          <div key={i}>
            <b>{username}</b>: {message}
          </div>
        ))}
      </div>
    </div>
  );
}
