function validateUserRegistration(req, res, next) {
    const { fullName, email, password } = req.body;
  
    // Perform validation checks here
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Additional validation checks 
  
    next(); // Proceed to the next middleware or route
  }
  
  module.exports = {
    validateUserRegistration,
  };
  