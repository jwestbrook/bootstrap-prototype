/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
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



 /* ALERT CLASS DEFINITION
  * ====================== */
BootStrap.Alert = Class.create({
  initialize : function (element) {
    element = $(element);
    element.store('bootstrap:alert',this)
    element.on('click','[data-dismiss="alert"]',this.close)
  },
  close : function (e) {
    var $this = $(this)
    var selector = $this.readAttribute('data-target')
  
    if (!selector) {
      selector = $this.href
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = $$(selector)

    if(e) e.preventDefault()

    if($parent.length){
      $parent = $this.hasClassName('alert') ? $this : $this.up()
    }
    
    var closeEvent = $parent.fire('bootstrap:close')

    if(closeEvent.defaultPrevented) return

    function removeElement() {
      $parent.fire('bootstrap:closed')
      $parent.remove()
    }
  
    if(BootStrap.handleeffects === 'css' && $parent.hasClassName('fade'))
    {
      $parent.observe(BootStrap.transitionendevent,removeElement);
      $parent.removeClassName('in')
    }
    else if(BootStrap.handleeffects === 'effect' && $parent.hasClassName('fade'))
    {
      new Effect.Fade($parent,{duration:0.3,from:$parent.getOpacity()*1,afterFinish:function(){
        $parent.removeClassName('in')
        removeElement()
      }})
    }
    else
    {
      removeElement()
    }

  }
});

/*domload*/

document.observe("dom:loaded",function(){
  document.observe('click','[data-dismiss="alert"]',BootStrap.Alert.close)
  $$('.alert [data-dismiss="alert"]').each(function(i){
    new BootStrap.Alert(i)
  })
});