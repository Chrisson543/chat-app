import React from 'react';

export default function Dropdown(props){

    const dropdownRef = React.useRef(null);
    const dropdownOptions = props.dropdownOptions.map(option => {
        const handleClick = () => {
            option.action();
            props.toggleDropdown();
        };
        return <li key={option.text} className={`dropdown-option ${option.style}`} onClick={() => handleClick()} >{option.text}</li>
    });
    const handleClickOutside = (event) => {
        if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
            props.toggleDropdown();
        }
    }
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>  document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return(
        <ul ref={dropdownRef} className={`${props.className} z-10 border border-white shadow-sm absolute right-0 text-white w-[200px] bg-background-color flex flex-col`}>
            {dropdownOptions}
        </ul>
    );
};