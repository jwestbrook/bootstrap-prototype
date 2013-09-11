module("bootstrap-scrollspy")

	test("should be defined in BootStrap Namespace", function () {
		ok(BootStrap.ScrollSpy, 'scrollspy class is defined')
	})

	test("should switch active class on scroll", function () {
		var sectionHTML = new Element('div',{'id':'masthead'})
		$('qunit-fixture').insert(sectionHTML);

		var topbarHTML = new Element('div',{'class':'topbar'});
		topbarHTML.update('<div class="topbar-inner">\
											<div class="container">\
												<h3><a href="#">Bootstrap</a></h3>\
												<ul class="nav">\
													<li><a href="#masthead">Overview</a></li>\
												</ul>\
											</div>\
										</div>');
		$('qunit-fixture').insert(topbarHTML);
		var $topbar = new BootStrap.ScrollSpy($('qunit-fixture').down('.topbar'))

		ok($('qunit-fixture').down('.topbar').select('.active'))
	})