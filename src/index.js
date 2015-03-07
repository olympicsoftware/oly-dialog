import dialog from './dialog-directive';
import dialogClose from './dialog-close-directive';
import showDialogButton from './dialog-show-directive';
import DialogRegistry from './dialog-registry'

let module = angular.module('oly.dialog', []);

module.service('DialogRegistry', [DialogRegistry]);

module.directive('dialog', [dialog]);

module.directive('olyDialogClose', [dialogClose]);

module.directive('olyDialogShow', ['DialogRegistry', showDialogButton('show')]);
module.directive('olyDialogShowModal', ['DialogRegistry', showDialogButton('showModal')]);