(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

function dialogClose() {
    return {
        restrict: "EA",
        require: "^dialog",
        scope: {
            returnValue: "=?return"
        },
        link: function link(scope, element, attrs, dialog) {
            element.on("click", function () {
                scope.$apply(function () {
                    dialog.close(scope.returnValue);
                });
            });
        }
    };
}

function dialogShow(dialogRegistry) {
    return {
        restrict: "EA",
        scope: {
            dialogName: "@for",
            isModal: "=?modal",
            anchorSelector: "@?anchor"
        },
        link: function link(scope, element) {
            scope.isModal = scope.isModal !== undefined ? scope.isModal : true;

            element.on("click", function () {
                var dialog = dialogRegistry.getDialog(scope.dialogName);

                if (dialog) {
                    dialog.show(scope.isModal, document.querySelector(scope.anchorSelector));
                }
            });
        }
    };
}

exports.dialogClose = dialogClose;
exports.dialogShow = dialogShow;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],2:[function(_dereq_,module,exports){
"use strict";

module.exports = dialog;

function dialog() {
    return {
        restrict: "E",
        transclude: true,
        controller: ["$element", "$attrs", "$transclude", "$q", "DialogRegistry", function ($element, $attrs, $transclude, $q, dialogRegistry) {
            dialogRegistry.addDialog(this, $attrs.name);

            $transclude(function (clone) {
                $element.append(clone);
            });

            var dialog = $element[0];

            if (!("HTMLDialogElement" in window) && dialogPolyfill) {
                // If browser support not available and polyfill installed,
                // register the dialog with the polyfill.
                dialogPolyfill.registerDialog(dialog);
            }

            this.dialogReturnDeffered = null;
            this.show = function (isModal, anchor) {
                isModal = isModal !== undefined ? isModal : true;

                if (!dialog.open) {
                    isModal ? dialog.showModal(anchor) : dialog.show(anchor);
                }

                this.dialogReturnDeffered = $q.defer();
                return this.dialogReturnDeffered.promise;
            };

            this.close = function (returnValue) {
                dialog.close(returnValue);

                returnValue !== undefined ? this.dialogReturnDeffered.resolve(returnValue) : this.dialogReturnDeffered.reject();

                this.dialogReturnDeffered = null;
            };

            this.isOpen = function () {
                return dialog.open;
            };

            this.getReturnValue = function () {
                return dialog.returnValue;
            };
        }]
    };
}

},{}],3:[function(_dereq_,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var defaultName = "defaultDialog";

var DialogRegistry = (function () {
    /// <summary>
    /// A global registry of dialogs which allows them to be retrieved
    /// and controlled from Controllers/Services.
    /// If there is only one dialog, the name parameters are optional.
    /// </summary>

    function DialogRegistry() {
        _classCallCheck(this, DialogRegistry);

        this.dialogs = {};
    }

    _createClass(DialogRegistry, {
        addDialog: {
            value: function addDialog(dialog, name) {
                this.dialogs[name || defaultName] = dialog;
            }
        },
        removeDialog: {
            value: function removeDialog(name) {
                delete this.dialogs[name || defaultName];
            }
        },
        getDialog: {
            value: function getDialog(name) {
                return this.dialogs[name || defaultName];
            }
        },
        getDialogs: {
            value: function getDialogs() {
                return this.dialogs;
            }
        }
    });

    return DialogRegistry;
})();

module.exports = DialogRegistry;

},{}],4:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var dialog = _interopRequire(_dereq_("./dialog-directive"));

var _dialogActionDirectives = _dereq_("./dialog-action-directives");

var dialogClose = _dialogActionDirectives.dialogClose;
var dialogShow = _dialogActionDirectives.dialogShow;

var DialogRegistry = _interopRequire(_dereq_("./dialog-registry"));

var _module = angular.module("oly.dialog", []);

_module.service("DialogRegistry", [DialogRegistry]);

_module.directive("dialog", [dialog]);

_module.directive("olyDialogClose", [dialogClose]);
_module.directive("olyDialogShow", ["DialogRegistry", dialogShow]);

},{"./dialog-action-directives":1,"./dialog-directive":2,"./dialog-registry":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsc0JBQVUsRUFBRSxNQUFNO0FBQ2xCLG1CQUFPLEVBQUUsU0FBUztBQUNsQiwwQkFBYyxFQUFFLFVBQVU7U0FDN0I7QUFDRCxZQUFJLEVBQUEsY0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ2pCLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQixvQkFB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SSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLEdBQUcsTUFBTSxDQUFDO2FBQzlDOztBQUVELG9CQUFZO21CQUFBLHNCQUFDLElBQUksRUFBRTtBQUNmLHVCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFDO2FBQzVDOztBQUVELGlCQUFTO21CQUFBLG1CQUFDLElBQUksRUFBRTtBQUNaLHVCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFDO2FBQzVDOztBQUVELGtCQUFVO21CQUFBLHNCQUFHO0FBQ1QsdUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUN2Qjs7OztXQXhCZ0IsY0FBYzs7O2lCQUFkLGNBQWM7Ozs7Ozs7SUNGNUIsTUFBTSwyQkFBTSxvQkFBb0I7O3NDQUNELDRCQUE0Qjs7SUFBMUQsV0FBVywyQkFBWCxXQUFXO0lBQUUsVUFBVSwyQkFBVixVQUFVOztJQUN4QixjQUFjLDJCQUFNLG1CQUFtQjs7QUFFOUMsSUFBSSxPQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTlDLE9BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOztBQUVuRCxPQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRXJDLE9BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ2xELE9BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBkaWFsb2dDbG9zZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgcmVxdWlyZTogJ15kaWFsb2cnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlOiAnPT9yZXR1cm4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZGlhbG9nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShzY29wZS5yZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlhbG9nU2hvdyhkaWFsb2dSZWdpc3RyeSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICBkaWFsb2dOYW1lOiAnQGZvcicsXHJcbiAgICAgICAgICAgIGlzTW9kYWw6ICc9P21vZGFsJyxcclxuICAgICAgICAgICAgYW5jaG9yU2VsZWN0b3I6ICdAP2FuY2hvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgc2NvcGUuaXNNb2RhbCA9IHNjb3BlLmlzTW9kYWwgIT09IHVuZGVmaW5lZCA/IHNjb3BlLmlzTW9kYWwgOiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkaWFsb2cgPSBkaWFsb2dSZWdpc3RyeS5nZXREaWFsb2coc2NvcGUuZGlhbG9nTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgICAgZGlhbG9nLnNob3coc2NvcGUuaXNNb2RhbCwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzY29wZS5hbmNob3JTZWxlY3RvcikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQge2RpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93fTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWFsb2coKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBbJyRlbGVtZW50JywgJyRhdHRycycsICckdHJhbnNjbHVkZScsICckcScsICdEaWFsb2dSZWdpc3RyeScsIGZ1bmN0aW9uKCRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlLCAkcSwgZGlhbG9nUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgZGlhbG9nUmVnaXN0cnkuYWRkRGlhbG9nKHRoaXMsICRhdHRycy5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICR0cmFuc2NsdWRlKChjbG9uZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKGNsb25lKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlhbG9nID0gJGVsZW1lbnRbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAoISgnSFRNTERpYWxvZ0VsZW1lbnQnIGluIHdpbmRvdykgJiYgZGlhbG9nUG9seWZpbGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGJyb3dzZXIgc3VwcG9ydCBub3QgYXZhaWxhYmxlIGFuZCBwb2x5ZmlsbCBpbnN0YWxsZWQsXHJcbiAgICAgICAgICAgICAgICAvLyByZWdpc3RlciB0aGUgZGlhbG9nIHdpdGggdGhlIHBvbHlmaWxsLlxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUG9seWZpbGwucmVnaXN0ZXJEaWFsb2coZGlhbG9nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKGlzTW9kYWwsIGFuY2hvcikge1xyXG4gICAgICAgICAgICAgICAgaXNNb2RhbCA9IGlzTW9kYWwgIT09IHVuZGVmaW5lZCA/IGlzTW9kYWwgOiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZGlhbG9nLm9wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBpc01vZGFsID8gZGlhbG9nLnNob3dNb2RhbChhbmNob3IpIDogZGlhbG9nLnNob3coYW5jaG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlID0gZnVuY3Rpb24ocmV0dXJuVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShyZXR1cm5WYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucmVzb2x2ZShyZXR1cm5WYWx1ZSkgOiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnJlamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cub3BlbjtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UmV0dXJuVmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cucmV0dXJuVmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV1cclxuICAgIH07XHJcbn0iLCJjb25zdCBkZWZhdWx0TmFtZSA9ICdkZWZhdWx0RGlhbG9nJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1JlZ2lzdHJ5IHtcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBBIGdsb2JhbCByZWdpc3RyeSBvZiBkaWFsb2dzIHdoaWNoIGFsbG93cyB0aGVtIHRvIGJlIHJldHJpZXZlZFxyXG4gICAgLy8vIGFuZCBjb250cm9sbGVkIGZyb20gQ29udHJvbGxlcnMvU2VydmljZXMuXHJcbiAgICAvLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgZGlhbG9nLCB0aGUgbmFtZSBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbC5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREaWFsb2coZGlhbG9nLCBuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdID0gZGlhbG9nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2cobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlhbG9ncygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsb2dzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IGRpYWxvZyBmcm9tICcuL2RpYWxvZy1kaXJlY3RpdmUnO1xyXG5pbXBvcnQge2RpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93fSBmcm9tICcuL2RpYWxvZy1hY3Rpb24tZGlyZWN0aXZlcyc7XHJcbmltcG9ydCBEaWFsb2dSZWdpc3RyeSBmcm9tICcuL2RpYWxvZy1yZWdpc3RyeSc7XHJcblxyXG5sZXQgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29seS5kaWFsb2cnLCBbXSk7XHJcblxyXG5tb2R1bGUuc2VydmljZSgnRGlhbG9nUmVnaXN0cnknLCBbRGlhbG9nUmVnaXN0cnldKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ2RpYWxvZycsIFtkaWFsb2ddKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ0Nsb3NlJywgW2RpYWxvZ0Nsb3NlXSk7XHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ1Nob3cnLCBbJ0RpYWxvZ1JlZ2lzdHJ5JywgZGlhbG9nU2hvd10pO1xyXG4iXX0=
