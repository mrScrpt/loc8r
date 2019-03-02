(()=>{
  angular
    .module('loc8rApp')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$scope', 'loc8rData', 'geolocation']; // Строка которая описывает зависимости для мнификации Uglify
  function homeCtrl ($scope, loc8rData, geolocation) {
    var vm = this;
    vm.pageHeader = {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    };
    vm.sidebar = {
      content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
    };

    vm.message = "Определение вашего местоположения...";
    geolocation.getPosition
      .then((position)=>{
        const
          lat = position.coords.latitude,
          lng = position.coords.longitude;
        vm.message = "Поиск место поблизости...";
        loc8rData.locationByCoords(lat, lng)
          .then((res)=>{
            const data = res.data;
            vm.message = data.length > 0 ? "" : "Нет подходящих мест поблизости"
            vm.data = {locations: data};
          })
          .catch((err)=>{
            vm.message = "Что-то пошло не так";
            console.log(err);
          });
      })
      .catch(err=>{
        $scope.$apply(()=>{
          vm.message = err.message;
        })
      })
  }
})();