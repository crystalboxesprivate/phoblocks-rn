import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { GLView } from 'expo-gl'

import convert from 'color-convert'
import Theme from '../Theme';

const vertSrc = `
void main(void) {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`;

const fragSrc = `
void main(void) {
  gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`;



let _initialized = false;
// lol

export default class RenderView extends React.Component {
  render() {
    return (
      <GLView
        style={{
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          width: Theme.getFullWidth(), height: Theme.getFullHeight()
        }}
        onContextCreate={this._onContextCreate}
      />
    );
  }

  _onContextCreate = (gl: any) => {
    if (_initialized) {
      return;
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    const clearc = convert.hex.rgb(Theme.bgColor.substring(1))
    gl.clearColor(...(clearc.map(x => x / 255)), 1);

    // Compile vertex and fragment shader
    const vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vertSrc);
    gl.compileShader(vert);
    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, fragSrc);
    gl.compileShader(frag);

    // Link together into a program
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

    gl.flush();
    gl.endFrameEXP();
    _initialized = true;
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: '#fff',
  },
});
