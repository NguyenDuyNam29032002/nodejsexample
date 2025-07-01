exports.authId = (req) => {
  return req.user?.id;
};

exports.authUser = (req) => {
  return req.user || null;
};
