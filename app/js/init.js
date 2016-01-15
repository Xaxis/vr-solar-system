/**
 * App initialization module
 */
define([
  'Main',
  'router',
  'core/main/views/mainView'
], function(
  Main,
  Router,
  MainView
) {
  var Init = function() {
    return {

      /**
       * Initialize modules
       */
      initialize: function() {

        // App initializations
        new Main().initialize({
          axes: true,
          axes_radius: 24
        });

        // Module initializations
        Router.initialize({pushState: true});

        // Backbone initializations
        new MainView();
      }
    };
  };

  return Init;
});
