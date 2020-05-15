import { formatGrid } from "../solvers/cellPath";

// This file stores various sudoku grids for testing different strategies and functions

// Invalid grids
export const wrongDataType = ["I'm an array when I should be a string!"];
export const gridStringTooShort = "123456789";
export const gridStringNotEnoughAnswers = "123456789123456000000000000000000000000000000000000000000000000000000000000000000";
export const gridStringWithLetters = "A30070000600195000098000060800060003400803001700020006060000280000419005000080079";
export const gridStringWithContradictions = "550070000600195000098000060800060003400803001700020006060000280000419005000080079";
export const gridWithContradictions = formatGrid(gridStringWithContradictions);
export const gridStringHiddenError = "130070000600195000098000060800060003400803001700020006060000280000419005000080079";
const unansweredGridString = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";
export const unansweredGrid = formatGrid(unansweredGridString);
const incorrectGridString1 = "990000000002000000003000000004000000005000000006000000007000000008000000001000000";
export const incorrectGrid = formatGrid(incorrectGridString1);
const incorrectGridString2 = "550070000600195000098000060800060003400803001700020006060000280000419005000080079"
export const incorrectGrid2 = formatGrid(incorrectGridString2);

// cellPath/ solutionObject/ recurSolve
export const basicPuzzleGridString = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
export const basicPuzzleGrid = formatGrid(basicPuzzleGridString);

const basicPuzzleAnswerString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
export const basicPuzzleAnswer = formatGrid(basicPuzzleAnswerString);

// singleOption
const singleOptionGridString = "123450789400000203500000146600000000700000000200030000300070000000090000900080000";
export const singleOptionGrid = formatGrid(singleOptionGridString);

// singleParam
const singleParamRowGridString = "000000000260000531000004000000016289700000000000000000000000000147023000000000008";
export const singleParamRowGrid = formatGrid(singleParamRowGridString);

const singleParamColumnGridString = "000000000000000000009300400000030020040000030050000000900025004000000003000060000";
export const singleParamColumnGrid = formatGrid(singleParamColumnGridString);

const singleParamBoxGridString = "104056000078000000003020900000800103000000657000004000090000000000000000000000000";
export const singleParamBoxGrid = formatGrid(singleParamBoxGridString);

// boxNarrow
export const boxNarrowGridString1 = "504670000672105000198042507850760400406850090013004800060000000087009000000000000";
export const boxNarrowGrid1 = formatGrid(boxNarrowGridString1);

const boxNarrowGridString2 = "500678012672000308008340567850060023426853791700924856061030284280410635305286179";
export const boxNarrowGrid2 = formatGrid(boxNarrowGridString2);

// nakedPairings
const singleNakedPairGridString = "000000000000000000000450000000540000000000000000000000123000089000000000000000000";
export const singleNakedPairGrid = formatGrid(singleNakedPairGridString);

const multiNakedPairGridString = "000001600000009000000450900000540100000000000000000000023000080000000700000067000";
export const multiNakedPairGrid = formatGrid(multiNakedPairGridString);

const singleNakedTripleGridString = "000000000456000789123000456000000000000000000000000000000000000000000000000000123";
export const singleNakedTripleGrid = formatGrid(singleNakedTripleGridString);

const multiNakedTripleGridString = "000000000456000789123000456000000000000000000000000000000000000000000000000009000";
export const multiNakedTripleGrid = formatGrid(multiNakedTripleGridString);

const singleNakedQuadGridString = "103056000000000000000700000000000000000000000000000700000000000000000070070000000";
export const singleNakedQuadGrid = formatGrid(singleNakedQuadGridString);

export const multiNakedQuadGridString = "000209000000608000000090600000105000000306000000407060000000000406000705123000689";
export const multiNakedQuadGrid = formatGrid(multiNakedQuadGridString);

export const singleNakedTripleCascadeGrid = formatGrid("000000000759000000684000000312000000000000000000000000000000000000000000000000009");
export const multiNakedTripleCascadeGrid = formatGrid("000000000759000461684000532312000000000000000000000000000009008000000070000000900");
export const singleNakedQuadCascadeGrid = formatGrid("000000000759000000684000000312500000000100000000900000000709000000800000000600000");
export const multiNakedQuadCascadeGrid = formatGrid("000000000759000412684000953312506080000103000000902000000701000000804000000605000");

// hiddenPairings
const hiddenPairGridString = "164000000250000000370000000000007000000000047000000056000000000806000000945000000";
export const hiddenPairGrid = formatGrid(hiddenPairGridString);

export const hiddenTripleGridString = "907020030002900800061050729105000670009700000746315982694580017513000068278000095";
export const hiddenTripleGrid = formatGrid(hiddenTripleGridString);

export const hiddenQuadGridString = "048397000060085090090026000702863049984512070036974000409738060820609037673201980";
export const hiddenQuadGrid = formatGrid(hiddenQuadGridString);

// fish
export const XWingGridString1 = "900051730107398205500076091810724350200165007075983012021537000758649123390812570";
export const XWingGrid1 = formatGrid(XWingGridString1);

const XWingGridString2 = "100000569492056108056109240009640801064010000218035604040500016905061402621000005";
export const XWingGrid2 = formatGrid(XWingGridString2);

export const swordfishGridString1 = "529410703006003002003200000052300076637050200190627530300069420200830600960742305";
export const swordfishGrid1 = formatGrid(swordfishGridString1);

const swordfishGridString2 = "926000100537010428841000603259734816714060030368120040102000084485071360603000001";
export const swordfishGrid2 = formatGrid(swordfishGridString2);

export const jellyfishGridString1 = "050749080089003000600001390040007060000400809000002000060004010500210047010005030";
export const jellyfishGrid1 = formatGrid(jellyfishGridString1);

const jellyfishGridString2 = "000000000070030920019025630004000210000000000057090460095140370700000040042367590";
export const jellyfishGrid2 = formatGrid(jellyfishGridString2);

// chains
export const xChainGridString = "270060540050127080000400270000046752027508410500712908136274895785001024002000107";
export const xChainGrid = formatGrid(xChainGridString);

// applyStrats
const XWingGridString3 = "000400602006000100090500080050300000301206405000007020030002060004000900507009000";
export const XWingGrid3 = formatGrid(XWingGridString3);

const XWingGrid3AnswerString = "715498632486723159293561784952314876371286495648957321139842567824675913567139248";
export const XWingGrid3Answer = formatGrid(XWingGrid3AnswerString);

const swordfishGridString3 = "050749080089003000600001390040007060000400809000002000060004010500210047010005030";
export const swordfishGrid3 = formatGrid(swordfishGridString3);