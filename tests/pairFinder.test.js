import { assert } from "chai";
import {
    pairs,
    triples,
    quads
} from "../solvers/strategies/pairFinder";

const testArray = [1,2,3,4,5];

describe("Correct finding of all possible pairings of data from array, ignoring order", function() {
    it("correct grouping of sets of two", function() {
        const expectedPairs = [
            [1,2],
            [1,3],
            [1,4],
            [1,5],
            [2,3],
            [2,4],
            [2,5],
            [3,4],
            [3,5],
            [4,5]
        ];
        assert.sameDeepMembers(pairs(testArray), expectedPairs);
    });
    it("correct grouping of sets of three", function() {
        const expectedTriples = [
            [1,2,3],
            [1,2,4],
            [1,2,5],
            [1,3,4],
            [1,3,5],
            [1,4,5],
            [2,3,4],
            [2,3,5],
            [2,4,5],
            [3,4,5]
        ];
        assert.sameDeepMembers(triples(testArray), expectedTriples);
    });
    it("correct grouping of sets of four", function() {
        const expectedQuads = [
            [1,2,3,4],
            [1,2,3,5],
            [1,2,4,5],
            [1,3,4,5],
            [2,3,4,5]
        ];
        assert.sameDeepMembers(quads(testArray), expectedQuads);
    });
})