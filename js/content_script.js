Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.toString = function () { 
    return Array.from(this).join(','); 
}

var sudoku;

function getColumn(i) {
    let offset = i % 9;
    return Array.from(new Array(9), (x, y) => y * 9 + offset);
}

function getColumnElements(i) {
    let elements = getColumn(i).map(i => sudoku[i]);
    return new Set(elements);
}

function _getRow(i, base) {
    let offset = Math.floor(i / base) * base;
    return Array.from(new Array(base), (x, y) => y + offset);
}

function getRow(i) {
    return _getRow(i, 9);
}

function getRowElements(i) {
    let elements = getRow(i).map(i => sudoku[i]);
    return new Set(elements);
}

function getSquare(i) {
    let rowNo = Math.floor(i / 9);
    let squareRowNo = Math.floor(rowNo / 3);
    let firstRow = squareRowNo * 3;
    let is = [];
    if (rowNo == firstRow) is = [i, i + 9, i + 18];
    if (rowNo == firstRow + 1) is = [i - 9, i, i + 9];
    if (rowNo == firstRow + 2) is = [i - 18, i - 9, i];
    return is.flatMap(function (i) {
        return _getRow(i, 3);
    });
}

function getSquareElements(i) {
    let elements = getSquare(i).map(i => sudoku[i]);
    return new Set(elements);
}

function getOptions(i) {
    let options = new Set(Array.from(new Array(9), (x, i) => i + 1));
    options = options.difference(getColumnElements(i));
    options = options.difference(getRowElements(i));
    options = options.difference(getSquareElements(i));
    return options;
}

function solve(i = 0) {
    if (i > 80) return true;
    else {
        if (sudoku[i] > 0) return solve(i + 1);
        else if (getOptions(sudoku, i).length == 0) return false;
        else {
            let resolution = Array.from(getOptions(i)).some(function (option) {
                sudoku[i] = option;
                return solve(i + 1);
            });
            if (resolution) return true;
            else {
                sudoku[i] = 0;
                return false;
            }
        }
    }
}

function fill(i, value) {
    $(".game-cell")[i].click();
    if (value == 0) $(".game-controls-label")[3].click();
    else $(".numpad-item")[value - 1].click();
}

function fillAll() {
    for (let i = 0; i < sudoku.length; i++) {
        fill(i, sudoku[i]);
    }
}

function getGrid() {
    sudoku = JSON.parse(localStorage.userGrid);
    for (let i = 0; i < 81; i++) {
        sudoku[i] = Number.parseInt(sudoku[i]);
    }
}

function doSolve() {
    getGrid();
    console.log("Solving...");
    if (solve()) console.log("Solved!");
    else console.log("Cannot solve :<");
    console.log(sudoku);
    fillAll();
}

function pencil(i) {
    getOptions(i).forEach(function (option) {
        fill(i, option);
    });
}

function doPencil() {
    getGrid();
    console.log("Penciling...");
    for (let i = 0; i < 81; i++) {
        pencil(i);
    }
    console.log("Done!");
}

var solveInput = $('<input type="button" id="sudoku-solver-solve" value="Solve">').click(doSolve);
var fillInput = $('<input type="button" id="sudoku-solver-fill" value="Fill">').click(doPencil);
jQuery(".game-controls-buttons").append(solveInput);
jQuery(".game-controls-buttons").append(fillInput);



$(function() {
    console.log("Sudoku Solver loaded!");
});