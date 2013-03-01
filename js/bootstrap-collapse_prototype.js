/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
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
 * ============================================================ */
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/



  "use strict"; // jshint ;_;
if(BootStrap === undefined)
{
  var BootStrap = {};
}

 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

BootStrap.Collapse = Class.create({
	initialize : function (element, options) {
		this.$element = $(element)
		
		element.store('bootstrap:collapse',this)
		
		this.options = {
			toggle: true
		}
		
		Object.extend(this.options,options)
		
		
		if (this.options.parent) {
			this.$parent = $(this.options.parent)
		}
		
		var dimension = this.dimension()
		if(this.$element.style[dimension] === 'auto')
		{
			var scroll = ['scroll', dimension].join('-').camelize()
			this.reset(this.$element[scroll]+'px')
		}
		
		this.options.toggle && this.toggle()
	}
	
	, dimension: function () {
		var hasWidth = this.$element.hasClassName('width')
		return hasWidth ? 'width' : 'height'
	}
	
	, show: function () {
		var dimension
		, scroll
		, actives
		, hasData
		
		if (this.transitioning) return
		
		dimension = this.dimension()
		scroll = ['scroll', dimension].join('-').camelize()
		actives = this.$parent && this.$parent.select('> .accordion-group > .in')
		
		if (actives && actives.length) {
			actives.each(function(el){
				var bootstrapobject = el.retrieve('bootstrap:collapse')
				if (bootstrapobject && bootstrapobject.transitioning) return
				bootstrapobject.hide()
			});
		}
		
		var newstyle = {}
		newstyle[dimension] = '0px'
		this.$element.setStyle(newstyle)
		this.transition('addClassName', 'show', 'bootstrap:shown')
		
		if(BootStrap.handleeffects == 'css'){
			newstyle = {}
			newstyle[dimension] = this.$element[scroll]+'px'
			this.$element.setStyle(newstyle)
		} else if(BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.BlindDown !== 'undefined'){
			this.$element.blindDown({duration:0.5,afterFinish:function(effect){
//				effect.element[method]('in')
				newstyle = {}
				newstyle[dimension] = this.$element[scroll]+'px'
				this.$element.setStyle(newstyle)
			}.bind(this)})
		/* 		   this.$element[dimension](this.$element[scroll] */
		}
	}
	
	, hide: function () {
		var dimension
		if (this.transitioning) return
		dimension = this.dimension()
		this.reset(this.$element.getStyle(dimension))
		this.transition('removeClassName', 'hide', 'bootstrap:hidden')
		if(Effect.Queues.get('global').effects.length == 0)
		{
			var newstyle = {}
			newstyle[dimension] = '0px'
			this.$element.setStyle(newstyle)
		}
	}
	
	, reset: function (size) {
		var dimension = this.dimension()
		
		this.$element
			.removeClassName('collapse')
		
		var newstyle = {}
		newstyle[dimension] = size
		this.$element.setStyle(newstyle)
		
		this.$element[size !== null ? 'addClassName' : 'removeClassName']('collapse')
		
		return this
	}
	
	, transition: function (method, startEvent, completeEvent) {
		var that = this
		, complete = function () {
			if (startEvent == 'show') this.reset()
			this.transitioning = 0
			this.$element.fire(completeEvent)
		}.bind(this)
		
		this.$element.fire('bootstrap:'+startEvent)
		
		this.transitioning = 1
		
		if(BootStrap.handleeffects == 'css' && this.$element.hasClassName('collapse')){
			this.$element.observe(BootStrap.transitionendevent, complete)
			this.$element[method]('in')
		} else if(startEvent == 'hide' && BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.BlindUp !== 'undefined') {
			this.$element.blindUp({duration:0.5,afterFinish:function(effect){
				var dimension = this.dimension()
				effect.element[method]('in')
				var newstyle = {}
				newstyle[dimension] = '0px'
				this.$element.setStyle(newstyle)
				complete()
			}.bind(this)})
		} else if(startEvent == 'show' && BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.BlindUp !== 'undefined') {
			this.$element.blindDown({duration:0.5,beforeStart:function(effect){
				var dimension = this.dimension()
				effect.element[method]('in')
				var newstyle = {}
				newstyle[dimension] = 'auto'
				this.$element.setStyle(newstyle)
				effect.element.hide()
			}.bind(this),afterFinish:function(effect){
				complete()
			}.bind(this)})
		}
		else {
			complete()
			this.$element[method]('in')
		}
		
		
		
	}
	
	, toggle: function () {
		this[this.$element.hasClassName('in') ? 'hide' : 'show']()
	}
	
});





 /* COLLAPSIBLE DATA-API
  * ==================== */
document.observe('dom:loaded',function(){
	$$('[data-toggle="collapse"]').each(function(e){
		var href = e.readAttribute('href');
		href = href.replace(/.*(?=#[^\s]+$)/, '').replace('#','')
		var target = e.readAttribute('data-target') || href
		, options = {toggle : false}
		if(e.hasAttribute('data-parent')){
			options.parent = e.readAttribute('data-parent').replace('#','')
		}
		target = $(target)
		if(target.hasClassName('in')){
			e.addClassName('collapsed')
		} else {
			e.removeClassName('collapsed')
		}
		new BootStrap.Collapse(target,options)
	});

	document.on('click','[data-toggle="collapse"]',function(e){
		var href = e.findElement().readAttribute('href');
		href = href.replace(/.*(?=#[^\s]+$)/, '').replace('#','')
		var target = e.findElement().readAttribute('data-target') || e.preventDefault() || href
		$(target).retrieve('bootstrap:collapse').toggle();
	});
});