module("bootstrap-tabs")

	test("should be defined on BootStrap Namespace", function () {
		ok(BootStrap.Tab, 'tabs class is defined')
	})

	test("should activate element by tab id", function () {
		var tabshtml = new Element('ul',{'class':'tabs'});
		tabshtml.insert(new Element('li').update(new Element('a',{'href':'#home'}).update('Home')));
		tabshtml.insert(new Element('li').update(new Element('a',{'href':'#profile'}).update('Profile')))

		var t = new Element('ul')
		t.insert(new Element('li',{'id':'home'}))
		t.insert(new Element('li',{'id':'profile'}))

		$('qunit-fixture').insert(t)

		var tb = new BootStrap.Tab(tabshtml.down('li:last a'))
		tb.show();
		equals($("qunit-fixture").down('.active').readAttribute('id'), "profile")

		tb = new BootStrap.Tab(tabshtml.down('li:first a'))
		tb.show();
		equals($("qunit-fixture").down('.active').readAttribute('id'), "home")
	})

	test("should activate element by tab id", function () {
		var pillshtml = new Element('ul',{'class':'pills'})
		pillshtml.insert(new Element('li').update(new Element('a',{'href':'#home'}).update('Home')))
		pillshtml.insert(new Element('li').update(new Element('a',{'href':'#profile'}).update('Profile')))

		var t = new Element('ul')
		t.insert(new Element('li',{'id':'home'}))
		t.insert(new Element('li',{'id':'profile'}))
		$('qunit-fixture').update(t)

		var tb = new BootStrap.Tab(pillshtml.down('li:last a'))
		tb.show()
		equals($("qunit-fixture").down('.active').readAttribute('id'), "profile")

		tb = new BootStrap.Tab(pillshtml.down('li:first a'))
		tb.show()
		equals($("qunit-fixture").down('.active').readAttribute('id'), "home")
	})


	test("should not fire closed when close is prevented", function () {
		stop()
		var temp = BootStrap.handleeffects;
		BootStrap.handleeffects = null;

		var div = new Element('div',{'class':'tab'})
		div.observe('bootstrap:show',function(e){
			e.preventDefault()
			ok(true)
			start()
		})
		div.observe('bootstrap:shown',function(){
			ok(false)
		})

		new BootStrap.Tab(div).show()
	})

	test("show and shown events should reference correct relatedTarget", function () {

		var drophtml = new Element('ul',{'class':'drop'})
		var item = new Element('li',{'class':'dropdown'})
		item.insert(new Element('a',{'data-toggle':'dropdown','href':'#'}).update(1))
		var list = new Element('ul',{'class':'dropdown-menu'})
		list.insert(new Element('li').update(new Element('a',{'href':'#1-1','data-toggle':'tab'}).update('1-1')))
		list.insert(new Element('li').update(new Element('a',{'href':'#1-2','data-toggle':'tab'}).update('1-2')))
		item.insert(list)
		drophtml.insert(item)

		// console.log(drophtml.down('ul>li:first a'))

		var tb = new BootStrap.Tab(drophtml.down('ul>li:first a'))
		var tc = new BootStrap.Tab(drophtml.down('ul>li:last a'))
		drophtml.down('ul>li:last a').observe('bootstrap:show',function(e){
			equals(e.memo.relatedTarget.hash, "#1-1")
		})
		drophtml.down('ul>li:last a').observe('bootstrap:shown',function(e){
			equals(e.memo.relatedTarget.hash, "#1-1")
		})

		tb.show()
		tc.show()

	})
