import React from 'react';

import { useState } from 'react';
import { useRef } from 'react';

const WebsocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const socket = useRef();

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };

    socket.current.onclose = () => {
      console.log('Socket закрыт');
    };

    socket.current.onerror = () => {
      console.err('Socket произошла ошибка');
    };
  };

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message',
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="center form-container">
        <div className="form">
          <h1 className="form-title">Вход</h1>
          <div className="form-inputs">
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Ваше имя"
            />
            <button className="form-btn" onClick={connect}>
              <span className="form-btn-text">Войти</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <h1 className="title">Введите сообщение</h1>
          <input
            className="input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="btn" onClick={sendMessage}>
            Отправить
          </button>
        </div>
        <div className="messages-wrapper">
          {messages.map((mess) => (
            <>
              {mess.event === 'connection' ? (
                <div key={mess.id} className="connection-message">Пользователь {mess.username} вошел в чат</div>
              ) : (
                <div className="message">
                  <p className='username'>{mess.username}:</p>
                  <p className='message-text'>{mess.message}</p>
                </div>
              )}
            </>
          ))}
          <h1 className='title'>Чат</h1>
        </div>
      </div>
    </div>
  );
};

export default WebsocketComponent;
