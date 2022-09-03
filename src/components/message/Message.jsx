import "./message.css";

const Message = ({ self, msg }) => {
  return (
    <div className={self ? "messageOwn" : "message"}>
      <div className="messageWrapper_content">
        <div className="msg_body">{msg.message}</div>
        {/* <div className="msg_timeStamp">20/08/2022, 09:42 PM</div> */}
      </div>
    </div>
  );
};

export default Message;
