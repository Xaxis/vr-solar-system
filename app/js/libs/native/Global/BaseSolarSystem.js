/**
 * Contains the "base" solar system celestial bodies.
 */
define([
  'Global',
  'three'
], function(Global) {
  return {

    // Stars
    stars: {

      // Our star
      sun: {
        type: 'star',
        radius_km: 696300,
        distance_km: 0,
        mass: 1.988435e30,
        k : 0.01720209895,        // gravitational constant (μ)
        x: 0,
        y: 0,
        z: 0,
        material: new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: false })
      }
    },

    // Planets/Planetoids
    planets: {

      // Mercury
      mercury: {
        type: 'planet',
        radius_km: 2439.7,
        distance_km: 57904197.1,
        mass: 3.30104e23,
        speed: 4.74e-5,
        orbit: {
          base: {
            a: 0.38709927 * Global.AU,
            e: 0.20563593,
            i: 7.00497902,
            l: 252.25032350,
            lp: 77.45779628,
            o: 48.33076593
          },
          cy: {
            a: 0.00000037 * Global.AU,
            e: 0.00001906,
            i: -0.00594749,
            l: 149472.67411175,
            lp: 0.16047689,
            o: -0.12534081
          }
        },
        x: 0,
        y: 0,
        z: 0,
        material: new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: false })
      },

      // Venus
      venus: {
        type: 'planet',
        radius_km: 6051.1,
        distance_km: 108212290.5,
        mass: 4.86732e24,
        speed: 3.5e-5,
        orbit: {
          base: {
            a: 0.72333566 * Global.AU,
            e: 0.00677672, i: 3.39467605,
            l: 181.97909950,
            lp: 131.60246718,
            o: 76.67984255
          },
          cy: {
            a: 0.00000390 * Global.AU,
            e: -0.00004107,
            i: -0.00078890,
            l: 58517.81538729,
            lp: 0.00268329,
            o: -0.27769418
          }
        },
        x: 0,
        y: 0,
        z: 0,
        material: new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: false })
      },

      // Earth
      earth: {
        type: 'planet',
        radius_km: 6371.0,
        distance_km: 149597870.7,
        mass: 5.9721986e24,
        speed: 2.963e-5,
        orbit: {
          base: {
            a: 1.00000261 * Global.AU,            // Semi-major axis
            e: 0.01671123,                        // Eccentricity
            i: -0.00001531,                       // Inclination
            l: 100.46457166,                      // Mean Longitude
            lp: 102.93768193,                     // Longitude of periapsis
            o: 0.0                                // Longitude of Ascending Node (Ω)
          },
          cy: {
            a: 0.00000562 * Global.AU,
            e: -0.00004392,
            i: -0.01294668,
            l: 35999.37244981,
            lp: 0.32327364,
            o: 0.0
          }
        },
        x: 0,
        y: 0,
        z: 0,
        material: new THREE.MeshBasicMaterial({ color: 0x0000FF, wireframe: false })
      },

      // Mars
      mars: {
        type: 'planet',
        radius_km: 3390.0,
        distance_km: 227883110.4,
        mass: 6.41693e23,
        speed: 0.0000228175,
        orbit: {
          base: {
            a: 1.52371034 * Global.AU,
            e: 0.09339410,
            i: 1.84969142,
            l: -4.55343205,
            lp: -23.94362959,
            o: 49.55953891
          },
          cy: {
            a: 0.00001847 * Global.AU,
            e: 0.00007882,
            i: -0.00813131,
            l: 19140.30268499,
            lp: 0.44441088,
            o: -0.29257343
          }
        },
        x: 0,
        y: 0,
        z: 0,
        material: new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: false })
      },

      jupiter: {

      },

      saturn: {

      },

      uranus: {

      },

      neptune: {

      },

      pluto: {

      }
    }
  };
});
