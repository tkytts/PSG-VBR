import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import {
  onStatusUpdate,
  offStatusUpdate,
  onReceiveMessage,
  offReceiveMessage,
  setMaxTime,
  setChimes,
  setConfederate,
  tutorialProblem,
  startTimer,
  stopTimer,
  typing,
  sendMessage,
  setAnswer,
  setGameResolution,
  resetPoints,
  clearChat,
  tutorialDone
} from "../realtime/game";
import { RESOLUTION_TYPES } from "../constants/resolutionTypes";
import ChatBox from "../components/ChatBox";
import GameBox from "../components/GameBox";
import Modal from "../components/Modal";
import InputModal from "../components/InputModal";

function Tutorial() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageInputStyle, setMessageInputStyle] = useState(null);
  const [numTries, setNumTries] = useState(1);
  const currentUserRef = useRef("");
  const messageRef = useRef(null);
  const sendButtonRef = useRef(null);
  const chatRef = useRef(null);
  const confederateNameRef = useRef(null);
  const activityRef = useRef(null);
  const gamesRef = useRef(null);
  const timerRef = useRef(null);
  const pointsRef = useRef(null);
  const teamAnswerRef = useRef(null);
  const readyButtonRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    currentUserRef.current = currentUser;

    const handleStatus = (isLive) => {
      if (isLive) {
        navigate("/participant");
      }
    };

    onStatusUpdate(handleStatus);

    return () => {
      offStatusUpdate(handleStatus);
    };
  }, [currentUser, navigate]);

  const handleTutorialStep1 = () => {
    setCurrentUser(t("your_name"));
    setUsernameSet(true);
    setMaxTime(90);
    setTutorialStep(1);

    setChimes({
      messageSent: true,
      messageReceived: true,
      timer: true
    });
  };

  const handleSimulation1 = () => {
    const simulationConfederate = t("tutorial_confederate_1");
    setTutorialStep(11);
    setConfederate(simulationConfederate);
    setCurrentUser(t("tutorial_participant_1"));
    tutorialProblem({ block: { Name: "T_1" }, problem: "1" });

    setTimeout(() => {
      readyButtonRef.current.classList.add("click-animation");

      setTimeout(() => {
        readyButtonRef.current.classList.remove("click-animation");
        setTimeout(() => {
          setTutorialStep(12);
        }, 200);

        startTimer();

        setTimeout(() => {
          typing(simulationConfederate);
          setTimeout(() => {
            sendMessage({
              user: simulationConfederate,
              text: t("what_do_you_think"),
              timeStamp: new Date().toISOString()
            });
            stopTimer();
            setTimeout(() => {
              setTutorialStep(13);
            }, 2000);
          }, 1000);
        }, 2800);
      }, 500);
    }, 2000);
  };

  const handleTutorialStep13 = () => {
    const simulationConfederate = t("tutorial_confederate_1");
    setMaxTime(70);
    startTimer();
    setTutorialStep(14);
    handleTutorialMessage(t("the_answer_is_triangle"));

    setTimeout(() => {
      typing(simulationConfederate);
      setMaxTime(33);
      startTimer();
      setTimeout(() => {
        sendMessage({
          user: simulationConfederate,
          text: t("yes_i_think_you_are_right"),
          timeStamp: new Date().toISOString()
        });

        setTimeout(() => {
          setAnswer(t("triangle"));
          setGameResolution({ gameResolutionType: RESOLUTION_TYPES.AP, teamAnswer: t("triangle") });
          setMaxTime(11);
          startTimer();

          setTimeout(() => {
            setTutorialStep(15);
          }, 25000);
        }, 3000);
      }, 3000);
    }, 5000);
  };

  const handleSimulation2 = () => {
    setAnswer("");
    resetPoints();
    clearChat();
    setMaxTime(90);
    const simulationConfederate = t("tutorial_confederate_2");
    setTutorialStep(16);
    setConfederate(simulationConfederate);
    setCurrentUser(t("tutorial_participant_2"));
    tutorialProblem({ block: { Name: "T_1" }, Problem: "2" });

    setTimeout(() => {
      readyButtonRef.current.classList.add("click-animation");

      setTimeout(() => {
        readyButtonRef.current.classList.remove("click-animation");
        setTimeout(() => {
          setTutorialStep(12);
        }, 200);

        startTimer();

        setTimeout(() => {
          typing(simulationConfederate);
          setTimeout(() => {
            sendMessage({
              user: simulationConfederate,
              text: t("which_option"),
              timeStamp: new Date().toISOString()
            });
            stopTimer();
            setTimeout(() => {
              setTutorialStep(17);
            }, 2000);
          }, 1000);
        }, 2800);
      }, 500);
    }, 2000);
  };

  const handleTutorialStep17 = () => {
    const simulationConfederate = t("tutorial_confederate_2");
    setMaxTime(70);
    startTimer();
    setTutorialStep(18);
    handleTutorialMessage(t("i_think_the_answer_is_11"));

    setTimeout(() => {
      typing(simulationConfederate);
      setMaxTime(33);
      startTimer();
      setTimeout(() => {
        sendMessage({
          user: simulationConfederate,
          text: t("i_disagree_i_think_its_12"),
          timeStamp: new Date().toISOString()
        });

        setTimeout(() => {
          setAnswer("12");
          setGameResolution({ gameResolutionType: RESOLUTION_TYPES.DNP, teamAnswer: "12" });
          setMaxTime(11);
          startTimer();

          setTimeout(() => {
            setTutorialStep(19);
          }, 25000);
        }, 3000);
      }, 3000);
    }, 5000);
  };

  const handleSimulation3 = () => {
    clearChat();
    setMaxTime(90);
    const simulationConfederate = t("tutorial_confederate_3");
    setTutorialStep(20);
    setConfederate(simulationConfederate);
    setCurrentUser(t("tutorial_participant_3"));
    tutorialProblem({ block: { Name: "T_1" }, Problem: "3" });
  };

  const handleTutorialStep20 = () => {
    setTutorialStep(21);
    const simulationConfederate = t("tutorial_confederate_3");
    typing(simulationConfederate);
    setTimeout(() => {
      typing(simulationConfederate);
      setTimeout(() => {
        sendMessage({
          user: simulationConfederate,
          text: t("what_do_you_think"),
          timeStamp: new Date().toISOString()
        });
        setTimeout(() => {
          setTutorialStep(22);
        }, 2000);
      }, 1000);
    }, 2000);
  };

  const handleTutorialStep24 = () => {
    tutorialDone(numTries);
    setTutorialStep(25);
  };

  useEffect(() => {
    const pattern =
      tutorialStep === 23
        ? new RegExp(
            "^" + t("arrow_up_green_pattern").replace(/\s+/g, "\\s*") + "$",
            "i"
          )
        : null;

    const handleMessage = (message) => {
      if (tutorialStep === 23 && pattern) {
        const received = message.text.trim();
        if (pattern.test(received)) {
          setWrongAnswer(0);
          setTutorialStep(24);
        } else {
          setNumTries(numTries + 1);
          setTypedMessage(message.text);
          setWrongAnswer(1);
          setTutorialStep(22);
        }
      }
    };

    onReceiveMessage(handleMessage);

    return () => {
      offReceiveMessage(handleMessage);
    };
  }, [tutorialStep, numTries, t]);

  const handleTutorialMessage = (message) => {
    setShowMessageBox(true);
    const inputPosition = messageRef.current.getBoundingClientRect();

    setMessageInputStyle({
      position: "absolute",
      top: inputPosition.top,
      left: inputPosition.left,
      width: inputPosition.width,
      height: inputPosition.height
    });

    typeMessage(message);
  };

  function typeMessage(originalMessage, delay = 100) {
    let newMsg = "";
    const characters = originalMessage.split("");
    let index = 0;

    const intervalId = setInterval(() => {
      newMsg += characters[index];
      setNewMessage(newMsg);

      index++;

      if (index >= characters.length) {
        clearInterval(intervalId);

        setTimeout(() => {
          sendButtonRef.current.classList.add("click-animation");

          setTimeout(() => {
            sendButtonRef.current.classList.remove("click-animation");
            setShowMessageBox(false);
            sendMessage({
              user: currentUser,
              text: originalMessage,
              timeStamp: new Date().toISOString()
            });
            try {
              new Audio("/sounds/message-sent.mp3").play();
            } catch (error) {
              console.error("Failed to play audio:", error);
            }
          }, 500);
        }, 1000);
      }
    }, delay);
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{t("title")}</h1>
      {tutorialStep === 0 && (
        <div className="mb-4" style={{ textAlign: "left" }}>
          <p>{t("welcome")}</p>
          <Trans i18nKey="tutorial_intro" components={{ p: <p /> }} />
        </div>
      )}
      {tutorialStep === 0 && (
        <div className="mb-4" style={{ textAlign: "center" }}>
          <p>{t("start_tutorial")}</p>
          <button className="btn btn-primary btn-narrow" onClick={handleTutorialStep1}>
            {t("ready")}
          </button>
        </div>
      )}
      {tutorialStep === 1 && (
        <Modal>
          <p>{t("tutorial_step1")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => setTutorialStep(2)}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 2 && (
        <InputModal onUnderstood={() => setTutorialStep(3)} inputRef={messageRef?.current} text={t("inputmodal_2")} />
      )}
      {tutorialStep === 3 && (
        <InputModal onUnderstood={() => setTutorialStep(4)} inputRef={chatRef?.current} text={t("inputmodal_3")} />
      )}
      {tutorialStep === 4 && (
        <InputModal onUnderstood={() => setTutorialStep(5)} inputRef={confederateNameRef?.current} text={t("inputmodal_4")} />
      )}
      {tutorialStep === 5 && (
        <InputModal onUnderstood={() => setTutorialStep(6)} inputRef={activityRef?.current} text={t("inputmodal_5")} />
      )}
      {tutorialStep === 6 && (
        <InputModal onUnderstood={() => setTutorialStep(7)} inputRef={gamesRef?.current} text={t("inputmodal_6")} />
      )}
      {tutorialStep === 7 && (
        <InputModal onUnderstood={() => setTutorialStep(8)} inputRef={timerRef?.current} text={t("inputmodal_7")} />
      )}
      {tutorialStep === 8 && (
        <InputModal onUnderstood={() => setTutorialStep(9)} inputRef={pointsRef?.current} text={t("inputmodal_8")} />
      )}
      {tutorialStep === 9 && (
        <InputModal onUnderstood={() => setTutorialStep(10)} inputRef={teamAnswerRef?.current} text={t("inputmodal_9")} />
      )}
      {tutorialStep === 10 && (
        <Modal>
          <p>{t("tutorial_step10")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => handleSimulation1()}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 11 && (
        <Modal>
          <p>{t("playing_with")}</p>
          <p className="h2">
            <b>{t("tutorial_confederate_1")}</b>
          </p>
          <button ref={readyButtonRef} className="btn btn-primary btn-narrow button-dead">
            {t("ready")}
          </button>
        </Modal>
      )}
      {tutorialStep === 13 && (
        <Modal>
          <p>{t("tutorial_step13")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => handleTutorialStep13()}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 15 && (
        <Modal>
          <p>{t("tutorial_step15")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => handleSimulation2()}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 16 && (
        <Modal>
          <p>{t("playing_with")}</p>
          <p className="h2">
            <b>{t("tutorial_confederate_2")}</b>
          </p>
          <button ref={readyButtonRef} className="btn btn-primary btn-narrow button-dead">
            {t("ready")}
          </button>
        </Modal>
      )}
      {tutorialStep === 17 && (
        <Modal>
          <p>{t("tutorial_step17")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => handleTutorialStep17()}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 19 && (
        <Modal>
          <p>{t("tutorial_step19")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => handleSimulation3()}
          >
            {t("ready")}
          </button>
        </Modal>
      )}
      {tutorialStep === 20 && (
        <Modal>
          <p>{t("tutorial_step20_1")}</p>
          <p>{t("tutorial_step20_2")}</p>
          <p className="h2">
            <b>{t("tutorial_confederate_3")}</b>
          </p>
          <p>{t("tutorial_step20_3")}</p>
          <button onClick={() => handleTutorialStep20()} className="btn btn-primary btn-narrow">
            {t("ready")}
          </button>
        </Modal>
      )}
      {tutorialStep === 22 && !wrongAnswer && (
        <Modal>
          <p>{t("tutorial_step22")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => setTutorialStep(23)}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 22 && wrongAnswer && (
        <Modal>
          <Trans i18nKey="tutorial_step22_wrong" values={{ typedMessage }} components={{ b: <b /> }} />
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => setWrongAnswer(0)}
          >
            {t("understood")}
          </button>
        </Modal>
      )}
      {tutorialStep === 24 && (
        <Modal>
          <p>{t("excellent")}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: "120px", width: "120px", textAlign: "center" }}
            onClick={() => handleTutorialStep24()}
          >
            {t("thanks")}
          </button>
        </Modal>
      )}
      {tutorialStep === 25 && (
        <Modal>
          <p>{t("tutorial_step25")}</p>
        </Modal>
      )}
      {usernameSet && (
        <div className="row">
          <ChatBox
            currentUser={currentUser}
            isAdmin={false}
            messageRef={messageRef}
            chatRef={chatRef}
            confederateNameRef={confederateNameRef}
            activityRef={activityRef}
            sendButtonRef={sendButtonRef}
          />
          <GameBox isAdmin={false} gamesRef={gamesRef} timerRef={timerRef} pointsRef={pointsRef} teamAnswerRef={teamAnswerRef} />
          {showMessageBox && (
            <input type="text" className="form-control me-2" placeholder="Mensagem" value={newMessage} style={messageInputStyle} />
          )}
        </div>
      )}
    </div>
  );
}

export default Tutorial;