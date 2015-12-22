angular.module("sample-calendar-app", ["angularCalendarDirective", "angularDragAndDropDirective"]);
angular.module("sample-calendar-app").controller("sample-calendar-controller", ["$scope", function ($scope) {
    $scope.calendar =
    {
        settings:
        {
            weekRowType: "default",
            //Change view to switch between calendar views. Valid values are "year", "month", "week", "day"
            view: "month",
            //Change currentDate to change the date range of the current calendar view.
            currentDate: new Date(),
            //Any time the currentDate changes this function will be called.
            currentDateChanged: function (date) {

            },
            //Triggered any time a day cell is double clicked.
            onDayDblClick: function (day) {
                $scope.calendar.settings.currentDate = day.date;
                $scope.calendar.settings.view = "day";
            },
            onWeekDblClick: function (week) {
                $scope.calendar.settings.currentDate = week.start;
                $scope.calendar.settings.view = "week";
            },
            //Triggered any time a day cell is moused over.
            onDayMouseOver: function (day) {

            },
            //Triggered any time the mouse button is released over a day cell.
            onDayMouseUp: function (day) {

            },
            onInitialized: function () {
                for (var g = 0; g < 250; g++) {
                    var d = new Date($scope.getRandomSpan(1, 12) + "/" + $scope.getRandomSpan(1, 28) + "/2015 " + $scope.getRandomSpan(1, 12) + ":00:00 PM");
                    $scope.calendar.data.events.push({
                        dateStart: d,
                        dateEnd: moment(d).add($scope.getRandomSpan(1, 5) * 150, "minutes"),
                        color: "white",
                        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        name: $scope.getRandomName()
                    });
                }

                $scope.calendar.settings.sortEvents();
            }
        },
        data:
        {
            //Triggered any time an event start or end date is altered by the calendar interface.
            //Return true and the event dates will be set automatically by the calendar.
            //Return false to manually handle event date modification.
            //If this function is not present on the data object the event dates are set automatically by default.
            onEventTimeChange: function (event, dateTimeStart, dateTimeEnd) {
                return true;

                /*
                //Manual event date setting example
                event.dateStart = dateTimeStart;
                event.dateEnd = dateTimeEnd;
                return false;
                */
            },
            events:
                [

                ],
        }
    };

    $scope.getRandomSpan = function (min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    $scope.getRandomName = function () {
        var firsts = ["Mark", "Adam", "Steve", "Ryan", "Eric", "Gavin", "Rachel", "Nikki", "Steph", "Bill"];

        var lasts = ["Stevens", "Mathews", "Kirchwood", "Rodriguez", "Billings", "Armani", "Willson", "Smith"];

        return lasts[$scope.getRandomSpan(0, lasts.length - 1)] + ", " + firsts[$scope.getRandomSpan(0, firsts.length - 1)];
    }


    $scope.getYear = function () {
        return moment($scope.calendar.settings.currentDate).format("YYYY");
    }

    $scope.getMonth = function () {
        return moment($scope.calendar.settings.currentDate).format("MMMM");
    }

    $scope.getWeek = function () {
        return moment($scope.calendar.settings.currentDate).week();
    }

    $scope.getDay = function () {
        return moment($scope.calendar.settings.currentDate).date();
    }

    $scope.setView = function (view) {
        $scope.calendar.settings.view = view;
    }
}])