import React, { useContext, useEffect, useState } from "react";
import "./Answer.css";
import { BsPersonCircle } from "react-icons/bs";
import styles from "../Question/AskQuestions.module.css";
import Layout from "../../Components/Layout/Layout";
import {  Link, useParams } from "react-router-dom";
import { AppState } from "../../Router";
import axiosBase from "../../axiosConfig";
function Answer() {
  const { questionid } = useParams(); 
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");
  const { user } = useContext(AppState);

  // Create header token object
  const headerToken = { Authorization: `Bearer ${token}` };

  // Fetch question data
  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await axiosBase.get(`questions/${questionid}`, {
          headers: headerToken,
        });

        // Set the retrieved question data
        setData(response.data.question || {});
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching question: ", err);
        setError("Failed to fetch question data.");
        setIsLoading(false);
      }
    };

    fetchQuestionData();
  }, [questionid, headerToken]);

  // Fetch answers for the question
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axiosBase.get(`/answers/${questionid}`, {
          headers: headerToken,
        });
        setAnswers(response.data.answers || []);
      } catch (err) {
        console.error("Error fetching answers: ", err);
        setError("Failed to fetch answers.");
      }
    };

    fetchAnswers();
  }, [questionid, headerToken]);

  // Submit a new answer
  const submitAnswer = async (e) => {
    e.preventDefault();
    if (newAnswer.trim()) {
      try {
        const response = await axiosBase.post(
          `/answers/`,
          {
            userid: user?.userid,
            questionid: questionid,
            answer: newAnswer,
          },
          {
            headers: headerToken,
          }
        );

        const postedAnswer = response.data; 
        setAnswers((prevAnswers) => [...prevAnswers, postedAnswer]);
        setNewAnswer(""); 
      } catch (error) {
        console.error("Error posting answer: ", error);
        setError("Failed to post the answer. Please try again.");
      }
    }
  };
  return (
    <Layout>
      <div className="answer_container">
        <div className="answer_wrapper">
          <div className="answer_header">
            <span>Question</span>
          </div>
          <div className="answer_question">
            <h3>{data?.title}</h3>
          </div>
          <p>{data?.description} </p>

          <h2 className="answer_community">Answer From The Community</h2>
          {isLoading ? (
            <p>Loading answers...</p>
          ) : answers.length > 0 ? (
            answers.map((answer) => (
              <div>
                <div key={answer.id} className="Answer">
                  <div className="answer_prof_pic">
                    <div>
                      <BsPersonCircle size={70} color="gray" />
                    </div>
                    {answer?.username}
                  </div>
                  <div>{answer?.answer}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No answers available.</p>
          )}

          <div className={styles.question_form}>
            <h4 className={styles.question_post_your}>Ask The Top Question</h4>
            <h4>
              <Link className={styles.question_post_link} to="/">
                Go to Question Page
              </Link>
            </h4>
            <form onSubmit={submitAnswer}>
              <textarea
                rows={4}
                className={styles.question_description}
                placeholder="Your answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                required
              />
              <span>
                <button className={styles.question_button} type="submit">
                  Post Your Answer
                </button>
              </span>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Answer;

