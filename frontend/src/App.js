import React, { useState } from 'react';
import ChatRoom from './ChatRoom';
import LocationTracker from './LocationTracker';
import LocationDisplay from './LocationDisplay';

const App = () => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [view, setView] = useState('home');

    const handleJoinChat = () => {
        if (roomId.trim() !== '' && userName.trim() !== '') {
            setView('chat');
        } else {
            alert('Please enter both room ID and user name');
        }
    };

    const handleStartTracking = () => {
        if (roomId.trim() !== '' && userName.trim() !== '') {
            setView('track');
        } else {
            alert('Please enter both room ID and user name');
        }
    };

    if (view === 'chat') {
        return <ChatRoom roomId={roomId} userName={userName} />;
    }

    if (view === 'track') {
        return (
            <div>
                <LocationTracker roomId={roomId} userName={userName} />
                <LocationDisplay roomId={roomId} />
            </div>
        );
    }

    return (
        <div>
            <h1>Join Chat Room or Start Tracking Location</h1>
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
            <button onClick={handleJoinChat}>Join Chat</button>
            <button onClick={handleStartTracking}>Start Tracking Location</button>
        </div>
    );
};

export default App;