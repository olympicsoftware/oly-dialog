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

function dialogShow(dialogRegistry) {
    return {
        restrict: 'EA',
        scope: {
            dialogName: '@olyDialogShow',
            isModal: '=?modal',
            anchorSelector: '@?anchor'
        },
        link(scope, element, attrs) {
            scope.isModal = scope.isModal !== undefined ? scope.isModal : true;

            element.on('click', function() {
                let dialog = dialogRegistry.getDialog(scope.dialogName);

                if (dialog) {
                    scope.$apply(() => {
                        dialog.show(scope.isModal, document.querySelector(scope.anchorSelector));
                    });
                }
            });
        }
    };
}

export {
    dialogClose, dialogShow
};