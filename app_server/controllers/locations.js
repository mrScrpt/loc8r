const request = require('request-promise');

//Настройки сервера - локальный или продакшен
let apiOption = {
  server: "http://localhost:3000/"
};
if (process.env.NODE_ENV === 'production'){
  apiOption.server = "https://gentle-waters-54173.herokuapp.com/";
}


//Дополнительные функции
//Функция обработки ошибок
const _showError = (req, res, status) =>{
  let title, content;
  if(status === 404){
    title = "404, страница не найдена";
    content = "Запрашиваемая вами страница ненайдена, проверьте правильность url";
  }else {
    title = status + ", что-то пошло не так";
    content = "Непредвиденная ошибка, проверьте правильность запрашиваемых данных";
  }

  res.status(status);

  res.render('generic-text',{
    title: title
    ,content: content
  })

};

// Получение местоположения - универсальная функция для отзывов и страницы с конкретным местоположением
const getLocation = (req, res)=>{
  const promise = new Promise((resolve, reject)=>{

    let requestOption, path;
    path = "api/locations/" + req.params.locationid;
    requestOption={
      uri: apiOption.server + path
      ,method: "GET"
      ,simple: false
      ,resolveWithFullResponse: true
      ,json:{}

    };
    request(requestOption)
      .then((response)=>{
        //console.log("Удача: ", response.body);
        if(response.statusCode === 200){
          const data = response.body;
          data.coords = {
            lng: response.body.coords[0]
            ,lat: response.body.coords[1]
          };
          resolve(data);
        }else{
          reject(response);
        }
      })
      .catch(err=>{
        console.log("НЕ Удача: ", err);
        const data = "";
        renderDetailPage(req, res, data);
      });
  });
  return promise;
};

// Функции рендеринга для контроллеров
// Домашняя страница
const renderHomePage = (req, res, responseBody)=>{
  res.render('locations-list', {
    title: 'Loc8r - найди место для работы'
    ,pageHeader:{
      title: 'Loc8r'
      ,strapline: 'Поиск ближайших мест с Wi-Fi'
    }
    ,sidebar: 'Это приложение служит инструсентом поиска мест для доступа к сети интернет, которые распологаются поблизости от вас'

  })
};
const renderDetailPage = (req, res, locDetail)=>{
  res.render('locations-info', {
    title: locDetail.name
    ,pageHeader: {title: locDetail.name}
    ,sidebar: {
      context: 'Заведени имеет отличный дизайн интерьера, который придется по душе любому ценителю кофе'
      ,callToAction: 'Если вы посещали это заведение - оставьте свой отзыв, возможно он будет полезен другим людям!'
    }
    ,location:locDetail
  })
};
const renderReviewForm = (req, res, locDetail)=>{
  res.render('location-review-form', {
    title: locDetail.name
    ,pageHeader: {title: `Отзыв о заведении "${locDetail.name}"`}
    ,error: req.query.err
  })
};

// Контроллеры
module.exports.homeList = (req, res)=>{
    renderHomePage(req, res);
};

module.exports.locationInfo = (req, res)=>{
  getLocation(req, res)
    .then(data=>{
      renderDetailPage(req, res, data);
    })
    .catch(response=>{
      console.log("Статус: ", response.statusCode);
      _showError(req, res, response.statusCode)
    })
};

module.exports.addReview = (req, res)=>{
  getLocation(req, res)
    .then(data=>{
      renderReviewForm(req, res, data);
    })
    .catch(response=>{
      console.log("Статус: ", response.statusCode);
      _showError(req, res, response.statusCode)
    })


};

module.exports.doReview = (req, res)=>{
 let requestOption, path, locationid, postdata;
 locationid = req.params.locationid;
 path = `api/locations/${locationid}/reviews`;
 postdata = {
   author: req.body.name
   ,rating: parseInt(req.body.rating, 10)
   ,reviewText: req.body.review
 };
 requestOption = {
   uri: apiOption.server + path
   ,simple: false
   ,resolveWithFullResponse: true
   ,method: "POST"
   ,json: postdata
 };
 // Проверка на пустые данные из формы
 if (!postdata.author || !postdata.rating || !postdata.reviewText){
   res.redirect(`/location/${locationid}/review/new?err=val`);
 } else {
   request(requestOption)
     .then(data=>{
       if (data.statusCode === 201){
         console.log('попали в условие', data.statusCode);
         res.redirect(`/location/${locationid}`);
       }else if (data.statusCode === 400 && data.body.name === "ValidationError" ) {
         res.redirect(`/location/${locationid}/review/new?err=val`);
       }else {
         console.error('Статус ошибки', data.statusCode);
         console.log('Информация об ошибке', data.body.errors);
         _showError(req, res, data.statusCode);
       }
     })
     .catch(data=>{

       _showError(req, res, data.statusCode);
     })
 }

};