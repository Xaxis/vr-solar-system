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
  Three
) {
  var _ModuleView = Backbone.View.extend({
    el: $('body'),

    module_template: _.template(_ModuleTemplate),

    events: {
      'keydown': 'handleKeyboardInput'
    },

    initialize: function() {
      var
        _this             = this;

      // Bind methods
      _.bindAll(this,
        'boot',
        'render',
        'drawSceneSphere'
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
      this.scene = new Three.Scene();
      this.camera = new Three.PerspectiveCamera(view_angle, aspect, near, far);
      this.renderer = new Three.WebGLRenderer();

      // Initialize renderer
      this.renderer.setSize(win_w, win_h);

      // Initialize camera position
      this.camera.position.set(0, 0, 0);

      // Append element to DOM
      $('body').append(this.renderer.domElement);

      // Load scene sphere
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
        geometry        = new Three.SphereGeometry(radius, width_segs, height_segs, phi_start, phi_length, theta_start, theta_length),
        material        = new Three.MeshBasicMaterial({
          wireframe: true
        }),
        sphere          = new Three.Mesh(geometry, material);
      this.scene_sphere = sphere;
      this.scene.add(sphere);
    },

    /**
     *
     */
    handleKeyboardInput: function(e) {
      e.preventDefault();
      var
        code              = e.keyCode,
        shift             = !!e.shiftKey,
        rot_speed         = 0.02,
        move_speed        = 0.02,
        zoom_speed        = 0.09;
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
      }
    }

  });

  return _ModuleView;
});
