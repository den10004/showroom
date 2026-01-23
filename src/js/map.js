function init() {
  let map = new ymaps.Map("map", {
    center: [55.027423, 82.96716],
    zoom: 17,
  });

  var placemark = new ymaps.Placemark(
    [55.027423, 82.96716],
    {
      balloonContent: "ул Гаранина 15 к3",
    },
    {
      preset: "islands#redStretchyIcon", // Другая метка
      iconColor: "#ff0000", // Ярко-красный цвет
    },
  );

  map.geoObjects.add(placemark);
  placemark.balloon.open();
}

ymaps.ready(init);
