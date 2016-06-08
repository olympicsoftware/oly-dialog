import angular from 'angular';

import dialog from './dialog-directive';
import { dialogClose, dialogShow } from './dialog-action-directives';
import DialogRegistry from './dialog-registry';

const dialogModuleName = 'oly.dialog';
const dialogModule = angular.module(dialogModuleName, []);

dialogModule.service('DialogRegistry', [DialogRegistry]);

dialogModule.directive('dialog', [dialog]);

dialogModule.directive('olyDialogClose', [dialogClose]);
dialogModule.directive('olyDialogShow', ['DialogRegistry', dialogShow]);

// We use commonjs export here instead of ES6 because of the way webpack
// exports this as a library.
module.exports = dialogModuleName;
