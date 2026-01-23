let center = [55.027423, 82.96716];

function init() {
  let map = new ymaps.Map("map", {
    center: center,
    zoom: 17,
  });

  // SVG иконка
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16" fill="none">
      <path d="M8 1C4.6862 1 2 3.6862 2 7C2 8.6563 2.6711 10.156 3.7565 11.2417C4.8422 12.328 7.4 13.9 7.55 15.55C7.57249 15.7974 7.7516 16 8 16C8.2484 16 8.42751 15.7974 8.45 15.55C8.6 13.9 11.1578 12.328 12.2435 11.2417C13.3289 10.156 14 8.6563 14 7C14 3.6862 11.3138 1 8 1Z" fill="#FF4433"/>
      <path d="M8.00002 9.10015C9.15982 9.10015 10.1 8.15994 10.1 7.00015C10.1 5.84035 9.15982 4.90015 8.00002 4.90015C6.84023 4.90015 5.90002 5.84035 5.90002 7.00015C5.90002 8.15994 6.84023 9.10015 8.00002 9.10015Z" fill="white"/>
    </svg>
  `;

  // Создаем макет для иконки
  const iconLayout = ymaps.templateLayoutFactory.createClass(
    `<div style="width: 40px; height: 40px;">${svgIcon}</div>`,
  );

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
      iconLayout: iconLayout, // Используем нашу кастомную иконку
      iconShape: {
        type: "Circle",
        coordinates: [0, 0],
        radius: 20,
      },
      balloonAutoPan: false,
      balloonOffset: [-50, -40],
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
