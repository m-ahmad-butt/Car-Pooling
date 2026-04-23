const userRepository = require('../repositories/user.repository');

const syncUser = async (req, res, next) => {
  try {
    const { clerkId, email, name, firstName, lastName, campus, contactNo, rollNo } = req.body;
    
    let user = await userRepository.findByClerkId(clerkId);
    
    if (user) {
      user = await userRepository.updateByClerkId(clerkId, {
        email, name, firstName, lastName, campus, contactNo, rollNo
      });
    } else {
      user = await userRepository.create({
        clerkId, email, name, firstName, lastName, campus, contactNo, rollNo
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { syncUser, getProfile };
