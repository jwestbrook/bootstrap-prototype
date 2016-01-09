/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/

"use strict";

/* MODAL CLASS DEFINITION
* ====================== */
if(BootStrap === undefined)
{
	var BootStrap = {};
}

BootStrap.Modal = Class.create({
	initialize : function (element, options) {
		this.VERSION = '3.3.6'
		this.TRANSITION_DURATION = 300
		this.BACKDROP_TRANSITION_DURATION = 150
		
		element.store('bootstrap:modal',this)
		this.$element = $(element);
		this.options = options != undefined ? options : {}
		this.$body = $(document.body)
		this.$dialog = this.$element.down('.modal-dialog')
		this.options.backdrop = this.options.backdrop != undefined ? options.backdrop : true
		this.options.keyboard = this.options.keyboard != undefined ? options.keyboard : true
		this.options.show = this.options.show != undefined ? options.show : true
		this.ignoreBackdropClick = false

		if(this.options.show)
			this.show();
		document.on('click','[data-dismiss="modal"]',function(){
			this.hide()
		}.bind(this))

		if(this.options.remote && this.$element.select('.modal-body')) {
			var t = new Ajax.Updater(this.$element.select('.modal-body')[0],this.options.remote,{'Success':function(){
				this.$element.fire('bootstrap:loaded');
			}.bind(this)});
		}
	},
	toggle: function (_relatedTarget) {
		return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
	}
	, show: function (_relatedTarget) {
		var that = this
		var eventoptions = {'_relatedTarget': (_relatedTarget != undefined ? _relatedTarget : null ) }

		this.$element.setStyle({display:'block'})
		
		var showEvent = this.$element.fire('bootstrap:show',eventoptions)

		if (this.isShown || showEvent.defaultPrevented) return

		this.isShown = true

		this.checkScrollbar()
		this.setScrollbar()
		this.$body.addClassName('modal-open')

		this.escape()
		this.resize()
		
		this.$element.on('click','[data-dismiss="modal"]',this.hide.bind(this))
		
		this.$dialog.on('mousedown',function(){
			this.$element.on('mouseup',function(e){
				if(e.target == this.$element) this.ignoreBackdropClick = true
				this.$element.stopObserving('mouseup')
			}.bind(this))
		}.bind(this))

		this.backdrop(function () {
			var transition = (BootStrap.handleeffects == 'css' || (BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined')) && that.$element.hasClassName('fade')

			if (that.$element.up('body') == undefined) {
				$$("body")[0].insert(that.$element)
			}
			that.$element.setStyle({display:'block'})
			
			if(transition && BootStrap.handleeffects == 'css') {
				that.$element.observe(BootStrap.transitionendevent,function(){
					that.$element.fire("bootstrap:shown",eventoptions)
					that.$element.focus()
				});
				setTimeout(function(){
					that.$element.addClassName('in')
				},1);
			} else if(transition && BootStrap.handleeffects == 'effect') {
				new Effect.Parallel([
					new Effect.Morph(that.$element,{sync:true,style:'top:10%'}),
					new Effect.Opacity(that.$element,{sync:true,from:0,to:1})
				],{duration:0.3,afterFinish:function(){
					that.$element.addClassName('in')
					that.$element.fire("bootstrap:shown",eventoptions)
					that.$element.focus()
				}})
			} else {
				that.$element.addClassName('in').fire("bootstrap:shown",eventoptions)
				that.$element.focus()
			}

			that.enforceFocus()
		})
	}
	, hide: function (e) {

		var that = this

		var hideEvent = this.$element.fire('bootstrap:hide')

		if (!this.isShown || hideEvent.defaultPrevented) return

		this.isShown = false

		this.escape()
		this.resize()
		
		document.stopObserving('bootstrap:focusin')

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
	, resize: function () {
		if (this.isShown) {
			document.observe('bootstrap:resize.modal',this.handleUpdate.bind(this))
		} else {
			document.stopObserving('bootstrap:resize.modal')
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
				this.$element.removeClassName('in')
			}.bind(this))
		} else {
			new Effect.Morph(this.$element,{duration:0.30,style:'top:-25%;',afterFinish:function(effect){
				effect.element.removeClassName('in')
				effect.element.setStyle({display:''});
				effect.element.setStyle({top:''})
				that.hideModal()
			}})
		}
	}

	, hideModal: function () {
		this.$element.hide()
		this.backdrop(function(){
			this.$body.removeClassName('modal-open')
			this.resetAdjustments()
			this.resetScrollbar()
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
		var animate = this.$element.hasClassName('fade') ? 'fade' : ''
		var callbackRemove = function () {
			that.removeBackdrop()
			callback && callback()
		}

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

			this.$element.observe('click',function(e){
				if(this.ignoreBackdropClick) {
					this.ignoreBackdropClick = false
					return
				}
				if(e.target !== e.currentTarget) return
				this.options.backdrop == 'static' ? this.$element.focus() : this.hide()
			}.bind(this))

			this.$body.insert(this.$backdrop)

			if(doAnimate && BootStrap.handleeffects == 'effect') {
				new Effect.Appear(this.$backdrop,{from:0,to:0.80,duration:0.3,afterFinish:callback})
			} else{
				callback();
			}
			setTimeout(function(){
				$$('.modal-backdrop').invoke('addClassName','in')
			},1);


		} else if (!this.isShown && this.$backdrop) {
			if(animate && BootStrap.handleeffects == 'css'){
				that.$backdrop.observe(BootStrap.transitionendevent,function(){
					callbackRemove()
				});
				setTimeout(function(){
					that.$backdrop.removeClassName('in')
				},1);
			} else if(animate && BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined') {
				new Effect.Fade(that.$backdrop,{duration:0.3,from:that.$backdrop.getOpacity()*1,afterFinish:function(){
					that.$backdrop.removeClassName('in')
					callbackRemove()
				}})
			} else {
				that.$backdrop.removeClassName('in')
				callbackRemove()
			}

		} else if (callback) {
			callback()
		}
	}
	
	// these following methods are used to handle overflowing modals	
	, handleUpdate: function () {
		this.adjustDialog()
	}
	, adjustDialog: function () {
		var modalIsOverflowing = this.$element.scrollHeight > document.documentElement.clientHeight
		
		this.$element.setStyle({
			'paddingLeft':  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
			'paddingRight': this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
		})
	}
	, resetAdjustments: function () {
		this.$element.setStyle({
			'paddingLeft': '',
			'paddingRight': ''
		})
	}
	, checkScrollbar : function () {
		var fullWindowWidth = window.innerWidth
		if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
			var documentElementRect = document.documentElement.getBoundingClientRect()
			fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
		}
		this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
		this.scrollbarWidth = this.measureScrollbar()
	}
	, setScrollbar : function () {
		var bodyPad = parseInt((this.$body.getStyle('padding-right') || 0), 10)
		this.originalBodyPad = document.body.style.paddingRight || ''
		if (this.bodyIsOverflowing) this.$body.setStyle({'padding-right' : bodyPad + this.scrollbarWidth})
	}
	, resetScrollbar : function () {
		this.$body.setStyle({'padding-right' : this.originalBodyPad})
	}
	, measureScrollbar : function () { // thx walsh
		var scrollDiv = new Element('div',{'class':'modal-scrollbar-measure'})
		this.$body.insert(scrollDiv)
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
		scrollDiv.remove();
		return scrollbarWidth
	}


});



/* MODAL DATA-API
* ============== */

document.observe("dom:loaded",function(){
	document.on('click','[data-toggle="modal"]',function(e,targetElement){
		var target = targetElement.readAttribute("data-target") || (targetElement.href && targetElement.href.replace(/.*(?=#[^\s]+$)/,''));
		var options = {};
		if($$(target).length > 0) {
			target = $$(target).first();
			if(!/#/.test(targetElement.href)) {
				options.remote = targetElement.href;
			}
			new BootStrap.Modal($(target),options);
		}
		if(targetElement.match('a')) e.stop()
	});
})