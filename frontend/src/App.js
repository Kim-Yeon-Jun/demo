import React, { useState } from 'react';
import ChatRoom from './ChatRoom';

const App = () => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [inChat, setInChat] = useState(false);

    if (inChat) {
        return <ChatRoom roomId={roomId} userName={userName} />;
    }

    return (
        <div>
            <h1>Join Chat Room</h1>
            <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={() => setInChat(true)}>Join</button>
        </div>
    );
};

export default App;