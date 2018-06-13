// Static Starter
/*jshint latedef:false*/

//=include "../bower_components/jquery/dist/jquery.js"
//=include "../bower_components/velocity/velocity.min.js"

var Main = (function($) {

  var screen_width,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,1000,1200],
      $document;

  function _init() {
    // Cache some common DOM queries
    $document = $(document);

    // Add loaded class to body
    $('body').addClass('loaded');

    // Set screen size vars
    _resize();

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {}
    });

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

    // Scroll down to hash afer page load
    $(window).load(function() {
      if (window.location.hash) {
        _scrollBody($(window.location.hash));
      }
    });

  }

  /**
   * Pull in svg-defs.svg to body for <use> tags
   */
  function _injectSvgDefs() {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'assets/dist/svgs-defs.svg', true);
    ajax.send();
    ajax.onload = function(e) {
      var div = document.createElement('div');
      div.classList.add('hidden');
      div.innerHTML = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
  }

  /**
   * Scroll body to element
   */
  function _scrollBody(element, duration, delay) {
    element.velocity('scroll', {
      duration: duration,
      delay: delay,
    }, 'easeOutSine');
  }

  /**
   * Track ajax pages in Analytics
   */
  function _trackPage() {
    if (typeof ga !== 'undefined') { ga('send', 'pageview', document.location.href); }
  }

  /**
   * Track events in Analytics
   */
  function _trackEvent(category, action) {
    if (typeof ga !== 'undefined') { ga('send', 'event', category, action); }
  }

  /**
   * Called in quick succession as window is resized
   */
  function _resize() {
    screen_width = document.documentElement.clientWidth;
    breakpoint_small = (screen_width > breakpoint_array[0]);
    breakpoint_medium = (screen_width > breakpoint_array[1]);
    breakpoint_large = (screen_width > breakpoint_array[2]);
  }

  /**
   * Public functions
   */
  return {
    init: _init,
    resize: _resize,
    scrollBody: function(section, duration, delay) {
      _scrollBody(section, duration, delay);
    }
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(Main.init);
jQuery(window).resize(Main.resize);
