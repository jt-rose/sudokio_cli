import solveWithStandardOptions from "../solvers/applyStratsWithChains";
import { assert } from "chai";
import { applyStratsUntilDone } from "../solvers/applyStrats";
import { xChainGrid } from "./gridSamplesForTesting";

describe("Solve puzzle using standard options, including X-chain", function() {
    it("Found X-chain solution when no others will make progress", function() {
        const attemptWithoutChains = applyStratsUntilDone()(xChainGrid);
        assert.equal(attemptWithoutChains.solved, false);
        const withoutChainsStrategiesFound = attemptWithoutChains.solutions.map(x => x.strategy);
        assert.isNotTrue(withoutChainsStrategiesFound.includes("X-Chain"));

        const attemptWithChains = solveWithStandardOptions(xChainGrid);
        assert.equal(attemptWithChains.solved, true);
        const withChainsStrategiesFound = attemptWithChains.solutions.map(x => x.strategy);
        assert.isTrue(withChainsStrategiesFound.includes("X-Chain"));
    });
});