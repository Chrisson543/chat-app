import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../backend/firebase-config';

export default function ErrorPage(){
    return(
        <div className='overflow-hidden relative w-full min-h-full bg-background-color flex flex-col items-center justify-center'>
            <div className='absolute top-0 w-full bg-navbar-color p-[1rem] flex flex-row items-center'>
                <p className='text-light-green pl-[20px] text-[1.5rem] l:text-[2rem]'>chat app</p>
            </div>
            <div className='flex flex-col items-center p-[1rem] w-full h-full text-center'>
                <p className='text-light-green text-[1.5rem] tablet:text-[2.5rem] l:text-[2.5rem] mt-[7rem]'>sorry {auth.currentUser.displayName}!<br/>an error occured! please return to the homepage</p>
                <div className='flex flex-col tablet:flex-row tablet:mt-[13rem] tablet:space-x-[5rem]'>
                    <Link to={'/'}><button className='main-button mt-[13rem] tablet:mt-0 l:text-[1.5rem] w-[15rem] l:w-[20rem]' >return to homepage</button></Link>
                </div>      
                <img className='absolute w-[5rem] bottom-[-1.5rem] left-[-1.5rem]' src={'/assets/pepe.png'}/>
            </div>
        </div>
    );
};