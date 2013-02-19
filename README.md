Twitter Bootstrap for PrototypeJS
================

For those developers that use PrototypeJS, Twitter Bootstrap requires the use of JQuery. If you do not want to load another library just to handle the the Bootstrap interactions use this fork of Twitter Bootstrap.


Differences according to PrototypeJS standards

* effects and methods are called from the `BootStrap` namespace ie `new BootStrap.Modal('elementid',{option})`. This prevents conflicts with any other javascript libraries you may have loaded.
* If you include [script.aculo.us](http://madrobby.github.com/scriptaculous/) you will get consistent behaviors across all browsers that script.aculo.us and PrototypeJS support, otherwise you will only get the fades/movement/etc in browsers that support CSS transitions (sorry Internet Explorer)
* custom events that are fired will also be namespaced to `bootstrap:*` ie `$('element').fire('bootstrap:closed')`

Modules written and version compatible with

<table>
	<tr><td>BootStrap.Alert</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Button</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Dropdown</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Modal</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Tab</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Tooltip</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Popover</td><td>2.3.0</td></tr>
	<tr><td>BootStrap.Transition</td><td>2.3.0</td></tr>
</table>



[Official Twitter Bootstrap README](https://github.com/jwestbrook/bootstrap-prototype/blob/master/Offical%20Bootstrap%20README.md)

