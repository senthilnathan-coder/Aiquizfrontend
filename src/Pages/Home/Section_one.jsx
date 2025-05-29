import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCheckCircleFill, BsRocketTakeoff } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';

const Section_one = () => {
    const navigate = useNavigate();

    const handleTryFree = () => {
        navigate('/login'); // Redirects to login page when Try Free is clicked
    };

    return (
        <div className="min-h-auto bg-gray-900 mt-15">
            <div className="px-4 py-8 max-w-7xl mx-auto ">
                {/* Hero Section */}
                <div className="text-center mb-16 ">
                    <div className="flex justify-center mb-8">
                        <FaRobot className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8 leading-17">
                        DigiAiQuest<br />
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text ">
                            AI-Powered Question Generator
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg ">
                        Transform your learning experience with our revolutionary AI-powered
                        examination platform. Coming soon to revolutionize education.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4 mb-16 px-4 sm:px-0 max-w-lg mx-auto">
                    <button
                        onClick={handleTryFree}
                        className="flex-1 group relative px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
                            <BsRocketTakeoff className="text-lg" />
                            Try To Free
                        </span>
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="flex-1 group relative px-6 sm:px-8 py-3.5 bg-white/5 backdrop-blur-sm text-white rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
                            <BsCheckCircleFill className="text-lg" />
                            Register Now
                        </span>
                    </button>
                </div>

                {/* Features Preview */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { title: "AI Question Generation", desc: "Generate unique questions instantly" },
                        { title: "Smart Assessment", desc: "Automated grading and feedback" },
                        { title: "Custom Templates", desc: "Create your own question formats" },
                        // { title: "Online Exam", desc: "" },
                        // { title: "Quizzes", desc: "" },
                        // { title: "Code Assignment", desc: "" },
                        // { title: "Intractive Lesson", desc: "" },
                    ].map((feature, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                            <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div> */}


            </div>
        </div>
    );
};

export default Section_one;