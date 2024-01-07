import React from 'react';
import { AuthContext } from '../backend/AuthContext';

export default function SeeParticipants({ adminUID, participants, toggleSeeParticipants, toggleShowPopup }){

    const { currentUser } = React.useContext(AuthContext);
    const seeParticipantsRef = React.useRef(null);
    const handleClickOutside = (event) => {
        if(seeParticipantsRef.current && !seeParticipantsRef.current.contains(event.target)){
            toggleSeeParticipants();
        }
    }
    const onlineParticipantElement = participants.map(participant => {
        return(
            <div key={participant.id} className='mb-[0.5rem] flex flex-row items-center w-full justify-between'>
                <div className='flex flex-row items-center space-x-[1rem]'>
                    <img src={'/assets/green-circle.png'} />
                    <p>{participant.id == adminUID ? 'admin: ' : ''}{participant.name}</p>
                </div>
                {currentUser.uid == adminUID && participant.id !== currentUser.uid && <p onClick={() => {toggleSeeParticipants(); toggleShowPopup('kick', {uid: participant.id, name: participant.name})}} className='underline hover:cursor-pointer'>kick</p>}
            </div>
        );
    });
    
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>  document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return(
        <div ref={seeParticipantsRef} className='z-10 shadow-xl absolute right-0 top-[86px] text-light-green w-full bg-background-color flex flex-col p-[1rem]'>
            <img onClick={toggleSeeParticipants} className='hover:cursor-pointer absolute right-[10px] top-[10px]' src={'/assets/close.png'} />
            <div className='text-light-green'>
                <div className='mb-[1.5rem] flex flex-row items-center space-x-[1rem] border-b border-b-light-green w-fit'>
                    <img src={'/assets/green-circle.png'} />
                    <p>online</p>
                </div>
                {onlineParticipantElement}
            </div>
        </div>
    );
};