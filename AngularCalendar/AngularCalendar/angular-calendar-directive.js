angular.module("angularCalendarDirective", []).directive('angularCalendar', ["$compile", "$http", function ($compile, $http) {
    return {
        restrict: "AE",
        scope: {
            data:"=data",
            calendarData:"=calendarData",
            calendarSettings: "=calendarSettings"
        },
        link: function link(scope, element, attrs) {
            var dir = "CalendarTemplates/";
            
            if (attrs.calendarTemplateDirectory != null && attrs.calendarTemplateDirectory != undefined)
            {
                dir = attrs.calendarTemplateDirectory;

                if (dir.charAt(dir.length - 1) != "/")
                {
                    dir = dir + "/";
                }
            }

            scope.$watch('calendarSettings.view', function (newValue, oldValue) {
                if (newValue)
                {
                     $http.get(dir + scope.calendarSettings.view + '-calendar-template.html')
                          .then(function (response) {
                              element.html(response.data);
                              $compile(element.contents())(scope);
                          });
                    
                }
            });

            scope.calendarSettings.setCalendarDate = function (date) {
                scope.calendarSettings.currentDate = date;

                if (scope.calendarSettings._internalDateChanged != null)
                {
                    scope.calendarSettings._internalDateChanged();
                }
            }
          
            $http.get(dir + scope.calendarSettings.view + '-calendar-template.html')
          .then(function (response) {
              element.html(response.data);
              $compile(element.contents())(scope);
          });
        },
        templateURL: function (element, attr) {
            var vs = "month";
            var dir = "CalendarTemplates/";

            if (attr.viewStart != undefined && attr.viewStart != null)
            {
                vs = attr.viewStart;
            }

            if (attr.calendarTemplateDirectory != null && attr.calendarTemplateDirectory != undefined) {
                dir = scope.calendarData.templateDirectory;

                if (dir.charAt(dir.length - 1) != "/") {
                    dir = dir + "/";
                }
            }

            return dir + vs + '-calendar-template.html';
        }
    };
}]);

angular.module("angularCalendarDirective").directive("angularCalendarTimeBtn", [function () {
    return {
        scope: {
            calendarSettings: "=calendarSettings"
        },
        link:function(scope, element, attrs)
        {
            element.bind("click", function (e) {
                if (attrs.nextTime != undefined) {
                    //set to next time
                    switch(scope.calendarSettings.view)
                    {
                        case "month":
                            scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(1, "month");

                            if (scope.calendarSettings._internalDateChanged != null) {
                                scope.calendarSettings._internalDateChanged();
                            }
                            break;

                        case "week":
                            scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(1, "week");

                            if (scope.calendarSettings._internalDateChanged != null) {
                                scope.calendarSettings._internalDateChanged();
                            }
                            break;

                        case "year":
                            scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(1, "year");

                            if (scope.calendarSettings._internalDateChanged != null) {
                                scope.calendarSettings._internalDateChanged();
                            }
                            break;

                        case "day":
                            scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(1, "day");

                            if (scope.calendarSettings._internalDateChanged != null) {
                                scope.calendarSettings._internalDateChanged();
                            }
                            break;
                    }
                }
                else {
                    if (attrs.previousTime != undefined)
                    {
                        switch (scope.calendarSettings.view) {
                            case "month":
                                scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(-1, "month");

                                if (scope.calendarSettings._internalDateChanged != null) {
                                    scope.calendarSettings._internalDateChanged();
                                }
                                break;

                            case "week":
                                scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(-1, "week");

                                if (scope.calendarSettings._internalDateChanged != null) {
                                    scope.calendarSettings._internalDateChanged();
                                }
                                break;

                            case "year":
                                scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(-1, "year");

                                if (scope.calendarSettings._internalDateChanged != null) {
                                    scope.calendarSettings._internalDateChanged();
                                }
                                break;

                            case "day":
                                scope.calendarSettings.currentDate = moment(scope.calendarSettings.currentDate).add(-1, "day");

                                if (scope.calendarSettings._internalDateChanged != null) {
                                    scope.calendarSettings._internalDateChanged();
                                }
                                break;
                        }
                    }
                    else
                    {
                        scope.calendarSettings.currentDate = moment().startOf("day");

                        if (scope.calendarSettings._internalDateChanged != null) {
                            scope.calendarSettings._internalDateChanged();
                        }
                    }
                }
            });
        }
    };
}]);

angular.module("angularCalendarDirective").controller("angular-calendar-month-view-controller", ["$rootScope", "$scope", "$element", "$interval", function ($rootScope, $scope, $element, $interval) {
    
    $scope._internal = {
        getEventTimeForDay:function(event, day){

            var ds = moment(event.dateStart);
            var de = null;

            if (event.dateEnd != null) {
                de = moment(event.dateEnd);
            }

            if (de == null || (ds.dayOfYear() == de.dayOfYear() && ds.year() == de.year()))
            {
                return ds.format("h:mm A") + ((de != null) ? " - " + de.format("h:mm A") : "");
            }
        },
        onEventDrop:function(dropElement, day, event)
        {
            event.dateStart = moment(day.date);
            event.dateEnd = moment(day.date);

            if ($scope.calendarData.onEventTimeChange != null) {
                $scope.calendarData.onEventTimeChange(event, moment(day.date), null)
            }
        },
        onDayClick: function (day) {

            if ($scope.monthView.selectedDay != day) {
                $scope.monthView.selectedDay = day;

                for (var g = 0; g < $scope.monthView.weeks.length; g++) {
                    $scope.monthView.weeks[g].selectedDay = null;
                }

                day.week.selectedDay = day;
            }
            else {
                $scope.monthView.selectedDay = null;

                for (var g = 0; g < $scope.monthView.weeks.length; g++) {
                    $scope.monthView.weeks[g].selectedDay = null;
                }
            }

            if ($scope.calendarSettings.onDayClick != null) {
                $scope.calendarSettings.onDayClick(day);
            }
        },
        onDayDblClick: function (day) {
            if ($scope.calendarSettings.onDayDblClick != null) {
                $scope.calendarSettings.onDayDblClick(day);
            }
        },
        onDayMouseOver: function (day) {
            if ($scope.calendarSettings.onDayMouseOver != null) {
                $scope.calendarSettings.onDayMouseOver(day);
            }
        },
        onDayMouseOut: function (day) {
            if ($scope.calendarSettings.onDayMouseOut != null) {
                $scope.calendarSettings.onDayMouseOut(day);
            }
        },
        onDayMouseDown: function (day) {
            if ($scope.calendarSettings.onDayMouseDown != null) {
                $scope.calendarSettings.onDayMouseDown(day);
            }
        },
        onDayMouseUp: function (day) {
            if ($scope.calendarSettings.onDayMouseUp != null) {
                $scope.calendarSettings.onDayMouseUp(day);
            }
        },
        onEventClick: function (event) {
            if ($scope.calendarSettings.onEventClick != null) {
                $scope.calendarSettings.onEventClick(event);
            }
        },
        onEventDblClick: function (event) {
            if ($scope.calendarSettings.onEventDblClick != null) {
                $scope.calendarSettings.onEventDblClick(event);
            }
        },
        onEventMouseOver: function (event) {
            if ($scope.calendarSettings.onEventMouseOver != null) {
                $scope.calendarSettings.onEventMouseOver(event);
            }
        },
        onEventMouseOut: function (event) {
            if ($scope.calendarSettings.onEventMouseOut != null) {
                $scope.calendarSettings.onEventMouseOut(event);
            }
        },
        onEventMouseDown: function (event) {
            if ($scope.calendarSettings.onEventMouseDown != null) {
                $scope.calendarSettings.onEventMouseDown(event);
            }
        },
        onEventMouseUp: function (event) {
            if ($scope.calendarSettings.onEventMouseUp != null) {
                $scope.calendarSettings.onEventMouseUp(event);
            }
        }
    };

    $scope.calendarSettings._internalDateChanged = function () {
        $scope.buildMonthView();
        var phase = $scope.$$phase;
        if (phase != '$apply' && phase != '$digest') {
            phase = $rootScope.$$phase;
            
            if (phase != '$apply' && phase != '$digest') {
                $scope.$apply();
            }
        }

        if ($scope.calendarSettings.currentDateChanged != null)
        {
            $scope.calendarSettings.currentDateChanged($scope.calendarSettings.currentDate);
        }
    }

    $scope.buildMonthView = function () {

        $scope.monthView = {
            weeks: [
            {
                days: []
            },
            {
                days: []
            },
            {
                days: []
            },
            {
                days: []
            },
            {
                days: []
            }]
        };



        var mom = moment($scope.calendarSettings.currentDate);
        
        $scope.currDate = mom.clone();

        var first = mom.clone().date(1);

        var sund = first.clone().day("sunday").startOf("day");

        var curr = sund.clone();

        for (var g = 0; g < $scope.calendarData.events.length; g++)
        {
            var first = true;

            $scope.calendarData.events[g].eventStyle = {};

            if ($scope.calendarData.events[g].backgroundColor != null) {
                $scope.calendarData.events[g].eventStyle["background-color"] = $scope.calendarData.events[g].backgroundColor;
            }

            if ($scope.calendarData.events[g].color != null) {
                $scope.calendarData.events[g].eventStyle["color"] = $scope.calendarData.events[g].color;
            }
        }

        for (var g = 0; g < 5; g++) {
            $scope.monthView.weeks[g].days = [];

            for (var h = 0; h < 7; h++) {

                var day = {
                    week: $scope.monthView.weeks[g],
                    date: curr.clone(),
                    events: []
                };

                for (var i = 0; i < $scope.calendarData.events.length; i++)
                {
                    var ds = moment($scope.calendarData.events[i].dateStart).startOf("day");
                    var de = null;

                    if ($scope.calendarData.events[i].dateEnd != null)
                    {
                        de = moment($scope.calendarData.events[i].dateEnd).endOf("day");
                    }
                    else
                    {
                        de = ds.clone().endOf("day");
                    }

                    var add = false;

                    if (ds.dayOfYear() == curr.dayOfYear() && ds.year() == curr.year())
                    {
                        add = true;
                    }

                    if (ds.diff(curr.clone().endOf("day")) <= 0)
                    {
                        if (de.diff(curr.clone().startOf("day")) >= 0)
                        {
                            add = true;
                        }
                    }

                    if (add)
                    {
                        day.events.push($scope.calendarData.events[i]);
                    }
                }

                $scope.monthView.weeks[g].days.push(day);
                curr.add(1, "d");
            }

        }

    }


    $scope.windowResized = function (e) {
        var ar = .6;

        if ($scope.calendarSettings.aspectRatio != undefined && $scope.calendarSettings.aspectRatio != null) {
            ar = $scope.calendarSettings.aspectRatio;
        }

        $scope.calendarSettings.weekRowHeight = ($element.width() * ar) * .2
        $scope.calendarSettings.weekRowStyles = { height: $scope.calendarSettings.weekRowHeight + "px" };

    }

    angular.element(window).bind("resize", function (e) {
        $scope.windowResized();
    })

    $scope.windowResized();

    if ($scope.calendarSettings.watchingCurrentDate != null)
    {
        $scope.calendarSettings.watchingCurrentDate();
    }

    $scope.calendarSettings.watchingCurrentDate = $scope.$watch("calendarSettings.currentDate",
                    function (newValue, oldValue) {
                        var nv = moment(newValue);
                        var ov = moment(oldValue);
                        if (nv.format("x") != ov.format("x")) {
                            if (nv.month() != ov.month()) {
                                $scope.buildMonthView();
                            }
                        }
                    }
                , true);
    $scope.calendarSettings.watchingEvents = $scope.$watch("calendarData.events",
                    function (newValue, oldValue) {
                        if (newValue.length != oldValue.length) {
                            $scope.buildMonthView();
                            return;
                        }

                        for (var g = 0; g < newValue.length; g++)
                        {
                            if (moment(newValue[g].dateStart).format("x") != moment(oldValue[g].dateStart).format("x")) {
                                $scope.buildMonthView();
                                return;
                            }
                            if (moment(newValue[g].dateEnd).format("x") != moment(oldValue[g].dateEnd).format("x")) {
                                $scope.buildMonthView();
                                return;
                            }
                        }
                    }
                , true);
                
    $scope.buildMonthView();
}]);

angular.module("angularCalendarDirective").controller("angular-calendar-week-view-controller", ["$scope", function ($scope) {

}]);
angular.module("angularCalendarDirective").controller("angular-calendar-year-view-controller", ["$scope", function ($scope) {

}]);
angular.module("angularCalendarDirective").controller("angular-calendar-day-view-controller", ["$scope", function ($scope) {

}]);