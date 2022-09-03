import "./createQueryPage.css";
import QueryForm from "../../components/queryForm/QueryForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const CreateQueryPage = () => {
  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  return (
    <div>
      <QueryForm />
    </div>
  );
};

export default CreateQueryPage;
