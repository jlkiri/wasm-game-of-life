import { Universe } from "./pkg/wasm_game_of_life";
import { memory } from "./pkg/wasm_game_of_life_bg";
import * as twgl from "twgl.js";

const run = () => {
  const canvas = document.getElementById("c");

  const CELL_SIZE = 4; // px

  const gl = canvas.getContext("webgl");
  const programInfo = twgl.createProgramInfo(gl, [
    "vertex-shader",
    "fragment-shader"
  ]);

  twgl.setDefaults({ attribPrefix: "a_" });

  twgl.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const universe = Universe.new(512, 256);

  const width = universe.width();
  const height = universe.height();

  let points = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      points.push([j * CELL_SIZE * 2.5, i * CELL_SIZE * 2.5]);
    }
  }

  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  const arrays = {
    position: {
      data: new Float32Array(points.flat()),
      size: 2
    },
    color: {
      data: cells,
      size: 1,
      drawType: gl.DYNAMIC_DRAW,
      normalize: false
    }
  };

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  const uniforms = {
    u_resolution: [gl.canvas.width, gl.canvas.height],
    u_point_width: CELL_SIZE
  };

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(programInfo.program);

  twgl.setUniforms(programInfo, uniforms);

  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);

  function renderLoop(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    universe.tick();
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_point_width: CELL_SIZE
    };

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programInfo.program);
    twgl.setUniforms(programInfo, uniforms);

    twgl.setAttribInfoBufferFromArray(
      gl,
      bufferInfo.attribs.a_color,
      {
        data: cells,
        size: 1,
        drawType: gl.DYNAMIC_DRAW,
        normalize: false
      },
      0
    );

    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
};

run();
