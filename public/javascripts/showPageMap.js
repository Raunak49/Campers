  mapboxgl.accessToken = token;
  const map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v11', 
  center: campground.geometry.coordinates, 
  zoom: 9, 
  projection: 'globe' 
  });
  map.on('style.load', () => {
  map.setFog({}); 
  });
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
  .setHTML(
    `<h5>${campground.title}</h5>`
  )
)
.addTo(map)