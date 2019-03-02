(()=>{
  angular
    .module('loc8rApp')
    .controller('reviewModalCtrl', reviewModalCtrl);
  reviewModalCtrl.$inject = ['$uibModalInstance'];
  function reviewModalCtrl($uibModalInstance) {
    const vm = this;
    vm.uibModal = {
      cancel: ()=>{
        $uibModalInstance.dismiss('cancel');
      }
    }
  }
})();