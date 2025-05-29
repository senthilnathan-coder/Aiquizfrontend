import React, { useState, useEffect, useCallback } from 'react';
import { FaRobot, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaLink, FaWikipediaW, FaImage, FaHeadphones, FaVideo } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct
import axios from 'axios';

const Aiquestions = () => {
  const [formData, setFormData] = useState({
    topic: '',
    count: 10, // Corresponds to 'number_questions' in backend
    difficulty: 'medium',
    questionType: 'mcq',
    timeLimit: 60, // Frontend-only for timer (in seconds)
    url: '',
    wikipediaTitle: '',
  });

  // State for selected files
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedExcel, setSelectedExcel] = useState(null);
  const [selectedPpt, setSelectedPpt] = useState(null);

  const [isSaving, setIsSaving] = useState(false); // To prevent multiple submissions
  const [questions, setQuestions] = useState([]);
  const [mainTopic, setMainTopic] = useState(''); // To store the main topic from the backend
  const [showQuestions, setShowQuestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores answers by question index: {0: "Option A", 1: "Option B"}
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0); // Raw score (number of correct answers)
  const [timeLeft, setTimeLeft] = useState(formData.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  // New states for saving functionality and notes modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveNotes, setSaveNotes] = useState('');
  const [savedQuizzes, setSavedQuizzes] = useState([]); // Placeholder for displaying saved quizzes
  const [currentQuizAttemptId, setCurrentQuizAttemptId] = useState(null); // To store the ID of the current quiz attempt for notes saving

  // Auth context for user ID and token
  const { user, token } = useAuth();
  const userId = user?._id;

  const handleSubmit = useCallback(async () => {
  setTimerActive(false); // Stop the timer immediately upon submission

  if (questions.length === 0) {
    toast.info("No questions to submit or save.");
    setShowResults(true); // Still show results section, but with 0 score
    setScore(0);
    return;
  }

  let correctCount = 0;
  questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.answer) {
      correctCount++;
    }
  });

  const finalScorePercentage = (correctCount / questions.length) * 100;
  setScore(finalScorePercentage); // Update the score state with percentage
  setShowResults(true); // Display results to the user

  if (finalScorePercentage >= 80) {
    toast.success(`Great job! Score: ${finalScorePercentage.toFixed(1)}%`);
  } else if (finalScorePercentage >= 50) {
    toast.info(`Good attempt! Score: ${finalScorePercentage.toFixed(1)}%`);
  } else {
    toast.warning(`Keep practicing! Score: ${finalScorePercentage.toFixed(1)}%`);
  }

  if (!userId) {
    toast.error('User not logged in. Quiz results will not be saved.');
    return;
  }

  if (isSaving) {
    return;
  }

  try {
    setIsSaving(true); // Set saving status to true

    const userAnswersDetailed = questions.map((q, index) => ({
      question_id: q._id || `client_gen_${index}`, // Fallback if _id is not present
      selected_answer: selectedAnswers[index] || null,
    }));

    const usedContentTypes = [];
    if (formData.topic.trim()) usedContentTypes.push('text');
    if (selectedImage) usedContentTypes.push('image');
    if (selectedAudio) usedContentTypes.push('audio');
    if (selectedVideo) usedContentTypes.push('video');
    if (selectedPdf) usedContentTypes.push('pdf');
    if (selectedWord) usedContentTypes.push('word');
    if (selectedExcel) usedContentTypes.push('excel');
    if (selectedPpt) usedContentTypes.push('ppt');
    if (formData.url?.trim()) usedContentTypes.push('url');
    if (formData.wikipediaTitle?.trim()) usedContentTypes.push('wikipedia');

    // Determine the primary content/topic for the initial submission.
    // This is often the topic the quiz was *generated* from.
    // Your backend might use a field like 'content' or 'topic' for this.
    let quizContentTopic = mainTopic || formData.topic.trim();
    if (!quizContentTopic && formData.url?.trim()) quizContentTopic = formData.url.trim();
    if (!quizContentTopic && formData.wikipediaTitle?.trim()) quizContentTopic = formData.wikipediaTitle.trim();
    if (!quizContentTopic) quizContentTopic = "AI Generated Quiz"; // Fallback if no specific content type provides a clear topic

    const quizAttemptData = {
      user: userId,
      questions: questions, // Sending the full questions array as returned by the backend
      user_answers: userAnswersDetailed, // Detailed array of user's selected answers
      score: finalScorePercentage, // Percentage score
      total: questions.length, // Total number of questions
      difficulty: formData.difficulty,
      question_type: formData.questionType,
      topics: mainTopic ? [mainTopic] : [], // Ensure this is an array of strings
      content_types: usedContentTypes, // Array of content types used for generation
      time_taken: formData.timeLimit - timeLeft, // Calculate actual time taken
      submitted: true, // Crucial for backend to know this is a submission attempt
      content: quizContentTopic, // Include 'content' here if your backend expects it for the overall quiz topic.
                                 // Based on your initial log, it was present, so keep it.
      // --------------------------------------------------------------------------
      // REMOVE THE 'NOTES' FIELD FROM HERE. It should only be added via handleSaveQuiz.
      // notes: "good experences", // <--- THIS LINE MUST BE REMOVED
      // --------------------------------------------------------------------------
    };

    console.log("Sending quiz attempt data for submission:", quizAttemptData);

    const response = await axios.post(
      `http://localhost:8000/quiz/${userId}/`,
      quizAttemptData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure JSON content type for submission
        }
      }
    );

    console.log('Quiz results saved:', response.data);
    toast.success('Quiz results saved successfully!');
    // Store the quiz attempt ID received from the backend if available
    // THIS IS CRUCIAL FOR handleSaveQuiz TO WORK LATER
    if (response.data.quiz_id) {
      setCurrentQuizAttemptId(response.data.quiz_id);
    } else {
      console.warn("Backend did not return a quiz_id for the submitted attempt.");
      // You might need a fallback if quiz_id isn't always returned immediately
      // For example, if the backend uses the user ID and timestamp to identify.
      // However, a unique quiz_id is highly recommended.
    }

  } catch (err) {
    const errorMsg =
      err.response?.data?.error || err.message || 'Failed to save quiz results.';
    toast.error('Error saving quiz: ' + errorMsg);
    console.error("Save error during submission:", err.response?.data || err);
    // Log the full response data for more specific backend errors
    // console.error("Full error response data:", err.response?.data);
    // console.error("Error status:", err.response?.status);
  } finally {
    setIsSaving(false);
  }
}, [userId, questions, selectedAnswers, formData.difficulty, formData.questionType, mainTopic, formData.timeLimit, timeLeft, isSaving, token, selectedImage, selectedAudio, selectedVideo, selectedPdf, selectedWord, selectedExcel, selectedPpt, formData.topic, formData.url, formData.wikipediaTitle]); // Dependencies for useCallback
  // --- NEW handleSaveQuiz Function (for saving notes/specific quiz instance) ---
  const handleSaveQuiz = async (notes) => { // Assuming 'notes' is passed here
    if (!user || !token || !currentQuizAttemptId) { // Check for currentQuizAttemptId
      toast.error("Quiz attempt not found. Please submit the quiz first or generate a new one.");
      console.error("Missing user, token, or quiz attempt ID for saving notes.");
      return;
    }

    // Determine the primary content for saving.
    // Prioritize the mainTopic identified by the backend, then the initial topic input, then URL, then Wikipedia, etc.
    let primaryContent = mainTopic || formData.topic.trim();
    if (!primaryContent && formData.url?.trim()) primaryContent = formData.url.trim();
    if (!primaryContent && formData.wikipediaTitle?.trim()) primaryContent = formData.wikipediaTitle.trim();
    // Fallback if no specific content is identified (e.g., if generated from a file without a clear topic)
    if (!primaryContent) primaryContent = "AI Generated Quiz";

    // Collect content types that were used for generation
    const usedContentTypes = [];
    if (formData.topic.trim()) usedContentTypes.push('text');
    if (selectedImage) usedContentTypes.push('image');
    if (selectedAudio) usedContentTypes.push('audio');
    if (selectedVideo) usedContentTypes.push('video');
    if (selectedPdf) usedContentTypes.push('pdf');
    if (selectedWord) usedContentTypes.push('word');
    if (selectedExcel) usedContentTypes.push('excel');
    if (selectedPpt) usedContentTypes.push('ppt');
    if (formData.url?.trim()) usedContentTypes.push('url');
    if (formData.wikipediaTitle?.trim()) usedContentTypes.push('wikipedia');

    const quizSavePayload = {
      user: userId,
      // The 'content' field that the backend is looking for, now guaranteed to be present
      content: primaryContent,
      // Include quiz details and results for saving this specific attempt
      score: score, // The final calculated score percentage
      questions: questions, // The generated questions
      user_answers: questions.map((q, index) => ({ // Include user's answers for review
        question_id: q._id || `client_gen_${index}`,
        selected_answer: selectedAnswers[index] || null,
      })),
      difficulty: formData.difficulty,
      question_type: formData.questionType,
      topics: mainTopic ? [mainTopic] : [],
      content_types: usedContentTypes,
      time_taken: formData.timeLimit - timeLeft,
      notes: notes, // User's custom notes, using the 'notes' parameter
      submitted: true, // Indicate it's a submitted attempt
    };

    console.log("Saving quiz with notes - Payload:", quizSavePayload);
    console.log("Saving quiz with notes - Endpoint:", `http://localhost:8000/quiz/attempts/${currentQuizAttemptId}/`); // Adjusted endpoint for updating an attempt

    try {
      // Assuming your backend has a separate endpoint for updating an existing quiz attempt with notes
      // This usually involves a PATCH or PUT request to a specific attempt ID.
      const response = await axios.patch( // Use PATCH for partial updates
        `http://localhost:8000/quiz/attempts/${currentQuizAttemptId}/`, // Example: Update specific attempt
        quizSavePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Quiz notes saved successfully:", response.data);
      toast.success("Quiz notes saved successfully!");
      setShowSaveModal(false);
      setSaveNotes("");

      // Add to saved quizzes list (if you have one)
      setSavedQuizzes((prev) => [
        ...prev,
        {
          id: response.data.quiz_id || Date.now(), // Backend should return a quiz_id
          score: score,
          date: new Date().toISOString(),
          notes: notes, // Use the passed 'notes'
          topic: primaryContent, // Store the topic for display
        },
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to save quiz notes";
      toast.error("Save error: " + errorMsg);
      console.error("Save error during notes saving:", err.response?.data || err);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Timer Effect ---
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && showQuestions && !showResults) {
      toast.warning("Time's up! Submitting quiz automatically...");
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, showQuestions, showResults, handleSubmit]);

  // --- Utility Functions ---
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateFile = (file, type) => {
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (!file) return false;
    if (file.size > maxSize) {
      toast.error(`${type} file size should be less than 10MB`);
      return false;
    }
    return true;
  };

  const handleFileUpload = (file, type, setterFunction) => {
    if (file) {
      if (validateFile(file, type)) {
        setterFunction(file);
        toast.success(`${type} file selected successfully`);
      } else {
        setterFunction(null);
      }
    } else {
      setterFunction(null);
    }
  };

  // --- FileUploadCard Component (Purely for rendering UI) ---
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
        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-purple-500/30 rounded-xl
          text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center h-24"
      >
        <Icon className="text-2xl mb-1" />
        <span>{selected ? `✓ ${type} Selected` : `+ Add ${type}`}</span>
      </label>
    </div>
  );

  // --- Answer Selection ---
  const handleAnswerSelect = (questionIndex, answer) => {
    if (!showResults && timerActive) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  // --- Quiz Generation ---
  const handleGenerate = async () => {
    if (!userId) {
      toast.error('Please log in to generate quizzes.');
      return;
    }

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

    // Append text content
    if (formData.topic.trim()) {
      formDataToSend.append('content', formData.topic.trim());
    }
    if (formData.url?.trim()) {
      formDataToSend.append('url', formData.url.trim());
    }
    if (formData.wikipediaTitle?.trim()) {
      formDataToSend.append('wikipedia_title', formData.wikipediaTitle.trim());
    }

    // Append files - IMPORTANT: Use backend's expected key names (no '_file' suffix)
    if (selectedImage) formDataToSend.append('image', selectedImage);
    if (selectedAudio) formDataToSend.append('audio', selectedAudio);
    if (selectedVideo) formDataToSend.append('video', selectedVideo);
    if (selectedPdf) formDataToSend.append('pdf', selectedPdf);
    if (selectedWord) formDataToSend.append('word', selectedWord);
    if (selectedExcel) formDataToSend.append('excel', selectedExcel);
    if (selectedPpt) formDataToSend.append('ppt', selectedPpt);

    // Append quiz settings
    formDataToSend.append('difficulty', formData.difficulty);
    formDataToSend.append('question_type', formData.questionType);
    formDataToSend.append('number_questions', formData.count.toString()); // Corrected to 'number_questions'

    setIsGenerating(true);
    toast.info('Generating questions... This may take a few seconds.');

    try {
      // Assuming your generation endpoint is `http://localhost:8000/quiz/<userId>/`
      const response = await axios.post(`http://localhost:8000/quiz/${userId}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Essential for FormData for generation
          Authorization: `Bearer ${token}`, // Include token for generation
        },
      });

      const data = response.data;

      // Validate the structure of the response
      if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.message || 'No questions were generated. Please try different content or settings.');
      }

      setQuestions(data.questions);
      setMainTopic(data.topics || 'General Quiz'); // Capture the main topic from backend
      setShowQuestions(true);
      setSelectedAnswers({}); // Clear answers for new quiz
      setShowResults(false); // Hide results for new quiz
      setTimeLeft(formData.timeLimit); // Reset timer for new quiz
      setTimerActive(true); // Start timer
      toast.success('Questions generated successfully! Good luck!');

      // Clear file inputs and related form data after successful generation
      setSelectedImage(null);
      setSelectedAudio(null);
      setSelectedVideo(null);
      setSelectedPdf(null);
      setSelectedWord(null);
      setSelectedExcel(null);
      setSelectedPpt(null);
      // Decide if you want to clear topic, url, wikipediaTitle or keep them
      setFormData(prev => ({
        ...prev,
        topic: '', // Clear topic
        url: '',    // Clear URL
        wikipediaTitle: '', // Clear Wikipedia title
      }));

    } catch (error) {
      console.error('Generation error details:', error.response?.data || error.message || error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate questions. Please check your server connection and input.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Component Render ---
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-purple-900 p-6 mt-20 font-sans">
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      <div className="max-w-3xl mx-auto">
        {!showQuestions ? (
          // Quiz Generation Form
          <div className="space-y-8">
            <div className="text-center">
              <FaRobot className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-4xl font-bold text-white mb-2">AI Quiz Generator</h1>
              <p className="text-purple-200 text-lg">Create quizzes instantly from various content types!</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Topic Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your quiz topic (e.g., 'React Hooks', 'World History')..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full p-4 pl-12 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
                <FaRobot className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
              </div>

              <div className="text-purple-300 text-center text-sm font-semibold uppercase tracking-wider">
                — OR UPLOAD FILES / PASTE LINKS —
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FileUploadCard
                  type="Image"
                  icon={FaImage}
                  accept="image/*"
                  selected={selectedImage}
                  setSelected={setSelectedImage}
                />
                <FileUploadCard
                  type="Audio"
                  icon={FaHeadphones}
                  accept="audio/*"
                  selected={selectedAudio}
                  setSelected={setSelectedAudio}
                />
                <FileUploadCard
                  type="Video"
                  icon={FaVideo}
                  accept="video/*"
                  selected={selectedVideo}
                  setSelected={setSelectedVideo}
                />
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
                <div className="relative"> {/* Placeholder to keep grid consistent */}</div>
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
                      text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
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
                      text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                  />
                  <FaWikipediaW className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg" />
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="question-count" className="text-purple-200 font-medium">Questions:</label>
                  <input
                    id="question-count"
                    type="number"
                    value={formData.count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        count: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
                      })
                    }
                    className="w-20 p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white text-center outline-none focus:border-purple-500 transition-all duration-300"
                    min="1"
                    max="10"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="difficulty-select" className="text-purple-200 font-medium">Difficulty:</label>
                  <select
                    id="difficulty-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer appearance-none pr-8 bg-right bg-no-repeat bg-origin-content bg-arrow-down"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.2em', backgroundPosition: 'calc(100% - 0.5em) center' }}
                  >
                    <option className='text-gray-800 bg-white' value="easy">Easy</option>
                    <option className='text-gray-800 bg-white' value="medium">Medium</option>
                    <option className='text-gray-800 bg-white' value="hard">Hard</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="question-type-select" className="text-purple-200 font-medium">Type:</label>
                  <select
                    id="question-type-select"
                    value={formData.questionType}
                    onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                    className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer appearance-none pr-8 bg-right bg-no-repeat bg-origin-content bg-arrow-down"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.2em', backgroundPosition: 'calc(100% - 0.5em) center' }}
                  >
                    <option className='text-gray-800 bg-white' value="mcq">Multiple Choice</option>
                    <option className='text-gray-800 bg-white' value="true_false">True/False</option>
                  </select>
                </div>
              </div>

              {/* Active Source Type Indicators */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { condition: formData.topic.trim(), label: 'Text Input', color: 'gray' },
                  { condition: selectedImage, label: 'Image File', color: 'orange' },
                  { condition: selectedAudio, label: 'Audio File', color: 'yellow' },
                  { condition: selectedVideo, label: 'Video File', color: 'teal' },
                  { condition: selectedPdf, label: 'PDF File', color: 'red' },
                  { condition: selectedWord, label: 'Word File', color: 'blue' },
                  { condition: selectedExcel, label: 'Excel File', color: 'green' },
                  { condition: selectedPpt, label: 'PPT File', color: 'purple' },
                  { condition: formData.url, label: 'Web URL', color: 'pink' },
                  { condition: formData.wikipediaTitle, label: 'Wikipedia', color: 'cyan' }
                ].map((source, index) => (
                  source.condition && (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        bg-${source.color}-500/20 text-${source.color}-300 flex items-center gap-1`}
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
                disabled={isGenerating || !userId}
                className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaRobot className="text-xl" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
              {!userId && (
                <p className="text-center text-red-300 text-sm mt-2">
                  Please log in to enable quiz generation.
                </p>
              )}
            </div>
          </div>
        ) : (
          // Quiz Display and Results
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-purple-500/30 pb-4">
              <h2 className="text-2xl text-white font-semibold">
                Quiz Time! {mainTopic && ` - Topic: ${mainTopic}`}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-white font-mono text-3xl font-bold">
                  {formatTime(timeLeft)}
                </span>
                {/* Save Notes Modal Trigger */}
                {showResults && questions.length > 0 && (
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="p-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MdSettings className="text-xl" /> Save Notes
                  </button>
                )}
              </div>
            </div>

            {/* Quiz Questions */}
            {!showResults && questions.length > 0 ? (
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-white/5 p-5 rounded-lg border border-purple-500/20 shadow-md">
                    <p className="text-white text-lg font-semibold mb-3">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerSelect(qIndex, option)}
                          className={`w-full text-left p-3 rounded-md transition-colors duration-200
                            ${selectedAnswers[qIndex] === option
                              ? 'bg-purple-600 text-white font-medium'
                              : 'bg-white/10 text-purple-200 hover:bg-white/20'
                            }`}
                          disabled={showResults || !timerActive} // Disable options if results are shown or timer is inactive
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  disabled={isSaving || !timerActive}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg mt-8"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Quiz</span>
                  )}
                </button>
              </div>
            ) : (
              // Quiz Results Display
              showResults && (
                <div className="text-center bg-white/5 p-8 rounded-lg shadow-xl border border-purple-500/30">
                  <h3 className="text-3xl font-bold text-purple-400 mb-4">Quiz Results</h3>
                  <p className="text-white text-5xl font-extrabold mb-6">
                    {score.toFixed(1)}%
                  </p>
                  <p className="text-purple-200 text-lg mb-8">
                    You answered {questions.filter((q, index) => selectedAnswers[index] === q.answer).length} out of {questions.length} questions correctly.
                  </p>

                  <div className="mt-8 space-y-4 text-left max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="bg-white/5 p-4 rounded-lg border border-purple-500/20">
                        <p className="font-semibold text-white mb-2">
                          {qIndex + 1}. {question.question}
                        </p>
                        <ul className="space-y-1">
                          {question.options.map((option, oIndex) => (
                            <li
                              key={oIndex}
                              className={`p-2 rounded-md text-sm
                                ${option === question.answer
                                  ? 'bg-green-700/50 text-green-200' // Correct answer
                                  : selectedAnswers[qIndex] === option
                                    ? 'bg-red-700/50 text-red-200' // User's incorrect answer
                                    : 'text-purple-200' // Unselected option
                                }`}
                            >
                              {option}
                              {option === question.answer && (
                                <span className="ml-2 font-bold">(Correct)</span>
                              )}
                              {selectedAnswers[qIndex] === option && option !== question.answer && (
                                <span className="ml-2 font-bold">(Your Answer)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={() => {
                        setShowQuestions(false);
                        setShowResults(false);
                        setQuestions([]);
                        setSelectedAnswers({});
                        setTimeLeft(formData.timeLimit);
                        setTimerActive(false);
                        setMainTopic('');
                        setCurrentQuizAttemptId(null); // Clear attempt ID on new quiz
                      }}
                      className="px-6 py-3 bg-purple-600 rounded-xl text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      Create New Quiz
                    </button>
                    {/* Re-enable Save Notes button if you still want to allow saving notes after seeing results */}
                    {questions.length > 0 && currentQuizAttemptId && ( // Only show if an attempt ID exists
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="px-6 py-3 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        Save Notes
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
            {/* Save Notes Modal */}
            {showSaveModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 p-8 rounded-lg shadow-2xl max-w-md w-full border border-purple-600">
                  <h3 className="text-2xl text-white font-bold mb-4">Add Notes to Quiz</h3>
                  <textarea
                    className="w-full p-3 bg-slate-700 text-white rounded-md border border-purple-500 mb-4 focus:outline-none focus:border-purple-400"
                    rows="5"
                    placeholder="Enter any notes or reflections about this quiz..."
                    value={saveNotes}
                    onChange={(e) => setSaveNotes(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="px-5 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveQuiz(saveNotes)} // Pass saveNotes to the handler
                      className="px-5 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition-colors"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Aiquestions;



// import React, { useState, useEffect, useId } from 'react';
// import { FaRobot, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaLink, FaWikipediaW } from 'react-icons/fa';
// import { MdSettings, MdCloudUpload } from 'react-icons/md';
// import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// import { useAuth } from '../../context/AuthContext';
// import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';





// const Aiquestions = () => {
//   // Update the initial state count to 10
//   const [formData, setFormData] = useState({
//     topic: '',
//   count: 10,
//   difficulty: 'medium',
//   questionType: 'mcq',
//   timeLimit: 60,
//   category: 'general'
//   });


//   // Add these new state variables
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedAudio, setSelectedAudio] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [selectedWord, setSelectedWord] = useState(null);
//   const [selectedExcel, setSelectedExcel] = useState(null);
//   const [selectedPpt, setSelectedPpt] = useState(null);

//   const [questions, setQuestions] = useState([]);
//   const [showQuestions, setShowQuestions] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60); // 1 minutes in seconds
//   const [timerActive, setTimerActive] = useState(false);

//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [saveNotes, setSaveNotes] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const [savedQuizzes, setSavedQuizzes] = useState([]);

//   const [quizId, setQuizId] = useState(null);

//   const userId = localStorage.getItem('userId');
//   console.log(userId, "id");


//   // Add FileUploadCard component
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

//   const handleAnswerSelect = (questionIndex, answer) => {
//     if (!showResults && timeLeft > 0) { // Only allow selection if quiz is not finished and time remains
//       setSelectedAnswers(prev => ({
//         ...prev,
//         [questionIndex]: answer
//       }));
//     }
//   };

//   useEffect(() => {
//     let timer;
//     if (timerActive && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft(prev => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       toast.warning("Time's up! Submitting quiz...");
//       handleSubmit();
//     }
//     return () => clearInterval(timer);
//   }, [timerActive, timeLeft]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   // Add file validation function
//   const validateFile = (file, type) => {
//     const maxSize = 10 * 1024 * 1024; // 10MB limit
//     if (file.size > maxSize) {
//       toast.error(`${type} file size should be less than 10MB`);
//       return false;
//     }
//     return true;
//   };

//   // Update the audio file handler
//   const handleAudioChange = (e) => {
//     const file = e.target.files[0];
//     if (file && validateFile(file, 'Audio')) {
//       setSelectedAudio(file);
//     } else {
//       e.target.value = null;
//     }
//   };

//   // Add file upload handlers
//   const handleFileUpload = (file, type, setterFunction) => {
//     if (file && validateFile(file, type)) {
//       setterFunction(file);
//       toast.success(`${type} file selected successfully`);
//     } else {
//       toast.error(`Invalid ${type} file`);
//     }
//   };

//   // Update handleGenerate to include new file types
//   const { user } = useAuth();
//   console.log("User ID:", user?._id); // should be like: 6655a23cc3bc6e1a0c4ddf14

//   const handleGenerate = async () => {
//     // Generate a unique quiz ID locally
//     const newQuizId = uuidv4();
//     setQuizId(newQuizId);
//     // Improved validation check
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
//       toast.error('Please provide at least one type of content (text, file, or URL)');
//       return;
//     }

//     const formDataToSend = new FormData();

//     // Add text content if provided
//     if (formData.topic.trim()) {
//       formDataToSend.append('content', formData.topic.trim());
//     }

//     // Add URL if provided
//     if (formData.url?.trim()) {
//       formDataToSend.append('url', formData.url.trim());
//     }


//     // Add Wikipedia title if provided
//     if (formData.wikipediaTitle?.trim()) {
//       formDataToSend.append('wikipedia_title', formData.wikipediaTitle.trim());
//     }

//     // Add files with proper field names
//     if (selectedImage) formDataToSend.append('image', selectedImage);
//     if (selectedAudio) formDataToSend.append('audio', selectedAudio);
//     if (selectedVideo) formDataToSend.append('video', selectedVideo);
//     if (selectedPdf) formDataToSend.append('pdf', selectedPdf);
//     if (selectedWord) formDataToSend.append('word', selectedWord);
//     if (selectedExcel) formDataToSend.append('excel', selectedExcel);
//     if (selectedPpt) formDataToSend.append('ppt', selectedPpt);

//     // Add all file types with proper field names
//     if (selectedImage) {
//       formDataToSend.append('image_file', selectedImage);
//     }
//     if (selectedAudio) {
//       formDataToSend.append('audio_file', selectedAudio);
//     }
//     if (selectedVideo) {
//       formDataToSend.append('video_file', selectedVideo);
//     }
//     if (selectedPdf) {
//       formDataToSend.append('pdf_file', selectedPdf);
//     }
//     if (selectedWord) {
//       formDataToSend.append('word_file', selectedWord);
//     }
//     if (selectedExcel) {
//       formDataToSend.append('excel_file', selectedExcel);
//     }
//     if (selectedPpt) {
//       formDataToSend.append('ppt_file', selectedPpt);
//     }

//     // Add quiz settings
//     formDataToSend.append('difficulty', formData.difficulty);
//     formDataToSend.append('question_type', formData.questionType);
//     formDataToSend.append('count', formData.count.toString());

//     setIsGenerating(true);
//     toast.info('Generating questions... This may take a few seconds.');

//     try {
//       const response = await fetch(`http://localhost:8000/quiz/${user._id}/`, {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       console.log(response, "iuh");


//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Server error response:', errorText);
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!data || !Array.isArray(data.questions)) {
//         throw new Error('Invalid response from server');
//       }

//       if (data.questions.length === 0) {
//         throw new Error('No questions were generated');
//       }

//       setQuestions(data.questions);
//       setShowQuestions(true);
//       setSelectedAnswers({});
//       setShowResults(false);
//       setTimeLeft(60);
//       setTimerActive(true);
//       toast.success('Questions generated successfully!');

//     } catch (error) {
//       console.error('Generation error details:', error);
//       toast.error(error.message || 'Failed to generate questions. Please check your server connection.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };


//   const handleSubmit = async () => {
//     setTimerActive(false); // Stop the timer

//     let correctCount = 0;
//     questions.forEach((question, index) => {
//       if (selectedAnswers[index] === question.answer) {
//         correctCount++;
//       }
//     });

//     const finalScore = (correctCount / questions.length) * 100;
//     setScore(finalScore);
//     setShowResults(true);

//     // Show score message
//     if (finalScore >= 80) {
//       toast.success(`Great job! Score: ${finalScore.toFixed(1)}%`);
//     } else if (finalScore >= 50) {
//       toast.info(`Good attempt! Score: ${finalScore.toFixed(1)}%`);
//     } else {
//       toast.warning(`Keep practicing! Score: ${finalScore.toFixed(1)}%`);
//     }

//     // Get user and token from localStorage
//     const auth = JSON.parse(localStorage.getItem('auth'));
//     const user = auth?.user;
//     const token = auth?.token;

//     // if (!user || !user._id) {
//     //   alert('User not logged in');
//     //   return;
//     // }

//     // if (!token) {
//     //   alert('Auth token missing');
//     //   return;
//     // }

//     try {
//       setIsSaving(true);

//       const quizData = {
//         user_id: user._id,
//         questions,
//         selectedAnswers,
//         score: finalScore,
//         date: new Date().toISOString(),
//         notes: saveNotes,
//       };

//       console.log('Saving quiz:', quizData);

//       // const response = await fetch(`http://localhost:8000/quiz/${user._id}/`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     Authorization: `Bearer ${token}`,
//       //   },
//       //   body: JSON.stringify(quizData),
//       // });

//       const response = await axios.post(
//         `http://localhost:8000/quiz/${userId}/`,
//         quizData,
//         {
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }

//       );
//       console.log(response);

//       const data = await response.json();
//       console.log(data);


//       if (!response.ok) throw new Error(data.error || 'Failed to save quiz');

//       toast.success('Quiz saved!');
//       setShowSaveModal(false);
//       setSaveNotes('');
//       setSavedQuizzes(prev => [
//         ...prev,
//         {
//           id: data.quiz_id || Date.now(),
//           score: finalScore,
//           date: new Date().toISOString(),
//           notes: saveNotes,
//         },
//       ]);
//     } catch (err) {
//       toast.error('Error saving quiz: ' + err.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };





//   // Update the form UI
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-slate-900 to-purple-900 p-6 mt-20">
//       <ToastContainer position="top-right" theme="dark" />
//       <div className="max-w-3xl mx-auto">
//         {!showQuestions ? (
//           <div className="space-y-8">
//             <div className="text-center">
//               <FaRobot className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse" />
//               <h1 className="text-4xl font-bold text-white mb-2">AI Quiz Generator</h1>
//               <p className="text-purple-200 text-lg">Create quizzes instantly</p>
//             </div>

//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
//               {/* Topic Input with Icon */}
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

//               {/* File Upload Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="relative group">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setSelectedImage(e.target.files[0])}
//                     className="hidden"
//                     id="image-upload"
//                   />
//                   <label
//                     htmlFor="image-upload"
//                     className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center"
//                   >
//                     {selectedImage ? '✓ Image Selected' : '+ Add Image'}
//                   </label>
//                 </div>

//                 <div className="relative group">
//                   <input
//                     type="file"
//                     accept="audio/*"
//                     onChange={handleAudioChange}
//                     className="hidden"
//                     id="audio-upload"
//                   />
//                   <label
//                     htmlFor="audio-upload"
//                     className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center"
//                   >
//                     {selectedAudio ? '✓ Audio Selected' : '+ Add Audio'}
//                   </label>
//                 </div>

//                 <div className="relative group">
//                   <input
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => setSelectedVideo(e.target.files[0])}
//                     className="hidden"
//                     id="video-upload"
//                   />
//                   <label
//                     htmlFor="video-upload"
//                     className="block p-4 bg-white/5 border border-purple-500/30 rounded-xl text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center"
//                   >
//                     {selectedVideo ? '✓ Video Selected' : '+ Add Video'}
//                   </label>
//                 </div>
//               </div>
//               {/* Enhanced File Upload Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {/* Existing uploads */}
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

//               {/* Questions Count Input */}

//               <div className="flex items-center justify-between space-x-4 mb-4">
//                 <div className="flex items-center space-x-4">
//                   <label className="text-purple-200">Questions:</label>
//                   <input
//                     type="number"
//                     value={formData.count}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         count: Math.min(10, Math.max(1, parseInt(e.target.value) || 10)),
//                       })
//                     }
//                     className="w-20 p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white text-center outline-none"
//                     min="1"
//                     max="10"
//                   />
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <label className="text-purple-200">Difficulty:</label>
//                   <select
//                     value={formData.difficulty}
//                     onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
//                     className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer"
//                   >
//                     <option className='text-blue-500' value="easy">Easy</option>
//                     <option className='text-blue-500' value="medium">Medium</option>
//                     <option className='text-blue-500' value="hard">Hard</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <label className="text-purple-200">Type:</label>
//                   <select
//                     value={formData.questionType}
//                     onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
//                     className="p-2 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none cursor-pointer"
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
//                         text-${source.color}-300 flex items-center gap-1`}
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
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl text-white font-semibold">Quiz Questions</h2>
//               <div className="flex items-center gap-4">
//                 <span className="text-white font-mono text-xl">
//                   {formatTime(timeLeft)}
//                 </span>
//                 <button
//                   onClick={() => setShowQuestions(false)}
//                   className="p-2 rounded-lg bg-purple-500/20 text-purple-300"
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
//                         className={`p-2 rounded-lg text-left ${selectedAnswers[i] === opt
//                           ? 'bg-purple-500 text-white'
//                           : 'bg-white/5 text-purple-200 hover:bg-white/10'
//                           }`}
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

//             {!showResults && (
//               <button
//                 onClick={handleSubmit}
//                 className="mt-6 w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white"
//               >
//                 Submit Quiz
//               </button>
//             )}

//             {showResults && (
//               <div className="mt-6 text-center text-white">
//                 <h3 className="text-2xl font-bold">Your Score: {score.toFixed(1)}%</h3>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//     </div>

//   );
// };

// export default Aiquestions;

