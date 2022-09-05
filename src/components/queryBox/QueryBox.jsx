import "./queryBox.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const QueryBox = ({ query }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);

  const pickQuery = async () => {
    const payload = {
      mentorId: user._id,
      queryId: query._id,
    };
    try {
      const pick = await axios.put(
        "https://myticket77.herokuapp.com/api/query/pick",
        payload
      );
      console.log(pick.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="queryBox">
      <div className="queryBox_top">
        <div className="queryBox_top_left">
          <div className="queryNo">{query._id}</div>
          <div className="queryCategory">{query.category}</div>
        </div>
        <div className="queryBox_top_right">
          <div className={query.status}>{query.status}</div>
        </div>
      </div>
      <div className="queryBox_bottom_desc">
        <div className="queryTitle">Title - {query.queryTitle}</div>
        {/* <div className="createdAtBox">{query.createdAt}</div> */}
      </div>
      <div className="queryDescription_box">
        Desc - {query.queryDescription}
      </div>
      <div className="extra_buttons">
        <button
          className="pick_btn"
          onClick={() => navigate(`/query/${query._id}`)}
        >
          Go to query
        </button>
        {user.role === "mentor" && query.status === "unassigned" && (
          <button className="pick_btn" onClick={pickQuery}>
            Pick Query
          </button>
        )}
      </div>
    </div>
  );
};

export default QueryBox;
