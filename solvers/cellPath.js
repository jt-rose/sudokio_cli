import * as R from "ramda";

// add polyfill for flat() or use immutable, rambda, etc.
// This is a restructured cellPath using FP to simplify the codebase
const paramLength = [0,1,2,3,4,5,6,7,8];

const allIndex = R.range(0, 81);
const rowSets = paramLength.map(x => getRow(x * 9));
const rowIndex = allIndex.map(x => getRow(x));
const rowNumber = allIndex.map(x => getRowNumber(x));
const columnSets = paramLength.map(x => getColumn(x));
const columnIndex = allIndex.map(x => getColumn(x));
const columnNumber = allIndex.map(x => getColumnNumber(x));
const boxSets = [0, 3, 6, 27, 30, 33, 54, 57, 60].map(x => getBox(x)); // box starting parameters
const allSets = [...rowSets,...columnSets,...boxSets];
const boxIndex = allIndex.map(x => getBox(x));
const boxNumber = allIndex.map(x => getBoxNumber(x));
const relCell = allIndex.map(x => getRelCell(x));

export const cellPath = {
    allIndex,
    allSets,
    rowSets,
    rowIndex,
    rowNumber,
    columnSets,
    columnIndex,
    columnNumber,
    boxSets,
    boxIndex,
    boxNumber,
    relCell
};

// Get rows, columns, and boxes related to each cell
export function getRow(gridLocation) {
    const rowStart = gridLocation - (gridLocation % 9);
    return [0,1,2,3,4,5,6,7,8].map(x => rowStart + x);
  }

export function getColumn(gridLocation) {
    const colStart = gridLocation % 9;
    return [0,1,2,3,4,5,6,7,8].map(x => (x * 9) + colStart);
  }

export function getBox(gridLocation) {
    const boxStartingPosition = [0, 3, 6, 27, 30, 33, 54, 57, 60];
    const boxWall = gridLocation - (gridLocation % 3);
    const boxCorner = boxStartingPosition.find(x => 
        x === boxWall || x === boxWall - 9 || x === boxWall - 18);

    const boxParameters = [0, 1, 2, 9, 10, 11, 18, 19, 20];
  return boxParameters.map(x => x + boxCorner);
}

export function getRowNumber(gridLocation) {
    return Math.floor(gridLocation / 9);
}

export function getColumnNumber(gridLocation) {
    return gridLocation % 9;
}

export function getBoxNumber(gridLocation) {
    const boxStartingPosition = [0, 3, 6, 27, 30, 33, 54, 57, 60];
    const boxParameters = [0, 1, 2, 9, 10, 11, 18, 19, 20];
    const boxes = boxStartingPosition.map(x => boxParameters.map(y => x + y));
    return boxes.findIndex(x => x.includes(gridLocation));
}

export function includesEach(arr, eachValue) {
    return eachValue.every(x => arr.includes(x));
  }

export function getParam(gridParam) {
    if (gridParam.length === 9) {
      if ( rowSets.some(set => includesEach(gridParam, set)) ) {
        return "Row";
      }
      if ( columnSets.some(set => includesEach(gridParam, set)) ) {
        return "Column";
      }
      if ( boxSets.some(set => includesEach(gridParam, set)) ) {
        return "Box";
      }
    }
    return false;
  }

export function getRelCell(gridLocation) {
    const allRelCell = getRow(gridLocation).concat(getColumn(gridLocation), getBox(gridLocation));
    return [...new Set(allRelCell)];
}

export function getOpen(gridParam, sudokuGrid) {
    return gridParam.filter(x => typeof sudokuGrid[x] === "object");
}

export function getSolved(gridParam, sudokuGrid) {
    return gridParam.filter(x => typeof sudokuGrid[x] === "number");
}

export function getValues(gridParam, sudokuGrid) {
    return gridParam.map(x => sudokuGrid[x]);
}

export function getUniqueValues(gridValues) {
    const flatValues = gridValues.flat();
    return [1,2,3,4,5,6,7,8,9].filter(x => flatValues.includes(x));
}

const composeValues = (fn1, fn2) => (gridParam, sudokuGrid) => fn1(fn2(gridParam, sudokuGrid), sudokuGrid);
export const getOpenValues = composeValues(getValues, getOpen);
export const getSolvedValues = composeValues(getValues, getSolved);

const composeUniqueValues = (fn1, fn2) => (gridParam, sudokuGrid) => fn1(fn2(gridParam, sudokuGrid));
export const getUniqueOpenValues = composeUniqueValues(getUniqueValues, getOpenValues);
export const getUniqueSolvedValues = composeUniqueValues(getUniqueValues, getSolvedValues);;






export function toGridArray(gridString) {
    //const lengthError = Error("submitted sudoku grid is wrong length");
    if (gridString.length !== 81) {
        return false;
    }
    return gridString.split("").map(x => x === "0" ? [] : JSON.parse(x))
}

export function toGridString(gridArray) {
    //const lengthError = Error("submitted sudoku grid is wrong length");
    if (gridArray.length !== 81) {
        return false;
    }
    return gridArray.map(x => typeof x !== "number" ? 0 : x).join("");
}

// format starting grid to list possible answers for unanswered cells
// only used in beginning, updateRelCell and processSolution used during analysis
export function formatGridArray(startingGrid) {
    return startingGrid.map((item, index) => {
        if (typeof item === "number") {
            return item;
        }
        const solvedValues = getUniqueValues(getValues(getSolved(getRelCell(index), startingGrid), startingGrid)); // closure?
        return [1,2,3,4,5,6,7,8,9].filter(answer => !solvedValues.includes(answer));
    });
}

export const formatGrid = gridString => formatGridArray(toGridArray(gridString));

// cross-reference one param with another while removing any cells that overlap
export function getExternal(baseParam, extParam) {
    return extParam.filter(x => !baseParam.includes(x));
}

// cross-reference one param with another while removing any cells that overlap
export function getOpenExternal(baseParam, extParam, sudokuGrid) {
    return getOpen(extParam.filter(x => !baseParam.includes(x)), sudokuGrid);
}

// get external cells in cross-referenced param while filtering out indexes
// that don't contain required answer(s)
export function getOpenExternalWith(baseParam, extParam, sudokuGrid, answerArray) { 
    const ansArr = [].concat(answerArray); // error handling for number instead of array
    return getOpenExternal(baseParam, extParam, sudokuGrid)
        .filter(x => ansArr.every(y => sudokuGrid[x].includes(y)));
}

// find cells in given param that contain required answer(s)
export function getOpenCellsWith(gridParam, sudokuGrid, answerArray) {
    const ansArr = [].concat(answerArray); // error handling for number instead of array
    return getOpen(gridParam, sudokuGrid).filter(x => ansArr.every(y => sudokuGrid[x].includes(y)));
}