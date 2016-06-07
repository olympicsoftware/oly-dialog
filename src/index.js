import angular from 'angular';

import dialog from './dialog-directive';
import { dialogClose, dialogShow } from './dialog-action-directives';
import DialogRegistry from './dialog-registry';

const dialogModuleName = 'oly.dialog';
const module = angular.module(dialogModuleName, []);

module.service('DialogRegistry', [DialogRegistry]);

module.directive('dialog', [dialog]);

module.directive('olyDialogClose', [dialogClose]);
module.directive('olyDialogShow', ['DialogRegistry', dialogShow]);

export default dialogModuleName;
