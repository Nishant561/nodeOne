const mongoose = require("mongoose");

const databaseConnection = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:nishant123@cluster0.s4amd.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = {
    databaseConnection,
}
