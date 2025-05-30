// import React, { useState, useEffect, useCallback } from 'react';
// import { FaRobot, FaSpinner, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaLink, FaWikipediaW, FaImage, FaHeadphones, FaVideo } from 'react-icons/fa';
// import { MdSettings } from 'react-icons/md';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct
// import axios from 'axios';

// const Aiquestions = () => {
//   const [formData, setFormData] = useState({
//     topic: '',
//     count: 10, // Corresponds to 'number_questions' in backend
//     difficulty: 'medium',
//     questionType: 'mcq',
//     timeLimit: 60, // Frontend-only for timer (in seconds)
//     url: '',
//     wikipediaTitle: '',
//   });

//   // State for selected files
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedAudio, setSelectedAudio] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [selectedWord, setSelectedWord] = useState(null);
//   const [selectedExcel, setSelectedExcel] = useState(null);
//   const [selectedPpt, setSelectedPpt] = useState(null);

//   const [isSaving, setIsSaving] = useState(false); // To prevent multiple submissions
//   const [questions, setQuestions] = useState([]);
//   const [mainTopic, setMainTopic] = useState(''); // To store the main topic from the backend
//   const [showQuestions, setShowQuestions] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores answers by question index: {0: "Option A", 1: "Option B"}
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0); // Raw score (number of correct answers)
//   const [timeLeft, setTimeLeft] = useState(formData.timeLimit);
//   const [timerActive, setTimerActive] = useState(false);

//   // New states for saving functionality and notes modal
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [saveNotes, setSaveNotes] = useState('');
//   const [savedQuizzes, setSavedQuizzes] = useState([]); // Placeholder for displaying saved quizzes
//   const [currentQuizAttemptId, setCurrentQuizAttemptId] = useState(null); // To store the ID of the current quiz attempt for notes saving

//   // Auth context for user ID and token
//   const { user, token } = useAuth();
//   const userId = user?._id;

//   // --- Quiz Submission Function (Modified) ---
//   const handleSubmit = useCallback(async () => {
//     setTimerActive(false); // Stop the timer immediately upon submission

//     if (questions.length === 0) {
//       toast.info("No questions to submit or save.");
//       setShowResults(true); // Still show results section, but with 0 score
//       setScore(0);
//       return;
//     }

//     let correctCount = 0;
//     questions.forEach((question, index) => {
//       // Ensure question.answer exists and is compared correctly
//       if (selectedAnswers[index] && question.answer && selectedAnswers[index] === question.answer) {
//         correctCount++;
//       }
//     });

//     const finalScorePercentage = (correctCount / questions.length) * 100;
//     setScore(finalScorePercentage); // Update the score state with percentage
//     setShowResults(true); // Display results to the user

//     if (finalScorePercentage >= 80) {
//       toast.success(`Great job! Score: ${finalScorePercentage.toFixed(1)}%`);
//     } else if (finalScorePercentage >= 50) {
//       toast.info(`Good attempt! Score: ${finalScorePercentage.toFixed(1)}%`);
//     } else {
//       toast.warning(`Keep practicing! Score: ${finalScorePercentage.toFixed(1)}%`);
//     }

//     if (!userId) {
//       toast.error('User not logged in. Quiz results will not be saved.');
//       return;
//     }

//     if (isSaving) {
//       return;
//     }

//     try {
//       setIsSaving(true); // Set saving status to true

//       const userAnswersDetailed = questions.map((q, index) => ({
//         question_id: q._id || `client_gen_${index}`, // Fallback if _id is not present
//         selected_answer: selectedAnswers[index] || null,
//         is_correct: selectedAnswers[index] === q.answer, // Add for backend validation/storage
//       }));

//       const usedContentTypes = [];
//       if (formData.topic.trim()) usedContentTypes.push('text');
//       if (selectedImage) usedContentTypes.push('image');
//       if (selectedAudio) usedContentTypes.push('audio');
//       if (selectedVideo) usedContentTypes.push('video');
//       if (selectedPdf) usedContentTypes.push('pdf');
//       if (selectedWord) usedContentTypes.push('word');
//       if (selectedExcel) usedContentTypes.push('excel');
//       if (selectedPpt) usedContentTypes.push('ppt');
//       if (formData.url?.trim()) usedContentTypes.push('url');
//       if (formData.wikipediaTitle?.trim()) usedContentTypes.push('wikipedia');

//       let quizContentTopic = mainTopic || formData.topic.trim();
//       if (!quizContentTopic && formData.url?.trim()) quizContentTopic = formData.url.trim();
//       if (!quizContentTopic && formData.wikipediaTitle?.trim()) quizContentTopic = formData.wikipediaTitle.trim();
//       if (!quizContentTopic) quizContentTopic = "AI Generated Quiz"; // Fallback if no specific content type provides a clear topic

//       const quizAttemptData = {
//         user: userId,
//         questions: questions, // Sending the full questions array as returned by the backend
//         user_answers: userAnswersDetailed, // Detailed array of user's selected answers
//         score: finalScorePercentage, // Percentage score
//         total_questions: questions.length,
//         difficulty: formData.difficulty,
//         question_type: formData.questionType,
//         topics: mainTopic ? [mainTopic] : [],
//         content_types: usedContentTypes,
//         time_taken: formData.timeLimit - timeLeft,
//         submitted: true, // Crucial for backend to know this is a submission attempt
//         content: quizContentTopic, // Used 'content' based on your previous logs
//         // If the new endpoint still relies on the currentQuizAttemptId to link this submission
//         // to a previously generated quiz instance, you might need to include it here too.
//         // For example: current_attempt_id: currentQuizAttemptId,
//       };

//       console.log("Sending quiz attempt data for submission (POST):", quizAttemptData);

//       // CHANGED: Use POST request to the new submission API
//       const response = await axios.post(
//         `http://127.0.0.1:8000/user/submitquiz/${userId}/`, // New endpoint
//         quizAttemptData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       console.log('Quiz results submitted and saved:', response.data);
//       toast.success('Quiz results submitted successfully!');

//       // IMPORTANT: If the backend returns a new attempt ID after submission,
//       // or confirms the `currentQuizAttemptId` was updated/finalized, handle it.
//       // For example, if the backend sends back a `new_attempt_id` or similar:
//       if (response.data.quiz_id) { // Assuming backend returns `quiz_id` upon successful submission
//         setCurrentQuizAttemptId(response.data.quiz_id);
//       } else {
//         console.warn("Backend did not return a quiz_id for the submitted attempt.");
//       }

//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.error || err.message || 'Failed to submit quiz results.';
//       toast.error('Error submitting quiz: ' + errorMsg);
//       console.error("Submission error:", err.response?.data || err);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [userId, questions, selectedAnswers, formData.difficulty, formData.questionType, mainTopic, formData.timeLimit, timeLeft, isSaving, token, selectedImage, selectedAudio, selectedVideo, selectedPdf, selectedWord, selectedExcel, selectedPpt, formData.topic, formData.url, formData.wikipediaTitle]);

//   // --- handleSaveQuiz Function (for saving notes/specific quiz instance) ---
//   const handleSaveQuiz = useCallback(async (notes) => { // Wrapped in useCallback
//     if (!user || !token || !currentQuizAttemptId) { // Check for currentQuizAttemptId
//       toast.error("Quiz attempt not found. Please submit the quiz first or generate a new one.");
//       console.error("Missing user, token, or quiz attempt ID for saving notes.");
//       return;
//     }

//     // Determine the primary content for saving.
//     // Prioritize the mainTopic identified by the backend, then the initial topic input, then URL, then Wikipedia, etc.
//     let primaryContent = mainTopic || formData.topic.trim();
//     if (!primaryContent && formData.url?.trim()) primaryContent = formData.url.trim();
//     if (!primaryContent && formData.wikipediaTitle?.trim()) primaryContent = formData.wikipediaTitle.trim();
//     // Fallback if no specific content is identified (e.g., if generated from a file without a clear topic)
//     if (!primaryContent) primaryContent = "AI Generated Quiz";

//     // Collect content types that were used for generation
//     const usedContentTypes = [];
//     if (formData.topic.trim()) usedContentTypes.push('text');
//     if (selectedImage) usedContentTypes.push('image');
//     if (selectedAudio) usedContentTypes.push('audio');
//     if (selectedVideo) usedContentTypes.push('video');
//     if (selectedPdf) usedContentTypes.push('pdf');
//     if (selectedWord) usedContentTypes.push('word');
//     if (selectedExcel) usedContentTypes.push('excel');
//     if (selectedPpt) usedContentTypes.push('ppt');
//     if (formData.url?.trim()) usedContentTypes.push('url');
//     if (formData.wikipediaTitle?.trim()) usedContentTypes.push('wikipedia');

//     const quizSavePayload = {
//       user: userId,
//       // The 'content' field that the backend is looking for, now guaranteed to be present
//       content: primaryContent,
//       // Include quiz details and results for saving this specific attempt
//       score: score, // The final calculated score percentage
//       questions: questions, // The generated questions
//       user_answers: questions.map((q, index) => ({ // Include user's answers for review
//         question_id: q._id || `client_gen_${index}`,
//         selected_answer: selectedAnswers[index] || null,
//         is_correct: selectedAnswers[index] === q.answer, // Include correctness for notes view
//       })),
//       difficulty: formData.difficulty,
//       question_type: formData.questionType,
//       topics: mainTopic ? [mainTopic] : [],
//       content_types: usedContentTypes,
//       time_taken: formData.timeLimit - timeLeft,
//       notes: notes, // User's custom notes, using the 'notes' parameter
//       submitted: true, // Indicate it's a submitted attempt
//     };

//     console.log("Saving quiz with notes - Payload:", quizSavePayload);
//     console.log("Saving quiz with notes - Endpoint:", `http://localhost:8000/quiz/attempts/${currentQuizAttemptId}/`);

//     try {
//       // Assuming your backend has a separate endpoint for updating an existing quiz attempt with notes
//       // This usually involves a PATCH or PUT request to a specific attempt ID.
//       const response = await axios.patch( // Use PATCH for partial updates
//         `http://localhost:8000/quiz/attempts/${currentQuizAttemptId}/`, // Example: Update specific attempt
//         quizSavePayload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Quiz notes saved successfully:", response.data);
//       toast.success("Quiz notes saved successfully!");
//       setShowSaveModal(false);
//       setSaveNotes("");

//       // Add to saved quizzes list (if you have one)
//       setSavedQuizzes((prev) => [
//         ...prev,
//         {
//           id: response.data.quiz_id || Date.now(), // Backend should return a quiz_id
//           score: score,
//           date: new Date().toISOString(),
//           notes: notes, // Use the passed 'notes'
//           topic: primaryContent, // Store the topic for display
//         },
//       ]);
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || err.message || "Failed to save quiz notes";
//       toast.error("Save error: " + errorMsg);
//       console.error("Save error during notes saving:", err.response?.data || err);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [user, token, currentQuizAttemptId, userId, mainTopic, formData.topic, formData.url, formData.wikipediaTitle, selectedImage, selectedAudio, selectedVideo, selectedPdf, selectedWord, selectedExcel, selectedPpt, score, questions, selectedAnswers, formData.difficulty, formData.questionType, formData.timeLimit, timeLeft]); // Added dependencies for useCallback

//   // --- Timer Effect ---
//   useEffect(() => {
//     let timer;
//     if (timerActive && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft(prev => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0 && showQuestions && !showResults) {
//       toast.warning("Time's up! Submitting quiz automatically...");
//       handleSubmit();
//     }
//     return () => clearInterval(timer);
//   }, [timerActive, timeLeft, showQuestions, showResults, handleSubmit]);

//   // --- Utility Functions ---
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const validateFile = (file, type) => {
//     const maxSize = 10 * 1024 * 1024; // 10MB limit
//     if (!file) return false;
//     if (file.size > maxSize) {
//       toast.error(`${type} file size should be less than 10MB`);
//       return false;
//     }
//     return true;
//   };

//   const handleFileUpload = (file, type, setterFunction) => {
//     if (file) {
//       if (validateFile(file, type)) {
//         setterFunction(file);
//         toast.success(`${type} file selected successfully`);
//       } else {
//         setterFunction(null);
//       }
//     } else {
//       setterFunction(null);
//     }
//   };

//   // --- FileUploadCard Component (Purely for rendering UI) ---
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
//         className="flex flex-col items-center justify-center p-4 bg-white/5 border border-purple-500/30 rounded-xl
//           text-purple-200 cursor-pointer hover:bg-white/10 transition-all text-center h-24"
//       >
//         <Icon className="text-2xl mb-1" />
//         <span>{selected ? `✓ ${type} Selected` : `+ Add ${type}`}</span>
//       </label>
//     </div>
//   );

//   // --- Answer Selection ---
//   const handleAnswerSelect = (questionIndex, answer) => {
//     if (!showResults && timerActive) {
//       setSelectedAnswers(prev => ({
//         ...prev,
//         [questionIndex]: answer
//       }));
//     }
//   };

//   // --- Quiz Generation ---
//   const handleGenerate = async () => {
//     if (!userId) {
//       toast.error('Please log in to generate quizzes.');
//       return;
//     }

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

//     // Append text content
//     if (formData.topic.trim()) {
//       formDataToSend.append('content', formData.topic.trim());
//     }
//     if (formData.url?.trim()) {
//       formDataToSend.append('url', formData.url.trim());
//     }
//     if (formData.wikipediaTitle?.trim()) {
//       formDataToSend.append('wikipedia_title', formData.wikipediaTitle.trim());
//     }

//     // Append files - IMPORTANT: Use backend's expected key names (no '_file' suffix)
//     if (selectedImage) formDataToSend.append('image', selectedImage);
//     if (selectedAudio) formDataToSend.append('audio', selectedAudio);
//     if (selectedVideo) formDataToSend.append('video', selectedVideo);
//     if (selectedPdf) formDataToSend.append('pdf', selectedPdf);
//     if (selectedWord) formDataToSend.append('word', selectedWord);
//     if (selectedExcel) formDataToSend.append('excel', selectedExcel);
//     if (selectedPpt) formDataToSend.append('ppt', selectedPpt);

//     // Append quiz settings
//     formDataToSend.append('difficulty', formData.difficulty);
//     formDataToSend.append('question_type', formData.questionType);
//     formDataToSend.append('number_questions', formData.count.toString()); // Corrected to 'number_questions'

//     setIsGenerating(true);
//     toast.info('Generating questions... This may take a few seconds.');

//     try {
//       // Assuming your generation endpoint is `http://localhost:8000/quiz/<userId>/`
//       const response = await axios.post(`http://localhost:8000/quiz/${userId}/`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Essential for FormData for generation
//           Authorization: `Bearer ${token}`, // Include token for generation
//         },
//       });

//       const data = response.data;

//       // Validate the structure of the response
//       if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
//         throw new Error(data.message || 'No questions were generated. Please try different content or settings.');
//       }

//       setQuestions(data.questions);
//       setMainTopic(data.topics || 'General Quiz'); // Capture the main topic from backend
//       setShowQuestions(true);
//       setSelectedAnswers({}); // Clear answers for new quiz
//       setShowResults(false); // Hide results for new quiz
//       setTimeLeft(formData.timeLimit); // Reset timer for new quiz
//       setTimerActive(true); // Start timer
//       toast.success('Questions generated successfully! Good luck!');

//       // Set the currentQuizAttemptId from the generation response
//       if (data.quiz_id) { // Assuming your backend returns a quiz_id when generating
//         setCurrentQuizAttemptId(data.quiz_id);
//       } else {
//         console.warn("Backend did not return a quiz_id during quiz generation. Notes saving might not work.");
//       }

//       // Clear file inputs and related form data after successful generation
//       setSelectedImage(null);
//       setSelectedAudio(null);
//       setSelectedVideo(null);
//       setSelectedPdf(null);
//       setSelectedWord(null);
//       setSelectedExcel(null);
//       setSelectedPpt(null);
//       // Decide if you want to clear topic, url, wikipediaTitle or keep them
//       setFormData(prev => ({
//         ...prev,
//         topic: '', // Clear topic
//         url: '',    // Clear URL
//         wikipediaTitle: '', // Clear Wikipedia title
//       }));

//     } catch (error) {
//       console.error('Generation error details:', error.response?.data || error.message || error);
//       const errorMessage = error.response?.data?.error || error.message || 'Failed to generate questions. Please check your server connection and input.';
//       toast.error(errorMessage);
//     } finally {
//       setIsGenerating(false);
//     }
//   };








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
        // The `notes` field has been intentionally removed from here.
        // It should only be added/updated via `handleSaveQuiz`.
      };

      console.log("Sending quiz attempt data for submission:", quizAttemptData);

      const response = await axios.post(
        `http://localhost:8000/quiz/${userId}/`, // Assuming this endpoint handles new quiz attempt submissions
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
      if (response.data.quiz_id) { // Assuming your backend returns a 'quiz_id'
        setCurrentQuizAttemptId(response.data.quiz_id);
      } else {
        console.warn("Backend did not return a quiz_id for the submitted attempt. Notes cannot be saved later.");
      }

    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to save quiz results.';
      toast.error('Error saving quiz: ' + errorMsg);
      console.error("Save error during submission:", err.response?.data || err);
    } finally {
      setIsSaving(false);
    }
  }, [userId, questions, selectedAnswers, formData.difficulty, formData.questionType, mainTopic, formData.timeLimit, timeLeft, isSaving, token, selectedImage, selectedAudio, selectedVideo, selectedPdf, selectedWord, selectedExcel, selectedPpt, formData.topic, formData.url, formData.wikipediaTitle]); // Dependencies for useCallback

  // --- handleSaveQuiz Function (for saving notes/specific quiz instance) ---
  // This function is intended to *update* an existing quiz attempt with notes.
 
  const handleSaveQuiz = async (notes) => {
    // This check should already be robust if authLoading is handled upstream
    if (!user || !token || !currentQuizAttemptId) {
      toast.error("Quiz attempt not found. Please submit the quiz first or generate a new one.");
      console.error("Missing user, token, or quiz attempt ID for saving notes.");
      return;
    }
    // ... rest of your save logic
  


    setIsSaving(true); // Set saving status to true for notes saving

    // Determine the primary content for saving.
    let primaryContent = mainTopic || formData.topic.trim();
    if (!primaryContent && formData.url?.trim()) primaryContent = formData.url.trim();
    if (!primaryContent && formData.wikipediaTitle?.trim()) primaryContent = formData.wikipediaTitle.trim();
    if (!primaryContent) primaryContent = "AI Generated Quiz"; // Fallback if no specific content is identified

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
      // No need to send `user` or `questions` etc., if this is purely for updating notes
      // If your backend expects a full object on PATCH, you'll need to include them.
      // Assuming a minimal update:
      notes: notes, // Only sending the notes field
      // If your backend expects other fields for a PATCH/PUT, include them here:
      // content: primaryContent,
      // score: score,
      // time_taken: formData.timeLimit - timeLeft,
      // submitted: true,
      // ... other fields that might be updated or are required by your PATCH endpoint
    };

    console.log("Saving quiz with notes - Payload:", quizSavePayload);
    // The endpoint should be specific to updating an existing quiz attempt by its ID
    console.log("Saving quiz with notes - Endpoint:", `http://localhost:8000/quiz/attempts/${currentQuizAttemptId}/`);

    try {
      // Use PATCH for partial updates (e.g., just adding notes)
      const response = await axios.patch(
        `http://localhost:8000/quiz/attempts/${currentQuizAttemptId}/`, // Use the specific attempt ID
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

      // You might want to update the `savedQuizzes` state to reflect the new notes
      // for the specific quiz attempt.
      setSavedQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === currentQuizAttemptId ? { ...quiz, notes: notes } : quiz
        )
      );

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