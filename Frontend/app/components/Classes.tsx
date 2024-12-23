import React from 'react'
import { FaTimes } from 'react-icons/fa';
interface ClassesProps {
    props: string[];
    onClose: () => void;
}

function Classes({ props, onClose }: ClassesProps) {
    return (
        <>
            <div className="bg-[#ffa9e7] rounded-lg shadow-md m-2 border-2 border-neutral-200">
                <div className="flex flex-wrap gap-2 p-4">
                    {props.map((classItem, index) => (
                        <div key={index} className="w-30 h-30 p-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <h4 className="font-bold">{classItem}</h4>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="text-purple-400 hover:text-purple-800 text-2xl"
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
            </div >
        </>
    )
}

export default Classes