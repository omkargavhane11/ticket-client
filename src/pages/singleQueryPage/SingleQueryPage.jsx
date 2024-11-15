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
import Moment from "react-moment";
import { API_URL } from "../../constant"

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
    socket.current = io("https://myticket77-socket.herokuapp.com");

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

  const sendMessage = async () => {
    // to db
    const payload = {
      senderId: user._id,
      queryId: queryNo,
      message: inputMsg,
    };

    if (inputMsg !== null || inputMsg !== "") {
      const sendMsg = await axios.post(
        `${API_URL}/api/messages`,
        payload
      );

      // socket 🚀🚀
      socket.current.emit("sendMessage", {
        senderId: user._id,
        recieverId:
          user.role !== "mentor"
            ? queryDetail.assignedTo
            : queryDetail.createdBy,
        queryId: queryNo,
        message: inputMsg,
      });

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
      `${API_URL}/api/messages/${queryNo}`
    );
    setMessages(data);

    // get query details
    const queryDetail = await axios.get(
      `${API_URL}/api/query/single/${queryNo}`
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
          `${API_URL}/api/query/update/${queryNo}`,
          studentPayload
        );
      } else {
        const { data } = await axios.put(
          `${API_URL}/api/query/update/${queryNo}`,
          mentorPayload
        );
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
          {queryDetail.status !== "unassigned" ? (
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
          ) : (
            <div className="messageMapper">
              <h2 className="chatNotAvailable">Query is not assigned yet !</h2>
            </div>
          )}
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
                <div className="queryNo">#{queryDetail.queryNo}</div>
                <div className="queryTitle">{queryDetail.queryTitle}</div>
              </div>
              <div className={queryDetail.status}>{queryDetail.status}</div>
            </div>
            <hr />
            <div className="q_desc_bottom_top">
              <div className="createdAt">
                <div className="createdAt_key">Created at:</div>
                <Moment
                  format="DD/MM/YYYY,  HH:MM:SS"
                  className="createdAt_value"
                >
                  {queryDetail.createdAt}
                </Moment>
              </div>
              <div className="assignedTo">
                <div className="assignedTo_key">Assigned to:</div>
                <div className="assignedTo_value">
                  {queryDetail?.assignedTo?._id === user?._id ? "You" : queryDetail?.assignedTo?.name ?? "-"}
                </div>
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
                <div className="mentor_Solution_key">Solution by Mentor {user.role === "mentor" ? " (You)" : ""}</div>
                <div className="mentor_Solution_value">
                  {queryDetail.solution === "" ? " - " : queryDetail.solution}
                </div>
                <hr style={{ marginTop: "1rem" }} />
                <div className="student_feedback_key">Student Feedback {user.role === "student" ? " (You)" : ""}</div>
                <div className="student_feedback_value">
                  {queryDetail.feedback}
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
