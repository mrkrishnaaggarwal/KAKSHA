import React from 'react';
import g from '../../public/giphy.mp4';
const Header: React.FC = () => {
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden">
      <video src = '/giphy.mp4' className="absolute inset-0 w-full h-full object-cover"
        loop
        autoPlay
        muted></video>
        
        <div>
        
        
    </div>
      <div className="absolute inset-0 bg-purple-600/30" />
      
      <div className="relative z-10 h-full p-8 flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white">
          <span className="text-gray-400">120 x 120</span>
        </div>
        
        <div className="flex flex-col text-white">
          <h1 className="text-4xl font-bold mb-2">John Doe</h1>
          <p className="text-xl text-gray-100">Student | Computer Science Major | Roll No</p>
        </div>
      </div>
    </div>
  );
};

export default Header;