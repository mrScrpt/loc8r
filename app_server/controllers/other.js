module.exports.about = (req,res)=>{
    res.render('generic-text', {
        title: 'О Loc8r',
        content: 'Очень хороший ресурс, который поможет вам, найти лучшие места для работы на уделении'
    });
};

module.exports.angularApp = (req, res)=>{
  res.render('layout', {title: 'Loc8r'})
};