import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const socket = io("http://localhost:5000"); // Replace with your backend URL

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        console.log("🟢 Listening for notifications...");
        socket.on("newNotification", (notification) => {
            console.log("🔔 New Notification Received:", notification);
            toast.success(`📢 ${notification.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {socket.off("newNotification");
        console.log("🔴 Socket disconnected");
        }
    }, []);

    return (
        <div>
            <h2>🔔 Notifications</h2>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>{notif.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
