import {
    getParam,
    getOpen,
    getValues
} from "../cellPath";

import {
    isOnly,
    formatUpdate,
    formatSolution
} from "../solutionObject";

// 2. Solves cell by recognizing only one option left in a single parameter
// Ex: only one answer possible in row
export default function solveSingleParam(sudokuGrid, gridParam) {
    const paramUsed = getParam(gridParam);
    if (!paramUsed) {
      return false;
    }
    const openGrid = getOpen(gridParam, sudokuGrid);
    const allValues = getValues(openGrid, sudokuGrid).flat();
    const singleValuesFound = [...new Set(allValues)]
        .filter(x => allValues.indexOf(x) === allValues.lastIndexOf(x));
    if (singleValuesFound.length === 0) {
      return false;
    }
    const indexFound = singleValuesFound
        .map(val => openGrid.find(x => sudokuGrid[x].includes(val)) );
    const updates = singleValuesFound.map( (val, i) => 
        formatUpdate(indexFound[i], sudokuGrid, isOnly(val)) );
    const solutionList = indexFound.map( (cellFound, i) => 
        formatSolution(`singleParam-${paramUsed}`, cellFound, updates[i]));
    return solutionList;
  };