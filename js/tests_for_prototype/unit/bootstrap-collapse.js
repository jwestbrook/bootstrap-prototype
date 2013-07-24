    module("bootstrap-collapse")

      test("should be defined on BootStrap Namespace", function () {
        ok(BootStrap.Collapse, 'collapse class is defined')
      })

      test("should show a collapsed element", function () {
        var el = new Element('div',{'class':'collapse'});
        var t = new BootStrap.Collapse(el);
        t.show();
        ok(el.hasClassName('in'), 'has class in')
        ok(/height/.test(el.readAttribute('style')), 'has height set')
      })

      test("should hide a collapsed element", function () {
        var el = new Element('div',{'class':'collapse'});
        var t = new BootStrap.Collapse(el,{'toggle':false});
        ok(!el.hasClassName('in'), 'does not have class in')
        // ok(/height/.test(el.readAttribute('style')), 'has height set')
      })

      test("should not fire shown when show is prevented", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;
        var t1 = new Element('div',{'class':'collapse'});
        var tb = new BootStrap.Collapse(t1);
        t1.observe('bootstrap:show',function(e){
          e.preventDefault();
          ok(true);
          start();
        });
        t1.observe('bootstrap:shown',function(e){
          ok(false)
        });
        tb.show();
        BootStrap.handleeffects = temp;
      })

      // test("should reset style to auto after finishing opening collapse", function () {
      //   stop()
      //   var temp = BootStrap.handleeffects;
      //   BootStrap.handleeffects = null;
      //   var t = new Element('div',{'class':'collapse','style':'height:0px;'});
      //   var tb = new BootStrap.Collapse(t)
      //   t.observe('bootstrap:show',function(){
      //     ok(this.style.height == '0px')
      //   });
      //   t.observe('bootstrap:shown',function(){
      //     ok(this.style.height == 'auto')
      //     start()
      //   })
      //   tb.show();
      //   BootStrap.handleeffects = temp;
      // })

      test("should add active class to target when collapse shown", function () {
        stop();
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;

        var target = new Element('a',{'data-toggle':'collapse','href':'#test1'});
        $('qunit-fixture').update(target);

        var collapsible = new Element('div',{'id':'test1'});
        collapsible.on('bootstrap:show',function(){
          ok(!target.hasClassName('collapsed'))
          start()
        })
        $('qunit-fixture').insert(collapsible)

        document.fire('dom:loaded')
        target.simulate('click')
        BootStrap.handleeffects = temp;
      })

      test("should remove active class to target when collapse hidden", function () {
        stop();
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;

        var target = new Element('a',{'data-toggle':'collapse','href':'#test1'})
        $('qunit-fixture').update(target)

        var collapsible = new Element('div',{'id':'test1','class':'in'})
        collapsible.on('bootstrap:hide',function(){
          ok(target.hasClassName('collapsed'))
          start()
        })
        $('qunit-fixture').insert(collapsible)

        document.fire('dom:loaded')
        target.simulate('click')
        BootStrap.handleeffects = temp;
      })
