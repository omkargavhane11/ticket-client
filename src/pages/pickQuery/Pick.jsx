import "./pick.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QueryBox from "../../components/queryBox/QueryBox";
import Topbar from "../../components/topbar/Topbar";
import { useSelector } from "react-redux";

const Pick = () => {
  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
  const [queriesData, setQueriesData] = useState([]);

  async function getQueryData() {
    try {
      if (user.role === "mentor") {
        const { data } = await axios.get(
          `https://myticket77.herokuapp.com/api/query`
        );
        let unAssignedQueries = data.filter((query) => {
          return query.status === "unassigned";
        });
        setQueriesData(unAssignedQueries);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getQueryData();
  }, []);
  return (
    <div className="queriesPage">
      <Topbar />
      <div className="queriesPage_middle">
        <button className="createQueryBtn" onClick={() => navigate("/queries")}>
          Queries
        </button>
      </div>
      <div className="query_display_pick">
        <div className="queryMapper">
          {queriesData?.map((data) => (
            <QueryBox key={data._id} query={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pick;
