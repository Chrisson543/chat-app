import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../backend/firebase-config';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import Popup from '../components/Popup';
import { AuthContext } from '../backend/AuthContext';
import Loading from '../components/Loading';

export default function JoinRoom(){

    const [roomCode, setRoomCode] = React.useState('');
    const [roomPin, setRoomPin] = React.useState('');
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupType, setPopupType] = React.useState('');
    const { currentUser, currentRoomCode, setCurrentRoomCode } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const toggleShowPopup = () => {
        setShowPopup(prevState => !prevState);
    };
    const checkIfRoomExists = async(roomDoc) => {
        try{
            const existingDoc = await getDoc(roomDoc);
            if(existingDoc.exists()){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
            return false;
        }
    };
    const checkIfPinIsCorrect = async(roomDoc) => {
        try{
            const roomDocRef = await getDoc(roomDoc);
            const roomData = roomDocRef.data();

            if(roomDocRef.exists() && roomData.roomPin === roomPin){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
        }
        


    };
    const addNewParticipant = async(roomDoc) => {
        const participantsCollection = doc(roomDoc, 'participants', currentUser.uid);
        try{
            await setDoc(participantsCollection, {
                id: currentUser.uid,
                name: currentUser.displayName
            });
        }
        catch(error){
            console.log(error);
        }
    };
    const sendJoinedNotificaion = async () => {
        const messagesCollection = collection(db, 'rooms', roomCode, 'messages');
        try{
            await addDoc(messagesCollection, {
                createdAt: serverTimestamp(),
                type: 'notificaiton',
                text: `${currentUser.displayName} joined the chat!`
            });
        }catch(error){
            console.log(error);
        };
    };
    const joinRoom = async() => {
        if(roomCode.trim() !== '' && roomPin.trim() !== ''){
            const roomDoc = doc(db, 'rooms', roomCode);
            const roomExists = await checkIfRoomExists(roomDoc);
            const pinCorrect = await checkIfPinIsCorrect(roomDoc);
            if(roomExists){
                if(pinCorrect){
                    try{
                        addNewParticipant(roomDoc);
                        setCurrentRoomCode(roomCode);
                        sendJoinedNotificaion();
                        navigate(`/${roomCode}`, {replace: true});
                    }catch(error){
                        console.log(error);
                    }
                }else{
                    setPopupType('incorrectPin');
                    toggleShowPopup();
                }
            }else{
                setPopupType('roomDoesntExist');
                toggleShowPopup();
            }
        }else{
            setPopupType('emptyFields');
            toggleShowPopup();
        }
    };

    //check if signed in
    React.useEffect(() => {
        if(!currentUser){
            navigate('/');
        }
    }, [currentUser]);

    //check if already in room
    React.useEffect(() => {
        if(currentRoomCode){
            setRoomCode(currentRoomCode);
            navigate(`/${currentRoomCode}`);
        }
    }, [currentRoomCode]);

    return(
        currentUser && currentUser.displayName ? 
        <div className='overflow-hidden relative w-full h-full min-h-full bg-background-color flex flex-col items-center'>
            {showPopup && <Popup toggleShowPopup={toggleShowPopup} popupType={popupType} />}
            <div className='w-full bg-navbar-color p-[1rem] flex flex-row items-center'>
                <Link to={'/room-selection'}><img className='w-[1.5rem] l:w-[2rem]' src={'/assets/back-arrow.png'} /></Link>
                <p className='text-light-green pl-[20px] text-[1.5rem] l:text-[2rem]'>chat app</p>
            </div>
            <div className='flex flex-col items-center p-[1rem] w-full h-full justify-between'>
                <p className='text-light-green text-[1.5rem] tablet:text-[2.5rem] l:text-[2.5rem] mt-[3rem]'>welcome {currentUser.displayName}!</p>
                <div>
                    <div className='flex flex-col items-left mt-[3rem]'>
                        <p className='text-light-green l:text-[1.5rem]'>room code</p>
                        <input onChange={e => setRoomCode(e.target.value)} value={roomCode} className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='text' placeholder='enter room code...' />
                    </div>
                    <div className='flex flex-col items-left mt-[3rem] mb-[10rem]'>
                        <p className='text-light-green l:text-[1.5rem]'>room pin</p>
                        <input onChange={e => setRoomPin(e.target.value)} value={roomPin} className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='text' placeholder='enter room pin...' />
                    </div>
                </div>
                <button onClick={joinRoom} className='main-button w-[10rem] l:text-[1.5rem] justify-self-end mb-[1rem]'>join</button>
                <img className='absolute w-[5rem] bottom-[-1.5rem] left-[-1.5rem]' src={'/assets/pepe.png'}/>
            </div>
        </div>
        :
        <Loading />
    );
};