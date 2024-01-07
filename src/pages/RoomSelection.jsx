import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../backend/AuthContext';
import Loading from '../components/Loading';
import Popup from '../components/Popup';

export default function RoomSelection(){
    const { currentUser, currentRoomCode, logOut } = React.useContext(AuthContext);
    const [popupType, setPopupType] = React.useState(null);
    const [showPopup, setShowPopup] = React.useState(false);
    const navigate = useNavigate();
    
    const toggleShowPopup = () => {
        setShowPopup(prevState => !prevState);
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
            navigate(`/${currentRoomCode}`);
        }
    }, [currentRoomCode]);

    return(
        currentUser && currentUser.displayName ? 
        <div className='overflow-hidden relative w-full min-h-full bg-background-color flex flex-col items-center justify-center'>
            {showPopup && <Popup toggleShowPopup={toggleShowPopup} popupType={'logOut'} />}
            <div className='absolute top-0 w-full bg-navbar-color p-[1rem] flex flex-row items-center justify-between'>
                <p className='text-light-green pl-[20px] text-[1.5rem] l:text-[2rem]'>chat app</p>
                <p onClick={() => toggleShowPopup('logOut')} className='text-light-green hover:cursor-pointer hover:underline text-[1.2rem]'>log out</p>
            </div>
            <div className='flex flex-col items-center p-[1rem] w-full h-full'>
                <p className='text-light-green text-[1.5rem] tablet:text-[2.5rem] l:text-[2.5rem] mt-[7rem]'>welcome {currentUser.displayName}!</p>
                <div className='flex flex-col tablet:flex-row tablet:mt-[13rem] tablet:space-x-[5rem]'>
                    <Link to={'/join-room'}><button className='main-button mt-[13rem] tablet:mt-0 l:text-[1.5rem] w-[10rem] l:w-[15rem]' >join room</button></Link>
                    <Link to={'/create-room'}><button className='main-button mt-[3rem] tablet:mt-0 h-auto l:text-[1.5rem] w-[10rem] l:w-[15rem]' >create room</button></Link>
                </div>      
                <img className='absolute w-[5rem] bottom-[-1.5rem] left-[-1.5rem]' src={'/assets/pepe.png'}/>
            </div>
        </div>
        :
        <Loading />
    );
};