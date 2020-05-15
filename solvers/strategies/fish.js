import {
    cellPath as CP,
    getRow,
    getColumn,
    getOpen,
    getUniqueOpenValues,
    getOpenExternalWith
} from "../cellPath";

import {
    formatUpdate,
    formatSolution
} from "../solutionObject";

import {
    findGroups
} from "./pairFinder";

import * as R from "ramda";


// 6. Fish strategies recognize a deterministic relationship
// between 4, 6, or 8 cells, that create a domino effect
// of narrowing possible answers. Detailed examples can be found online.

// to avoid constantly repeating this pattern, this function
// was designed to run across the full grid and efficiently
// find all matches for a certain pairing length in one go.
const solveFish = (fishLen, description) => sudokuGrid => {
    // find open cells, rows, columns, and answers
    const openCells = getOpen(CP.allIndex, sudokuGrid);
    const possibleAnswers = getUniqueOpenValues(openCells, sudokuGrid);

    const openRows = CP.rowSets.map(row => getOpen(row, sudokuGrid));
    const openColumns = CP.columnSets.map(col => getOpen(col, sudokuGrid));
    
    // map out cells, rows, and columns where answer is found
    // and remove rows/columns where too many or too few are found
    const answersFound = possibleAnswers.map(answer => ({
      answer, // map out cells with answer as possible option
      allFound: openCells.filter(x => sudokuGrid[x].includes(answer)),
      rows: openRows.map(row => row.filter(x => sudokuGrid[x].includes(answer)))
      // remove rows with too many/ too few viable cells
      .filter(row => row.length >= 2 && row.length <= fishLen),
      columns: openColumns.map(col => col.filter(x => sudokuGrid[x].includes(answer)))
      .filter(col => col.length >= 2 && col.length <= fishLen)
    }) )
    // remove answers without any rows or columns matching fish length
    .filter(obj => obj.rows.length >= fishLen || obj.columns.length >= fishLen)
    // generate all possible groupings of rows/ columns based on fish Length
    .map(answerObj => ({
      ...answerObj,
      rowPairs: findGroups(fishLen)(answerObj.rows)
        .map(x => x.flat()), // results in [] if fishLen not met
      columnPairs: findGroups(fishLen)(answerObj.columns)
        .map(x => x.flat()) // flatten row groups
    }) );
  
  // map out row and column set intersecting params and remove those not matching fishLen
  const rowSets = answersFound.flatMap(obj => obj.rowPairs.map(group => ({
    answer: obj.answer,
    group,
    crossColumns: [...new Set(group.flatMap(x => getColumn(x)) )]
  }) ))
  .filter(set => set.crossColumns.length === fishLen * 9)
  // for remaining matches, find answers in external cells of overlapping params
  .map(set => R.assoc("extVal", getOpenExternalWith(set.group, set.crossColumns, sudokuGrid, set.answer), set))
  .filter(set => set.extVal.length > 0);
  // repeat for columns
  const columnSets = answersFound.flatMap(obj => obj.columnPairs.flatMap(group => ({
    answer: obj.answer,
    group,
    crossRows: [...new Set(group.flatMap(x => getRow(x)) )]
  }) ))
  .filter(set => set.crossRows.length === fishLen * 9)
  .map(set => R.assoc("extVal", getOpenExternalWith(set.group, set.crossRows, sudokuGrid, set.answer), set))
  .filter(set => set.extVal.length > 0);
  
  const validFish = [...rowSets,...columnSets];
  if (validFish.length === 0) {
    return false;
  }
  const updates = validFish.map(set => set.extVal.map(ext => formatUpdate(ext, sudokuGrid, set.answer)));
  const solutionList = validFish.map((set, i) => formatSolution(description, set.group, updates[i]));
  return solutionList;
  };
  
  // curry solveFish into different fish variations
  export const solveXWing = solveFish(2, "X-Wing");
  export const solveSwordfish = solveFish(3, "Swordfish");
  export const solveJellyfish = solveFish(4, "Jellyfish");