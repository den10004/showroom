let center = [55.027423, 82.96716];

function init() {
  let map = new ymaps.Map("map", {
    center: center,
    zoom: 17,
  });

  let balloonContent = `
    <div style="width: 140px; padding: 5px; border-radius: 5px !important; background: white;">
      <p>ул. Гаранина 15к3</p>
    </div>
  `;

  let placemark = new ymaps.Placemark(
    center,
    {
      balloonContent: balloonContent,
    },
    {
      preset: "islands#redStretchyIcon",
      iconImageSize: [80, 80],
      iconImageOffset: [0, 0],
      balloonAutoPan: false,
      balloonOffset: [-50, -70],
      balloonCloseButton: false,
      hideIconOnBalloonOpen: false,
      balloonPanelMaxMapArea: 0,
      balloonShadow: false,
      balloonLayout: ymaps.templateLayoutFactory.createClass(balloonContent),
    },
  );

  map.controls.remove("geolocationControl");
  map.controls.remove("searchControl");
  map.controls.remove("trafficControl");
  map.controls.remove("typeSelector");
  map.controls.remove("fullscreenControl");
  map.controls.remove("zoomControl");
  map.controls.remove("rulerControl");

  map.geoObjects.add(placemark);

  setTimeout(function () {
    placemark.balloon.open();

    const balloon = document.querySelector(".ymaps-balloon");
    if (balloon) {
      balloon.style.borderRadius = "12px";
      balloon.style.overflow = "hidden";
    }
  }, 300);
}

ymaps.ready(init);
