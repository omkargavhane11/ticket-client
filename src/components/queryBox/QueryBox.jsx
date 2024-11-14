import "./queryBox.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { API_URL } from "../../constant"

const QueryBox = ({ query }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);

  const pickQuery = async () => {
    const payload = {
      mentorId: user._id,
      queryId: query._id,
    };
    try {
      const pick = await axios.put(
        `${API_URL}/api/query/pick`,
        payload
      );
      toast({
        title: "Query Assigned",
        description: `${pick.data.queryNo} has been assigned to you successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="queryBox">
      <div className="queryBox_top">
        <div className="queryBox_top_left">
          <div className="queryNo">#{query.queryNo}</div>
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
