import { assert } from "chai";
import {
    getBox
} from "../solvers/cellPath";
import solveBoxNarrow from "../solvers/strategies/boxNarrow";
import {
    boxNarrowGrid1,
    boxNarrowGrid2,
    unansweredGrid
} from "./gridSamplesForTesting";

const solutionList1 = solveBoxNarrow(boxNarrowGrid1, getBox(40));
const solutionList2 = solveBoxNarrow(boxNarrowGrid2, getBox(0));

describe("3. Solve boxNarrow", function() {
    it("valid solutions list for single-row answers", function() {
        assert.equal(solutionList1.length, 4);

        // check for valid solution content (single-row) at 2nd position of array
        assert.equal(solutionList1[1].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList1[1].cellInit, [48,49]);
        assert.equal(solutionList1[1].narrow.length, 3);
        assert.equal(solutionList1[1].narrow[0].index, 45);
        assert.sameOrderedMembers(solutionList1[1].narrow[0].updatedAnswer, [7,9]);
        assert.equal(solutionList1[1].narrow[1].index, 52);
        assert.sameOrderedMembers(solutionList1[1].narrow[1].updatedAnswer, [5,6,7]);
        assert.equal(solutionList1[1].narrow[2].index, 53);
        assert.sameOrderedMembers(solutionList1[1].narrow[2].updatedAnswer, [5,6]);
        assert.equal(solutionList1[1].solved.length, 0);

        // check for valid solution content (single-row) at 4th position of array
        assert.equal(solutionList1[3].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList1[3].cellInit, [48,49]);
        assert.equal(solutionList1[3].narrow.length, 1);
        assert.equal(solutionList1[3].narrow[0].index, 45);
        assert.sameOrderedMembers(solutionList1[3].narrow[0].updatedAnswer, [2,7]);
        assert.equal(solutionList1[3].solved.length, 0);

        // check for valid solution content (single-row) for 2nd example grid
        assert.equal(solutionList2.length, 2);

        // check for valid solution content (single-row) at  start of array
        assert.equal(solutionList2[0].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList2[0].cellInit, [18,19]);
        assert.equal(solutionList2[0].narrow.length, 1);
        assert.equal(solutionList2[0].narrow[0].index, 23);
        assert.sameOrderedMembers(solutionList2[0].narrow[0].updatedAnswer, [2,9]);
        assert.equal(solutionList2[0].solved.length, 0);

        // check for valid solution content (single-row) at 2nd position of array
        assert.equal(solutionList2[1].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList2[1].cellInit, [1,2]);
        assert.equal(solutionList2[1].narrow.length, 0);
        assert.equal(solutionList2[1].solved.length, 1);
        assert.equal(solutionList2[1].solved[0].index, 6);
        assert.sameOrderedMembers(solutionList2[1].solved[0].updatedAnswer, [9]);
        });
    it("valid solutions list for single-column answers", function() {
        assert.equal(solutionList1.length, 4);

        // check for valid solution content (single-column) at start of array
        assert.equal(solutionList1[0].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList1[0].cellInit, [32,41]);
        assert.equal(solutionList1[0].narrow.length, 2);
        assert.equal(solutionList1[0].narrow[0].index, 59);
        assert.sameOrderedMembers(solutionList1[0].narrow[0].updatedAnswer, [3,7,8]);
        assert.equal(solutionList1[0].narrow[1].index, 77);
        assert.sameOrderedMembers(solutionList1[0].narrow[1].updatedAnswer, [3,6,7,8]);
        assert.equal(solutionList1[0].solved.length, 0);

        // check for valid solution content (single-column) at 3rd position of array
        assert.equal(solutionList1[2].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList1[2].cellInit, [32,41]);
        assert.equal(solutionList1[2].narrow.length, 2);
        assert.equal(solutionList1[2].narrow[0].index, 59);
        assert.sameOrderedMembers(solutionList1[2].narrow[0].updatedAnswer, [1,7,8]);
        assert.equal(solutionList1[2].narrow[1].index, 77);
        assert.sameOrderedMembers(solutionList1[2].narrow[1].updatedAnswer, [1,6,7,8]); 
        assert.equal(solutionList1[2].solved.length, 1);
        assert.equal(solutionList1[2].solved[0].index, 5);
        assert.sameOrderedMembers(solutionList1[2].solved[0].updatedAnswer, [8]);

        // check for valid solution content (single-column) for 2nd example grid
        const solutionList2 = solveBoxNarrow(boxNarrowGrid2, getBox(76));
        assert.equal(solutionList2.length, 1);
        
        // check for valid solution content (single-row) at start of array
        assert.equal(solutionList2[0].strategy, "boxNarrow");
        assert.sameOrderedMembers(solutionList2[0].cellInit, [59,68]);
        assert.equal(solutionList1[2].narrow.length, 2);
        assert.equal(solutionList2[0].narrow[0].index, 14);
        assert.sameOrderedMembers(solutionList2[0].narrow[0].updatedAnswer, [1,5]);
        assert.equal(solutionList2[0].narrow[1].index, 23);
        assert.sameOrderedMembers(solutionList2[0].narrow[1].updatedAnswer, [1,2]);
        assert.equal(solutionList2[0].solved.length, 0);
    });
    it("valid rejection when not solvable", function() {
        const unansweredAttempt1 = solveBoxNarrow(unansweredGrid, getBox(80));
        assert.equal(unansweredAttempt1, false);

        const unansweredAttempt2 = solveBoxNarrow(unansweredGrid, getBox(40));
        assert.equal(unansweredAttempt2, false);
    });
});