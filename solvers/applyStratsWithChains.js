import {
    strategyList,
    applyStrats,
    applyStratsUntilDone
} from "./applyStrats";
import {
    solveXChainFullGrid
} from "./strategies/chains";

// functions for applyStrats with chains added in
const strategyListWithChains = {
    ...strategyList,
    solveXChainFullGrid
};

const applyStratsWithChains = applyStrats(strategyListWithChains);

// attempts to fully solve grid, using variety of human strategies
// while searching for the easiest and most effective solutions
// each round. 
const solveWithStandardOptions = applyStratsUntilDone(applyStratsWithChains);

export default solveWithStandardOptions;