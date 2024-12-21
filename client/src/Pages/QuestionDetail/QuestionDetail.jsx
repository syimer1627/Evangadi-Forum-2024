import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import "./QuestionDetail.css";
import { useNavigate } from "react-router-dom";
function QuestionDetail({ question }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (question?.questionid) {
      navigate(`/question/${question.questionid}`);
    } else {
      console.error("No question ID available for navigation.");
    }
  };

  return (
    <div className="header_question" onClick={handleClick}>
      <div className="question_user">
        <CgProfile className="profile" color="gray" />
        <div className="username">{question?.username}</div>
      </div>

      <div className="question_title">
        <div className="question_content">{question?.title}</div>
        <div className="question_arrow">
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
