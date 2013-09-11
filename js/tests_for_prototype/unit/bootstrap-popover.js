module("bootstrap-popover")

	test("should be defined in BootStrap Namespace", function () {
		ok(BootStrap.Popover, 'popover class is defined')
	})

	test("should render popover element", function () {
		BootStrap.handleeffects = false;
		var popover = new Element('a',{'href':'#','title':'mdo','data-content':'http://twitter.com/mdo'}).update('@mdo')
		$('qunit-fixture').insert(popover)
		var popovert = new BootStrap.Popover(popover);
		popovert.show();

		ok($$('.popover').length, 'popover was inserted')
		popovert.hide()
		ok(!$$(".popover").length, 'popover removed')
	})

	test("should store popover instance in popover data object", function () {
		BootStrap.handleeffects = false;
		var popover = new Element('a',{'href':'#','title':'mdo','data-content':'http://twitter.com/mdo'}).update('@mdo')
		var popovert = new BootStrap.Popover(popover);

		ok(!!popover.retrieve('bootstrap:popover'), 'popover instance exists')
	})

	test("should get title and content from options", function () {
		BootStrap.handleeffects = false;
		var popover = new Element('a',{'href':'#'}).update('@fat');
		$('qunit-fixture').insert(popover);
		var popovert = new BootStrap.Popover(popover,{
				title: function () {
					return '@fat'
				}
			, content: function () {
					return 'loves writing tests （╯°□°）╯︵ ┻━┻'
				}
			})
		popovert.show()

		ok($$('.popover').length, 'popover was inserted')
		equals($$('.popover .popover-title').first().innerHTML, '@fat', 'title correctly inserted')
		equals($$('.popover .popover-content').first().innerHTML, 'loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted')

		popovert.hide()
		ok(!$$('.popover').length, 'popover was removed')
		$('qunit-fixture').update()
	})

	test("should get title and content from attributes", function () {
		BootStrap.handleeffects = false;
		var popover = new Element('a',{'href':'#','title':'@mdo','data-content':'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻'}).update('@mdo')
		$('qunit-fixture').update(popover)
		var popovert = new BootStrap.Popover(popover);
		popovert.show();

		ok($$('.popover').length, 'popover was inserted')
		equals($$('.popover .popover-title').first().innerHTML, '@mdo', 'title correctly inserted')
		equals($$('.popover .popover-content').first().innerHTML, "loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻", 'content correctly inserted')

		popovert.hide()
		ok(!$$('.popover').length, 'popover was removed')
		$('qunit-fixture').update();
	})

	test("should respect custom classes", function() {
		BootStrap.handleeffects = false;
		var popover = new Element('a',{'href':'#'}).update('@fat')
		$('qunit-fixture').update(popover);
		var popovert = new BootStrap.Popover(popover,{
				title: 'Test'
			, content: 'Test'
			, template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"><p></p></div></div></div>'
			})
		popovert.show()

		ok($$('.popover').length, 'popover was inserted')
		ok($$('.popover').first().hasClassName('foobar'), 'custom class is present')

		popovert.hide()
		ok(!$$('.popover').length, 'popover was removed')
		$('qunit-fixture').update()
	})

	test("should destroy popover", function () {
		var popover = new Element('div')
		var popovert = new BootStrap.Popover(popover,{trigger: 'hover'})
		popover.on('click',function(){

		})

		ok(Event.cache[popover._prototypeUID].mouseenter && Event.cache[popover._prototypeUID].mouseleave, 'popover has hover event')
		ok(Event.cache[popover._prototypeUID].click, 'popover has extra click event')
		popovert.show()
		popovert.destroy()
		ok(!popover.hasClassName('in'), 'popover is hidden')
		ok(Event.cache[popover._prototypeUID].click, 'popover still has click')
		ok(!Event.cache[popover._prototypeUID].mouseenter && !Event.cache[popover._prototypeUID].mouseleave, 'popover does not have any events')
	})