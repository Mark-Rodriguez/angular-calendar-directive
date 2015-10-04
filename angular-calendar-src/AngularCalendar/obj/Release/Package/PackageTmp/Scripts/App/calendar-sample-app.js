﻿angular.module("calendar-sample-app", ["angularCalendarDirective", "angularDragAndDropDirective"]);
angular.module("calendar-sample-app").controller("calendar-sample-master-controller", ["$scope", function ($scope) {

    angular.element(window).on("keydown", function (e) {
    })

    $scope.settings = {
        sampleURL: "SampleCalendars/basic-sample-calendar.html"
    };

    $scope.clickSample = function (sample)
    {
        $scope.settings.sampleURL = "SampleCalendars/" + sample;
    }

}]);