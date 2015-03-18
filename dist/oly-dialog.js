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
        controller: ["$scope", "$element", "$attrs", "$transclude", "$q", "DialogRegistry", function ($scope, $element, $attrs, $transclude, $q, dialogRegistry) {
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

            $scope.$on("$destroy", function () {
                this.close();

                dialogRegistry.removeDialog($attrs.name);
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsbUJBQU8sRUFBRSxTQUFTO0FBQ2xCLDBCQUFjLEVBQUUsVUFBVTtTQUM3QjtBQUNELFlBQUksRUFBQSxjQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLGdCQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ3JDLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUs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LGdCQUFnQixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUNsRCxPQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gZGlhbG9nQ2xvc2UoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHJlcXVpcmU6ICdeZGlhbG9nJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICByZXR1cm5WYWx1ZTogJz0/cmV0dXJuJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGRpYWxvZykge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkaWFsb2cuY2xvc2Uoc2NvcGUucmV0dXJuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpYWxvZ1Nob3coZGlhbG9nUmVnaXN0cnkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgaXNNb2RhbDogJz0/bW9kYWwnLFxyXG4gICAgICAgICAgICBhbmNob3JTZWxlY3RvcjogJ0A/YW5jaG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ05hbWUgPSBhdHRycy5vbHlEaWFsb2dTaG93O1xyXG4gICAgICAgICAgICBzY29wZS5pc01vZGFsID0gc2NvcGUuaXNNb2RhbCAhPT0gdW5kZWZpbmVkID8gc2NvcGUuaXNNb2RhbCA6IHRydWU7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpYWxvZyA9IGRpYWxvZ1JlZ2lzdHJ5LmdldERpYWxvZyhkaWFsb2dOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nLnNob3coc2NvcGUuaXNNb2RhbCwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzY29wZS5hbmNob3JTZWxlY3RvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQge1xyXG4gICAgZGlhbG9nQ2xvc2UsIGRpYWxvZ1Nob3dcclxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWFsb2coKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCAnJHRyYW5zY2x1ZGUnLCAnJHEnLCAnRGlhbG9nUmVnaXN0cnknLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlLCAkcSwgZGlhbG9nUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgZGlhbG9nUmVnaXN0cnkuYWRkRGlhbG9nKHRoaXMsICRhdHRycy5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICR0cmFuc2NsdWRlKChjbG9uZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKGNsb25lKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlhbG9nID0gJGVsZW1lbnRbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAoISgnSFRNTERpYWxvZ0VsZW1lbnQnIGluIHdpbmRvdykgJiYgZGlhbG9nUG9seWZpbGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGJyb3dzZXIgc3VwcG9ydCBub3QgYXZhaWxhYmxlIGFuZCBwb2x5ZmlsbCBpbnN0YWxsZWQsXHJcbiAgICAgICAgICAgICAgICAvLyByZWdpc3RlciB0aGUgZGlhbG9nIHdpdGggdGhlIHBvbHlmaWxsLlxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUG9seWZpbGwucmVnaXN0ZXJEaWFsb2coZGlhbG9nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKGlzTW9kYWwsIGFuY2hvcikge1xyXG4gICAgICAgICAgICAgICAgaXNNb2RhbCA9IGlzTW9kYWwgIT09IHVuZGVmaW5lZCA/IGlzTW9kYWwgOiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZGlhbG9nLm9wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBpc01vZGFsID8gZGlhbG9nLnNob3dNb2RhbChhbmNob3IpIDogZGlhbG9nLnNob3coYW5jaG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlID0gZnVuY3Rpb24ocmV0dXJuVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShyZXR1cm5WYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucmVzb2x2ZShyZXR1cm5WYWx1ZSkgOiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnJlamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cub3BlbjtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UmV0dXJuVmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cucmV0dXJuVmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkaWFsb2dSZWdpc3RyeS5yZW1vdmVEaWFsb2coJGF0dHJzLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XVxyXG4gICAgfTtcclxufSIsImNvbnN0IGRlZmF1bHROYW1lID0gJ2RlZmF1bHREaWFsb2cnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nUmVnaXN0cnkge1xyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIEEgZ2xvYmFsIHJlZ2lzdHJ5IG9mIGRpYWxvZ3Mgd2hpY2ggYWxsb3dzIHRoZW0gdG8gYmUgcmV0cmlldmVkXHJcbiAgICAvLy8gYW5kIGNvbnRyb2xsZWQgZnJvbSBDb250cm9sbGVycy9TZXJ2aWNlcy5cclxuICAgIC8vLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBkaWFsb2csIHRoZSBuYW1lIHBhcmFtZXRlcnMgYXJlIG9wdGlvbmFsLlxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZGlhbG9ncyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZERpYWxvZyhkaWFsb2csIG5hbWUpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV0gPSBkaWFsb2c7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRGlhbG9nKG5hbWUpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2dzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgZGlhbG9nIGZyb20gJy4vZGlhbG9nLWRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7ZGlhbG9nQ2xvc2UsIGRpYWxvZ1Nob3d9IGZyb20gJy4vZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzJztcclxuaW1wb3J0IERpYWxvZ1JlZ2lzdHJ5IGZyb20gJy4vZGlhbG9nLXJlZ2lzdHJ5JztcclxuXHJcbmxldCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnb2x5LmRpYWxvZycsIFtdKTtcclxuXHJcbm1vZHVsZS5zZXJ2aWNlKCdEaWFsb2dSZWdpc3RyeScsIFtEaWFsb2dSZWdpc3RyeV0pO1xyXG5cclxubW9kdWxlLmRpcmVjdGl2ZSgnZGlhbG9nJywgW2RpYWxvZ10pO1xyXG5cclxubW9kdWxlLmRpcmVjdGl2ZSgnb2x5RGlhbG9nQ2xvc2UnLCBbZGlhbG9nQ2xvc2VdKTtcclxubW9kdWxlLmRpcmVjdGl2ZSgnb2x5RGlhbG9nU2hvdycsIFsnRGlhbG9nUmVnaXN0cnknLCBkaWFsb2dTaG93XSk7XHJcbiJdfQ==
