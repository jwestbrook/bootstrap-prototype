    module("bootstrap-modal")

      test("should be defined on BootStrap Namespace", function () {
        ok(BootStrap.Modal, 'modal class is defined')
      })

      test("should insert into dom when show method is called", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;
        var t = new Element('div',{'id':'modal-test'})
        t.observe('bootstrap:shown',function(){
          ok($('modal-test') !== undefined, 'modal insterted into dom')
          this.remove()
          start()
        })
        var tb = new BootStrap.Modal(t)
        BootStrap.handleeffects = temp;
      })

      test("should fire show event", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;
        var t = new Element('div',{'id':'modal-test'})
        t.observe('bootstrap:show',function(){
          ok(true,'show was called')
        })
        t.observe('bootstrap:shown',function(){
          this.remove();
          start()
        })
        var tb = new BootStrap.Modal(t)
        BootStrap.handleeffects = temp;
      })

      test("should not fire shown when default prevented", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;
        var t = new Element('div',{'id':'modal-test'})
        t.observe('bootstrap:show',function(e){
          e.preventDefault()
          ok(true,"show was called")
          start()
        })
        t.observe('bootstrap:shown',function(){
          ok(false,"shown was called")
        })
        var tb = new BootStrap.Modal(t)
        BootStrap.handleeffects = temp;
      })

      test("should hide modal when hide is called", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;
        var t = new Element('div',{'id':'modal-test'})

        t.observe('bootstrap:shown',function(){
          ok($('modal-test').visible(), 'modal visible')
          ok($('modal-test') !== undefined, 'modal inserted in dom')
          t.retrieve('bootstrap:modal').hide()
        })
        t.observe('bootstrap:hidden',function(){
          ok(!$('modal-test').visible(), 'modal hidden')
          this.remove()
          start()
        })
        var tb = new BootStrap.Modal(t)
        BootStrap.handleeffects = temp;
      })

      test("should toggle when toggle is called", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;

        var div = new Element('div',{'id':'modal-test'})

        div.observe('bootstrap:shown',function(){
          ok($('modal-test').visible(), 'modal visible')
          ok($('modal-test') !== undefined, 'modal insterted into dom')
          div.retrieve('bootstrap:modal').toggle()
        })
        div.observe('bootstrap:hidden',function(){
          ok(!$('modal-test').visible(), 'modal hidden')
          this.remove()
          start()
        })
        var tb = new BootStrap.Modal(div)
        BootStrap.handleeffects = temp;
      })

      test("should remove from dom when click [data-dismiss=modal]", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;

        var div = new Element('div',{'id':'modal-test'});
        div.insert(new Element('span',{'class':'close','data-dismiss':'modal'}))
        
        div.observe('bootstrap:shown',function(){
            ok($('modal-test').visible(), 'modal visible')
            ok($('modal-test') !== undefined, 'modal insterted into dom')
            setTimeout(function(){
              this.down('.close').simulate('click')
            }.bind(this),1)
        })
        div.observe('bootstrap:hidden',function(){
            ok(!$('modal-test').visible(), 'modal hidden')
            this.remove()
            start()
        })
        var tb = new BootStrap.Modal(div)
        BootStrap.handleeffects = temp;
      })

      test("should allow modal close with 'backdrop:false'", function () {
        stop()
        var temp = BootStrap.handleeffects;
        BootStrap.handleeffects = null;

        var div = new Element('div',{'id':'modal-test','data-backdrop':false})
        div.observe('bootstrap:shown',function(){
            ok($('modal-test').visible(), 'modal visible')
            this.retrieve('bootstrap:modal').hide()
        })
        div.observe('bootstrap:hidden',function(){
            ok(!$('modal-test').visible(), 'modal hidden')
            this.remove()
            start()
        })
        var tb = new BootStrap.Modal(div)
        BootStrap.handleeffects = temp;
      })