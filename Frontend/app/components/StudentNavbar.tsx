// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { RiHome3Line } from "react-icons/ri";
// import { AiOutlineSchedule } from "react-icons/ai";
// import { IoBarChartOutline } from "react-icons/io5";
// import { BsFileEarmarkText } from "react-icons/bs";
// import { IoLogOutOutline, IoHelpCircleOutline } from "react-icons/io5";
// import { GrAnnounce } from "react-icons/gr";
// import { CgProfile } from "react-icons/cg";
// import Image from 'next/image';
// import logo from '@/public/logo.jpg';

// const StudentSidebar = () => {
//     const pathname = usePathname(); 

//     const navItems = [
//         { href: "/student/dashboard", label: "Dashboard", icon: <RiHome3Line /> },
//         { href: "/student/announcements", label: "Announcements", icon: <GrAnnounce /> },
//         { href: "/student/result", label: "Results", icon: <BsFileEarmarkText /> },
//         { href: "/student/resources", label: "Resources", icon: <IoBarChartOutline /> },
//         { href: "/student/community", label: "Community", icon: <AiOutlineSchedule /> },
//         { href: "/student/myprofile", label: "My Profile", icon: <CgProfile /> },
//     ];

//     return (
//         <div className="w-[15%] h-full bg-gray-100 flex flex-col p-4 border-r-2 border-neutral-300">
//             <div className="mb-3">
//                 <Image className="mix-blend-multiply" src={logo} alt="logo" />
//             </div>
//             <nav className="w-4/5 min-w-fit">
//                 <ul>
//                     {navItems.map((item) => (
//                         <li key={item.href} className="mb-2">
//                             <Link href={item.href} className={`text-lg px-2 py-1 rounded-lg w-full flex items-center gap-2 ${pathname === item.href ? 'bg-neutral-200 text-[#6A2CFF]' : 'hover:bg-gray-300'
//                                 }`}>
//                                 {item.icon} {item.label}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//             <div className="flex flex-col justify-end flex-1 w-4/5 min-w-fit">
//                 <div>
//                     <Link href="/help" className={`text-base px-2 py-1 rounded-lg w-full flex items-center gap-2 ${pathname === '/help' ? 'bg-neutral-200 text-[#6A2CFF]' : 'hover:bg-gray-300'
//                                 }`}>
//                             <IoHelpCircleOutline /> Help
//                     </Link>
//                     <Link href="/logout" className="text-base text-red-600 hover:bg-gray-300 px-2 py-1 rounded-lg w-full flex items-center gap-2">
//                             <IoLogOutOutline /> Logout Account
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StudentSidebar;


'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RiHome3Line } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { IoBarChartOutline } from "react-icons/io5";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoLogOutOutline, IoHelpCircleOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendarCheck } from "react-icons/fa";
import Image from 'next/image';
import logo from '@/public/logo.jpg';
import axios from 'axios';
// import Cookies from 'js-cookie';

const StudentSidebar = () => {
    const pathname = usePathname(); 
    const router = useRouter();

    const handleLogout = async () => {
        // Clear authentication tokens and cookies
        await axios.post('http://localhost:8080/api/v1/student/logout', null, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true
        })
        .then(response => {
            console.log('Logout successful');
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
        
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        // Redirect to login page
        router.push('/login');
        };

        const navItems = [
        { href: "/student/dashboard", label: "Dashboard", icon: <RiHome3Line /> },
        { href: "/student/announcements", label: "Announcements", icon: <GrAnnounce /> },
        { href: "/student/attendance", label: "Attendance", icon: <FaRegCalendarCheck /> },
        { href: "/student/result", label: "Results", icon: <BsFileEarmarkText /> },
        // { href: "/student/resources", label: "Resources", icon: <IoBarChartOutline /> },
        // { href: "/student/community", label: "Community", icon: <AiOutlineSchedule /> },
        { href: "/student/myprofile", label: "My Profile", icon: <CgProfile /> },
    ];

    return (
        <div className="w-[15%] h-full bg-gray-100 flex flex-col p-4 border-r-2 border-neutral-300">
            <div className="mb-3">
                <Image className="mix-blend-multiply" src={logo} alt="logo" />
            </div>
            <nav className="w-4/5 min-w-fit">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.href} className="mb-2">
                            <Link href={item.href} className={`text-lg px-2 py-1 rounded-lg w-full flex items-center gap-2 ${pathname === item.href ? 'bg-neutral-200 text-[#6A2CFF]' : 'hover:bg-gray-300'
                                }`}>
                                {item.icon} {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex flex-col justify-end flex-1 w-4/5 min-w-fit">
                <div>
                    {/* <Link href="/help" className={`text-base px-2 py-1 rounded-lg w-full flex items-center gap-2 ${pathname === '/help' ? 'bg-neutral-200 text-[#6A2CFF]' : 'hover:bg-gray-300'
                                }`}>
                        <IoHelpCircleOutline /> Help
                    </Link> */}
                    <button 
                        onClick={handleLogout} 
                        className="text-base text-red-600 hover:bg-gray-300 px-2 py-1 rounded-lg w-full flex items-center gap-2"
                    >
                        <IoLogOutOutline /> Logout Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentSidebar;
