import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const LocationTracker = ({ roomId, userName }) => {
    const stompClientRef = useRef(null);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        const sendLocationUpdate = (position) => {
            const stompClient = stompClientRef.current;
            if (stompClient && stompClient.connected) {
                const locationMessage = {
                    userName: userName,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                stompClient.publish({
                    destination: `/app/location.update/${roomId}`,
                    body: JSON.stringify(locationMessage)
                });
                console.log('Sending location update: ', locationMessage);
            }
        };

        const handleError = (error) => {
            console.error('Error getting location: ', error);
        };

        const locationWatchId = navigator.geolocation.watchPosition(
            sendLocationUpdate,
            handleError,
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => {
            navigator.geolocation.clearWatch(locationWatchId);
        };
    }, [userName, roomId]);

    return null; // This component does not render anything
};

export default LocationTracker;
