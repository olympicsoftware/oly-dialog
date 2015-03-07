export default function dialog() {
    return {
        restrict: 'E',
        transclude: true,
        controller: ['$element', '$attrs', '$transclude', 'DialogRegistry', function($element, $attrs, $transclude, dialogRegistry) {
            dialogRegistry.addDialog(this, $attrs.name);

            $transclude((clone) => {
                $element.append(clone);
            });

            let dialog = $element[0];

            this.show = dialog.show.bind(dialog);
            this.showModal = dialog.showModal.bind(dialog);
            this.close = dialog.close.bind(dialog);

            this.isOpen = function() {
                return dialog.open;
            };

            this.getReturnValue = function() {
                return dialog.returnValue;
            };
        }]
    };
}