# Angular wrapper for `<dialog>` elements

Lets you use and control `<dialog>` elements from your Angular code.

`<dialog>` provides a browser native way to show both modal and
non-modal dialogs, which may optionally return a value. `<dialog>` is a part
of the HTML5.1 spec. For more information on the `<dialog>` element, see this 
[blog post by treehouse](http://blog.teamtreehouse.com/a-preview-of-the-new-dialog-element).

If you need to support browsers that haven't yet implemented `<dialog>`,
consider using [Google's excellent dialog polyfill](https://github.com/GoogleChrome/dialog-polyfill).
This directive will detect that the polyfill is installed and automatically
register `<dialog>` elements for you.

## Installation

```javascript
npm install --save oly-dialog
```

Once you have installed oly-dialog, include it in your project however you like,
e.g. with browserify or by including dist/oly-dialog.js on your page.

Then, add oly-dialog to the dependencies of your angular module.

### Node/Browserify
```javascript
var olyDialog = require('oly-dialog');

angular.module('yourApp', [olyDialog]);
```

### Others
```javascript
angular.module('yourApp', ['oly.dialog']);
```

## Usage

### Dialog

You can use an oly-dialog just like you would use a regular dialog.

```html
<dialog>
    <!-- your content here -->
</dialog>
```

Content is transcluded and has access to the scope which the dialog is
created in.

You can access the controller for the dialog from angular code by `require`ing
it from a child directive like so:

```javascript
module.directive('yourDirective', function() {
    return {
        require: '^dialog',
        link: function(scope, element, attrs, dialogCtrl) {
            // your directive
        }
    };
});
```

Alternatively, you can provide a name for your dialog. You can then use this
name to get a reference to the dialog controller from the `DialogRegistry`.

```html
<dialog name="dialog name">
    <!-- your content here -->
</dialog>
```

```javascript
module.service('YourService', ['DialogRegistry', function(dialogRegistry) {
    var dialogCtrl = dialogRegistry.getDialog('dialog name');
}]);
```

The name can be a regular attribute or an Angular expression.

### Showing the Dialog

#### From Code

If you have access to the dialog controller, you can use it to show the dialog.
The `show()` method returns a promise which will resolve with the return value
set when the dialog is closed. If no return value is provided, the promise will
reject.

```javascript
dialogCtrl.show()
    .then(function(returnValue) {
        // do something with return value
    })
    .catch(function() {
        // do something if value not specified
    })
    .finally(function() {
        // always do something when the dialog is closed
    });
```

The `show` method is defined as such:
`show([modal], [anchor])`

| Argument                            | Type                  | Description                                                                              |
|-------------------------------------|-----------------------|------------------------------------------------------------------------------------------|
| `modal` (optional)                  | (bool) default: true  | if true, the dialog will be modal (prevent interaction with other elements on the page). |
| `anchor` (optional)                 | Element or MouseEvent | the anchor for the dialog (not currently implemented in browsers).                       |

#### From a Template

Showing the dialog can also be achieved with the `oly-dialog-show` directive,
which can be used either as an element or an attribute.

```html
<oly-dialog-show for="dialog name" modal="true" anchor=".anchor-selector"></oly-dialog-show>
```

The modal and anchor attributes are optional. The anchor is given as a selector.
If the selector matches multiple DOM elements, the first match is used as the
anchor.

### Closing the Dialog

#### From Code

The dialog controller can also be used to close the dialog.

```javascript
dialogCtrl.close(returnValue);
```

The `returnValue` is optional and is the value that is used to resolve the
promise returned by the `show()` method. If no `returnValue` is specified then
the promise is rejected.

#### From a Template

Closing the dialog can also be achieved using the `oly-dialog-close` directive,
which can be used either as an element or an attribute. This directive must be
used as a child of the `<dialog>` element.

```html
<oly-dialog-close return="expression"></oly-dialog-close>
```

The `return` attribute is bound to the expression given and will be used as the
returnValue for the `close()` method.

### Events

#### $dialogShow

Type: emit

Target: dialog containing scope

Arguments: dialog controller instance

#### $dialogClose

Type: emit

Target: dialog containing scope

Arguments: dialog controller instance

