"use client"
import React from 'react';

function GreetingCard({ name }: { name: string }) {
  return (
    <div className="relative rounded-xl max-h-fit ml-2 p-2 overflow-hidden">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src='/giphy.mp4' type="video/mp4" />
      </video>
      <div className="relative z-10 text-white p-2">
        <h2 className="text-2xl font-bold">WELCOME BACK</h2>
        <h1 className="text-2xl mt-1 font-semibold text-white-950">{name}</h1>
        <div className="mt-1 font-medium text-xl">Great To See You Again </div>
        <div className='font-bold text-white-950 text-xl'>Check Your Classes, Timetable, Homework, And Attendance On Your Dashboard.</div>
      </div>
    </div>
  );
}

export default GreetingCard;
