var cityData;
var stringOfCityIDs = "";
var latt;
var longg;

app.controller("cesiumCtrl", function($scope,$http) {
    window.viewer = new Cesium.Viewer('cesiumContainer', {
        sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
        timeline: false
    });

	initialize();
});


function initialize() {
        var address = (document.getElementById('my-address'));
        var autocomplete = new google.maps.places.Autocomplete(address);
        autocomplete.setTypes(['geocode']);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
        }
      });
}
function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById("my-address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      latt = results[0].geometry.location.lat();
      longg = results[0].geometry.location.lng();
	 forSearchedCity(latt,longg);
      } 
      else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
    
  }

function GeneratePopulationData(){
  try{
    window.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../SampleData/ne_10m_us_states.topojson'));
    viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(-98.0, 40.0), new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }
  catch(err){
    alert(err);
  }

}
 
function GenerateTemperatureData(){
  try{
    window.viewer.dataSources.add(Cesium.KmlDataSource.load('../SampleData/kml/ndfd-maxt.kml'));
    viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(-98.0, 40.0), new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }
  catch(err){
    alert(err);
  }
}

function GenerateLatestDetails(){
  try{
    window.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../SampleData/LatestEarthQuakes.topojson'));
  }
  catch(err){
    alert(err);
  }
}

function GenerateTotalDetails(){
  try{
    window.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../SampleData/EarthQuake.topojson'));
  }
  catch(err){
    alert(err);
  }
}
function GenerateWorldBoundaries(){
  try{
    window.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../SampleData/WorldBoundaries.topojson'));
  }
  catch(err){
    alert(err);
  }
}

function GenerateRacingTrack(){
  try{
      window.viewer.dataSources.add(Cesium.KmlDataSource.load('../SampleData/kml/c6002014.kml'));
      window.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(-71.0, 18.0), new Cesium.Cartesian3(0.0, -479000.0, 3930000.0));
      window.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }
  catch(err){
    alert(err);
  }
}
function getOptions(){
  var stringOfLayers = "";
  if(document.getElementById("RAIL").checked){
    if(stringOfLayers == ""){
      stringOfLayers += document.getElementById("RAIL").value; 
    }
    else{
      stringOfLayers = stringOfLayers + ","+ document.getElementById("RAIL").value;    
    }
    
  }
  if(document.getElementById("ROADS").checked){
    if(stringOfLayers == ""){
      stringOfLayers += document.getElementById("ROADS").value; 
    }
    else{
      stringOfLayers = stringOfLayers + ","+ document.getElementById("ROADS").value;    
    }
     
  }
  if(document.getElementById("AIR").checked){
    if(stringOfLayers == ""){
      stringOfLayers += document.getElementById("AIR").value; 
    }
    else{
      stringOfLayers= stringOfLayers + ","+ document.getElementById("AIR").value;      
    }
    
  }
  if(document.getElementById("CANAL").checked){
    if(stringOfLayers == ""){
      stringOfLayers += document.getElementById("CANAL").value; 
    }
    else{
      stringOfLayers = stringOfLayers + ","+ document.getElementById("CANAL").value;    
    }
     
  }
  if(document.getElementById("RESERVE").checked){
    if(stringOfLayers == ""){
      stringOfLayers += document.getElementById("RESERVE").value; 
    }
    else{
     stringOfLayers = stringOfLayers + ","+ document.getElementById("RESERVE").value;    
    }
      
  }
  alert(stringOfLayers);
  var imageryLayers = window.viewer.imageryLayers;
  imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url : 'http://nationalmap.nicta.com.au/proxy/http://geoserver-nm.nicta.com.au/geotopo_250k/ows',
    layers : stringOfLayers,
    parameters : {
        transparent : true,
        format : 'image/png'
    }
}));
// Start off looking at Australia.
viewer.camera.viewRectangle(Cesium.Rectangle.fromDegrees(114.591, -45.837, 148.970, -5.730));

}

function forCurrentCity(){
	var xmlhttp = new XMLHttpRequest();
	var currentLocationURL="http://openweathermap.org/help/city_list.txt";
	console.log("Hy");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
			var CityId = xmlhttp.responseText;

			console.log(CityId);
			
	}
	console.log("I am here ");
	xmlhttp.open("GET", currentLocationURL, true);
	xmlhttp.send();
}
}

function readFileAndMakeList(file){
	var xmlhttp;
	if (window.XMLHttpRequest)
  	{
   		xmlhttp=new XMLHttpRequest();
  	}
	else
  	{
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	xmlhttp.onreadystatechange=function()
  	{
  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
    	{
      		var text = xmlhttp.responseText;
      		var format = text.split('\n');
      		var i;
      		var cityID;
      		
      		for(i=1; i<10;i++){
        		cityID = format[i].match(/[0-9]{4,7}/i);
        		if(stringOfCityIDs == "")
          			stringOfCityIDs = stringOfCityIDs + cityID;
        		else
          			stringOfCityIDs = stringOfCityIDs + "," + cityID;
        	}
        	 alert("Hi");
    	}
  	}
	xmlhttp.open("GET",file,false);
	xmlhttp.send();
}


function forSearchedCity(latitude,longitude){

    var isMobileVersion = document.getElementsByClassName('chart');
    if (isMobileVersion.length > 0) {
       $('.chart').remove();            // elements with class "snake--mobile" exist
    }
	window.viewer.camera.flyTo({
   				 destination : Cesium.Cartesian3.fromDegrees(longitude,latitude,15000)
			});
	var xmlhttp;
	if (window.XMLHttpRequest)
  	{// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}
	else
  	{// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
    	{	
    		var city = [];
    		var cityDataJSON = JSON.parse(xmlhttp.responseText).query;
    		var temperature = [cityDataJSON.results.channel.item.forecast[0].high, cityDataJSON.results.channel.item.forecast[1].high, cityDataJSON.results.channel.item.forecast[2].high,cityDataJSON.results.channel.item.forecast[3].high, cityDataJSON.results.channel.item.forecast[4].high],
            date = [cityDataJSON.results.channel.item.forecast[0].date.split(" ").splice(0,2), cityDataJSON.results.channel.item.forecast[1].date.split(" ").splice(0,2), cityDataJSON.results.channel.item.forecast[2].date.split(" ").splice(0,2), cityDataJSON.results.channel.item.forecast[3].date.split(" ").splice(0,2), cityDataJSON.results.channel.item.forecast[4].date.split(" ").splice(0,2)],
            range = [0, 30, 60, 90, 120],
            chart,
            width = 400,
            bar_height = 20,
            height = bar_height * date.length,
            left_width = 100;
        var x, y;
        x = d3.scale.linear()
              .domain([0, d3.max(temperature)])
              .range([0, width]);
        var gap = 2;
        y = d3.scale.ordinal()
              .domain(temperature)
              .rangeBands([0, (bar_height + 2 * gap) * date.length]);

        chart = d3.select("#bargraph")
                  .append('svg')
                  .attr('class', 'chart')
                  .attr('width', left_width + width + 40)
                  .attr('height', (bar_height + gap * 2) * date.length + 30)
                  .append("g")
                  .attr("transform", "translate(10, 20)");


        chart.selectAll("rect")
                  .data(temperature)
                  .enter().append("rect")
                  .attr("x", left_width)
                  .attr("y", function(d, i) { return i * 25; })
                  .attr("width", x)
                  .attr("height", bar_height);

        chart.selectAll("text.score")
                  .data(temperature)
                  .enter().append("text")
                  .attr("x", function(d) { return x(d) + left_width; })
                  .attr("y", function(d, i){ return (i* 25)+10;} )
                  .attr("dx", -5)
                  .attr("dy", ".36em")
                  .attr("text-anchor", "end")
                  .attr('class', 'score')
                  .text(String);

        chart.selectAll("text.name")
                  .data(date)
                  .enter().append("text")
                  .attr("x", left_width / 2)
                  .attr("y", function(d, i){ return (i* 25)+10; } )
                  .attr("dy", ".36em")
                  .attr("text-anchor", "middle")
                  .attr('class', 'name')
                  .text(String);

                  chart.selectAll("line")
                  .data(range)
                  .enter().append("line")
                  .attr("x1", function(d) { return x(d) + left_width; })
                  .attr("x2", function(d) { return x(d) + left_width; })
                  .attr("y1", 0)
                  .attr("y2", (bar_height + gap * 2) * date.length);
 
        chart.selectAll(".rule")
                  .data(range)
                  .enter().append("text")
                  .attr("class", "rule")
                  .attr("x", function(d) { return x(d) + left_width; })
                  .attr("y", 0)
                  .attr("dy", -6)
                  .attr("text-anchor", "middle")
                  .attr("font-size", 10)
                  .text(String);

      document.getElementById("bargraph").style.display = "initial";
      //console.log(cityDataJSON.results.channel.title.split('-')[1]);
    	var desc='<h2>City : '+cityDataJSON.results.channel.title.split('-')[1] +'</h2><h4>Coord : lon - '+longitude+', lat -'+latitude+ '</h4><h4>Sunrise :'+cityDataJSON.results.channel.astronomy.sunrise+'</h4><h4>Sunset :'+cityDataJSON.results.channel.astronomy.sunset+'</h4><h4>Weather :'+cityDataJSON.results.channel.item.forecast[0].text+'</h4><h4>Temp :'+cityDataJSON.results.channel.item.condition.temp+'</h4><h4>Pressure :'+cityDataJSON.results.channel.atmosphere.pressure+'</h4>\
			             <h4>Humidity :'+cityDataJSON.results.channel.atmosphere.humidity+'</h4>';
			var imageIcon = "./icons/"+cityDataJSON.results.channel.item.condition.code+".gif";
			city[0] = window.viewer.entities.add({
			         name : cityDataJSON.results.channel.title.split('-')[1],
			         description : desc,
              position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
                point : {
                pixelSize : 4,
                color : Cesium.Color.BLUE,
                outlineColor : Cesium.Color.YELLOW,
                outlineWidth : 2
                },
                billboard : {
                image : imageIcon,
                width : 30,
                height : 30
                },
                label : {
                text : cityDataJSON.results.channel.title.split('-')[1],
                font : '12pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, -9)
                }
			});
    	}
  	}
	xmlhttp.open("GET","https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.placefinder where text='"+latt+","+longg+"' and gflags='R')&format=json",true);
	xmlhttp.send();

}

/*google.maps.event.addDomListener(window, 'load', initialize);
*/