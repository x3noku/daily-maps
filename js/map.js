var i, myMap, userCoordinates;

ymaps.ready(init);

function init() {

  ymaps.geolocation.get().then(
    function(result) {
      userCoordinates = result.geoObjects.get(0).geometry.getCoordinates();
      myMap.geoObjects.add(result.geoObjects);
      myMap.setCenter(userCoordinates);
    });
    myMap = new ymaps.Map("map", {
      center: [55.751029, 37.617622],
      // Zoom Level
      zoom: 13
    });
    var searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search'
        }
    });
    var fullScreenButton = window.fullScreenButton = new ymaps.control.Button({
      data: {
        image: 'img/fullscreen.svg'
      }
    });
    fullScreenButton.events
    .add("select", function(e){
      focusOnInput('focus');
      fullScreenButton.data.set({
        image: 'img/voidscreen.svg'
      });
    })
    .add("deselect", function(e){
      focusOnInput('blur');
      fullScreenButton.data.set({
        image: 'img/fullscreen.svg'
      });
    });

    myMap.controls
      .add(searchControl)
      .add(fullScreenButton, {float: 'right'})
      .remove('fullscreenControl')
      .remove('searchControl')
      .remove('typeSelector')
      .remove('rulerControl');
    window.myCollection = new ymaps.GeoObjectCollection({}, {
        preset: 'islands#redIcon',
        draggable: true
      }), window.myPlacemark;

    myMap.events.add(['click', 'contextmenu'], function(e) {
      window.coords = e.get('coords');
      myCollection.removeAll();
      delete myPlacemark;
      myPlacemark = new ymaps.Placemark(coords);
      myCollection.add(myPlacemark);
      myMap.geoObjects.add(myCollection);

    });

    myCollection.events.add('dragend', function(e) {
      coords = myCollection.get(myCollection.getLength() - 1).geometry.getCoordinates();
    });
}
