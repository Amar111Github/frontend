import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ReactPlayer from "react-player";
import Modal from "react-modal"; // For modal popup
import "./report.css";
import { FaDownload, FaRegPlayCircle } from "react-icons/fa";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [filters, setFilters] = useState({ examName: "", userName: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  console.log(reportsData);
  
  

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      render: (text, record) => <>{record.user.mobile}</>,
    },
    {
      title: "Email Id",
      dataIndex: "email id",
      render: (text, record) => <>{record.user.email}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Result",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "Recording",
      dataIndex: "recording",
      render: (text, record) =>
        record.recording ? (
          <FaRegPlayCircle
            onClick={() => openVideoModal(record.recording.fileUrl)}
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
        ) : (
          "No Recording"
        ),
    },
  ];

  // const getData = async (tempFilters) => {
  //   try {
  //     dispatch(ShowLoading());
  //     const response = await getAllReports(tempFilters);
  //     if (response.success) {
  //       setReportsData(response.data);
  //     } else {
  //       message.error(response.message);
  //     }
  //     dispatch(HideLoading());
  //   } catch (error) {
  //     dispatch(HideLoading());
  //     message.error(error.message);
  //   }
  // };

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        // Filter out duplicates
        const uniqueReports = response.data.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.user._id === value.user._id && t.exam._id === value.exam._id
            )
        );
        setReportsData(uniqueReports);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  

  const openVideoModal = (url) => {
    setVideoUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVideoUrl("");
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF("landscape"); // Use landscape orientation
      // Define table headers and their custom widths
      const tableColumn = [
        { header: "Exam Name", dataKey: "examName" },
        { header: "User Name", dataKey: "userName" },
        { header: "Email", dataKey: "email" },
        { header: "Contact", dataKey: "contact" },
        { header: "Date", dataKey: "date" },
        { header: "Total Marks", dataKey: "totalMarks" },
        { header: "Passing Marks", dataKey: "passingMarks" },
        { header: "Obtained Marks", dataKey: "obtainedMarks" },
        { header: "Result", dataKey: "result" },
        { header: "Recording", dataKey: "recording" },
      ];
      // Map the data to match the table columns
      const tableRows = reportsData.map((record) => ({
        examName: record.exam?.name || "N/A",
        userName: record.user?.name || "N/A",
        email: record.user?.email || "N/A",
        contact: record.user?.mobile || "N/A",
        date: record.createdAt
          ? moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")
          : "N/A",
        totalMarks: record.exam?.totalMarks || "N/A",
        passingMarks: record.exam?.passingMarks || "N/A",
        obtainedMarks: record.result?.correctAnswers?.length || 0,
        result: record.result?.verdict || "N/A",
        recording: record.recording?.fileUrl || "No Recording",
      }));
  
      // Customize table layout and styles
      doc.autoTable({
        columns: tableColumn, // Use column definitions with data keys
        body: tableRows,
        startY: 20, // Start below the top margin
        styles: {
          fontSize: 10, // Adjust font size for table content
          cellPadding: 3, // Add padding for better spacing
          overflow: "linebreak", // Enable text wrapping
        },
        headStyles: {
          fillColor: [41, 128, 185], // Header background color (blue)
          textColor: [255, 255, 255], // Header text color (white)
          fontSize: 11, // Adjust header font size
          halign: "center", // Center-align header text
        },
        columnStyles: {
          examName: { cellWidth: 30 },
          userName: { cellWidth: 30 },
          email: { cellWidth: 50 },
          contact: { cellWidth: 30 },
          date: { cellWidth: 40 },
          totalMarks: { cellWidth: 25 },
          passingMarks: { cellWidth: 25 },
          obtainedMarks: { cellWidth: 30 },
          result: { cellWidth: 20 },
          recording: { cellWidth: 50 }, // Wider for URLs
        },
      });
      // Save the PDF file
      doc.save("reports.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error.message);
    }
  };
  
  const exportXLS = () => {
    const ws = XLSX.utils.json_to_sheet(

      reportsData.map((record) => ({
        "Exam Name": record.exam.name,
        "User Name": record.user.name,
        Contact: record.user.mobile,
        Date: moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
        "Total Marks": record.exam.totalMarks,
        "Passing Marks": record.exam.passingMarks,
        "Obtained Marks": record.result.correctAnswers.length,
        Verdict: record.result.verdict,
        "Recording URL": record.recording ? record.recording.fileUrl : "No Recording",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "reports.xlsx");
  };


  useEffect(() => {
    getData(filters);
  }, []);


  console.log("useEffect triggered with filters:", filters);
  return (
    <div>
      <PageTitle title="Reports" />
      <div className="gap-2 flex">
        <button className="primary-contained-btn" onClick={exportPDF}>h
          Export PDF
        </button>
        <button className="primary-contained-btn" onClick={exportXLS}>
          Export XLS
        </button>
      </div>
      <div className="divider"></div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button
          className="primary-contained-btn"
          onClick={() => getData(filters)}
        >
          Search
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={reportsData}
        className="mt-2"
        scroll={{ x: 800 }}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          content: {
            width: "600px",
            height: "400px",
            margin: "auto",
            padding: "20px",
          },
        }}
      >
        <ReactPlayer url={videoUrl} controls width="100%" height="300px" />
        <div className="flex justify-between mt-4">
          <a href={videoUrl} download className="download-link">
            <FaDownload />
          </a>
          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminReports;
