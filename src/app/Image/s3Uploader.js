const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const secret_config = require('../../../config/secret');

const s3 = new S3Client({
    credentials: {
        accessKeyId: secret_config.S3_ACCESS_KEY,
        secretAccessKey: secret_config.S3_PRIVATE_KEY
    },
    region: "ap-northeast-2"
});

exports.upload = multer({
    storage: multerS3({
        s3, 
        bucket: 'testhuman',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${file.originalname}`);
        },
    }),
    limit: {fileSize: 5*1024*1024},
});
