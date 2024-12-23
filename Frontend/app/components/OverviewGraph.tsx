"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

function OverviewGraph() {
    // const [data, setData] = useState([]);

    interface DataPoint {
        subject: string;
        Performance: number;
        Attendance: number;
    }

    const data: DataPoint[] = [
        { subject: 'Java', Performance: 20, Attendance: 15 },
        { subject: 'Physics', Performance: 50, Attendance: 25 },
        { subject: 'Maths', Performance: 40, Attendance: 100 },
        { subject: 'DSA', Performance: 90, Attendance: 65 },
        { subject: 'Music', Performance: 58, Attendance: 10 },
        { subject: 'Dance', Performance: 41, Attendance: 60 },
        { subject: 'Tech', Performance: 77, Attendance: 20 },
        { subject: 'Algo', Performance: 68, Attendance: 20 },
    ];

    // useEffect(() => {
    //     // Fetch data from the API
    //     const fetchData = async () => {
    //       try {
    //         const response = await fetch('http://localhost:3000/api/v1/student/seeStats',{
    //           headers : {
    //             'Authorization' : "Bearer " + localStorage.getItem('token')
    //           }
    //         }); // Replace with your actual API endpoint
    //         const result = await response.json();
    //         console.log(result);
    //         // Transform the data to match the format required by Recharts
    //         const formattedData = result.stats.map(([subject, performance, classesAttended, totalClasses]) => ({
    //           name: subject,
    //           Performance: performance,
    //           Attendance: (classesAttended / totalClasses) * 100,
    //         }));
    
    //         setData(formattedData);
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md ml-2 border-2 border-neutral-200 h-[385px]">
            <h3 className="text-lg font-semibold mb-4">Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Performance" stroke="#8884d4" dot />
                    <Line type="monotone" dataKey="Attendance" stroke="#82ca9d" dot />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default OverviewGraph;
