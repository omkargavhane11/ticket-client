import "./queriesPage.css";
import QueryBox from "../../components/queryBox/QueryBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Topbar from "../../components/topbar/Topbar";
import { API_URL } from "../../constant"

const QueriesPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);
  const [queriesData, setQueriesData] = useState([]);

  async function getQueryData() {
    try {
      if (user?.role === "mentor") {
        const { data } = await axios.get(
          `${API_URL}/api/query/mentor/${user._id}`
        );
        setQueriesData(data);
      } else {
        const queries = await axios.get(
          `${API_URL}/api/query/student/${user._id}`
        );
        setQueriesData(queries.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (user !== null) {
      getQueryData();
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="queriesPage">
      <Topbar />
      <div className="queriesPage_middle">
        {user?.role === "student" ? (
          <button
            className="createQueryBtn"
            onClick={() => navigate("/create")}
          >
            + Create Query
          </button>
        ) : (
          <button
            className="createQueryBtn"
            onClick={() => navigate("/pick_new_query")}
          >
            Pick New Queries
          </button>
        )}
        <div className="dashboard">
          <acronym title="Unassigned">U:</acronym> {queriesData.filter((q) => q.status === "unassigned").length} | <acronym title="Assigned">A:</acronym>{" "}
          {queriesData.filter((q) => q.status === "assigned").length} | <acronym title="Completed">C:</acronym>{" "}
          {queriesData.filter((q) => q.status === "closed").length}
        </div>
      </div>
      <div className="queriesPage_bottom">
        <div className="queriesPage_bottom_left">
          {queriesData.length > 0 ? (
            <div className="queryMapper">
              {queriesData?.map((data) => (
                <QueryBox key={data._id} query={data} />
              ))}
            </div>
          ) : (
            <h1 className="noQuery">No queries to display</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;
