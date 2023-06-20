const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;

  return jwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless((req) => {
    const path = req.originalUrl.split('?')[0];
    return (
      /\/public\/uploads(.*)/.test(path) ||
      /\/api\/products(.*)/.test(path) ||
      /\/api\/categories(.*)/.test(path) ||
      /\/api\/users\/verify-email(.*)/.test(path) ||
      `${api}/users/send-verification-email` === path ||
      `${api}/users/login` === path ||
      `${api}/users/register` === path
    );
  });
}

async function isRevoked(req, payload) {
  // console.log(payload);
  if (payload.isAdmin === false) {
    console.log('Not Admin');
    return true;
  }
  console.log('Admin');
  return false;
}

module.exports = authJwt;
