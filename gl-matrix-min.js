<head>
    <script src="gl-matrix-min.js"></script>
    <script>
        function main() {
            const canvas = document.querySelector("#glCanvas");
            // Initialize the GL context
            const gl = canvas.getContext("webgl");
        
            // Only continue if WebGL is available and working
            if (gl === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }
        
            // Vertex shader program
            const vsSource = `
                attribute vec4 aVertexPosition;
                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;
                void main() {
                    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                }
            `;

            // Fragment shader program 
            const fsSource = `
                void main() {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); 
                }
            `;

            // Initialize a shader program; this is where all the lighting
            // for the vertices and so forth is established.
            const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

            // Collect all the info needed to use the shader program.
            // Look up which attribute our shader program is using
            // for aVertexPosition and look up uniform locations.
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                },
                uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                },
            };

            // Now create an array of positions for the object
            positions = [
            // line behind the stones (ground line)    
            -3.5, -0.5,
            3.5, -0.5,

            //AZAD PUNYE PART
            -0.6,0.55,
            -0.5,-0.5,
            -0.9,0.55,
            -1,-0.5,

            -1.05,0.4,
            -1.05,-0.5,
            -1.4,0.4,
            -1.4,-0.5,

            -1.45, 0.1,
            -1.45, -0.5,
            -1.6, 0.1,
            -1.69, -0.5,


            ];

            // Here's where we call the routine that builds all the
            // objects we'll be drawing.
            const buffers = initBuffers(gl);
            drawScene(gl, programInfo, buffers);

            // Draw the scene
            //AZAD PUNYE PART, YG LAIN SAMBUNG BAWAH
            primitive = gl.LINES;
            offset = 0;
            vertexCount = 2; 
            gl.drawArrays(primitive, offset, vertexCount);
            
            primitive = gl.TRIANGLE_STRIP;
            offset = 2;
            vertexCount = 4; 
            gl.drawArrays(primitive, offset, vertexCount);

            primitive = gl.TRIANGLE_STRIP;
            offset = 6;
            vertexCount = 4; 
            gl.drawArrays(primitive, offset, vertexCount);

            primitive = gl.TRIANGLE_STRIP;
            offset = 10;
            vertexCount = 4; 
            gl.drawArrays(primitive, offset, vertexCount);


        

        }
        
        var positions, offset, vertexCount, primitive;
        window.onload = main;

        // ########################################### //
        // initBuffers 
        //
        // Initialize the buffers we'll need. For this demo, we just
        // have one object -- a simple two-dimensional square.
        //
        function initBuffers(gl) {

            // Create a buffer for the square's positions.
            const positionBuffer = gl.createBuffer();

            // Select the positionBuffer as the one to apply buffer
            // operations to from here out.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Now pass the list of positions into WebGL to build the
            // shape. We do this by creating a Float32Array from the
            // JavaScript array, then use it to fill the current buffer.
            gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(positions),
                        gl.STATIC_DRAW);

            return {
                position: positionBuffer,
            };
        }

        // ########################################### //
        // Draw the scene.
        //
        function drawScene(gl, programInfo, buffers) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
            gl.clearDepth(1.0);                 // Clear everything
            gl.enable(gl.DEPTH_TEST);           // Enable depth testing
            gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

            // Clear the canvas before we start drawing on it.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Create a perspective matrix, a special matrix that is
            // used to simulate the distortion of perspective in a camera.
            // Our field of view is 45 degrees, with a width/height
            // ratio that matches the display size of the canvas
            // and we only want to see objects between 0.1 units
            // and 100 units away from the camera.
            const fieldOfView = 45 * Math.PI / 180;   // in radians
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4.create();

            // note: glmatrix.js always has the first argument
            // as the destination to receive the result.
            mat4.perspective(projectionMatrix,
                            fieldOfView,
                            aspect,
                            zNear,
                            zFar);

            // Set the drawing position to the "identity" point, which is
            // the center of the scene.
            const modelViewMatrix = mat4.create();

            // Now move the drawing position a bit to where we want to
            // start drawing the square.
            mat4.translate(modelViewMatrix,     // destination matrix
                            modelViewMatrix,     // matrix to translate
                            [0.0, 0.0, -6.0]);  // amount to translate 

            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute.
            {
                const numComponents = 2;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexPosition);
            }

            // Tell WebGL to use our program when drawing
            gl.useProgram(programInfo.program);

            // Set the shader uniforms
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix);
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix);

            {
                //console.log(offset);
                //console.log(vertexCount);
                //console.log(primitive);
                //gl.drawArrays(primitive, offset, vertexCount);
            }
        }

        // ########################################### //
        // Initialize a shader program, so WebGL knows how to draw our data
        //
        function initShaderProgram(gl, vsSource, fsSource) {
            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

            // Create the shader program
            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            // If creating the shader program failed, alert
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }

            return shaderProgram;
        }

        // ########################################### //
        // creates a shader of the given type, uploads the source and
        // compiles it.
        //
        function loadShader(gl, type, source) {
            const shader = gl.createShader(type);

            // Send the source to the shader object
            gl.shaderSource(shader, source);

            // Compile the shader program
            gl.compileShader(shader);

            // See if it compiled successfully
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }
    </script>
</head>

<body>
  <canvas id="glCanvas" width="640" height="480"></canvas>
</body>
