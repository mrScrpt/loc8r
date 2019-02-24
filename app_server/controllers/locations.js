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
// форматирование расстояния
const _formatDistance = (distance)=>{
  if(!distance && !(distance instanceof Number)){
    console.log("distance is empty or not a number");
    return;
  }
  let numDistance, unit;
  if(distance > 1){
    numDistance = parseFloat(distance).toFixed(1);
    unit = ' км';
  }else {
    numDistance = parseInt(distance * 1000, 10)
    unit = ' м'
  }
  return numDistance + unit;
};


// Функции рендеринга для контроллеров
// Домашняя страница
const renderHomePage = (req, res, responseBody)=>{
  let message;
  if(!(responseBody instanceof Array)){
    message = "API lookup error";
    responseBody = [];
  }else {
    if(!responseBody.length){
      message = "Нет мест поблизости";
    }
  }
  res.render('locations-list', {
    title: 'Loc8r - найди место для работы'
    ,pageHeader:{
      title: 'Loc8r'
      ,strapline: 'Поиск ближайших мест с Wi-Fi'
    }
    ,sidebar: 'Это приложение служит инструсентом поиска мест для доступа к сети интернет, которые распологаются поблизости от вас'
    ,locations: responseBody
    ,message: message
  })
};
const renderDetailPage = (req, res, locDetail)=>{
  /*console.log(locDetail.name);
  console.log(locDetail);*/
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

// Контроллеры
module.exports.homeList = (req, res)=>{
  var requestOptions, path;
  path = "api/locations";
  requestOptions = {
    uri: apiOption.server + path
    ,method: "GET"
    ,json:{}
    ,simple: false
    ,resolveWithFullResponse: true
    ,qs: {
      lng: -22.5
      ,lat: 0.1
      ,maxDistance: 6000
    }
  };
  request(requestOptions)
    .then((response)=>{
      const data = response;
      if (data.statusCode === 200 && data.body.length){
        for (let i = 0; i < data.body.length; i++){
          data.body[i].distance = _formatDistance(data.body[i].distance);
        }
      }
      renderHomePage(req, res, data.body);
    })
    .catch(()=>{
      const data = "";
      renderHomePage(req, res, data);

    });
};

module.exports.locationInfo = (req, res)=>{
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
        renderDetailPage(req, res, data)
      }else{
        console.log("Статус: ", response.statusCode);
        _showError(req, res, response.statusCode)
      }
    })
    .catch(err=>{
      console.log("НЕ Удача: ", err);
      const data = "";
      renderDetailPage(req, res, data);
    });

};

module.exports.addReview = (req, res)=>{
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: { title: 'Review Starcups' }
  })
};