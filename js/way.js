var
userCoordinates, tasks = JSON.parse(localStorage.getItem("tasks")),
params, i = localStorage.getItem("count"), j, refsPoints = [],
labels = [], times = [], longs = [],  pathTime = [], arriveTime = [], h;
if (localStorage.getItem("changes")) {
  params = JSON.parse(localStorage.getItem("params"));
} else {
  params = {
    "darkTheme": false,
    "leeway": 10,
    "taskTime": 15,
    "transport": "masstransit"
  };
}

ymaps.ready(init);
function init() {
  var myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 7
  });
  myMap.controls.remove('fullscreenControl').remove('searchControl').remove('rulerControl');

  function calculateTime( pathTime ) {
      console.table( pathTime );
      for( let g=i-1; g>=0; g-- ){
        let startTime = toMinutes( times[g].split(":") ) - pathTime[g];
        if( g-1 >= 0 ){
          if( startTime < toMinutes(times[g-1].split(":")) + parseInt(longs[g-1]) ){
            times[g-1] = toHours( startTime - parseInt(longs[g-1]) );
            iziToast.show({
              title: 'Изменения',
              message: 'Время начала ' + g + ' задания теперь составляет ' + times[g-1],
              color: 'orange',
              transitionIn: 'flipInX',
              transitionOut: 'flipOutX',
              position: 'bottomRight'
            });
          }
        }
      }
      refsPoints.forEach(function( elem, index ){
        if( elem[0] != null && elem[1] !=null && h == undefined ) {
          h = index;
        }
      });
      let result = toMinutes( times[h].split(":") ) - pathTime[0];
      $(".time-to-go-span").text("⠀" + toHours(result - leeway ) );
  }

  function getPathTime( multiRoute ) {
    var activeRoute = multiRoute.getActiveRoute();
    var activeRoutePaths = activeRoute.getPaths();
    //console.log("Время прохождения всего пути: " + activeRoute.properties.get("duration").text);
    j = 0;
    activeRoutePaths.each(function(path) {
      pathTime[j] = path.properties.get("duration").text.replace(/[^ 0-9]/gim,'').split(" ");
      if( pathTime[j].length > 1 ){
        pathTime[j] = toMinutes( pathTime[j] );
      } else {
        pathTime[j]  = pathTime[j][0] * 1;
      }
      j++;
    });
  }

  function nameBaloons( multiRoute ) {
    let wayPointIndex = 1;
    for( j=1; j<=labels.length; j++ ){
      yandexWayPoint = multiRoute.getWayPoints().get(wayPointIndex);
      let thisCoords = yandexWayPoint.geometry.getCoordinates();
      let label = labels[j-1];
      let time = times[j-1];
      let long = longs[j-1];
      let content = "<span style='font-size: large;'>"+label+"</span>  <br>  <span>В "+time+"</span>  <br>  <small style='color: gray;'>Длительность: "+long+" минут</small> ";
      yandexWayPoint.events.add(['click', 'contextmenu'], function(e) {
        setTimeout(function(){
          myMap.balloon.open(thisCoords, content);
        }, 100);
      });
      wayPointIndex++;
    }
  }

  function buildRoute() {
    multiRoute = new ymaps.multiRouter.MultiRoute({
      // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
      referencePoints: refsPoints,
      params: {
        routingMode: transport,
        avoidTrafficJams: true,
        reverseGeocoding: true
      }
    }, {
      boundsAutoApply: true
    });
    myMap.geoObjects.add(multiRoute);
    multiRoute.model.events.add('requestsuccess', function() {
      getPathTime( multiRoute );
      calculateStartTimes();
      calculateTime( pathTime );
      nameBaloons(multiRoute);
    });
  }

  if( i > 0 ) {
    refsPoints = tasks["coordinates"];
    labels = tasks["text"];
    times = tasks["time"];
    longs = tasks["long"];
    leeway = params["leeway"];
    transport = params["transport"];

    let j=0;
    while( j<i ){
      if( refsPoints[j][0] == null || refsPoints[j][1] == null ){
        refsPoints.splice(j, 1);
        labels.splice(j, 1);
        times.splice(j, 1);
        longs.splice(j, 1);
        i--;
      }
      else {
        j++;
      }
    }
  }
  ymaps.geolocation.get({  provider: 'auto'  }).then( function(result) {
    refsPoints.unshift(result.geoObjects.get(0).geometry.getCoordinates());
    buildRoute();
  });

}

/******************************************************************************/
$(document).ready(function(){
  var dialogReg = document.querySelector('.register-dialog');
  var showDialogButtonReg = document.querySelector('.show-register-dialog');

  if (! dialogReg.showModal) {
    dialogPolyfill.registerDialog(dialogReg);
  }
  showDialogButtonReg.addEventListener('click', function() {
    dialogReg.showModal();
  });

  dialogReg.querySelector('.register-dialog--close').addEventListener('click', function() {
    dialogReg.close();
    localStorage['code'] = '';

    $(".mdl-spinner").css("display", "none");
    $("#send-code").text("Зарегестрироваться");
    $("#send-code").prop("disabled", true);
    $("#send-code").attr("onclick", "sendCode();");
    if( params['darkTheme'] ){ $("#send-code").css("color", "#2C2F35"); }     else { $("#send-code").css("color", "#BDBDBD"); }

    $("#register-form").css("display", "block");
    $(".code-field").css("display", "none");

    $("#mail-field").val("");
    $("#password-field").val("");
    $("#pass-field").val("");
    $("#mail-field-div").removeClass("is-dirty").removeClass("is-invalid");
    $("#password-field-div").removeClass("is-dirty");
    $("#pass-field-div").removeClass("is-dirty");

    if( counter % 2 ){
      showPassword();
    }
  });


  var dialogLog = document.querySelector('.login-dialog');
  var showDialogButtonLog = document.querySelector('.show-login-dialog');

  if (! dialogLog.showModal) {
    dialogPolyfill.registerDialog(dialogLog);
  }
  showDialogButtonLog.addEventListener('click', function() {
    dialogLog.showModal();
  });

  dialogLog.querySelector('.login-dialog--close').addEventListener('click', function() {
    dialogLog.close();

    $("#login-field").val("");
    $("#parole-field").val("");
    $("#login-field-div").removeClass("is-invalid").removeClass("is-dirty");
    $("#parole-field-div").removeClass("is-invalid").removeClass("is-dirty");

  });
});
