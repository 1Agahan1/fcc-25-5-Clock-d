import React, { useState, useEffect, useRef } from 'react';
import "./App.css";

const PomodoroTimer = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const adjustLength = (type, amount) => {
    if (isRunning) return;
    
    if (type === 'break') {
      const newBreakLength = breakLength + amount;
      if (newBreakLength > 0 && newBreakLength <= 60) {
        setBreakLength(newBreakLength);
      }
    } else {
      const newSessionLength = sessionLength + amount;
      if (newSessionLength > 0 && newSessionLength <= 60) {
        setSessionLength(newSessionLength);
        if (timerLabel === 'Session') {
          setTimeLeft(newSessionLength * 60);
        }
      }
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            audioRef.current.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  return (
    <div className="container">
      <h1 className="title">25 + 5 Clock</h1>
      
      <div className="length-controls">
        <div className="control-group">
          <h2 id="break-label">Break Length</h2>
          <div className="controls">
            <button id="break-decrement" onClick={() => adjustLength('break', -1)}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => adjustLength('break', 1)}>+</button>
          </div>
        </div>

        <div className="control-group">
          <h2 id="session-label">Session Length</h2>
          <div className="controls">
            <button id="session-decrement" onClick={() => adjustLength('session', -1)}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => adjustLength('session', 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <div className="timer-controls">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default PomodoroTimer;