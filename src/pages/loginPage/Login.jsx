import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess } from "../../redux/user";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };

    try {
      dispatch(loginStart);
      const { data } = await axios.post(
        "http://localhost:8080/api/authentication/login",
        payload
      );

      if (data.msg === "success") {
        dispatch(loginSuccess(data.user));
        navigate("/queries");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="login">
      <div className="login_wrapper">
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="someone@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="pass@123"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="loginBtn loginBox_btn" onClick={handleLogin}>
          Login
        </button>
        <button className="signupBtn loginBox_btn">Sign up</button>
      </div>
    </div>
  );
};

export default Login;
