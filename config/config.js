const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    envPort: process.env.PORT,
    dbURL: 'mongodb+srv://aikhx:iGP6XbABTTOoKrB0@project.grgeq0f.mongodb.net/smartList?retryWrites=true&w=majority',
    sessionKey: process.env.SESSION_SECRET,
  
};