/* =========================================================
* bootstrap-modal.js v2.3.1
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
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/



/* MODAL CLASS DEFINITION
* ====================== */
if(BootStrap === undefined)
{
	var BootStrap = {};
}

BootStrap.Modal = Class.create({
	initialize : function (element, options) {
		element.store('bootstrap:modal',this)
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

		if(this.options.remote && this.$element.select('.modal-body')) {
			var t = new Ajax.Updater(this.$element.select('.modal-body')[0],this.options.remote);
		}
	},
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
			var transition = (BootStrap.handleeffects == 'css' || (BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined')) && that.$element.hasClassName('fade')

			if (!that.$element.up().length) {
				$$("body")[0].insert(that.$element);
			}
			that.$element.setStyle({display:'block'})

			if(transition && BootStrap.handleeffects == 'css') {
				that.$element.observe(BootStrap.transitionendevent,function(){
					that.$element.fire("bootstrap:shown");
				});
				setTimeout(function(){
					that.$element.addClassName('in').writeAttribute('aria-hidden',false);
				},1);
			} else if(transition && BootStrap.handleeffects == 'effect') {
				new Effect.Parallel([
					new Effect.Morph(that.$element,{sync:true,style:'top:10%'}),
					new Effect.Opacity(that.$element,{sync:true,from:0,to:1})
				],{duration:0.3,afterFinish:function(){
					that.$element.addClassName('in').writeAttribute('aria-hidden', false)
					that.$element.fire("bootstrap:shown");
				}})
			} else {
				that.$element.addClassName('in').writeAttribute('aria-hidden', false).fire("bootstrap:shown");
			}

			that.enforceFocus()
		})
	}
	, hide: function (e) {

		var that = this

		if (!this.isShown ) return

		this.isShown = false

		this.escape()

		if(BootStrap.handleeffects == 'css' && this.$element.hasClassName('fade')) {
			this.hideWithTransition()
		} else if(BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined' && this.$element.hasClassName('fade')) {
			this.hideWithTransition()
		} else {
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
			$(document).on('keyup', function (e) {
				e.which == Event.KEY_ESC && that.hide()
			})
		} else if (!this.isShown) {
			$(document).stopObserving('keyup')
		}
	}

	, hideWithTransition: function () {
		var that = this

		if(BootStrap.handleeffects == 'css') {
			this.$element.observe(BootStrap.transitionendevent,function(){
				this.setStyle({display:''});
				this.setStyle({top:''})
				that.hideModal()
				this.stopObserving(BootStrap.transitionendevent)
			})
			setTimeout(function(){
				this.$element.removeClassName('in').writeAttribute('aria-hidden',true)
			}.bind(this))
		} else {
			new Effect.Morph(this.$element,{duration:0.30,style:'top:-25%;',afterFinish:function(effect){
				effect.element.removeClassName('in').writeAttribute('aria-hidden', true)
				effect.element.setStyle({display:''});
				effect.element.setStyle({top:''})
				that.hideModal()
			}})
		}
	}

	, hideModal: function () {
		this.$element.hide()
		this.backdrop(function(){
			this.removeBackdrop()
			this.$element.fire('bootstrap:hidden')
		}.bind(this))

	}
	, removeBackdrop: function () {
		this.$backdrop && this.$backdrop.remove()
		this.$backdrop = null
	}

	, backdrop: function (callback) {

		var that = this
		, animate = this.$element.hasClassName('fade') ? 'fade' : ''

		if (this.isShown && this.options.backdrop) {
			var doAnimate = (BootStrap.handleeffects == 'css' || (BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined')) && animate

			this.$backdrop = new Element("div",{"class":"modal-backdrop "+animate})
			if(doAnimate && BootStrap.handleeffects == 'css') {
				this.$backdrop.observe(BootStrap.transitionendevent,function(){
					callback()
					this.stopObserving(BootStrap.transitionendevent)
				})
			} else if(doAnimate && BootStrap.handleeffects == 'effect') {
				this.$backdrop.setOpacity(0)
			}

			this.$backdrop.observe("click",function(){
				that.options.backdrop == 'static' ? '' : that.hide()
			})

			$$("body")[0].insert(this.$backdrop)

			if(doAnimate && BootStrap.handleeffects == 'effect') {
				new Effect.Appear(this.$backdrop,{from:0,to:0.80,duration:0.3,afterFinish:callback})
			} else {
				callback();
			}
			setTimeout(function(){
				that.$backdrop.addClassName('in');
			},1);


		} else if (!this.isShown && this.$backdrop) {
			if(animate && BootStrap.handleeffects == 'css'){
				that.$backdrop.observe(BootStrap.transitionendevent,function(){
					callback()
				});
				setTimeout(function(){
					that.$backdrop.removeClassName('in')
				},1);
			} else if(animate && BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined') {
				new Effect.Fade(that.$backdrop,{duration:0.3,from:that.$backdrop.getOpacity()*1,afterFinish:function(){
					that.$backdrop.removeClassName('in')
					callback()
				}})
			} else {
				that.$backdrop.removeClassName('in')
				callback()
			}

		} else if (callback) {
			callback()
		}
	}
});



/* MODAL DATA-API
* ============== */

document.observe("dom:loaded",function(){
	$$("[data-toggle='modal']").invoke("observe","click",function(e){
		var target = this.readAttribute("data-target") || (this.href && this.href.replace(/.*(?=#[^\s]+$)/,'').replace(/#/,''));
		var options = {};
		if($(target) != undefined) {
			target = $(target);
			if(!/#/.test(this.href)) {
				options.remote = this.href;
			}
			new BootStrap.Modal($(target),options);
		}
		e.stop();
	});
})