// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var imageApp = angular.module('imageApp', ['ionic', 'ngCordova', 'firebase']);

//var fb = new Firebase('https://jfuki-posts.firebaseio.com/');




imageApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

imageApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('firebase', {
            url: '/firebase',
            templateUrl: 'templates/firebase.html',
            controller: 'FirebaseController',
            cache: false
        })
        .state('secure', {
            url: '/secure',
            templateUrl: 'templates/secure.html',
            controller: 'SecureController'
        });
    $urlRouterProvider.otherwise('/secure');
});


imageApp.controller('FirebaseController', function($scope, $state, $firebaseAuth) {

    var fbAuth = $firebaseAuth(fb);

    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go('secure');
        }).catch(function(error) {
            console.error('ERROR: ' + error);
        });
    }

    $scope.register = function(username, password) {
        console.log("Entering the function");
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go('secure');
        }).catch(function(error) {
            console.error('ERROR: ' + error);
        });
    };

})




imageApp.controller('SecureController', function($scope, $ionicHistory, $firebaseArray, $cordovaCamera) {

    
    
    $ionicHistory.clearHistory();

    var fb = new Firebase('https://jfuki-posts.firebaseio.com/');
    
    //$scope.images = $firebaseArray(fb);
    var syncArray = $firebaseArray(fb.child('images'));
    $scope.images = [];
      $scope.images = syncArray;
    
//
//    var fbAuth = fb.getAuth();
//    if(fbAuth) {
//        var userReference = fb.child('users/' + fbAuth.uid);
//        var syncArray = $firebaseArray(userReference.child('images'));
//        $scope.images = syncArray;
//    } else {
//        $state.go('firebase');
//    }

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData}).then(function() {
                alert('Image has been uploaded');
            });
        }, function(error) {
            alert.error(error);
        });
    }
    
    
    //Removin image
        $scope.removeImage = function(image){
        console.log('Enters the function');
        $scope.images.$remove(image);
      
    console.log('Leaves the function');
  };
    
   
    $scope.products=[];
    
    $scope.addFormSubmit = function(){
        
        
        
        if($scope.productName){var productName = $scope.productName}else{var productName= null;}
        if($scope.productCode){var productCode = $scope.productCode}else{var productCode = null;}
        if($scope.description){var description = $scope.description}else{var description = null;}
        
        
        $scope.products.$add({
            
                productName:productName,
                productCode:productCode,
                description:description
         
            
        });

    };
    
    function clearField (){
        $scope.productName = '';
        $scope.productCode = '';
        $scope.description = '';
    }

});