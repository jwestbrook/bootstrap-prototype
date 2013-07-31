    module("bootstrap-tooltip")

      test("should be defined on BootStrap Namespace", function () {
        ok(BootStrap.Tooltip, 'Tooltip class is defined')
      })

      test("should empty title attribute", function () {
        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        new BootStrap.Tooltip(tooltip)
        ok(tooltip.readAttribute('title') === null, 'title attribute was emptied')
      })

      test("should add data attribute for referencing original title", function () {
        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        new BootStrap.Tooltip(tooltip)
        equals(tooltip.readAttribute('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
      })

      test("should place tooltips relative to placement option", function () {
        BootStrap.handleeffects = null;

        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        $('qunit-fixture').update(tooltip)
        new BootStrap.Tooltip(tooltip,{'placement':'bottom'}).show()

        ok(
            $$(".tooltip").first().hasClassName('fade') && 
            $$(".tooltip").first().hasClassName('bottom') && 
            $$(".tooltip").first().hasClassName('in'), 'has correct classes applied')
        tooltip.retrieve('bootstrap:tooltip').hide()
      })

      test("should allow html entities", function () {
        BootStrap.handleeffects = null;

        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'<b>@fat</b>'})
        $('qunit-fixture').update(tooltip)
        new BootStrap.Tooltip(tooltip,{'html':true}).show()

        ok($$('.tooltip b').length, 'b tag was inserted')
        tooltip.retrieve('bootstrap:tooltip').hide()
        ok(!$$(".tooltip").length, 'tooltip removed')
      })

      test("should respect custom classes", function () {
        BootStrap.handleeffects = null;
        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        $('qunit-fixture').update(tooltip)
        new BootStrap.Tooltip(tooltip,{'template':'<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'}).show()

        ok($$('.tooltip').first().hasClassName('some-class'), 'custom class is present')
        tooltip.retrieve('bootstrap:tooltip').hide()
        ok($$('.tooltip').length === 0, 'tooltip removed')
      })

      test("should fire show event", function () {
        stop()
        var container = new Element('div');
        var tooltip = new Element('div',{'title':'tooltip title'})
        tooltip.observe('bootstrap:show',function(e){
          ok(true, "show was called")
          start()
        })
        new BootStrap.Tooltip(tooltip,{'container':container}).show()
      })

      test("should fire shown event", function () {
        stop()
        var container = new Element('div');
        var tooltip = new Element('div',{'title':'tooltip title'})
        tooltip.observe('bootstrap:shown',function(){
          ok(true, "shown was called")
          start()
        })
        new BootStrap.Tooltip(tooltip,{'container':container}).show()
      })

      test("should not fire shown event when default prevented", function () {
        stop()
        var tooltip = new Element('div',{'title':'tooltip title'})
        tooltip.observe('bootstrap:show',function(e){
          e.preventDefault()
          ok(true, "show was called")
          start()
        })
        tooltip.observe('bootstrap:shown',function(){
          ok(false, "shown was called")
        })
        new BootStrap.Tooltip(tooltip).show()
      })

      test("should fire hide event", function () {
        stop()
        var container = new Element('div');
        var tooltip = new Element('div',{'title':'tooltip title'})
        tooltip.observe('bootstrap:shown',function(){
          this.retrieve('bootstrap:tooltip').hide()
        })
        tooltip.observe('bootstrap:hide',function(){
          ok(true, "hide was called")
          start()
        })
        new BootStrap.Tooltip(tooltip,{'container':container}).show()
      })

      test("should fire hidden event", function () {
        stop()
        var container = new Element('div');
        var tooltip = new Element('div',{'title':'tooltip title'})
        tooltip.observe('bootstrap:shown',function(){
          this.retrieve('bootstrap:tooltip').hide()
        })
        tooltip.observe('bootstrap:hidden',function(){
          ok(true, 'hidden was called')
          start()
        })
        new BootStrap.Tooltip(tooltip,{'container':container}).show()
      })

      test("should not fire hidden event when default prevented", function () {
        stop()
        var container = new Element('div');
        var tooltip = new Element('div',{'title':'tooltip title'})
        tooltip.observe('bootstrap:shown',function(){
          this.retrieve('bootstrap:tooltip').hide()
        });
        tooltip.observe('bootstrap:hide',function(e){
          e.preventDefault()
          ok(true, "hide was called")
          start()
        })
        tooltip.observe('bootstrap:hidden',function(){
          ok(false,"hidden was called")
        })
        new BootStrap.Tooltip(tooltip,{'container':container}).show()

      })

      test("should not show tooltip if leave event occurs before delay expires (delay 200 milsec)", function () {
        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        new BootStrap.Tooltip(tooltip,{'delay':200})
        $('qunit-fixture').insert(tooltip)

        stop()

        $('qunit-fixture').down('a').simulate('mouseenter')

        setTimeout(function () {
          ok($$(".tooltip").length == 0 || (!$$(".tooltip").first().hasClassName('fade') && !$$('.tooltip').first().hasClassName('in')), 'tooltip is not faded in')
          $('qunit-fixture').down('a').simulate('mouseout')
          setTimeout(function () {
            ok($$(".tooltip").length == 0 || (!$$(".tooltip").first().hasClassName('fade') && !$$(".tooltip").first().hasClassName('in')), 'tooltip is not faded in')
            start()
          }, 200)
        }, 100)
      })

      test("should not show tooltip if leave event occurs before delay expires, even if hide delay is 0", function () {

        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        new BootStrap.Tooltip(tooltip,{'delay': {show :200, hide : 0} })

        $('qunit-fixture').insert(tooltip)

        stop()

        $('qunit-fixture').down('a').retrieve('bootstrap:tooltip').enter()

        setTimeout(function () {
          ok($$('.tooltip').length == 0 || (!$$(".tooltip").first().hasClassName('fade') && !$$(".tooltip").first().hasClassName('in')), 'tooltip is not faded in')
          $('qunit-fixture').down('a').retrieve('bootstrap:tooltip').leave()
          setTimeout(function () {
            ok($$('.tooltip').length == 0 || (!$$(".tooltip").first().hasClassName('fade') && !$$(".tooltip").first().hasClassName('in')), 'tooltip is not faded in')
            start()
          }, 200)
        }, 100)
      })

      test("should not show tooltip if leave event occurs before delay expires (delay 100 milsec)", function () {

        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        new BootStrap.Tooltip(tooltip,{'delay': 100})

        $('qunit-fixture').insert(tooltip)

        stop()
        $('qunit-fixture').down('a').retrieve('bootstrap:tooltip').enter()
        setTimeout(function () {
          ok($$(".tooltip").length == 0 || (!$$(".tooltip").hasClassName('fade') && !$$(".tooltip").hasClassName('in')), 'tooltip is not faded in')
          $('qunit-fixture').down('a').retrieve('bootstrap:tooltip').leave()
          setTimeout(function () {
            ok($$(".tooltip").length == 0 || (!$$(".tooltip").hasClassName('fade') && !$$(".tooltip").hasClassName('in')), 'tooltip is not faded in')
            start()
          }, 100)
        }, 50)
      })

      test("should show tooltip if leave event hasn't occured before delay expires", function () {

        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        new BootStrap.Tooltip(tooltip,{'delay': 150})

        $('qunit-fixture').insert(tooltip)

        stop()
        $('qunit-fixture').down('a').retrieve('bootstrap:tooltip').enter()
        setTimeout(function () {
          ok($$(".tooltip").length == 0 || (!$$(".tooltip").hasClassName('fade') && !$$(".tooltip").hasClassName('in')), 'tooltip is not faded in')
        }, 100)
        setTimeout(function () {
          ok($$(".tooltip").first().hasClassName('fade') && $$(".tooltip").first().hasClassName('in'), 'tooltip has faded in')
          start()
        }, 200)
      })

      test("should destroy tooltip", function () {
        var tooltip = new Element('div')
        tooltip.observe('click',function() {})
        new BootStrap.Tooltip(tooltip)

        ok(tooltip.dataset, 'tooltip has data')
        ok(Event.cache[tooltip._prototypeUID].mouseenter && Event.cache[tooltip._prototypeUID].mouseleave, 'tooltip has hover event')
        ok(Event.cache[tooltip._prototypeUID].click, 'tooltip has extra click event')
        tooltip.retrieve('bootstrap:tooltip').show()
        tooltip.retrieve('bootstrap:tooltip').destroy()
        ok(!tooltip.hasClassName('in'), 'tooltip is hidden')
        // ok(!tooltip.dataset, 'tooltip does not have data')
        ok(Event.cache[tooltip._prototypeUID].click, 'tooltip still has click')
        ok(!Event.cache[tooltip._prototypeUID].mouseenter && !Event.cache[tooltip._prototypeUID].mouseleave, 'tooltip does not have any events')
      })

      test("should show tooltip with delegate selector on click", function () {
        var div = new Element('div').update(new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'}))

        $('qunit-fixture').insert(div)
        new BootStrap.Tooltip($('qunit-fixture').down('div'),{'selector':'a[rel="tooltip"]','trigger':'click'})

        $('qunit-fixture').down('a').simulate('click')

        ok($$(".tooltip").length > 0 && $$(".tooltip").first().hasClassName('fade') && $$('.tooltip').first().hasClassName('in'), 'tooltip is faded in')
      })

      test("should show tooltip when toggle is called", function () {
        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'tooltip on toggle'})
        $('qunit-fixture').update(tooltip)
        new BootStrap.Tooltip($('qunit-fixture').down('a'),{'trigger':'manual'}).toggle()
        ok($$(".tooltip").length > 0 && $$(".tooltip").first().hasClassName('fade') && $$(".tooltip").first().hasClassName('in'), 'tooltip should be toggled in')
      })

      test("should place tooltips inside the body", function () {
        var tooltip = new Element('a',{'href':'#','rel':'tooltip','title':'Another tooltip'})
        $('qunit-fixture').update(tooltip)
        new BootStrap.Tooltip(tooltip,{'container':'body'}).show()
        ok($$("body > .tooltip").length, 'inside the body')
        ok(!$$("#qunit-fixture > .tooltip").length, 'not found in parent')
        tooltip.retrieve('bootstrap:tooltip').hide()
      })

      test("should place tooltip inside window", function(){
        var container = new Element('div')
        container.setStyle({position: "absolute", width: '200px', height: '200px', bottom: 0, left: 0})
        $$('body').first().insert(container)

        var tooltip = new Element('a',{'href':'#','title':'Very very very very very very very very long tooltip'}).update('Hover me')
        tooltip.setStyle({position: "absolute", top:0, left: 0})
        container.update(tooltip)

        new BootStrap.Tooltip(tooltip,{'placement':'top','animate':false}).show()

        stop()

        setTimeout(function(){
          ok($$(".tooltip").first().positionedOffset().left >= 0)

          start()
          container.remove()
        }, 100)
      })

      test("should place tooltip on top of element", function(){

        var container = new Element('div')
        container.setStyle({position: "absolute", bottom: 0, left: 0, textAlign: "right", width: '300px', height: '300px'})
        $$('body').first().insert(container)

        var p = new Element('p',{'style':'margin-top:200px;'})
        container.insert(p)

        var tooltiped = new Element('a',{'href':'#','title':'very very very very very very very long tooltip'}).update('Hover me')
        tooltiped.setStyle({marginTop: 200})
        p.insert(tooltiped)
        new BootStrap.Tooltip(tooltiped,{'placement':'top','animate':false}).show()

        stop()

        setTimeout(function(){
          var tooltip = container.down(".tooltip")
          var layout = tooltip.getLayout()

          start()
          ok(tooltiped.positionedOffset().top*1 + layout.get('margin-box-height')*1 <= tooltip.positionedOffset().top)
          container.remove()
        }, 100)
      })