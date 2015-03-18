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
            var _this = this;

            dialogRegistry.addDialog(this, $attrs.name);

            $transclude(function (clone) {
                $element.append(clone);
            });

            // While the dialog is not implemented in browsers, it should exist
            // as a child of the body element.
            if ($element[0].parentElement !== document.body) {
                document.body.appendChild($element.detach()[0]);
            }

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
                _this.close();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsbUJBQU8sRUFBRSxTQUFTO0FBQ2xCLDBCQUFjLEVBQUUsVUFBVTtTQUM3QjtBQUNELFlBQUksRUFBQSxjQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLGdCQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ3JDLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUs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Qzs7QUFFOUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7O0FBRW5ELE9BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsT0FBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsT0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGRpYWxvZ0Nsb3NlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICByZXF1aXJlOiAnXmRpYWxvZycsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWU6ICc9P3JldHVybidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBkaWFsb2cpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlhbG9nLmNsb3NlKHNjb3BlLnJldHVyblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaWFsb2dTaG93KGRpYWxvZ1JlZ2lzdHJ5KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIGlzTW9kYWw6ICc9P21vZGFsJyxcclxuICAgICAgICAgICAgYW5jaG9yU2VsZWN0b3I6ICdAP2FuY2hvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2dOYW1lID0gYXR0cnMub2x5RGlhbG9nU2hvdztcclxuICAgICAgICAgICAgc2NvcGUuaXNNb2RhbCA9IHNjb3BlLmlzTW9kYWwgIT09IHVuZGVmaW5lZCA/IHNjb3BlLmlzTW9kYWwgOiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkaWFsb2cgPSBkaWFsb2dSZWdpc3RyeS5nZXREaWFsb2coZGlhbG9nTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZy5zaG93KHNjb3BlLmlzTW9kYWwsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2NvcGUuYW5jaG9yU2VsZWN0b3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuICAgIGRpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93XHJcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlhbG9nKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgJyR0cmFuc2NsdWRlJywgJyRxJywgJ0RpYWxvZ1JlZ2lzdHJ5JywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSwgJHEsIGRpYWxvZ1JlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIGRpYWxvZ1JlZ2lzdHJ5LmFkZERpYWxvZyh0aGlzLCAkYXR0cnMubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkdHJhbnNjbHVkZSgoY2xvbmUpID0+IHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZChjbG9uZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hpbGUgdGhlIGRpYWxvZyBpcyBub3QgaW1wbGVtZW50ZWQgaW4gYnJvd3NlcnMsIGl0IHNob3VsZCBleGlzdFxyXG4gICAgICAgICAgICAvLyBhcyBhIGNoaWxkIG9mIHRoZSBib2R5IGVsZW1lbnQuXHJcbiAgICAgICAgICAgIGlmICgkZWxlbWVudFswXS5wYXJlbnRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCRlbGVtZW50LmRldGFjaCgpWzBdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGRpYWxvZyA9ICRlbGVtZW50WzBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEoJ0hUTUxEaWFsb2dFbGVtZW50JyBpbiB3aW5kb3cpICYmIGRpYWxvZ1BvbHlmaWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBicm93c2VyIHN1cHBvcnQgbm90IGF2YWlsYWJsZSBhbmQgcG9seWZpbGwgaW5zdGFsbGVkLFxyXG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXIgdGhlIGRpYWxvZyB3aXRoIHRoZSBwb2x5ZmlsbC5cclxuICAgICAgICAgICAgICAgIGRpYWxvZ1BvbHlmaWxsLnJlZ2lzdGVyRGlhbG9nKGRpYWxvZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbihpc01vZGFsLCBhbmNob3IpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9kYWwgPSBpc01vZGFsICE9PSB1bmRlZmluZWQgPyBpc01vZGFsIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWRpYWxvZy5vcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNNb2RhbCA/IGRpYWxvZy5zaG93TW9kYWwoYW5jaG9yKSA6IGRpYWxvZy5zaG93KGFuY2hvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKHJldHVyblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBkaWFsb2cuY2xvc2UocmV0dXJuVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVyblZhbHVlICE9PSB1bmRlZmluZWQgPyB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnJlc29sdmUocmV0dXJuVmFsdWUpIDogdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZC5yZWplY3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkID0gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaXNPcGVuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlhbG9nLm9wZW47XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldFJldHVyblZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlhbG9nLnJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUmVnaXN0cnkucmVtb3ZlRGlhbG9nKCRhdHRycy5uYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfV1cclxuICAgIH07XHJcbn0iLCJjb25zdCBkZWZhdWx0TmFtZSA9ICdkZWZhdWx0RGlhbG9nJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1JlZ2lzdHJ5IHtcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBBIGdsb2JhbCByZWdpc3RyeSBvZiBkaWFsb2dzIHdoaWNoIGFsbG93cyB0aGVtIHRvIGJlIHJldHJpZXZlZFxyXG4gICAgLy8vIGFuZCBjb250cm9sbGVkIGZyb20gQ29udHJvbGxlcnMvU2VydmljZXMuXHJcbiAgICAvLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgZGlhbG9nLCB0aGUgbmFtZSBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbC5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREaWFsb2coZGlhbG9nLCBuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdID0gZGlhbG9nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2cobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlhbG9ncygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsb2dzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IGRpYWxvZyBmcm9tICcuL2RpYWxvZy1kaXJlY3RpdmUnO1xyXG5pbXBvcnQge2RpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93fSBmcm9tICcuL2RpYWxvZy1hY3Rpb24tZGlyZWN0aXZlcyc7XHJcbmltcG9ydCBEaWFsb2dSZWdpc3RyeSBmcm9tICcuL2RpYWxvZy1yZWdpc3RyeSc7XHJcblxyXG5sZXQgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29seS5kaWFsb2cnLCBbXSk7XHJcblxyXG5tb2R1bGUuc2VydmljZSgnRGlhbG9nUmVnaXN0cnknLCBbRGlhbG9nUmVnaXN0cnldKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ2RpYWxvZycsIFtkaWFsb2ddKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ0Nsb3NlJywgW2RpYWxvZ0Nsb3NlXSk7XHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ1Nob3cnLCBbJ0RpYWxvZ1JlZ2lzdHJ5JywgZGlhbG9nU2hvd10pO1xyXG4iXX0=
