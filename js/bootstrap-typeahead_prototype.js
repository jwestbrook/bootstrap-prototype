/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
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


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

BootStrap.Typeahead = Class.create({

	initialize: function(element, options) {
		this.$element = $(element)
		this.$element.store('bootstrap:typeahead',this)

		this.options = {
			source: []
			, items: 8
			, menu: new Element('ul',{'class':'typeahead dropdown-menu'})
			, item: new Element('li').update(new Element('a',{'href':'#'}))
			, minLength: 1
		}

		this.options.items = (this.$element.readAttribute('data-items') ? this.$element.readAttribute('data-items') : this.options.items)
		this.options.source = (this.$element.readAttribute('data-source') ? this.$element.readAttribute('data-source').evalJSON(true) : this.options.source)
		
		
		Object.extend(this.options, options)
		this.matcher = this.options.matcher || this.matcher
		this.sorter = this.options.sorter || this.sorter
		this.highlighter = this.options.highlighter || this.highlighter
		this.updater = this.options.updater || this.updater
		this.source = this.options.source
		this.$menu = this.options.menu
		this.shown = false
		this.listen()
	}
	, select: function () {
		var val = this.$menu.down('.active').readAttribute('data-value')
		this.$element.setValue(this.updater(val))
		
		this.$element.fire('bootstrap:change')
		
		return this.hide()
	}
	, updater: function (item) {
		return item
	}
	, show: function () {
		var pos = Object.extend({}, this.$element.cumulativeOffset())
		Object.extend(pos, {
			height: this.$element.offsetHeight
		})
		
		this.$menu.setStyle({
				'top': (pos.top + pos.height)+'px'
				, 'left': (pos.left)+'px'
				, 'display' : 'block'
			})
		this.$element.insert({'after':this.$menu})
		
		this.shown = true
		return this
	}
	, hide: function () {
		this.$menu.hide()
		this.shown = false
		return this
	}
	, lookup: function (event) {
		var items
		
		this.query = this.$element.getValue()
		
		if (!this.query || this.query.length < this.options.minLength) {
			return this.shown ? this.hide() : this
		}
		
		items = Object.isFunction(this.source) ? this.source(this.query, this.process.bind(this)) : this.source
		
		return items ? this.process(items) : this
	}
	, process: function (items) {
		
		items = items.findAll(this.matcher,this)
		
		items = this.sorter(items)
		
		if (!items.length) {
			return this.shown ? this.hide() : this
		}
		
		return this.render(items.slice(0, this.options.items)).show()
	}
	, matcher: function (item) {
		return ~item.toLowerCase().indexOf(this.query.toLowerCase())
	}

	, sorter: function (items) {
		var beginswith = []
		, caseSensitive = []
		, caseInsensitive = []
		, item
		
		while (item = items.shift()) {
			if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			else if (~item.indexOf(this.query)) caseSensitive.push(item)
			else caseInsensitive.push(item)
		}
		
		return beginswith.concat(caseSensitive, caseInsensitive)
	}
	, highlighter: function (item) {
		var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
		return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
			return '<strong>' + match + '</strong>'
		})
	}
	, render: function (items) {
		
		items = items.map(function(item){
			var i = this.options.item.clone(true).writeAttribute('data-value',item)
			i.down('a').update(this.highlighter(item))
			return i
		},this)
		
		items.first().addClassName('active')
		this.$menu.update()
		items.each(function(i){
			this.$menu.insert(i)
		},this)
		return this
	}
	, next: function (event) {
		var active = this.$menu.down('.active').removeClassName('active')
		, next = active.next()
		
		if (next === undefined) {
			next = this.$menu.down('li')
		}
		
		next.addClassName('active')
	}
	, prev: function (event) {
		var active = this.$menu.down('.active').removeClassName('active')
		, prev = active.previous()
		
		if (prev === undefined) {
			prev = this.$menu.select('li').last()
		}
		
		prev.addClassName('active')
	}
	, listen: function () {
		this.$element
			.observe('focus',     this.focus.bind(this))
			.observe('blur',      this.blur.bind(this))
			.observe('keypress',  this.keypress.bind(this))
			.observe('keyup',     this.keyup.bind(this))
		
		if (this.eventSupported('keydown')) {
			this.$element.observe('keydown',this.keydown.bind(this))
		}
		
		this.$menu.observe('click', this.click.bind(this))
		this.$menu.on('mouseover', 'li', this.mouseenter.bind(this))
		this.$menu.on('mouseout', 'li', this.mouseleave.bind(this))
	}
	, eventSupported: function(eventName) {
		var isSupported = ('on'+eventName) in this.$element
		if (!isSupported) {
			this.$element.writeAttribute(eventName, 'return;')
			isSupported = typeof this.$element[eventName] === 'function'
		}
		return isSupported
	}
	, move: function (e) {
		if (!this.shown) return
		
		switch(e.keyCode) {
			case Event.KEY_TAB: 
			case Event.KEY_RETURN: 
			case Event.KEY_ESC: 
				e.preventDefault()
				break
			
			case Event.KEY_UP: 
				e.preventDefault()
				this.prev()
				break
			
			case Event.KEY_DOWN: 
				e.preventDefault()
				this.next()
				break
		}
		
		e.stopPropagation()
	}
	, keydown: function (e) {
		this.suppressKeyPressRepeat = ~[40,38,9,13,27].indexOf(e.keyCode)
		this.move(e)
	}
	, keypress: function (e) {
		if (this.suppressKeyPressRepeat) return
		this.move(e)
	}
	, keyup: function (e) {
		switch(e.keyCode) {
			case Event.KEY_DOWN:
			case Event.KEY_UP:
			case 16: // shift
			case 17: // ctrl
			case 18: // alt
				break
			
			case Event.KEY_TAB:
			case Event.KEY_RETURN:
				if (!this.shown) return
				this.select()
				break
			
			case Event.KEY_ESC:
				if (!this.shown) return
				this.hide()
				break
			
			default:
				this.lookup()
		}
		
		e.stopPropagation()
		e.preventDefault()
	}
	, focus: function (e) {
		this.focused = true
	}
	, blur: function (e) {
		this.focused = false
		if (!this.mousedover && this.shown) this.hide()
	}
	, click: function (e) {
		e.stopPropagation()
		e.preventDefault()
		this.select()
		this.$element.focus()
	}
	, mouseenter: function (e) {
		this.mousedover = true
		this.$menu.select('.active').invoke('removeClassName','active')
		e.findElement('li').addClassName('active')
		e.stopPropagation()
	}
	, mouseleave: function (e) {
		this.mousedover = false
		if (!this.focused && this.shown) this.hide()
		e.stopPropagation()
	}
});



 /* TYPEAHEAD DATA-API
  * ================== */

document.observe('dom:loaded',function(){
	$$('[data-provide="typeahead"]').each(function(i){
		new BootStrap.Typeahead(i)
	});
})