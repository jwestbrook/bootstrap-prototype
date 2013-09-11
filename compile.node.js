require("prototype4node")
var fs = require("fs");
var ClosureCompiler = require("closurecompiler");
var JSHINT = require("jshint").JSHINT;

var prependlicense = "/* ===========================================================\n * bootstrap_prototype.js v2.3.2\n * http://twitter.github.com/bootstrap/javascript.html\n * ===========================================================\n * Copyright 2012 Twitter, Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n * ========================================================== */\n/*\n\nModified for use with PrototypeJS\n\nhttp://github.com/jwestbrook/bootstrap-prototype\n\n\n*/\n";
prependlicense += "/* BUILD TIME "+new Date()+" */\n\n\"use strict\";\n";

var nfiles =    {
					'BootStrap.Transition':'bootstrap-transition_prototype.js',
					'BootStrap.Alert':'bootstrap-alert_prototype.js',
					'BootStrap.Button':'bootstrap-button_prototype.js',
					'BootStrap.Carousel':'bootstrap-carousel_prototype.js',
					'BootStrap.Collapse':'bootstrap-collapse_prototype.js',
					'BootStrap.Dropdown':'bootstrap-dropdown_prototype.js',
					'BootStrap.Modal':'bootstrap-modal_prototype.js',
					'BootStrap.Tooltip':'bootstrap-tooltip_prototype.js',
					'BootStrap.Popover':'bootstrap-popover_prototype.js',
					'BootStrap.Scrollspy':'bootstrap-scrollspy_prototype.js',
					'BootStrap.Tab':'bootstrap-tab_prototype.js',
					'BootStrap.Typeahead':'bootstrap-typeahead_prototype.js',
				};

var classes = "";
var domloaded = "document.observe('dom:loaded',function(){\n";
var jshinterrors = [];
var jshintconfig = fs.readFileSync('./js/.jshintrc').toString().evalJSON();


Object.keys(nfiles).each(function(t){
	var class_define, domload;
	var data = fs.readFileSync('./js/'+nfiles[t]).toString();
	if(!JSHINT(data,jshintconfig))
	{
		jshinterrors.push(JSHINT.errors);
		throw $break;
	}

	if(data.include('domload'))
	{
		class_define = data.substring(0,data.indexOf('/*domload*/'));

		class_define = "//" + t + "\n" + class_define.substring(data.indexOf('BootStrap.'));
		class_define = class_define.replace(/^\n\n/,"//" + t + "\n");

		classes += class_define;

		domload = data.substring(data.indexOf('/*domload*/'));

		domload = domload.sub("document.observe('dom:loaded',function(){",'');
		domload = domload.sub('document.observe("dom:loaded",function(){','');
		domload = domload.sub('/*domload*/\n\n','\n\n\t//'+t+'\n');
		domload = domload.replace(/\n\}\);/,'');
		domload = domload.replace(/\n\}\)/,'');

		domloaded += domload;
	}
	else if( t == "BootStrap.Transition" )
	{
		class_define = data.substring(data.indexOf('var BootStrap'));
		classes += class_define+"\n\n";
	}
	else
	{
		class_define = "//" + t + "\n" + data.substring(data.indexOf('BootStrap.'));
		class_define = class_define.replace(/^\n\n/,"//" + t + "\n");

		classes += class_define+"\n\n";
	}
});

domloaded += '\n});';

if(jshinterrors.length === 0)
{
	fs.writeFileSync('./js/bootstrap_prototype.js',prependlicense + classes + domloaded)

	ClosureCompiler.compile(
		['./js/bootstrap_prototype.js'],
		{
			compilation_level: "SIMPLE_OPTIMIZATIONS",
		},
		function(error, result) {
			if (result) {
				fs.writeFile("./js/bootstrap_prototype.min.js",prependlicense+result)
			} else {
				// Display error...
			}
		}
	);
}
else
{
	console.log("\nJSHINT Errors found\n");
	jshinterrors.each(function(i){
		i.each(function(o){
			console.log("LINE: "+o.line+" CHARACTER: "+o.character+"\nERROR: "+o.reason+"\n"+o.evidence+"\n\n");
			//console.log(o);
		})
	})
}