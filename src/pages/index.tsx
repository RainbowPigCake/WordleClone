import { useState, useEffect } from "react";
const WORD_LENGTH = 5;
const NUM_GUESSES = 6;

export default function App() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(" ".repeat(5)));

  useEffect(() => {
    getRandomWord();
  }, []);

  async function getRandomWord() {
    const response = await fetch("./wordlist.txt");
    const text = await response.text();
    const words = text.split("\r\n");
    const word = words[Math.floor(Math.random() * words.length)];
    setAnswer(word);
  }

  function addToGuess(letter: string) {
  }

  return (
    <div>
      <div className="gameboard">
        {guesses.map((guess, index) => {
          return <Line key={index} word={guess} />;
        })}
      </div>
      <div className="keyboard">
        <Keyboard />
      </div>
    </div>
  );
}

function Line({ word }: { word: string }) {
  return (
    <div className="line">
      {[...word].map((letter, index) => {
        return (
          <div key={index} className="tile">
            {letter}
          </div>
        );
      })}
    </div>
  );
}

function Keyboard() {
  const buttons = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BKSP"],
  ];
  return (
    <>
      {buttons.map((buttonRow, index) => {
        return (
          <div key={index} className="keyboardRow">
            {buttonRow.map((buttonLabel, index2) => (
              <button
                key={index2}
                className={`keyButton ${
                  buttonLabel == "ENTER" || buttonLabel == "BKSP"
                    ? "wideKeyButton"
                    : ""
                }`}
                onClick={() => {}}
              >
                {buttonLabel}
              </button>
            ))}
          </div>
        );
      })}
    </>
  );
}
