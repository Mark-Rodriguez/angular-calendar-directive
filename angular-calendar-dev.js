angular.module("test-app", ["angularCalendarDirective"]).controller("test-controller", ["$scope", function ($scope) {
    $scope.calendar =
    {
        settings:
        {
            data: "THIS?",
            view: "month",
            currentDate: new Date()
        }
    };

    $scope.next = function () {
        $scope.calendar.settings.currentDate = moment($scope.calendar.settings.currentDate).add(1, "d");
    }

    $scope.setView = function (view) {
        $scope.calendar.settings.view = view;
    }
}])