    module("bootstrap-alerts")

      test("should be defined in BootStrap Namespace", function () {
        ok(BootStrap.Alert, 'alert method is defined')
      })

      test("should fade element out on clicking .close", function () {
        var alertElement = new Element('div',{'class':'alert-message warning fade in'});
        alertElement.insert(new Element('a',{'class':'close','href':'#','data-dismiss':'alert'}).update('x'));
        alertElement.insert(new Element('p').update('<strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.'))

        var alert = alertElement.down('[data-dismiss="alert"]');
        var balert = new BootStrap.Alert(alert)

        alertElement.down('.close').simulate('click');

        ok(!alert.hasClassName('in'), 'remove .in class on .close click')
      })

      test("should remove element when clicking .close", function () {
        BootStrap.handleeffects = null

        var alertElement = new Element('div',{'class':'alert-message warning fade in'});
        alertElement.insert(new Element('a',{'class':'close','href':'#','data-dismiss':'alert'}).update('x'));
        alertElement.insert(new Element('p').update('<strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.'))

        $('qunit-fixture').insert(alertElement);

        $$('[data-dismiss="alert"]').each(function(i){
            new BootStrap.Alert(i)
          })        

        ok($('qunit-fixture').select('.alert-message').length, 'element added to dom')

        $('qunit-fixture').down('.close').simulate('click')

        ok(!$('qunit-fixture').select('.alert-message').length, 'element removed from dom')
      })