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

      test("should reset style to auto after finishing opening collapse", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;
        var t = new Element('div',{'class':'collapse','style':'height:0px;'});
        var tb = new BootStrap.Collapse(t)
        t.observe('bootstrap:show',function(){
          ok(this.style.height == '0px')
        });
        t.observe('bootstrap:shown',function(){
          ok(this.style.height == 'auto')
          start()
        })
        tb.show();
        BootStrap.handleeffects = temp;
      })

      // test("should add active class to target when collapse shown", function () {
      //   $.support.transition = false
      //   stop()

      //   var target = $('<a data-toggle="collapse" href="#test1"></a>')
      //     .appendTo($('#qunit-fixture'))

      //   var collapsible = $('<div id="test1"></div>')
      //     .appendTo($('#qunit-fixture'))
      //     .on('show', function () {
      //       ok(!target.hasClass('collapsed'))
      //       start()
      //     })

      //   target.click()
      // })

      // test("should remove active class to target when collapse hidden", function () {
      //   $.support.transition = false
      //   stop()

      //   var target = $('<a data-toggle="collapse" href="#test1"></a>')
      //     .appendTo($('#qunit-fixture'))

      //   var collapsible = $('<div id="test1" class="in"></div>')
      //     .appendTo($('#qunit-fixture'))
      //     .on('hide', function () {
      //       ok(target.hasClass('collapsed'))
      //       start()
      //     })

      //   target.click()
      // })
