import React from 'react';

export default function Navbar(){
    return(
        <nav className='bg-navbar-color p-[1rem] flex flex-row items-center'>
            <img className='w-[1.5rem]' src={'/assets/back-arrow.png'} />
            <p className='text-light-green pl-[5px] text-[1.5rem]'>chat app</p>
        </nav>
    );
};