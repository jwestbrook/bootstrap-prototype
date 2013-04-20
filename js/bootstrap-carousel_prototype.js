/* ==========================================================
* bootstrap-carousel_prototype.js v2.3.1
* http://twitter.github.com/bootstrap/javascript.html#carousel
* ==========================================================
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
* ========================================================== */
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/


"use strict"; // jshint ;_;

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
			}
		this.$element = element
		element.store('bootstrap:carousel',this)
		this.$indicators = this.$element.down('.carousel-indicators')
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
		var $active = this.$element.select('.item.active')
		, children = $active.up().childElements()
		, activePos = children.index($active)
		
		if (pos > (children.length - 1) || pos < 0) return
		
		if (this.sliding) {
			return this.$element.on('slid', function () {
				this.to(pos)
				}.bind(this))
		}
		
		if (activePos == pos) {
			return this.pause().cycle()
		}
		
		return this.slide(pos > activePos ? 'next' : 'previous', $(children[pos]))
	}
	, pause: function (e) {
		if (!e) this.paused = true
		if (this.$element.select('.next, .prev').length && BootStrap.handleeffects == 'css') {
			this.$element.fire(BootStrap.transitionendevent)
			this.cycle()
		}
		clearInterval(this.interval)
		this.interval = null
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
		var $active = this.$element.down('.item.active')
		, $next = next || $active[type]()
		, isCycling = this.interval
		, direction = type == 'next' ? 'left' : 'right'
		, fallback  = type == 'next' ? 'first' : 'last'
		, that = this
		, e
		
		this.sliding = true
		
		isCycling && this.pause()

		$next = $next != undefined ? $next : this.$element.select('.item')[fallback]()

		type = (type == 'previous' ? 'prev' : type)
/*
		e = $.Event('slide', {
			relatedTarget: $next[0]
		})
*/
		
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
			this.$element.fire('bootstrap:slide')

			this.$element.on(BootStrap.transitionendevent, function (e) {
				$next.removeClassName([type, direction].join(' ')).addClassName('active')
				$active.removeClassName(['active', direction].join(' '))
				this.sliding = false
				setTimeout(function () { this.$element.fire('bootstrap:slid') }.bind(this), 0)
				isCycling && this.cycle()
				this.$element.stopObserving(BootStrap.transitionendevent)
			}.bind(this))


			$next.addClassName(type)
			$next.offsetWidth // force reflow
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
			this.$element.fire('bootstrap:slide')
			$active.removeClassName('active')
			$next.addClassName('active')
			this.sliding = false
			this.$element.fire('bootstrap:slid')
			isCycling && this.cycle()
		}
		
		return this
	}
});


document.observe('dom:loaded',function(){
	document.on('click','[data-slide], [data-slide-to]',function(e){
		var $this = e.findElement(), href
		, $target = $($this.readAttribute('data-target') || (href = $this.readAttribute('href')) && href.replace(/.*(?=#[^\s]+$)/, '').replace('#','')) //strip for ie7
		, options = Object.extend({})
		, to = $this.readAttribute('data-slide')
		, slideindex
		
		$target.retrieve('bootstrap:carousel')[to]()

		if ($this.hasAttribute('data-slide-to')) {
			slideIndex = $this.readAttribute('data-slide-to')
			$target.retrieve('bootstrap:carousel').pause().to(slideIndex).cycle()
		}
		
		e.stop()
	});
});