import { assert } from "chai";
import solveTraditional from "../solvers/strategies/recurSolve";
import {
    incorrectGrid,
    basicPuzzleGrid,
    basicPuzzleAnswer
} from "./gridSamplesForTesting";

describe("Test traditional CS method - recursive backtracking", function() {
    it("correct answer", function() {
        const solved = solveTraditional(basicPuzzleGrid);
        assert.sameOrderedMembers(solved, basicPuzzleAnswer);
    });
    it("correct rejection", function() {
        assert.equal(solveTraditional(incorrectGrid), false);
    });
});