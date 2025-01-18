import { Form, Input, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Logo from "../../../img/logo.png";

function Login() {
  const dispatch = useDispatch();

  // Submit handler for form
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen resgister">
      <div className="w-400 p-3 formLogin">
        <div className="logoImages">
          <img
            src={Logo}
            alt="Logo"
            className=""
            style={{ height: "75px", margin: "2px 80px" }}
          />
        </div>

        <div className="flex flex-col mt-4">
          <div className="flex">
            <h1 className="text-2xl">
              LOGIN <i className="ri-login-circle-line"></i>
            </h1>
          </div>
          <div className="divider"></div>
          <Form
            layout="vertical"
            className="mt-2"
            onFinish={onFinish}
            initialValues={{
              email: "",
              password: "",
            }}
          >
            {/* Email Input */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
            >
              <Input type="text" placeholder="Enter your email" />
            </Form.Item>

            {/* Password Input */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {/* Submit Button and Register Link */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="primary-contained-btn mt-2 w-100"
              >
                Login
              </button>
              <Link to="/register" className="underline">
                Not a member? Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
