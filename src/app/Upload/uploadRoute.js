const { imageUploader } = require('./uploadS3');

module.exports = function (app) {
  app.post('/app/upload', imageUploader.array('image'), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('NO FILE');
    }

    const imageUrl = req.files.map((file) => file.location);
    const imageUrls = imageUrl.join(',');
    res.json({ imageUrls });
  });
};
