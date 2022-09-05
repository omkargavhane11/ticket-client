// import QueryBox from "../../components/queryBox/QueryBox";
import "./singleQueryPage.css";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/message/Message";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Topbar from "../../components/topbar/Topbar";
import { useRef } from "react";
import { io } from "socket.io-client";

const SingleQueryPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);
  const { queryNo } = useParams();
  const socket = useRef();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [inputMsg, setInputMsg] = useState("");
  const [feedback, setFeedback] = useState("");
  const [queryDetail, setQueryDetail] = useState("");

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        queryId: data.queryId,
        message: data.message,
        createdAt: Date.now(),
        _id: Math.random().toString(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current?.emit("addUser", user._id);
    socket.current?.on("getUsers", (users) => {
      // console.log(users);
    });
  }, [queryNo]);

  useEffect(() => {
    arrivalMessage &&
      arrivalMessage.queryId === queryNo &&
      setMessages([...messages, arrivalMessage]);
  }, [arrivalMessage, queryNo]);

  // ▫▫🚀🚀
  const sendMessage = async () => {
    // socket
    socket.current.emit("sendMessage", {
      senderId: user._id,
      recieverId:
        user.role !== "mentor" ? queryDetail.assignedTo : queryDetail.createdBy,
      queryId: queryNo,
      message: inputMsg,
    });

    // to db
    const payload = {
      senderId: user._id,
      queryId: queryNo,
      message: inputMsg,
    };

    if (inputMsg !== null || inputMsg !== "") {
      const sendMsg = await axios.post(
        "http://localhost:8080/api/messages",
        payload
      );

      setMessages([
        ...messages,
        {
          senderId: user._id,
          queryId: queryNo,
          message: inputMsg,
          createdAt: Date.now(),
          _id: Math.random().toString(),
        },
      ]);
      setInputMsg("");
    } else {
      alert("enter something to send msg");
    }
  };

  async function getData() {
    // get query conversation
    const { data } = await axios.get(
      `http://localhost:8080/api/messages/${queryNo}`
    );
    setMessages(data);

    // get query details
    const queryDetail = await axios.get(
      `http://localhost:8080/api/query/single/${queryNo}`
    );
    setQueryDetail(queryDetail.data);
  }

  useEffect(() => {
    if (user !== null) {
      getData();
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  const closeQuery = async () => {
    const studentPayload = {
      feedback,
      status: "closed",
    };

    const mentorPayload = {
      closedByMentor: true,
      solution: feedback,
    };

    if (feedback !== (null || "")) {
      if (user.role === "student") {
        const { data } = await axios.put(
          `http://localhost:8080/api/query/update/${queryNo}`,
          studentPayload
        );
        console.log(data);
      } else {
        const { data } = await axios.put(
          `http://localhost:8080/api/query/update/${queryNo}`,
          mentorPayload
        );
        console.log(data);
      }
      setFeedback("");
      setOpen(false);
    } else {
      alert("enter feedback to submit");
    }
  };

  return (
    <div className="singleQueryPage">
      {open && (
        <div className="modal">
          <div className="modalWrapper">
            <div className="modal_top">Appeal this query as solved?</div>
            <div className="modal_middle">
              <span className="text">
                {user.role === "mentor"
                  ? "Enter your solution to appeal this query as solved."
                  : "Enter your feedback to appeal this query as solved."}
              </span>
              <div className="solution">
                <div className="solution_label">
                  {user.role === "mentor" ? "Solution" : "Feedback"}
                </div>
                <textarea
                  className="solutionInput"
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal_bottom">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={closeQuery}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      <Topbar />
      <div className="queriesPage_middle">
        <button className="createQueryBtn" onClick={() => navigate("/queries")}>
          Back
        </button>
        {user.role === "mentor" && !queryDetail.closedByMentor && (
          <button className="createQueryBtn" onClick={() => setOpen(true)}>
            Close query
          </button>
        )}
      </div>
      <div className="queriesPage_bottom">
        <div className="queriesPage_bottom_left">
          <div className="statusUpdate">
            {queryDetail.status === "assigned" && user.role !== "mentor" && (
              <div className="updateButton" onClick={() => setOpen(true)}>
                Appeal Solved
              </div>
            )}
            {queryDetail.status === "unassigned" && user.role !== "mentor" && (
              <div className="updateButton" onClick={() => setOpen(true)}>
                Appeal Solved
              </div>
            )}
            {queryDetail.closedByMentor && (
              <div className="closedQueryBtn">Closed by mentor</div>
            )}
            {queryDetail.status === "closed" && (
              <div className="closedQueryBtn">Closed</div>
            )}
          </div>
          <div className="messageMapper">
            {messages.map((msg) => (
              <div ref={scrollRef} key={msg._id}>
                <Message
                  self={msg.senderId === user._id}
                  msg={msg}
                  key={msg._id}
                />
              </div>
            ))}
          </div>
          {queryDetail.status === "assigned" && !queryDetail.closedByMentor && (
            <div className="messageInputBox">
              <input
                className="msg_input"
                placeholder="Enter your message..."
                onChange={(e) => setInputMsg(e.target.value)}
                value={inputMsg}
              />
              <button className="msg_send" onClick={sendMessage}>
                Send
              </button>
            </div>
          )}
        </div>
        <div className="queriesPage_bottom_right">
          <div className="queriesPage_bottom_right_top">
            <div className="querie_desc_top">
              <div className="q_desc_top_left">
                <div className="queryNo">{queryDetail._id}</div>
                <div className="queryTitle">{queryDetail.queryTitle}</div>
              </div>
              <div className={queryDetail.status}>{queryDetail.status}</div>
            </div>
            <hr />
            <div className="q_desc_bottom_top">
              <div className="createdAt">
                <div className="createdAt_key">Created at:</div>
                <div className="createdAt_value">{queryDetail.createdAt}</div>
              </div>
              <div className="assignedTo">
                <div className="assignedTo_key">Assigned to:</div>
                <div className="assignedTo_value">{queryDetail.assignedTo}</div>
              </div>
            </div>
            <div className="description">
              <div className="description_key">Description:</div>
              <div className="description_value">
                {queryDetail.queryDescription}
              </div>
            </div>
          </div>
          {/* <button>Go to Query</button> */}
          {queryDetail.status === "closed" && (
            <div className="queriesPage_bottom_right_bottom">
              <div className="feedback">
                <div className="mentor_Solution_key">Solution by Mentor</div>
                <div className="mentor_Solution_value">
                  Check the solution on documentaion of redux.
                </div>
                <hr />
                <div className="student_feedback_key">Your Feedback</div>
                <div className="student_feedback_value">
                  Got the required solution
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleQueryPage;
