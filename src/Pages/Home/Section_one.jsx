// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BsCheckCircleFill, BsRocketTakeoff } from 'react-icons/bs';
// import { FaRobot } from 'react-icons/fa';
// import digiaiquest from '../../assets/digiaiquest.mp4'

// const Section_one = () => {
//     const navigate = useNavigate();

//     const handleTryFree = () => {
//         navigate('/login'); // Redirects to login page when Try Free is clicked
//     };

//     return (
//         <div className="min-h-fit bg-gray-900 mt-15">
//             {/* Background Video */}
//             <video
//                 autoPlay
//                 muted
//                 loop
//                 className="absolute top-0 left-0 w-full h-[88.4vh] sm:h-[80vh] md:h-[74.2vh] lg:h-[78vh] xl:h-[85vh] 2xl:h-[78vh] object-cover z-0 opacity-60"
//             >
//                 <source src={digiaiquest} type="video/mp4" />
//                 Your browser does not support the video tag.
//             </video>

//             {/* Dark Overlay */}
//             {/* <div className="absolute inset-0 bg-black bg-opacity-60 z-10" /> */}
//             <div className="relative z-20 px-4 py-8 max-w-7xl mx-auto">
//                 {/* Hero Section */}
//                 <div className="text-center mb-16 ">
//                     <div className="flex justify-center mb-8">
//                         <FaRobot className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
//                     </div>
//                     <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8 leading-17">
//                         DigiAiQuest<br />
//                         <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text ">
//                             AI-Powered Question Generator
//                         </span>
//                     </h1>
//                     <p className="text-gray-400 max-w-2xl mx-auto text-lg ">
//                         Transform your learning experience with our revolutionary AI-powered
//                         examination platform. Coming soon to revolutionize education.
//                     </p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4 mb-16 px-4 sm:px-0 max-w-lg mx-auto">
//                     <button
//                         onClick={handleTryFree}
//                         className=" group relative px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden cursor-pointer"
//                     >
//                         <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
//                         <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
//                             <BsRocketTakeoff className="text-lg" />
//                             Try Now
//                         </span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Section_one;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsRocketTakeoff } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';
import digiaiquest from '../../assets/digiaiquest.mp4';

const Section_one = () => {
    const navigate = useNavigate();

    const handleTryFree = () => {
        navigate('/login');
    };

    return (
        <div className="relative min-h-auto bg-gray-900 overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                className="    absolute top-0 left-0 w-full h-[88.4vh] sm:h-[80vh] md:h-[74.2vh] lg:h-[78vh] xl:h-[85vh] 2xl:h-[78vh] object-cover z-0 opacity-60"
            >
                <source src={digiaiquest} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center min-h-[78vh]  px-4 py-16">
                <div className="text-center max-w-3xl">
                    <div className="flex justify-center mb-6">
                        <FaRobot className="w-20 h-20 text-purple-400 animate-pulse" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-white leading-tight mb-6 ">
                        DigiAiQuest
                        <br />
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text ">
                            AI-Powered Question Generator 
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
                        Transform your learning experience with our revolutionary AI-powered
                        examination platform. Coming soon to revolutionize education.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={handleTryFree}
                            className="group relative px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                            <span className="relative flex items-center justify-center gap-2 text-base font-medium">
                                <BsRocketTakeoff className="text-lg" />
                                Try Now
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section_one;
