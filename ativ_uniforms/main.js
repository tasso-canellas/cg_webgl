function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    throw new Error("WebGL not supported");
  }

  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  var program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();

  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const matrixUniformLocation = gl.getUniformLocation(program, `matrix`);
  const colorUniformLocation = gl.getUniformLocation(program, `color`);
  const pointsizeUniformLocation = gl.getUniformLocation(program, `pointsize`);

  let matrix = [
    2 / canvas.width,
    0,
    0,
    0,
    0,
    -2 / canvas.height,
    0,
    0,
    0,
    0,
    0,
    0,
    -1,
    1,
    0,
    1,
  ];

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, canvas.width, canvas.height);
  let positionVector = [canvas.width / 2, canvas.height / 2];
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionVector),
    gl.STATIC_DRAW
  );
  let colorVector = [0.0, 0.0, 1.0];
  let pointsize =1;
  gl.uniform3fv(colorUniformLocation, colorVector);
  gl.uniform1f(pointsizeUniformLocation, pointsize);
  let startPoint = null;
  let midPoint = null;
  let endPoint = null;
  let isTriangleMode = false;
  let isColorMode = false;
  let clickCount = 0;

  const bodyElement = document.querySelector("body");

  function keyFunction(event) {
    switch (event.key) {
      case "r":
      case "R":
        isTriangleMode = false;
        clickCount = 0;
        startPoint = null;
        midPoint = null;
        endPoint = null;
        break;
      case "t":
      case "T":
        isTriangleMode = true;
        clickCount = 0;
        startPoint = null;
        midPoint = null;
        endPoint = null;
        break;
      case "e":
      case "E":
        isColorMode = false;
        break;
      case "K":
      case "k":
        isColorMode = true;
        break;
    }
  }

  canvas.addEventListener("mousedown", mouseClick, false);

  function mouseClick(event) {
    if (isTriangleMode) {
      clickCount++;
      if (clickCount === 1) {
        startPoint = [event.offsetX, event.offsetY];
      } else if (clickCount === 2) {
        midPoint = [event.offsetX, event.offsetY];
      } else if (clickCount === 3) {
        endPoint = [event.offsetX, event.offsetY];
        drawTriangle();
        clickCount = 0;
        startPoint = null;
        midPoint = null;
        endPoint = null;
      }
    } else {
      if (!startPoint) {
        startPoint = [event.offsetX, event.offsetY];
      } else {
        endPoint = [event.offsetX, event.offsetY];
        drawLine();
        startPoint = null;
        endPoint = null;
      }
    }
  }

  bodyElement.addEventListener("keydown", keyDown, false);
  bodyElement.addEventListener("keydown", keyFunction, false);

  function keyDown(event) {
    if (isColorMode) {
      switch (event.key) {
        case "0":
          colorVector = [0.0, 0.0, 0.0];
          break;
        case "1":
          colorVector = [1.0, 0.0, 0.0];
          break;
        case "2":
          colorVector = [0.0, 1.0, 0.0];
          break;
        case "3":
          colorVector = [0.0, 0.0, 1.0];
          break;
        case "4":
          colorVector = [1.0, 1.0, 0.0];
          break;
        case "5":
          colorVector = [0.0, 1.0, 1.0];
          break;
        case "6":
          colorVector = [1.0, 0.0, 1.0];
          break;
        case "7":
          colorVector = [1.0, 0.5, 0.5];
          break;
        case "8":
          colorVector = [0.5, 1.0, 0.5];
          break;
        case "9":
          colorVector = [0.5, 0.5, 1.0];
          break;
      }
    } else {
      switch (event.key) {
        case "1":
          pointsize = 1;
          break;
        case "2":
          pointsize = 2;
          break;
        case "3":
          pointsize = 3;
          break;
        case "4":
          pointsize = 4;
          break;
        case "5":
          pointsize = 5;
          break;
        case "6":
          pointsize = 6;
          break;
        case "7":
          pointsize = 7;
          break;
        case "8":
          pointsize = 8;
          break;
        case "9":
          pointsize = 9;
          break;
      }
    }
    if (isTriangleMode && startPoint && midPoint && endPoint) {
      drawTriangle();
    } else if (!isTriangleMode && startPoint && endPoint) {
      drawLine();
    }
  }

  function drawPoint(x, y) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y]), gl.STATIC_DRAW);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.uniform3fv(colorUniformLocation, colorVector);
    gl.uniform1f(pointsizeUniformLocation, pointsize);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  function drawLine() {
    if (!startPoint || !endPoint) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    bresenham(startPoint[0], endPoint[0], startPoint[1], endPoint[1]);
  }

  function drawTriangle() {
    if (!startPoint || !midPoint || !endPoint) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw three lines to form a triangle
    bresenham(startPoint[0], midPoint[0], startPoint[1], midPoint[1]);
    bresenham(midPoint[0], endPoint[0], midPoint[1], endPoint[1]);
    bresenham(endPoint[0], startPoint[0], endPoint[1], startPoint[1]);
  }

  function bresenham(x1, x2, y1, y2) {
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = x1 < x2 ? 1 : -1;
    var sy = y1 < y2 ? 1 : -1;
    var err = dx - dy;

    while (true) {
      drawPoint(x1, y1);
      if (x1 === x2 && y1 === y2) break;
      var e2 = err * 2;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

main();
