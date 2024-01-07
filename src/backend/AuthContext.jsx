import { onAuthStateChanged, signOut } from 'firebase/auth';
import React from 'react';
import { auth, db } from './firebase-config';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';

export const AuthContext = React.createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = React.useState({});
    // console.log(currentUser);
    const [currentRoomCode, setCurrentRoomCode] = React.useState(null);
    // console.log(currentRoomCode)

    const leaveRoom = async() => {
        try{
            const onlineRoomDoc = doc(db, 'rooms', currentRoomCode, 'participants', currentUser.uid);
            sendLeaveNotificaion();
            await deleteDoc(onlineRoomDoc);
        }catch(error){
            console.log(error);
        }
    };
    const logOut = async() => {
        try{
            if(currentRoomCode){
                setCurrentRoomCode(null);
                await leaveRoom(); 
            };
            await signOut(auth);
        }catch(error){
            console.log(error);
        }
    };
    const sendLeaveNotificaion = async () => {
        const messagesCollection = collection(db, 'rooms', currentRoomCode, 'messages');
        try{
            await addDoc(messagesCollection, {
                createdAt: serverTimestamp(),
                type: 'notificaiton',
                text: `${currentUser.displayName} left the chat.`
            });
        }catch(error){
            console.log(error);
        };
    };

    //sign in
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => {
            unsubscribe();
        }
    }, []);

    //check if currently in room
    React.useEffect(() => {
        const checkIfInRoom = async() => {
            const roomsCollection = collection(db, 'rooms');
            try{
                const roomsDoc = await getDocs(roomsCollection);
                roomsDoc.docs.map(async(room) => {
                    const participantsDoc = doc(db, 'rooms', room.id, 'participants', currentUser.uid);
                    const participantDocSnapshot = await getDoc(participantsDoc);
                    const participantDocSnapshotExists = participantDocSnapshot.exists();
                    if(participantDocSnapshotExists){
                        setCurrentRoomCode(room.id);
                    };
                });
            }catch(error){
                console.log(error);
            } 
        };
        if(currentUser){
            if(Object.keys(currentUser).length !== 0){
                checkIfInRoom();
            };
        };
    }, [currentUser]);
    
    return(
        <AuthContext.Provider value={{currentUser, currentRoomCode, setCurrentRoomCode, leaveRoom, logOut, sendLeaveNotificaion}}>
            {children}
        </AuthContext.Provider>
    );
};