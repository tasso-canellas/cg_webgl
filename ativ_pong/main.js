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

  let matrix = m4.identity();
  matrix = m4.scale(matrix, 0.25, 0.25, 1.0);
  gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let squarePositionVector = [
    -0.05, -0.05, -0.05, 0.05, 0.05, -0.05, -0.05, 0.05, 0.05, -0.05, 0.05,
    0.05,
  ];
  let barPositionVector = [
    0.9, 0.25, 0.9, -0.25, 0.95, -0.25, 0.9, 0.25, 0.95, 0.25, 0.95, -0.25,
  ];
  let barPositionVector1 = [
    -0.9, 0.25, -0.9, -0.25, -0.95, -0.25, -0.9, 0.25, -0.95, 0.25, -0.95,
    -0.25,
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      ...squarePositionVector,
      ...barPositionVector,
      ...barPositionVector1,
    ]),
    gl.STATIC_DRAW
  );

  let colorVector = [1.0, 1.0, 1.0];
  gl.uniform3fv(colorUniformLocation, colorVector);

  let squareX = 0.0;
  let squareY = 0.0;
  let squareXStep = 0.02;
  let squareYStep = 0.02;
  let theta = 0;
  let barY2 = 0.0;
  let barY1 = 0.0;
  let changex = false;
  let p1_points = 0;
  let p2_points = 0;

  canvas.tabIndex = 0;
  canvas.focus();

  const keys = {};

  canvas.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });

  canvas.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  function updateBars() {
    if (keys["w"] || keys["W"]) {
      barY1 = Math.min(barY1 + 0.05, 0.75);
    }
    if (keys["s"] || keys["S"]) {
      barY1 = Math.max(barY1 - 0.05, -0.75);
    }
    if (keys["ArrowUp"]) {
      barY2 = Math.min(barY2 + 0.05, 0.75);
    }
    if (keys["ArrowDown"]) {
      barY2 = Math.max(barY2 - 0.05, -0.75);
    }
  }

  function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    updateBars();
    // Update square position
    squareX += squareXStep;
    squareY += squareYStep;

    // Check for collision with bars
    if (
      squareX > 0.89 &&
      squareX < 0.91 &&
      squareY < barY2 + 0.25 &&
      squareY > barY2 - 0.25
    ) {
      changex = true;
    }
    if (
      squareX < -0.89 &&
      squareX > -0.91 &&
      squareY < barY1 + 0.25 &&
      squareY > barY1 - 0.25
    ) {
      changex = true;
    }
    //se houve colisao, muda a direcao
    if (changex) {
      squareXStep = -squareXStep;
      changex = false;
    }

    // se não houve, alguem pontua
    else if (squareX > 1.3) {
      squareXStep = -squareXStep;
      squareX = 0.0;
      p1_points += 1;
      updatePoints(p1_points, p2_points);
    } else if (squareX < -1.3) {
      squareXStep = -squareXStep;
      squareX = 0.0;
      p2_points += 1;
      updatePoints(p1_points, p2_points);
    }

    // Check for collision with top and bottom walls
    if (squareY > 1 || squareY < -1) {
      squareYStep = -squareYStep;
    }

    // Draw square
    matrix = m4.identity();

    matrix = m4.translate(matrix, squareX, squareY, 0.0);
    matrix = m4.zRotate(matrix, degToRad(theta));
    matrix = m4.scale(matrix, 0.75, 0.75, 1.0);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Draw bar
    matrix = m4.identity();
    matrix = m4.translate(matrix, 0, barY2, 0.0);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 6, 6);

    // Draw second bar
    matrix = m4.identity();
    matrix = m4.translate(matrix, 0, barY1, 0.0);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 12, 6);

    theta += 8;
    requestAnimationFrame(drawScene);
  }
  requestAnimationFrame(drawScene);
}
function updatePoints(p1_points, p2_points) {
  document.getElementById("p1_points").textContent = p1_points;
  document.getElementById("p2_points").textContent = p2_points;
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

var m4 = {
  identity: function () {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  scaling: function (sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
};

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

main();
