/**
 * vr-solar-system
 *
 * (a) Wil Neeley
 * (c) Code may be freely distributed under the MIT license.
 */
var VRSS = (function( THREE ) {
  var vrss = {};

  /**
   * Initialization.
   */
  vrss.init = function( options ) {
    var
      win_w               = window.innerWidth,
      win_h               = window.innerHeight,
      view_angle          = 45,
      aspect              = win_w / win_h,
      near                = 0.1,
      far                 = 10000,
      grid_size           = 20;

    // Create GL renderer, camera, and scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    // Set clear color to black with full opacity
    this.renderer.setClearColor(0x000000, 1);

    // Initialize renderer
    this.renderer.setSize(win_w, win_h);

    // Initialize camera position
    this.camera.position.set(0, 0, grid_size);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Append element to DOM
    document.body.appendChild(this.renderer.domElement);

    // Enable debugging axis lines
    if (options.debug) {

      // Initialize controls
      this.controls = new THREE.TrackballControls(this.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 0.2;
      this.controls.panSpeed = 0.8;
      this.controls.noZoom = false;
      this.controls.noPan = false;
      this.controls.staticMoving = true;
      this.controls.dynamicDampingFactor = 0.3;

      // Build graph lines
      this.lines = this.drawAxesGraphLines(7, 0);
      this.scene.add(this.lines);

      // Build axes
      this.axes = this.drawAxes(grid_size);
      this.scene.add(this.axes);
    }

    // Begin rendering
    this.render();
  };

  /**
   * Rendering loop initialization
   */
  vrss.render = function() {
    requestAnimationFrame(vrss.render);
    vrss.controls.update();
    vrss.renderer.render(vrss.scene, vrss.camera);
  };

  /**
   * Draws coordinate origin axes.
   */
  vrss.drawAxes = function( length ) {
    var
      axes        = new THREE.Object3D();
    axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) );    // +X
    axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xA73C32, false) );    // -X
    axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) );    // +Y
    axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x6C8338, false ) );   // -Y
    axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) );    // +Z
    axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x3D87AA, false ) );   // -Z
    return axes;
  };

  /**
   * Draw coordinate origin axis.
   */
  vrss.drawAxis = function( src, dst, color ) {
    var
      geometry        = new THREE.Geometry(),
      material        = new THREE.LineBasicMaterial({ linewidth: 2, color: color });
    geometry.vertices.push(src.clone());
    geometry.vertices.push(dst.clone());
    geometry.computeLineDistances();
    return new THREE.Line(geometry, material, THREE.LineSegments);
  };

  /**
   * Draw graph lines.
   */
  vrss.drawAxesGraphLines = function( length, origin ) {
    var
      color         = 0x979281,
      axes          = new THREE.Object3D();
    for (var i = 1; i <= length; i++) {

      // X
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( origin, i, origin ), new THREE.Vector3( length, i, origin ), color ) );
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( origin, i, origin ), new THREE.Vector3( -length, i, origin ), color ) );
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( origin, -i, origin ), new THREE.Vector3( length, -i, origin ), color ) );
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( origin, -i, origin ), new THREE.Vector3( -length, -i, origin ), color ) );

      // Y
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( i, origin, origin ), new THREE.Vector3( i, length, origin ), color ) );
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( i, origin, origin ), new THREE.Vector3( i, -length, origin ), color ) );
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( -i, origin, origin ), new THREE.Vector3( -i, length, origin ), color ) );
      axes.add( this.drawAxesGraphLine( new THREE.Vector3( -i, origin, origin ), new THREE.Vector3( -i, -length, origin ), color ) );
    }
    return axes;
  };

  /**
   * Draw graph line.
   */
  vrss.drawAxesGraphLine = function( src, dst, color ) {
    var
      geometry        = new THREE.Geometry(),
      material;
    geometry.vertices.push(src.clone());
    geometry.vertices.push(dst.clone());
    geometry.computeLineDistances();
    material = new THREE.LineBasicMaterial({linewidth: 1, color: color});
    return new THREE.Line(geometry, material, THREE.LineSegments);
  };

  return vrss;
}(THREE));
