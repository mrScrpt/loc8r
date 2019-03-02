(()=>{
  angular
    .module('loc8rApp')
    .filter('formatDistance', formatDistance);

  //Проверка на число
  const _isNumeric = (n)=>{
    return !isNaN(parseFloat(n) && isFinite(n));
  };
  //Форматирование расстояния
   function formatDistance(){
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
  }
})();