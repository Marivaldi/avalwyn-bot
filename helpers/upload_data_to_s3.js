const AWS = require("aws-sdk"); // from AWS SDK
const fs = require("fs"); // from node.js
const path = require("path"); // from node.js
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const config = {
    s3BucketName: process.env.S3_SYNC_BUCKET,
    folderPath: '../data' // path relative script's location
};
module.exports = () => {
    // resolve full folder path
    const distFolderPath = path.join(__dirname, config.folderPath);

    // get of list of files from 'dist' directory
    fs.readdir(distFolderPath, (err, files) => {

        if (!files || files.length === 0) {
            console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
            console.log('Make sure your project was compiled!');
            return;
        }

        // for each file in the directory
        for (const fileName of files) {

            // get the full path of the file
            const filePath = path.join(distFolderPath, fileName);

            // ignore if directory
            if (fs.lstatSync(filePath).isDirectory()) {
                continue;
            }

            // read file contents
            fs.readFile(filePath, (error, fileContent) => {
                // if unable to read file contents, throw exception
                if (error) {
                    throw error;
                }

                // upload file to S3
                s3.putObject({
                    Bucket: config.s3BucketName,
                    Key: fileName,
                    Body: fileContent
                }, (res) => {
                    console.log(`Successfully uploaded '${fileName}'!`);
                });
            });
        }
    });
}