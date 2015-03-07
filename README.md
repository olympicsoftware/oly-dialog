# Angular wrapper for `<dialog>` elements

Lets you use and control `<dialog>` elements from your Angular code.

`<dialog>` provides a browser native way to show both modal and
non-modal dialogs, which may optionally return a value. `<dialog>` is a part
of the HTML5.1 spec. For more information on the `<dialog>` element, see this 
[blog post by treehouse](http://blog.teamtreehouse.com/a-preview-of-the-new-dialog-element).

Requires browser support for `<dialog>`. If you need to support browsers that
haven't yet implemented `<dialog>`, consider using
[Google's excellent dialog polyfill](https://github.com/GoogleChrome/dialog-polyfill).

## Installation

`npm install --save oly-dialog`

## Usage

### Dialog

You can use an oly-dialog just like you would use a regular dialog.

```html
<dialog>
    <!-- your content here -->
</dialog>
```

Content is transcluded, so it has access to the scope which the dialog is
created in.

You can access this dialog from angular code by `require`ing it from a child
directive like so:

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

### Showing the Dialog
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
    });
```

The `show` method is defined as such:
`show([modal], [anchor])`

| Argument | Type                  | Description                                                                              |
|----------|-----------------------|------------------------------------------------------------------------------------------|
| `modal`  | (bool)                | if true, the dialog will be modal (prevent interaction with other elements on the page). |
| `anchor` | Element or MouseEvent | the anchor for the dialog.                                                               |

Showing the dialog can also be achieved with the `oly-dialog-show` directive,
which can be used either as an element or an attribute.

```html
<oly-dialog-show for="dialog name" modal="true" anchor=".anchor-selector"></oly-dialog-show>
```

The modal and anchor attributes are optional. The anchor is given as a selector.
If the selector matches multiple DOM elements, the first match is used as the
anchor.

### Closing the Dialog
The dialog controller can also be used to close the dialog.

```javascript
dialogCtrl.close(returnValue);
```

The `returnValue` is optional and is the value that is used to resolve the
promise returned by the `show()` method. If no `returnValue` is specified then
the promise is rejected.

Closing the dialog can also be achieved using the `oly-dialog-close` directive,
which can be used either as an element or an attribute. This directive must be
used as a child of the `<dialog>` element.

```html
<oly-dialog-close return="expression"></oly-dialog-close>
```

The `return` attribute is bound to the expression given and will be used as the
returnValue for the `close()` method.