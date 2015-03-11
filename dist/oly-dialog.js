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
            isModal: "=?modal",
            anchorSelector: "@?anchor"
        },
        link: function link(scope, element, attrs) {
            var dialogName = attrs.olyDialogShow;
            scope.isModal = scope.isModal !== undefined ? scope.isModal : true;

            element.on("click", function () {
                var dialog = dialogRegistry.getDialog(dialogName);

                if (dialog) {
                    scope.$apply(function () {
                        dialog.show(scope.isModal, document.querySelector(scope.anchorSelector));
                    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsbUJBQU8sRUFBRSxTQUFTO0FBQ2xCLDBCQUFjLEVBQUUsVUFBVTtTQUM3QjtBQUNELFlBQUksRUFBQSxjQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLGdCQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ3JDLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUs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ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gZGlhbG9nQ2xvc2UoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHJlcXVpcmU6ICdeZGlhbG9nJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICByZXR1cm5WYWx1ZTogJz0/cmV0dXJuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGRpYWxvZykge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkaWFsb2cuY2xvc2Uoc2NvcGUucmV0dXJuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpYWxvZ1Nob3coZGlhbG9nUmVnaXN0cnkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgaXNNb2RhbDogJz0/bW9kYWwnLFxyXG4gICAgICAgICAgICBhbmNob3JTZWxlY3RvcjogJ0A/YW5jaG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ05hbWUgPSBhdHRycy5vbHlEaWFsb2dTaG93O1xyXG4gICAgICAgICAgICBzY29wZS5pc01vZGFsID0gc2NvcGUuaXNNb2RhbCAhPT0gdW5kZWZpbmVkID8gc2NvcGUuaXNNb2RhbCA6IHRydWU7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpYWxvZyA9IGRpYWxvZ1JlZ2lzdHJ5LmdldERpYWxvZyhkaWFsb2dOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nLnNob3coc2NvcGUuaXNNb2RhbCwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzY29wZS5hbmNob3JTZWxlY3RvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgZGlhbG9nQ2xvc2UsIGRpYWxvZ1Nob3dcclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWFsb2coKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBbJyRlbGVtZW50JywgJyRhdHRycycsICckdHJhbnNjbHVkZScsICckcScsICdEaWFsb2dSZWdpc3RyeScsIGZ1bmN0aW9uKCRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlLCAkcSwgZGlhbG9nUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgZGlhbG9nUmVnaXN0cnkuYWRkRGlhbG9nKHRoaXMsICRhdHRycy5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICR0cmFuc2NsdWRlKChjbG9uZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKGNsb25lKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlhbG9nID0gJGVsZW1lbnRbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAoISgnSFRNTERpYWxvZ0VsZW1lbnQnIGluIHdpbmRvdykgJiYgZGlhbG9nUG9seWZpbGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGJyb3dzZXIgc3VwcG9ydCBub3QgYXZhaWxhYmxlIGFuZCBwb2x5ZmlsbCBpbnN0YWxsZWQsXHJcbiAgICAgICAgICAgICAgICAvLyByZWdpc3RlciB0aGUgZGlhbG9nIHdpdGggdGhlIHBvbHlmaWxsLlxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUG9seWZpbGwucmVnaXN0ZXJEaWFsb2coZGlhbG9nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKGlzTW9kYWwsIGFuY2hvcikge1xyXG4gICAgICAgICAgICAgICAgaXNNb2RhbCA9IGlzTW9kYWwgIT09IHVuZGVmaW5lZCA/IGlzTW9kYWwgOiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZGlhbG9nLm9wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBpc01vZGFsID8gZGlhbG9nLnNob3dNb2RhbChhbmNob3IpIDogZGlhbG9nLnNob3coYW5jaG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlID0gZnVuY3Rpb24ocmV0dXJuVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShyZXR1cm5WYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucmVzb2x2ZShyZXR1cm5WYWx1ZSkgOiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnJlamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cub3BlbjtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UmV0dXJuVmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cucmV0dXJuVmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV1cclxuICAgIH07XHJcbn0iLCJjb25zdCBkZWZhdWx0TmFtZSA9ICdkZWZhdWx0RGlhbG9nJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1JlZ2lzdHJ5IHtcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBBIGdsb2JhbCByZWdpc3RyeSBvZiBkaWFsb2dzIHdoaWNoIGFsbG93cyB0aGVtIHRvIGJlIHJldHJpZXZlZFxyXG4gICAgLy8vIGFuZCBjb250cm9sbGVkIGZyb20gQ29udHJvbGxlcnMvU2VydmljZXMuXHJcbiAgICAvLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgZGlhbG9nLCB0aGUgbmFtZSBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbC5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREaWFsb2coZGlhbG9nLCBuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdID0gZGlhbG9nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2cobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlhbG9ncygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsb2dzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IGRpYWxvZyBmcm9tICcuL2RpYWxvZy1kaXJlY3RpdmUnO1xyXG5pbXBvcnQge2RpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93fSBmcm9tICcuL2RpYWxvZy1hY3Rpb24tZGlyZWN0aXZlcyc7XHJcbmltcG9ydCBEaWFsb2dSZWdpc3RyeSBmcm9tICcuL2RpYWxvZy1yZWdpc3RyeSc7XHJcblxyXG5sZXQgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29seS5kaWFsb2cnLCBbXSk7XHJcblxyXG5tb2R1bGUuc2VydmljZSgnRGlhbG9nUmVnaXN0cnknLCBbRGlhbG9nUmVnaXN0cnldKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ2RpYWxvZycsIFtkaWFsb2ddKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ0Nsb3NlJywgW2RpYWxvZ0Nsb3NlXSk7XHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ1Nob3cnLCBbJ0RpYWxvZ1JlZ2lzdHJ5JywgZGlhbG9nU2hvd10pO1xyXG4iXX0=
