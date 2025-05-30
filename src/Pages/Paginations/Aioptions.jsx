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

const cards =
  [
    {
      icon: <SiGoogleforms className="text-4xl " />,
      title: "Generate Questions",
      description: "Create custom questions instantly with AI assistance.",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdInsertDriveFile className="text-4xl " />,
      title: "Generate Questions from Image",
      description: "Upload an image and let AI extract questions from content.",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdAudiotrack className="text-4xl " />,
      title: "Generate Questions from Audio",
      description: "Convert spoken lectures or recordings into quiz questions.",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <TbFileSpreadsheet className="text-4xl " />,
      title: "Generate Questions from Excel",
      description: "Extract and generate questions from Excel sheet data.",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdOutlinePictureAsPdf className="text-4xl " />,
      title: "Generate Questions from PDF",
      description: "Upload PDF files and let AI generate questions from text.",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdSlideshow className="text-4xl " />,
      title: "Generate Questions from PPT",
      description: "Turn your presentation slides into practice questions.",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdAssignment className="text-4xl " />,
      title: "Generate Questions from Word",
      description: "Use your Word documents as a source for smart questions.",
      bgColor: "bg-emerald-50",
      hoverColor: "hover:bg-emerald-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <FaLink className="text-4xl " />,
      title: "Generate Questions from URL",
      description: "Paste a URL and generate questions from the page content.",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdVideoLibrary className="text-4xl " />,
      title: "Generate Questions from Video",
      description: "Let AI analyze videos and produce quiz-worthy questions.",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <FaParagraph className="text-4xl " />,
      title: "Generate Questions from Paragraph",
      description: "Paste any paragraph and convert it into quality questions.",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <FaBrain className="text-4xl " />,
      title: "Generate Questions from Topic",
      description: "Input any topic and get topic-specific questions generated.",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      path: "/ai-questions",
      isComingSoon: true,
    },
    {
      icon: <MdQuiz className="text-4xl " />,
      title: "Generate Aptitude Questions",
      description: "Automatically create aptitude questions by difficulty level.",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      path: "/ai-questions",
      isComingSoon: true,
    }
  ];



const Aioptions = () => {
  const comingSoonIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
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
            AI Generate Options
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

export default Aioptions;