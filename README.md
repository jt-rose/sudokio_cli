# Sudokio Solver Algorithms
Sudokio is a website-in-progress that analyzes sudoku puzzles using human strategies (not recursive backtracking, the traditional CS method for solving sudoku) and provides hints and teaches the user how to complete various puzzles. The Solver Algorithms take a given puzzle and attempt to make progress step by step using a sequence of increasingly complex strategies. The goal is to record what strategies were used where, rank puzzle dificulty, and provide teaching tools to users.

The Solver Algorithms were developed with a functional programming style and are now complete and fully tested using Jest/Chai. The code structure is modeled after modular React patterns.

### Dependencies
* [node.js] - for running the CLI
* [ramda] - functional programming tools
* [esm] - allow for import syntax in node
* [prompt] - better CLI presentation
* [jest]- testing suite
* [chai] - advanced assertion library
* [jest-esm-transformer] - esm compatibility with Jest


### Using the Solver Algorithm
The solver algorithm is meant to be used through a UI on the Sudokio website, which is still in progress. However, a basic version of the solver can be used from the command line with the following steps:

1. Download the files from github
1. Move to the parent folder from the command line
1. Install dependencies using `npm install` or `yarn install`
1. Start the program with `npm start` or `yarn start`

This program will first confirm the puzzle is valid (and return an error message if it’s not) before attempting to solve it using a series of human strategies and returning the solved/ updated puzzle along with the step-by-step solutions.

### Future Plans
The next major phases are to: 
* Build the puzzle database, containing info on various puzzles, their solutions, strategies used, and difficulty ranking
* Build the user database, storing user info on puzzles solved, puzzles saved, scores, strategy tests cleared, etc.
* Build the UI layer for the actual Sudokio website

I may also implement some more minor updates to the solver algorithms, such as replacing the ramda dependency with homegrown helper functions.

## Data Structure - How it all works
### Representing the Sudoku Grid
Sudoku puzzles can be initially submitted as a single 81 character string (called the gridString in the codebase) with unanswered cells represented by the number 0:

`"530070000600195000098000060800060003400803001700020006060000280000419005000080079"`

Sudokio then formats the puzzle into an array (called the sudokuGrid in the codebase). A formatted puzzle represents answered cells as the number they are answered with, and unanswered cells as an array holding the currently possible answers. For example, the first few of the above would become:

`“530070…”`   =>   `[ 5, 3, [1,2,4], [2,6], 7, [2,4,6,8], …]`

Therefore, a cell with `[1, 2, 4]` is unanswered, but based on the current state of the puzzle, could only be a 1, 2, or 4.

A cell with `[7]` is unanswered, but has only one possible answer left and will be recognized as answered on the next move. For example, if a row had the following: 

`[1, 2, 3, 4, [5], 6, 7, 8, 9]`
Then the middle cell could only be a 5, and on the next turn would be solved and represented as:

`[1, 2, 3, 4, 5, 6, 7, 8, 9]`

…with the subarray replaced by the answer, number 5.
This structure is important because several strategies work by narrowing possible answers down and then using another strategy to solve what is left.  That would be represented by the following:
`[1,2,3,4]` => `[1,2,4]` => `2`

### Calculating Grid Relationships
The “cellIndex”, or array index of each cell (using CS numbering 0-80), can be provided to a number of functions that return which cells are in the same row, column, or box.

The command `getRow(5)` will return the index numbers of the first row: `[0,1,2,3,4,5,6,7,8]`

The command `getColumn(9)` will return the index numbers of the first column: `[0,9,18,27,36,45,54,63,72]`

The command `getBox(2)` will return the index numbers of the first Box: `[0,1,2,9,10,11,18,19,20]`

These are also stored in an object called `cellPath` that maps out all relationships for the different parameters(row, column, box).

A number of other functions are used to check the current puzzle, finding, for example, all cells that are solved in a given row:

`getSolved(param, sudokuGrid)`

…or all open values for a particular box:

`getOpenValues(param, sudokuGrid)`

These functions are used frequently within the strategies to focus on valid data.



### Confirming Grid is Valid
Before running a test on a submitted gridString, the `checkValid()` function (or `checkAndSolve()`, which incorporates it)  is run to confirm the grid is valid before applying any strategies. An error messages is returned when not valid.
The `checkValid()` function is composed of many smaller functions, that check for a number of obvious issues with the submitted gridString, such as:
* Incorrect data type (not a string)
* Incorrect length (not 81 characters)
* Incorrect data provided (character other than 0-9 present)
* At least 16 answer numbers provided (the minimum for a viable sudoku)

If the gridString passes these initial checks, it is then formatted into the required data structure (outlined above) and tested against the following check:
* Obvious contradiction (such as a repeating number in the same parameter)

Passing all these, the formatted grid will then:
* Test against a traditional sudoku solver algorithm

This uses recursive backtracking to answer the puzzle or confirm it has an error not found by any of the previous checks.

In the future, an additional check will be added to see if the submitted puzzle is stored in the Sudokio database. The database is still being developed, so this will be added later.

### Testing Grid Against Various Strategies
The heart of Sudokio is the various strategies it can run against the submitted puzzle. At present, the following strategies are attempted across all relevant parts of the puzzle, in order:
* singleOption
* singleParam
* boxNarrow
* nakedPairings – nakedPairs, nakedTriples, nakedQuads, and cascades
* hiddenPairings – hiddenPairs, hiddenTriples, hiddenQuads
* fish – X-Wing, Swordfish, Jellyfish
* chains – X-Chain

Each puzzle is built to be tested against the smallest possible parameter, whether a single cell, or row/ column/ box. In the case of the fish functions, it was more efficient to scan the full sudoku puzzle at once.

The `solveEach()` function is then used to create a standard version of each of these strategies that will scan all relevant parameters in the puzzle. In other words, a function built to be used on one cell or row will then be tested against all relevant cells or rows and collect all possible answers across the grid at that time.

These functions do not directly update the puzzle, but instead return a solution object with information on what strategy was used, what cells did it start on (the “cellInit”), what updates are now possible, and any other relevant notes. This solution can then be applied to update the sudoku puzzle. By creating this break point between the strategy found and the update of the puzzle, we can record lots of data while also being able to present it to a user without automatically updating the puzzle for them – gives us lots of options for suggesting hints or creating demonstrations.

A standard list of strategies will be applied, but this can be adjusted using the `limitStratsTo()` function, so if for example you want to check only against the first three strategies, you can do that. This is especially helpful in structuring chains, which can be easily adjusted to apply any number of other strategies, including further chains!

### Filtering and Applying the Best Answer Each Turn
When applying a strategy across the full sudoku puzzle, we may find multiple “hits” where the strategy can be applied. To prioritize the best answers (those that are easiest to find while providing the most benefit), the `filterBest()` function is used to then pick the best single answer or group of answers (when appropriate, such as for singleOption). For example, a chain might be found that only requires one or two rounds of updates, and this would be preferable to using a chain with several rounds. We will then rerun the strategies to see if applying the first solution opens up simpler answers that can avoid the more complex chain altogether.

The `applySolution()` function mentioned in the last section is used after filtering the best present solution. This function will update the sudoku puzzle, solving and updating answer options for each relevant cell.

A `sortBest()` function is also available to sort answers according to filterBest while still providing them all. This will be used on the site to show all currently possible applications of a particular strategy, from most recommended to least. 

### Testing Grid to Completion
The `solveWithStandardOptions()` function is used recursively to find the best current solution, apply it to the puzzle, and then pass the updated puzzle and solution list to the next recursive loop, until either the puzzle is fully solved (with all solution data carried through), or return an incomplete puzzle with the most updates possible.

This function is bundled with the `checkValid()` function to create the `checkAndSolve()` function. This final function abstracts away everything and allows the user to simply submit a gridString and get a result.

### Flexible Solver Algorithms
The base function for the nakedPairing, hiddenPairing, fish, and chain strategies have all been designed to take advantage of currying to adjust them as needed. For example, the `nakedPairing()` function has been used to create the `nakedPairs()`, `nakedTriples()`, and `nakedQuads()` functions; however, we could easily use it to create a function that checks for sets of 5 or more if needed. In the case of the chains function, we have only set it up to check for basic solutions using the `singleOption()` function, but this could easily be scaled to look for increasingly complex strategies (including even other chains). 

[node.js]: <http://nodejs.org>
[ramda]: <https://ramdajs.com>
[esm]: <https://www.npmjs.com/package/esm>
[prompt]: <https://www.npmjs.com/package/prompt>
[jest]: <https://jestjs.io/>
[chai]: <https://www.chaijs.com/>
[jest-esm-transformer]: <https://www.npmjs.com/package/jest-esm-transformer>