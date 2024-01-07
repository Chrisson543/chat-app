import React from 'react';

export default function ChatNotification({message}){
    return(
        <div>
            <p className='text-white'>{message}</p>
        </div>
    );
};