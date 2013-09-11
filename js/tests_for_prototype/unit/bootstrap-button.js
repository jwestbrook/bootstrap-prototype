module("bootstrap-buttons")


test("should be defined BootStrap Namespace", function () {
	ok(BootStrap.Button, 'button method is defined')
});


test("should return set state to loading", function () {
	var btn = new Element('button',{'class':'btn','data-loading-text':"fat"}).update('mdo')
	equals(btn.innerHTML, 'mdo', 'btn text equals mdo')
	var bbtn = new BootStrap.Button(btn,'loading')
	equals(btn.innerHTML, 'fat', 'btn text equals fat')
	stop()
	setTimeout(function () {
		ok(btn.writeAttribute('disabled'), 'btn is disabled')
		ok(btn.hasClassName('disabled'), 'btn has disabled class')
		start()
	}, 0)
})

test("should return reset state", function () {
	var btn = new Element('button',{'class':'btn','data-loading-text':'fat'}).update('mdo');
	equals(btn.innerHTML, 'mdo', 'btn text equals mdo')
	var bbtn = new BootStrap.Button(btn,'loading')
	equals(btn.innerHTML, 'fat', 'btn text equals fat')
	stop()
	setTimeout(function () {
		ok(btn.writeAttribute('disabled'), 'btn is disabled')
		ok(btn.hasClassName('disabled'), 'btn has disabled class')
		start()
		stop()
	}, 0)
	bbtn.setState('reset')
	equals(btn.innerHTML, 'mdo', 'btn text equals mdo')
	setTimeout(function () {
		ok(!btn.readAttribute('disabled'), 'btn is not disabled')
		ok(!btn.hasClassName('disabled'), 'btn does not have disabled class')
		start()
	}, 0)
})

test("should toggle active", function () {
	var btn = new Element('button',{'class':"btn"}).update('mdo')
	ok(!btn.hasClassName('active'), 'btn does not have active class')
	var bbtn = new BootStrap.Button(btn,'toggle')
	ok(btn.hasClassName('active'), 'btn has class active')
})

test("should toggle active when btn children are clicked", function () {
	var btn = new Element('button',{'class':"btn",'data-toggle':"button"}).update('mdo')
	, inner = new Element('i')
	btn.insert(inner)
	$('qunit-fixture').insert(btn)
	$$("[data-toggle^=button]").invoke("observe","click",function(e){
		var $btn = e.findElement()
		if(!$btn.hasClassName('btn')) $btn = $btn.up('.btn')
		new BootStrap.Button($btn,'toggle')
	});
	ok(!btn.hasClassName('active'), 'btn does not have active class')
	inner.simulate('click')
	ok(btn.hasClassName('active'), 'btn has class active')
})

test("should toggle active when btn children are clicked within btn-group", function () {
	var btngroup = new Element('div',{'class':"btn-group",'data-toggle':"buttons-checkbox"})
	, btn = new Element('button',{'class':"btn"}).update('fat')
	, inner = new Element('i')
	btngroup.insert(btn.insert(inner))
	$('qunit-fixture').insert(btngroup)
	$$("[data-toggle^=button]").invoke("observe","click",function(e){
		var $btn = e.findElement()
		if(!$btn.hasClassName('btn')) $btn = $btn.up('.btn')
		new BootStrap.Button($btn,'toggle')
	});
	ok(!btn.hasClassName('active'), 'btn does not have active class')
	inner.simulate('click')
	ok(btn.hasClassName('active'), 'btn has class active')
})

test("should check for closest matching toggle", function () {
	var group = new Element('div',{'data-toggle':'buttons-radio'})
	, btn1  = new Element("button",{'class':'btn active'})
	, btn2  = new Element("button",{'class':'btn'})
	, wrap  = new Element("div")

	wrap.insert(btn1).insert(btn2)

	$('qunit-fixture').insert(group.insert(wrap))
	$$("[data-toggle^=button]").invoke("observe","click",function(e){
		var $btn = e.findElement()
		if(!$btn.hasClassName('btn')) $btn = $btn.up('.btn')
			new BootStrap.Button($btn,'toggle')
	});

	ok(btn1.hasClassName('active'), 'btn1 has active class')
	ok(!btn2.hasClassName('active'), 'btn2 does not have active class')
	btn2.simulate('click')
	ok(!btn1.hasClassName('active'), 'btn1 does not have active class')
	ok(btn2.hasClassName('active'), 'btn2 has active class')
})

