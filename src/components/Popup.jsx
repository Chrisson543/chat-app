import React from 'react';
import { auth, db } from '../backend/firebase-config';
import { AuthContext } from '../backend/AuthContext';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function Popup({participantToKick, setParticipantToKick, kickParticipant, toggleShowPopup, popupType }){
    const { currentUser, currentRoomCode, setCurrentRoomCode, leaveRoom, logOut } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const popupActions = {
        leaveRoom: {
            header: 'leave room',
            text: 'are you sure you want to leave the room?',
            action: () => {
                leaveRoom();
                navigate('/room-selection');
                setCurrentRoomCode(null);
                navigate('/room-selection');
            }
        },
        logOut: {
            header: 'log out',
            text: 'are you sure you want to log out?',
            action: () => {
                logOut();
                navigate('/');
            }
        },
        kick: {
            header: 'kick',
            text: `are you sure you want to kick ${participantToKick ? participantToKick.name : ''}?`,
            action: () => {
                toggleShowPopup();
                kickParticipant(participantToKick.uid);
                setParticipantToKick(null);
            }
        },
        roomAlreadyExists: {
            header: 'room already exists',
            text: 'this room already exists, please enter a different room code.',
            action: toggleShowPopup
        },
        roomDoesntExist: {
            header: "room doesn't exist",
            text: "a room with this room code doesn't exist, please try a different room code or create a room.",
            action: toggleShowPopup
        },
        incorrectPin: {
            header: "incorrect pin",
            text: "incorrect pin.",
            action: toggleShowPopup
        },
        shortPassword: {
            header: 'password too short',
            text: 'password should be at lease 6 characters.',
            action: toggleShowPopup
        },
        usernameAlreadyInUse: {
            header: 'username already in use',
            text: 'sorry this username is already in use, try a different one or log in.',
            action: toggleShowPopup
        },
        invalidCredentials:{
            header: 'invalid username/password',
            text: 'please try a different username, password or create an account.',
            action: toggleShowPopup
        },
        emptyFields: {
            header: 'empty fields',
            text: 'please fill all fields.',
            action: toggleShowPopup
        },
        invalidRoomCode: {
            header: 'invalid room code',
            text: 'room code should be 4 numbers.',
            action: toggleShowPopup
        },
        invalidRoomPin: {
            header: 'invalid room pin',
            text: 'room pin should be 4 numbers.',
            action: toggleShowPopup
        }
    };
    const popupTypeValue = popupType

    function popupConfirm(){
        popupActions[popupType].action();
    };

    return(
        <div className='absolute w-full h-full bg-slate-400 z-30 bg-opacity-50'> {/*popup background*/}
            <div className='max-w-[470px] z-20 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-navbar-color px-[2rem] py-[3rem] rounded-3xl text-white flex flex-col items-center w-[90%]'>
                <img onClick={toggleShowPopup} className='absolute right-[30px] top-[30px] w-[20px] hover:cursor-pointer' src={'/assets/close.png'} />
                <p className='underline text-[1.5rem]'>{popupActions[popupTypeValue].header}</p>
                <p className='text-center mt-[1rem]'>{popupActions[popupTypeValue].text}</p>
                <button onClick={popupConfirm} className='bg-light-green py-[0.5rem] px-[1rem] rounded-3xl text-black mt-[1rem]'>confirm</button>
            </div>
        </div>
    );
}