"use client";
import React, { useState, useEffect, useRef } from "react";

function TypingTest() {
  const [testDuration, setTestDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [testStarted, setTestStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [typedHistory, setTypedHistory] = useState([]);

  const testAreaRef = useRef(null);

  const wordList = [
    "example",
    "random",
    "words",
    "to",
    "type",
    "during",
    "the",
    "test",
    "keyboard",
    "javascript",
    "react",
    "component",
    "function",
    "state",
    "effect",
    "variable",
    "constant",
    "array",
    "object",
    "syntax",
    "loop",
    "condition",
    "event",
    "handler",
    "input",
    "output",
    "module",
    "export",
    "import",
    // ...add more words as needed
  ];

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (testStarted) {
      testAreaRef.current.focus();
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer);
            finishTest();
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted]);

  useEffect(() => {
    calculateStatistics();
  }, [correctChars, incorrectChars]);

  const generateWords = () => {
    const totalWords = 200;
    const generatedWords = [];
    for (let i = 0; i < totalWords; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      generatedWords.push(wordList[randomIndex]);
    }
    return generatedWords;
  };

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(testDuration);
    setWords(generateWords());
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(0);
    setTypedHistory([]);
  };

  const handleKeyDown = (e) => {
    if (!testStarted) return;

    const key = e.key;
    const currentWord = words[currentWordIndex];
    const currentChar = currentWord[currentCharIndex];

    if (key.length === 1 && key !== " ") {
      // Regular character input
      if (currentCharIndex < currentWord.length) {
        if (key === currentChar) {
          setCorrectChars((prev) => prev + 1);
        } else {
          setIncorrectChars((prev) => prev + 1);
        }
        setCurrentCharIndex((index) => index + 1);
      } else {
        // Extra characters beyond word length
        setIncorrectChars((prev) => prev + 1);
        setCurrentCharIndex((index) => index + 1);
      }
    } else if (key === "Backspace") {
      if (currentCharIndex > 0) {
        const newIndex = currentCharIndex - 1;
        const wasCorrect =
          currentWord[newIndex] === words[currentWordIndex][newIndex];
        if (wasCorrect) {
          setCorrectChars((prev) => prev - 1);
        } else {
          setIncorrectChars((prev) => prev - 1);
        }
        setCurrentCharIndex(newIndex);
      }
    } else if (key === " " || key === "Enter") {
      // Move to next word
      const extraChars =
        currentCharIndex > currentWord.length
          ? currentCharIndex - currentWord.length
          : 0;
      setIncorrectChars((prev) => prev + extraChars);
      setTypedHistory((history) => [
        ...history,
        { word: currentWord, typed: currentWord.slice(0, currentCharIndex) },
      ]);
      setCurrentWordIndex((index) => index + 1);
      setCurrentCharIndex(0);
    }
  };

  const calculateStatistics = () => {
    const timeElapsed = testDuration - timeLeft;
    const totalChars = correctChars + incorrectChars;
    const grossWPM = Math.round(totalChars / 5 / (timeElapsed / 60) || 0);
    const accuracyPercent = Math.round(
      (correctChars / (totalChars || 1)) * 100,
    );
    setWpm(grossWPM);
    setAccuracy(accuracyPercent);
  };

  const finishTest = () => {
    setTestStarted(false);
  };

  const getCharClass = (wordIdx, charIdx, char) => {
    if (wordIdx === currentWordIndex && charIdx === currentCharIndex) {
      return "bg-base-300";
    } else if (wordIdx < currentWordIndex) {
      const typedChar = typedHistory[wordIdx]?.typed[charIdx];
      if (typedChar === char) {
        return "text-success";
      } else {
        return "text-error";
      }
    } else if (wordIdx === currentWordIndex && charIdx < currentCharIndex) {
      const typedChar = words[wordIdx][charIdx];
      if (typedChar === char) {
        return "text-success";
      } else {
        return "text-error";
      }
    }
    return "";
  };

  return (
    <div
      className="p-6"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={testAreaRef}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Typing Test</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-bold">Time Left: {timeLeft}s</span>
        </div>
        <div>
          <label className="mr-2">Duration:</label>
          <select
            className="select select-bordered w-24"
            value={testDuration}
            onChange={(e) => setTestDuration(Number(e.target.value))}
            disabled={testStarted}
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-base-200 rounded mb-4 h-40 overflow-hidden relative">
        <div className="text-xl leading-relaxed absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
          {words.map((word, wordIdx) => (
            <span key={wordIdx}>
              {word.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  className={getCharClass(wordIdx, charIdx, char)}
                >
                  {char}
                </span>
              ))}
              <span> </span>
            </span>
          ))}
        </div>
      </div>

      {!testStarted && (
        <button className="btn btn-primary w-full" onClick={startTest}>
          Start Test
        </button>
      )}

      <div className="mt-6 flex justify-around text-center">
        <div>
          <p className="text-2xl font-bold">{wpm}</p>
          <p>WPM</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{accuracy}%</p>
          <p>Accuracy</p>
        </div>
      </div>
    </div>
  );
}

export default TypingTest;
