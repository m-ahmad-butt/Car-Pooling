import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-x-4 top-[10rem] lg:absolute lg:top-full lg:right-0 lg:mt-4 lg:w-[180px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] animate-in slide-in-from-top-4 duration-300 overflow-hidden">
            <div className="p-1.5">
                <button 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors group rounded-xl"
                    onClick={() => {
                        navigate('/profile');
                        onClose();
                    }}
                >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <span>View Profile</span>
                </button>

                <div className="h-[1px] bg-gray-50 my-1 mx-2"></div>

                <button 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors group rounded-xl"
                    onClick={() => {
                        alert("Logging out...");
                        window.location.href = '/';
                        onClose();
                    }}
                >
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <span>Logout</span>
                </button>
            </div>

            <div 
                className="fixed inset-0 z-[-1]" 
                onClick={onClose}
            ></div>
        </div>
    );
};

export default ProfileMenu;
