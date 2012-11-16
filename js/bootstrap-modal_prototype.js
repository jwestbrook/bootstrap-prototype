/* =========================================================
* bootstrap-modal.js v2.2.1
* http://twitter.github.com/bootstrap/javascript.html#modals
* =========================================================
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
* ========================================================= */



/* MODAL CLASS DEFINITION
* ====================== */
if(BootStrap == undefined)
{
	var BootStrap = {};
}

BootStrap.Modal = function (element, options) {
	this.$element = $(element);
	this.options = options
	this.options.backdrop = this.options.backdrop != undefined ? options.backdrop : true
	this.options.keyboard = this.options.keyboard != undefined ? options.keyboard : true
	this.options.show = this.options.show != undefined ? options.show : true
	
	
	if(this.options.show)
		this.show();
	$$("[data-dismiss='modal']").invoke("observe","click",function(){
		this.hide()
	}.bind(this))
	
	if(this.options.remote && this.$element.select('.modal-body'))
	{
		new Ajax.Updater(this.$element.select('.modal-body')[0],this.options.remote);
	}
}

BootStrap.Modal.prototype = {
	
	toggle: function () {
		return this[!this.isShown ? 'show' : 'hide']()
	}
	, show: function (e) {
		var that = this
		
		this.$element.setStyle({display:'block'})
		
		if (this.isShown ) return
		
		this.isShown = true
		
		this.escape()
		
		this.backdrop(function () {
			var transition = Effect != undefined && Effect.Fade != undefined && that.$element.hasClassName('fade')
			
			if (!that.$element.up().length) {
				$$("body")[0].insert(that.$element);
			}
			that.$element.setStyle({display:'block'})
			
			transition ? new Effect.Morph(that.$element,{duration:0.3,style:'top:50%',"afterFinish":function(){
				that.$element.addClassName('in').writeAttribute('aria-hidden', false)
				that.$element.fire("bootstrap:shown");
			}}) : that.$element.addClassName('in').writeAttribute('aria-hidden', false).fire("bootstrap:shown");
			
			that.enforceFocus()
		})
	}
	
	, hide: function (e) {
	
		var that = this
		
		
		if (!this.isShown ) return
		
		this.isShown = false
		
		this.escape()
		
		if(Effect != undefined && Effect.Fade != undefined && this.$element.hasClassName('fade'))
		{
			this.hideWithTransition()
		}
		else{
			this.hideModal()
			this.$element.setStyle({display:''});
		}
	
	}
	
	, enforceFocus: function () {
		var that = this
		$(document).on('focus', function (e) {
			if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
				that.$element.focus()
			}
		})
	}
	
	, escape: function () {
		var that = this
		if (this.isShown && this.options.keyboard) {
			$(document).on('keyup', function ( e ) {
				e.which == Event.KEY_ESC && that.hide()
			})
		} else if (!this.isShown) {
			$(document).stopObserving('keyup')
		}
	}
	
	, hideWithTransition: function () {
		var that = this
		new Effect.Morph(that.$element,{duration:0.30,style:'top:-25%',afterFinish:function(){
			that.$element
			.removeClassName('in')
			.writeAttribute('aria-hidden', true)
			that.$element.setStyle({display:''});
			that.$element.setStyle({top:''})
			that.hideModal()
		}})
	}
	
	, hideModal: function (that) {
	
		this.$element.setStyle({display:'none'}).fire('bootstrap:hidden')
		this.backdrop()
	}
	
	, removeBackdrop: function () {
		this.$backdrop.remove()
		this.$backdrop = null
	}
	
	, backdrop: function (callback) {
		
		var that = this
		, animate = this.$element.hasClassName('fade') ? 'fade' : ''
		
		if (this.isShown && this.options.backdrop) {
			var doAnimate = Effect != undefined && Effect.Fade != undefined && animate
			
			this.$backdrop = new Element("div",{"class":"modal-backdrop "+animate}).setOpacity(0)
			
			this.$backdrop.observe("click",function(){
			this.options.backdrop == 'static' ? '' : this.hide()
			}.bind(this))
			
			$$("body")[0].insert(this.$backdrop)
			
			//          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
			
			this.$backdrop.addClassName('in')
			
			doAnimate ? new Effect.Appear(this.$backdrop,{from:0,to:0.80,duration:0.3,afterFinish:callback}) : callback()
		
		} else if (!this.isShown && this.$backdrop) {
		
			this.$backdrop.removeClassName('in')
			
			Effect != undefined && Effect.Fade != undefined && this.$element.hasClassName('fade')?
			Effect.Fade(this.$backdrop,{duration:0.3,afterFinish:this.removeBackdrop.bind(this)}) :
			this.removeBackdrop()
		
		} else if (callback) {
			callback()
		}
	}
}



/* MODAL DATA-API
* ============== */

document.observe("dom:loaded",function(){
	$$("[data-toggle='modal']").invoke("observe","click",function(e){
	
		var target = this.readAttribute("data-target") || (this.href && this.href.replace(/.*(?=#[^\s]+$)/,'').replace(/#/,''));
		var options = {};
		if($(target) != undefined)
		{
			target = $(target);
			if(!/#/.test(this.href))
			{
				options.remote = this.href;
			}
			new BootStrap.Modal($(target),options);
		}
		
		e.stop();
	});
})