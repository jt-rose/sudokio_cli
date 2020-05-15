import { checkValid } from "./checkValid";
import solveWithStandardOptions from "./applyStratsWithChains";

const checkAndSolve = gridString => {
    const confirmValid = checkValid(gridString);
    if (!confirmValid.valid) {
        return confirmValid;
    } else {
        const attempt = solveWithStandardOptions(confirmValid.formattedGrid);
        const strategiesUsed = [...new Set(attempt.solutions.map(x => x.strategy))];
        return {
            gridString: confirmValid.gridString,
            formattedGrid: confirmValid.formattedGrid,
            recurSolution: confirmValid.solution,
            ...attempt,
            strategiesUsed,
            valid: true,
            
        };
    }
}

export default checkAndSolve;