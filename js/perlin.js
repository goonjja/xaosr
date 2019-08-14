const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const perlin = new toxi.math.noise.PerlinNoise();
const bounds = new toxi.geom.Rect();
const lastPos = new toxi.geom.Vec2D();
let gui;
let offset = 0;
let options;
const streams = [];
let palette;

palette = [
  toxi.color.TColor.newHex('1c0f17'),
  toxi.color.TColor.newHex('271d2e'),
  toxi.color.TColor.newHex('2c3857'),
  toxi.color.TColor.newHex('155e73').setBrightness(0.9),
  toxi.color.TColor.newHex('e8ca59'),
  toxi.color.TColor.newHex('891b1b')
];

options = {
  running: true,
  numStreams: 400,
  distort: 0,
  strength: Math.PI,
  scalar: 0.05,
  step: 2
};

setCanvasSize();
ctx.fillStyle = "#000000";
ctx.strokeStyle = "#ff0000";
ctx.lineWidth = 1.5;

//setup gui
// gui = new dat.GUI();
// gui.add(options, 'running').onChange(() => {
//   if (options.running) {
//     draw();
//   }
// });
// gui.add(options, 'numStreams', 1, 4500, 1.0).name("# Streams").onChange(throttleStreams);
// gui.add(options, 'step', 0.25, 10, 0.25).name("Speed");
// gui.add(options, 'distort', -0.5, 0.5, 0.001).name("Progression");
// gui.add(options, 'strength', 0.01, Math.PI * 2, 0.01).name("Directional");
// gui.add(options, 'scalar', 0.01, 0.25, 0.01).name("Scalar");

function throttleStreams() {
  //throttle streams if the gui has changed
  while (options.numStreams > streams.length) {
    streams.push(createStream());
  }
  while (options.numStreams < streams.length) {
    streams.shift();
  }
}

throttleStreams();


function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  bounds.set(0, 0, canvas.width, canvas.height);
}

function createStream() {
  const vec = getRandomVector();
  vec.color = palette[Math.floor(Math.random() * palette.length)].toRGBACSS();
  return vec;
}
//get a random point on the canvas, with a random color
function getRandomVector() {
  return new toxi.geom.Vec2D(Math.random(), Math.random()).scaleSelf(canvas.width, canvas.height);
}
//call draw for the first time once load is complete
window.onload = draw;
const pt = new toxi.geom.Vec2D();
//update the canvas
function draw() {
  let i = 0;
  const l = streams.length;
  let stream;

  offset += options.distort;
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (; i < l; i++) {
    stream = streams[i];
    ctx.strokeStyle = stream.color;
    lastPos.set(stream);
    pt.set(stream).scaleSelf(options.scalar).addSelf(0, offset);
    //var pt = stream.scale( options.scalar ).addSelf( 0, offset);
    const noise = perlin.noise(pt.x, pt.y) - 0.5;
    const angle = options.strength * noise;
    const dir = toxi.geom.Vec2D.fromTheta(angle);

    stream.addSelf(dir.normalizeTo(options.step * 3));
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(stream.x, stream.y);
    ctx.closePath();
    ctx.stroke();
    if (!bounds.containsPoint(stream)) {
      stream.set(getRandomVector());
    }
  }
  //using `requestAnimationFrame` with a [polyfill](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
  if (options.running) {
    window.requestAnimationFrame(draw);
  }
}

window.addEventListener('resize', setCanvasSize, false);