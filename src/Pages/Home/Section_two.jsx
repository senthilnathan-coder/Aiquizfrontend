import React from 'react';
import { SiGoogleforms } from 'react-icons/si';
import { MdQuiz, MdAssignment, MdSchool, MdOutlineDescription } from 'react-icons/md';
import { TbBrandOpenai, TbPlayerPlay } from 'react-icons/tb';
import { FaCode } from 'react-icons/fa';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const cards = [
    {
        icon: <TbBrandOpenai className="text-4xl" />,
        title: "AI Quiz Generator",
        description: "Quick questions, quicker minds — sharpen your edge.",
        path: "/aioption"
    },
    {
        icon: <MdSchool className="text-4xl" />,
        title: "AI Mentor",
        description: "Your personalized AI tutor to guide learning paths.",
        path: "/aimentor"
    },
    {
        icon: <SiGoogleforms className="text-4xl" />,
        title: "Online Exams",
        description: "Conduct secure and flexible exams anytime, anywhere.",
        path: "/online-exam"
    },
    {
        icon: <MdQuiz className="text-4xl" />,
        title: "Flashcards Generator",
        description: "Smart Flashcards, Smarter AI Quiz Prep.",
        path: "/quizzes"
    },
    {
        icon: <HiOutlineClipboardList className="text-4xl" />,
        title: "Paper Exams",
        description: "Upload and manage traditional written exams digitally.",
        path: "/paper-exams"
    },
    {
        icon: <FaCode className="text-4xl" />,
        title: "Code Assignment",
        description: "Assign and evaluate coding tasks with ease.",
        path: "/code-assignment"
    },
    {
        icon: <MdOutlineDescription className="text-4xl" />,
        title: "Paper Assignment",
        description: "Manage and track traditional assignments digitally.",
        path: "/paper-assignment"
    },
    {
        icon: <TbPlayerPlay className="text-4xl" />,
        title: "Summary Notes",
        description: "Quick Glance, Deep Recall.",
        path: "/lessons"
    },
];

const Section_two = () => {
    const navigate = useNavigate();

    const handleCardClick = (path, index) => {
        // Only some features are active
        const isComingSoon = index >= 2; // You can customize this logic
        if (!isComingSoon) {
            window.scrollTo(0, 0);
            navigate(path);
        }
    };

    return (
        <section className="bg-gradient-to-b from-gray-800 to-blue-950 py-12 text-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent py-3">
                        Unlock Smarter Learning, Powered by AI
                    </h2>
                    <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
                        From question generation to full-fledged assessments — everything you need to educate, evaluate, and elevate in one intelligent suite.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((card, index) => {
                        const isComingSoon = index >= 2;

                        return (
                            <div
                                key={index}
                                role="button"
                                aria-disabled={isComingSoon}
                                className={`relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-3xl p-6 overflow-hidden group transition-all duration-300 ${isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2'
                                    }`}
                                onClick={() => handleCardClick(card.path, index)}
                            >
                                {/* Coming Soon Overlay */}
                                {isComingSoon && (
                                    <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Coming Soon
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="mb-4 flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {card.icon}
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-lg font-semibold text-center mb-2">{card.title}</h3>
                                <p className="text-gray-300 text-sm text-center">{card.description}</p>

                                {/* Border Glow on Hover */}
                                <div className="absolute inset-0 border border-purple-500 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Section_two;
