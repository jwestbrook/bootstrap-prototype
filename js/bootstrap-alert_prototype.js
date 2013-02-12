/* ==========================================================
 * bootstrap-alert.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
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
 * ========================================================== */
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/


  "use strict"; // jshint ;_;

if(BootStrap === undefined)
{
	var BootStrap = {};
}



 /* ALERT CLASS DEFINITION
  * ====================== */
	BootStrap.Alert = Class.create({
		initialize : function (element) {
			$(element).observe('click',this.close)
		},
		close : function (e) {
			var $this = $(this)
			  , selector = $this.readAttribute('data-target')
			  , $parent
			  
		
			if (!selector) {
			  selector = $this.href
			  selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '').replace('#','') //strip for ie7
			}
			
			(selector != undefined && selector.length > 0) ? $parent = $(selector) : '';
		
			($parent != undefined && $parent.length) || ($parent = $this.hasClassName('alert') ? $this : $this.up())
		
			$parent.fire('bootstrap:close')
		
			function removeElement() {
			  $parent.fire('bootstrap:closed')
			  $parent.remove()
			}
		
			if(BootStrap.handleeffects === 'css' && $parent.hasClassName('fade'))
			{
				$parent.observe(BootStrap.transitionendevent,function(){
					removeElement();
				});
				$parent.removeClassName('in')
			}
			else if(BootStrap.handleeffects === 'effect' && $parent.hasClassName('fade'))
			{
				new Effect.Fade($parent,{duration:0.3,from:$parent.getOpacity()*1,afterFinish:function(){
					$parent.removeClassName('in')
					removeElement()
				}})
			}

		}
	});

document.observe("dom:loaded",function(){
	$$('.alert [data-dismiss="alert"]').each(function(i){
		new BootStrap.Alert(i)
	})
});