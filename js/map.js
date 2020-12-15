function initMap() {
  'use strict';

  const target = document.getElementById('target');
  const target2 = document.getElementById('target');
  const tarama = { lat: 24.668682100707706, lng: 124.70253061782172 };
  let map;
  let marker;
  let infoWindow;

  map = new google.maps.Map(target, {
    center: tarama,
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    // mapTypeId: 'satellite'
    mapTypeId: 'hybrid',
    clickableIcons: false,
  });

  marker = new google.maps.Marker({
    position: tarama,
    map: map,
    icon: {
      url: 'image/Pin.png',
      scaledSize: new google.maps.Size(29, 29)
    },
    // animation: google.maps.Animation.BOUNCE,
    animation: google.maps.Animation.DROP,
  });


  infoWindow = new google.maps.InfoWindow({
    position: tarama,
    content: 'COCO HOUSE',
    maxWidth: 100,
  });

  infoWindow.open(map);


  const result = document.getElementById('result')
  const result2 = document.getElementById('result2')

  //
  map.addListener('click', (e) => {
    result.textContent = `緯度は:${e.latLng.lat()}です`;
    result2.textContent = `経度は:${e.latLng.lng()}です`;
    console.log(e.latLng.toString());
    // map.setCenter(e.latLng);
    map.panTo(e.latLng);

    //
    marker = new google.maps.Marker({
      // position: e.latLng,
      map: map,
      title: e.latLng.toString(),
      animation: google.maps.Animation.BOUNCE,
      // animation: google.maps.Animation.DROP,
    });

    marker.addListener('click', () => {
      marker.setMap(null);
    });

    //
    geocoder.geocode({
      location: e.latLng,
    }, function (results, status) {
      if (status !== 'OK') {
        alert('Failed: ' + status)
        return;
      }
      if (results[0]) {
        const marker2 = new google.maps.Marker({
          position: e.latLng,
          map: map,
          title: results[0].formatted_address,
          animation: google.maps.Animation.DROP,
        });
        marker2.addListener('click', () => {
          marker2.setMap(null);
        });

      } else {
        alert('No result');
        return;
      }
      // results[0].formatted_address
    })


  });

  // Geocoding
  const search = document.getElementById('search');
  const address = document.getElementById('address');

  const search2 = document.getElementById('search2');
  const keyword = document.getElementById('keyword');

  const geocoder = new google.maps.Geocoder();

  search.addEventListener('click', () => {
    geocoder.geocode({
      address: document.getElementById('address').value
    }, function (results, status) {
      if (status !== 'OK') {
        alert('Failed: ' + status);
        return;
      }
      // results[0].geometry.location
      if (results[0]) {
        new google.maps.Map(target, {
          center: results[0].geometry.location,
          zoom: 15
        });
      } else {
        alert('No results found');
        return;
      }
    });
  });

  //
  let service;

  search2.addEventListener('click', () => {
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: tarama,
      radius: '800',
      name: keyword.value,
    }, (results, status) => {
      let marker;
      let i;
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (i = 0; i < results.length; i++) {
          marker = new google.maps.Marker({
            map: map,
            position: results[i].geometry.location,
            title: results[i].name
          });
          marker.addListener('click', () => {
            marker.setMap(null);
          });
        }
      } else {
        alert('Failed: ' + status);
        return;
      }
    });

    // Geolocation

    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      new google.maps.Map(target, {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 15
      });
    }, function () {
      alert('Geolocation failed!');
      return;
    });



  });




}