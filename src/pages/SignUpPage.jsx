import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../backend/firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Popup from '../components/Popup';
import { AuthContext } from '../backend/AuthContext';

export default function SignUpPage(){

    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupType, setPopupType] = React.useState('');
    const { currentUser } = React.useContext(AuthContext);
    const passwordInputRef = React.useRef(null);


    const toggleShowPopup = (popupType) => {
        setPopupType(popupType);
        setShowPopup(prevState => !prevState);
    };
    const changePasswordVisibility = () => {
        passwordInputRef.current.type = passwordInputRef.current.type == 'password' ? 'text' : 'password';
    };

    const signUp = async() => {
        if(username.trim() !== '' && password.trim() !== ''){
            try{
                await createUserWithEmailAndPassword(auth, `${username}@chrissonapp.com`, password);
                await updateProfile(auth.currentUser, {
                    displayName: username
                });
                navigate('/room-selection');
            }catch(error){
                if(error.code == 'auth/weak-password'){
                    toggleShowPopup('shortPassword')
                }else if(error.code == 'auth/email-already-in-use'){
                    toggleShowPopup('usernameAlreadyInUse')
                }else{
                    console.log(error);
                }
            }
        }else{
            toggleShowPopup('emptyFields');
        }
    };

    React.useEffect(() => {
        if(currentUser && Object.keys(currentUser).length !== 0){
            navigate('/room-selection');
        }
    }, [currentUser]);

    return(
        <div className='overflow-hidden justify-center relative w-full min-h-full bg-background-color flex flex-col items-center'>
            {showPopup && <Popup toggleShowPopup={toggleShowPopup} popupType={popupType}/>}
            <div className='absolute top-0 w-full bg-navbar-color p-[1rem] flex flex-row items-center'>
                <Link to={'/'}><img className='w-[1.5rem] l:w-[2rem]' src={'/assets/back-arrow.png'} /></Link>
                <p className='text-light-green pl-[20px] text-[1.5rem] l:text-[2rem]'>chat app</p>
            </div>
            <div className='flex flex-col items-center p-[1rem] w-full h-full'>
                <p className='text-light-green text-[2rem] l:text-[2.5rem] mt-[5rem]'>sign up</p>
                <div className='flex flex-col items-left mt-[3rem]'>
                    <p className='text-light-green l:text-[1.5rem]'>username</p>
                    <input onChange={(event) => {setUsername(event.target.value)}} value={username}  className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='text' placeholder='enter username...' />
                </div>
                <div className='flex flex-col items-left mt-[3rem]'>
                    <p className='text-light-green l:text-[1.5rem]'>password</p>
                    <div className='relative'>
                        <input ref={passwordInputRef} onChange={(event) => {setPassword(event.target.value)}} value={password}  className='w-[95%] rounded-full py-[0.5rem] px-[1rem] l:text-[1.5rem]' type='password' placeholder='enter password...' />
                        <img onClick={changePasswordVisibility} className='w-[2rem] absolute right-[10%] top-[50%] translate-y-[-50%]' src={'/assets/eyeIcon.svg'} />
                    </div>
                </div>
                <button onClick={signUp} className='main-button w-[10rem] mt-[7rem] l:text-[1.5rem]' >sign up</button>
                <Link to={'/login'}><p className='text-white text-[0.75rem] l:text-[1rem] mt-[0.75rem] underline'>log in</p></Link>
                <img className='absolute w-[5rem] bottom-[-1.5rem] left-[-1.5rem]' src={'/assets/pepe.png'}/>
            </div>
        </div>
    );
};