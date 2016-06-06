function dialogClose() {
    return {
        restrict: 'EA',
        require: '^dialog',
        scope: {
            returnValue: '=?return',
        },
        link(scope, element, attrs, dialog) {
            element.on('click', () => {
                scope.$apply(() => {
                    dialog.close(scope.returnValue);
                });
            });
        },
    };
}

function dialogShow(dialogRegistry) {
    return {
        restrict: 'EA',
        scope: {
            dialogName: '@olyDialogShow',
            isModal: '=?modal',
            anchorSelector: '@?anchor',
        },
        link(scope, element) {
            scope.isModal = scope.isModal !== undefined ? scope.isModal : true;

            element.on('click', () => {
                const dialog = dialogRegistry.getDialog(scope.dialogName);

                if (dialog) {
                    scope.$apply(() => {
                        dialog.show(scope.isModal, document.querySelector(scope.anchorSelector));
                    });
                }
            });
        },
    };
}

export { dialogClose, dialogShow };
