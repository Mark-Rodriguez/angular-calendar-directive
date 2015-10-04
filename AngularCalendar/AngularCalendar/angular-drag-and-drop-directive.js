angular.module("angularDragAndDropDirective", [/*"$rootScope",*/ function (/*$rootScope*/) {
    
}]).run(function ($rootScope) {
    $rootScope.dragging = { element: null, data: null, drop: null, clone: null };
});

angular.module("angularDragAndDropDirective").directive("draggable", ["$rootScope", "$compile", "$window", function ($rootScope, $compile, $window) {
    return {
        restict:"AE",
        scope: {
            dropData: "=dropData",
            onDrop: "=onDrop",
            removeFromList: "=removeFromList"
        },
        link: function (scope, element, attrs) {

            element.css({
                "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none"})

            element.on("mousedown", function (e) {

                var startDown = { x: e.pageX, y: e.pageY };

                var dropped = false;
                var dragging = false;

                $rootScope.dragging.clone = element.clone();

                var ele = angular.element("<div class='dragging-overlay' style='pointer-events:none;position:fixed;padding:5px;background-color:#333;'></div>");

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
                    else
                    {
                        var nl = {x:e2.pageX, y:e2.pageY};

                        var diff = {x:startDown.x - nl.x, y:startDown.y - nl.y};

                        var dragThresh = 10;


                        if (Math.sqrt(diff.x * diff.x + diff.y * diff.y) > dragThresh)
                        {
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
                }

                angular.element(window).on("mouseup", onUp);

                var initDrag = function()
                {
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
            })
        }
    };
}])

angular.module("angularDragAndDropDirective").directive("dropArea", ["$rootScope", "$compile", function ($rootScope, $compile) {
    return {
        scope: {
            dropList: "=dropList",
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