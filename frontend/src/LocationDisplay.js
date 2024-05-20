import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const LocationDisplay = ({ roomId }) => {
    const [locations, setLocations] = useState([]);
    const stompClientRef = useRef(null);

    useEffect(() => {
        console.log('Connecting to WebSocket server...');
        const connect = () => {
            const socket = new SockJS('http://localhost:8080/ws/location');
            const stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                debug: (str) => {
                    console.log(str);
                },
                onConnect: (frame) => {
                    console.log('Connected: ' + frame);
                    stompClient.subscribe(`/topic/location/${roomId}`, (message) => {
                        const locationMessage = JSON.parse(message.body);
                        console.log('Location message received: ', locationMessage);

                        setLocations((prevLocations) => {
                            const index = prevLocations.findIndex(
                                (loc) => loc.userName === locationMessage.userName
                            );
                            if (index !== -1) {
                                const updatedLocations = [...prevLocations];
                                updatedLocations[index] = locationMessage;
                                console.log('Updated existing location: ', updatedLocations);
                                return updatedLocations;
                            } else {
                                const newLocations = [...prevLocations, locationMessage];
                                console.log('Added new location: ', newLocations);
                                return newLocations;
                            }
                        });
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketClose: (event) => {
                    console.log('WebSocket closed, attempting to reconnect...', event);
                },
                onDisconnect: () => {
                    console.log('Disconnected');
                }
            });

            stompClient.activate();
            stompClientRef.current = stompClient;
        };

        connect();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [roomId]);

    useEffect(() => {
        console.log('Locations updated: ', locations);
    }, [locations]);

    return (
        <div>
            <h2>Real-time Location of Others</h2>
            {locations.length === 0 && <p>No location data available.</p>}
            {locations.map((location, index) => (
                <div key={index}>
                    <p>{location.userName}</p>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            ))}
        </div>
    );
};

export default LocationDisplay;
