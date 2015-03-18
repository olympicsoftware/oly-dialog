export default function dialog() {
    return {
        restrict: 'E',
        transclude: true,
        controller: ['$scope', '$element', '$attrs', '$transclude', '$q', 'DialogRegistry', function($scope, $element, $attrs, $transclude, $q, dialogRegistry) {
            dialogRegistry.addDialog(this, $attrs.name);

            $transclude((clone) => {
                $element.append(clone);
            });

            let dialog = $element[0];

            if (!('HTMLDialogElement' in window) && dialogPolyfill) {
                // If browser support not available and polyfill installed,
                // register the dialog with the polyfill.
                dialogPolyfill.registerDialog(dialog);
            }

            this.dialogReturnDeffered = null;
            this.show = function(isModal, anchor) {
                isModal = isModal !== undefined ? isModal : true;

                if (!dialog.open) {
                    isModal ? dialog.showModal(anchor) : dialog.show(anchor);
                }

                this.dialogReturnDeffered = $q.defer();
                return this.dialogReturnDeffered.promise;
            };

            this.close = function(returnValue) {
                dialog.close(returnValue);

                returnValue !== undefined ? this.dialogReturnDeffered.resolve(returnValue) : this.dialogReturnDeffered.reject();

                this.dialogReturnDeffered = null;
            };

            this.isOpen = function() {
                return dialog.open;
            };

            this.getReturnValue = function() {
                return dialog.returnValue;
            };

            $scope.$on('$destroy', function() {
                this.close();
                
                dialogRegistry.removeDialog($attrs.name);
            });
        }]
    };
}