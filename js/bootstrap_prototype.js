/* ===========================================================
 * bootstrap-tooltip.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
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


var BootStrap = {
	transitionendevent : null,
	handleeffects : null
	};

//Test CSS transitions first - less JS to implement
var transEndEventNames = $H({
	'WebkitTransition' : 'webkitTransitionEnd',
	'MozTransition'    : 'transitionend',
	'OTransition'      : 'oTransitionEnd otransitionend',
	'transition'       : 'transitionend'
});

var el = new Element("bootstrap");
transEndEventNames.each(function(pair){
	if(el.style[pair.key] !== undefined)
	{
		BootStrap.transitionendevent = pair.value;
		BootStrap.handleeffects = 'css';
	}
});

//then go to scriptaculous

if(BootStrap.handleeffects === null && typeof Scriptaculous !== 'undefined' && typeof Effect !== 'undefined')
{
	BootStrap.handleeffects = 'effect';
}

//Define all Classes

BootStrap.Alert = Class.create({
	initialize : function (element) {
		$(element).observe('click',this.close)
	},
	close : function (e) {
		var $this = $(this)
		  , selector = $this.readAttribute('data-target')
		  , $parent
		  
	
		if (!selector) {
		  selector = $this.href
		  selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '').replace('#','') //strip for ie7
		}
		
		(selector != undefined && selector.length > 0) ? $parent = $(selector) : '';
	
		($parent != undefined && $parent.length) || ($parent = $this.hasClassName('alert') ? $this : $this.up())
	
		$parent.fire('bootstrap:close')
	
		function removeElement() {
		  $parent.fire('bootstrap:closed')
		  $parent.remove()
		}
	
		if(BootStrap.handleeffects === 'css' && $parent.hasClassName('fade'))
		{
			$parent.observe(BootStrap.transitionendevent,function(){
				removeElement();
			});
			$parent.removeClassName('in')
		}
		else if(BootStrap.handleeffects === 'effect' && $parent.hasClassName('fade'))
		{
			new Effect.Fade($parent,{duration:0.3,from:$parent.getOpacity()*1,afterFinish:function(){
				$parent.removeClassName('in')
				removeElement()
			}})
		}
	}
});
BootStrap.Button = Class.create({
	initialize : function (element, options) {
		this.$element = $(element)
		if(typeof options == 'object')
		{
			this.options = options
			this.options.loadingText = typeof this.options.loadingText != 'undefined' ? options.loadingText : ''
		}
		else if(typeof options != 'undefined' && options == 'toggle')
		{
			this.toggle()
		}
		else if (typeof options != 'undefined'){
			this.setState(options)
		}
	
	},
	setState : function (state) {
		var d = 'disabled'
		, $el = this.$element
		, data = $el.gethtml5data()
		, val = $el.readAttribute('type') == 'input' ? 'value' : 'innerHTML'
		
		state = state + 'Text'
		data.resetText || $el.sethtml5data('resetText',$el[val])
		
		$el[val] = (data[state] || this.options[state])
		
		// push to event loop to allow forms to submit
		setTimeout(function () {
			state == 'loadingText' ?
			$el.addClassName(d).writeAttribute(d,true) :
			$el.removeClassName(d).writeAttribute(d,false)
		}, 0)
	},
	toggle : function () {
		var $parent = this.$element.up('[data-toggle="buttons-radio"]')
		
		$parent && $parent
		.select('.active')
		.invoke('removeClassName','active')
		
		this.$element.toggleClassName('active')
	}
});
var toggle = '[data-toggle=dropdown]';
BootStrap.Dropdown = Class.create({
	initialize : function (element) {
		var $el = $(element).on('click',this.toggle)
		$$('html')[0].on('click', function () {
		$el.up().removeClassName('open')
		})
	}
	,toggle: function (e) {
		var $this = $(this)
		, $parent
		, isActive
		
		if ($this.hasClassName('disabled') || $this.readAttribute('disabled') == 'disabled') return
		
		$parent = getParent($this)
		
		isActive = $parent.hasClassName('open')
		
		clearMenus()
		
		if (!isActive) {
			$parent.toggleClassName('open')
			$this.focus()
		}
		
		e.stop()
	}
	, keydown: function (e) {
		var $this
		, $items
		, $active
		, $parent
		, isActive
		, index
		
		if (!/(38|40|27)/.test(e.keyCode)) return
		
		$this = $(this)
		
		e.preventDefault()
		e.stopPropagation()
		
		if ($this.hasClassName('disabled') || $this.readAttribute('disabled') == 'disabled') return
		
		$parent = getParent($this)
		
		isActive = $parent.hasClassName('open')
		
		if (!isActive || (isActive && e.keyCode == Event.KEY_ESC)) return $this.click()
		
		$items = $parent.select('[role=menu] li:not(.divider) a')
		
		if (!$items.length) return
		
		index = -1
		$items.each(function(item,i){
			item.match(':focus') ? index = i : ''
		})
		
		if (e.keyCode == Event.KEY_UP && index > 0) index--                                        // up
		if (e.keyCode == Event.KEY_DOWN && index < $items.length - 1) index++                        // down
		if (!~index) index = 0
		
		$items[index].focus()
	}
	
});
function clearMenus() {
	$$(toggle).each(function(i) {
	getParent(i).removeClassName('open')
	})
}

function getParent($this) {
	var selector = $this.readAttribute('data-target')
	, $parent
	
	if (!selector) {
		selector = $this.readAttribute('href')
		selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') && selector != '#' //strip for ie7
	}
	
	$parent = $$(selector)
	$parent.length || ($parent = $this.up())
	
	return $parent
}
BootStrap.Modal = Class.create({
	initialize : function (element, options) {
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
			
			if(transition && BootStrap.handleeffects == 'css')
			{
				that.$element.observe(BootStrap.transitionendevent,function(){
					that.$element.fire("bootstrap:shown");
				});
				setTimeout(function(){
					that.$element.addClassName('in').writeAttribute('aria-hidden',false);
				},1);
			}
			else if(transition && BootStrap.handleeffects == 'effect')
			{
				new Effect.Parallel([
					new Effect.Morph(that.$element,{sync:true,style:'top:50%'}),
					new Effect.Opacity(that.$element,{sync:true,from:0,to:1})
					],{duration:0.3,afterFinish:function(){
						that.$element.addClassName('in').writeAttribute('aria-hidden', false)
						that.$element.fire("bootstrap:shown");
					}})
			}
			else
			{
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
		
		if(BootStrap.handleeffects == 'css' && this.$element.hasClassName('fade'))
		{
			this.hideWithTransition()
		}
		else if(BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined' && this.$element.hasClassName('fade'))
		{
			this.hideWithTransition()
		}
		else
		{
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
		
		if(BootStrap.handleeffects == 'css')
		{
			this.$element.observe(BootStrap.transitionendevent,function(){
				this.setStyle({display:''});
				this.setStyle({top:''})
				that.hideModal()
				this.stopObserving(BootStrap.transitionendevent)
			})
			setTimeout(function(){
				this.$element.removeClassName('in').writeAttribute('aria-hidden',true)
			}.bind(this))
		}
		else
		{
			new Effect.Morph(this.$element,{duration:0.30,style:'top:-25%;',afterFinish:function(effect){
				effect.element.removeClassName('in').writeAttribute('aria-hidden', true)
				effect.element.setStyle({display:''});
				effect.element.setStyle({top:''})
				that.hideModal()
			}})
		}
	}
	
	, hideModal: function () {
		this.$element.fire('bootstrap:hidden')
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
			var doAnimate = (BootStrap.handleeffects == 'css' || (BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined')) && animate
			
			this.$backdrop = new Element("div",{"class":"modal-backdrop "+animate})
			if(doAnimate && BootStrap.handleeffects == 'css')
			{
				this.$backdrop.observe(BootStrap.transitionendevent,function(){
					callback()
					this.stopObserving(BootStrap.transitionendevent)
				})
			}
			else if(doAnimate && BootStrap.handleeffects == 'effect')
			{
				this.$backdrop.setOpacity(0)
			}
			
			this.$backdrop.observe("click",function(){
			that.options.backdrop == 'static' ? '' : that.hide()
			})
			
			$$("body")[0].insert(this.$backdrop)
			
			if(doAnimate && BootStrap.handleeffects == 'effect')
			{
				new Effect.Appear(this.$backdrop,{from:0,to:0.80,duration:0.3,afterFinish:callback})
			}
			else
			{
				callback();
			}
			setTimeout(function(){
				that.$backdrop.addClassName('in');
			},1);

		
		} else if (!this.isShown && this.$backdrop) {
			
			if(animate && BootStrap.handleeffects == 'css')
			{
				that.$backdrop.observe(BootStrap.transitionendevent,function(){
					that.removeBackdrop()
				});
				setTimeout(function(){
					that.$backdrop.removeClassName('in')
				},1);
			}
			else if(animate && BootStrap.handleeffects == 'effect' && typeof Effect !== 'undefined' && typeof Effect.Fade !== 'undefined')
			{
				new Effect.Fade(that.$backdrop,{duration:0.3,from:that.$backdrop.getOpacity()*1,afterFinish:function(){
					that.$backdrop.removeClassName('in')
					that.removeBackdrop()
				}})
			}
			else
			{
				that.$backdrop.removeClassName('in')
				that.removeBackdrop()
			}
		
		} else if (callback) {
			callback()
		}
	}
});
BootStrap.Tooltip = Class.create({

	initialize : function (element, options) {
	
		this.options = {
			animation: true
			, placement: 'top'
			, selector: false
			, template: new Element('div',{'class':'tooltip'}).insert(new Element('div',{'class':'tooltip-arrow'})).insert(new Element('div',{'class':'tooltip-inner'}))
			, trigger: 'hover'
			, title: ''
			, delay: 0
			, html: false
		};
		Object.extend(this.options,options);
		if (this.options.delay && typeof this.options.delay == 'number') {
			this.options.delay = {
				show: options.delay
				, hide: options.delay
			}
		}
		this.init('tooltip', element)
	}
	, init: function (type, element) {
		var eventIn
		, eventOut
		
		this.type = type
		this.$element = $(element)
		this.enabled = true
		
		if (this.options.trigger == 'click') {
			this.$element.observe('click', this.toggle.bind(this))
		} else if (this.options.trigger != 'manual') {
			eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
			eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
			this.$element.observe(eventIn, this.enter.bind(this))
			this.$element.observe(eventOut, this.leave.bind(this))
		}
		
		if(this.options.selector){
			this._options = Object.extend({},this.options)
			Object.extend(this._options,{ trigger: 'manual', selector: '' })
		}
		else
		{
			this.fixTitle()
		}
	}
	, enter: function (e) {
		var self = this
		
		if (!self.options.delay || !self.options.delay.show) return self.show()
		
		clearTimeout(this.timeout)
		self.hoverState = 'in'
		this.timeout = setTimeout(function() {
			if (self.hoverState == 'in') self.show()
		}, self.options.delay.show)
	}
	
	, leave: function (e) {
		var self = this
		
		if (this.timeout) clearTimeout(this.timeout)
		if (!self.options.delay || !self.options.delay.hide) return self.hide()
		
		self.hoverState = 'out'
		this.timeout = setTimeout(function() {
			if (self.hoverState == 'out') self.hide()
		}, self.options.delay.hide)
	}
	
	, show: function () {
		var $tip
		, inside
		, pos
		, actualWidth
		, actualHeight
		, placement
		, tp
		, layout
		
		if (this.hasContent() && this.enabled) {
			$tip = this.tip()
			this.setContent()
			
			if (this.options.animation) {
				$tip.addClassName('fade')
			}
			
			placement = typeof this.options.placement == 'function' ?
			this.options.placement.call(this, $tip[0], this.$element[0]) :
			this.options.placement
			
			inside = /in/.test(placement)
			
			$tip.setStyle({ top: 0, left: 0, display: 'block' })

			this.$element.insert({'after':$tip})
			
			pos = this.getPosition(inside)
			
			actualWidth = $tip.offsetWidth
			actualHeight = $tip.offsetHeight
			
			switch (inside ? placement.split(' ')[1] : placement) {
				case 'bottom':
					tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
				break
				case 'top':
					tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
				break
				case 'left':
					tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
				break
				case 'right':
					tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
				break
			}
			tp.top = tp.top+'px'
			tp.left = tp.left+'px'
			
			$tip
			.setStyle(tp)
			.addClassName(placement)
			.addClassName('in')
			
		}
	}
	
	, setContent: function () {
		var $tip = this.tip()
		, title = this.getTitle()
		if(!this.options.html){
			title = title.escapeHTML()
		}
		
		$tip.select('.tooltip-inner')[0].update(title)
		$tip.removeClassName('fade in top bottom left right')
	}
	
	, hide: function () {
		var that = this
		, $tip = this.tip()
		
		if(BootStrap.handleeffects == 'css' && this.$tip.hasClassName('fade')){
			var timeout = setTimeout(function () {
				$tip.stopObserving(BootStrap.transitionendevent)
				$tip ? $tip.remove() : ''
			}, 500)
			
			$tip.observe(BootStrap.transitionendevent, function () {
				clearTimeout(timeout)
				$tip ? $tip.remove() : ''
				this.stopObserving(BootStrap.transitionendevent)
			})
			$tip.removeClassName('in')
		}else if(BootStrap.handleeffects == 'effect' && this.$tip.hasClassName('fade')){
			new Effect.Fade($tip,{duration:0.3,from:$tip.getOpacity()*1,afterFinish:function(){
				$tip.removeClassName('in')
				$tip.remove()
			}})
		} else {
			$tip.removeClassName('in')
			$tip.remove()
		}
		
		return this
	}
	
	, fixTitle: function () {
		var $e = this.$element
		if ($e.readAttribute('title') || typeof($e.readAttribute('data-original-title')) != 'string') {
			$e.writeAttribute('data-original-title', $e.readAttribute('title') || '').writeAttribute('title',null)
		}
	}
	
	, hasContent: function () {
		return this.getTitle()
	}
	
	, getPosition: function (inside) {
		var obj = {}
		if(inside){
			Object.extend(obj,{top:0,left:0})
		}else{
			Object.extend(obj,this.$element.cumulativeOffset())
		}
		return Object.extend(obj,{
			width: this.$element.offsetWidth
			, height: this.$element.offsetHeight
		})
	}
	
	, getTitle: function () {
		var title
		, $e = this.$element
		, o = this.options
		
		title = $e.readAttribute('data-original-title')
		|| (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)
		
		return title
	}
	
	, tip: function () {
		return this.$tip = this.$tip || this.options.template
	}
	
	, validate: function () {
		if (!this.$element[0].parentNode) {
			this.hide()
			this.$element = null
			this.options = null
		}
	}
	, enable: function () {
		this.enabled = true
	}
	, disable: function () {
		this.enabled = false
	}
	, toggleEnabled: function () {
		this.enabled = !this.enabled
	}
	, toggle: function (e) {
		var self = $(e.currentTarget)[this.type](this._options).data(this.type)
		self[self.tip().hasClassName('in') ? 'hide' : 'show']()
	}
	, destroy: function () {
		this.hide().$element.stopObserving()
	}

});
BootStrap.Tab = Class.create({
	initialize : function (element) {
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
//run all dom:loaded at end

document.observe("dom:loaded",function(){

	//BootStrap.Alert
	$$('.alert [data-dismiss="alert"]').each(function(i){
		new BootStrap.Alert(i)
	})

	//BootStrap.Button
	$$("[data-toggle^=button]").invoke("observe","click",function(e){
		var $btn = e.findElement()
		if(!$btn.hasClassName('btn')) $btn = $btn.up('.btn')
		new BootStrap.Button($btn,'toggle')
	});

	//Bootstrap.Dropdown
	document.observe('click',clearMenus)
	document.observe('touchstart',clearMenus)
	$$('.dropdown form').invoke('observe','click',function(e){
		e.stop();
	});
	$$('.dropdown form').invoke('observe','touchstart',function(e){
		e.stop();
	});
	$$(toggle).invoke('observe','click',BootStrap.Dropdown.prototype.toggle)
	$$(toggle).invoke('observe','touchstart',BootStrap.Dropdown.prototype.toggle)
	$$(toggle+', [role=menu]').invoke('observe','keydown',BootStrap.Dropdown.prototype.keydown)
	
	//Bootstrap.Modal
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
	
	//Bootstrap.Tooltip
	$$('.tooltip').each(function(el){
		new BootStrap.Tooltip(el);
	});
	
	//Bootstrap.Tab
	$$('[data-toggle="tab"], [data-toggle="pill"]').invoke('observe','click',function(e){
		e.preventDefault();
		new BootStrap.Tab(this).show()
	});
	
	
});