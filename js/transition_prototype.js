/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/*

Modified for use with PrototypeJS

https://github.com/jwestbrook/bootstrap-prototype/tree/master-3.0


*/


"use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================


var BootStrap = {
  transitionendevent : null,
  handleeffects : null
  };

//Test CSS transitions first - less JS to implement
var transEndEventNames = $H({
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd otransitionend',
  'transition'       : 'transitionend'
});

var el = new Element("bootstrap");
transEndEventNames.each(function(pair){
  if(el.style[pair.key] !== undefined)
  {
    BootStrap.transitionendevent = pair.value;
    BootStrap.handleeffects = 'css';
  }
});

//then go to scriptaculous

if(BootStrap.handleeffects === null && typeof Scriptaculous !== 'undefined' && typeof Effect !== 'undefined')
{
  BootStrap.handleeffects = 'effect';
}