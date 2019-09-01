module.exports = {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
    port: process.env.PORT || 3000,
    dbName: process.env.DB_NAME|| 'example',
    collectionName: process.env.COLLECTION_NAME || 'dummyCollection'
};