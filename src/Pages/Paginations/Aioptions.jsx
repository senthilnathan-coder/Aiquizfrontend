import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
    MdQuiz,
    MdAssignment,
    MdSchool,
    MdTextFields,
    MdAudiotrack,
    MdInsertDriveFile,
    MdOutlinePictureAsPdf,
    MdSlideshow,
    MdVideoLibrary,
    MdLanguage
} from "react-icons/md";

import { SiGoogleforms } from "react-icons/si";
import { TbPlayerPlay, TbBrandOpenai, TbFileSpreadsheet } from "react-icons/tb";
import { FaParagraph, FaLink, FaBrain } from "react-icons/fa";

const cards = [
    {
        icon: <SiGoogleforms className="text-4xl text-red-500" />,
        title: "Generate Questions",
        bgColor: "bg-red-50",
        hoverColor: "hover:bg-red-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdInsertDriveFile className="text-4xl text-red-500" />,
        title: "Generate Questions from Image",
        bgColor: "bg-red-50",
        hoverColor: "hover:bg-red-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdAudiotrack className="text-4xl text-orange-500" />,
        title: "Generate Questions from Audio",
        bgColor: "bg-orange-50",
        hoverColor: "hover:bg-orange-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <TbFileSpreadsheet className="text-4xl text-purple-500" />,
        title: "Generate Questions from Excel",
        bgColor: "bg-purple-50",
        hoverColor: "hover:bg-purple-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdOutlinePictureAsPdf className="text-4xl text-blue-500" />,
        title: "Generate Questions from PDF",
        bgColor: "bg-blue-50",
        hoverColor: "hover:bg-blue-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdSlideshow className="text-4xl text-pink-500" />,
        title: "Generate Questions from PPT",
        bgColor: "bg-pink-50",
        hoverColor: "hover:bg-pink-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdAssignment className="text-4xl text-emerald-500" />,
        title: "Generate Questions from Word",
        bgColor: "bg-emerald-50",
        hoverColor: "hover:bg-emerald-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <FaLink className="text-4xl text-indigo-500" />,
        title: "Generate Questions from URL",
        bgColor: "bg-indigo-50",
        hoverColor: "hover:bg-indigo-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdVideoLibrary className="text-4xl text-teal-500" />,
        title: "Generate Questions from Video",
        bgColor: "bg-teal-50",
        hoverColor: "hover:bg-teal-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <FaParagraph className="text-4xl text-teal-500" />,
        title: "Generate Questions from Paragraph",
        bgColor: "bg-teal-50",
        hoverColor: "hover:bg-teal-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <FaBrain className="text-4xl text-teal-500" />,
        title: "Generate Questions from Topic",
        bgColor: "bg-teal-50",
        hoverColor: "hover:bg-teal-100",
        path: "/ai-questions",
        isComingSoon: true
    },
    {
        icon: <MdQuiz className="text-4xl text-teal-500" />,
        title: "Generate Aptitude Questions",
        bgColor: "bg-teal-50",
        hoverColor: "hover:bg-teal-100",
        path: "/ai-questions",
        isComingSoon: true
    }
];




const Aioptions = () => {
    const comingSoonIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const navigate = useNavigate();

    const handlecardClick = (card) => {
        navigate(card.path)
    };

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-10 h-fit mt-15">
            <div className="max-w-full mx-auto p-4">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                        AI Generate Options
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Comprehensive tools designed to make education more efficient and effective
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
                    {cards.map((card, index) => {
                        const showComingSoon = comingSoonIndexes.includes(index); // ✅ Check index

                        return (
                            <div
                                key={index}
                                className={`group relative overflow-hidden rounded-2xl p-8 ${card.bgColor} 
            border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 ease-out cursor-pointer`}
                                onClick={() => !showComingSoon && handlecardClick(card)} // ❌ block click if coming soon
                            >
                                {/* Coming Soon Overlay */}
                                {showComingSoon && (
                                    <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                                        <p className="text-2xl font-bold text-white">Coming Soon</p>
                                    </div>
                                )}

                                <div className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                                    <div className={`${card.bgColor} absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-75`} />
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                        <div className={`p-3 rounded-full ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                            {card.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
                                        <p className="text-gray-600 text-sm">{card.description}</p>
                                    </div>

                                    {/* Optional Duplicate Overlay (inner) */}
                                    {showComingSoon && (
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-xl font-bold">Coming Soon</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Aioptions;