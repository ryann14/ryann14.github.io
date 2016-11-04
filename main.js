'use strict';

var videoElement = document.querySelector('video');
var backSourceId;

var engineeringLatitude = 37.584596;
var engineeringLongitude = 127.026551;
var medicalLatitude = 37.587698;
var medicalLongitude = 127.026980;
var libralLatitude = 37.587740;
var libralLongitude = 127.031282;
var koreaLimitKm = 0.5;

var yonseiLatitude = 37.562415;
var yonseiLongitude = 126.941025;
var yonseiLimitKm = 1;

var x = document.getElementById("demo");
var btnBall = document.getElementById("btn-ball");
var imgPokemon = document.getElementById("img-pokemon");

btnBall.addEventListener('click', function (event) {
  
});

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = sourceInfos.length - 1; i >= 0; --i) {
    var sourceInfo = sourceInfos[i];
        backSourceId = sourceInfo.id;
        start();
        break;
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
        //alert("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
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
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  
  x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
    
  var engineeringDistance = calcCrow(latitude, longitude, engineeringLatitude, engineeringLongitude).toFixed(1);
  var libralDistance = calcCrow(latitude, longitude, libralLatitude, libralLongitude).toFixed(1);
  var medicalDistance = calcCrow(latitude, longitude, medicalLatitude, medicalLongitude).toFixed(1);
  
  var minDistance = Math.min(Math.min(engineeringDistance, libralDistance), medicalDistance);
  
  console.log("min distance:" + minDistance + "," + engineeringDistance + "," + libralDistance + ", " + medicalDistance);
    
  switch(minDistance) {
    case engineeringDistance:
      console.log("pikachu");
      imgPokemon.style.background = "url('http://www.pngmart.com/files/2/Pikachu-PNG-HD.png')";
      break;
    case libralDistance:
      console.log("liako");
      imgPokemon.style.background = "url('http://vignette3.wikia.nocookie.net/pokemon/images/a/af/158%EB%A6%AC%EC%95%84%EC%BD%94.png/revision/latest?cb=20101019232247&path-prefix=ko')";
      break;
    case medicalDistance:
    default:
      console.log("eveee");
      imgPokemon.style.background = "url('http://vignette4.wikia.nocookie.net/helixpedia/images/f/f2/Eevee.png/revision/latest?cb=20140507045218')";
      break;
  }
  imgPokemon.style.backgroundSize = "cover";
  
  console.log(minDistance);
  if (minDistance < 10) {
    console.log("visible");
    btnBall.style.display = 'visible';
    imgPokemon.style.display = 'visible';
  } else {
    console.log("none");
    btnBall.style.display = 'none';
    imgPokemon.style.display = 'none';
  }
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
