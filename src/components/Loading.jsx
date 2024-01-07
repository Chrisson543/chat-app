import React from 'react';

export default function Loading(){
    const [loadingText, setLoadingText] = React.useState('Loading');

    React.useEffect(() => {
        setTimeout(() => {
            if(loadingText !== 'Loading...'){
                setLoadingText(prevState => prevState + '.');
            }else{
                setLoadingText('Loading');
            }
        }, 500)
    }, [loadingText]);

    return(
        <div className='flex items-center justify-center h-full w-full'>
            <p className='text-light-green text-[60px]'>{loadingText}</p>
        </div>
    );
};