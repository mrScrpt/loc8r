(()=>{
  angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);


  loc8rData.$inject = ['$http'];// Строка которая описывает зависимости для мнификации Uglify
  function loc8rData ($http) { //функция, должна быть не  стрелочной
    const locationByCoords = (lat,lng)=>{
      return $http.get(`/api/locations?lng=${lng}&lat=${lat}&maxDistance=1500`);
    };
    const locationById = (locationid)=>{
      return $http.get(`/api/locations/${locationid}`)
    };
    return{
      locationByCoords: locationByCoords
      ,locationById:locationById
    }
  }
})();