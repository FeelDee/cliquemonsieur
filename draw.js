const canvas = document.getElementById('dessine-canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

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

function getPixelData(data, { x, y }) {
    // In ImageData object, pixel data is encoded as [r, g, b, a, r, g, b, a, ...]
    const pos = x + y * CANVAS_WIDTH;
    return `rgba(${data[pos * 4 + 0]}, ${data[pos * 4 + 1]}, ${data[pos * 4 + 2]}, ${data[pos * 4 + 3] / 255})`;
}

function getPixelNeighbors({ x, y }) {
    const neighbors = [];
    if (x > 0) neighbors.push({ x: x - 1, y });
    if (y > 0) neighbors.push({ x, y: y - 1 });
    if (x < CANVAS_WIDTH) neighbors.push({ x: x + 1, y });
    if (y < CANVAS_HEIGHT) neighbors.push({ x, y: y + 1});
    return neighbors;
}

function stringifyPixel({ x, y }) {
    return `x${x}y${y}`;
}

function fill(x, y) {
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // rgba
    const pixels = imageData.data;
    const visited = new Set();
    const neighbors = [{ x, y }];
    const areaColor = getPixelData(pixels, { x, y });

    while (neighbors.length > 0) {
        const pixel = neighbors.shift();
        ctx.fillRect(pixel.x, pixel.y, 1, 1); // could be optimized with putImageData
        
        for (const neighbor of getPixelNeighbors(pixel)) {
            const hash = stringifyPixel(neighbor);
            if (visited.has(hash)) continue;
            visited.add(hash);

            if (getPixelData(pixels, neighbor) == areaColor) {
                neighbors.push(neighbor);
            }
        }
    }
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
        mouseup: stopDrawing,
        mouseleave: stopDrawing,
    },
    bucket: {
        mousedown: fill,
        mousemove: noop,
        mouseup: noop,
        mouseleave: noop,
    }
}

let currentTool = 'pen';

function changeTool(tool) {
    if (tool == currentTool) return;

    document.getElementById(`${currentTool}-tool`).classList.remove('active-tool');
    document.getElementById(`${tool}-tool`).classList.add('active-tool');

    currentTool = tool;
}

let zoomFactor = window.innerWidth > 780 ? 3 : 1;

addEventListener('resize', () => {
    zoomFactor = window.innerWidth > 780 ? 3 : 1;
})

/* CANVAS EVENTS MAPPING */

canvas.addEventListener('mousedown', (ev) => {
    const x = Math.floor(ev.offsetX / zoomFactor);
    const y = Math.floor(ev.offsetY / zoomFactor);
    tools[currentTool].mousedown(x, y);
});

canvas.addEventListener('mousemove', (ev) => {
    const x = Math.floor(ev.offsetX / zoomFactor);
    const y = Math.floor(ev.offsetY / zoomFactor);
    tools[currentTool].mousemove(x, y);
});

canvas.addEventListener('mouseup', (ev) => {
    const x = Math.floor(ev.offsetX / zoomFactor);
    const y = Math.floor(ev.offsetY / zoomFactor);
    tools[currentTool].mouseup(x, y);
});

canvas.addEventListener('mouseleave', (ev) => {
    const x = Math.floor(ev.offsetX / zoomFactor);
    const y = Math.floor(ev.offsetY / zoomFactor);
    tools[currentTool].mouseleave(x, y);
});

canvas.addEventListener('touchstart', (ev) => {
    if (ev.targetTouches.length != 1) return;
    ev.preventDefault();
    const x = Math.floor(ev.targetTouches[0].offsetX / zoomFactor);
    const y = Math.floor(ev.targetTouches[0].offsetY / zoomFactor);
    tools[currentTool].mousemove(x, y);
});

canvas.addEventListener('touchmove', (ev) => {
    if (ev.targetTouches.length != 1) return;
    ev.preventDefault();
    const x = Math.floor(ev.targetTouches[0].offsetX / zoomFactor);
    const y = Math.floor(ev.targetTouches[0].offsetY / zoomFactor);
    tools[currentTool].mousemove(x, y);
});

canvas.addEventListener('touchend', (ev) => {
    if (ev.targetTouches.length != 1) return;
    ev.preventDefault();
    const x = Math.floor(ev.targetTouches[0].offsetX / zoomFactor);
    const y = Math.floor(ev.targetTouches[0].offsetY / zoomFactor);
    tools[currentTool].mouseup(x, y);
});

canvas.addEventListener('touchcancel', (ev) => {
    if (ev.targetTouches.length != 1) return;
    ev.preventDefault();
    const x = Math.floor(ev.targetTouches[0].offsetX / zoomFactor);
    const y = Math.floor(ev.targetTouches[0].offsetY / zoomFactor);
    tools[currentTool].mouseleave(x, y);
});
