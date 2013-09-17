/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
/*

Modified for use with PrototypeJS

https://github.com/jwestbrook/bootstrap-prototype/tree/master-3.0


*/

"use strict";

if(BootStrap === undefined)
{
  var BootStrap = {};
}


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */
BootStrap.Button = Class.create({
  initialize : function (element, options) {
    this.$element = $(element)
    this.$element.store('bootstrap:button',this)

    this.options = {
      loadingText: 'loading...'
    }

    if(typeof options == 'object'){
      Object.extend(this.options,options)
    } else if(typeof options != 'undefined' && options == 'toggle') {
      this.toggle()
    } else if (typeof options != 'undefined'){
      this.setState(options)
    }

  },
  setState : function (state) {
    var d = 'disabled'
    var $el = this.$element
    var val = $el.match('input') ? 'value' : 'innerHTML'

    state = state + 'Text'

    if(!$el.hasAttribute('data-reset-text')) $el.writeAttribute('data-reset-text',$el[val])

    $el[val] = ($el.readAttribute('data-'+state.underscore().dasherize()) || (this.options && this.options[state]) || '')

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
      $el.addClassName(d).writeAttribute(d,true) :
      $el.removeClassName(d).writeAttribute(d,false)
    }, 0)
  },
  toggle : function () {
    var $parent = this.$element.up('[data-toggle="buttons"]')

    if($parent !== undefined){
      var $input = this.$element.down('input')
      $input.writeAttribute('checked',!this.$element.hasClassName('active'))
      if(Event.simulate){
        $input.simulate('change')
      }
      if($input.readAttribute('type') === 'radio') $parent.select('.active').invoke('removeClassName','active')
    }

    this.$element.toggleClassName('active')
  }
});


/*domload*/

document.observe("dom:loaded",function(){
  $$("[data-toggle^=button]").invoke("observe","click",function(e){
    var $btn = e.findElement()
    if(!$btn.hasClassName('btn')) $btn = $btn.up('.btn')
    new BootStrap.Button($btn,'toggle')
    e.preventDefault()
  });
});