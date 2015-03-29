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
            dialogName: "@olyDialogShow",
            isModal: "=?modal",
            anchorSelector: "@?anchor"
        },
        link: function link(scope, element, attrs) {
            scope.isModal = scope.isModal !== undefined ? scope.isModal : true;

            element.on("click", function () {
                var dialog = dialogRegistry.getDialog(scope.dialogName);

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
        controller: ["$scope", "$element", "$attrs", "$transclude", "$q", "$interpolate", "DialogRegistry", function ($scope, $element, $attrs, $transclude, $q, $interpolate, dialogRegistry) {
            var _this = this;

            this.name = $interpolate($attrs.name)($scope);

            dialogRegistry.addDialog(this, this.name);

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
                if (dialog.open) {
                    return;
                }

                isModal = isModal !== undefined ? isModal : true;
                isModal ? dialog.showModal(anchor) : dialog.show(anchor);
                $scope.$emit("$dialogShow", this);

                this.dialogReturnDeffered = $q.defer();
                return this.dialogReturnDeffered.promise;
            };

            this.close = function (returnValue) {
                if (!this.isOpen()) {
                    return;
                }

                dialog.close(returnValue);
                $scope.$emit("$dialogClose", this);

                if (this.dialogReturnDeffered) {
                    returnValue !== undefined ? this.dialogReturnDeffered.resolve(returnValue) : this.dialogReturnDeffered.reject();
                }

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

                dialogRegistry.removeDialog(_this.name);

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

_module.exports = "oly.dialog";

},{"./dialog-action-directives":1,"./dialog-directive":2,"./dialog-registry":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsc0JBQVUsRUFBRSxnQkFBZ0I7QUFDNUIsbUJBQU8sRUFBRSxTQUFTO0FBQ2xCLDBCQUFjLEVBQUUsVUFBVTtTQUM3QjtBQUNELFlBQUksRUFBQSxjQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFB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QUU7QUFDWix1QkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQzthQUM1Qzs7QUFFRCxrQkFBVTttQkFBQSxzQkFBRztBQUNULHVCQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDdkI7Ozs7V0F4QmdCLGNBQWM7OztpQkFBZCxjQUFjOzs7Ozs7O0lDRjVCLE1BQU0sMkJBQU0sb0JBQW9COztzQ0FDRCw0QkFBNEI7O0lBQTFELFdBQVcsMkJBQVgsV0FBVztJQUFFLFVBQVUsMkJBQVYsVUFBVTs7SUFDeEIsY0FBYywyQkFBTSxtQkFBbUI7O0FBRTlDLElBQUksT0FBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUU5QyxPQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzs7QUFFbkQsT0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUVyQyxPQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUNsRCxPQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLE9BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGRpYWxvZ0Nsb3NlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICByZXF1aXJlOiAnXmRpYWxvZycsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgcmV0dXJuVmFsdWU6ICc9P3JldHVybidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBkaWFsb2cpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlhbG9nLmNsb3NlKHNjb3BlLnJldHVyblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaWFsb2dTaG93KGRpYWxvZ1JlZ2lzdHJ5KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIGRpYWxvZ05hbWU6ICdAb2x5RGlhbG9nU2hvdycsXHJcbiAgICAgICAgICAgIGlzTW9kYWw6ICc9P21vZGFsJyxcclxuICAgICAgICAgICAgYW5jaG9yU2VsZWN0b3I6ICdAP2FuY2hvcidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLmlzTW9kYWwgPSBzY29wZS5pc01vZGFsICE9PSB1bmRlZmluZWQgPyBzY29wZS5pc01vZGFsIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlhbG9nID0gZGlhbG9nUmVnaXN0cnkuZ2V0RGlhbG9nKHNjb3BlLmRpYWxvZ05hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2cuc2hvdyhzY29wZS5pc01vZGFsLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNjb3BlLmFuY2hvclNlbGVjdG9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBkaWFsb2dDbG9zZSwgZGlhbG9nU2hvd1xyXG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpYWxvZygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICckdHJhbnNjbHVkZScsICckcScsICckaW50ZXJwb2xhdGUnLCAnRGlhbG9nUmVnaXN0cnknLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlLCAkcSwgJGludGVycG9sYXRlLCBkaWFsb2dSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAkaW50ZXJwb2xhdGUoJGF0dHJzLm5hbWUpKCRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICBkaWFsb2dSZWdpc3RyeS5hZGREaWFsb2codGhpcywgdGhpcy5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICR0cmFuc2NsdWRlKChjbG9uZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuYXBwZW5kKGNsb25lKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBXaGlsZSB0aGUgZGlhbG9nIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiBicm93c2VycywgaXQgc2hvdWxkIGV4aXN0XHJcbiAgICAgICAgICAgIC8vIGFzIGEgY2hpbGQgb2YgdGhlIGJvZHkgZWxlbWVudC5cclxuICAgICAgICAgICAgaWYgKCRlbGVtZW50WzBdLnBhcmVudEVsZW1lbnQgIT09IGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoJGVsZW1lbnQuZGV0YWNoKClbMF0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlhbG9nID0gJGVsZW1lbnRbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAoISgnSFRNTERpYWxvZ0VsZW1lbnQnIGluIHdpbmRvdykgJiYgZGlhbG9nUG9seWZpbGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGJyb3dzZXIgc3VwcG9ydCBub3QgYXZhaWxhYmxlIGFuZCBwb2x5ZmlsbCBpbnN0YWxsZWQsXHJcbiAgICAgICAgICAgICAgICAvLyByZWdpc3RlciB0aGUgZGlhbG9nIHdpdGggdGhlIHBvbHlmaWxsLlxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUG9seWZpbGwucmVnaXN0ZXJEaWFsb2coZGlhbG9nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKGlzTW9kYWwsIGFuY2hvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpYWxvZy5vcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlzTW9kYWwgPSBpc01vZGFsICE9PSB1bmRlZmluZWQgPyBpc01vZGFsIDogdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlzTW9kYWwgPyBkaWFsb2cuc2hvd01vZGFsKGFuY2hvcikgOiBkaWFsb2cuc2hvdyhhbmNob3IpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCckZGlhbG9nU2hvdycsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UgPSBmdW5jdGlvbihyZXR1cm5WYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShyZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJyRkaWFsb2dDbG9zZScsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucmVzb2x2ZShyZXR1cm5WYWx1ZSkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZC5yZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkID0gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaXNPcGVuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlhbG9nLm9wZW47XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldFJldHVyblZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlhbG9nLnJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGlhbG9nUmVnaXN0cnkucmVtb3ZlRGlhbG9nKHRoaXMubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBtYW51YWxseSByZW1vdmUgdGhlIGVsZW1lbnQgYmVjYXVzZSB3ZSBtb3ZlZCBpdFxyXG4gICAgICAgICAgICAgICAgLy8gdG8gdGhlIGJvZHkuXHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfV1cclxuICAgIH07XHJcbn0iLCJjb25zdCBkZWZhdWx0TmFtZSA9ICdkZWZhdWx0RGlhbG9nJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1JlZ2lzdHJ5IHtcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBBIGdsb2JhbCByZWdpc3RyeSBvZiBkaWFsb2dzIHdoaWNoIGFsbG93cyB0aGVtIHRvIGJlIHJldHJpZXZlZFxyXG4gICAgLy8vIGFuZCBjb250cm9sbGVkIGZyb20gQ29udHJvbGxlcnMvU2VydmljZXMuXHJcbiAgICAvLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgZGlhbG9nLCB0aGUgbmFtZSBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbC5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREaWFsb2coZGlhbG9nLCBuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdID0gZGlhbG9nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2cobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlhbG9ncygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsb2dzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IGRpYWxvZyBmcm9tICcuL2RpYWxvZy1kaXJlY3RpdmUnO1xyXG5pbXBvcnQge2RpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93fSBmcm9tICcuL2RpYWxvZy1hY3Rpb24tZGlyZWN0aXZlcyc7XHJcbmltcG9ydCBEaWFsb2dSZWdpc3RyeSBmcm9tICcuL2RpYWxvZy1yZWdpc3RyeSc7XHJcblxyXG5sZXQgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29seS5kaWFsb2cnLCBbXSk7XHJcblxyXG5tb2R1bGUuc2VydmljZSgnRGlhbG9nUmVnaXN0cnknLCBbRGlhbG9nUmVnaXN0cnldKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ2RpYWxvZycsIFtkaWFsb2ddKTtcclxuXHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ0Nsb3NlJywgW2RpYWxvZ0Nsb3NlXSk7XHJcbm1vZHVsZS5kaXJlY3RpdmUoJ29seURpYWxvZ1Nob3cnLCBbJ0RpYWxvZ1JlZ2lzdHJ5JywgZGlhbG9nU2hvd10pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAnb2x5LmRpYWxvZyc7Il19
