/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
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

 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

BootStrap.Collapse = Class.create({
	initialize : function (element, options) {
		this.$element = $(element)
		
		this.$element.store('bootstrap:collapse',this)
		
		this.options = {
			toggle: true
		}
		
		Object.extend(this.options,options)
		
		if (this.options.parent)
		{
			this.$parent = $(this.options.parent)
		}
		
		var dimension = this.dimension()
  		this.dim_value = this.$element['get'+dimension.capitalize()]()
		this.dim_object = {}
		this.dim_object[dimension] = this.dim_value+'px'
		this.$element.setStyle(this.dim_object)
		this.clean_style = {}
		this.clean_style[dimension] = ''
		if(this.options.toggle)
		{
			this.toggle()
		}
	}
	
	, dimension: function () {
		var hasWidth = this.$element.hasClassName('width')
		return hasWidth ? 'hidth' : 'height'
	}
	
	, show: function () {
		if (this.transitioning || this.$element.hasClassName('in')) return

		var startEvent = this.$element.fire('bootstrap:show')
		if(startEvent.defaultPrevented) return

		var actives = this.$parent && this.$parent.select('> .panel > .in')

		if (actives && actives.length) {
			actives.each(function(el){
				var bootstrapobject = el.retrieve('bootstrap:collapse')
				if (bootstrapobject && bootstrapobject.transitioning) return
				bootstrapobject.hide()
			});
		}

		var dimension = this.dimension()
		this.$element.setStyle(this.clean_style)

		this.transitioning = 1

		var complete = function () {
			this.$element.removeClassName('collapsing').addClassName('in')
			this.$element.setStyle(this.dim_object)
			this.transitioning = 0
			this.$element.fire('bootstrap:shown')
			this.$element.stopObserving(BootStrap.transitionendevent,complete)
		}.bind(this)


		if(BootStrap.handleeffects == 'css')
		{
			this.$element.observe(BootStrap.transitionendevent, complete)
			this.$element.removeClassName('collapse').addClassName('collapsing')
	
			setTimeout(function(){
			  this.$element.setStyle(this.dim_object)
			}.bind(this),0)
		}
		else if(BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.BlindDown !== 'undefined')
		{
			this.$element.blindDown({duration:0.350,beforeStart:function(effect){
					effect.element.hide()
					this.$element.removeClassName('collapse')
					effect.element.addClassName('in')
			}.bind(this),afterFinish:function(effect){
					complete()
			}.bind(this)})
		}
		else
		{
			setTimeout(function(){
			  complete()
			},350);
		}
	}
	
	, hide: function () {
		if (this.transitioning || !this.$element.hasClassName('in')) return

		var startEvent = this.$element.fire('bootstrap:hide')
		if(startEvent.defaultPrevented) return

		var dimension = this.dimension()

		var complete = function () {
			this.transitioning = 0
			this.$element.fire('bootstrap:hidden')
			this.$element.removeClassName('collapsing').addClassName('collapse')
			this.$element.setStyle(this.dim_object)
			this.$element.stopObserving(BootStrap.transitionendevent,complete)
		}.bind(this)

		if(BootStrap.handleeffects == 'css')
		{
			this.$element.observe(BootStrap.transitionendevent, complete)
			this.$element.addClassName('collapsing').removeClassName('in')
			setTimeout(function(){
			  this.$element.setStyle(this.clean_style)
			}.bind(this),0)
		}
		else if(BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.BlindUp !== 'undefined')
		{
			this.$element.blindUp({duration:0.350,afterFinish:function(effect){
				effect.element.removeClassName('in')
				effect.element.show()
				complete()
			}.bind(this)})
		}
		else
		{
			complete()
		}
	}
	
	, toggle: function () {
		this[this.$element.hasClassName('in') ? 'hide' : 'show']()
	}
	
});




/*domload*/

document.observe('dom:loaded',function(){
	$$('[data-toggle="collapse"]').each(function(e){
		var href = e.readAttribute('href');
		href = e.hasAttribute('href') ? href.replace(/.*(?=#[^\s]+$)/, '') : null
		var target = e.readAttribute('data-target') || href
		var options = {toggle : false}
		if(e.hasAttribute('data-parent')){
			options.parent = e.readAttribute('data-parent').replace('#','')
		}
		target = $$(target).first()
		if(target.hasClassName('in')){
			e.addClassName('collapsed')
		} else {
			e.removeClassName('collapsed')
		}
		new BootStrap.Collapse(target,options)
	});

	document.on('click','[data-toggle="collapse"]',function(e){
		var href = e.findElement().readAttribute('href');
		href = e.findElement().hasAttribute('href') ? href.replace(/.*(?=#[^\s]+$)/, '') : null
		var target = e.findElement().readAttribute('data-target') || e.preventDefault() || href
		$$(target).first().retrieve('bootstrap:collapse').toggle();
	});
});