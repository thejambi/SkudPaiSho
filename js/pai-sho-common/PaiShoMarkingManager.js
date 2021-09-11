// Manages all highlighted points and drawn arrows on the board
function PaiShoMarkingManager() {
    // Stored as maps to make lookup easier
    this.arrows = {};
    this.points = {};
}

PaiShoMarkingManager.prototype.keyPoint = function (boardPoint) {
    return boardPoint.row + "," +  boardPoint.col;
};

PaiShoMarkingManager.prototype.keyArrow = function (startPoint, endPoint) {
    return this.keyPoint(startPoint) + ";" + this.keyPoint(endPoint);
};

PaiShoMarkingManager.prototype.pointIsMarked = function (boardPoint) {
    return this.points[this.keyPoint(boardPoint)];
};

PaiShoMarkingManager.prototype.toggleMarkedPoint = function (boardPoint) {
    var point = this.keyPoint(boardPoint);
    if (this.points[point]) {
        this.removePoint(boardPoint);
    }
    else {
        this.points[point] = boardPoint;
    }
};

PaiShoMarkingManager.prototype.removePoint = function(boardPoint) {
    delete this.points[this.keyPoint(boardPoint)];
};

PaiShoMarkingManager.prototype.removeArrow = function(startPoint, endPoint) {
    delete this.arrows[this.keyArrow(startPoint, endPoint)];
};

PaiShoMarkingManager.prototype.toggleMarkedArrow = function (startPoint, endPoint) {
    var arrow = this.keyArrow(startPoint, endPoint);
    if (this.arrows[arrow]) {
        this.removeArrow(startPoint, endPoint);
    }
    else {
        this.arrows[arrow] = [startPoint, endPoint];
    }
};


PaiShoMarkingManager.prototype.clearMarkings = function () {
    this.points = {};
    this.arrows = {};
};
