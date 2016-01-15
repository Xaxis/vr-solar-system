/**
 * Contains methods for managing celestial bodies.
 */
define([
  'underscore',
  'Global',
  'BaseSolarSystem',
  'OrbitalElements',
  'three'
], function(_, Global, BaseSolarSystem, OrbitalElements) {
  var CelestialBodies = function() {
    return {

      bodies: BaseSolarSystem,

      init: function( scene ) {
        this.scene = scene;
        //this.initBodies(this.bodies.stars);
        this.initBodies(this.bodies.planets);
      },

      initBodies: function(bodies) {
        var
          _this           = this,
          body_mesh       = null,

          // @todo - remove after dev
          bodies          = _.filter(bodies, function(b, i) {
            return i == 'earth' || i == 'venus' || i == 'mercury' || i == 'mars';
          });

        // Iterate over celestial bodies
        _.each(bodies, function(body) {

          // @todo - ...
          // Return coords by calculating initial orbital elements
          var coords = OrbitalElements.calculateElements(body, Global.EPOCH).pos;

          // Convert coordinates to scene units
          _.each(coords, function(val, idx) {
            body[idx] = _this.getBodyDistanceFromSunInSceneUnits(val, body);
          });

          // Initialize body radius
          body.radius = _this.getBodyRadiusInSceneUnits(body.radius_km, body);
          //body.distance = _this.getBodyDistanceFromSunInSceneUnits(body.distance_km, body);
          //body.x = body.distance;


          // Add body to scene
          body_mesh = _this.createBodyMesh(body);
          body.body = body_mesh;
          _this.setBodyInitialPosition(body_mesh, body);
          _this.scene.add(body_mesh);
        });
      },

      getBodyRadiusInSceneUnits: function( radius, body ) {
        if (body.type == 'planet') {
          return (radius / Global.AU) * Global.PLANET_SIZE_SCALE;
        } else if (body.type == 'star') {
          return (radius / Global.AU) * Global.STAR_SIZE_SCALE;
        }
      },

      getBodyDistanceFromSunInSceneUnits: function( distance, body ) {
        if (body.type == 'star') {
          return (distance / Global.AU) * Global.PLANET_DIST_SCALE;
        } else if (body.type == 'planet') {
          return (distance / Global.AU);
        }
      },

      createBodyMesh: function( body ) {
        var
          radius          = body.radius,
          width_segs      = 25,
          height_segs     = 25,
          geometry        = new THREE.SphereGeometry(radius, width_segs, height_segs),
          material        = body.material,
          mesh            = new THREE.Mesh(geometry, material);
        return mesh;
      },

      setBodyInitialPosition: function( body_mesh, body_obj ) {
        body_mesh.position.set(body_obj.x, body_obj.y, body_obj.z);
      }
    };
  };

  return new CelestialBodies;
});
