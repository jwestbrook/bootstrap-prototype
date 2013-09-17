/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
/*

Modified for use with PrototypeJS

https://github.com/jwestbrook/bootstrap-prototype/tree/master-3.0


*/

"use strict";


if(BootStrap === undefined)
{
  var BootStrap = {};
}

BootStrap.ScrollSpy = Class.create({

  initialize : function(element, options) {
    element = $(element)
    element.store('bootstrap:scrollspy',this)
    //defaults
    this.options = {
      offset: 30
    }
    if(element.hasAttribute('data-target'))
    {
      this.options.target = element.readAttribute('data-target')
    }
    var $element = element.match('body') ? window : element
    var href

    Object.extend(this.options, options)
    this.$scrollElement = $element.observe('scroll', this.process.bind(this))
    this.selector = (this.options.target
      || ((href = element.readAttribute('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $$('body').first();
    this.refresh()
    this.process()
  },
  refresh: function () {
    var self = this
    var $targets

    this.offsets = []
    this.targets = []

    $targets = this.$body.select(this.selector).map(function(t) {
      var $el = t
      var href = $el.readAttribute('data-target') || $el.readAttribute('href')
      var $href = /^#\w/.test(href) && $$(href).first()
      return ( $href
        && [ $href.viewportOffset().top - $href.getHeight() + ((this.$scrollElement != window) && this.$scrollElement.cumulativeScrollOffset().top), href ] ) || null
    },this).without(false,null)
    .sort(function (a, b) { return a - b })
    .each(function(v){
      this.offsets.push(v[0])
      this.targets.push(v[1])
    },this)
  },
  process: function () {
    var scrollTop = this.$scrollElement.cumulativeScrollOffset().top + this.options.offset
    var scrollHeight = this.$scrollElement.scrollHeight || this.$body.scrollHeight
    var maxScroll = scrollHeight - this.$scrollElement.getHeight()
    var offsets = this.offsets
    var targets = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()) && this.activate ( i )
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  },
  activate: function (target) {
    var active
    , selector

    this.activeTarget = target

    $$(this.options.target).length > 0 ? $$(this.options.target).first().select('.active').invoke('removeClassName','active') : '';

    selector = this.selector
    + '[data-target="' + target + '"],'
    + this.selector + '[href="' + target + '"]'

    active = $$(selector).first().up('li').addClassName('active')

    if (active.up('.dropdown-menu') !== undefined){
      active = active.up('li.dropdown').addClassName('active')
    }

    active.fire('bootstrap:activate')
  }

});


Event.observe(window,'load', function () {
  $$('[data-spy="scroll"]').each(function(element) {
    new BootStrap.ScrollSpy(element)
  })
})