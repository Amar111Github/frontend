import { message, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Exam Name",
      
      dataIndex: "name"
    },
    {
      title: "Duration",
      dataIndex: "duration"
    },
    {
      title: "Category",
      dataIndex: "category"
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks"
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks"
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      )
    }
  ];
  useEffect(() => {
    getExamsData();
  }, []);
  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />

        <button
          className="primary-outlined-btn flex items-center"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line"></i>
          Add Exam
        </button>
      </div>
      <div className="divider"></div>

      {/* <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Total Marks</th>
              <th>Passing Marks</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((report) => (
              <tr key={report._id}>
                <td>{report.exam.name}</td>
               
                <td>{report.exam.totalMarks}</td>
                <td>{report.exam.passingMarks}</td>
                <td>{report.result.correctAnswers.length}</td>
                <td>{report.result.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* <Table columns={columns} dataSource={exams} /> */}
      <Table
        columns={columns}
        dataSource={exams}
        rowKey="_id"
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
}

export default Exams;
