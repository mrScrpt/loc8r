(()=>{
  angular
    .module('loc8rApp')
    .service('geolocation', geolocation);

  function geolocation () { //функция, должна быть не  стрелочной
    const getPosition = new Promise((resolve, reject)=>{
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });

    return{
      getPosition: getPosition
    };
  }
})();