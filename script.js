const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const eraserBtn = document.getElementById('eraser');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const bgColorEl = document.getElementById('bgColor');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');

let size = 10;
let isPressed = false;
let color = 'black';
let x;
let y;
let isEraser = false;
let history = [];
let redoHistory = [];

// Set initial background color
ctx.fillStyle = bgColorEl.value;
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', (e) => {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
  isPressed = false;
  x = undefined;
  y = undefined;
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redoHistory = [];
});

canvas.addEventListener('mousemove', (e) => {
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;
    drawLine(x, y, x2, y2);
    x = x2;
    y = y2;
  }
});

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = isEraser ? bgColorEl.value : color;
  ctx.lineWidth = size;
  ctx.stroke();
  ctx.closePath();
}

decreaseBtn.addEventListener('click', () => {
  size -= 5;
  if (size < 5) {
    size = 5;
  }
  updateSizeOnScreen();
});

increaseBtn.addEventListener('click', () => {
  size += 5;
  if (size > 50) {
    size = 50;
  }
  updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => {
  color = e.target.value;
  isEraser = false;
});

eraserBtn.addEventListener('click', () => {
  isEraser = true;
});

undoBtn.addEventListener('click', () => {
  if (history.length > 0) {
    redoHistory.push(history.pop());
    if (history.length > 0) {
      ctx.putImageData(history[history.length - 1], 0, 0);
    } else {
      clearCanvas();
    }
  }
});

redoBtn.addEventListener('click', () => {
  if (redoHistory.length > 0) {
    history.push(redoHistory.pop());
    ctx.putImageData(history[history.length - 1], 0, 0);
  }
});

bgColorEl.addEventListener('change', (e) => {
  ctx.fillStyle = e.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  history = [];
  redoHistory = [];
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
});

clearBtn.addEventListener('click', () => {
  clearCanvas();
  history = [];
  redoHistory = [];
});

saveBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'drawing.png';
  link.click();
});

function updateSizeOnScreen() {
  sizeEl.innerText = size;
}

function clearCanvas() {
  ctx.fillStyle = bgColorEl.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
