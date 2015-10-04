angular.module("angularDragAndDropDirective", [/*"$rootScope",*/ function (/*$rootScope*/) {

}]).run(function ($rootScope) {
    $rootScope.dragging = { element: null, data: null, drop: null, clone: null };
});

angular.module("angularDragAndDropDirective").directive("draggable", ["$rootScope", "$compile", "$window", "$http", function ($rootScope, $compile, $window, $http) {
    return {
        restict: "AE",
        scope: {
            dropData: "=dropData",
            onDrop: "=onDrop",
            removeFromList: "=removeFromList",
            settings: "=draggableSettings"
        },
        link: function (scope, element, attrs) {

            if (scope.settings == null) {
                scope.settings = {};
            }

            element.css({
                "-webkit-touch-callout": "none",
                "-webkit-user-select": "none",
                "-khtml-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none"
            })



            element.on("mousedown", function (e) {

                var startDown = { x: e.pageX, y: e.pageY };

                var dropped = false;
                var dragging = false;

                $rootScope.dragging.clone = element.clone();

                var ele = null;



                var initDrag = function () {
                    dragging = true;
                    dropped = false;

                    if ($rootScope.dragging.drop != null) {
                        $rootScope.dragging.drop(null, null);
                    }

                    $rootScope.dragging.element = element;
                    $rootScope.dragging.data = scope.dropData;
                    $rootScope.dragging.drop = function (dropElement, dropTarget) {
                        if (dropElement != null) {

                            if (scope.removeFromList != null) {
                                scope.removeFromList.splice(scope.removeFromList.indexOf(scope.dropData), 1);
                            }

                            if (scope.onDrop != null) {
                                scope.onDrop(dropElement, dropTarget, scope.dropData);
                            }
                        }

                        $rootScope.dragging.drop = null;
                        $rootScope.dragging.element = null;
                        $rootScope.dragging.data = null;
                        $rootScope.dragging.clone = null;

                        dropped = true;
                        dragging = false;
                    }

                    angular.element(document.body).append(ele);
                }

                var finishBuild = function () {
                    if (scope.settings.parentCSS != null) {
                        ele.css(scope.settings.wrapperCSS);
                    }

                    if (scope.settings.wrapperClasses != null) {
                        for (var g = 0; g < scope.settings.wrapperClasses.length; g++) {
                            ele.addClass(scope.settings.wrapperClasses[g]);
                        }
                    }

                    if (scope.settings.copyParentDimensions) {
                        var size = { x: element.parent()[0].offsetWidth, y: element.parent()[0].offsetHeight };

                        ele.css({ width: size.x + "px", height: size.y + "px" });
                    }

                    ele.append($rootScope.dragging.clone);

                    var onMove = function (e2) {

                        if (dragging) {
                            ele.css({ left: e2.pageX + "px", top: e2.pageY - $window.pageYOffset + "px", transform: "translate(-50%, -50%)" });

                            if (window.getSelection) {
                                if (window.getSelection().empty) {  // Chrome
                                    window.getSelection().empty();
                                } else if (window.getSelection().removeAllRanges) {  // Firefox
                                    window.getSelection().removeAllRanges();
                                }
                            } else if (document.selection) {  // IE?
                                document.selection.empty();
                            }
                        }
                        else {
                            var nl = { x: e2.pageX, y: e2.pageY };

                            var diff = { x: startDown.x - nl.x, y: startDown.y - nl.y };

                            var dragThresh = 10;


                            if (Math.sqrt(diff.x * diff.x + diff.y * diff.y) > dragThresh) {
                                initDrag();
                                ele.css({ left: e2.pageX + "px", top: e2.pageY - $window.pageYOffset + "px", transform: "translate(-50%, -50%)" });
                            }
                        }
                    };

                    angular.element(window).on("mousemove", onMove);

                    var onUp = function (e2) {

                        if (!dropped) {
                            if ($rootScope.dragging.drop != null) {
                                $rootScope.dragging.drop(null, null);
                            }
                        }

                        angular.element(window).off("mousemove", onMove);
                        angular.element(window).off("mouseup", onUp);
                        ele.remove();
                        ele = null;

                        element.css({
                            "-webkit-touch-callout": "",
                            "-webkit-user-select": "",
                            "-khtml-user-select": "",
                            "-moz-user-select": "",
                            "-ms-user-select": "",
                            "user-select": ""
                        })
                    }

                    angular.element(window).on("mouseup", onUp);
                }

                if (scope.settings.overlayTemplate != null) {
                    ele = angular.element(scope.settings.overlayTemplate);

                    finishBuild();
                }
                else {

                    if (scope.settings.overlayTemplateURL != null) {
                        $http.get(scope.settings.overlayTemplateURL).then(function (response) {
                            ele = angular.element(response.data);

                            finishBuild();
                        }, function (response) {

                        });
                    }
                    else {
                        ele = angular.element("<div class='dragging-overlay' style='pointer-events:none;position:fixed;'></div>");

                        finishBuild();
                    }
                }

            })
        }
    };
}])

angular.module("angularDragAndDropDirective").directive("dropArea", ["$rootScope", "$compile", function ($rootScope, $compile) {
    return {
        scope: {
            dropList: "=dropList",
            dropReplace: "=dropReplace",
            onDrop: "=onDrop",
            dropTarget: "=dropTarget"
        },
        link: function (scope, element, attrs) {

            element.on("mouseup", function (e) {
                if ($rootScope.dragging.drop != null) {

                    if ($rootScope.dragging.data != null) {
                        if (scope.dropList != null) {
                            scope.dropList.push($rootScope.dragging.data);
                        }

                        if (scope.dropReplace != null) {
                            scope.dropReplace = $rootScope.dragging.data;
                        }
                    }

                    var data = $rootScope.dragging.data;
                    var elem = $rootScope.dragging.element;

                    $rootScope.dragging.drop(element, scope.dropTarget);


                    if (scope.onDrop != null && (data != null || elem != null)) {
                        scope.onDrop(data, elem);
                    }
                }
            })
        }
    };
}])