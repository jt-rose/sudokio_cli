import { assert } from "chai";
import {
    solveXChain,
    solveXChainFullGrid
} from "../solvers/strategies/chains";
import {
    xChainGrid,
    unansweredGrid
} from "./gridSamplesForTesting";

describe("Solve Force Chains", function() {
    it("correct force chain of length 2, applied to single cell", function() {
        // cellinit 30, update: cell 22 and 76 remove 3 and 9
        const xChainAnswer = solveXChain(xChainGrid, 30);
        assert.equal(xChainAnswer.updates[0].index, 22);
        assert.sameOrderedMembers(xChainAnswer.updates[0].currentAnswer, [3,5,8,9]);
        assert.sameOrderedMembers(xChainAnswer.updates[0].updatedAnswer, [5,8]);
        
        assert.equal(xChainAnswer.updates[1].index, 76);
        assert.sameOrderedMembers(xChainAnswer.updates[1].currentAnswer, [3,5,8,9]);
        assert.sameOrderedMembers(xChainAnswer.updates[1].updatedAnswer, [5,8]);
    });
    it("correct force chain of length 2, applied to full grid", function() {
        const xChainFullGridAnswer = solveXChainFullGrid(xChainGrid);

        assert.equal(xChainFullGridAnswer.length, 12);

        const expectedCellsWithXChain = [15, 30, 40, 44, 46, 47, 52, 67, 69, 72, 73, 79];
        const cellsWithXChainFound = xChainFullGridAnswer.map(solution => solution.cellInit);
        assert.sameOrderedMembers(expectedCellsWithXChain, cellsWithXChainFound);

        const expectedRoundsTaken = [3, 2, 1, 3, 3, 4, 3, 1, 2, 1, 1, 3];
        const actualRoundsTaken = xChainFullGridAnswer.map(solution => solution.totalChainRounds);
        assert.sameOrderedMembers(expectedRoundsTaken, actualRoundsTaken);

        const expectedFirstUpdatesWithCurrentAnswers = [
            [3,5,8,9],//1
            [3,5,8,9],//2
            [3,5,8,9],//3
            [3,6,9],//4
            [1,3,6,9],//5
            [3,6,9],//6
            [3,4,6,9],//7
            [3,5,8,9],//8
            [3,5,8,9],//9 
            [3,6,8,9],//10
            [3,6,8,9],//11
            [3,5,8,9]//12
        ];
        const actualFirstUpdatesWithCurrentAnswers = xChainFullGridAnswer
            .map(solution => solution.updates[0].currentAnswer);
        assert.sameDeepOrderedMembers(expectedFirstUpdatesWithCurrentAnswers, actualFirstUpdatesWithCurrentAnswers);

        const expectedFirstUpdatesWithUpdatedAnswers = [
            [5,8,9],//1
            [5,8],//2
            [5,8],//3
            [6,9],//4
            [1,3,9],//5
            [6,9],//6
            [3,4,9],//7
            [5,8],//8
            [5,8,9],//9 
            [3,6,8],//10
            [3,6,8],//11
            [3,5,8]//12
        ];
        const actualFirstUpdatesWithUpdatedAnswers = xChainFullGridAnswer
            .map(solution => solution.updates[0].updatedAnswer);
        assert.sameDeepOrderedMembers(expectedFirstUpdatesWithUpdatedAnswers, actualFirstUpdatesWithUpdatedAnswers);

        /*
        // use to check results in detail within console log
        const util = require('util');
        xChainFullGridAnswer.forEach(x => console.log(util.inspect(x, false, null, true)));
        console.log(`The full length is ${xChainFullGridAnswer.length}`);
        */
    });
    it("correct rejection", function() {
        const solutionList = solveXChain(unansweredGrid, 40);
        assert.equal(solutionList, false);

        const solutionList2 = solveXChainFullGrid(unansweredGrid);
        assert.equal(solutionList2, false);
    });
});