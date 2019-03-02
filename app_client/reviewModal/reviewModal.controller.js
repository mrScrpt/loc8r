(()=>{
  angular
    .module('loc8rApp')
    .controller('reviewModalCtrl', reviewModalCtrl);
  reviewModalCtrl.$inject = ['$uibModalInstance','loc8rData','locationData'];
  function reviewModalCtrl($uibModalInstance, loc8rData, locationData) {
    const vm = this;
    vm.locationData = locationData;
    vm.uibModal = {
      cancel: ()=>{
        $uibModalInstance.dismiss('cancel');
      }
    };
    vm.onSubmit = ()=>{
      vm.formError = '';
      //console.log(vm.formData.name, vm.formData.rating, vm.formData.reviewText)
      if(!vm.formData || !vm.formData.name || !vm.formData.rating || !vm.formData.reviewText){
        vm.formError = "Все поля в форма обязательны для заполнения!";
        return false;
      } else {
        vm.doAddReview(vm.locationData.locationid, vm.formData);
      }

    };
    vm.doAddReview = (locationid, formData)=>{
      loc8rData.addReviewById(locationid, {
        author: formData.name
        ,rating: formData.rating
        ,reviewText: formData.reviewText
      })
      .then(res=>{
        vm.uibModal.close(res);
      })
      .catch(err=>{
        vm.formError = "Ваш отзыв не сохранен, попробуйте еще раз";
      });
      return false
      };
    vm.uibModal= {
      close: (res)=>{
        $uibModalInstance.close(res)
      },
      cancel: ()=>{
        $uibModalInstance.dismiss('cancel');
      }
    }
    }
})();