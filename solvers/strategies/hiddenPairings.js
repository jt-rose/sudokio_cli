import {
    getOpen,
    getUniqueOpenValues,
    includesEach
} from "../cellPath";

import {
    isOnly,
    formatUpdate,
    formatSolution
} from "../solutionObject";

import {
    findGroups
} from "./pairFinder";

// determine strategy used, differentiating between naked and cascading pairings
function hiddenPairStrat(answerPairs, cellGroup, sudokuGrid) {
    if (answerPairs.length === 2) {
      return "hiddenPair";
    }
    if (answerPairs.length === 3) {
      return cellGroup.map(x => sudokuGrid[x]).every(x => includesEach(x, answerPairs)) ?
      "hiddenTriple" : "hiddenCascadingTriple";
    }
    if (answerPairs.length === 4) {
        return cellGroup.map(x => sudokuGrid[x]).every(x => includesEach(x, answerPairs)) ?
        "hiddenQuad" : "hiddenCascadingQuad";
      }
      return `Hidden Pair of length ${answerPairs} Found`;
  }

// 5. Finds a hidden pair within a particular parameter
// Ex: if two open cells have [1,2,3] and [1,2,4]
// but 1 and 2 do not appear anywhere else in that parameter,
// then a deterministic relationship exists:
// if the first cell is 1, the second must be 2, and vice versa
// therefore, both cells must be either 1 or 2, 
// and the 3 and 4 answers can be removed
// this is similar to the "nakedPairings" strategy, except thje pairs are
// hidden at first and the removed answers come from within the cell pairs

// note: this will pick up single option answers as well - fine for recursive update cycle,
// but problematic for allowing instantaneous testing on site -> add function to check against single answer
const solveHiddenPairings = pairLen => (sudokuGrid, gridParam) => {
    const answerSets = findGroups(pairLen)(getUniqueOpenValues(gridParam, sudokuGrid));
    const openCells = getOpen(gridParam, sudokuGrid);
  
    const answerSetsFound = answerSets.map(answerSet => ({
      answerSet,
      foundIn: openCells.filter(x => answerSet.some(answer => sudokuGrid[x].includes(answer)))
      }) )
      // keep only cell-sets where amount of cells matches pairlength
      .filter(set => set.foundIn.length === pairLen)
      .map(set => ({
        ...set, 
        // filter cells for removeFrom to keep only ones that include answers outside answerSet
        removeFrom: set.foundIn.filter(cell => sudokuGrid[cell].some(x => !set.answerSet.includes(x)))
        }) )
        // remove answerSets where no updates can occur
        .filter(set => set.removeFrom.length !== 0); 
  
    if (answerSetsFound.length === 0) {
      return false;
    }
  
    const stratUsed = answerSetsFound.map(x => 
        hiddenPairStrat(x.answerSet, x.foundIn, sudokuGrid));
    const updates = answerSetsFound.map(set => 
        set.removeFrom.map(x => formatUpdate(x, sudokuGrid, isOnly(set.answerSet))));
    const solutionList = answerSetsFound.map( (set, i) => 
        formatSolution(stratUsed[i], set.foundIn, updates[i]));
    return solutionList;
  };
  
// curry solveHiddenPairings into pairs, triples, and quads variations
// we could potentially go further, but this is rarely done, so to keep
// things simple, we will stop with sets of 2, 3, and 4
export const solveHiddenPair = solveHiddenPairings(2);
export const solveHiddenTriple = solveHiddenPairings(3);
export const solveHiddenQuad = solveHiddenPairings(4);