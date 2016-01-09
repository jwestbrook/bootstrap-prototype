/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
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



 /* ALERT CLASS DEFINITION
  * ====================== */
BootStrap.Alert = Class.create({
	initialize : function (element) {
		this.VERSION = '3.3.6'
		this.TRANSITION_DURATION = 150
		element = $(element);
		element.store('bootstrap:alert',this)
		element.on('click','[data-dismiss="alert"]',this.close)
	},
	close : function (e) {
		var $this = $(this)
		var selector = $this.readAttribute('data-target')
	
		if (!selector) {
			selector = $this.readAttribute('href')
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
		}
	
		var $parent = $$(selector)
	
		if(e){
			e.preventDefault()
			e.stop()
		}
	
		if(!$parent.length){
			$parent = $this.hasClassName('alert') ? $this : $this.up()
		}
	
		var closeEvent = $parent.fire('bootstrap:close')
	
		if(closeEvent.defaultPrevented) return
	
		function removeElement() {
			$parent.fire('bootstrap:closed')
			$parent.remove()
		}
	
		if(BootStrap.handleeffects === 'css' && $parent.hasClassName('fade'))
		{
			$parent.observe(BootStrap.transitionendevent,removeElement);
			$parent.removeClassName('in')
		}
		else if(BootStrap.handleeffects === 'effect' && $parent.hasClassName('fade'))
		{
			new Effect.Fade($parent,{duration:0.3,from:$parent.getOpacity()*1,afterFinish:function(){
				$parent.removeClassName('in')
				removeElement()
			}})
		}
		else
		{
			removeElement()
		}
	
	}
});

/*domload*/

document.observe("dom:loaded",function(){
	document.on('click','[data-dismiss="alert"]',BootStrap.Alert.prototype.close)
	$$('.alert [data-dismiss="alert"]').each(function(i){
		new BootStrap.Alert(i)
	})
});