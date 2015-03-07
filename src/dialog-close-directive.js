export default function dialogClose() {
    return {
        restrict: 'EA',
        require: '^dialog',
        scope: {
            onClose: '&?',
            returnValue: '=?return'
        },
        link(scope, element, attrs, dialog) {
            element.on('click', function() {
                scope.$apply(() => {
                    if (scope.onClose) {
                        scope.onClose();
                    }

                    dialog.close(scope.returnValue);
                });
            });
        }
    };
}