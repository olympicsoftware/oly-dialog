var module = angular.module('oly.dialog', []);

var defaultName = 'defaultDialog';

function DialogRegistry() {
    /// <summary>
    /// A global registry of dialogs which allows them to be retrieved
    /// and controlled from Controllers/Services.
    /// If there is only one dialog, the name parameters are optional.
    /// </summary>
    this.dialogs = {};
}

DialogRegistry.prototype.addDialog = function(dialog, name) {
    this.dialogs[name || defaultName] = dialog;
};

DialogRegistry.prototype.removeDialog = function(name) {
    delete this.dialogs[name || defaultName];
};

DialogRegistry.prototype.getDialog = function(name) {
    return this.dialogs[name || defaultName];
};

DialogRegistry.prototype.getDialogs = function() {
    return this.dialogs;
};

module.service('DialogRegistry', [DialogRegistry]);

module.directive('olyDialog', [function() {
    return {
        restrict: 'E',
        transclude: true,
        controller: ['$element', '$attrs', 'DialogRegistry', function($element, $attrs, dialogRegistry) {
            dialogRegistry.addDialog(this, $attrs.name);
            var dialog = $element.find('dialog')[0];

            this.show = dialog.show.bind(dialog);
            this.showModal = dialog.showModal.bind(dialog);
            this.close = dialog.close.bind(dialog);

            this.isOpen = function() {
                return dialog.open;
            };

            this.getReturnValue = function() {
                return dialog.returnValue;
            };
        }],
        template: '<dialog><ng-transclude></ng-transclude></dialog>'
    };
}]);

module.directive('olyDialogClose', [function () {
    return {
        restrict: 'EA',
        require: '^olyDialog',
        link: function(scope, element, attrs, dialog) {
            element.on('click', function() {
                dialog.close();
            });
        }
    };
}]);

function showDialogButton(mode) {
    return function(dialogRegistry) {
        return {
            restrict: 'EA',
            scope: {
                'dialogName': '@for',
                'anchorElement': '=?anchor'
            },
            link: function(scope, element) {
                var dialog = dialogRegistry.getDialog(scope.dialogName);

                element.on('click', function() {
                    dialog[mode].call(dialog, scope.anchorElement);
                });
            }
        };
    };
}

module.directive('olyDialogShow', ['DialogRegistry', showDialogButton('show')]);
module.directive('olyDialogShowModal', ['DialogRegistry', showDialogButton('showModal')]);