const wrapper = require("../utils/wrapper");
const sendResponse = require("../utils/sendResponse");
const uploadFileToS3 = require("../services/s3Service");
const { v4: uuidv4 } = require("uuid");

const imageController = {
  storeSingle: async (req, res) => {
    const fileStream = req.file.buffer;

    const url = await uploadFileToS3(fileStream, uuidv4());

    sendResponse(res, { image_url: url });
  },

  storeMultiple: async (req, res) => {
    const promises = req.files.map((file) => {
      const fileStream = file.buffer;
      const key = uuidv4();

      return uploadFileToS3(fileStream, key);
    });

    const urls = await Promise.all(promises);

    sendResponse(res, { image_urls: urls }, 200);
  },
};

module.exports = wrapper(imageController);
