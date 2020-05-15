import { assert } from "chai";
import * as R from "ramda";
import solveSingleOption from "../solvers/strategies/singleOption";
import {
    singleOptionGrid
} from "./gridSamplesForTesting";

describe("1. Solve Single Option", function() {
    it("valid solution for single parameter - row", function() {
        const solution = solveSingleOption(singleOptionGrid, 5);
        assert.sameOrderedMembers(singleOptionGrid[5], [6]);
        assert.equal(solution.solved[0].index, 5);
        assert.sameOrderedMembers(solution.solved[0].updatedAnswer, [6]);
        assert.equal(solution.strategy, "singleOption-Row");
    });
    it("valid solution for single parameter - column", function() {
        const solution2 = solveSingleOption(singleOptionGrid, 63);
        assert.sameOrderedMembers(singleOptionGrid[63], [8]);
        assert.equal(solution2.solved[0].index, 63);
        assert.sameOrderedMembers(solution2.solved[0].updatedAnswer, [8]);
        assert.equal(solution2.strategy, "singleOption-Column");
    });
    it("valid solution for single parameter - box", function() {
        const solution3 = solveSingleOption(singleOptionGrid, 16);
        assert.sameOrderedMembers(singleOptionGrid[16], [5]);
        assert.equal(solution3.solved[0].index, 16);
        assert.sameOrderedMembers(solution3.solved[0].updatedAnswer, [5]);
        assert.equal(solution3.strategy, "singleOption-Box");
    });
    it("valid solution for multiple parameters", function() {
        const solution4 = solveSingleOption(singleOptionGrid, 22);
        assert.sameOrderedMembers(singleOptionGrid[22], [2]);
        assert.equal(solution4.solved[0].index, 22);
        assert.sameOrderedMembers(solution4.solved[0].updatedAnswer, [2]);
        assert.equal(solution4.strategy, "singleOption-MultiParam");
    });
    it("valid solution for multiple parameters assisted by advanced strategy narrowing", function() {
        const gridArray3 = R.update(80, [1], singleOptionGrid);
        //const gridArray3 = gridArray2.map((x, index) => index === 80 ? [1] : x);
        
        const solution5 = solveSingleOption(gridArray3, 80);
        assert.equal(solution5.solved[0].index, 80);
        assert.sameOrderedMembers(solution5.solved[0].updatedAnswer, [1]);
        assert.equal(solution5.strategy, "singleOption-Narrowing");
    });
    it("valid rejections for cells already solved/ not solvable", function() {
        assert.equal(solveSingleOption(singleOptionGrid, 0), false);
        assert.equal(solveSingleOption(singleOptionGrid, 75), false);
    });
});