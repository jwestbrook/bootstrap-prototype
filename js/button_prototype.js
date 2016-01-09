/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
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


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */
BootStrap.Button = Class.create({
	initialize : function (element, options) {
		this.VERSION = '3.3.6'
		this.$element = $(element)
		this.$element.store('bootstrap:button',this)
		
		this.options = {
			loadingText: 'loading...'
		}

		if(typeof options == 'object'){
			Object.extend(this.options,options)
		} else if(typeof options != 'undefined' && options == 'toggle') {
			this.toggle()
		} else if (typeof options != 'undefined'){
			this.setState(options)
		}
	},
	setState : function (state) {
		var d = 'disabled'
		var $el = this.$element
		var val = $el.match('input') ? 'value' : 'innerHTML'
		
		state = state + 'Text'
		
		if(!$el.hasAttribute('data-reset-text')) $el.writeAttribute('data-reset-text',$el[val])
		
		
		// push to event loop to allow forms to submit
		setTimeout(function () {
			$el[val] = ($el.readAttribute('data-'+state.underscore().dasherize()) || (this.options && this.options[state]) || '')

			if (state == 'loadingText') {
				this.isLoading = true
				$el.addClassName(d).writeAttribute(d,true)
			} else if (this.isLoading) {
				this.isLoading = false
				$el.removeClassName(d).writeAttribute(d,false)
			}
		}.bind(this), 0)
	},
	toggle : function () {
		var changed = true
		var $parent = this.$element.up('[data-toggle="buttons"]')
		
		if($parent !== undefined){
			var $input = this.$element.down('input')
			if($input.readAttribute('type') == 'radio') {
				if($input.checked) changed = false
				$parent.select('.active').invoke('removeClassName','active')
				this.$element.addClassName('active')
			} else if ($input.readAttribute('type') == 'checkbox') {
				if($input.checked !== this.$element.hasClassName('active')) changed = false
				this.$element.toggleClassName('active')
			}
			$input.writeAttribute('checked',this.$element.hasClassName('active'))
			if(Event.simulate && changed){
				$input.simulate('change')
			}
		} else {
			this.$element.writeAttribute('aria-pressed',!this.$element.hasClassName('active'))
			this.$element.toggleClassName('active')
		}
	}
});


/*domload*/

document.observe("dom:loaded",function(){
	document.on('click','[data-toggle^=button]',function(e,targetElement){
		var $btn = e.findElement();
		if(!$btn.hasClassName('btn')) $btn = $btn.up('.btn')
			new BootStrap.Button($btn,'toggle')
		if (!(targetElement.match('input[type="radio"]') || targetElement.match('input[type="checkbox"]'))) e.preventDefault()
	});
	$$('[data-toggle^=button]').invoke('observe','focus',function(e){
		this.up('.btn').toggleClassName('focus', /^focus(in)?$/.test(e.type))
	})
})