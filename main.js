'use strict';

var videoElement = document.querySelector('video');
var backSourceId;

var engineeringLatitude = 37.584596;
var engineeringLongitude = 127.026551;
var engineeringLatitude = 37.587698;
var engineeringLongitude = 127.026980;
var libralLatitude = 37.587740;
var libralLongitude = 127.031282;
var koreaLimitKm = 0.5;

var yonseiLatitude = 37.562415;
var yonseiLongitude = 126.941025;
var yonseiLimitKm = 1;

var x = document.getElementById("demo");
var btnBall = document.getElementById("btn-ball");
btnBall.style.display = 'none';

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = sourceInfos.length - 1; i >= 0; --i) {
    var sourceInfo = sourceInfos[i];

    if (sourceInfo.kind === 'video') {
      if (sourceInfo.label.includes("back")) {
        backSourceId = sourceInfo.id;
        start();
      }

    }
  }
}

if (typeof MediaStreamTrack === 'undefined' ||
  typeof MediaStreamTrack.getSources === 'undefined') {
  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.play();
  console.log("video url" + videoElement.src);
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  if (window.stream) {
    videoElement.src = null;
    window.stream.getVideoTracks()[0].stop();
  }

  var videoSource = backSourceId;

  var constraints = {
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);

    navigator.geolocation.getCurrentPosition(
      function(position) {
        alert("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
      },
      function(error) {
        alert(error.message);
      }, {
        enableHighAccuracy: true,
        timeout: 5000
      }
    );
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;

  alert(calcCrow(position.coords.latitude, position.coords.longitude, engineeringLatitude, engineeringLongitude).toFixed(1));
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}
