import { assert } from "chai";
import {
    checkGridDataType,
    checkGridLength,
    checkMinimumAnswered,
    checkOnlyNumbers,
    checkNoObviousErrors,
    checkValid,
    isComplete,
    isCorrectSoFar,
    isCompleteAndCorrect
} from "../solvers/checkValid";
import {
    wrongDataType,
    gridStringTooShort,
    gridStringNotEnoughAnswers,
    gridStringWithLetters,
    gridStringWithContradictions,
    gridWithContradictions,
    gridStringHiddenError,
    basicPuzzleAnswer,
    basicPuzzleGrid,
    basicPuzzleGridString,
    incorrectGrid,
    incorrectGrid2
} from "./gridSamplesForTesting";

describe("Check User submitted grids are valid", function() {
    it("correct grid data type", function() {
        assert.equal(checkGridDataType(basicPuzzleGridString), true);
        assert.equal(checkGridDataType(wrongDataType), false);
    });
    it("correct grid length", function() {
        assert.equal(checkGridLength(basicPuzzleGridString), true);
        assert.equal(checkGridLength(gridStringTooShort), false);
    });
    it("minimum amount of cells answered for valid sudoku", function() {
        assert.equal(checkMinimumAnswered(basicPuzzleGridString), true);
        assert.equal(checkMinimumAnswered(gridStringNotEnoughAnswers), false);
    });
    it("only numbers provided as data (no other characters)", function() {
        assert.equal(checkOnlyNumbers(basicPuzzleGridString), true);
        assert.equal(checkOnlyNumbers(gridStringWithLetters), false);
    });
    it("no obvious contradictions (EX: two 9's in same row)", function() {
        assert.equal(checkNoObviousErrors(basicPuzzleGrid), true);
        assert.equal(checkNoObviousErrors(gridWithContradictions), false);
    });
    /*it("check database to see if answer already present", function() {
        // wil add after DB is set up
    });*/
    it("combine above to perform complete checkValid function", function() {
        const confirmValid = checkValid(basicPuzzleGridString);
        assert.equal(confirmValid.valid, true);

        const confirmInvalidDataType = checkValid(wrongDataType);
        const invalidDataTypeMSG = "The submitted grid must be submitted as an 81 character string with 0 representing unsolved cells";
        assert.equal(confirmInvalidDataType.valid, false);
        assert.equal(confirmInvalidDataType.errorType, invalidDataTypeMSG);

        const confirmInvalidLength = checkValid(gridStringTooShort);
        const invalidLengthMSG = "The submitted grid is not the right length and should have exactly 81 characters";
        assert.equal(confirmInvalidLength.valid, false);
        assert.equal(confirmInvalidLength.errorType, invalidLengthMSG);

        const confirmInvalidAmountSolved = checkValid(gridStringNotEnoughAnswers);
        const invalidAmountSolvedMSG = "The submitted grid should have at least 16 cells answered to eb a valid sudoku puzzle";
        assert.equal(confirmInvalidAmountSolved.valid, false);
        assert.equal(confirmInvalidAmountSolved.errorType, invalidAmountSolvedMSG);

        const confirmInvalidCharacters = checkValid(gridStringWithLetters);
        const invalidCharactersMSG = "The submitted grid should only have numbers 0-9, with 0 representing an unsolved cell";
        assert.equal(confirmInvalidCharacters.valid, false);
        assert.equal(confirmInvalidCharacters.errorType, invalidCharactersMSG);

        const confirmInvalidContradictions = checkValid(gridStringWithContradictions);
        const invalidContradictionsMSG = "The submitted grid has an error, with a number occuring more than once in the same row, column, or box";
        assert.equal(confirmInvalidContradictions.valid, false);
        assert.equal(confirmInvalidContradictions.errorType, invalidContradictionsMSG);

        const confirmInvalidAfterAttempt = checkValid(gridStringHiddenError);
        const invalidHiddenErrorMSG = "Our solver has shown that this puzzle is invalid and has an error";
        assert.equal(confirmInvalidAfterAttempt.valid, false);
        assert.equal(confirmInvalidAfterAttempt.errorType, invalidHiddenErrorMSG);
    });
})
describe("Check that in-progress sudokuGrid is complete and/or correct", function() {
    it("complete", function() {
        assert.equal(isComplete(basicPuzzleAnswer), true);
        assert.equal(isComplete(basicPuzzleGrid), false);
        assert.equal(isComplete(incorrectGrid2), false);
    });
    it("correct", function() {
        assert.equal(isCorrectSoFar(basicPuzzleAnswer), true);
        assert.equal(isCorrectSoFar(basicPuzzleGrid), true);
        assert.equal(isCorrectSoFar(incorrectGrid2), false);
        assert.equal(isCorrectSoFar(incorrectGrid), false);
    });
    it("complete and correct", function() {
        assert.equal(isCompleteAndCorrect(basicPuzzleAnswer), true);
        assert.equal(isCompleteAndCorrect(basicPuzzleGrid), false);
        assert.equal(isCompleteAndCorrect(incorrectGrid2), false);
        assert.equal(isCompleteAndCorrect(incorrectGrid), false);
    });
});