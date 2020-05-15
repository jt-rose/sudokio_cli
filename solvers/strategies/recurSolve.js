import {
    updateRelCell
} from "../solutionObject";

// this function solves sudoku using the traditional CS method
// of recursive backtracking. This assumes the grid is the correct length
// (81 cells), so the submitted grid should be checked 
// for a valid length before attempting this function. The submitted grid 
// should also be formatted with the formatGrid helper function in cellPath.js
const solveTraditional = (sudokuGrid, cellIndex = 0) => {
    // All cells cleared! Success! Return completed grid.
    if (cellIndex > 80) {
        return sudokuGrid;
    }
    // move onto next cell if current one is already answered
    if (typeof sudokuGrid[cellIndex] === "number") {
         return solveTraditional(sudokuGrid, (cellIndex + 1));
    }
    // take array of possible answers and attempt each, 
    // moving forward and back recursively with each answer
    const attempt = sudokuGrid[cellIndex].reduce((prev, currentNumber) => {
        const attemptedGrid = [...sudokuGrid.slice(0,cellIndex), 
            currentNumber, 
            ...sudokuGrid.slice(cellIndex + 1, sudokuGrid.length)];
        const formattedRelCell = updateRelCell(cellIndex, attemptedGrid);
        const nextStep = solveTraditional(formattedRelCell, (cellIndex + 1));
        return prev !== false ? prev : nextStep;
    }, false);
    return attempt;
};

export default solveTraditional;

// noApparentIssues
// notComplete
// correctLength