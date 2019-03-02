//Вспомагательные функции
//Проверка на число
const _isNumeric = (n)=>{
  return !isNaN(parseFloat(n) && isFinite(n));
};
//Форматирование расстояния
const formatDistance = ()=>{
  return (distance)=>{
    let numDistance, unit;
    if(distance && _isNumeric(distance)){
      if(distance > 1){
        numDistance = parseFloat(distance).toFixed(1);
        unit = ' км';
      }else {
        numDistance = parseInt(distance * 1000, 10)
        unit = ' м'
      }
      return numDistance + unit;
    }else {
      return "?";
    }


  };
};


//Сниппеты
const ratingStar = ()=>{
 return {
   scope: {
     thisRating: '=rating'
   }
   ,templateUrl: '/angular/templates/ratingStars.template.html'
 }
};

//Сервисы
//запрос к API
const loc8rData = function ($http) { //функция, должна быть не  стрелочной
  const locationByCoords = (lat,lng)=>{
    return $http.get(`/api/locations?lng=${lng}&lat=${lat}&maxDistance=1500`);
  };
  return{
    locationByCoords: locationByCoords
  }
};
//Получение геолокации
const geolocation = function () {
   const getPosition = new Promise((resolve, reject)=>{
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });

  return{
    getPosition: getPosition
  };
};


//Контроллеры
//Список местоположений
const locationListCtrl = ($scope, loc8rData, geolocation)=>{
  $scope.message = "Определение вашего местоположения...";
  geolocation.getPosition
    .then((position)=>{
      const
        lat = position.coords.latitude,
        lng = position.coords.longitude;
      $scope.message = "Поиск место поблизости...";
      loc8rData.locationByCoords(lat, lng)
        .then((res)=>{
          console.log(lat,lng);
          const data = res.data;
          $scope.message = data.length > 0 ? "" : "Нет подходящих мест поблизости"
          $scope.data = {locations: data};
        })
        .catch((err)=>{
          $scope.message = "Что-то пошло не так";
          console.log(err);
        });
    })
    .catch(err=>{
      $scope.$apply(()=>{
        $scope.message = err.message;
      })
    })

};
//Приложение ангуляр
angular
  .module('loc8rApp', [])
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStar', ratingStar)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);