"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { RiHome3Line } from 'react-icons/ri';
import { IoBarChartOutline, IoHelpCircleOutline, IoLogOutOutline } from 'react-icons/io5';
import { AiOutlineSchedule } from 'react-icons/ai';
import { CiBookmarkCheck } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';
import logo from '@/public/logo.jpg'


function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/professor/dashboard", label: "Dashboard", icon: <RiHome3Line /> },
        { href: "/professor/announcement", label: "Curriculum", icon: <IoBarChartOutline /> },
        { href: "/professor/classes", label: "Classes", icon: <AiOutlineSchedule /> },
        { href: "/professor/attendance", label: "Attendance", icon: <CiBookmarkCheck /> },
        { href: "/professor/myprofile", label: "My Profile", icon: <CgProfile /> },
        // yahan aur links dal dena agar need hogi toh
    ];

    return (
        <div className="w-[15%] h-full bg-gray-100 flex flex-col p-4 border-r-2 border-neutral-300">
            <div className="mb-3">
                <Image className='mix-blend-multiply' src={logo} alt="logo" />
            </div>
            <nav className="w-4/5 min-w-fit">
                <ul>
                    {links.map((link, index) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={index} className="mb-2">
                                <Link
                                    href={link.href}
                                    className={
                                        `${isActive ? "bg-neutral-200 text-[#6A2CFF]" : "hover:bg-gray-300 text-neutral-950"} px-2 py-1 rounded-lg w-full flex items-center gap-2 text-lg`
                                    }
                                >
                                    {link.icon}{link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className='flex flex-col justify-end flex-1 w-4/5 min-w-fit'>
                <div>
                    <Link href="/help" className={"text-base  px-2 py-1 rounded-lg text-black hover:bg-gray-300 w-full flex items-center gap-2"}>
                        <IoHelpCircleOutline />Help
                    </Link>
                    <Link href="/logout" className={"text-base  px-2 py-1 rounded-lg text-red-600 w-full flex items-center gap-2 hover:bg-gray-300"}>
                        <IoLogOutOutline />Logout Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;