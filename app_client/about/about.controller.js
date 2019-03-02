(()=>{
  angular
    .module('loc8rApp')
    .controller('aboutCtrl', aboutCtrl);
    function aboutCtrl() {
      const vm = this;
      vm.pageHeader = {
        title: 'About Loc8r',
      };
      vm.main = {
        content: 'Loc8r was created to help people find places to sit down and get a bit of\n\n work done.\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      };
    }
})();