import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import RoomSelection from './pages/RoomSelection';
import JoinRoom from './pages/JoinRoom';
import CreateRoom from './pages/CreateRoom';
import Chat from './pages/Chat';
import ErrorPage from './pages/ErrorPage';
import { AuthContextProvider } from './backend/AuthContext';

const root = createRoot(document.getElementById('root'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
        errorElement: <ErrorPage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/sign-up',
        element: <SignUpPage />
    },
    {
        path: '/room-selection',
        element: <RoomSelection />
    },
    {
        path: 'join-room',
        element: <JoinRoom />
    },
    {
        path: 'create-room',
        element: <CreateRoom />
    },
    {
        path: '/:roomCode',
        element: <Chat />
    }
]);

root.render(
    <AuthContextProvider>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </AuthContextProvider>
);