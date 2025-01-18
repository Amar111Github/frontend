import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExams } from "../../../apicalls/exams";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Col, Row, message } from "antd";

function Home() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [completedExams, setCompletedExams] = useState([]); // Tracks completed exams

  const fetchExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExams({ userId: user._id });
      if (response.success) {
        if (user.isAdmin) {
          setExams(response.data); // Admin gets all exams
        } else {
          setExams([response.data]); // Regular user gets only their exam
        }
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  return (
    user && (
      <div style={{  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {/* Welcome Message */}
        <PageTitle title={`Hi ${user.name}, Welcome to Online Test`} />
        <div className="divider" style={{ width: "100%", height: "1px", background: "#ddd", margin: "20px 0" }}></div>

        {/* Exam Cards Section */}
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginTop: "20px", width: "100%" }}
        >
          {exams.map((exam) => (
            <Col key={exam._id} lg={12} style={{ display: "flex", justifyContent: "center" }}>
              <div
                className="card-lg"
                style={{
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  width: "100%",
                  maxWidth: "550px",
                }}
              >
                <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "15px" }}>{exam?.name}</h1>
               <div className="mt-4"> <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Total Marks: {exam.totalMarks}</h3>
                <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Category: {exam.category}</h3>
                <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Passing Marks: {exam.passingMarks}</h3>
                <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Duration: {Math.floor(exam.duration / 60)} Min</h3></div>

                {/* <button
                  className="primary-contained-btn"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginTop: "15px",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                >
                  Start Exam
                </button> */}
                {/* Conditional Rendering */}
                {completedExams.includes(exam._id) ? (
                  <button
                    className="primary-contained-btn"
                    onClick={() => navigate(`/user/review-answers/${exam._id}`)}
                    style={{
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "15px",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
                  >
                    Review Answers
                  </button>
                ) : (
                  <button
                    className="primary-contained-btn"
                    onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "15px",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                  >
                    Start Exam
                  </button>
                )}
              </div>
        
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
