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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGlhbG9nLWFjdGlvbi1kaXJlY3RpdmVzLmpzIiwic3JjL2RpYWxvZy1kaXJlY3RpdmUuanMiLCJzcmMvZGlhbG9nLXJlZ2lzdHJ5LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxTQUFTLFdBQVcsR0FBRztBQUNuQixXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBTyxFQUFFLFNBQVM7QUFDbEIsYUFBSyxFQUFFO0FBQ0gsdUJBQVcsRUFBRSxVQUFVO1NBQzFCO0FBQ0QsWUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLG1CQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLHFCQUFLLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDZiwwQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ25DLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQztDQUNMOztBQUVELFNBQVMsVUFBVSxDQUFDLGNBQWMsRUFBRTtBQUNoQyxXQUFPO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsYUFBSyxFQUFFO0FBQ0gsbUJBQU8sRUFBRSxTQUFTO0FBQ2xCLDBCQUFjLEVBQUUsVUFBVTtTQUM3QjtBQUNELFlBQUksRUFBQSxjQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLGdCQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ3JDLGlCQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVuRSxtQkFBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQixvQkFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFbEQsb0JBQUksTUFBTSxFQUFFO0FBQ1IseUJBQUssQ0FBQyxNQUFNLENBQUMsWUFBTTtBQUNmLDhCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztxQkFDNUUsQ0FBQyxDQUFDO2lCQUNOO2FBQ0osQ0FBQyxDQUFDO1NBQ047S0FDSixDQUFDO0NBQ0w7O1FBR0csV0FBVyxHQUFYLFdBQVc7UUFBRSxVQUFVLEdBQVYsVUFBVTs7Ozs7Ozs7aUJDMUNILE1BQU07O0FBQWYsU0FBUyxNQUFNLEdBQUc7QUFDN0IsV0FBTztBQUNILGdCQUFRLEVBQUUsR0FBRztBQUNiLGtCQUFVLEVBQUUsSUFBSTtBQUNoQixrQkFBVSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFO0FBQ3BKLDBCQUFjLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTVDLHVCQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDbkIsd0JBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDMUIsQ0FBQyxDQUFDOzs7O0FBSUgsZ0JBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQzdDLHdCQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuRDs7QUFFRCxnQkFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV6QixnQkFBSSxFQUFFLG1CQUFtQixJQUFJLE1BQU0sQ0FBQSxBQUFDLElBQUksY0FBYyxFQUFFOzs7QUFHcEQsOEJBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDekM7O0FBRUQsZ0JBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7QUFDakMsZ0JBQUksQ0FBQyxJQUFJLEdBQUcsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLHVCQUFPLEdBQUcsT0FBTyxLQUFLLFNBQVMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVqRCxvQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDZCwyQkFBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDNUQ7O0FBRUQsb0JBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkMsdUJBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQzthQUM1QyxDQUFDOztBQUVGLGdCQUFJLENBQUMsS0FBSyxHQUFHLFVBQVMsV0FBVyxFQUFFO0FBQy9CLHNCQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUxQiwyQkFBVyxLQUFLLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFaEgsb0JBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7YUFDcEMsQ0FBQzs7QUFFRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxZQUFXO0FBQ3JCLHVCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDdEIsQ0FBQzs7QUFFRixnQkFBSSxDQUFDLGNBQWMsR0FBRyxZQUFXO0FBQzdCLHVCQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7YUFDN0IsQ0FBQzs7QUFFRixrQkFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsWUFBVztBQUM5QixvQkFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLDhCQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QyxDQUFDLENBQUM7U0FDTixDQUFDO0tBQ0wsQ0FBQztDQUNMOzs7Ozs7Ozs7QUM1REQsSUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDOztJQUVmLGNBQWM7Ozs7Ozs7QUFNcEIsYUFOTSxjQUFjLEdBTWpCOzhCQU5HLGNBQWM7O0FBTzNCLFlBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0tBQ3JCOztpQkFSZ0IsY0FBYztBQVUvQixpQkFBUzttQkFBQSxtQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3BCLG9CQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUM7YUFDOUM7O0FBRUQsb0JBQVk7bUJBQUEsc0JBQUMsSUFBSSxFQUFFO0FBQ2YsdUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLENBQUM7YUFDNUM7O0FBRUQsaUJBQVM7bUJBQUEsbUJBQUMsSUFBSSxFQUFFO0FBQ1osdUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLENBQUM7YUFDNUM7O0FBRUQsa0JBQVU7bUJBQUEsc0JBQUc7QUFDVCx1QkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ3ZCOzs7O1dBeEJnQixjQUFjOzs7aUJBQWQsY0FBYzs7Ozs7OztJQ0Y1QixNQUFNLDJCQUFNLG9CQUFvQjs7c0NBQ0QsNEJBQTRCOztJQUExRCxXQUFXLDJCQUFYLFdBQVc7SUFBRSxVQUFVLDJCQUFWLFVBQVU7O0lBQ3hCLGNBQWMsMkJBQU0sbUJBQW1COztBQUU5QyxJQUFJLE9BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFOUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7O0FBRW5ELE9BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsT0FBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDbEQsT0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGRpYWxvZ0Nsb3NlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICByZXF1aXJlOiAnXmRpYWxvZycsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZTogJz0/cmV0dXJuJ1xuICAgICAgICB9LFxuICAgICAgICBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZGlhbG9nKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZy5jbG9zZShzY29wZS5yZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRpYWxvZ1Nob3coZGlhbG9nUmVnaXN0cnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGlzTW9kYWw6ICc9P21vZGFsJyxcbiAgICAgICAgICAgIGFuY2hvclNlbGVjdG9yOiAnQD9hbmNob3InXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgZGlhbG9nTmFtZSA9IGF0dHJzLm9seURpYWxvZ1Nob3c7XG4gICAgICAgICAgICBzY29wZS5pc01vZGFsID0gc2NvcGUuaXNNb2RhbCAhPT0gdW5kZWZpbmVkID8gc2NvcGUuaXNNb2RhbCA6IHRydWU7XG5cbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRpYWxvZyA9IGRpYWxvZ1JlZ2lzdHJ5LmdldERpYWxvZyhkaWFsb2dOYW1lKTtcblxuICAgICAgICAgICAgICAgIGlmIChkaWFsb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZy5zaG93KHNjb3BlLmlzTW9kYWwsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2NvcGUuYW5jaG9yU2VsZWN0b3IpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQge1xuICAgIGRpYWxvZ0Nsb3NlLCBkaWFsb2dTaG93XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpYWxvZygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCAnJHRyYW5zY2x1ZGUnLCAnJHEnLCAnRGlhbG9nUmVnaXN0cnknLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlLCAkcSwgZGlhbG9nUmVnaXN0cnkpIHtcbiAgICAgICAgICAgIGRpYWxvZ1JlZ2lzdHJ5LmFkZERpYWxvZyh0aGlzLCAkYXR0cnMubmFtZSk7XG5cbiAgICAgICAgICAgICR0cmFuc2NsdWRlKChjbG9uZSkgPT4ge1xuICAgICAgICAgICAgICAgICRlbGVtZW50LmFwcGVuZChjbG9uZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gV2hpbGUgdGhlIGRpYWxvZyBpcyBub3QgaW1wbGVtZW50ZWQgaW4gYnJvd3NlcnMsIGl0IHNob3VsZCBleGlzdFxuICAgICAgICAgICAgLy8gYXMgYSBjaGlsZCBvZiB0aGUgYm9keSBlbGVtZW50LlxuICAgICAgICAgICAgaWYgKCRlbGVtZW50WzBdLnBhcmVudEVsZW1lbnQgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCRlbGVtZW50LmRldGFjaCgpWzBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGRpYWxvZyA9ICRlbGVtZW50WzBdO1xuXG4gICAgICAgICAgICBpZiAoISgnSFRNTERpYWxvZ0VsZW1lbnQnIGluIHdpbmRvdykgJiYgZGlhbG9nUG9seWZpbGwpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBicm93c2VyIHN1cHBvcnQgbm90IGF2YWlsYWJsZSBhbmQgcG9seWZpbGwgaW5zdGFsbGVkLFxuICAgICAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRoZSBkaWFsb2cgd2l0aCB0aGUgcG9seWZpbGwuXG4gICAgICAgICAgICAgICAgZGlhbG9nUG9seWZpbGwucmVnaXN0ZXJEaWFsb2coZGlhbG9nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbihpc01vZGFsLCBhbmNob3IpIHtcbiAgICAgICAgICAgICAgICBpc01vZGFsID0gaXNNb2RhbCAhPT0gdW5kZWZpbmVkID8gaXNNb2RhbCA6IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWRpYWxvZy5vcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzTW9kYWwgPyBkaWFsb2cuc2hvd01vZGFsKGFuY2hvcikgOiBkaWFsb2cuc2hvdyhhbmNob3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnByb21pc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNsb3NlID0gZnVuY3Rpb24ocmV0dXJuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkaWFsb2cuY2xvc2UocmV0dXJuVmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZGlhbG9nUmV0dXJuRGVmZmVyZWQucmVzb2x2ZShyZXR1cm5WYWx1ZSkgOiB0aGlzLmRpYWxvZ1JldHVybkRlZmZlcmVkLnJlamVjdCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2dSZXR1cm5EZWZmZXJlZCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkaWFsb2cub3BlbjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0UmV0dXJuVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlhbG9nLnJldHVyblZhbHVlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG5cbiAgICAgICAgICAgICAgICBkaWFsb2dSZWdpc3RyeS5yZW1vdmVEaWFsb2coJGF0dHJzLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dXG4gICAgfTtcbn0iLCJjb25zdCBkZWZhdWx0TmFtZSA9ICdkZWZhdWx0RGlhbG9nJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1JlZ2lzdHJ5IHtcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBBIGdsb2JhbCByZWdpc3RyeSBvZiBkaWFsb2dzIHdoaWNoIGFsbG93cyB0aGVtIHRvIGJlIHJldHJpZXZlZFxyXG4gICAgLy8vIGFuZCBjb250cm9sbGVkIGZyb20gQ29udHJvbGxlcnMvU2VydmljZXMuXHJcbiAgICAvLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgZGlhbG9nLCB0aGUgbmFtZSBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbC5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZ3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREaWFsb2coZGlhbG9nLCBuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dzW25hbWUgfHwgZGVmYXVsdE5hbWVdID0gZGlhbG9nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURpYWxvZyhuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlhbG9nc1tuYW1lIHx8IGRlZmF1bHROYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaWFsb2cobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYWxvZ3NbbmFtZSB8fCBkZWZhdWx0TmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlhbG9ncygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWFsb2dzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IGRpYWxvZyBmcm9tICcuL2RpYWxvZy1kaXJlY3RpdmUnO1xuaW1wb3J0IHtkaWFsb2dDbG9zZSwgZGlhbG9nU2hvd30gZnJvbSAnLi9kaWFsb2ctYWN0aW9uLWRpcmVjdGl2ZXMnO1xuaW1wb3J0IERpYWxvZ1JlZ2lzdHJ5IGZyb20gJy4vZGlhbG9nLXJlZ2lzdHJ5JztcblxubGV0IG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbHkuZGlhbG9nJywgW10pO1xuXG5tb2R1bGUuc2VydmljZSgnRGlhbG9nUmVnaXN0cnknLCBbRGlhbG9nUmVnaXN0cnldKTtcblxubW9kdWxlLmRpcmVjdGl2ZSgnZGlhbG9nJywgW2RpYWxvZ10pO1xuXG5tb2R1bGUuZGlyZWN0aXZlKCdvbHlEaWFsb2dDbG9zZScsIFtkaWFsb2dDbG9zZV0pO1xubW9kdWxlLmRpcmVjdGl2ZSgnb2x5RGlhbG9nU2hvdycsIFsnRGlhbG9nUmVnaXN0cnknLCBkaWFsb2dTaG93XSk7XG4iXX0=
