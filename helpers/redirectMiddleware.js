function redirectSignedInUser(req, res, next) {
  if (req.session.currentUser) {
    res.redirect('/recipes');
  } else {
    next();
  }
}

function redirectUnauthorizedUser(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = {
  redirectSignedInUser,
  redirectUnauthorizedUser,
};
