import { assert } from "chai";
import checkAndSolve from "../solvers/checkAndSolve";
import {
    gridStringTooShort,
    gridStringNotEnoughAnswers,
    basicPuzzleGridString,
    basicPuzzleAnswer,
    xChainGridString
} from "./gridSamplesForTesting";

describe("Confirm submitted puzzle is valid and attempt solution", function() {
    it("reject for having incorrect amount of data for puzzle. EX: only 80 cells", function() {
        const confirmInvalidLength = checkAndSolve(gridStringTooShort);
        const invalidLengthMSG = "The submitted grid is not the right length and should have exactly 81 characters";
        assert.equal(confirmInvalidLength.valid, false);
        assert.equal(confirmInvalidLength.errorType, invalidLengthMSG);
    });
    it("reject for having too few cells solved at start. EX: only 15 cells", function() {
        const confirmInvalidAmountSolved = checkAndSolve(gridStringNotEnoughAnswers);
        const invalidAmountSolvedMSG = "The submitted grid should have at least 16 cells answered to eb a valid sudoku puzzle";
        assert.equal(confirmInvalidAmountSolved.valid, false);
        assert.equal(confirmInvalidAmountSolved.errorType, invalidAmountSolvedMSG);
    });
    it("solve basic puzzle", function() {
        const solveBasicPuzzle = checkAndSolve(basicPuzzleGridString);
        assert.equal(solveBasicPuzzle.valid, true);
        assert.equal(solveBasicPuzzle.solved, true);
        assert.sameOrderedMembers(solveBasicPuzzle.updatedGrid, basicPuzzleAnswer);
    });
    it("solve advanced puzzle", function() {
        const solveAdvancedPuzzle = checkAndSolve(xChainGridString);
        assert.equal(solveAdvancedPuzzle.valid, true);
        assert.equal(solveAdvancedPuzzle.solved, true);
        assert.isTrue(solveAdvancedPuzzle.strategiesUsed.includes("X-Chain"));
    });
})