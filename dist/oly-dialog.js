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
                if (_this.isOpen()) {
                    _this.close();
                }

                dialogRegistry.removeDialog($attrs.name);

                // We have to manually remove the element because we moved it
                // to the body.
                $element.remove();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsbUJBQU8sRUFBRSxTQUFTO0FBQ2xCLDBCQUFjLEVBQUUsVUFBVTtTQUM3QjtBQUNELFlBQUksRUFBQSxjQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLGdCQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ3JDLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUs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LG1CQUFtQjs7QUFFOUMsSUFBSSxPQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTlDLE9BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOztBQUVuRCxPQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRXJDLE9BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ2xELE9BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBkaWFsb2dDbG9zZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgcmVxdWlyZTogJ15kaWFsb2cnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHJldHVyblZhbHVlOiAnPT9yZXR1cm4nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZGlhbG9nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShzY29wZS5yZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlhbG9nU2hvdyhkaWFsb2dSZWdpc3RyeSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICBpc01vZGFsOiAnPT9tb2RhbCcsXHJcbiAgICAgICAgICAgIGFuY2hvclNlbGVjdG9yOiAnQD9hbmNob3InXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nTmFtZSA9IGF0dHJzLm9seURpYWxvZ1Nob3c7XHJcbiAgICAgICAgICAgIHNjb3BlLmlzTW9kYWwgPSBzY29wZS5pc01vZGFsICE9PSB1bmRlZmluZWQgPyBzY29wZS5pc01vZGFsIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlhbG9nID0gZGlhbG9nUmVnaXN0cnkuZ2V0RGlhbG9nKGRpYWxvZ05hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2cuc2hvdyhzY29wZS5pc01vZGFsLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNjb3BlLmFuY2hvclNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBkaWFsb2dDbG9zZSwgZGlhbG9nU2hvd1xyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpYWxvZygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICckdHJhbnNjbHVkZScsICckcScsICdEaWFsb2dSZWdpc3RyeScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRxLCBkaWFsb2dSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICBkaWFsb2dSZWdpc3RyeS5hZGREaWFsb2codGhpcywgJGF0dHJzLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgJHRyYW5zY2x1ZGUoKGNsb25lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoY2xvbmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdoaWxlIHRoZSBkaWFsb2cgaXMgbm90IGltcGxlbWVudGVkIGluIGJyb3dzZXJzLCBpdCBzaG91bGQgZXhpc3RcclxuICAgICAgICAgICAgLy8gYXMgYSBjaGlsZCBvZiB0aGUgYm9keSBlbGVtZW50LlxyXG4gICAgICAgICAgICBpZiAoJGVsZW1lbnRbMF0ucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgkZWxlbWVudC5kZXRhY2goKVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBkaWFsb2cgPSAkZWxlbWVudFswXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghKCdIVE1MRGlhbG9nRWxlbWVudCcgaW4gd2luZG93KSAmJiBkaWFsb2dQb2x5ZmlsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgYnJvd3NlciBzdXBwb3J0IG5vdCBhdmFpbGFibGUgYW5kIHBvbHlmaWxsIGluc3RhbGxlZCxcclxuICAgICAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRoZSBkaWFsb2cgd2l0aCB0aGUgcG9seWZpbGwuXHJcbiAgICAgICAgICAgICAgICBkaWFsb2dQb2x5ZmlsbC5yZWdpc3RlckRpYWxvZyhkaWFsb2cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24oaXNNb2RhbCwgYW5jaG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vZGFsID0gaXNNb2RhbCAhPT0gdW5kZWZpbmVkID8gaXNNb2RhbCA6IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFkaWFsb2cub3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzTW9kYWwgPyBkaWFsb2cuc2hvd01vZGFsKGFuY2hvcikgOiBkaWFsb2cuc2hvdyhhbmNob3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UgPSBmdW5jdGlvbihyZXR1cm5WYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZGlhbG9nLmNsb3NlKHJldHVyblZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZC5yZXNvbHZlKHJldHVyblZhbHVlKSA6IHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucmVqZWN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpYWxvZy5vcGVuO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXRSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpYWxvZy5yZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUmVnaXN0cnkucmVtb3ZlRGlhbG9nKCRhdHRycy5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIG1hbnVhbGx5IHJlbW92ZSB0aGUgZWxlbWVudCBiZWNhdXNlIHdlIG1vdmVkIGl0XHJcbiAgICAgICAgICAgICAgICAvLyB0byB0aGUgYm9keS5cclxuICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XVxyXG4gICAgfTtcclxufSIsImNvbnN0IGRlZmF1bHROYW1lID0gJ2RlZmF1bHREaWFsb2cnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nUmVnaXN0cnkge1xyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIEEgZ2xvYmFsIHJlZ2lzdHJ5IG9mIGRpYWxvZ3Mgd2hpY2ggYWxsb3dzIHRoZW0gdG8gYmUgcmV0cmlldmVkXHJcbiAgICAvLy8gYW5kIGNvbnRyb2xsZWQgZnJvbSBDb250cm9sbGVycy9TZXJ2aWNlcy5cclxuICAgIC8vLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBkaWFsb2csIHRoZSBuYW1lIHBhcmFtZXRlcnMgYXJlIG9wdGlvbmFsLlxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZGlhbG9ncyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZERpYWxvZyhkaWFsb2csIG5hbWUpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV0gPSBkaWFsb2c7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRGlhbG9nKG5hbWUpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2dzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgZGlhbG9nIGZyb20gJy4vZGlhbG9nLWRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7ZGlhbG9nQ2xvc2UsIGRpYWxvZ1Nob3d9IGZyb20gJy4vZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzJztcclxuaW1wb3J0IERpYWxvZ1JlZ2lzdHJ5IGZyb20gJy4vZGlhbG9nLXJlZ2lzdHJ5JztcclxuXHJcbmxldCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnb2x5LmRpYWxvZycsIFtdKTtcclxuXHJcbm1vZHVsZS5zZXJ2aWNlKCdEaWFsb2dSZWdpc3RyeScsIFtEaWFsb2dSZWdpc3RyeV0pO1xyXG5cclxubW9kdWxlLmRpcmVjdGl2ZSgnZGlhbG9nJywgW2RpYWxvZ10pO1xyXG5cclxubW9kdWxlLmRpcmVjdGl2ZSgnb2x5RGlhbG9nQ2xvc2UnLCBbZGlhbG9nQ2xvc2VdKTtcclxubW9kdWxlLmRpcmVjdGl2ZSgnb2x5RGlhbG9nU2hvdycsIFsnRGlhbG9nUmVnaXN0cnknLCBkaWFsb2dTaG93XSk7XHJcbiJdfQ==
