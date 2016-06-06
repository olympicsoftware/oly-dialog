export default function dialogDirective() {
    return {
        restrict: 'E',
        transclude: true,
        controller: [
            '$scope',
            '$element',
            '$attrs',
            '$transclude',
            '$q',
            '$interpolate',
            'DialogRegistry',
            function ($scope, $element, $attrs, $transclude, $q, $interpolate, dialogRegistry) {
                this.name = $interpolate($attrs.name)($scope);

                dialogRegistry.addDialog(this, this.name);

                $transclude((clone) => {
                    $element.append(clone);
                });

                // While the dialog is not implemented in browsers, it should exist
                // as a child of the body element.
                if ($element[0].parentElement !== document.body) {
                    document.body.appendChild($element.detach()[0]);
                }

                const dialog = $element[0];

                if (!('HTMLDialogElement' in window) && window.dialogPolyfill) {
                    // If browser support not available and polyfill installed,
                    // register the dialog with the polyfill.
                    window.dialogPolyfill.registerDialog(dialog);
                }

                this.dialogReturnDeffered = null;
                this.show = function (isModal, anchor) {
                    if (dialog.open) {
                        return this.dialogReturnDeffered.promise;
                    }

                    isModal = isModal !== undefined ? isModal : true;

                    if (isModal) {
                        dialog.showModal(anchor);
                    } else {
                        dialog.show(anchor);
                    }

                    $scope.$emit('$dialogShow', this);

                    this.dialogReturnDeffered = $q.defer();
                    return this.dialogReturnDeffered.promise;
                };

                this.close = function (returnValue) {
                    if (!this.isOpen()) {
                        return;
                    }

                    dialog.close(returnValue);
                    $scope.$emit('$dialogClose', this);

                    if (this.dialogReturnDeffered) {
                        if (returnValue !== undefined) {
                            this.dialogReturnDeffered.resolve(returnValue);
                        } else {
                            this.dialogReturnDeffered.reject();
                        }
                    }

                    this.dialogReturnDeffered = null;
                };

                this.isOpen = function () {
                    return dialog.open;
                };

                this.getReturnValue = function () {
                    return dialog.returnValue;
                };

                $scope.$on('$destroy', () => {
                    this.close();

                    dialogRegistry.removeDialog(this.name);

                    // We have to manually remove the element because we moved it
                    // to the body.
                    $element.remove();
                });
            }],
    };
}
