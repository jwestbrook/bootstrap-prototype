module("bootstrap-affix")

	test("should be defined in BootStrap Namespace", function () {
	ok(BootStrap.Affix, 'affix class is defined')
	})


	test("should exit early if element is not visible", function () {
		var affix = new Element('div',{'style':'display:none;'});
		var affixt = new BootStrap.Affix(affix);
		affixt.checkPosition()
		ok(!affix.hasClassName('affix'), 'affix class was not added')
	})