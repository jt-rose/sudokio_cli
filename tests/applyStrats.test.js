import { assert } from "chai";
import {
    applyStrats,
    limitStratsTo,
    applyStratsUntilDone
} from "../solvers/applyStrats";
import {
    basicPuzzleGrid,
    basicPuzzleAnswer,
    singleParamRowGrid,
    boxNarrowGrid1,
    XWingGrid3,
    XWingGrid3Answer,
    swordfishGrid1,
    swordfishGrid3
} from "./gridSamplesForTesting";

describe("Apply singleParam-focused solution to multiple params", function() {
    it("valid multiple returns", function() {
        const solutionList = applyStrats(limitStratsTo("solveSingleOption"))(basicPuzzleGrid);
        assert.equal(solutionList.length, 4);

        const cellsFound = solutionList.map(x => x.cellInit);
        assert.sameMembers(cellsFound, [40,59,62,70])
    });
});
describe("Apply series of strategies to grid", function() {
    it("correctly find first solution in list", function() {
        const stratCycle = applyStrats();
        const singleOptionFound = stratCycle(basicPuzzleGrid);
        assert.equal(singleOptionFound.length, 4);
        assert.equal(singleOptionFound[0].strategy, "singleOption-MultiParam");
        assert.sameMembers(singleOptionFound.flatMap(x => x.cellInit), [40,59,62,70]);

        const singleParamFound = stratCycle(singleParamRowGrid);
        assert.equal(singleParamFound.length, 3);
        assert.equal(singleParamFound[0].strategy, "singleParam-Row");
        assert.equal(singleParamFound[0].cellInit, 11);

        const boxNarrowFound = stratCycle(boxNarrowGrid1);
        // singleOption found first, recommended before boxNarrow
        assert.equal(boxNarrowFound.length, 4);
        assert.equal(boxNarrowFound[0].strategy, "singleOption-Box");
        assert.sameMembers(boxNarrowFound.flatMap(x => x.cellInit), [1,21,29,37]);


        const upToSingleParam = applyStrats(limitStratsTo("solveSingleParam"));
        const boxNarrowNotFound = upToSingleParam(swordfishGrid1);
        assert.equal(boxNarrowNotFound, false);
        const answerFound = stratCycle(swordfishGrid1);
        assert.equal(answerFound.length, 2);
        assert.equal(answerFound[0].strategy, "boxNarrow");
    });

    it("continuously apply found solutions until none left", function() {
        // test basic puzzle
        const stratCycle = applyStratsUntilDone();
        const stratResult = stratCycle(basicPuzzleGrid);
        assert.sameOrderedMembers(stratResult.updatedGrid, basicPuzzleAnswer);
        assert.equal(stratResult.solutions.length, 51);
        assert.equal(stratResult.solutions[50].round, 14);

        const onlySingleOption = stratResult.solutions
        .filter(x => x.strategy.match("singleOption"));
        assert.equal(onlySingleOption.length, 51);

        const stratsFound = [...new Set(onlySingleOption.map(x => x.strategy))];
        assert.equal(stratsFound.length, 4);
        
        // test puzzle containing xWing
        const XWingResult = stratCycle(XWingGrid3);
        assert.sameOrderedMembers(XWingResult.updatedGrid, XWingGrid3Answer);
        assert.isTrue(XWingResult.solutions.map(x => x.strategy).includes("X-Wing"));

        // test puzzle with swordfish strategy
        const swordfishResult = stratCycle(swordfishGrid3);
        assert.isTrue(swordfishResult.solutions.map(x => x.strategy).includes("Swordfish"));
    });
})