export default function showDialogButton(mode) {
    return function(dialogRegistry) {
        return {
            restrict: 'EA',
            scope: {
                dialogName: '@for',
                onShow: '&?',
                anchorSelector: '@?anchor'
            },
            link(scope, element) {
                let dialog = dialogRegistry.getDialog(scope.dialogName);

                element.on('click', function() {
                    if (scope.onShow) {
                        scope.onShow();
                    }

                    dialog[mode].call(dialog, document.querySelector(scope.anchorSelector));
                });
            }
        };
    };
}