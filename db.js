const mongoose = require("mongoose");
require("dotenv/config");
module.exports = async function () {
  return mongoose
    .connect(process.env.DB_URL, {
      //mongodb://127.0.0.1:27017/OlmosTaxi
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB ga ulandi.");
    })
    .catch((err) => {
      console.log("DB da xatolik: ", err);
    });
};
