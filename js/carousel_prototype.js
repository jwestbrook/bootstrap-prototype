/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
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

/* CAROUSEL CLASS DEFINITION
* ========================= */

BootStrap.Carousel = Class.create({

  initialize : function (element, options) {
    this.options = {
      interval: 5000
      , pause: 'hover'
      , wrap : true
      }

    this.$element     = $(element)
    element.store('bootstrap:carousel',this)

    this.$indicators  = this.$element.down('.carousel-indicators')
    this.interval     = null

    this.options.interval = this.$element.hasAttribute('data-interval') ? this.$element.readAttribute('data-interval') : this.options.interval
    Object.extend(this.options,options)

    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element.on('mouseenter', this.pause.bind(this)) && this.$element.on('mouseleave', this.cycle.bind(this))
    
    if(this.options.interval)
    {
      this.cycle()
    }
    
  }
  , cycle: function (e) {
    if (!e) this.paused = false

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval(this.next.bind(this), this.options.interval))
    return this
  }
  , getActiveIndex: function () {
    this.$active = this.$element.down('.item.active')
    this.$items = this.$active.up().childElements()
    return this.$items.indexOf(this.$active)
  }
  , to: function (pos) {
    var activeIndex = this.getActiveIndex()
    // var $active = this.$element.select('.item.active')
    // , children = $active.up().childElements()
    // , activePos = children.index($active)
    
    if (pos > (this.$items.length - 1) || pos < 0) return
    
    if (this.sliding) {
      return this.$element.on('bootstrap:slid', function () {
        this.to(pos)
        }.bind(this))
    }
    
    if (activeIndex == pos) {
      return this.pause().cycle()
    }
    
    return this.slide(pos > activeIndex ? 'next' : 'previous', $(this.$items[pos]))
  }
  , pause: function (e) {
    if (!e) this.paused = true

    if (this.$element.select('.next, .prev').length && BootStrap.handleeffects == 'css') {
      this.$element.fire(BootStrap.transitionendevent)
      this.cycle(true)
    }
    this.interval = clearInterval(this.interval)
    return this
  }
  , next: function () {
    if (this.sliding) return
    return this.slide('next')
  }
  , prev: function () {
    if (this.sliding) return
    return this.slide('previous')
  }
  , slide: function (type, next) {
    var $active   = this.$element.down('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var slideEventmemo
    var slideEvent

    if($next !== undefined){
      if(this.options.wrap) return
      $next = this.$element.select('.item')[fallback]()
    }
    
    this.sliding = true
    
    isCycling && this.pause()

    slideEventmemo = { relatedTarget: $next, direction: direction }

    type = (type == 'previous' ? 'prev' : type)
    
    if ($next.hasClassName('active')) return
    
    if (this.$indicators) {
      this.$indicators.down('.active').removeClassName('active')
      this.$element.on('bootstrap:slid', function () {
        var $nextIndicator = $(this.$indicators.childElements()[this.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClassName('active')
        this.$element.stopObserving('bootstrap:slid')
      }.bind(this))
    }



    if (BootStrap.handleeffects == 'css' && this.$element.hasClassName('slide')) {
      slideEvent = this.$element.fire('bootstrap:slide',slideEventmemo)
      if(slideEvent.defaultPrevented) return

      this.$element.on(BootStrap.transitionendevent, function (e) {
        $next.removeClassName([type, direction].join(' ')).addClassName('active')
        $active.removeClassName(['active', direction].join(' '))
        this.sliding = false
        setTimeout(function () { this.$element.fire('bootstrap:slid') }.bind(this), 0)
        isCycling && this.cycle()
        this.$element.stopObserving(BootStrap.transitionendevent)
      }.bind(this))


      $next.addClassName(type)
      $active.addClassName(direction)
      $next.addClassName(direction)
    } else if(BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Morph !== 'undefined'){
      
      new Effect.Parallel([
        new Effect.Morph($next,{'sync':true,'style':'left:0%;'}),
        new Effect.Morph($active,{'sync':true,'style':'left:'+( direction == 'left' ? '-' : '' )+'100%;'})
      ],{
        'duration':0.6,
        'beforeSetup':function(effect){
          $next.addClassName(type)
          this.sliding = true
        }.bind(this),
        'afterFinish':function(effect){
          $next.removeClassName(type).addClassName('active')
          $active.removeClassName('active')
          $next.style[direction] = null;
          $active.style[direction] = null;
          this.sliding = false
          this.$element.fire('bootstrap:slid')
          isCycling && this.cycle()
        }.bind(this)
      })
      
    } else {
      slideEvent = this.$element.fire('bootstrap:slide',slideEventmemo)
      if(slideEvent.defaultPrevented) return
      $active.removeClassName('active')
      $next.addClassName('active')
      this.sliding = false
      this.$element.fire('bootstrap:slid')
      isCycling && this.cycle()
    }
    
    return this
  }
});

/*domload*/

document.observe('dom:loaded',function(){
  document.on('click','[data-slide], [data-slide-to]',function(e){
    var $this = e.findElement(), href
    var $target = $$($this.readAttribute('data-target') || (href = $this.readAttribute('href')) && href.replace(/.*(?=#[^\s]+$)/, '')).first() //strip for ie7
    var options = {}
    var to = $this.readAttribute('data-slide')
    var slideIndex
    
    $target.retrieve('bootstrap:carousel')[to]()

    if ($this.hasAttribute('data-slide-to')) {
      slideIndex = $this.readAttribute('data-slide-to')
      $target.retrieve('bootstrap:carousel').pause().to(slideIndex).cycle()
    }
    
    e.stop()
  });
  $$('[data-ride="carousel"]').each(function(element) {
    new BootStrap.Carousel(element)
  })

});