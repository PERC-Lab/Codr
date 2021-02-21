const mongoose = require("mongoose");

module.exports = async function connect() {
  /**
   * check if we have a connection:
   *   0 = disconnected
   *   1 = connected
   *   2 = connecting
   *   3 = disconnecting
   */
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  }
};
