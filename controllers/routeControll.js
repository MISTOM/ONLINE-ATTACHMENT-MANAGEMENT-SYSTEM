function control(req, res, next) {
    if(req.user == "undefined" || req.user == undefined){
      res.redirect('/');
    }else{
      if (req.user.is_admin) {
        return next();
      } else {
        res.redirect('/dashboard');
      }
    }
}
module.exports = {
    control
}