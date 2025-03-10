import { useState, useEffect } from "react";
const WORD_LENGTH: number = 5;
const NUM_GUESSES: number = 6;
const CLR_CORRECT: string = "#228B22";
const CLR_MISPLACED: string = "#C9B458";
const CLR_INCORRECT: string = "#696969";
const CLR_DEFAULT: string = "#D3D6DA";

export default function App() {
  const [answer, setAnswer] = useState([]);
  const [wordBank, setWordBank] = useState(new Set());
  const [guesses, setGuesses] = useState([
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ]);
  const [colours, setColours] = useState([
    ["white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white"],
    ["white", "white", "white", "white", "white"],
  ]);
  const [correctLetters, setCorrectLetters] = useState(new Set());
  const [misplacedLetters, setmisplacedLetters] = useState(new Set());
  const [inCorrectLetters, setinCorrectLetters] = useState(new Set());

  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);

  useEffect(() => {
    getRandomWord();
  }, []);

  async function getRandomWord() {
    const response: Response = await fetch("./officiallist.txt");
    const jsonResponse: any = await response.json();
    const words: string[] = jsonResponse["officialWordleWordList"];
    setWordBank(new Set(words));
    const word: string = words[Math.floor(Math.random() * words.length)];
    console.log(word);
    const wordAsArr: string[] = word.split("");
    setAnswer(wordAsArr);
  }

  function verifyWord(guess: string[]) {
    const newCorrectLetters = new Set(correctLetters);
    const newMisplacedLetters = new Set(misplacedLetters);
    const newIncorrectLetters = new Set(inCorrectLetters);
    let freqAnswer = new Map();
    answer.map((val) => {
      if (freqAnswer.has(val)) {
        freqAnswer.set(val, freqAnswer.get(val) + 1);
      } else {
        freqAnswer.set(val, 1);
      }
    });
    guess.map((letter, index) => {
      if (answer[index] === letter) {
        freqAnswer.set(letter, freqAnswer.get(letter) - 1);
      }
    });
    const res = guess.map((letter, index) => {
      if (answer[index] === letter) {
        // correct
        newCorrectLetters.add(letter);
        newMisplacedLetters.delete(letter);
        return CLR_CORRECT;
      } else if (freqAnswer.get(letter) > 0) {
        // misplaced
        newMisplacedLetters.add(letter);
        return CLR_MISPLACED;
      }
      // incorrect
      newIncorrectLetters.add(letter);
      return CLR_INCORRECT;
    });
    setCorrectLetters(newCorrectLetters);
    setmisplacedLetters(newMisplacedLetters);
    setinCorrectLetters(newIncorrectLetters);
    return res;
  }

  function keyPress(letter: string) {
    if (letter === "ENTER") {
      if (row == NUM_GUESSES) {
        return;
      }
      if (column === WORD_LENGTH) {
        if (!wordBank.has(guesses[row].join(""))) {
          return;
        }
        const newColours = [...colours];
        newColours[row] = verifyWord(guesses[row]);
        setColours(newColours);
        setColumn(0);
        setRow(row + 1);
      }
    } else if (letter === "BKSP") {
      if (column === 0) {
        return;
      }
      const newGuess = [...guesses];
      newGuess[row][column - 1] = " ";
      setGuesses(newGuess);
      setColumn(column - 1);
    } else if (column < WORD_LENGTH) {
      // add letter to guesses
      const newGuess = [...guesses];
      newGuess[row][column] = letter.toLowerCase();
      setGuesses(newGuess);
      setColumn(column + 1);
    }
  }

  return (
    <div>
      <div className="gameboard">
        {guesses.map((guess, index) => {
          return <Line key={index} word={guess} colours={colours[index]} />;
        })}
      </div>
      <div className="keyboard">
        <Keyboard
          keyPress={keyPress}
          correct={correctLetters}
          misplaced={misplacedLetters}
          incorrect={inCorrectLetters}
        />
      </div>
    </div>
  );
}

function Line({ word, colours }: { word: string[]; colours: string[] }) {
  return (
    <div className="line">
      {word.map((letter, index) => {
        return (
          <div
            key={index}
            className={`tile ${colours[index] !== "white" ? "guessed" : ""}`}
            style={{ backgroundColor: colours[index] }}
          >
            {letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}

function Keyboard({
  keyPress,
  correct,
  misplaced,
  incorrect,
}: {
  keyPress: any;
  correct: Set<any>;
  misplaced: Set<any>;
  incorrect: Set<any>;
}) {
  const buttons: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BKSP"],
  ];
  return (
    <>
      {buttons.map((buttonRow, index) => (
        <div key={index} className="keyboardRow">
          {buttonRow.map((buttonLabel, index2) => {
            let keyColour = CLR_DEFAULT;
            if (correct.has(buttonLabel.toLowerCase())) {
              keyColour = CLR_CORRECT;
            } else if (misplaced.has(buttonLabel.toLowerCase())) {
              keyColour = CLR_MISPLACED;
            } else if (incorrect.has(buttonLabel.toLowerCase())) {
              keyColour = CLR_INCORRECT;
            }
            const textColour = CLR_DEFAULT == keyColour ? "black" : "white";

            return (
              <button
                key={index2}
                className={`keyButton ${
                  buttonLabel.length > 1 ? "wideKeyButton" : ""
                }`}
                style={{ backgroundColor: keyColour, color: textColour }}
                onClick={() => keyPress(buttonLabel)}
              >
                {buttonLabel}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}
