module.exports.homeList = (req, res)=>{
  res.render('locations-list', {
    title: 'Loc8r - найди место для работы'
    ,pageHeader:{
      title: 'Loc8r'
      ,strapline: 'Поиск ближайших мест с Wi-Fi'
    }
    ,sidebar: 'Это приложение служит инструсентом поиска мест для доступа к сети интернет, которые распологаются поблизости от вас'
    ,locations: [
      {
        name: 'Starcups'
        ,address: 'Московский проспект, 208'
        ,rating: 3
        ,facilities: ['Горячие напитка', 'Еда', 'Премиум доступ к Wi-Fi']
        ,distance: '100 метров'
      }
      , {
        name: 'Кайе HERO'
        ,address: 'ул. Гагарнина 32-Б'
        ,rating: 5
        ,facilities: ['Горячие напитка', 'Еда', 'Премиум доступ к Wi-Fi', 'Шоу']
        ,distance: '5000 метров'
      }
      , {
        name: 'No Drive'
        ,address: 'ул. Северная, 26'
        ,rating: 2
        ,facilities: ['Горячие напитка', 'Премиум доступ к Wi-Fi']
        ,distance: '1442 метра'
      }
    ]
  })
};

module.exports.locationInfo = (req, res)=>{
  res.render('locations-info', {
    title: 'Starcups'
    ,pageHeader: {title: 'Starcups'}
    ,sidebar: {
      context: 'Заведени имеет отличный дизайн интерьера, который придется по душе любому ценителю кофе'
      ,callToAction: 'Если вы посещали это заведение - оставьте свой отзыв, возможно он будет полезен другим людям!'
    }
    ,location:{
      name: 'Starcups'
      ,address: 'Московский проспект, 208'
      ,rating: 4
      ,facilities: ['Горячие напитка', 'Еда', 'Премиум доступ к Wi-Fi']
      ,coords: {lat: 51.45, lng: -0.9690}
      ,openingTimes: [
        {
          days: 'Monday - Friday',
          opening: '7:00am',
          closing: '7:00pm',
          closed: false
        }
        , {
          days: 'Saturday',
          opening: '8:00',
          closing: '17:00',
          closed: false
        }
        , {
          days: 'Sunday',
          closed: true
        }
      ]
      ,reviews: [
        {
          author: 'Simon Holmes',
          rating: 5,
          timestamp: '16 July 2013',
          reviewText: 'What a great place. I can\'t say enough good things about it.'
        }
        , {
          author: 'Charlie Chaplin',
          rating: 3,
          timestamp: '16 June 2013',
          reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
        }
      ]
    }
  })
};

module.exports.addReview = (req, res)=>{
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: { title: 'Review Starcups' }
  })
};