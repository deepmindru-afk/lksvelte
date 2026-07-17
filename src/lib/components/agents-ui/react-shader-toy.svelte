<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let gl: WebGL2RenderingContext | null = null;
  let program: WebGLProgram | null = null;

  export let fs: string = '';
  export let uniforms: Record<string, { type: string; value: any }> = {};
  export let devicePixelRatio: number = 1;

  function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  let animationId: number | null = null;
  let startTime = performance.now();

  function render() {
    if (!gl || !program) return;
    const time = (performance.now() - startTime) / 1000;
    const resolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const timeLoc = gl.getUniformLocation(program, 'iTime');
    if (resolutionLoc) gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    if (timeLoc) gl.uniform1f(timeLoc, time);

    for (const [name, u] of Object.entries(uniforms)) {
      const loc = gl.getUniformLocation(program, name);
      if (!loc) continue;
      switch (u.type) {
        case '1f': gl.uniform1f(loc, u.value); break;
        case '3fv': gl.uniform3fv(loc, u.value); break;
      }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animationId = requestAnimationFrame(render);
  }

  onMount(() => {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, `#version 300 es
      in vec2 a_position;
      out vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `);
    const fsShader = createShader(gl, gl.FRAGMENT_SHADER, `#version 300 es
      precision highp float;
      in vec2 v_uv;
      out vec4 fragColor;
      uniform vec2 iResolution;
      uniform float iTime;
      ${fs}
    `);
    if (!vs || !fsShader) return;

    program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fsShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    render();

    const observer = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      gl?.viewport(0, 0, canvas.width, canvas.height);
    });
    observer.observe(canvas);

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  });
</script>

<canvas bind:this={canvas} class="size-full" />
