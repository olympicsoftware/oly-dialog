function dialogClose() {
    return {
        restrict: 'EA',
        require: '^dialog',
        scope: {
            returnValue: '=?return'
        },
        link(scope, element, attrs, dialog) {
            element.on('click', function() {
                scope.$apply(() => {
                    dialog.close(scope.returnValue);
                });
            });
        }
    };
}

function showDialogButton(dialogRegistry) {
    return {
        restrict: 'EA',
        scope: {
            dialogName: '@for',
            modal: '=?',
            anchorSelector: '@?anchor'
        },
        link(scope, element) {
            scope.modal = scope.modal !== undefined ? scope.modal : true;

            element.on('click', function() {
                let dialog = dialogRegistry.getDialog(scope.dialogName);

                if (dialog) {
                   dialog.show(scope.modal, document.querySelector(scope.anchorSelector));
                }
            });
        }
    };
}

export {dialogClose, showDialogButton};