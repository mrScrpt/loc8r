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
   ,templateUrl: '/angular/templates/rating-stars.html'
 }
};

//Сервисы
//запрос к API
const loc8rData = function ($http) { //функция, должна быть не  стрелочной
  return $http.get('/api/locations?lng=-0.79&lat=51.3&maxDistance=20');
};

//Получение геолокации
const geolocation = function () {

  const getPosition = (cbSuccess, cbError, cbNoGeo)=> {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
    } else {
      cbNoGeo();
    }
  };
  return{
    getPosition: getPosition
  };
};


//Контроллеры
//Список местоположений
const locationListCtrl = ($scope, loc8rData, geolocation)=>{
  //geolocation.getPosition();
  $scope.message = "Определение вашего местоположения...";

  //Успешное получение данных
  $scope.getData = (position)=>{
    $scope.message = "Поиск место поблизости...";
    loc8rData
      .then((res)=>{
        const data = res.data;
        $scope.message = data.length > 0 ? "" : "Нет подходящих мест поблизости"
        $scope.data = {locations: data};
      })
      .catch((err)=>{
        $scope.message = "Что-то пошло не так";
        console.log(err);
      });
  };
  //Ошиюка при получении данных
  $scope.showError = (err)=>{
    $scope.$apply(()=>{
      $scope.message = err.message;
    })
  };

  //Метод геолокации неподдерживается
  $scope.noGeo = ()=>{
    $scope.$apply(()=>{
      $scope.message = "Определение местоположения не поддерживается вышим браузером";
    })
  };

  //Вызываем функцию попытки получить геолокацию
  geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);

};
//Приложение ангуляр
angular
  .module('loc8rApp', [])
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStar', ratingStar)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);
