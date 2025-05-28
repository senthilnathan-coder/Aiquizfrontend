import React, { useState, useEffect, useId } from 'react';
import { FaRobot, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaLink, FaWikipediaW } from 'react-icons/fa';
import { MdSettings, MdCloudUpload } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';




const Aiquestions = () => {
  // Update the initial state count to 10
  const [formData, setFormData] = useState({
    topic: '',
    count: 10,  // Changed from 5 to 10
    difficulty: 'medium',
    questionType: 'mcq'  // Add questionType to initial state
  });


  // Add these new state variables
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedExcel, setSelectedExcel] = useState(null);
  const [selectedPpt, setSelectedPpt] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveNotes, setSaveNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);

  const [quizId, setQuizId] = useState(null);

  const userId = localStorage.getItem('userId');
  console.log(userId, "id");


  // Add FileUploadCard component
  const FileUploadCard = ({ type, icon: Icon, accept, selected, setSelected }) => (
    <div className="relative group">
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileUpload(e.target.files[0], type, setSelected)}
        className="hidden"
        id={`${type}-upload`}
      />
      <label
        htmlFor={`${type}-upload`}
        className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl 
          text-purple-200 cursor-pointer hover:bg-white/10 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <Icon className="text-2xl" />
          <span>{selected ? `✓ ${type} Selected` : `+ Add ${type}`}</span>
        </div>
      </label>
    </div>
  );

  const handleAnswerSelect = (questionIndex, answer) => {
    if (!showResults && timeLeft > 0) { // Only allow selection if quiz is not finished and time remains
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      toast.warning("Time's up! Submitting quiz...");
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add file validation function
  const validateFile = (file, type) => {
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      toast.error(`${type} file size should be less than 10MB`);
      return false;
    }
    return true;
  };

  // Update the audio file handler
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, 'Audio')) {
      setSelectedAudio(file);
    } else {
      e.target.value = null;
    }
  };

  // Add file upload handlers
  const handleFileUpload = (file, type, setterFunction) => {
    if (file && validateFile(file, type)) {
      setterFunction(file);
      toast.success(`${type} file selected successfully`);
    } else {
      toast.error(`Invalid ${type} file`);
    }
  };

  // Update handleGenerate to include new file types
  const { user } = useAuth();
  console.log("User ID:", user?._id); // should be like: 6655a23cc3bc6e1a0c4ddf14

  const handleGenerate = async () => {
    // Generate a unique quiz ID locally
    const newQuizId = uuidv4();
    setQuizId(newQuizId);
    // Improved validation check
    const hasContent = Boolean(
      formData.topic.trim() ||
      selectedImage ||
      selectedAudio ||
      selectedVideo ||
      selectedPdf ||
      selectedWord ||
      selectedExcel ||
      selectedPpt ||
      formData.url?.trim() ||
      formData.wikipediaTitle?.trim()
    );

    if (!hasContent) {
      toast.error('Please provide at least one type of content (text, file, or URL)');
      return;
    }

    const formDataToSend = new FormData();

    // Add text content if provided
    if (formData.topic.trim()) {
      formDataToSend.append('content', formData.topic.trim());
    }

    // Add URL if provided
    if (formData.url?.trim()) {
      formDataToSend.append('url', formData.url.trim());
    }


    // Add Wikipedia title if provided
    if (formData.wikipediaTitle?.trim()) {
      formDataToSend.append('wikipedia_title', formData.wikipediaTitle.trim());
    }

    // Add files with proper field names
    if (selectedImage) formDataToSend.append('image', selectedImage);
    if (selectedAudio) formDataToSend.append('audio', selectedAudio);
    if (selectedVideo) formDataToSend.append('video', selectedVideo);
    if (selectedPdf) formDataToSend.append('pdf', selectedPdf);
    if (selectedWord) formDataToSend.append('word', selectedWord);
    if (selectedExcel) formDataToSend.append('excel', selectedExcel);
    if (selectedPpt) formDataToSend.append('ppt', selectedPpt);

    // Add all file types with proper field names
    if (selectedImage) {
      formDataToSend.append('image_file', selectedImage);
    }
    if (selectedAudio) {
      formDataToSend.append('audio_file', selectedAudio);
    }
    if (selectedVideo) {
      formDataToSend.append('video_file', selectedVideo);
    }
    if (selectedPdf) {
      formDataToSend.append('pdf_file', selectedPdf);
    }
    if (selectedWord) {
      formDataToSend.append('word_file', selectedWord);
    }
    if (selectedExcel) {
      formDataToSend.append('excel_file', selectedExcel);
    }
    if (selectedPpt) {
      formDataToSend.append('ppt_file', selectedPpt);
    }

    // Add quiz settings
    formDataToSend.append('difficulty', formData.difficulty);
    formDataToSend.append('question_type', formData.questionType);
    formDataToSend.append('count', formData.count.toString());

    setIsGenerating(true);
    toast.info('Generating questions... This may take a few seconds.');

    try {
      const response = await fetch(`http://localhost:8000/quiz/${user._id}/`, {
        method: 'POST',
        body: formDataToSend,
      });

      console.log(response, "iuh");


      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response from server');
      }

      if (data.questions.length === 0) {
        throw new Error('No questions were generated');
      }

      setQuestions(data.questions);
      setShowQuestions(true);
      setSelectedAnswers({});
      setShowResults(false);
      setTimeLeft(60);
      setTimerActive(true);
      toast.success('Questions generated successfully!');

    } catch (error) {
      console.error('Generation error details:', error);
      toast.error(error.message || 'Failed to generate questions. Please check your server connection.');
    } finally {
      setIsGenerating(false);
    }
  };


  const handleSubmit = async () => {
    setTimerActive(false); // Stop the timer

    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    // Show score message
    if (finalScore >= 80) {
      toast.success(`Great job! Score: ${finalScore.toFixed(1)}%`);
    } else if (finalScore >= 50) {
      toast.info(`Good attempt! Score: ${finalScore.toFixed(1)}%`);
    } else {
      toast.warning(`Keep practicing! Score: ${finalScore.toFixed(1)}%`);
    }

    // Get user and token from localStorage
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth?.user;
    const token = auth?.token;

    // if (!user || !user._id) {
    //   alert('User not logged in');
    //   return;
    // }

    // if (!token) {
    //   alert('Auth token missing');
    //   return;
    // }

    try {
      setIsSaving(true);

      const quizData = {
        user_id: user._id,
        questions,
        selectedAnswers,
        score: finalScore,
        date: new Date().toISOString(),
        notes: saveNotes,
      };

      console.log('Saving quiz:', quizData);

      // const response = await fetch(`http://localhost:8000/quiz/${user._id}/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(quizData),
      // });

      const response = await axios.post(
        `http://localhost:8000/quiz/${userId}/`,
        quizData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }

      );
      console.log(response);

      const data = await response.json();
      console.log(data);


      if (!response.ok) throw new Error(data.error || 'Failed to save quiz');

      toast.success('Quiz saved!');
      setShowSaveModal(false);
      setSaveNotes('');
      setSavedQuizzes(prev => [
        ...prev,
        {
          id: data.quiz_id || Date.now(),
          score: finalScore,
          date: new Date().toISOString(),
          notes: saveNotes,
        },
      ]);
    } catch (err) {
      toast.error('Error saving quiz: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };





  // Update the form UI
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-purple-900 p-6 mt-20">
      <ToastContainer position="top-right" theme="dark" />
      <div className="max-w-3xl mx-auto">
        {!showQuestions ? (
          <div className="space-y-8">
            <div className="text-center">
              <FaRobot className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-4xl font-bold text-white mb-2">AI Quiz Generator</h1>
              <p className="text-purple-200 text-lg">Create quizzes instantly</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
              {/* Topic Input with Icon */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your quiz topic..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500"
                />
                <FaRobot className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center"
                  >
                    {selectedImage ? '✓ Image Selected' : '+ Add Image'}
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center"
                  >
                    {selectedAudio ? '✓ Audio Selected' : '+ Add Audio'}
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSelectedVideo(e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center"
                  >
                    {selectedVideo ? '✓ Video Selected' : '+ Add Video'}
                  </label>
                </div>
              </div>
              {/* Enhanced File Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Existing uploads */}
                <FileUploadCard
                  type="PDF"
                  icon={FaFilePdf}
                  accept=".pdf"
                  selected={selectedPdf}
                  setSelected={setSelectedPdf}
                />
                <FileUploadCard
                  type="Word"
                  icon={FaFileWord}
                  accept=".doc,.docx"
                  selected={selectedWord}
                  setSelected={setSelectedWord}
                />
                <FileUploadCard
                  type="Excel"
                  icon={FaFileExcel}
                  accept=".xls,.xlsx"
                  selected={selectedExcel}
                  setSelected={setSelectedExcel}
                />
                <FileUploadCard
                  type="PowerPoint"
                  icon={FaFilePowerpoint}
                  accept=".ppt,.pptx"
                  selected={selectedPpt}
                  setSelected={setSelectedPpt}
                />
              </div>

              {/* URL and Wikipedia Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Enter URL to generate questions..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl 
                      text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500"
                  />
                  <FaLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Wikipedia article title..."
                    value={formData.wikipediaTitle}
                    onChange={(e) => setFormData({ ...formData, wikipediaTitle: e.target.value })}
                    className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl 
                      text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500"
                  />
                  <FaWikipediaW className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
                </div>
              </div>

              {/* Questions Count Input */}

              <div className="flex items-center justify-between space-x-4 mb-4">
                <div className="flex items-center space-x-4">
                  <label className="text-purple-200">Questions:</label>
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        count: Math.min(10, Math.max(1, parseInt(e.target.value) || 10)),
                      })
                    }
                    className="w-20 p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white text-center outline-none"
                    min="1"
                    max="10"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-purple-200">Difficulty:</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option className='text-blue-500' value="easy">Easy</option>
                    <option className='text-blue-500' value="medium">Medium</option>
                    <option className='text-blue-500' value="hard">Hard</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-purple-200">Type:</label>
                  <select
                    value={formData.questionType}
                    onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                    className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option className='text-blue-500' value="mcq">Multiple Choice</option>
                    <option className='text-blue-500' value="true_false">True/False</option>
                  </select>
                </div>
              </div>

              {/* Source Type Indicators */}
              <div className="flex flex-wrap gap-2">
                {[
                  { condition: selectedPdf, label: 'PDF', color: 'red' },
                  { condition: selectedWord, label: 'Word', color: 'blue' },
                  { condition: selectedExcel, label: 'Excel', color: 'green' },
                  { condition: selectedPpt, label: 'PowerPoint', color: 'orange' },
                  { condition: formData.url, label: 'URL', color: 'purple' },
                  { condition: formData.wikipediaTitle, label: 'Wikipedia', color: 'cyan' }
                ].map((source, index) => (
                  source.condition && (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm bg-${source.color}-500/20 
                        text-${source.color}-300 flex items-center gap-1`}
                    >
                      <span>•</span>
                      {source.label}
                    </span>
                  )
                ))}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaRobot className="text-xl" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-white font-semibold">Quiz Questions</h2>
              <div className="flex items-center gap-4">
                <span className="text-white font-mono text-xl">
                  {formatTime(timeLeft)}
                </span>
                <button
                  onClick={() => setShowQuestions(false)}
                  className="p-2 rounded-lg bg-purple-500/20 text-purple-300"
                >
                  <MdSettings />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <p className="text-white mb-4">{`${i + 1}. ${q.question}`}</p>
                  <div className="grid gap-2">
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => handleAnswerSelect(i, opt)}
                        className={`p-2 rounded-lg text-left ${selectedAnswers[i] === opt
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-purple-200 hover:bg-white/10'
                          }`}
                      >
                        {`${String.fromCharCode(65 + j)}. ${opt}`}
                      </button>
                    ))}
                  </div>
                  {showResults && (
                    <div className="mt-2 text-sm">
                      <span
                        className={
                          selectedAnswers[i] === q.answer ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        {selectedAnswers[i] === q.answer
                          ? '✓ Correct'
                          : `✗ Incorrect (Answer: ${q.answer})`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showResults && (
              <button
                onClick={handleSubmit}
                className="mt-6 w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white"
              >
                Submit Quiz
              </button>
            )}

            {showResults && (
              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-bold">Your Score: {score.toFixed(1)}%</h3>
              </div>
            )}
          </div>
        )}
      </div>

    </div>

  );
};

export default Aiquestions;


// import React, { useState, useEffect } from 'react';
// import { FaRobot, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaLink, FaWikipediaW, FaBookmark } from 'react-icons/fa';
// import { MdSettings } from 'react-icons/md';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Make sure this import is active for Toastify styles

// import { useAuth } from '../../context/AuthContext'; // Correct import for useAuth
// import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
// import axios from 'axios'; // For making HTTP requests

// const Aiquestions = () => {
//   // Get user and token from the AuthContext
//   const { user, token } = useAuth();

//   // Form data state for quiz generation settings
//   const [formData, setFormData] = useState({
//     topic: '',
//     count: 10, // Default to 10 questions
//     difficulty: 'medium',
//     questionType: 'mcq',
//     url: '', // For URL input
//     wikipediaTitle: '' // For Wikipedia title input
//   });

//   // State for selected files (images, audio, video, documents)
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedAudio, setSelectedAudio] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [selectedWord, setSelectedWord] = useState(null);
//   const [selectedExcel, setSelectedExcel] = useState(null);
//   const [selectedPpt, setSelectedPpt] = useState(null);

//   // Quiz display and interaction states
//   const [questions, setQuestions] = useState([]);
//   const [showQuestions, setShowQuestions] = useState(false); // Controls showing quiz vs. settings
//   const [isGenerating, setIsGenerating] = useState(false); // Loading state for quiz generation
//   const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores user's selected answers
//   const [showResults, setShowResults] = useState(false); // Controls showing quiz results
//   const [score, setScore] = useState(0); // User's quiz score

//   // Timer states
//   const [timeLeft, setTimeLeft] = useState(60); // 60 seconds (1 minute) for the quiz
//   const [timerActive, setTimerActive] = useState(false); // Controls timer start/stop

//   // Save quiz modal states
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [saveNotes, setSaveNotes] = useState('');
//   const [isSaving, setIsSaving] = useState(false); // Loading state for saving quiz

//   // Unique ID for the current quiz session (generated on quiz generation)
//   const [quizId, setQuizId] = useState(null);

//   // Log user ID from useAuth for debugging (can be removed in production)
//   console.log("User ID from useAuth:", user?._id);

//   // Helper component for file upload cards
//   const FileUploadCard = ({ type, icon: Icon, accept, selected, setSelected }) => (
//     <div className="relative group">
//       <input
//         type="file"
//         accept={accept}
//         onChange={(e) => handleFileUpload(e.target.files[0], type, setSelected)}
//         className="hidden"
//         id={`${type}-upload`}
//       />
//       <label
//         htmlFor={`${type}-upload`}
//         className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl
//           text-purple-200 cursor-pointer hover:bg-white/10 transition-all"
//       >
//         <div className="flex flex-col items-center gap-2">
//           <Icon className="text-2xl" />
//           <span>{selected ? `✓ ${type} Selected` : `+ Add ${type}`}</span>
//         </div>
//       </label>
//     </div>
//   );

//   // Handles user selecting an answer during the quiz
//   const handleAnswerSelect = (questionIndex, answer) => {
//     // Only allow selection if quiz is not finished and timer is active and time remains
//     if (!showResults && timerActive && timeLeft > 0) {
//       setSelectedAnswers(prev => ({
//         ...prev,
//         [questionIndex]: answer
//       }));
//     }
//   };

//   // Effect hook for the quiz timer
//   useEffect(() => {
//     let timer;
//     if (timerActive && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft(prev => prev - 1);
//       }, 1000);
//     } else if (timerActive && timeLeft === 0) {
//       // If time runs out, stop the timer and submit the quiz
//       setTimerActive(false);
//       toast.warning("Time's up! Submitting quiz...");
//       handleSubmit();
//     }
//     // Cleanup function to clear the interval when component unmounts or dependencies change
//     return () => clearInterval(timer);
//   }, [timerActive, timeLeft, questions]); // Added 'questions' to dependencies to avoid stale closure for handleSubmit

//   // Formats seconds into MM:SS string
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   // Validates file size (max 10MB)
//   const validateFile = (file, type) => {
//     const maxSize = 10 * 1024 * 1024; // 10MB limit
//     if (file.size > maxSize) {
//       toast.error(`${type} file size should be less than 10MB`);
//       return false;
//     }
//     return true;
//   };

//   // Generic file upload handler
//   const handleFileUpload = (file, type, setterFunction) => {
//     if (!file) {
//         setterFunction(null); // Clear selected file if nothing is chosen (e.g., user cancels file dialog)
//         return;
//     }
//     if (validateFile(file, type)) {
//       setterFunction(file);
//       toast.success(`${type} file selected successfully`);
//     } else {
//       setterFunction(null); // Clear selected file if validation fails
//       // The validateFile function already shows an error toast.
//     }
//   };

//   // Handles the generation of quiz questions
//   const handleGenerate = async () => {
//     // Generate a unique quiz ID for this session
//     const newQuizId = uuidv4();
//     setQuizId(newQuizId);

//     // Ensure user is logged in before generating quiz
//     if (!user || !user._id || !token) {
//         toast.error('Please log in to generate quizzes.');
//         return;
//     }

//     // Check if any content source is provided
//     const hasContent = Boolean(
//       formData.topic.trim() ||
//       selectedImage ||
//       selectedAudio ||
//       selectedVideo ||
//       selectedPdf ||
//       selectedWord ||
//       selectedExcel ||
//       selectedPpt ||
//       formData.url?.trim() ||
//       formData.wikipediaTitle?.trim()
//     );

//     if (!hasContent) {
//       toast.error('Please provide at least one type of content (text, file, or URL) to generate questions.');
//       return;
//     }

//     // Create FormData object to send files and other data
//     const formDataToSend = new FormData();

//     // Append text content if provided
//     if (formData.topic.trim()) {
//       formDataToSend.append('content', formData.topic.trim());
//     }

//     // Append URL if provided
//     if (formData.url?.trim()) {
//       formDataToSend.append('url', formData.url.trim());
//     }

//     // Append Wikipedia title if provided
//     if (formData.wikipediaTitle?.trim()) {
//       formDataToSend.append('wikipedia_title', formData.wikipediaTitle.trim());
//     }

//     // Append selected files with appropriate field names (match your backend's expectations)
//     if (selectedImage) formDataToSend.append('image_file', selectedImage);
//     if (selectedAudio) formDataToSend.append('audio_file', selectedAudio);
//     if (selectedVideo) formDataToSend.append('video_file', selectedVideo);
//     if (selectedPdf) formDataToSend.append('pdf_file', selectedPdf);
//     if (selectedWord) formDataToSend.append('word_file', selectedWord);
//     if (selectedExcel) formDataToSend.append('excel_file', selectedExcel);
//     if (selectedPpt) formDataToSend.append('ppt_file', selectedPpt);

//     // Append quiz settings
//     formDataToSend.append('difficulty', formData.difficulty);
//     formDataToSend.append('question_type', formData.questionType);
//     formDataToSend.append('count', formData.count.toString());

//     setIsGenerating(true); // Set loading state
//     toast.info('Generating questions... This may take a few seconds.');

//     try {
//       // Make the API call using axios
//       const response = await axios.post(`http://localhost:8000/quiz/${user._id}/`, formDataToSend, {
//         headers: {
//           // Important: 'Content-Type' for FormData is typically 'multipart/form-data'
//           // Axios handles this automatically when you pass a FormData object,
//           // but explicitly setting it doesn't hurt.
//           // The crucial part is adding the Authorization header.
//           Authorization: `Bearer ${token}`, // Include the authorization token
//         },
//       });

//       const data = response.data; // Axios automatically parses JSON response into response.data

//       // Validate the response structure
//       if (!data || !Array.isArray(data.questions)) {
//         throw new Error('Invalid response from server: Missing questions array or malformed data.');
//       }

//       if (data.questions.length === 0) {
//         throw new Error('No questions were generated. Please try different content or settings.');
//       }

//       // Update state with generated questions and start the quiz
//       setQuestions(data.questions);
//       setShowQuestions(true); // Show the quiz questions
//       setSelectedAnswers({}); // Reset selected answers for a new quiz
//       setShowResults(false); // Hide results view
//       setTimeLeft(60); // Reset timer to 60 seconds
//       setTimerActive(true); // Activate the timer
//       toast.success('Questions generated successfully!');

//     } catch (error) {
//       console.error('Generation error details:', error.response?.data || error.message);
//       let errorMessage = 'Failed to generate questions. ';
//       if (error.response && error.response.data) {
//         // Attempt to get a more specific error message from the backend
//         errorMessage += error.response.data.error || JSON.stringify(error.response.data);
//       } else if (error.message) {
//         errorMessage += error.message;
//       }
//       toast.error(errorMessage);
//     } finally {
//       setIsGenerating(false); // Reset loading state
//     }
//   };

//   // Handles submitting the quiz answers and saving results
//   const handleSubmit = async () => {
//     setTimerActive(false); // Stop the timer immediately upon submission

//     // Calculate score
//     let correctCount = 0;
//     questions.forEach((question, index) => {
//       if (selectedAnswers[index] === question.answer) {
//         correctCount++;
//       }
//     });

//     // Calculate final score, handle division by zero if no questions
//     const finalScore = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
//     setScore(finalScore);
//     setShowResults(true); // Show quiz results

//     // Display score feedback
//     if (finalScore >= 80) {
//       toast.success(`Great job! Score: ${finalScore.toFixed(1)}%`);
//     } else if (finalScore >= 50) {
//       toast.info(`Good attempt! Score: ${finalScore.toFixed(1)}%`);
//     } else {
//       toast.warning(`Keep practicing! Score: ${finalScore.toFixed(1)}%`);
//     }

//     // --- Start Save Quiz Logic ---
//     // Ensure user is logged in before attempting to save
//     if (!user || !user._id) {
//       toast.error('User not logged in. Cannot save quiz results.');
//       setIsSaving(false); // Ensure saving state is off
//       return;
//     }
//     if (!token) {
//       toast.error('Authentication token missing. Cannot save quiz results.');
//       setIsSaving(false); // Ensure saving state is off
//       return;
//     }

//     try {
//       setIsSaving(true); // Set saving loading state

//       const quizData = {
//         user_id: user._id, // Use user._id from useAuth
//         questions: questions, // Send the questions array
//         selected_answers: selectedAnswers, // Send the user's selected answers
//         score: finalScore,
//         date: new Date().toISOString(), // Current date/time
//         notes: saveNotes, // Notes from the save modal
//         quiz_reference_id: quizId // Reference to the generated quiz session
//       };

//       console.log('Attempting to save quiz data to backend:', quizData);

//       // Make the API call to save quiz results
//       const response = await axios.post(
//         `http://localhost:8000/quiz/${user._id}/`, // Ensure this URL matches your backend endpoint for saving quiz attempts
//         quizData,
//         {
//           headers: {
//             "Content-Type": "application/json", // Sending JSON data
//             Authorization: `Bearer ${token}`, // CRUCIAL: Include the authorization token
//           }
//         }
//       );

//       // Axios response data is directly in response.data
//       const data = response.data;
//       console.log('Quiz save response from backend:', data);

//       // Check for successful save based on HTTP status code (axios throws for non-2xx)
//       if (response.status === 200 || response.status === 201) {
//         toast.success(data.message || 'Quiz results saved successfully!');
//         setShowSaveModal(false); // Close the save modal
//         setSaveNotes(''); // Clear notes
//         // Add the newly saved quiz to the local list of saved quizzes
//         setSavedQuizzes(prev => [
//           ...prev,
//           {
//             id: data.quiz_id || uuidv4(), // Use quiz_id from backend response if provided, else generate
//             score: finalScore,
//             date: new Date().toISOString(),
//             notes: saveNotes,
//           },
//         ]);
//       } else {
//         // This block should ideally not be reached if axios throws on non-2xx
//         throw new Error(data.error || 'Failed to save quiz results');
//       }
//     } catch (err) {
//       console.error('Error saving quiz:', err.response?.data || err.message);
//       let errorMessage = 'Error saving quiz.';
//       if (err.response && err.response.data) {
//         // Attempt to get a more specific error message from the backend
//         errorMessage += ': ' + (err.response.data.error || JSON.stringify(err.response.data));
//       } else if (err.message) {
//         errorMessage += ': ' + err.message;
//       }
//       toast.error(errorMessage);
//     } finally {
//       setIsSaving(false); // Reset saving loading state
//     }
//   };

//   // Main component render
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-slate-900 to-purple-900 p-6 mt-20">
//       <ToastContainer position="top-right" theme="dark" />
//       <div className="max-w-3xl mx-auto">
//         {!showQuestions ? (
//           // Quiz Generation Settings Section
//           <div className="space-y-8">
//             <div className="text-center">
//               <FaRobot className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
//               <h1 className="text-4xl font-bold text-white mb-2">AI Quiz Generator</h1>
//               <p className="text-purple-200 text-lg">Create quizzes instantly from various sources</p>
//             </div>

//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
//               {/* Topic Input */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Enter your quiz topic..."
//                   value={formData.topic}
//                   onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
//                   className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500"
//                 />
//                 <FaRobot className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
//               </div>

//               {/* Media File Upload Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FileUploadCard
//                   type="Image"
//                   icon={FaLink} // Using FaLink as a generic icon for now, consider FaImage if available
//                   accept="image/*"
//                   selected={selectedImage}
//                   setSelected={setSelectedImage}
//                 />
//                 <FileUploadCard
//                   type="Audio"
//                   icon={FaLink} // Using FaLink as a generic icon for now, consider FaMusic if available
//                   accept="audio/*"
//                   selected={selectedAudio}
//                   setSelected={setSelectedAudio}
//                 />
//                 <FileUploadCard
//                   type="Video"
//                   icon={FaLink} // Using FaLink as a generic icon for now, consider FaVideo if available
//                   accept="video/*"
//                   selected={selectedVideo}
//                   setSelected={setSelectedVideo}
//                 />
//               </div>

//               {/* Document File Upload Section */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <FileUploadCard
//                   type="PDF"
//                   icon={FaFilePdf}
//                   accept=".pdf"
//                   selected={selectedPdf}
//                   setSelected={setSelectedPdf}
//                 />
//                 <FileUploadCard
//                   type="Word"
//                   icon={FaFileWord}
//                   accept=".doc,.docx"
//                   selected={selectedWord}
//                   setSelected={setSelectedWord}
//                 />
//                 <FileUploadCard
//                   type="Excel"
//                   icon={FaFileExcel}
//                   accept=".xls,.xlsx"
//                   selected={selectedExcel}
//                   setSelected={setSelectedExcel}
//                 />
//                 <FileUploadCard
//                   type="PowerPoint"
//                   icon={FaFilePowerpoint}
//                   accept=".ppt,.pptx"
//                   selected={selectedPpt}
//                   setSelected={setSelectedPpt}
//                 />
//               </div>

//               {/* URL and Wikipedia Inputs */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative">
//                   <input
//                     type="url"
//                     placeholder="Enter URL to generate questions..."
//                     value={formData.url}
//                     onChange={(e) => setFormData({ ...formData, url: e.target.value })}
//                     className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl
//                       text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500"
//                   />
//                   <FaLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
//                 </div>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Enter Wikipedia article title..."
//                     value={formData.wikipediaTitle}
//                     onChange={(e) => setFormData({ ...formData, wikipediaTitle: e.target.value })}
//                     className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl
//                       text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500"
//                   />
//                   <FaWikipediaW className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
//                 </div>
//               </div>

//               {/* Quiz Settings (Count, Difficulty, Type) */}
//               <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
//                 <div className="flex items-center space-x-4 w-full md:w-auto">
//                   <label className="text-purple-200">Questions:</label>
//                   <input
//                     type="number"
//                     value={formData.count}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         count: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)), // Ensure count is between 1 and 10
//                       })
//                     }
//                     className="w-20 p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white text-center outline-none"
//                     min="1"
//                     max="10"
//                   />
//                 </div>

//                 <div className="flex items-center space-x-4 w-full md:w-auto">
//                   <label className="text-purple-200">Difficulty:</label>
//                   <select
//                     value={formData.difficulty}
//                     onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
//                     className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer w-full"
//                   >
//                     <option className='text-blue-500' value="easy">Easy</option>
//                     <option className='text-blue-500' value="medium">Medium</option>
//                     <option className='text-blue-500' value="hard">Hard</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center space-x-4 w-full md:w-auto">
//                   <label className="text-purple-200">Type:</label>
//                   <select
//                     value={formData.questionType}
//                     onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
//                     className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer w-full"
//                   >
//                     <option className='text-blue-500' value="mcq">Multiple Choice</option>
//                     <option className='text-blue-500' value="true_false">True/False</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Source Type Indicators */}
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   { condition: selectedPdf, label: 'PDF', color: 'red' },
//                   { condition: selectedWord, label: 'Word', color: 'blue' },
//                   { condition: selectedExcel, label: 'Excel', color: 'green' },
//                   { condition: selectedPpt, label: 'PowerPoint', color: 'orange' },
//                   { condition: formData.url, label: 'URL', color: 'purple' },
//                   { condition: formData.wikipediaTitle, label: 'Wikipedia', color: 'cyan' }
//                 ].map((source, index) => (
//                   source.condition && (
//                     <span
//                       key={index}
//                       className={`px-3 py-1 rounded-full text-sm bg-${source.color}-500/20
//                          text-${source.color}-300 flex items-center gap-1`}
//                     >
//                       <span>•</span>
//                       {source.label}
//                     </span>
//                   )
//                 ))}
//               </div>

//               {/* Generate Button */}
//               <button
//                 onClick={handleGenerate}
//                 disabled={isGenerating}
//                 className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isGenerating ? (
//                   <>
//                     <FaSpinner className="animate-spin" />
//                     <span>Generating...</span>
//                   </>
//                 ) : (
//                   <>
//                     <FaRobot className="text-xl" />
//                     <span>Generate Quiz</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         ) : (
//           // Quiz Questions Display Section
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl text-white font-semibold">Quiz Questions</h2>
//               <div className="flex items-center gap-4">
//                 <span className="text-white font-mono text-xl">
//                   {formatTime(timeLeft)}
//                 </span>
//                 <button
//                   onClick={() => {
//                     setShowQuestions(false); // Go back to settings
//                     setTimerActive(false); // Stop the timer
//                     setShowResults(false); // Hide results if navigating back
//                     setQuestions([]); // Clear questions
//                     setSelectedAnswers({}); // Clear answers
//                   }}
//                   className="p-2 rounded-lg bg-purple-500/20 text-purple-300"
//                   title="Go back to settings"
//                 >
//                   <MdSettings />
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {questions.map((q, i) => (
//                 <div key={i} className="bg-white/5 rounded-xl p-4">
//                   <p className="text-white mb-4">{`${i + 1}. ${q.question}`}</p>
//                   <div className="grid gap-2">
//                     {q.options.map((opt, j) => (
//                       <button
//                         key={j}
//                         onClick={() => handleAnswerSelect(i, opt)}
//                         // Apply styling based on selection and results
//                         className={`p-2 rounded-lg text-left transition-colors duration-200
//                           ${selectedAnswers[i] === opt
//                             ? 'bg-purple-500 text-white'
//                             : 'bg-white/5 text-purple-200 hover:bg-white/10'
//                           }
//                           ${showResults // Conditional styling for results
//                             ? (selectedAnswers[i] === q.answer // If selected answer is correct
//                                 ? 'border-2 border-green-500'
//                                 : (opt === q.answer // If this option is the correct answer (and user selected wrong)
//                                   ? 'border-2 border-green-500'
//                                   : (selectedAnswers[i] === opt ? 'border-2 border-red-500' : '') // If this option was selected but wrong
//                                 )
//                               )
//                             : ''
//                           }
//                         `}
//                         // Disable buttons if results are shown, timer is inactive, or time is up
//                         disabled={showResults || !timerActive || timeLeft <= 0}
//                       >
//                         {`${String.fromCharCode(65 + j)}. ${opt}`}
//                       </button>
//                     ))}
//                   </div>
//                   {showResults && (
//                     <div className="mt-2 text-sm">
//                       <span
//                         className={
//                           selectedAnswers[i] === q.answer ? 'text-green-400' : 'text-red-400'
//                         }
//                       >
//                         {selectedAnswers[i] === q.answer
//                           ? '✓ Correct'
//                           : `✗ Incorrect (Answer: ${q.answer})`}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Submit Quiz Button (only shown if results are not yet visible) */}
//             {!showResults && (
//               <button
//                 onClick={handleSubmit}
//                 className="mt-6 w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all"
//               >
//                 Submit Quiz
//               </button>
//             )}

//             {/* Quiz Results Display */}
//             {showResults && (
//               <div className="mt-6 text-center text-white">
//                 <h3 className="text-2xl font-bold">Your Score: {score.toFixed(1)}%</h3>
//                 {/* Save Quiz button */}
//                 <button
//                   onClick={() => setShowSaveModal(true)}
//                   className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center mx-auto"
//                 >
//                   <FaBookmark className="mr-2" /> Save Quiz
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Save Quiz Modal */}
//       {showSaveModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Save Quiz Results</h3>
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="Add notes for this quiz (e.g., 'React Hooks Quiz - Attempt 1')"
//               rows="3"
//               value={saveNotes}
//               onChange={(e) => setSaveNotes(e.target.value)}
//             ></textarea>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={() => {
//                   setShowSaveModal(false);
//                   setSaveNotes(''); // Clear notes if cancelled
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit} // Re-use handleSubmit to save results
//                 disabled={isSaving}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? 'Saving...' : 'Confirm Save'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Aiquestions;
