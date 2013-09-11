module("bootstrap-typeahead")

test("should be defined on BootStrap Namespace", function () {
	ok(BootStrap.Typeahead, 'Typeahead class is defined')
})

test("should listen to an input", function () {
	var $input = new Element('input');
	var t = new BootStrap.Typeahead($input);

	ok(Event.cache[$input._prototypeUID].blur, 'has a blur event')
	ok(Event.cache[$input._prototypeUID].keypress, 'has a keypress event')
	ok(Event.cache[$input._prototypeUID].keyup, 'has a keyup event')
})

test("should create a menu", function () {
	var $input = new Element('input');
	var t = new BootStrap.Typeahead($input);
	ok(t.$menu, 'has a menu')
})

test("should listen to the menu", function () {
	var $input = $('<input />')
	var $input = new Element('input');
	var t = new BootStrap.Typeahead($input);
	var $menu = t.$menu;


	ok(Event.cache[$menu._prototypeUID].mouseover, 'has a mouseover(pseudo: mouseenter)')
	ok(Event.cache[$menu._prototypeUID].click, 'has a click')
})

test("should show menu when query entered", function () {
	var $input = new Element('input')
	$$('body').first().insert($input);
	var typeahead = new BootStrap.Typeahead($input,{
	source: ['aa', 'ab', 'ac']
	})

	$input.value = 'a'
	typeahead.lookup()

	ok(typeahead.$menu.visible(), 'typeahead is visible')
	equals(typeahead.$menu.select('li').length, 3, 'has 3 items in menu')
	equals(typeahead.$menu.select('.active').length, 1, 'one item is active')

	$input.remove()
	typeahead.$menu.remove()
})

test("should accept data source via synchronous function", function () {
	var $input = new Element('input')
	$$('body').first().insert($input)
	var typeahead = new BootStrap.Typeahead($input,{
	source: function () {
	return ['aa', 'ab', 'ac']
	}
	})

	$input.value = 'a'
	typeahead.lookup()

	ok(typeahead.$menu.visible(), 'typeahead is visible')
	equals(typeahead.$menu.select('li').length, 3, 'has 3 items in menu')
	equals(typeahead.$menu.select('.active').length, 1, 'one item is active')

	$input.remove()
	typeahead.$menu.remove()
})

test("should accept data source via asynchronous function", function () {
	var $input = new Element('input');
	$$('body').first().insert($input);
	var typeahead = new BootStrap.Typeahead($input,{
	source: function (query, process) {
	process(['aa', 'ab', 'ac'])
	}
	})

	$input.value = 'a'
	typeahead.lookup()

	ok(typeahead.$menu.visible(), 'typeahead is visible')
	equals(typeahead.$menu.select('li').length, 3, 'has 3 items in menu')
	equals(typeahead.$menu.select('.active').length, 1, 'one item is active')

	$input.remove()
	typeahead.$menu.remove()
})

test("should not explode when regex chars are entered", function () {
	var $input = new Element('input');
	$$('body').first().insert($input);
	var typeahead = new BootStrap.Typeahead($input,{
	source: ['aa', 'ab', 'ac', 'mdo*', 'fat+']
	})

	$input.value = '+'
	typeahead.lookup()

	ok(typeahead.$menu.visible(), 'typeahead is visible')
	equals(typeahead.$menu.select('li').length, 1, 'has 1 item in menu')
	equals(typeahead.$menu.select('.active').length, 1, 'one item is active')

	$input.remove()
	typeahead.$menu.remove()
})

test("should hide menu when query entered", function () {
	stop()
	var $input = new Element('input',{'id':'testme'});
	$$('body').first().insert($input);
	var typeahead = new BootStrap.Typeahead($input,{
	source: ['aa', 'ab', 'ac']
	})

	$input.value = 'a'
	typeahead.lookup()

	ok(typeahead.$menu.visible(), 'typeahead is visible')
	equals(typeahead.$menu.select('li').length, 3, 'has 3 items in menu')
	equals(typeahead.$menu.select('.active').length, 1, 'one item is active')

	$input.trigger('blur')

	setTimeout(function () {
		ok(!typeahead.$menu.visible(), "typeahead is no longer visible")
		start()
		$input.remove()
		typeahead.$menu.remove()
	}, 200)
})

test("should set next item when down arrow is pressed", function () {
	var $input = new Element('input');
	$$('body').first().insert($input);
	var typeahead = new BootStrap.Typeahead($input,{
	source: ['aa', 'ab', 'ac']
	})

	$input.value = 'a'
	typeahead.lookup()

	ok(typeahead.$menu.visible(), 'typeahead is visible')
	equals(typeahead.$menu.select('li').length, 3, 'has 3 items in menu')
	equals(typeahead.$menu.select('.active').length, 1, 'one item is active')
	ok(typeahead.$menu.select('li').first().hasClassName('active'), "first item is active")

	// simulate entire key pressing event
	typeahead.keydown({keyCode:40,preventDefault:Prototype.K,stopPropagation:Prototype.K})
	// $input.trigger('keydown',{keyCode: 40})
	// $input.trigger('keypress',{keyCode: 40	})
	// $input.trigger('keyup',{keyCode: 40})

	ok(typeahead.$menu.select('li').first().next().hasClassName('active'), "second item is active")

	typeahead.keydown({keyCode:38,preventDefault:Prototype.K,stopPropagation:Prototype.K})
	// $input.trigger('keydown',{keyCode: 38})
	// $input.trigger('keypress',{keyCode: 38})
	// $input.trigger('keyup', {keyCode: 38})

	ok(typeahead.$menu.select('li').first().hasClassName('active'), "first item is active")

	$input.remove()
	typeahead.$menu.remove()
})


test("should set input value to selected item", function () {
	var $input = new Element('input');
	$$('body').first().insert($input);
	var typeahead = new BootStrap.Typeahead($input,{
	source: ['aa', 'ab', 'ac']
	})
	var changed = false
	, focus = false
	, blur = false

	$input.observe('change',function(){
		changed = true;
	});
	$input.observe('focus',function(){
		focus = true; blur = false;
	});
	$input.observe('blur',function(){
		blur = true; focus = false
	})

	$input.value = 'a'
	typeahead.lookup()

	$input.simulate('change');
	$input.focus();
	$input.blur();

	typeahead.$menu.select('li')[2].simulate('mouseover')
	typeahead.$menu.select('li')[2].simulate('click')

	equals($input.value, 'ac', 'input value was correctly set')
	ok(!typeahead.$menu.visible(), 'the menu was hidden')
	ok(changed, 'a change event was fired')
	ok(focus && !blur, 'focus is still set')

	$input.remove()
	typeahead.$menu.remove()
})

test("should start querying when minLength is met", function () {
	var $input = new Element('input')
	$$('body').first().insert($input)
	var typeahead = new BootStrap.Typeahead($input,{
	source: ['aaaa', 'aaab', 'aaac'],
	minLength: 3
	})

	$input.value = 'aa'
	typeahead.lookup()

	equals(typeahead.$menu.select('li').length, 0, 'has 0 items in menu')

	$input.value = 'aaa'
	typeahead.lookup()

	equals(typeahead.$menu.select('li').length, 3, 'has 3 items in menu')

	$input.remove()
	typeahead.$menu.remove()
})