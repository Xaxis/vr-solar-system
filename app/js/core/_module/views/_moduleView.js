/**
 * Backbone module view template
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/_module.tpl.html',
  '../collections/_moduleCollection',
  'three'
], function(
  $,
  _,
  Backbone,
  _ModuleTemplate,
  _ModuleCollection,
  THREE
) {
  var _ModuleView = Backbone.View.extend({
    el: $('body'),

    module_template: _.template(_ModuleTemplate),

    events: {
      'keydown': 'handleKeyboardInput',
      'mousedown': 'toggleMouseActive',
      'mouseup': 'toggleMouseActive',
      'mousemove': 'handleMouseInput'
    },

    initialize: function() {
      var
        _this             = this;

      // Bind methods
      _.bindAll(this,
        'boot',
        'render',
        'drawSceneSphere',
        'drawAxes',
        'drawAxis',

        // Events
        'handleKeyboardInput',
        'toggleMouseActive',
        'handleMouseInput'
      );

      // Initialize model collection
      this.collection = new _ModuleCollection();

      // Bootstrap solar system
      this.boot();
    },

    /**
     * Bootstrap the solar system.
     */
    boot: function() {
      var
        win_w               = window.innerWidth,
        win_h               = window.innerHeight,
        view_angle          = 105,
        aspect              = win_w / win_h,
        near                = 0.1,
        far                 = 10000;

      // Create GL renderer, camera, and scene
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });

      // Initialize renderer
      this.renderer.setSize(win_w, win_h);

      // Initialize camera position
      this.camera.position.set(0, 0, 0);

      // Append element to DOM
      $('body').append(this.renderer.domElement);

      // Draw scene axes
      this.axes = this.drawAxes(100);
      this.scene.add(this.axes);

      // Draw scene sphere
      this.drawSceneSphere();

      // Begin rendering
      this.render();
    },

    /**
     * Main rendering loop.
     */
    render: function() {
      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
    },

    /**
     * Draws the scene sphere: the sphere in which the solar system exists.
     */
    drawSceneSphere: function() {
      var
        radius          = 3,
        width_segs      = 36,
        height_segs     = 36,
        phi_start       = 0,
        phi_length      = Math.PI * 2,
        theta_start     = 0,
        theta_length    = Math.PI * 2,
        geometry        = new THREE.SphereGeometry(radius, width_segs, height_segs, phi_start, phi_length, theta_start, theta_length),
        material        = new THREE.MeshBasicMaterial({
          wireframe: true
        }),
        sphere          = new THREE.Mesh(geometry, material);
      this.scene_sphere = sphere;
      this.scene.add(sphere);
    },

    /**
     * Draws coordinate axes.
     */
    drawAxes: function( length ) {
      var
        axes        = new THREE.Object3D();
      axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) );  // +X
      axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) );   // -X
      axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) );  // +Y
      axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) );  // -Y
      axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) );  // +Z
      axes.add( this.drawAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) );  // -Z
      return axes;
    },

    /**
     * Draw coordinate axis.
     * @param src
     * @param dst
     * @param colorHex
     * @param dashed
     */
    drawAxis: function( src, dst, colorHex, dashed ) {
      var
        geometry        = new THREE.Geometry(),
        mat;
      if (dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
      } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
      }
      geometry.vertices.push(src.clone());
      geometry.vertices.push(dst.clone());
      geometry.computeLineDistances();
      return new THREE.Line(geometry, mat, THREE.LineSegments);
    },

    /**
     * Handles device keyboard input.
     */
    handleKeyboardInput: function(e) {
      e.preventDefault();
      var
        code              = e.keyCode,
        shift             = !!e.shiftKey,
        rot_speed         = 0.02,
        move_speed        = 0.1,
        zoom_speed        = 0.1;
      switch (true) {

        // Camera Rotation
        case code == 37 && !shift :   // left
          this.camera.rotation.y += rot_speed;
          break;
        case code == 38 && !shift :   // up
          this.camera.rotation.x += rot_speed;
          break;
        case code == 39 && !shift :   // right
          this.camera.rotation.y -= rot_speed;
          break;
        case code == 40 && !shift :   // down
          this.camera.rotation.x -= rot_speed;
          break;

        // Camera Movement
        case code == 37 && shift :   // left
          this.camera.position.x -= move_speed;
          break;
        case code == 38 && shift :   // up
          this.camera.position.y += move_speed;
          break;
        case code == 39 && shift :   // right
          this.camera.position.x += move_speed;
          break;
        case code == 40 && shift :   // down
          this.camera.position.y -= move_speed;
          break;

        // Camera Zoom
        case code == 61 :
          this.camera.position.z -= zoom_speed;
          break;
        case code == 173 :
          this.camera.position.z += zoom_speed;
          break;

        // Back to origin
        case code == 13 :
          this.camera.position.set(0, 0, 0);
          this.camera.lookAt(0, 0, 0);
          break;
      }
    },

    /**
     * Indicate if mouse is active over scene.
     */
    toggleMouseActive: function(e) {
      if (e.type == 'mousedown') {
        this.mouse_x = e.pageX;
        this.mouse_y = e.pageY;
        this.mouse_active = true;
      } else if (e.type == 'mouseup') {
        this.mouse_active = false;
      }
    },

    /**
     * Handles device mouse input.
     */
    handleMouseInput: function(e) {
      var
        mouse_x       = e.pageX,
        mouse_y       = e.pageY,
        rot_speed     = 0.01;
      if (this.mouse_active) {
        if (mouse_x >= this.mouse_x) {
          this.camera.rotation.y += rot_speed;
        }
        if (mouse_x < this.mouse_x) {
          this.camera.rotation.y -= rot_speed;
        }
        if (mouse_y >= this.mouse_y) {
          this.camera.rotation.x -= rot_speed;
        }
        if (mouse_y < this.mouse_y) {
          this.camera.rotation.x += rot_speed;
        }
      }
    }

  });

  return _ModuleView;
});
