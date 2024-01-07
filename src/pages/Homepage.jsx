import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage(){
    
    return(
        <div className='flex flex-col h-full items-center justify-between'>
            <h1 className='mt-[5rem] text-light-green text-[2.5rem] tablet:text-[3rem] xl:text-[5rem] text-center'>welcome to<br/>chrisson's<br/>chat app</h1>
            <div className='flex flex-col tablet:flex-row space-y-[1rem] tablet:space-y-0 tablet:space-x-[3rem] tablet:mt-[2rem]  mb-[5rem]'>
                <Link to={'/login'}><button className='main-button text-[1.25rem] tablet:text-[1.5rem] xl:text-[2rem] tablet:w-[250px] w-full'>login</button></Link>
                <Link to={'/sign-up'}><button className='tablet:w-[250px] w-full main-button text-[1.25rem] tablet:text-[1.5rem] xl:text-[2rem]'>sign up</button></Link>
            </div>
            <img className='absolute left-0 top-0 tablet:left-[1.5rem] tablet:top-[1.5rem] w-[5rem] tablet:w-[7rem] l:w-[8rem] l:left-[3rem] xl:w-[12rem]' src={'/assets/laptop.png'} />
            <img className='absolute right-0 top-0 tablet:right-[1.5rem] tablet:top-[1.5rem] w-[5rem] tablet:w-[7rem] l:w-[8rem] l:right-[3rem] xl:w-[12rem]' src={'/assets/pepe.png'} />
            <img className='absolute left-0 bottom-0 tablet:left-[1.5rem] tablet:bottom-[1.5rem] w-[5rem] tablet:w-[7rem] l:w-[8rem] l:left-[3rem] xl:w-[12rem]' src={'/assets/speech-bubble.png'} />
            <img className='absolute right-0 bottom-0 tablet:right-[1.5rem] tablet:bottom-[1.5rem] w-[5rem] tablet:w-[7rem] l:w-[8rem] l:right-[3rem] xl:w-[12rem]' src={'/assets/camera.png'} />
        </div>
    );
};