const AWS = require("aws-sdk"); // from AWS SDK
const fs = require("fs"); // from node.js
const path = require("path"); // from node.js
const data_files = ["bot_data", "active_channel_data", "state_data", "faction_data"];
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});
const config = {
    s3BucketName: process.env.S3_SYNC_BUCKET,
    folderPath: '../data'
};
module.exports = () => {
    data_files.forEach((data_file) => {
        const destinationFilePath = path.join(__dirname, `${config.folderPath}/${data_file}`);
        downloadFile(destinationFilePath, config.s3BucketName, data_file);
    });
}

function downloadFile(filePath, bucketName, key) {
    const params = {
        Bucket: bucketName,
        Key: key
    };
    s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        fs.writeFileSync(filePath, data.Body.toString());
        console.log(`${filePath} has been created!`);
    });
};