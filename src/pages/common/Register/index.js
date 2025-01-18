import { Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Logo from "../../../img/logo.png";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  // Fetch exams (if required for other purposes)
  const fetchExams = async () => {
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

  useEffect(() => {
    fetchExams();
  }, []);

  // Submit form handler
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen register">
      <div className="w-400 p-3 formLogin">
        <div className="logoImages">
          <img
            src={Logo}
            alt="Logo"
            style={{ height: "75px", margin: "3px 58px" }}
          />
        </div>
        <div className="flex flex-col mt-4">
          <h1 className="text-2xl">
            REGISTER <i className="ri-user-add-line"></i>
          </h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            
            {/* Name Field */}
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input type="text" placeholder="Enter your name" />
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>

            {/* Mobile No Field */}
            <Form.Item
              name="mobile"
              label="Mobile No"
              rules={[
                { required: true, message: "Please enter your mobile number!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number!",
                },
              ]}
            >
              <Input type="text" placeholder="Enter your mobile number" />
            </Form.Item>

            {/* Gender Field */}
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select your gender!" }]}
            >
              <Select placeholder="Select gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            {/* Exam Fields */}
            <Form.Item
              name="examId"
              label="Select Exam"
              rules={[{ required: true }]}
            >
              <select>
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {/* Submit Button and Login Link */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="primary-contained-btn mt-2 w-100"
              >
                Register
              </button>
              <Link to="/login">Already a member? Login</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;



