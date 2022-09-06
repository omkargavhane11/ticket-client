import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/user";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state);

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
        const { data } = await axios.post(
          "https://myticket77.herokuapp.com/api/authentication/login",
          payload
        );

        if (data.msg === "success") {
          dispatch(loginSuccess(data.user));
          navigate("/queries");
        } else {
          // alert("Invalid credentials");
          dispatch(loginFailure);
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
          {user.isFetching === true ? (
            <CircularProgress className="circular_progress" />
          ) : (
            "Login"
          )}
        </button>
        <button className="signupBtn loginBox_btn">Sign up</button>
      </div>
    </div>
  );
};

export default Login;
