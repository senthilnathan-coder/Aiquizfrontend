import React from 'react';
import { SiGoogleforms } from 'react-icons/si';
import { MdQuiz, MdAssignment, MdSchool } from 'react-icons/md';
import { TbBrandOpenai, TbPlayerPlay } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import {
  MdComputer,
  MdLanguage,
  MdTranslate,
  MdFunctions,
  MdCalculate,
  MdBiotech
} from "react-icons/md";
import { GiElephant, GiAtom, GiChemicalDrop } from "react-icons/gi";
import { FaCode } from "react-icons/fa";

const cards = [
  {
    icon: <MdComputer className="text-4xl " />,
    title: "Computer Science Ai Mentor",
    description: "Master data structures, algorithms, and CS theory with AI help.",
    bgColor: "bg-red-50",
    hoverColor: "hover:bg-red-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <MdLanguage className="text-4xl " />,
    title: "Tamil Language Ai Mentor",
    description: "Learn grammar, comprehension, and writing in Tamil easily.",
    bgColor: "bg-red-50",
    hoverColor: "hover:bg-red-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <MdTranslate className="text-4xl " />,
    title: "English Language Ai Mentor",
    description: "Improve English speaking, grammar, and writing with AI support.",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <MdFunctions className="text-4xl " />,
    title: "Math Ai Mentor",
    description: "Solve complex math problems step-by-step with AI guidance.",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <MdBiotech className="text-4xl " />,
    title: "Biology Ai Mentor",
    description: "Understand cells, genetics, and life systems interactively.",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <GiElephant className="text-4xl " />,
    title: "Zoology Ai Mentor",
    description: "Explore animal biology, classification, and behavior with AI help.",
    bgColor: "bg-pink-50",
    hoverColor: "hover:bg-pink-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <GiAtom className="text-4xl " />,
    title: "Physics Ai Mentor",
    description: "Learn motion, energy, and forces through AI-based explanations.",
    bgColor: "bg-emerald-50",
    hoverColor: "hover:bg-emerald-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <GiChemicalDrop className="text-4xl " />,
    title: "Chemistry Ai Mentor",
    description: "Understand atoms, reactions, and equations using AI guidance.",
    bgColor: "bg-indigo-50",
    hoverColor: "hover:bg-indigo-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <MdCalculate className="text-4xl " />,
    title: "Aptitude Ai Mentor",
    description: "Practice quantitative, logical, and verbal reasoning with AI support.",
    bgColor: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    path: "",
    isComingSoon: true,
  },
  {
    icon: <FaCode className="text-4xl " />,
    title: "Programming Languages Ai Mentor",
    description: "Learn Python, Java, C++, and more through AI-generated examples.",
    bgColor: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    path: "",
    isComingSoon: true,
  }
];




const Aimentor = () => {
  const comingSoonIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const navigate = useNavigate();

  const handlecardClick = (card) => {
    navigate(card.path)
  };

  return (
    <section className="bg-gradient-to-b from-gray-800 to-blue-950 py-16 text-white h-auto mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Mentor
          </h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Comprehensive tools designed to make education more efficient and effective
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cards.map((card, index) => {
            const showComingSoon = comingSoonIndexes.includes(index);
            return (
              <div
                key={index}
                className={`relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-3xl p-6 overflow-hidden group transition-all duration-300 ${showComingSoon ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2'}`}
                onClick={() => !showComingSoon && handlecardClick(card)}
              >
                {/* Coming Soon Overlay */}
                {showComingSoon && (
                  <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Coming Soon
                  </div>
                )}

                {/* Icon with glow */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white text-2xl">{card.icon}</div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-white text-center mb-2">{card.title}</h3>
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

export default Aimentor;