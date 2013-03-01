/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
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
 * ======================================================== */
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/


  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

if(BootStrap === undefined)
{
	var BootStrap = {};
}


BootStrap.Tab = Class.create({
	initialize : function (element) {
		element.store('bootstrap:tab',this)
		this.element = $(element)
	}
	, show: function () {
		var $this = this.element
		, $ul = $this.up('ul:not(.dropdown-menu)')
		, selector = $this.readAttribute('data-target')
		, previous
		, $target
		, e
		
		if (!selector) {
			selector = $this.readAttribute('href')
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
		}
		
		if ( $this.up('li').hasClassName('active') ) return
		
		previous = $ul.select('.active:last a')[0]
		
		$this.fire('bootstrap:show',previous)
		
		
		$target = $$(selector)[0]
		
		this.activate($this.up('li'), $ul)
		this.activate($target, $target.up(), function () {
			$this.fire('bootstrap:shown',previous)
		})
	}
	
	, activate: function ( element, container, callback) {
		var $active = container.select('> .active')[0]
		var transitionCSS = callback && BootStrap.handleeffects == 'css' && $active.hasClassName('fade')
		var transitionEffect = BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined'
		
		function next() {
			$active
			.removeClassName('active')
			.select('> .dropdown-menu > .active')
			.invoke('removeClassName','active')
			
			element.addClassName('active')
			
			
			if (transitionCSS) {
				element.offsetWidth // reflow for transition
				element.addClassName('in')
			} else if (transitionEffect) {
				new Effect.Appear(element,{duration:0.3,afterFinish:function(){
					element.addClassName('in')
				}})
			} else {
				element.removeClassName('fade')
			}
			
			if ( element.up('.dropdown-menu') ) {
				element.up('li.dropdown').addClassName('active')
			}
			
			callback && callback()
		}
		
		if(transitionCSS){
			$active.observe(BootStrap.transitionendevent,function(e){
				next(e)
				this.stopObserving(BootStrap.transitionendevent)
			});
			$active.removeClassName('in')
		} else if (transitionEffect){
			if($active.hasClassName('in') && $active.hasClassName('fade')){
				new Effect.Fade($active,{duration:0.3,afterFinish:function(){
					$active.removeClassName('in')
					next()
				}})
			}
			else{
				next()
			}
		} else {
			next()
			$active.removeClassName('in')
		}
		
	}
});


document.observe("dom:loaded",function(){
	$$('[data-toggle="tab"], [data-toggle="pill"]').invoke('observe','click',function(e){
		e.preventDefault();
		new BootStrap.Tab(this).show()
	});
})