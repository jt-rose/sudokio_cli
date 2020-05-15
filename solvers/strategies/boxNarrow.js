import {
    getRow,
    getColumn,
    getRowNumber,
    getColumnNumber,
    getUniqueOpenValues,
    getOpenCellsWith,
    getOpenExternalWith
} from "../cellPath";

import {
    formatUpdate,
    formatSolution
} from "../solutionObject";

// 3. Solve when a box contains possible answers only in a single column or row, 
// canceling out those answers for cells in the same row or column outside of the box
export default function solveBoxNarrow(sudokuGrid, boxIndex) {
    // map out unsolved numbers, their locations in the box, and rows/columns they're found in
    const openAnswers = getUniqueOpenValues(boxIndex, sudokuGrid);
    const answerFoundAt = openAnswers.map(x => getOpenCellsWith(boxIndex, sudokuGrid, x));
    const answerRows = answerFoundAt.map(x => x.map(y => getRowNumber(y)));
    const answerColumns = answerFoundAt.map(x => x.map(y => getColumnNumber(y)));
  
    // narrow down to only answers found in single row or column of box
    const singleLineAnswers = openAnswers.map( (answer, index) => ({
      answer,
      foundAt: answerFoundAt[index],
      rows: [...new Set( answerRows[index] )],
      columns: [...new Set( answerColumns[index] )],
    }) )
      .filter(x => x.rows.length === 1 || x.columns.length === 1)
  
    // remove if answer not also found in same row/ column outside of box 
    // (since no update possible)
      .map(obj => ({
        ...obj,
        externalIndex: obj.rows.length === 1 ? 
          getOpenExternalWith(boxIndex, getRow(obj.foundAt[0]), sudokuGrid, obj.answer) :
          getOpenExternalWith(boxIndex, getColumn(obj.foundAt[0]), sudokuGrid, obj.answer)
      }) )
      .filter(obj => obj.externalIndex.length !== 0)
  
      // generate updated possible answers for external cells
      // with the single box parameter answer removed
      .map(obj => ({
        ...obj,
        updates: obj.externalIndex.map(index => formatUpdate(index, sudokuGrid, obj.answer))
      }) );
  
      const solutionList = singleLineAnswers.map( obj => formatSolution("boxNarrow", obj.foundAt, obj.updates));
      return solutionList.length !== 0 ? solutionList : false;
  };