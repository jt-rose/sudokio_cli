import {
    getOpen,
    getExternal,
    getUniqueOpenValues,
} from "../cellPath";

import {
    formatUpdate,
    formatSolution
} from "../solutionObject";

import {
    findGroups
} from "./pairFinder";

import * as R from "ramda";

export function hasSomeButNotAll(arr, findValues) {
    return arr.some(arrValue => findValues.includes(arrValue) ) && !R.equals(arr, findValues);
  }

// determine strategy used, differentiating between naked and cascading pairings
function nakedPairStrat(pairLen, cellGroup, sudokuGrid) {
    if (pairLen === 2) {
      return "nakedPair";
    }
    if (pairLen === 3) {
      return R.uniq(cellGroup.map(x => sudokuGrid[x]) ).length === 1 ?
      "nakedTriple" : "cascadingTriple";
    }
    if (pairLen === 4) {
        return R.uniq(cellGroup.map(x => sudokuGrid[x]) ).length === 1 ?
        "nakedQuad" : "cascadingQuad";
      }
      return `Pair of length ${pairLen} Found`;
  }

// 4. Search for pairings (sets of 2, 3, 4 etc.) that will eliminate other options
// Ex: if a single row has [2,3], [2,3], and [2,3,4] as possible answers for open cells
// then the third cell must be 4, because the first two have to be either 2 or 3
// If the first cell is 2, the second will be 3, and vice versa
// There are two version of this: naked and "cascading"
// Naked is shown above
// Cascading looks like the following: [1,2], [1,3], [2,3], [1,2,3,4] 
// The first three have different sets of numbers, but a similar
// deterministic relationship. If the first cell is 1, then the second
// cell must be 3, and the third cell must be 2,
// which means that the final cell must be 4
// this holds true regardless of what the answer is for each of the first three
// these are more difficult to spot, so to identify it and prioritize the easier approach
// we will distinguish these using the "nakedPairStrat" helper function
const solveNakedPairings = pairLen => (sudokuGrid, gridParam) => {
    const openCells = getOpen(gridParam, sudokuGrid)
    const openCellSets = findGroups(pairLen)(openCells);
  
  const answerSets = openCellSets.map( cellGroup => ({
    cellGroup,
    answers: getUniqueOpenValues(cellGroup, sudokuGrid)
  }) )
  // keep only sets with amount of answers that match the pairing length
  .filter(set => set.answers.length === pairLen)
  .map(set => ({
    ...set,
    removeFrom: getExternal(set.cellGroup, openCells)
      .filter(x => hasSomeButNotAll(sudokuGrid[x], set.answers))
  }) )
  // keep only sets that can remove possible answers
  .filter(set => set.removeFrom.length !== 0); 
  
  if (answerSets.length === 0) {
    return false;
  }
  // return formatted solutions
  const stratUsed = answerSets.map(x => nakedPairStrat(pairLen, x.cellGroup, sudokuGrid));
  const updates = answerSets.map(set => set.removeFrom.map(rem => formatUpdate(rem, sudokuGrid, set.answers) ) );
  return answerSets.map( (obj, i) => formatSolution(stratUsed[i], obj.cellGroup, updates[i]));
  }

// curry solveNakedPairings into pairs, triples, and quads variations
// we could potentially go further, but this is rarely done, so to keep
// things simple, we will stop with sets of 2, 3, and 4
export const solveNakedPair = solveNakedPairings(2);
export const solveNakedTriple = solveNakedPairings(3);
export const solveNakedQuad = solveNakedPairings(4);