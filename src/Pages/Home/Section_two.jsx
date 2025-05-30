// import React from 'react';
// import { SiGoogleforms } from 'react-icons/si';
// import { MdQuiz, MdAssignment, MdSchool } from 'react-icons/md';
// import { TbBrandOpenai, TbPlayerPlay } from 'react-icons/tb';
// import { MdOutlineDescription } from "react-icons/md";
// import { FaCode } from "react-icons/fa";
// import { HiOutlineClipboardList } from "react-icons/hi";
// import { useNavigate } from 'react-router-dom';

// const cards =
//     [
//         {
//             icon: <TbBrandOpenai className="text-4xl " />,
//             title: "Quizzes ",
//             description: "Quick questions, quicker minds — sharpen your edge.",
//             bgColor: "bg-indigo-50",
//             hoverColor: "hover:bg-indigo-100",
//             path: "/aioption",
//             isComingSoon: true,
//         },
//         {
//             icon: <MdSchool className="text-4xl " />,
//             title: "AI Mentor",
//             description: "Your personalized AI tutor to guide learning paths.",
//             bgColor: "bg-teal-50",
//             hoverColor: "hover:bg-teal-100",
//             path: "/aimentor",
//             isComingSoon: true,
//         },
//         {
//             icon: <SiGoogleforms className="text-4xl " />,
//             title: "Online Exams",
//             description: "Conduct secure and flexible exams anytime, anywhere.",
//             bgColor: "bg-red-50",
//             hoverColor: "hover:bg-red-100",
//             path: "/online-exam",
//             isComingSoon: true,
//         },
//         {
//             icon: <MdQuiz className="text-4xl " />,
//             title: "AI Questions Generator",
//             description: " Never run out of questions. Let AI fuel your curiosity.",
//             bgColor: "bg-orange-50",
//             hoverColor: "hover:bg-orange-100",
//             path: "/quizzes",
//             isComingSoon: true,
//         },
//         {
//             icon: <HiOutlineClipboardList className="text-4xl " />,
//             title: "Paper Exams",
//             description: "Upload and manage traditional written exams digitally.",
//             bgColor: "bg-purple-50",
//             hoverColor: "hover:bg-purple-100",
//             path: "/paper-exams",
//             isComingSoon: true,
//         },
//         {
//             icon: <FaCode className="text-4xl " />,
//             title: "Code Assignment",
//             description: "Assign and evaluate coding tasks with ease.",
//             bgColor: "bg-blue-50",
//             hoverColor: "hover:bg-blue-100",
//             path: "/code-assignment",
//             isComingSoon: true,
//         },
//         {
//             icon: <MdOutlineDescription className="text-4xl " />,
//             title: "Paper Assignment",
//             description: "Manage and track traditional assignments digitally.",
//             bgColor: "bg-pink-50",
//             hoverColor: "hover:bg-pink-100",
//             path: "/paper-assignment",
//             isComingSoon: true,
//         },
//         {
//             icon: <TbPlayerPlay className="text-4xl " />,
//             title: "Interactive Lessons",
//             description: "Deliver lessons with videos, quizzes & hands-on tasks.",
//             bgColor: "bg-emerald-50",
//             hoverColor: "hover:bg-emerald-100",
//             path: "/lessons",
//             isComingSoon: true,
//         },
//     ];



// const Section_two = () => {
//     const comingSoonIndexes = [2, 3, 4, 5, 6, 7];
//     const navigate = useNavigate();

//     const handlecardClick = (card) => {
//         window.scrollTo(0, 0)
//         navigate(card.path)
//     };

//     return (
//         <section className="bg-gradient-to-b from-gray-800 to-blue-950 py-16 text-white h-auto ">
//             <div className="max-w-7xl mx-auto px-4">
//                 {/* Title */}
//                 <div className="text-center mb-16">
//                     <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//                         Unlock Smarter Learning, Powered by AI
//                     </h2>
//                     <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
//                         From question generation to full-fledged assessments — everything you need to educate, evaluate, and elevate in one intelligent suite.
//                     </p>
//                 </div>

//                 {/* Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                     {cards.map((card, index) => {
//                         const showComingSoon = comingSoonIndexes.includes(index);

//                         return (
//                             <div
//                                 key={index}
//                                 className={`relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-3xl p-6 overflow-hidden group transition-all duration-300 ${showComingSoon ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2'
//                                     }`}
//                                 onClick={() => !showComingSoon && handlecardClick(card)}
//                             >
//                                 {/* Coming Soon Overlay */}
//                                 {showComingSoon && (
//                                     <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         Coming Soon
//                                     </div>
//                                 )}

//                                 {/* Icon with glow */}
//                                 <div className="mb-4 flex items-center justify-center">
//                                     <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
//                                         <div className="text-white text-2xl">{card.icon}</div>
//                                     </div>
//                                 </div>

//                                 {/* Title & Description */}
//                                 <h3 className="text-lg font-semibold text-white text-center mb-2">{card.title}</h3>
//                                 <p className="text-gray-300 text-sm text-center">{card.description}</p>

//                                 {/* Border Glow on Hover */}
//                                 <div className="absolute inset-0 border border-purple-500 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </section>

//     );
// };

// export default Section_two;



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
        title: "Quizzes",
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
        title: "AI Questions Generator",
        description: "Never run out of questions. Let AI fuel your curiosity.",
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
        title: "Interactive Lessons",
        description: "Deliver lessons with videos, quizzes & hands-on tasks.",
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
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
                                className={`relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-3xl p-6 overflow-hidden group transition-all duration-300 ${
                                    isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2'
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
