angular.module("calendar-sample-app", ["angularCalendarDirective", "angularDragAndDropDirective"]);
angular.module("calendar-sample-app").controller("calendar-sample-master-controller", ["$scope", function ($scope) {

    angular.element(window).on("keydown", function (e) {
    })

    $scope.settings = {
        sampleURL: "SampleCalendars/basic-sample-calendar.html",
        sampleExplainURL: "basic-sample-calendar-explain.html"
    };

    $scope.clickSample = function (sample)
    {
        $scope.settings.sampleURL = "SampleCalendars/" + sample;
        $scope.settings.sampleExplainURL = sample.substring(0, sample.indexOf(".html")) + "-explain.html";
    }

}]);