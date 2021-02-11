/*
  @license
	Rollup.js v2.38.4
	Tue, 02 Feb 2021 05:54:38 GMT - commit 991bb98fad1f3f76226bfe6243fd6cc45a19a39b


	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

var loadConfigFile_js = require('./shared/loadConfigFile.js');
require('fs');
require('path');
require('url');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('crypto');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
