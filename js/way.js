var
userCoordinates, tasks = JSON.parse(localStorage.getItem("tasks")),
params, i = localStorage.getItem("count"), j, refsPoints = [],
labels = [], times = window.times = [], longs = [],  pathTime = [], arriveTime = [], h,
emptyTimes = [];
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

function drawTaskList() {
  $(".task-list").empty();
  for( let j=0; j<i; j++ ){
    $(".task-list").append(
      '<li class="mdl-list__item mdl-list__item--three-line">'+
        '<span class="mdl-list__item-primary-content">'+
          '<i class="material-icons mdl-list__item-icon task-icon">trip_origin</i>'+
          '<span id="task-text">'+ labels[j] +'</span>'+
          '<span class="mdl-list__item-text-body">'+
            '<input class="mdl-textfield__input task-list-time" type="time" id="time-'+ j +'" value="'+times[j]+'" onblur="changeTaskTime('+j+');">'+
            ' ('+ longs[j] +' минут)'+
          '</span>'+
        '</span>'+
      '</li>');
  }
}

function changeTaskTime( x ) {
  let hTime = $("#time-"+x).val(),
    hLabel = labels[x],
    hLong = longs[x],
    hEmptyTime = emptyTimes[x],
    hRefsPoints = refsPoints[x];

    if( !hTime ){
      labels.splice(x, 1);
      times.splice(x, 1);
      longs.splice(x, 1);
      refsPoints.splice(x, 1);
      emptyTimes.splice(x, 1);

      labels.unshift(hLabel);
      times.unshift(hTime);
      longs.unshift(hLong);
      refsPoints.unshift(hRefsPoints);
      emptyTimes.unshift(1);

      window.changes = true;
    }
    else {
      window.changes = true;
      labels.splice(x, 1);
      times.splice(x, 1);
      longs.splice(x, 1);
      refsPoints.splice(x, 1);
      emptyTimes.splice(x, 1);

      labels.push(hLabel);
      times.push(hTime);
      longs.push(hLong);
      refsPoints.push(hRefsPoints);
      emptyTimes.push(hEmptyTime);

      for( j=0; j<i; j++ ){
        let myTime = toMinutes( hTime.split(":") );
        let thisTime = toMinutes( times[j].split(":") );
        if( myTime < thisTime ){
          labels.splice(j, 0, hLabel);
          times.splice(j, 0, hTime);
          longs.splice(j, 0, hLong);
          refsPoints.splice(j, 0, hRefsPoints);
          emptyTimes.splice(j, 0, 0);

          labels.pop();
          times.pop();
          longs.pop();
          refsPoints.pop();
          emptyTimes.pop();
          break;
        }
      }

    }
    drawTaskList();
}

ymaps.ready(init);
function init() {
  var myMap = window.myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 7
  });
  var listButton = window.listButton = new ymaps.control.Button({
    data: {
      image: '../img/list.svg'
    }
  });
  listButton.events.add('select', function() {
    dialogList.showModal();
    changes = window.changes = false;
    drawTaskList();
  });

  myMap.controls.remove('fullscreenControl').remove('searchControl').remove('rulerControl').add(listButton, {float: 'right'});

  function calculateStartTimes() {
    if( times[i-1] == '' ){
      times[i-1] = '14:00';
      emptyTimes[i-1] = 1;
    }
    for( j=i-2; j>=0; j-- ){
      if( times[j] == '' || emptyTimes[j] ){
        times[j] = toHours( toMinutes(times[j+1].split(":")) - pathTime[j+1] - longs[j] );
        emptyTimes[j] = 1;
      }
    }
    drawTaskList();
  }

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

  window.buildRoute = function() {
    multiRoute = window.multiRoute = new ymaps.multiRouter.MultiRoute({
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
    multiRoute.events.add('activeroutechange', function() {
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

  var dialogList = window.dialogList = document.querySelector('.list-dialog');

  if (! dialogList.showModal) {
    dialogPolyfill.registerDialog(dialogList);
  }
  dialogList.querySelector('.list-dialog--close').addEventListener('click', function() {
    dialogList.close();
    listButton.deselect();
    if( changes ){
      myMap.geoObjects.remove(multiRoute);
      buildRoute();
    }
  });



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
