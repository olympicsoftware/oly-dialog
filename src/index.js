import dialog from './dialog-directive';
import {dialogClose, showDialogButton} from './dialog-action-directives';
import DialogRegistry from './dialog-registry'

let module = angular.module('oly.dialog', []);

module.service('DialogRegistry', [DialogRegistry]);

module.directive('dialog', [dialog]);

module.directive('olyDialogClose', [dialogClose]);
module.directive('olyDialogShow', ['DialogRegistry', showDialogButton]);
