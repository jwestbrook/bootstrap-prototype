module("bootstrap-dropdowns")

	test("should be defined on BootStrap Namespace", function () {
		ok(BootStrap.Dropdown, 'dropdown class is defined')
	})

	test("should not open dropdown if target is disabled", function () {
		var drd = new Element('ul',{'class':'tabs'});
		var item = new Element('li',{'class':'dropdown'});
		item.insert(new Element('button',{'disabled':true,'href':'#','class':'btn dropdown-toggle','data-toggle':'dropdown'}).update('Dropdown'));
			var list = new Element('ul',{'class':'dropdown-menu'});
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Secondary link')))
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Something else here')))
			list.insert(new Element('li',{'class':'divider'}));
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Another link')))
		item.insert(list)
		drd.insert(item)
		drd.down('[data-toggle="dropdown"]').observe('click',BootStrap.Dropdown.prototype.toggle)
		drd.down('[data-toggle="dropdown"]').simulate('click')

		ok(!drd.down('.dropdown').hasClassName('open'), 'open class added on click')
	})

	test("should add class open to menu if clicked", function () {
		var drd = new Element('ul',{'class':'tabs'});
		var item = new Element('li',{'class':'dropdown'});
		item.insert(new Element('button',{'href':'#','class':'btn dropdown-toggle','data-toggle':'dropdown'}).update('Dropdown'));
			var list = new Element('ul',{'class':'dropdown-menu'});
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Secondary link')))
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Something else here')))
			list.insert(new Element('li',{'class':'divider'}));
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Another link')))
		item.insert(list)
		drd.insert(item)
		drd.down('[data-toggle="dropdown"]').observe('click',BootStrap.Dropdown.prototype.toggle)
		drd.down('[data-toggle="dropdown"]').simulate('click')

		ok(drd.down('.dropdown').hasClassName('open'), 'open class added on click')
	})

	test("should test if element has a # before assuming it's a selector", function () {
		var drd = new Element('ul',{'class':'tabs'});
		var item = new Element('li',{'class':'dropdown'});
		item.insert(new Element('button',{'href':'/foo/','class':'dropdown-toggle','data-toggle':'dropdown'}).update('Dropdown'));
			var list = new Element('ul',{'class':'dropdown-menu'});
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Secondary link')))
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Something else here')))
			list.insert(new Element('li',{'class':'divider'}));
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Another link')))
		item.insert(list)
		drd.insert(item)
		drd.down('[data-toggle="dropdown"]').observe('click',BootStrap.Dropdown.prototype.toggle)
		drd.down('[data-toggle="dropdown"]').simulate('click')

		ok(drd.down('.dropdown').hasClassName('open'), 'open class added on click')
	})


	test("should remove open class if body clicked", function () {
		var drd = new Element('ul',{'class':'tabs'});
		var item = new Element('li',{'class':'dropdown'});
		item.insert(new Element('button',{'href':'#','class':'dropdown-toggle','data-toggle':'dropdown'}).update('Dropdown'));
			var list = new Element('ul',{'class':'dropdown-menu'});
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Secondary link')))
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Something else here')))
			list.insert(new Element('li',{'class':'divider'}));
			list.insert(new Element('li').update(new Element('a',{'href':'#'}).update('Another link')))
		item.insert(list)
		drd.insert(item)

		$('qunit-fixture').update(drd)
		$('qunit-fixture').down('[data-toggle="dropdown"]').observe('click',BootStrap.Dropdown.prototype.toggle)
		$('qunit-fixture').down('[data-toggle="dropdown"]').simulate('click')

		ok($('qunit-fixture').down('.dropdown').hasClassName('open'), 'open class added on click')
		$$('body').first().simulate('click')
		ok(!$('qunit-fixture').down('.dropdown').hasClassName('open'), 'open class removed')
		$('qunit-fixture').update()
	})

	test("should remove open class if body clicked, with multiple drop downs", function () {

		var nav = new Element('ul',{'class':'nav'});
		nav.insert(new Element('li').update(new Element('a',{'href':'#menu1'}).update('Menu 1')))
		var item = new Element('li',{'class':'dropdown','id':'testmenu'})
		item.insert(new Element('a',{'class':'dropdown-toggle','data-toggle':'dropdown','href':'#testmenu'}).update('Test menu <b class="caret"></b>'))
			var list = new Element('ul',{'class':'dropdown-menu','role':'menu'});
			list.insert(new Element('li').update(new Element('a',{'href':'#sub1'}).update('Submenu 1')))
		item.insert(list);
		nav.insert(item)
		var div = new Element('div',{'class':'btn-group'})
		div.insert(new Element('button',{'class':'btn'}).update('Actions'))
		div.insert(new Element('button',{'class':'btn dropdown-toggle','data-toggle':'dropdown'}).update('<span class="caret"></span>'))
		div.insert('<ul class="dropdown-menu"><li><a href="#">Action 1</a></li></ul>')

		$('qunit-fixture').update(nav)
		$('qunit-fixture').insert(div)
		var dropdowns = $('qunit-fixture').select('[data-toggle="dropdown"]')
			, first = dropdowns.first()
			, last = dropdowns.last()
		document.fire('dom:loaded')

		ok(dropdowns.length == 2, "Should be two dropdowns")

		first.simulate('click')

		ok($$('#qunit-fixture .open').length == 1, 'open class added on click')
		ok($$('#qunit-fixture .open').length == 1, 'only one object is open')
		$$('body').first().simulate('click')
		ok($$("#qunit-fixture .open").length === 0, 'open class removed')

		last.simulate('click')
		ok($$('#qunit-fixture .open').length == 1, 'open class added on click')
		ok($$('#qunit-fixture .open').length == 1, 'only one object is open')
		$$('body').first().simulate('click')
		ok($$('#qunit-fixture .open').length === 0, 'open class removed')

	})
