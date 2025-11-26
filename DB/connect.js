import mongoose from "mongoose";

const ConnectsDB = (url) => {
 return  mongoose.connect(url)
  .then(() => console.log('Connected'))
  .catch(err => console.log('Error:', err.message));
};

export default ConnectsDB;
