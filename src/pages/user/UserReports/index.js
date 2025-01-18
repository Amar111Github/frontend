import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";
import axios from "axios";

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();

  console.log(reportsData);
  
  const getData = async () => {
    try {
        dispatch(ShowLoading());
        const response = await getAllReportsByUser();

        if (response.success) {
            // Filter duplicates based on unique report ID
            const uniqueReports = Array.from(new Set(response.data.map(report => report._id)))
                .map(id => response.data.find(report => report._id === id));

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

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Exam Name</th>
              {/* <th>Date</th> */}
              <th>Total Marks</th>
              <th>Passing Marks</th>
              <th>Obtained Marks</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {reportsData.map((report) => (
              <tr key={report._id}>
                <td>{report.exam.name}</td>
                {/* <td>
                  {moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss")}
                </td> */}
                <td>{report.exam.totalMarks}</td>
                <td>{report.exam.passingMarks}</td>
                <td>{report.result.correctAnswers.length}</td>
                <td>{report.result.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserReports;


