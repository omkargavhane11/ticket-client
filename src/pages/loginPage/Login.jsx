import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/user";
import { useToast } from "@chakra-ui/react";
import { CircularProgress } from "@mui/material";
import { API_URL } from "../../constant"

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [isPass, setIsPass] = useState(false);

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };

    if (email === "" || password === "") {
      toast({
        title: "Error.",
        description: "Please fill all fields to login",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else {
      try {
        dispatch(loginStart);
        setLoading(true);
        const { data } = await axios.post(
          `${API_URL}/api/authentication/login`,
          payload
        );

        if (data.msg === "success") {
          setLoading(false);
          dispatch(loginSuccess(data.user));
          navigate("/queries");
        } else {
          // alert("Invalid credentials");
          dispatch(loginFailure);
          setLoading(false);
          toast({
            title: "Error.",
            description: "Invalid credentials.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      } catch (error) {
        console.log(error.message);
      }
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
            className="login_input"
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type={!isPass ? "password" : "text"}
            id="password"
            name="password"
            placeholder="pass@123"
            onChange={(e) => setPassword(e.target.value)}
            className="login_input"
          />
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            name="showpassword"
            id="showpassword"
            onChange={(e) => setIsPass(!isPass)}
          />
          <label htmlFor="showpassword" className="checkbox_show">
            Show Password
          </label>
        </div>
        <button
          className="loginBtn loginBox_btn"
          onClick={handleLogin}
          disabled={loading}
          id="login_btn"
        >
          {loading === true ? (
            <CircularProgress color="inherit" className="login_loader" />
          ) : (
            "Login"
          )}
        </button>
        <button
          className="signupBtn loginBox_btn"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
