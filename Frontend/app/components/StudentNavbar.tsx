'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiHome3Line } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { IoBarChartOutline } from "react-icons/io5";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoLogOutOutline, IoHelpCircleOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import Image from 'next/image';
import logo from '@/public/logo.jpg';

const StudentSidebar = () => {
    const pathname = usePathname(); 

    const navItems = [
        { href: "/student/dashboard", label: "Dashboard", icon: <RiHome3Line /> },
        { href: "/student/announcements", label: "Announcements", icon: <GrAnnounce /> },
        { href: "/student/result", label: "Results", icon: <BsFileEarmarkText /> },
        { href: "/student/resources", label: "Resources", icon: <IoBarChartOutline /> },
        { href: "/student/community", label: "Community", icon: <AiOutlineSchedule /> },
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
                    <Link href="/help" className={`text-base px-2 py-1 rounded-lg w-full flex items-center gap-2 ${pathname === '/help' ? 'bg-neutral-200 text-[#6A2CFF]' : 'hover:bg-gray-300'
                                }`}>
                            <IoHelpCircleOutline /> Help
                    </Link>
                    <Link href="/logout" className="text-base text-red-600 hover:bg-gray-300 px-2 py-1 rounded-lg w-full flex items-center gap-2">
                            <IoLogOutOutline /> Logout Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentSidebar;
// 'use client';

// import React, { useState, useEffect } from 'react';
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

// const StudentNavbar = () => {
//     const pathname = usePathname();
//     const [isSmallScreen, setIsSmallScreen] = useState(false);

//     // Check screen size on component mount and window resize
//     useEffect(() => {
//         const checkScreenSize = () => {
//             setIsSmallScreen(window.innerWidth < 768);
//         };
        
//         // Initial check
//         checkScreenSize();
        
//         // Add event listener for window resize
//         window.addEventListener('resize', checkScreenSize);
        
//         // Cleanup
//         return () => window.removeEventListener('resize', checkScreenSize);
//     }, []);

//     const navItems = [
//         { href: "/student/dashboard", label: "Dashboard", icon: <RiHome3Line /> },
//         { href: "/student/announcements", label: "Announcements", icon: <GrAnnounce /> },
//         { href: "/student/result", label: "Results", icon: <BsFileEarmarkText /> },
//         { href: "/student/resources", label: "Resources", icon: <IoBarChartOutline /> },
//         { href: "/student/community", label: "Community", icon: <AiOutlineSchedule /> },
//         { href: "/student/myprofile", label: "My Profile", icon: <CgProfile /> },
//     ];

//     return (
//         <div className="fixed h-screen w-[15%] min-w-[60px] max-w-[240px] bg-gray-100 flex flex-col p-4 border-r-2 border-neutral-300 overflow-y-auto">
//             <div className="mb-3">
//                 {!isSmallScreen && (
//                     <Image className="mix-blend-multiply" src={logo} alt="logo" />
//                 )}
//             </div>
//             <nav className={isSmallScreen ? "w-full" : "w-4/5 min-w-fit"}>
//                 <ul>
//                     {navItems.map((item) => (
//                         <li key={item.href} className="mb-2">
//                             <Link 
//                                 href={item.href} 
//                                 className={`${isSmallScreen ? 'justify-center' : 'px-2'} py-1 rounded-lg w-full flex items-center gap-2 ${
//                                     pathname === item.href 
//                                         ? 'bg-neutral-200 text-[#6A2CFF]' 
//                                         : 'hover:bg-gray-300'
//                                 }`}
//                                 title={item.label}
//                             >
//                                 <span className="text-xl">{item.icon}</span> 
//                                 {!isSmallScreen && <span>{item.label}</span>}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//             <div className={`flex flex-col justify-end flex-1 ${isSmallScreen ? "w-full" : "w-4/5 min-w-fit"}`}>
//                 <div>
//                     <Link 
//                         href="/help" 
//                         className={`${isSmallScreen ? 'justify-center' : 'px-2'} text-base py-1 rounded-lg w-full flex items-center gap-2 ${
//                             pathname === '/help' 
//                                 ? 'bg-neutral-200 text-[#6A2CFF]' 
//                                 : 'hover:bg-gray-300'
//                         }`}
//                         title="Help"
//                     >
//                         <IoHelpCircleOutline className="text-xl" /> 
//                         {!isSmallScreen && <span>Help</span>}
//                     </Link>
//                     <Link 
//                         href="/logout" 
//                         className={`${isSmallScreen ? 'justify-center' : 'px-2'} text-base text-red-600 hover:bg-gray-300 py-1 rounded-lg w-full flex items-center gap-2`}
//                         title="Logout Account"
//                     >
//                         <IoLogOutOutline className="text-xl" /> 
//                         {!isSmallScreen && <span>Logout Account</span>}
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StudentNavbar;