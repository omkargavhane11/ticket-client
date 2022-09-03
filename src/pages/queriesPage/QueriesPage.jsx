import "./queriesPage.css";
import QueryBox from "../../components/queryBox/QueryBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Topbar from "../../components/topbar/Topbar";

const QueriesPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);
  const [queriesData, setQueriesData] = useState([]);

  async function getQueryData() {
    try {
      if (user.role === "mentor") {
        const { data } = await axios.get(
          `http://localhost:8080/api/query/mentor/${user._id}`
        );
        setQueriesData(data);
      } else {
        const queries = await axios.get(
          `http://localhost:8080/api/query/student/${user._id}`
        );
        setQueriesData(queries.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      getQueryData();
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="queriesPage">
      <Topbar />
      <div className="queriesPage_middle">
        {user.role === "student" ? (
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
      </div>
      <div className="queriesPage_bottom">
        <div className="queriesPage_bottom_left">
          <div className="queryMapper">
            {queriesData?.map((data) => (
              <QueryBox key={data._id} query={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;
