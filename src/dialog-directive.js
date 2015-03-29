export default function dialog() {
    return {
        restrict: 'E',
        transclude: true,
        controller: ['$scope', '$element', '$attrs', '$transclude', '$q', 'DialogRegistry', function($scope, $element, $attrs, $transclude, $q, dialogRegistry) {
            this.name = $attrs.name;

            dialogRegistry.addDialog(this, this.name);

            $transclude((clone) => {
                $element.append(clone);
            });

            // While the dialog is not implemented in browsers, it should exist
            // as a child of the body element.
            if ($element[0].parentElement !== document.body) {
                document.body.appendChild($element.detach()[0]);
            }

            let dialog = $element[0];

            if (!('HTMLDialogElement' in window) && dialogPolyfill) {
                // If browser support not available and polyfill installed,
                // register the dialog with the polyfill.
                dialogPolyfill.registerDialog(dialog);
            }

            this.dialogReturnDeffered = null;
            this.show = function(isModal, anchor) {
                if (dialog.open) {
                    return;
                }

                isModal = isModal !== undefined ? isModal : true;
                isModal ? dialog.showModal(anchor) : dialog.show(anchor);
                $scope.$emit('dialog:show', this);

                this.dialogReturnDeffered = $q.defer();
                return this.dialogReturnDeffered.promise;
            };

            this.close = function(returnValue) {
                if (!this.isOpen()) {
                    return;
                }

                dialog.close(returnValue);
                $scope.$emit('dialog:close', this);

                if (this.dialogReturnDeffered) {
                    returnValue !== undefined
                        ? this.dialogReturnDeffered.resolve(returnValue) 
                        : this.dialogReturnDeffered.reject();
                }

                this.dialogReturnDeffered = null;
            };

            this.isOpen = function() {
                return dialog.open;
            };

            this.getReturnValue = function() {
                return dialog.returnValue;
            };

            $scope.$on('$destroy', () => {
                this.close();

                dialogRegistry.removeDialog(this.name);

                // We have to manually remove the element because we moved it
                // to the body.
                $element.remove();
            });
        }]
    };
}