import "./signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { CircularProgress } from "@mui/material";

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isPass, setIsPass] = useState(false);

  const handleSignup = async () => {
    const payload = {
      name,
      email,
      password,
      contactNo: contact,
    };

    if (email === "" || password === "" || name === "" || contact === "") {
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
        setLoading(true);
        const { data } = await axios.post(
          "https://myticket77.herokuapp.com/api/user/register",
          payload
        );

        if (data.msg === "User created successfully") {
          setLoading(false);
          navigate("/");
          toast({
            title: "Sign up Successfull.",
            description: "Please Login to your account",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          setLoading(false);
          toast({
            title: "Error.",
            description: "Sign up failed.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    }
  };

  return (
    <div className="login">
      <div className="login_wrapper">
        <div className="input">
          <label htmlFor="name">Name</label>
          <input
            type="name"
            id="name"
            name="name"
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type={!isPass ? "password" : "text"}
            id="password"
            name="password"
            placeholder="john@123"
            onChange={(e) => setPassword(e.target.value)}
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
        <div className="input">
          <label htmlFor="contact">Contact</label>
          <input
            type="number"
            id="contact"
            name="contact"
            placeholder="9191919191"
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <button
          className="signupBtn loginBox_btn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress color="inherit" className="login_loader" />
          ) : (
            "Sign up"
          )}
        </button>
        <button
          className="loginBtn loginBox_btn"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
