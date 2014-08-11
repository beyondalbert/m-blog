var beforeFilters = {
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登陆！');
      res.redirect('/sessions/new');
    }
    next();
  },
  checkNotLogin: function (req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登陆！');
      res.redirect('back');
    }
    next();
  }
}

module.exports = beforeFilters
