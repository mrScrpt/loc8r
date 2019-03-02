(()=>{
  angular
    .module('loc8rApp')
    .controller('locationDetailCtrl', locationDetailCtrl);

  locationDetailCtrl.$inject = ['$routeParams', '$uibModal', 'loc8rData'];
    function locationDetailCtrl ($routeParams, $uibModal, loc8rData) {
      const vm = this;
      vm.locationid = $routeParams.locationid;

      loc8rData.locationById(vm.locationid)
        .then(data=>{

          vm.data = { location: data };


          vm.pageHeader = {
            title: vm.data.location.data.name
          };
        })
        .catch(err=>{
          console.log(err);
        });
      vm.popupReviewForm = function () {
        const modalInstance = $uibModal.open({
          templateUrl: '/reviewModal/reviewModal.view.html'
          ,controller: 'reviewModalCtrl as vm'
          ,resolve: {
            locationData: ()=>{
              return{
                locationid: vm.locationid
                ,locationName: vm.data.location.data.name
              }
            }
          }

        }).result.catch(function(res) {
          if (!(res === 'cancel' || res === 'escape key press')) {
            throw res;
          }
        });
         /* .then(data=>{
            console.log(data)
          })
          .catch(err=> {
            console.log(data)
          })*/
      };

    }
})();