import "./queryForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Topbar from "../topbar/Topbar";
import { useToast } from "@chakra-ui/react";

const QueryForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);
  const [category, setCategory] = useState(null);
  const [language, setLanguage] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [fromData, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  console.log(window.location.pathname);

  const handleCategoryChange = () => {
    const options = document.getElementsByClassName("topic_category_value");
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        setCategory(options[i].value);
      }
    }
  };

  const handleLanguageChange = () => {
    const options = document.getElementsByClassName("topic_language_value");
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        setLanguage(options[i].value);
      }
    }
  };

  const createQuery = async () => {
    const getCount = await axios.get(
      "https://ticket-api-production-610a.up.railway.app/api/query"
    );

    const queryInfo = {
      createdBy: user._id,
      category: category,
      preferredLanguage: language,
      queryTitle: title,
      queryDescription: description,
      preferredTimeFrom: fromData,
      preferredTimeTo: toDate,
      queryNo: "QN" + (1000 + getCount.data.length),
    };

    try {
      if (
        (category || language || title || description || fromData || toDate) ===
        null
      ) {
        // alert("Please fill all details");
        toast({
          title: "Error.",
          description: "Please fill all details to create query",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        const newQuery = await axios.post(
          "https://ticket-api-production-610a.up.railway.app/api/query",
          queryInfo
        );
        console.log(newQuery);
        toast({
          title: "Query created.",
          // description: "We've created your account for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        navigate("/queries");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="queryForm">
      <Topbar />
      <div className="queriesPage_middle">
        <button className="createQueryBtn" onClick={() => navigate("/queries")}>
          Back
        </button>
      </div>
      <div className="createQuery">
        <div className="form">
          <div className="formWrapper">
            {/* topic */}
            {/* <div className="topic"> */}
            <div className="fieldHeading">Topic</div>
            <div className="fieldWrapper">
              <div className="topic_category_label">Category</div>
              <select
                name="topic_category"
                id="topic_category"
                onChange={handleCategoryChange}
              >
                <option value="" className="topic_category_value">
                  -- Select Category --
                </option>
                <option value="React" className="topic_category_value">
                  React
                </option>
                <option value="Javascript" className="topic_category_value">
                  Javascript
                </option>
                <option value="MongoDB" className="topic_category_value">
                  MongoDB
                </option>
                <option value="HTML" className="topic_category_value">
                  HTML
                </option>
                <option value="CSS" className="topic_category_value">
                  CSS
                </option>
              </select>

              <div className="topic_category_label language_input_select">
                Preferred Voice Communication Language
              </div>
              <select
                name="topic_language"
                id="topic_language"
                onChange={handleLanguageChange}
              >
                <option value="" className="topic_language_value">
                  -- Select Category --
                </option>
                <option value="English" className="topic_language_value">
                  English
                </option>
                <option value="Hindi" className="topic_language_value">
                  Hindi
                </option>
                <option value="Tamil" className="topic_language_value">
                  Tamil
                </option>
              </select>
            </div>
            {/* </div> */}

            {/* details */}
            {/* <div className="details"> */}
            <div className="feildHeading">Details</div>
            <div className="fieldWrapper">
              <div className="titleLabel">Query Title</div>
              <input
                type="text"
                className="titleValue"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="queryDescription">Query Description</div>
              <textarea
                className="descriptionValue"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            {/* </div> */}

            {/* time */}
            {/* <div className="time"> */}
            <div className="fieldHeading">
              Your available Time ? ( Ours : 9:00 AM - 7:00 PM )
            </div>
            <div className="fieldWrapper">
              <div className="fromTime">
                <div className="fromTimeLabel">From</div>
                <input
                  type="time"
                  className="fromTimeInput"
                  min="09:00"
                  max="19:00"
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </div>
              <div className="toTime">
                <div className="toTimeLabel">To</div>
                <input
                  type="time"
                  className="toTimeInput"
                  min="09:00"
                  max="19:00"
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            {/* </div> */}

            {/* bottom_buttons */}
            <div className="submit">
              <button
                className="cancel_btn"
                onClick={() => navigate("/queries")}
              >
                Cancel
              </button>
              <button className="create_btn" onClick={createQuery}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryForm;
