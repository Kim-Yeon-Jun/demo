import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatRoom = ({ roomId, userName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const stompClientRef = useRef(null);
    const [connected, setConnected] = useState(false);

    const connect = useCallback(() => {
        const socket = new SockJS('http://localhost:8080/ws/chat');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,  // 5초 후 재시도
            debug: (str) => {
                console.log(str);
            },
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                setConnected(true);
                stompClient.subscribe('/topic/public', onMessageReceived);
                stompClient.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({ sender: userName, type: 'JOIN' })
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                setConnected(false);
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket closed, attempting to reconnect...', event);
                setConnected(false);
            },
            onDisconnect: () => {
                console.log('Disconnected');
                setConnected(false);
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
    }, [userName]);

    useEffect(() => {
        connect();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [connect]);

    const onMessageReceived = (message) => {
        const msg = JSON.parse(message.body);
        console.log('Message received: ', msg);
        setMessages(messages => [...messages, msg]);
    };

    const sendMessage = () => {
        const stompClient = stompClientRef.current;
        if (stompClient && connected && message.trim()) {
            const chatMessage = {
                sender: userName,
                content: message,
                type: 'CHAT'
            };
            console.log('Sending message: ', chatMessage);
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage)
            });
            setMessage('');
        } else {
            if (!connected) {
                console.error('Unable to send message, STOMP client is not connected');
            } else {
                console.error('Unable to send message, message is empty');
            }
        }
    };

    return (
        <div>
            <h2>Chat Room {roomId}</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}><b>{msg.sender}</b>: {msg.content}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;