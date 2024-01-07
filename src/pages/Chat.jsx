import React from 'react';
import Message from '../components/Message';
import ChatNotification from '../components/ChatNotification';
import Dropdown from '../components/Dropdown';
import SeeParticipants from '../components/SeeParticipants';
import Popup from '../components/Popup';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../backend/firebase-config';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../backend/AuthContext';
import Loading from '../components/Loading';
import { signOut } from 'firebase/auth';

export default function Chat(){
    const { roomCode } = useParams();
    const { currentUser, currentRoomCode, setCurrentRoomCode } = React.useContext(AuthContext);
    const roomDoc = doc(db, 'rooms', roomCode);
    const messagesCollection = collection(roomDoc, 'messages');
    const navigate = useNavigate();
    const [roomName, setRoomName] = React.useState('');
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [showSeeParticipants, setShowSeeParticipants] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [messageText, setMessageText] = React.useState('');
    const messageAreaRef = React.useRef(null);
    const [popupType, setPopupType] = React.useState(null);
    const [adminUID, setAdminUID] = React.useState(null);
    const [messagesList, setMessagesList] = React.useState([
        // {
        //     sender: 'chrisson',
        //     timeSent: '17:38',
        //     message: 'welcome to the chat room!'
        // },
        // {
        //     sender: 'me',
        //     timeSent: '17:38',
        //     message: 'thanks for inviting me!'
        // }
    ]);
    const [participants, setParticipants] = React.useState([]);
    const [participantToKick, setParticipantToKick] = React.useState({
        uid: null,
        name: ''
    });
    const messagesElemets = messagesList.map((message) => {
        if(message.type == 'message'){
            return(
                <Message key={message.id} {...message} />
            )
        }else{
            return(
                <ChatNotification key={message.id} {...message} />
            );
        }
    });
    const dropdownOptions = [
        {
            text: 'participants',
            action: () => toggleSeeParticipants()
        },
        {
            text: 'leave room',
            action: () => toggleShowPopup('leaveRoom'),
            style: 'text-red-500'
        },
        {
            text: 'log out',
            action: () => toggleShowPopup('logOut'),
            style: 'text-red-500'
        }
    ]
    const toggleDropdown= () => {
        setShowDropdown(prevState => !prevState);
    };
    const toggleSeeParticipants= () => {
        setShowSeeParticipants(prevState => !prevState);
    };
    const toggleShowPopup= (popupType, participantToKick = null) => {
        if(participantToKick){
            setParticipantToKick(participantToKick);
        }
        setPopupType(popupType);
        setShowPopup(prevState => !prevState);
    };
    const handleEnterPress = (event) => {
        if(event.key === 'Enter'){
            sendMessage();
        }
    };
    const formatTime = (timestamp) => {
        if (!timestamp) {
          return;
        } else {
          const timestampDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false, // Use 24-hour time
          };
      
          let formattedTime = new Intl.DateTimeFormat('en-US', options).format(timestampDate);
      
          // Check if it's midnight and adjust the hours component
          if (timestampDate.getHours() === 0) {
            formattedTime = `00${formattedTime.slice(2)}`;
          }
      
          return formattedTime;
        }
      };
    const getRoomName = async(roomDoc) => {
        try{
            const roomDocRef = await getDoc(roomDoc);
            const roomData = roomDocRef.data(); 
            return roomData.roomName;
        }catch(error){
            console.log(error);
        }
        
    };
    const assignRoomName = async(roomDoc) => {
        const roomName = await getRoomName(roomDoc);
        setRoomName(roomName);
    };
    const sendMessage = async () => {
        if(messageText.trim() !== ''){
            await addDoc(messagesCollection, {
                createdAt: serverTimestamp(),
                type: 'message',
                text: messageText,
                sender: currentUser.displayName,
                senderId: currentUser.uid
            });
            setMessageText('');
        };
    };
    const sendKickedNotificaion = async (participantId) => {
        const messagesCollection = collection(db, 'rooms', roomCode, 'messages');
        const kickedParticipant = participants.find(participant => participant.id == participantId);
        try{
            await addDoc(messagesCollection, {
                createdAt: serverTimestamp(),
                type: 'notificaiton',
                text: `${kickedParticipant.name} was kicked from the chat.`
            });
        }catch(error){
            console.log(error);
        };
    };
    const kickParticipant = async(participantId) => {
        const participantDoc = doc(db, 'rooms', roomCode, 'participants', participantId);
        try{
            sendKickedNotificaion(participantId);
            await deleteDoc(participantDoc);
        }catch(error){
            console.log(error);
        }
    };

    //get messages
    React.useEffect(() => {
        let unsubscribe;
        let newMessagesList = [];
        try{
            const messagesQuery = query(messagesCollection, orderBy('createdAt'));
            unsubscribe = onSnapshot(messagesQuery, snapshot => {
                newMessagesList = [];
                snapshot.forEach(doc => {
                    const docData = doc.data();
                    if(docData.type == 'message'){
                        const message = {
                            id: doc.id,
                            type: docData.type,
                            sender: docData.sender,
                            senderId: docData.senderId,
                            timeSent: formatTime(docData.createdAt),
                            message: docData.text
                        };
                        newMessagesList.push(message);
                    }else{
                        const message = {
                            id: doc.id,
                            type: docData.type,
                            message: docData.text
                        };
                        newMessagesList.push(message);
                    };
                });
                setMessagesList(newMessagesList);
            });
        }catch(error){
            console.log(error);
        };
        return () => {
            if(unsubscribe){
                unsubscribe();
            }
        }
        
    }, []);
    //get participants
    React.useEffect(() => {
        let newParticipants = []
        const participantsCollection = collection(roomDoc, 'participants');
        try{
            const unsubscribe = onSnapshot(participantsCollection, snapshot => {
                newParticipants = [];
                snapshot.forEach(doc => {
                    const participantDoc = doc.data();
                    newParticipants.push(participantDoc);
                });
                setParticipants(newParticipants);
            });
            return () => unsubscribe();
        }catch(error){
            console.log(error);
        }
    }, []);
    //scroll to bottom of messages
    React.useEffect(() => {
        if(messageAreaRef.current){
            const scrollContainer = messageAreaRef.current;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, [messagesList]);
    //check if signed in
    React.useEffect(() => {
        if(!currentUser){
            navigate('/room-selection');
        }
    }, [currentUser, currentRoomCode]);
    //set room name
    React.useEffect(() => {
        assignRoomName(roomDoc);
    }, []);
    //check still in room
    React.useEffect(() => {
        const participantsCollection = collection(roomDoc, 'participants')
        const unsubscribe = onSnapshot(participantsCollection, (snapshot) => {
            const participantsDocs = snapshot.docs;
            if(Object.keys(currentUser).length !== 0 && !participantsDocs.find(participant => participant.id == currentUser.uid)){
                setCurrentRoomCode(null);
                navigate('/room-selection');
            }
        })  

        return() => unsubscribe();
    }, []);
    //get adminUID
    React.useEffect(() => {
        const getAdmin = async() => {
            const thisRoomDoc = await getDoc(roomDoc);
            const roomData = thisRoomDoc.data();
            participants.forEach(participant => {
                if(roomData.createdBy == participant.id){
                    setAdminUID(participant.id);
                };
            });
        };
        if(participants){
            getAdmin();
        }
        
    }, [participants]);
    
    return(
        roomName.trim() !== '' ?
        <div className='overflow-hidden justify-center relative w-full h-full bg-background-color flex flex-col items-center'> {/* background */}
            {/* main */}
            {showPopup && <Popup participantToKick={participantToKick} setParticipantToKick={setParticipantToKick} kickParticipant={kickParticipant} popupType={popupType} toggleShowPopup={toggleShowPopup}/>}
            <div className='flex relative h-full flex-col w-full max-w-[768px] items-center tablet:border tablet:border-black overflow-clip justify-between'>
                {/* header */}
                <div className='absolute z-20 top-0 w-full bg-navbar-color px-[1rem] py-[0.5rem] flex flex-row justify-between items-center'>
                    <div>
                        <p className='text-light-green text-[1.5rem] l:text-[1.75rem]'>{roomName}</p>
                        <p className='text-light-green'>room code: {roomCode}</p>
                    </div>
                    <img onClick={toggleDropdown} className='w-[2rem] h-[2rem] hover:cursor-pointer' src={'/assets/menu.png'} />
                    {showDropdown && <Dropdown className={`top-[80px]`} toggleDropdown={toggleDropdown} dropdownOptions={dropdownOptions}/>}
                    {showSeeParticipants && <SeeParticipants adminUID={adminUID} participants={participants} toggleSeeParticipants={toggleSeeParticipants} toggleShowPopup={toggleShowPopup}/>}
                </div>
                 {/* chat area */}
                <div ref={messageAreaRef} className='custom-scrollbar relative overflow-y-auto flex flex-col items-center p-[1rem] w-full h-full mt-[85.5px]'>
                    {messagesElemets}
                </div>
                 {/* text box */}
                <div className='relative flex flex-row justify-center items-center mb-[2rem] mt-[1rem] w-full z-20'>
                    <input onKeyDown={handleEnterPress} onChange={(event) => {setMessageText(event.target.value);}} value={messageText} className='w-[90%] h-[45px] py-[0.5rem] px-[1rem] pr-[2rem] rounded-full' type='text' placeholder='enter message...' />
                    <div onClick={sendMessage} className='absolute right-[5%] w-[50px] h-[50px] hover:cursor-pointer flex items-center justify-center' >
                        <img className='w-[20px]' src={'/assets/send.png'} />
                    </div>
                </div>
                <img className='z-10 absolute w-[5rem] bottom-[-1.5rem] left-[-1.5rem]' src={'assets/pepe.png'}/>
            </div>
        </div>
        :
        <Loading />
    );
};