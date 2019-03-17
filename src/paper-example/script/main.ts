/// <reference types="paper" />

// original js code
// http://paperjs.org/examples/smoothing/

paper.setup('myCanvas');
paper.view.onFrame = onFrame;
paper.view.onResize = onResize;

const tool:paper.Tool = new paper.Tool();
tool.onMouseMove = onMouseMove;
tool.onMouseDown = onMouseDown;

let width:number;
let height:number;
let center:paper.Point;

let mousePos:paper.Point = new paper.Point(paper.view.center.x / 2, paper.view.center.y / 2);
let pathHeight:number = mousePos.y;
let smooth:boolean = true;

const points:number = 10;
const path:paper.Path = new paper.Path();

path.fillColor = 'black';
initializePath();

function initializePath() {
	center = paper.view.center;
	width = paper.view.size.width;
	height = paper.view.size.height / 2;
	path.segments = [];
	path.add(paper.view.bounds.bottomLeft);
	for (let i:number = 1; i < points; i++) {
		const point:paper.Point = new paper.Point(width / points * i, center.y);
		path.add(point);
	}
	console.log('here');
	path.add(paper.view.bounds.bottomRight);
	path.fullySelected = true;
}

function onFrame(event:paper.IFrameEvent) {
	pathHeight += (center.y - mousePos.y - pathHeight) / 10;
	for (let i:number = 1; i < points; i++) {
		const sinSeed:number = event.count + (i + i % 10) * 100;
		const sinHeight:number = Math.sin(sinSeed / 200) * pathHeight;
		const yPos:number = Math.sin(sinSeed / 100) * sinHeight + height;
		path.segments[i].point.y = yPos;
	}
	if (smooth)
		path.smooth({ type: 'continuous' });
}

function onMouseMove(event:paper.ToolEvent) {
	mousePos = event.point;
}

function onMouseDown(event:paper.ToolEvent) {
	smooth = !smooth;
	if (!smooth) {
		// If smooth has been turned off, we need to reset
		// the handles of the path:
		for (let i:number = 0, l = path.segments.length; i < l; i++) {
			const segment:paper.Segment = path.segments[i];
			segment.handleIn = segment.handleOut = null;
		}
	}
}

// Reposition the path whenever the window is resized:
function onResize(event:paper.Event) {
	initializePath();
}