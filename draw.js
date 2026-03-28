const canvas = document.getElementById('dessine-canvas');
const ctx = canvas.getContext('2d');

const ZOOM_FACTOR = 3;

/* COLOR PICKER */

function changeColor() {
    const colorPicker = document.getElementById('color-picker-input');
    ctx.fillStyle = colorPicker.value;
}

// initialize color
changeColor();

/* PEN TOOL FUNCTIONS*/

const pixelsToDraw = [];

function drawPixel(x, y) {
    // Do not render during mouse events
    pixelsToDraw.push({ x, y });
}

function drawLine(x0, y0, x1, y1) {

    if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
        if (x0 > x1) {
            drawLineLowPitch(x1, y1, x0, y0);
        }
        else {
            drawLineLowPitch(x0, y0, x1, y1);
        }
    }
    else {
        if (y0 > y1) {
            drawLineHighPitch(x1, y1, x0, y0);
        }
        else {
            drawLineHighPitch(x0, y0, x1, y1);
        }
    }
}

function drawLineLowPitch(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = Math.abs(y1 - y0);
    const yi = y1 > y0 ? 1 : -1;

    let err = 2 * dy - dx;
    let y = y0;

    for (let x = x0; x <= x1; x++) {
        drawPixel(x, y);
        if (err > 0) {
            y += yi;
            err += 2 * (dy - dx);
        } else {
            err += 2 * dy;
        }
    }

    drawPixel(x1, y1);
}

function drawLineHighPitch(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = y1 - y0;
    const xi = x1 > x0 ? 1 : -1;

    let err = 2 * dx - dy;
    let x = x0;

    for (let y = y0; y <= y1; y++) {
        drawPixel(x, y);
        if (err > 0) {
            x += xi;
            err += 2 * (dx - dy);
        } else {
            err += 2 * dx;
        }
    }

    drawPixel(x1, y1);
}

function draw() {
    while ({ x, y } = pixelsToDraw.shift() ?? false) {
        ctx.fillRect(x, y, 1, 1);
    }
}

let isDrawing = false;
let drawFunctionIntervalId = -1;

function startDrawing() {
    isDrawing = true;

    if (drawFunctionIntervalId < 0) {
        drawFunctionIntervalId = setInterval(draw, 50)
    }
}

function stopDrawing() {
    isDrawing = false;
    clearInterval(drawFunctionIntervalId);
    drawFunctionIntervalId = -1;

    // draw remaining pixels
    draw();
}

/* BUCKET TOOL FUNCTIONS */

function fill(x, y) {
    console.log('fill', x, y);
}

let line = { lastX: 0, lastY: 0 }

function noop() {}

let tools = {
    pen: {
        mousedown: (x, y) => {
            startDrawing();
            drawPixel(x, y);
            line.lastX = x;
            line.lastY = y;
        },
        mousemove: (x, y) => {
            if (!isDrawing) return;
            drawLine(line.lastX, line.lastY, x, y)
            drawPixel(x, y);
            line.lastX = x;
            line.lastY = y;
        },
        mouseup: stopDrawing
    },
    bucket: {
        mousedown: fill,
        mousemove: noop,
        mouseup: noop
    }
}

let currentTool = 'pen';

function changeTool(tool) {
    if (tool == currentTool) return;

    document.getElementById(`${currentTool}-tool`).classList.remove('active-tool');
    document.getElementById(`${tool}-tool`).classList.add('active-tool');

    currentTool = tool;
}

canvas.addEventListener('mousedown', (ev) => {
    const x = Math.floor(ev.offsetX / ZOOM_FACTOR);
    const y = Math.floor(ev.offsetY / ZOOM_FACTOR);
    tools[currentTool].mousedown(x, y);
});

canvas.addEventListener('mousemove', (ev) => {
    const x = Math.floor(ev.offsetX / ZOOM_FACTOR);
    const y = Math.floor(ev.offsetY / ZOOM_FACTOR);
    tools[currentTool].mousemove(x, y);
});

canvas.addEventListener('mouseup', stopDrawing);

canvas.addEventListener('mouseleave', stopDrawing);
