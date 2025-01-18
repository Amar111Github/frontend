import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-lg" style={{padding:"10px 75px",maxWidth:"85%", maxHeight:"100%"}}>
      <h1 className="text-3xl font-semibold text-center text-blue-600 underline mb-4">Exam Instructions</h1>

      <div className="text-gray-700 mb-6" style={{lineHeight:"2rem"}}>
        <p className="mb-2">
          We appreciate your interest in joining kasper infotech Pvt. Ltd. Please review the following
          requirements before applying for the online test:
        </p>
        
        <ul className="space-y-4 list-inside list-disc">
          <li>
            <strong>Exam Duration: </strong>
            <span className="font-semibold">{Math.floor(examData.duration / 60)} minutes</span>
          </li>
          <li>
            <strong>Automatic Submission: </strong>
            The exam will be submitted automatically after{" "}
            <span className="font-semibold">{Math.floor(examData.duration / 60)} minutes</span>.
          </li>
          <li>Once submitted, you cannot change your answers.</li>
          <li>
            <strong>Age Requirement:</strong> Applicants must be at least 18 years of age.
          </li>
          <li>
            <strong>Allow Camera and Screen Sharing:</strong> You must allow access to your camera and share your
            full screen to continue with the exam.
          </li>
          <li>
            <strong>Do not refresh the page</strong> while taking the exam. Refreshing will terminate your exam.
          </li>
          <li>
            <strong>Total Marks:</strong> <span className="font-semibold">{examData.totalMarks} Marks</span>.
          </li>
          <li>
            <strong>Passing Marks:</strong> <span className="font-semibold">{examData.passingMarks} Marks</span>.
          </li>
          <li>
            You can use the <span className="font-semibold">"Previous"</span> and <span className="font-semibold">"Next"</span> buttons to navigate
            between questions.
          </li>
          <li>
            <strong>Qualification:</strong> Minimum of a Bachelor's degree in a relevant field is required.
          </li>
          <li>
            <strong>Work Location:</strong> Applicants should be willing to work at our designated office location in{" "}
            <span className="font-semibold">[Office Number 214, Tower B, The iThum Towers, Sector 62, Noida, Uttar Pradesh 201301 India]</span>
          </li>
          <li>
            A detailed and up-to-date resume must be submitted along with the application.
          </li>
          <li>The position may require working on Saturdays. Applicants must be open to this arrangement if required.</li>
          <li>
            A competitive stipend will be offered to selected candidates during the training period.
          </li>
          <li>Interested candidates should fill out the online application form available on our website.</li>
          <li>Complete the online test within the specified time frame.</li>
          <li>
            Candidates who achieve a passing score of at least <span className="font-semibold">70%</span> will be notified via email
            regarding the next steps.
          </li>
          <li>
            <strong>Note:</strong> Meeting the requirements does not guarantee selection. Applicants who successfully pass the
            online test and interview stages will be considered for employment.
          </li>
          <li>
            For further inquiries, please contact our support team at{" "}
            <span className="font-semibold">info@kasperinfotech.com</span>.
          </li>
        </ul>
      </div>

      <div className="flex gap-2 justify-between ">
        <button className="primary-outlined-btn " onClick={() => navigate("/")}>
          Close
        </button>

        <button
          className="primary-contained-btn"
          onClick={() => { 
            startTimer();
            setView("questions");
          
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

export default Instructions;
