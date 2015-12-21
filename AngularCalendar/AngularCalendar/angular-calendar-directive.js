angular.module("angularCalendarDirective", []).directive('angularCalendar', ["$compile", "$http", function ($compile, $http) {
    return {
        restrict: "AE", //Attributes and element names only. An element with the class name "angular-calendar" will not create a calendar.
        scope: {
            data:"=data", 
            calendarData: "=calendarData", //This object holds the event data for the calendar.
            calendarSettings: "=calendarSettings" //This object holds the visual settings and interaction functions for the calendar.
        },
        link: function link(scope, element, attrs) {
            var dir = "CalendarTemplates/"; //Default folder to hold calendar templates.
            
            if (scope.calendarSettings.eventDragSettings == null)
            {
                scope.calendarSettings.eventDragSettings = {
                    overlayTemplate:"<div class='dragging-overlay bg-primary row text-center' style='pointer-events:none;position:fixed;background-color: #333;padding:5px;-webkit-box-shadow: 4px 4px 13px 0px rgba(0,0,0,0.75);-moz-box-shadow: 4px 4px 13px 0px rgba(0,0,0,0.75);box-shadow: 4px 4px 13px 0px rgba(0,0,0,0.75);'></div>"
                }; //Set event drag settings if they have not yet been set. These settings are used by the drag and drop directive. The default settings build the overlay template for the events as they are dragged.
            }

            //This allows users to change the template directory in case the CalendarTemplates directory name or location causes them problems.
            if (attrs.calendarTemplateDirectory != null && attrs.calendarTemplateDirectory != undefined)
            {
                dir = attrs.calendarTemplateDirectory;

                if (dir.charAt(dir.length - 1) != "/")
                {
                    dir = dir + "/";
                }
            }

            //Changes the calendar view when the calendarSettings.view value is changed.
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

            //This is a function meant to be used outside the calendar directive code. It is accessible after the onInitialized function is called.
            scope.calendarSettings.setCalendarDate = function (date) {
                scope.calendarSettings.currentDate = date;

                if (scope.calendarSettings._internalDateChanged != null)
                {
                    scope.calendarSettings._internalDateChanged();
                }
            }

            //This is a function meant to be used outside the calendar directive code. It is accessible after the onInitialized function is called. Events are sorted by startDate ascending.
            scope.calendarSettings.sortEvents = function () {
                var sorted = [];

                var tmp = scope.calendarData.events.concat([]);

                while (tmp.length > 0) {
                    var low = 0;

                    for (var g = 0; g < tmp.length; g++) {
                        if (tmp[g].dateStart < tmp[low].dateStart) {
                            low = g;
                        }
                    }

                    sorted.push(tmp[low]);
                    tmp.splice(low, 1);
                }

                scope.calendarData.events = sorted;
            }
          
            //Loads the starting view of the calendar.
            $http.get(dir + scope.calendarSettings.view + '-calendar-template.html')
          .then(function (response) {
              element.html(response.data);
              $compile(element.contents())(scope);

              //This is called after the calendar object has been properly constructed.
              if (scope.calendarSettings.onInitialized != null) {
                  scope.calendarSettings.onInitialized();
              }
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

//Simple module that adds functionality to calendar navigation to buttons so the user doesnt have to.
//Here are the 3 different options for buttons. previous-time, current-time, next-time.
/*
            <div class="view-button" angular-calendar-time-btn calendar-settings="calendar.settings" previous-time>Previous</div>
            <div class="view-button" angular-calendar-time-btn calendar-settings="calendar.settings" current-time>Current</div>
            <div class="view-button" angular-calendar-time-btn calendar-settings="calendar.settings" next-time>Next</div>
*/
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

//The month view controller
angular.module("angularCalendarDirective").controller("angular-calendar-month-view-controller", ["$rootScope", "$scope", "$element", "$interval", function ($rootScope, $scope, $element, $interval) {
    
    //Internal month view functions and functionality.
    $scope._internal = {
        //Boolean indicating if the event starts before the start of the given day.
        eventSpanPreviousDay: function(event, day)
        {
            var ds = moment(event.dateStart);
            var dt = moment(day.date);

            dt.startOf("day");



            if (ds.diff(dt, "days") < 0) {
                return true;
            }

            if (ds.diff(dt, "days") > 0) {
                return true;
            }

            var millis = ds.diff(dt);

            if (millis < 0) {
                return true;
            }

            return false;
        },
        //Boolean indicating if the event ends before the end of the given day.
        eventSpanNextDay: function(event, day)
        {
            var ds = moment(event.dateStart);

            ds.add(15, "minutes");

            if (event.dateEnd != null) {
                ds = moment(event.dateEnd);
            }

            var dt = moment(day.date);

            dt.startOf("day");

            if (ds.diff(dt, "days") < 0) {
                return true;
            }

            if (ds.diff(dt, "days") > 0) {
                return true;
            }

            return false;
        },
        //This is used when calendarSettings.weekRowType == 'span' to help lay out the events of the selected day.
        getEventStyles: function (event, day) {
            var ind = day.events.indexOf(event);

            var rowHeight = $scope.calendarSettings.weekRowHeight
            var maxHeight = rowHeight - 40;

            var startingY = 35;
            
            var itemHeight = Math.max(15, maxHeight / day.events.length);

            var itemSpacing = Math.max(1, (maxHeight - itemHeight)) / Math.max(1, (day.events.length - 1));


            return { top:Math.round(startingY + ind * itemSpacing) + "px", bottom:(rowHeight - Math.round(startingY + ind * itemSpacing + itemHeight)) + "px", left: $scope._internal.getEventStartPercentOfDay(event, day), right: $scope._internal.getEventEndPercentOfDay(event, day) };
        },
        //This is used when calendarSettings.weekRowType == 'default' or null to help lay out the events of the selected day.
        getEventSubSpanStyles:function(event, day) {
            return { top:"0px", bottom:"0px", left: $scope._internal.getEventStartPercentOfDay(event, day), right: $scope._internal.getEventEndPercentOfDay(event, day) };
        },
        //Gets the "left" position of the event based on the 
        getEventStartPercentOfDay: function (event, day) {
            var ds = moment(event.dateStart);
            var dt = moment(day.date);

            dt.startOf("day");



            if (ds.diff(dt, "days") < 0) {
                return "-1px";
            }

            if (ds.diff(dt, "days") > 0) {
                return "-1px";
            }

            var millis = ds.diff(dt);

            if (millis < 0) {
                return "-1px";
            }

            return (millis / (60 * 60 * 24 * 1000)) * 100 + "%";

        },
        getEventEndPercentOfDay: function (event, day) {
            var ds = moment(event.dateStart);

            ds.add(15, "minutes");

            if (event.dateEnd != null) {
                ds = moment(event.dateEnd);
            }

            var dt = moment(day.date);

            dt.startOf("day");

            if (ds.diff(dt, "days") < 0) {
                return "-1px";
            }

            if (ds.diff(dt, "days") > 0) {
                return "-1px";
            }

            var millis = ds.diff(dt);

            return (1 - millis / (60 * 60 * 24 * 1000)) * 100 + "%";

        },
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

            var dt = moment(day.date);

            if (ds.dayOfYear() == dt.dayOfYear() && ds.year() == dt.year())
            {
                return ds.format("h:mm A") + " - " + de.format("MMM D, h:mm A");
            }
            else
            {
                if (de.dayOfYear() == dt.dayOfYear() && de.year() == dt.year())
                {
                    return ds.format("MMM D, h:mm A") + " - " + de.format("h:mm A");
                }
                else
                {
                    return ds.format("MMM D, h:mm A") + " - " + de.format("MMM D, h:mm A");
                }
            }
        },
        onEventDrop:function(dropElement, day, dragData)
        {
            //month view event shifting calculations

            var event = dragData.event;

            //If the event spans multiple days this is used to calculate 
            //from which day of the event this drag operation should be calculated.
            var dragFromDay = dragData.dragFromDay;

            var diff = moment(day.date).diff(dragFromDay, "days");

            //shift event start by diff days
            var es = moment(event.dateStart).add(diff, "days");

            var ee = null;

            if (event.dateEnd != null) {
                //shift event end by diff days
                ee = moment(event.dateEnd).add(diff, "days");
            }

            //if user has defined an on event time change function pass start and end times to function.
            //Otherwise auto change event dates.
            if ($scope.calendarData.onEventTimeChange != null) {
                if ($scope.calendarData.onEventTimeChange(dragData.event, es, ee))
                {
                    event.dateStart = es;
                    event.dateEnd = ee;
                }
            }
            else {
                event.dateStart = es;
                event.dateEnd = ee;
            }
        },
        onDayCloseClick: function(day)
        {
            $scope.monthView.selectedDay = null;

            for (var g = 0; g < $scope.monthView.weeks.length; g++) {
                $scope.monthView.weeks[g].selectedDay = null;
            }

            if ($scope.calendarSettings.onDayCloseClick != null) {
                $scope.calendarSettings.onDayCloseClick(day);
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
        },
        onWeekClick: function (week) {
            if ($scope.calendarSettings.onWeekClick != null) {
                $scope.calendarSettings.onWeekClick(week);
            }
        },
        onWeekDblClick: function (week) {
            if ($scope.calendarSettings.onWeekDblClick != null) {
                $scope.calendarSettings.onWeekDblClick(week);
            }
        },
        onWeekMouseOver: function (week) {
            if ($scope.calendarSettings.onWeekMouseOver != null) {
                $scope.calendarSettings.onWeekMouseOver(week);
            }
        },
        onWeekMouseOut: function (week) {
            if ($scope.calendarSettings.onWeekMouseOut != null) {
                $scope.calendarSettings.onWeekMouseOut(week);
            }
        },
        onWeekMouseDown: function (week) {
            if ($scope.calendarSettings.onWeekMouseDown != null) {
                $scope.calendarSettings.onWeekMouseDown(week);
            }
        },
        onWeekMouseUp: function (week) {
            if ($scope.calendarSettings.onWeekMouseUp != null) {
                $scope.calendarSettings.onWeekMouseUp(week);
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

        var selectedDay = null;

        if ($scope.monthView != null)
        {
            selectedDay = $scope.monthView.selectedDay;
        }

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

        var first = mom.clone().startOf("month");

        var last = mom.clone().endOf("month");

        var evts = [];

        var sund = first.clone().day("sunday").startOf("day");

        var endD = sund.clone().add(35, "days").endOf("day");

        var curr = sund.clone();

        var startWeek = sund.week();

        $scope.calendarSettings.sortEvents();

        for (var g = 0; g < $scope.calendarData.events.length; g++)
        {
            var e = $scope.calendarData.events[g];

            var ds = e.dateStart.clone == null ? moment(e.dateStart) : e.dateStart.clone();
            var de = ds;
            
            if (e.dateEnd != null)
            {
                ds = e.dateEnd.clone == null ? moment(e.dateEnd) : e.dateEnd.clone();
            }

            if (ds.diff(endD) <= 0)
            {
                if (de.diff(sund) >= 0)
                {
                    evts.push($scope.calendarData.events[g]);
                }
            }
        }

        for (var g = 0; g < evts.length; g++)
        {
            var first = true;

            if (evts[g].eventStyle == null) {
                evts[g].eventStyle = {};

                if (evts[g].backgroundColor != null) {
                    evts[g].eventStyle["background-color"] = evts[g].backgroundColor;
                }

                if (evts[g].color != null) {
                    evts[g].eventStyle["color"] = evts[g].color;
                }
            }
        }

        for (var g = 0; g < 5; g++) {
            $scope.monthView.weeks[g].days = [];

            var wn = sund.clone().add(g, "weeks").week();
            $scope.monthView.weeks[g].weekNumber = wn;

            $scope.monthView.weeks[g].start = curr.clone();

            for (var h = 0; h < 7; h++) {

                var day = {
                    week: $scope.monthView.weeks[g],
                    date: curr.clone(),
                    events: []
                };

                if (selectedDay != null) {
                    if (day.date.diff(selectedDay.date, "days") == 0) {
                        $scope.monthView.weeks[g].selectedDay = day;
                        $scope.monthView.selectedDay = day;
                    }
                }

                for (var i = 0; i < evts.length; i++)
                {
                    var ds = moment(evts[i].dateStart).startOf("day");
                    var de = null;

                    if (evts[i].dateEnd != null)
                    {
                        de = moment(evts[i].dateEnd).endOf("day");
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
                        day.events.push(evts[i]);
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
                                $scope.calendarSettings._internalDateChanged();
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