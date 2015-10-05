angular.module("calendar-sample-app").controller("sample-explain-controller", ["$scope", "$http", function ($scope, $http) {

    $scope.sample = {
        explain: "SampleCalendars/explain-basic-html.html"
    };

    $scope.setSample = function (sample) {
        $scope.sample.explain = sample;
    }
}]);