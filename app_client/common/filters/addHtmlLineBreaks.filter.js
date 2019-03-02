(()=>{
angular
  .module('loc8rApp')
  .filter('addHtmlLineBreaks', addHtmlLineBreaks)
  function addHtmlLineBreaks() {
    return (text)=>{
      const output = text.replace(/\n/g, '<br>');
      return output;
    }

  }
})();