import React, { useEffect, useRef } from 'react';

interface WebGLAtmosphereShaderProps {
  layer?: 'wind' | 'pm25' | 'aqi' | 'no2';
  speedMultiplier?: number;
  timeOffset?: number;
}

export const WebGLAtmosphereShader: React.FC<WebGLAtmosphereShaderProps> = ({
  layer = 'wind',
  speedMultiplier = 1.0,
  timeOffset = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rawGl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!rawGl) return;
    const gl = rawGl as WebGLRenderingContext;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 800;
      const h = canvas.clientHeight || 600;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform int u_layer;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv;
    p.x *= aspect;

    float t = u_time * 0.18;
    float n1 = snoise(p * 2.2 + vec2(t * 0.4, -t * 0.2));
    float n2 = snoise(p * 4.5 - vec2(-t * 0.3, t * 0.5) + vec2(n1 * 0.6));
    float flow = snoise(p * 1.5 + vec2(n2 * 0.5, t * 0.2));

    float lines = sin((p.y * 35.0 + n1 * 8.0 + u_time * 1.5));
    lines = smoothstep(0.7, 0.95, lines);

    vec3 darkSpace = vec3(0.04, 0.07, 0.13);
    vec3 airCyan   = vec3(0.05, 0.65, 0.91);
    vec3 pureTeal  = vec3(0.06, 0.72, 0.55);
    vec3 aqiAmber  = vec3(0.96, 0.62, 0.07);
    vec3 redSmog   = vec3(0.94, 0.27, 0.27);
    vec3 no2Violet = vec3(0.55, 0.36, 0.96);

    vec2 center = vec2(0.5 * aspect, 0.52);
    float dist = length(p - center);
    float globeGlow = smoothstep(0.85, 0.1, dist);

    vec3 col = darkSpace;

    if (u_layer == 0) {
      // Wind Vector Flow
      col = mix(darkSpace, airCyan * 0.45, clamp(flow * 0.5 + 0.3, 0.0, 1.0));
      col = mix(col, pureTeal * 0.65, clamp(n2 * 0.4 + 0.2, 0.0, 1.0));
      col += airCyan * lines * 0.45 * globeGlow;
      col += vec3(0.1, 0.75, 1.0) * pow(globeGlow, 2.5) * 0.4;
    } else if (u_layer == 1) {
      // PM2.5 Dispersion (heavy amber/red plume in East)
      col = mix(darkSpace, redSmog * 0.55, clamp(flow * 0.6 + 0.2, 0.0, 1.0));
      col = mix(col, aqiAmber * 0.6, clamp((n1 - 0.1) * 0.7, 0.0, 1.0));
      col += redSmog * lines * 0.25 * globeGlow;
      col += vec3(0.9, 0.4, 0.1) * pow(globeGlow, 2.2) * 0.35;
    } else if (u_layer == 2) {
      // Composite AQI
      col = mix(darkSpace, airCyan * 0.35, clamp(flow * 0.5 + 0.3, 0.0, 1.0));
      col = mix(col, pureTeal * 0.5, clamp(n2 * 0.4 + 0.2, 0.0, 1.0));
      col = mix(col, aqiAmber * 0.5, clamp((n1 - 0.2) * 0.6, 0.0, 1.0));
      col += airCyan * lines * 0.35 * globeGlow;
      col += vec3(0.2, 0.8, 1.0) * pow(globeGlow, 2.5) * 0.45;
    } else {
      // NO2 Troposphere (violet / purple gradient)
      col = mix(darkSpace, no2Violet * 0.5, clamp(flow * 0.5 + 0.3, 0.0, 1.0));
      col = mix(col, airCyan * 0.4, clamp(n2 * 0.4 + 0.2, 0.0, 1.0));
      col += no2Violet * lines * 0.3 * globeGlow;
      col += vec3(0.6, 0.3, 0.9) * pow(globeGlow, 2.0) * 0.4;
    }

    float edgeVignette = smoothstep(1.3, 0.25, dist);
    col *= edgeVignette;

    gl_FragColor = vec4(col, 1.0);
}
`;

    function createShader(type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uLayer = gl.getUniformLocation(prog, 'u_layer');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const layerMap: Record<string, number> = {
      wind: 0,
      pm25: 1,
      aqi: 2,
      no2: 3
    };

    const startTime = performance.now();

    function render() {
      if (!canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      const elapsed = (performance.now() - startTime) * 0.001 * speedMultiplier + timeOffset;

      if (uTime) gl.uniform1f(uTime, elapsed);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uLayer) gl.uniform1i(uLayer, layerMap[layer] ?? 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [layer, speedMultiplier, timeOffset]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: 'block' }}
    />
  );
};
