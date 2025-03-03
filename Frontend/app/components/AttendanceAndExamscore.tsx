"use client";
// { useState, useEffect } 
// import axios from 'axios';

import React from "react";
// , { useState }
import { CircularProgressbar } from "react-circular-progressbar";
// , buildStyles
import "react-circular-progressbar/dist/styles.css";


function AttendanceAndExamscore() {

    const attended = 100;
    const total = 150;
    const performance = 200;

    const attendencepercentage = Math.ceil(attended / total * 100); // Change this to test the threshold.
    const exampercentage = Math.ceil(performance / 500 * 100); // Change this to test the threshold.

    // Threshold-based color logic
    const getColor = (value: number) => {
        if (value < 45) return "green";
        if (value < 75) return "orange";
        return "red";
    };

    //   const [percent, setPercent] = useState(0);
    //   const [attended, setAttended] = useState(0);
    //   const [total, setTotal] = useState(0);
    //   const [performance, setPerformance] = useState(0);

    //   useEffect(() => {
    //     const fetchAttendance = async () => {
    //       try {
    //         const response = await axios.get("http://localhost:3000/api/v1/student/totalattendance", {
    //           headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //           },
    //         });
    //         console.log(response.data);
    //         // Update state with the response data
    //         setPercent(response.data.percent);
    //         // console.log(response.data.totalClasses);
    //         setAttended(response.data.totalPresent);
    //         setTotal(response.data.totalClasses);
    //       } catch (e) {
    //         console.error(e);
    //       }
    //     };

    //     fetchAttendance(); // Call the async function
    //   }, []);
    //   useEffect(() => {
    //     const fetchAttendance = async () => {
    //       try {
    //         const response = await axios.get("http://localhost:3000/api/v1/student/examscores", {
    //           headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //           },
    //         });
    //         console.log(response.data);
    //         setPerformance(response.data.totalPerformanceIndex);

    //       } catch (e) {
    //         console.error(e);
    //       }
    //     };

    //     fetchAttendance(); // Call the async function
    //   }, []);
    return (
        <>
            <div className="grid grid-cols-2 gap-6 m-2 w-full">
                <div className="bg-white p-6 rounded-lg shadow-md border-2 mr-3 border-neutral-200">
                    <div className="flex">
                        <div>
                            <h3 className="text-2xl font-semibold text-fuchsia-700  p-3 text-center">Attendance Rate</h3>
                            <p className="text-xl font-bold border-purple-800 border-2 p-3 text-center">{attended}/{total}</p>
                        </div>
                        <div style={{ width: "120px", margin: "auto" }}>
                            <CircularProgressbar
                                value={attendencepercentage}
                                text={`${attendencepercentage}%`}
                                strokeWidth={15} // Added this line to make the ring thicker
                                styles={{
                                    root: {},
                                    path: {
                                        stroke: `${getColor(attendencepercentage)}`,
                                        strokeLinecap: 'butt',
                                        transition: 'stroke-dashoffset 0.5s ease 0s',
                                        transform: 'rotate(0.25turn)',
                                        transformOrigin: 'center center',
                                    },
                                    trail: {
                                        stroke: '#d6d6d6',
                                        strokeLinecap: 'butt',
                                        transform: 'rotate(0.25turn)',
                                        transformOrigin: 'center center',

                                    },
                                    text: {
                                        fill: '#f88',
                                        fontSize: '16px',
                                    },
                                    background: {
                                        fill: '#3e98c7',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-neutral-200 mr-2">
                    <div className="flex">
                        <div>
                            <h3 className="text-2xl font-semibold text-fuchsia-700 border-purple-800 border-2 p-3 text-center">Exam Scores</h3>
                            <p className="text-xl font-bold border-purple-800 border-2 p-3 text-center">{performance}/500</p>
                        </div>
                        <div style={{ width: "120px", margin: "auto" }}>
                            <CircularProgressbar
                                value={exampercentage}
                                text={`${exampercentage}%`}
                                strokeWidth={15} // Added this line to make the ring thicker
                                styles={{
                                    root: {},
                                    path: {
                                        stroke: `${getColor(exampercentage)}`,
                                        strokeLinecap: 'butt',
                                        transition: 'stroke-dashoffset 0.5s ease 0s',
                                        transform: 'rotate(0.25turn)',
                                        transformOrigin: 'center center',
                                    },
                                    trail: {
                                        stroke: 'c',
                                        strokeLinecap: 'butt',
                                        transform: 'rotate(0.25turn)',
                                        transformOrigin: 'center center',

                                    },
                                    text: {
                                        fill: '#f88',
                                        fontSize: '16px',
                                    },
                                    background: {
                                        fill: '##4CC9F0',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceAndExamscore
