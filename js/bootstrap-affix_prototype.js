/* ==========================================================
* bootstrap-affix.js v2.3.2
* http://twitter.github.com/bootstrap/javascript.html#affix
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


"use strict";

if(BootStrap === undefined)
{
	var BootStrap = {};
}

/* AFFIX CLASS DEFINITION
 * ====================== */

BootStrap.Affix = Class.create({
	initialize : function (element, options) {
		this.$element = $(element)
		this.$element.store('bootstrap:affix',this)
		//defaults
		this.options = {
			offset: 0
		}

		Object.extend(this.options, options)

		Event.observe(window,'scroll',this.checkPosition.bind(this))
		Event.observe(window,'click',function(){
			setTimeout(this.checkPosition.bind(this),1)
		}.bind(this))
		this.checkPosition()
	},
	checkPosition : function () {
		if (!this.$element.visible()) return

		var scrollHeight = document.height
		, scrollTop = window.pageYOffset || document.documentElement.scrollTop
		, position = this.$element.positionedOffset()
		, offset = this.options.offset
		, offsetBottom = offset.bottom
		, offsetTop = offset.top
		, reset = ['affix','affix-top','affix-bottom']
		, affix

		if (typeof offset != 'object') offsetBottom = offsetTop = offset
		if (typeof offsetTop == 'function') offsetTop = offset.top()
		if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

		affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
			false    : offsetBottom != null && (position.top + this.$element.getHeight() >= scrollHeight - offsetBottom) ?
				'bottom' : offsetTop != null && scrollTop <= offsetTop ?
					'top'    : false

		if (this.affixed === affix) return

		this.affixed = affix
		this.unpin = affix == 'bottom' ? position.top - scrollTop : null

		$(reset).each(function(a){Element.removeClassName(this.$element,a)},this)
		this.$element.addClassName('affix' + (affix ? '-' + affix : ''))
	}
});

Event.observe(window,'load',function(){
	$$('[data-spy="affix"]').each(function($spy){
		var data = {}
		data.offset = $spy.hasAttribute('data-offset') ? $spy.readAttribute('data-offset') : {}
		$spy.hasAttribute('data-offset-bottom') ? data.offset.bottom = $spy.readAttribute('data-offset-bottom') : ''
		$spy.hasAttribute('data-offset-top') ? data.offset.top = $spy.readAttribute('data-offset-top') : ''

		new BootStrap.Affix($spy,data);
	})
})
