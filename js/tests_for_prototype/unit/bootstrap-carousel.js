
module("bootstrap-carousel")

test("should be defined in BootStrap Namespace", function () {
	ok(BootStrap.Carousel, 'carousel class is defined')
})


test("should fire slide event", function () {
	var template = new Element('div',{'id':'myCarousel','class':'carousel slide'});
		var inner = new Element('div',{'class':'carousel-inner'})
			var item = new Element('div',{'class':'item active'})
			item.insert(new Element('img',{'alt':''}))
				var caption = new Element('div',{'class':'carousel-caption'})
				caption.insert(new Element('h4').update('{{_i}}First Thumbnail label{{/i}}'))
				caption.insert(new Element('p').update('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'))
			item.insert(caption)
		inner.insert(item)
			item = new Element('div',{'class':'item'})
			item.insert(new Element('img',{'alt':''}))
				var caption = new Element('div',{'class':'carousel-caption'})
				caption.insert(new Element('h4').update('{{_i}}Second Thumbnail label{{/i}}'))
				caption.insert(new Element('p').update('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'))
			item.insert(caption)
		inner.insert(item)
			item = new Element('div',{'class':'item'})
			item.insert(new Element('img',{'alt':''}))
				var caption = new Element('div',{'class':'carousel-caption'})
				caption.insert(new Element('h4').update('{{_i}}Third Thumbnail label{{/i}}'))
				caption.insert(new Element('p').update('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'))
			item.insert(caption)
		inner.insert(item)
	template.insert(inner)
	template.insert(new Element('a',{'class':'left carousel-control','href':'#myCarousel','data-slide':'prev'}).update('&lsaquo;'))
	template.insert(new Element('a',{'class':'right carousel-control','href':'#myCarousel','data-slide':'next'}).update('&rsaquo;'))

	var handleeffects = BootStrap.handleeffects

	BootStrap.handleeffects = null
	stop()
	var bcar = new BootStrap.Carousel(template)
	template.observe('bootstrap:slide',function(e){
		e.preventDefault()
		ok(e.findElement())
		start()
		this.stopObserving()
	})
	bcar.next()
	BootStrap.handleeffects = handleeffects
})

test("should set interval from data attribute", 3,function () {
	var template = new Element('div',{'id':'myCarousel','class':'carousel slide'});
		var inner = new Element('div',{'class':'carousel-inner'})
			var item = new Element('div',{'class':'item active'})
			item.insert(new Element('img',{'alt':''}))
				var caption = new Element('div',{'class':'carousel-caption'})
				caption.insert(new Element('h4').update('{{_i}}First Thumbnail label{{/i}}'))
				caption.insert(new Element('p').update('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'))
			item.insert(caption)
		inner.insert(item)
			item = new Element('div',{'class':'item'})
			item.insert(new Element('img',{'alt':''}))
				var caption = new Element('div',{'class':'carousel-caption'})
				caption.insert(new Element('h4').update('{{_i}}Second Thumbnail label{{/i}}'))
				caption.insert(new Element('p').update('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'))
			item.insert(caption)
		inner.insert(item)
			item = new Element('div',{'class':'item'})
			item.insert(new Element('img',{'alt':''}))
				var caption = new Element('div',{'class':'carousel-caption'})
				caption.insert(new Element('h4').update('{{_i}}Third Thumbnail label{{/i}}'))
				caption.insert(new Element('p').update('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'))
			item.insert(caption)
		inner.insert(item)
	template.insert(inner)
	template.insert(new Element('a',{'class':'left carousel-control','href':'#myCarousel','data-slide':'prev'}).update('&lsaquo;'))
	template.insert(new Element('a',{'class':'right carousel-control','href':'#myCarousel','data-slide':'next'}).update('&rsaquo;'))

	template.writeAttribute('data-interval',1814)

	template1 = template.clone(true)

	var bcar = new BootStrap.Carousel(template1)

	$$('body').first().insert(template1)
	$$('[data-slide]').first().simulate('click')
	ok(bcar.options.interval == 1814);
	$('myCarousel').remove();

	template2 = template.clone(true).writeAttribute('data-modal','foobar')
	bcar = new BootStrap.Carousel(template2)
	$$('body').first().insert(template2)

	$$('[data-slide]').first().simulate('click')
	ok(bcar.options.interval == 1814, "even if there is an data-modal attribute set");
	$('myCarousel').remove();

	template3 = template.clone(true)
	bcar = new BootStrap.Carousel(template3)
	$$('body').first().insert(template3)

	$$('[data-slide]').first().simulate('click')
	$('myCarousel').writeAttribute('data-interval', 1860);
	$$('[data-slide]').first().simulate('click')
	ok(bcar.options.interval == 1814, "attributes should be read only on intitialization");
	$('myCarousel').remove();
	bcar = null
})