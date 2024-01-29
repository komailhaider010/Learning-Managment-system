const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  const splitToken = token.split(' ')[1];
  try {
    const decode = jwt.verify(splitToken, process.env.SECRET_KEY);
    req.user = decode;
    next();
    
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    
  }
  // jwt.verify(splitToken, process.env.SECRET_KEY, (err, decoded) => {
  //   if (err) {
  //     // console.error('JWT Verification Error:', err);
      
  //   }

  //   // You can now access the user information in the request
  //   req.user = decoded;

  //   // Continue with the next middleware or route handler
  //   next();
  // });
  
};

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }
const splitToken = token.split(' ')[1];
try {
  const decode = jwt.verify(splitToken, process.env.SECRET_KEY);
  if(!decode.role === 'admin'){
    return res.status(401).json({ message: 'Unauthorized: User' });
  }
  req.user = decode;
  next();
  
  
} catch (error) {
  return res.status(401).json({ message: 'Unauthorized: Invalid token' }); 
}
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
};
