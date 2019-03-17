"use strict";
paper.setup('myCanvas');
paper.view.onFrame = onFrame;
paper.view.onResize = onResize;
var tool = new paper.Tool();
tool.onMouseMove = onMouseMove;
tool.onMouseDown = onMouseDown;
var width;
var height;
var center;
var mousePos = new paper.Point(paper.view.center.x / 2, paper.view.center.y / 2);
var pathHeight = mousePos.y;
var smooth = true;
var points = 10;
var path = new paper.Path();
path.fillColor = 'black';
initializePath();
function initializePath() {
    center = paper.view.center;
    width = paper.view.size.width;
    height = paper.view.size.height / 2;
    path.segments = [];
    path.add(paper.view.bounds.bottomLeft);
    for (var i = 1; i < points; i++) {
        var point = new paper.Point(width / points * i, center.y);
        path.add(point);
    }
    console.log('here');
    path.add(paper.view.bounds.bottomRight);
    path.fullySelected = true;
}
function onFrame(event) {
    pathHeight += (center.y - mousePos.y - pathHeight) / 10;
    for (var i = 1; i < points; i++) {
        var sinSeed = event.count + (i + i % 10) * 100;
        var sinHeight = Math.sin(sinSeed / 200) * pathHeight;
        var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
        path.segments[i].point.y = yPos;
    }
    if (smooth)
        path.smooth({ type: 'continuous' });
}
function onMouseMove(event) {
    mousePos = event.point;
}
function onMouseDown(event) {
    smooth = !smooth;
    if (!smooth) {
        for (var i = 0, l = path.segments.length; i < l; i++) {
            var segment = path.segments[i];
            segment.handleIn = segment.handleOut = null;
        }
    }
}
function onResize(event) {
    initializePath();
}

//# sourceMappingURL=main.js.map
