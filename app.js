import prompt from "prompt";
import { cellPath as CP } from "./solvers/cellPath";
import checkAndSolve from "./solvers/checkAndSolve";
import {
  basicPuzzleGridString,
  hiddenTripleGridString,
  hiddenQuadGridString,
  XWingGridString1,
  swordfishGridString1,
  jellyfishGridString1,
  xChainGridString,
} from "./tests/gridSamplesForTesting";
import displayAllSolutions from "./solvers/solutionDescriptions";
import chalk from "chalk";

const puzzleNamesWithSpacing = [
  "   basic puzzle",
  "   hidden triples",
  "   hidden quads",
  "   x-wing",
  "   swordfish",
  "   jellyfish",
  "   x-chain",
].map((x) => chalk.cyan(x));
const openingMessages = [
  `Thanks for checking out the ${chalk.cyan("Sudokio Solver Algorithms")}!`,
  "",
  `These are designed to work with the UI and database of the Sudokio website,
but a simple command line version can be run as well.`,
  "",
  "To get started, you submit a sudoku puzzle in the following format:",
  `"123006709..."`,
  "",
  `it should be submitted as an ${chalk.underline(
    "81 character string"
  )} with 0's 
representing unanswered cells`,
  "",
  `You can also test out any of our sample puzzles 
by typing out one of the names listed below:`,
  "",
  puzzleNamesWithSpacing,
  "",
  chalk.cyan("Let's start by entering a puzzle to test!"),
];

// displays a sudoku puzzle in the standard 9x9 grid
const displayGrid = (sudokuGrid) => {
  CP.rowSets.forEach((row) => {
    const stringRow = JSON.stringify(
      row.map((rowIndex) => sudokuGrid[rowIndex])
    )
      .slice(1, 18)
      .replace(/,/g, " ");
    console.log(" " + stringRow);
  });
};

const followUpOptions = (currentAnswer) => {
  console.log("To see the strategy data used each turn, enter 'strategies'");
  console.log(
    "To see a more readable description of the steps taken, enter 'steps'"
  );
  console.log("To move onto another puzzle, enter 'next'");
  console.log("To quit, just enter 'q'");
  prompt.get("option", function (err, result) {
    switch (result.option) {
      case "strategies":
        currentAnswer.solutions.map((sol) => console.log(sol));
        console.log("");
        followUpOptions(currentAnswer);
        break;
      case "steps":
        displayAllSolutions(currentAnswer);
        console.log("");
        followUpOptions(currentAnswer);
        break;
      case "next":
        testUserGrid();
        break;
      case "q":
        console.log(
          "Thanks for using Sudokio! Be sure to check out the finished site!"
        );
        break;
      default:
        console.log(
          "Sorry, that is not a possible action! Please try the following:"
        );
        followUpOptions(currentAnswer);
    }
  });
};

const testUserGrid = () => {
  let currentAnswer;
  console.log("Please enter your puzzle:");
  prompt.get("puzzle", function (err, result) {
    switch (result.puzzle) {
      case "basic puzzle":
        currentAnswer = checkAndSolve(basicPuzzleGridString);
        break;
      case "hidden triples":
        currentAnswer = checkAndSolve(hiddenTripleGridString);
        break;
      case "hidden quads":
        currentAnswer = checkAndSolve(hiddenQuadGridString);
        break;
      case "x-wing":
        currentAnswer = checkAndSolve(XWingGridString1);
        break;
      case "swordfish":
        currentAnswer = checkAndSolve(swordfishGridString1);
        break;
      case "jellyfish":
        currentAnswer = checkAndSolve(jellyfishGridString1);
        break;
      case "x-chain":
        currentAnswer = checkAndSolve(xChainGridString);
        break;
      default:
        currentAnswer = checkAndSolve(result.puzzle);
    }

    if (!currentAnswer.valid) {
      console.log("");
      console.log(`Uh oh! It looks like this is not a valid puzzle.`);
      console.log(`Error: ${currentAnswer.errorType}`);
      console.log("");
      testUserGrid();
    } else {
      console.log("");
      console.log(chalk.underline("  Starting Puzzle  "));
      displayGrid(
        Array.from(currentAnswer.gridString).map((x) => JSON.parse(x))
      );

      console.log("");
      console.log(chalk.underline("  Results  "));
      console.log(
        `Status: ${
          currentAnswer.solved ? chalk.green("solved") : chalk.red("not solved")
        }`
      );
      console.log("Strategies Used:");
      currentAnswer.strategiesUsed.map((strat) =>
        console.log(`    ${chalk.cyan(strat)}`)
      );

      console.log("");
      console.log(
        chalk.underline(
          `  ${currentAnswer.solved ? "Finished" : "Updated"} Puzzle  `
        )
      );
      displayGrid(currentAnswer.updatedGrid);
      console.log("");
      followUpOptions(currentAnswer);
    }
  });
};

// gradually display opening message, but show all puzzle names at once
openingMessages.forEach((msg, i) => {
  if (typeof msg === "string") {
    setTimeout(() => console.log(msg), 700 * i);
  } else {
    setTimeout(() => msg.map((x) => console.log(x)), 700 * i);
  }
});

setTimeout(() => testUserGrid(), 700 * openingMessages.length);
