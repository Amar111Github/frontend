
import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import "../../../assest/css/style.css";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);

  
  console.log(result);
  

  const mediaRecorderRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const screenStreamRef = useRef(null);

  // const startScreenRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //     });
  //     screenStreamRef.current = stream;

  //     mediaRecorderRef.current = new MediaRecorder(stream);
  //     chunksRef.current = [];

  //     stream.getVideoTracks()[0].onended = () => {
  //       alert("Screen sharing stopped. Exam will be canceled.");
  //       stopScreenRecording();
  //       navigate("/");
  //     };

  //     mediaRecorderRef.current.ondataavailable = (e) => {
  //       if (e.data.size > 0) chunksRef.current.push(e.data);
  //     };

  //     mediaRecorderRef.current.onstop = async() => {
  //       const blob = new Blob(chunksRef.current, { type: "video/webm" });
  //       await calculateResult(blob);
  //     };
  //     // mediaRecorderRef.current.onstop = async () => {
  //     //   try {
  //     //     const blob = new Blob(chunksRef.current, { type: "video/webm" });
  //     //     chunksRef.current = []; // Clear the buffer
  //     //     await calculateResult(blob); // Ensure Blob is available and passed correctly
  //     //   } catch (error) {
  //     //     console.error("Error handling screen recording Blob:", error);
  //     //     message.error("Failed to process the recording. Please try again.");
  //     //   }
  //     // };

  //     mediaRecorderRef.current.start();
  //   } catch (error) {
  //     message.error("Screen sharing is required for the exam.");
  //     navigate("/");
  //   }
  // };


  const [recordingBlob, setRecordingBlob] = useState(null); // Define state for recording blob

const startScreenRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    screenStreamRef.current = stream;

    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    stream.getVideoTracks()[0].onended = () => {
      alert("Screen sharing stopped. Exam will be canceled.");
      stopScreenRecording();
      navigate("/");
    };

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordingBlob(blob); // Save blob in state
      chunksRef.current = []; // Clear buffer
    };

    mediaRecorderRef.current.start();
  } catch (error) {
    message.error("Screen sharing is required for the exam.");
    navigate("/");
  }
};

const stopScreenRecording = () => {
  if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  if (screenStreamRef.current) {
    screenStreamRef.current.getTracks().forEach((track) => track.stop());
  }
};

const calculateResult = async (blob) => {
  try {
    let correctAnswers = [];
    let wrongAnswers = [];

    // Process answers
    questions.forEach((question, index) => {
      if (question.correctOption === selectedOptions[index]) {
        correctAnswers.push(question);
      } else {
        wrongAnswers.push(question);
      }
    });

    const verdict =
      correctAnswers.length >= examData.passingMarks ? "Pass" : "Fail";

    const tempResult = { correctAnswers, wrongAnswers, verdict };
    setResult(tempResult);

    // Prepare FormData
    const formData = new FormData();
    // formData.append("file", blob, "screen-recording.webm"); // Add recording
    formData.append(
      "payload",
      JSON.stringify({
        exam: params.id,
        result: tempResult,
        user: user._id,
      })
    );

    // Submit result and recording
    dispatch(ShowLoading());
    const response = await addReport(formData);
    dispatch(HideLoading());

    if (response.success) {
      setView("result");
    } else {
      message.error(response.message);
    }
  } catch (error) {
    dispatch(HideLoading());
    message.error("Error while calculating results: " + error.message);
  }
};

useEffect(() => {
  if (timeUp) {
    stopScreenRecording();
    stopCamera();
    if (recordingBlob) {
      calculateResult(recordingBlob); // Pass the blob to calculateResult
    }
  }
}, [timeUp, recordingBlob]);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access is required for the exam.");
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({ examId: params.id });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  

  
  const startTimer = () => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(intervalId);
        setTimeUp(true);
        return 0;
      });
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp) {
      stopScreenRecording();
      stopCamera();
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) getExamData();
  }, []);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  useEffect(() => {
    const preventCopy = (e) => e.preventDefault();
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
    };
  }, []);

  return (
    examData && (
      <div className="mt-2">
        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={() => {
              // startScreenRecording();
              // startCamera();
              startTimer();
            }}
          />
        )}

        {view === "questions" && (
          <div className="container">
            <div className="row">
              {/* Question Section */}
              <div className="row align-items-center mb-3">
                <div className="col-lg-10 col-md-9 col-sm-8 col-8">
                  <h1 className="text-truncate">{examData.name}</h1>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 col-4 text-end">
                  <span className="textTime">
                    {formatTime(secondsLeft)} Min.
                  </span>
                </div>
              </div>
              <div className="divider"></div>

              <div className="col-lg-10 col-md-4 col-sm-4 col-12">
                <div className="row g-3 mt-2">
                  <div
                    className="question d-flex no-copy"
                    onCopy={(e) => e.preventDefault()}
                  >
                    <div className="sno me-2">{selectedQuestionIndex + 1}</div>
                    <div className="mainQues flex-grow-1">
                      {questions[selectedQuestionIndex].name}
                    </div>
                  </div>
                  {Object.keys(questions[selectedQuestionIndex].options).map(
                    (option, index) => (
                      <div
                        className={`col-md-6 col-sm-12 d-flex`}
                        style={{
                          borderRadius: "20px",
                        }}
                        key={index}
                        onClick={() => {
                          setSelectedOptions({
                            ...selectedOptions,
                            [selectedQuestionIndex]: option,
                          });
                        }}
                      >
                        <div
                          className={`p-3 flex-fill ${
                            selectedOptions[selectedQuestionIndex] === option
                              ? "selected-option"
                              : "option"
                          }`}
                        >
                          <div className="optQues d-flex gap-2">
                            <h1 className="text-xl me-2">{option}:</h1>
                            <h1 className="text-xl flex-grow-1">
                              {questions[selectedQuestionIndex].options[option]}
                            </h1>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="row g-3 mt-1">
                  <div className="col-md-6 col-sm-12">
                    {selectedQuestionIndex > 0 && (
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() =>
                          setSelectedQuestionIndex(selectedQuestionIndex - 1)
                        }
                      >
                        Previous
                      </button>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 text-end">
                    {selectedQuestionIndex < questions.length - 1 && (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() =>
                          setSelectedQuestionIndex(selectedQuestionIndex + 1)
                        }
                      >
                        Next
                      </button>
                    )}
                    {selectedQuestionIndex === questions.length - 1 && (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => {
                          clearInterval(intervalId);
                          setTimeUp(true);
                          stopScreenRecording();
                          stopCamera();
                        }}
                      >
                      
                      
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Section */}
              <div className="col-lg-2 col-md-3 col-sm-4 col-12 d-flex justify-content-center mt-3">
                <video
                  ref={videoRef}
                  className="video-feed"
                  style={{
                    width: "100%",
                    maxWidth: 350,
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex items-center mt-2 justify-center result">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl text-center" style={{ fontSize: "25px" }}>
                RESULT ({result.verdict})
              </h1>
              <div className="divider"></div>
              <table
                className="table marks-table mx-auto"
                style={{ width: "100%", maxWidth: 300 }}
              >
                <tbody>
                  <tr>
                    <th>Total Marks</th>
                    <td>{examData.totalMarks}</td>
                  </tr>
                  <tr>
                    <th>Obtained Marks</th>
                    <td>{result.correctAnswers.length}</td>
                  </tr>
                  <tr>
                    <th>Wrong Answers</th>
                    <td>{result.wrongAnswers.length}</td>
                  </tr>
                  <tr>
                    <th>Passing Marks</th>
                    <td>{examData.passingMarks}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-3 d-flex justify-content-center">
                <button
                  className="btn btn-primary"
                  onClick={() => setView("review")}
                >
                  Review Answers
                </button >
              </div>
            </div>
            <div className="mt-3 lottie-animation">
              {result.verdict === "Pass" && (
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ maxWidth: "200px" }}
                ></lottie-player>
              )}
              {result.verdict === "Fail" && (
                <lottie-player
                  src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ maxWidth: "200px" }}
                ></lottie-player>
              )}
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                  key={index}
                >
                  <h1 className="text-xl">
                    {index + 1}: {question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer: {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer: {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/login")}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
