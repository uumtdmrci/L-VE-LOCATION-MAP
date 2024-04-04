
var map;
var markers = []; 
var infowindows = [];  

function initialize() {
	var mapProp = {
		center: new google.maps.LatLng(40.954632462998354, 29.130455579687904),
		zoom: 10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [
			{
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#f5f5f5"
				}
			]
			},
			{
			"elementType": "labels.icon",
			"stylers": [
				{
				"visibility": "off"
				}
			]
			},
			{
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#616161"
				}
			]
			},
			{
			"elementType": "labels.text.stroke",
			"stylers": [
				{
				"color": "#f5f5f5"
				}
			]
			},
			{
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#bdbdbd"
				}
			]
			},
			{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#eeeeee"
				}
			]
			},
			{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#757575"
				}
			]
			},
			{
			"featureType": "poi.park",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#e5e5e5"
				}
			]
			},
			{
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#9e9e9e"
				}
			]
			},
			{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#ffffff"
				}
			]
			},
			{
			"featureType": "road.arterial",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#757575"
				}
			]
			},
			{
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#dadada"
				}
			]
			},
			{
			"featureType": "road.highway",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#616161"
				}
			]
			},
			{
			"featureType": "road.local",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#9e9e9e"
				}
			]
			},
			{
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#e5e5e5"
				}
			]
			},
			{
			"featureType": "transit.station",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#eeeeee"
				}
			]
			},
			{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
				"color": "#c9c9c9"
				}
			]
			},
			{
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [
				{
				"color": "#9e9e9e"
				}
			]
			}
		] 
	};

	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	
	 <cfoutput query="locat">
		var marker = new google.maps.Marker({
			position: { lat: #LAT#, lng: #LON# },
			map: map
		});
		markers.push(marker); // Add marker to markers array
		
		// Create infowindow for each marker
		var infowindow = new google.maps.InfoWindow({
			content: '<div>#MANAGER_NAME#</div>'
		});
		infowindows.push(infowindow); // Add infowindow to infowindows array

		// Open infowindow for each marker
		infowindow.open(map, marker);
	</cfoutput>
}

function updateMap(locations) {
  
	if (markers.length === 0) {
		initialize();
	}

	for (var i = 0; i < locations.length; i++) { 
		if (markers[i]) { 
			markers[i].setPosition(new google.maps.LatLng(locations[i].lat, locations[i].lon)); 
			infowindows[i].setContent('<div>' + locations[i].manager + '</div>');
		} else { 
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i].lat, locations[i].lon),
				map: map
			});
			markers.push(marker);  

			var infowindow = new google.maps.InfoWindow({
				content: '<div>' + locations[i].manager + '</div>'
			});
			infowindows.push(infowindow);  

			infowindow.open(map, marker);
		}
	}
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			$.ajax({
				type: 'POST',
				data: { cfId: <cfoutput>#cfId#</cfoutput>,lat: position.coords.latitude, lon: position.coords.longitude ,man:<cfoutput>#manager_id_#</cfoutput>},
				url: 'cfc/umut.cfc?method=locations&returnformat=json',
				success: function(response) {  
					var jsonParsed = JSON.parse(response);  
					var data = jsonParsed.DATA;  
					var userLocations = [];  
					for (var i = 0; i < data.length; i++) {
						var lat = parseFloat(data[i][2]);  
						var lon = parseFloat(data[i][3]);  
						var manager = data[i][1]; 
						userLocations.push({ lat: lat, lon: lon, manager: manager });  
					}  
					updateMap(userLocations); 
				}
			});
		});
	}
}

$(document).ready(function() {
	initialize();  
	setInterval(getLocation, 10000);  
});
