/**
 * Contains shared global properties.
 */
define([
], function() {
  return {

    // Gravitational constant
    G: 6.67384e-11,

    // 149597870.7 KM == 1 AU
    AU: 149597870.7,

    // KM in Meters
    KM: 1000,

    // Scale configuration
    PLANET_SIZE_SCALE: 1000,
    PLANET_DIST_SCALE: 1,
    STAR_SIZE_SCALE: 30,

    // 4,545,000,000 KM radius
    SOLAR_SYSTEM_RADIUS: 4545000000,

    // Epoch/Time
    EPOCH_YEAR: 2000,
    EPOCH_MONTH: 1,
    EPOCH_DATE: 1,
    EPOCH: new Date('2000-01-01T12:00:00-00:00'),
    DAY_SECS: 60 * 60 * 24,
    SIDERAL_DAY_SECS: 3600 * 3.9344696,
    YEAR_DAYS: 365.24,
    CENTURY_DAYS: 100 * 365.24,

    // Math
    CIRCLE: 2 * Math.PI,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI
  };
});
