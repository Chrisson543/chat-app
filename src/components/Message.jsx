import React from 'react';
import { AuthContext } from '../backend/AuthContext';

export default function Message({ sender, senderId, timeSent, message }){
    const { currentUser } = React.useContext(AuthContext);
    const sentByMe = () => {
        if(sender == currentUser.displayName && senderId == currentUser.uid){
            return true;
        }else{
            return false;
        }
    };

    const styles = {
        messageRow: {
            sent: 'w-full flex flex-col items-end',
            received: 'w-full flex flex-col items-start'
        },
        sendersName: {
            sent: 'pr-[1rem] text-[#CD7878]',
            received: 'text-[#CD7878]'
        },
        messageTimeContainer: {
            sent: 'max-w-[80%] tablet:max-w-[70%] flex flex-row-reverse items-center space-x-reverse space-x-[0.5rem]',
            received: 'max-w-[80%] tablet:max-w-[70%] flex flex-row items-center space-x-[0.5rem]'
        },
        messageBubble: {
            sent: 'bg-light-green px-[1rem] py-[0.5rem] rounded-3xl w-full',
            received: 'bg-white px-[1rem] py-[0.5rem] rounded-3xl w-full'
        }
    };

    return(
        <div className={sentByMe() ? styles.messageRow.sent : styles.messageRow.received}>
            <p className={sentByMe() ? styles.sendersName.sent : styles.sendersName.received}>{sender}</p>
            <div className={sentByMe() ? styles.messageTimeContainer.sent : styles.messageTimeContainer.received}>
                <div className={sentByMe()? styles.messageBubble.sent: styles.messageBubble.received}>
                    <p className='break-words'>{message}</p>
                </div>
                <p className='text-grey'>{timeSent}</p>
            </div>
        </div>
    );
};