import { useState } from "react";
import "./App.css";

type cardDisplay = "hidden" | "visible" | "disabled";

const grid_side = 4;
let random_elements = [];
const random_element_size = grid_side ** 2;
for (let i = 0; i < random_element_size / 2; i++) {
  random_elements.push(i);
  random_elements.push(i);
}

random_elements = random_elements.sort(() => Math.random() - 0.5);

const grid = [...Array(grid_side)].map((_) => Array(grid_side).fill(0));
for (let i = 0; i < grid_side; i++) {
  for (let j = 0; j < grid_side; j++) {
    grid[i][j] = random_elements.pop();
  }
}

function App() {
  const [displayGrid, setDisplayGrid] = useState(
    [...Array(grid.length)].map((_) => Array(grid.length).fill("hidden"))
  );

  const [prevClick, setPrevClick] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  function handleCardClick(rowIndex: number, colIndex: number) {
    if (displayGrid[rowIndex][colIndex] === "disabled" || locked === true) {
      return;
    }

    if (prevClick.length > 0) {
      if (prevClick[0] === rowIndex && prevClick[1] === colIndex) {
        return;
      }
      if (grid[prevClick[0]][prevClick[1]] != grid[rowIndex][colIndex]) {
        // no match
        setLocked(true);
        setTimeout(() => {
          const newDisplayGrid = [...displayGrid];
          newDisplayGrid[prevClick[0]][prevClick[1]] = "hidden";
          newDisplayGrid[rowIndex][colIndex] = "hidden";
          setDisplayGrid(newDisplayGrid);
          setPrevClick([]);
          setLocked(false);
        }, 1000);
      } else {
        // match
        const newDisplayGrid = [...displayGrid];
        newDisplayGrid[prevClick[0]][prevClick[1]] = "disabled";
        newDisplayGrid[rowIndex][colIndex] = "disabled";
        setDisplayGrid(newDisplayGrid);
        setPrevClick([]);
        return;
      }
    } else {
      // only 1 card is flipped
      setPrevClick([rowIndex, colIndex]);
    }

    // default before timeout might apply
    const newDisplayGrid = [...displayGrid];
    newDisplayGrid[rowIndex][colIndex] =
      newDisplayGrid[rowIndex][colIndex] === "hidden" ? "visible" : "hidden";
    setDisplayGrid(newDisplayGrid);
  }

  return (
    <div className="App">
      {grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="row">
            {row.map((col, colIndex) => {
              return (
                <div
                  key={colIndex}
                  className="col"
                  onClick={() => handleCardClick(rowIndex, colIndex)}
                >
                  {displayGrid[rowIndex][colIndex] === "hidden" ? "" : col}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
