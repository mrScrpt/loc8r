window.addEventListener('DOMContentLoaded',()=>{
  const form = document.querySelector('#addReviewForm');
  const labels = form.querySelectorAll('.validate-fields');

  form.addEventListener('submit', (e)=>{
    for (let i = 0; i < labels.length; i++){
      if(!labels[i].value){
        e.preventDefault();
        labels[i].classList.add('validate-error');
      }else {
        if(labels[i].classList.contains('validate-error')){
          labels[i].classList.remove('validate-error');
        }
      }
    }
  })
});