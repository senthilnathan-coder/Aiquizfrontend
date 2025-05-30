import React from 'react';
import { FaLinkedin, FaYoutube, FaTwitter, FaFacebook, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { TbBrandOpenai } from "react-icons/tb";
import company from "../assets/Logo.png";
import { FaSquareInstagram } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
const socialLinks = [
    {
        icon: <FaFacebook size={20} />,
        path: 'https://www.facebook.com/dialkaraikudi',
        label: 'Facebook',
        color: 'hover:text-blue-600 hover:bg-blue-600/10'
    },
    {
        icon: <FaSquareInstagram size={20} />,
        path: 'https://www.instagram.com/dialkaraikudi/#',
        label: 'Instagram',
        color: 'hover:text-blue-600 hover:bg-blue-600/10'
    },
    {
        icon: <FaLinkedin size={20} />,
        path: 'https://www.linkedin.com/company/dialkaraikudi',
        label: 'LinkedIn',
        color: 'hover:text-blue-500 hover:bg-blue-500/10'
    },
    {
        icon: <FaYoutube size={20} />,
        path: 'https://www.youtube.com/@dialkaraikudi',
        label: 'YouTube',
        color: 'hover:text-red-500 hover:bg-red-500/10'
    },
    // {
    //     icon: <FaTwitter size={20} />,
    //     path: '/',
    //     label: 'Twitter',
    //     color: 'hover:text-sky-500 hover:bg-sky-500/10'
    // },

];



const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900">
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center group cursor-pointer">
                            <Link to={'/'}>
                                <img
                                    src={company}
                                    alt='Logo'
                                    className="text-4xl transition-all duration-300 group-hover:scale-105"

                                />
                            </Link>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The next generation of AI-powered examination platform.
                            Revolutionizing the way we learn and assess.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.path}
                                    aria-label={social.label}
                                    className={`p-2.5 rounded-xl backdrop-blur-sm
                                              bg-white/5 text-gray-400
                                              transform hover:scale-110 hover:-translate-y-1
                                              transition-all duration-300 ease-out
                                              ${social.color}
                                              hover:shadow-lg hover:shadow-white/5`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-white text-xl font-semibold">Contact Us</h3>
                        <div className="space-y-4">
                            <a
                                href="mailto:info@digiquestai.com"
                                className="flex items-center gap-3 text-gray-400 group"
                            >
                                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-500
                                             group-hover:scale-110 transition-transform duration-300">
                                    <FaEnvelope />
                                </span>
                                <span className="group-hover:text-blue-400 transition-colors duration-300">
                                    info@digiquestai.com
                                </span>
                            </a>
                            <a
                                href="tel:+919965480680"
                                className="flex items-center gap-3 text-gray-400 group"
                            >
                                <span className="p-2 rounded-lg bg-green-500/10 text-green-500
                                             group-hover:scale-110 transition-transform duration-300">
                                    <FaPhoneAlt />
                                </span>
                                <span className="group-hover:text-green-400 transition-colors duration-300">
                                    +91 99654 80680
                                </span>
                            </a>
                            <div className="flex items-center gap-3 text-gray-400 group">
                                <Link to={'/'}>
                                    <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500
                                             group-hover:scale-110 transition-transform duration-300">
                                        <FaMapMarkerAlt />
                                    </span>
                                    <span className="group-hover:text-purple-400 transition-colors duration-300">
                                        8, Muthoorani East, Karaikudi, 630001.
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h3 className="text-white text-xl font-semibold">Stay Updated</h3>
                        <p className="text-gray-400 text-sm">
                            Subscribe to get notified when we launch and receive future updates.
                        </p>
                        <div className="space-y-3">
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-xl
                                             bg-white/5 border border-white/10
                                             focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                             focus:border-blue-500
                                             text-white placeholder-gray-500
                                             transition-all duration-300"
                                />
                            </div>
                            <button className="w-full px-4 py-3 rounded-xl
                                           bg-gradient-to-r from-blue-600 to-indigo-600
                                           hover:from-indigo-600 hover:to-blue-600
                                           text-white font-medium
                                           transform hover:scale-[1.02] active:scale-[0.98]
                                           transition-all duration-200
                                           hover:shadow-lg hover:shadow-blue-500/25">
                                Join Waitlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Sunglass Chettinad Private Limited, 8 Muthoorani East, Karaikudi.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                                Terms and Conditions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

