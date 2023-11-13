const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
// const url = `mongodb://admin:capstone@${process.env.MONGODB_IP}:27017`;

const MONGODB_DOMAIN =
  process.env.NODE_ENV == 'test'
    ? 'localhost'
    : 'admin:capstone@' + process.env.MONGODB_IP;

const url = `mongodb://${MONGODB_DOMAIN}:27017`;

const client = new MongoClient(url);

// Database Name
const dbName = 'school_meal';
exports.getSchoolMeal = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const noticeCollection = db.collection('seoul_new_7');

    // the following code examples can be pasted here...
    const notices = await noticeCollection.find();

    // if ((await notices.estimatedDocumentCount()) === 0) {
    //     console.log('No documents found!');
    // }
    return await notices.toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

exports.saveAuthCode = async (schoolId, authCode) => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const emailCollection = db.collection('email_auth');

    const doc = {
      school_id: schoolId,
      auth_code: authCode,
      createdAt: new Date(),
    };
    const result = await emailCollection.insertOne(doc);
    return true;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

exports.getEmailAuthCode = async (schoolId) => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const noticeCollection = db.collection('email_auth');

    // the following code examples can be pasted here...
    const notice = await noticeCollection.findOne(
      { school_id: schoolId },
      { sort: { createdAt: -1 } }
    );

    // if ((await notices.estimatedDocumentCount()) === 0) {
    //     console.log('No documents found!');
    // }
    if (!notice) {
      return null;
    }
    return notice.auth_code;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
