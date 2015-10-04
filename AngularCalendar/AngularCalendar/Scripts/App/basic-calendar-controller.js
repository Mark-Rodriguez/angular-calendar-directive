angular.module("calendar-sample-app").controller("basic-calendar-controller", ["$scope", function ($scope) {
    $scope.calendar =
    {
        settings:
        {
            view: "month",
            currentDate: new Date(),
            currentDateChanged: function (date) {

            },
            onDayDblClick:function(day)
            {
                $scope.calendar.settings.currentDate = day.date;
                $scope.calendar.settings.view = "day";
            },
            onDayMouseOver:function(day)
            {

            },
            onDayMouseUp:function(day)
            {

            }
        },
        data:
        {
        
            events:
                [
                    {
                        dateStart: new Date("10/09/2015 12:00:00 PM"),
                        dateEnd: new Date("10/09/2015 2:00:00 PM"),
                        color: "white",
                        backgroundColor: "#000",
                        name: "Birthday"
                    },
                    {
                        dateStart: new Date("10/09/2015 12:00:00 PM"),
                        dateEnd: new Date("10/09/2015 2:00:00 PM"),
                        color: "white",
                        backgroundColor: "#000",
                        name: "Birthday"
                    },
                    {
                        dateStart: new Date("10/09/2015 12:00:00 PM"),
                        dateEnd: new Date("10/09/2015 2:00:00 PM"),
                        color: "white",
                        backgroundColor: "#000",
                        name: "Birthday"
                    },
                    {
                        dateStart: new Date("10/09/2015 12:00:00 PM"),
                        dateEnd: new Date("10/09/2015 2:00:00 PM"),
                        color: "white",
                        backgroundColor: "#000",
                        name: "Birthday"
                    }
                ],
        }
    };

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

    $scope.testButton = function()
    {
        $scope.calendar.settings.currentDate = new Date("1/1/1988");
    }

    $scope.next = function () {
        $scope.calendar.settings.currentDate = moment($scope.calendar.settings.currentDate).add(1, "d");
    }

    $scope.setView = function(view)
    {
        $scope.calendar.settings.view = view;
    }
}])