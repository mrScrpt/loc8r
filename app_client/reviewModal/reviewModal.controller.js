(()=>{
  angular
    .module('loc8rApp')
    .controller('reviewModalCtrl', reviewModalCtrl);
  reviewModalCtrl.$inject = ['$uibModalInstance','locationData'];
  function reviewModalCtrl($uibModalInstance, locationData) {
    const vm = this;
    vm.locationData = locationData;
    vm.uibModal = {
      cancel: ()=>{
        $uibModalInstance.dismiss('cancel');
      }
    }
  }
})();