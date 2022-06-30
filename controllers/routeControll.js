function control (req, res, next) {
  if (req.user == 'undefined' || req.user == undefined) {
    res.redirect('/');
  } else {
    if (req.user.role_id === 1) {
      return next();
    } else {
      res.redirect('/dashboard');
    }
  }
}
module.exports = {
  control
};
