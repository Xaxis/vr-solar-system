/**
 * Contains methods to calculate celestial body orbital elements.
 */
define([
  'underscore',
  'Global',
  'CMath',
  'three'
], function(_, G, CMath) {
  var OrbitalElements = function() {
    return {

      calculateElements: function( body, epoch ) {
        var
          epoch           = epoch || G.EPOCH,
          t               = this.getEpochTime(),
          t_days          = t / G.DAY_SECS,
          T               = t_days / G.CENTURY_DAYS,
          computed        = {
            t: t
          };

        // Iterate over base orbital elements
        _.each(body.orbit.base, function(value, idx) {
          var
            orbit           = body.orbit,
            variation       = orbit.cy[idx];
          variation = variation || 0;
          computed[idx] = value + (variation * T);
        });

        // ...
        if (computed.w === undefined) {
          computed.w = computed.lp - computed.o;
        }
        if (computed.M === undefined) {
          computed.M = computed.a * G.KM;
        }

        // ...
        computed.i = G.DEG_TO_RAD * computed.i;
        computed.o = G.DEG_TO_RAD * computed.o;
        computed.w = G.DEG_TO_RAD * computed.w;
        computed.M = G.DEG_TO_RAD * computed.M;

        // Solve Eccentric Anomaly
        computed.E = this.solveEccentricAnomaly(computed.e, computed.M);

        // ...
        computed.E = computed.E % G.CIRCLE;
        computed.i = computed.i % G.CIRCLE;
        computed.o = computed.o % G.CIRCLE;
        computed.w = computed.w % G.CIRCLE;
        computed.M = computed.M % G.CIRCLE;

        // ...
        computed.pos = new THREE.Vector3(
          computed.a * Math.cos(computed.E) - computed.e,
          computed.a * Math.sqrt(1 - (computed.e * computed.e)) * Math.sin(computed.E)
        );

        // ...
        computed.r = computed.pos.length();
        computed.v = Math.atan2(computed.pos.y, computed.pos.x);

        // ...
        console.table(computed);
        return computed;
      },

      getEccentricAnomaly: function(f, x0, maxIter) {
        var
          x       = 0,
          x2      = x0;
        for (var i = 0; i < maxIter; i++) {
          x = x2;
          x2 = f(x);
        }
        return x2;
      },

      getKepler: function(e, M) {
        return function(x) {
          return x + (M + e * Math.sin(x) -x) / (1 - e * Math.cos(x));
        };
      },

      getKeplerLaguerreConway: function(e, M) {
        return function(x) {
          var
            s         = e * Math.sin(x),
            c         = e * Math.con(x),
            f         = x - s - M,
            f1        = 1 - c,
            f2        = s;
          x += -5 * f / (f1 + CMath.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)));
          return x;
        };
      },

      getKeplerLaguerreConwayHyp: function(e, M) {
        return function(x) {
          var
            s         = e * CMath.sinh(x),
            c         = e * CMath.cosh(x),
            f         = x - s - M,
            f1        = c - 1,
            f2        = s;
          x += -5 * f / (f1 + CMath.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)));
          return x;
        };
      },

      solveEccentricAnomaly: function(e, M) {
        if (e == 0.0) {
          return M;
        } else if (e < 0.9) {
          return this.getEccentricAnomaly(this.getKepler(e, M), M, 6);
        } else if (e < 1.0) {
          var E = M + 0.85 * e * ((Math.sin(M) >= 0.0) ? 1 : -1);
          return this.getEccentricAnomaly(this.getKeplerLaguerreConway(e, M), E, 8);
        } else if (e == 1.0) {
          return M;
        } else {
          var E = Math.log(2 * M / e + 1.85);
          return this.getEccentricAnomaly(this.getKeplerLaguerreConwayHyp(e, M), E, 30);
        }
      },

      getEpochTime: function( user_date ) {
        var
          diff_date       = user_date || new Date();
        return (diff_date - G.EPOCH) / 1000;
      }
    };
  };

  return new OrbitalElements;
});
