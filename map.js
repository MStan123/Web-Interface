      let map;
      let directionsService;
      let directionsRenderer;

      function haversine_distance(mk1, mk2) {
        var R = 3958.8; // Radius of the Earth in miles
        var rlat1 = mk1.getPosition().lat() * (Math.PI / 180); // Convert degrees to radians
        var rlat2 = mk2.getPosition().lat() * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon = (mk2.getPosition().lng() - mk1.getPosition().lng()) * (Math.PI / 180); // Radian difference (longitudes)

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
        return d;
      }

      function initMap() {
        const mapOptions = {
          zoom: 10,
          center: { lat: 40.344, lng: 49.850 },
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        const marker = new google.maps.Marker({
          position: { lat: 40.344, lng: 49.850 },
          map: map,
        });
        const mark = new google.maps.Marker({
          position: { lat: 40.387, lng: 49.819 },
          map: map,
        });

        // Calculate and display the distance between markers
        var distance = haversine_distance(marker, mark);
        document.getElementById('msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " mi.";

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map); // Existing map object displays directions

        // Create route from existing points used for markers
        const route = {
          origin: marker.getPosition(),
          destination: mark.getPosition(),
          travelMode: 'DRIVING'
        };

        directionsService.route(route, function (response, status) { // anonymous function to capture directions
          if (status !== 'OK') {
            window.alert('Directions request failed due to ' + status);
            return;
          } else {
            directionsRenderer.setDirections(response); // Add route to the map
            var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
            if (!directionsData) {
              window.alert('Directions request failed');
              return;
            } else {
              document.getElementById('msg').innerHTML += " Driving distance is " + directionsData.distance.text + " (" + directionsData.duration.text + ").";
            }
          }
        });
      }

      window.initMap = initMap;