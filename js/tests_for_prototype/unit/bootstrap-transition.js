module("bootstrap-transition")

	test("should be defined in BootStrap Namespace", function () {
		ok(BootStrap.handleeffects !== undefined, 'transition object is defined')
	})

	test("should define handleeffects as CSS if CSS3 transitions are available", function () {
		ok(BootStrap.handleeffects == 'css', 'BootStrap.handleeffects does equal css')
	})

	test("should provide an end event when using CSS transitions", function () {
		ok(BootStrap.handleeffects == 'css' ? BootStrap.transitionendevent : true, 'end string is defined')
	})

	test("should define handleeffects as effect if CSS3 transitions are not available but scriptaculous Effects are", function () {

		if(BootStrap.handleeffects != 'css' && typeof Scriptaculous !== 'undefined' && typeof Effect !== 'undefined')
		{
			ok(BootStrap.handleeffects == 'effect', 'BootStrap.handleeffects does equal effect')
		}
	})
