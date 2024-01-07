import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../backend/firebase-config';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Popup from '../components/Popup';
import { AuthContext } from '../backend/AuthContext';
import Loading from '../components/Loading';

export default function CreateRoom(){
    const [roomName, setRoomName] = React.useState('');
    const [roomCode, setRoomCode] = React.useState('');
    const [roomPin, setRoomPin] = React.useState('');
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupType, setPopupType] = React.useState(null);
    const { currentUser, currentRoomCode, setCurrentRoomCode } = React.useContext(AuthContext);
    const navigate = useNavigate();

    function toggleShowPopup(popupType){
        setPopupType(popupType);
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
        }catch(error) {
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
    const containsNonNumbers = (str) => {
        const nonNumberRegex = /[^0-9]/;
        return nonNumberRegex.test(str);
      };
    const createNewRoom = async() => {
        if(roomCode.trim() !== '' && roomName.trim() !== '' && roomPin.trim() !== ''){
            if(containsNonNumbers(roomCode) || roomCode.length !== 4){
                toggleShowPopup('invalidRoomCode');
            }else if(containsNonNumbers(roomPin)){
                toggleShowPopup('invalidRoomPin')
            }else{
                const newRoomDoc = doc(db, 'rooms', roomCode);
                const newRoomData = {
                    createdBy: currentUser.uid,
                    roomName,
                    roomPin
                };
                const currentParticipantDoc = doc(newRoomDoc, 'participants', currentUser.uid);
                const messagesCollection = collection(newRoomDoc, 'messages');
                try{
                    const roomExists = await checkIfRoomExists(newRoomDoc);
                    if(roomExists){
                        toggleShowPopup('roomAlreadyExists');
                    }else{
                        //create new room collection
                        await setDoc(newRoomDoc, newRoomData);
                        //create new participant doc
                        await setDoc(currentParticipantDoc, {
                            id: currentUser.uid,
                            name: currentUser.displayName
                        });
                        //create new messages collection
                        await addDoc(messagesCollection, {
                            createdAt: serverTimestamp(),
                            text: 'welcome to the chat room!',
                            sender: 'welcome bot',
                            senderId: 'admin'
                        });
                        sendJoinedNotificaion();
                        setCurrentRoomCode(roomCode);
                        navigate(`/${roomCode}`, {replace: true});
                    }
                }catch(error){
                    console.log(error);
                }
            };
            
        }else{
            toggleShowPopup('emptyFields')
        }
        
    };

    //check if signed in
    React.useEffect(() => {
        if(!currentUser){
            navigate('/');
        };
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
        <div className='overflow-hidden justify-center relative w-full min-h-full bg-background-color flex flex-col items-center'>
            {showPopup && <Popup toggleShowPopup={toggleShowPopup} popupType={popupType}/>}
            <div className='absolute top-0 w-full bg-navbar-color p-[1rem] flex flex-row items-center'>
                <Link to={'/room-selection'}><img className='w-[1.5rem] l:w-[2rem]' src={'/assets/back-arrow.png'} /></Link>
                <p className='text-light-green pl-[20px] text-[1.5rem] l:text-[2rem]'>chat app</p>
            </div>
            <div className='flex flex-col items-center p-[1rem] w-full h-full'>
                <p className='text-light-green text-[1.5rem] tablet:text-[2.5rem] l:text-[2.5rem] mt-[5rem]'>welcome {currentUser.displayName}!</p>
                <div className='flex flex-col items-left mt-[3rem]'>
                    <p className='text-light-green l:text-[1.5rem]'>room name</p>
                    <input onChange={e => setRoomName(e.target.value)} value={roomName} className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='text' placeholder='enter room name...' />
                </div>
                <div className='flex flex-col items-left mt-[2rem]'>
                    <p className='text-light-green l:text-[1.5rem]'>room code</p>
                    <input onChange={e => setRoomCode(e.target.value)} value={roomCode} className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='text' placeholder='enter room code...' />
                </div>
                <div className='flex flex-col items-left mt-[2rem]'>
                    <p className='text-light-green l:text-[1.5rem]'>room pin</p>
                    <input onChange={e => setRoomPin(e.target.value)} value={roomPin} className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='text' placeholder='enter room pin...' />
                </div>
                <button onClick={createNewRoom} className='main-button w-[10rem] mt-[7rem] l:text-[1.5rem]' >create</button>
            </div>
            <img className='absolute w-[5rem] bottom-[-1.5rem] left-[-1.5rem]' src={'/assets/pepe.png'}/>
        </div>
        :
        <Loading />
    );
};