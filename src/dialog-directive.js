export default function dialog() {
    return {
        restrict: 'E',
        transclude: true,
        controller: ['$element', '$attrs', '$transclude', '$q', 'DialogRegistry', function($element, $attrs, $transclude, $q, dialogRegistry) {
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
            this.show = function(modal, anchor) {
                modal = modal !== undefined ? modal : true;

                if (!dialog.open) {
                    modal ? dialog.showModal(anchor) : dialog.show(anchor);
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
        }]
    };
}