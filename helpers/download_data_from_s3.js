const AWS = require("aws-sdk"); // from AWS SDK
const fs = require("fs"); // from node.js
const path = require("path"); // from node.js
const AvalwynStorage = require("../AvalwynStorage");
const send_message_to_active_channel = require("./send_message_to_active_channel");
const release_notes_embed = require('../embeds/release_notes_embed');
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

let num_processed = 0;
module.exports = async (client) => {
    num_processed = 0;
    data_files.forEach((data_file) => {
        const destinationFilePath = path.join(__dirname, `${config.folderPath}/${data_file}`);
        downloadFile(destinationFilePath, config.s3BucketName, data_file, client);
    });

    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}

async function downloadFile(filePath, bucketName, key, client) {
    const params = {
        Bucket: bucketName,
        Key: key
    };
    s3.getObject(params, (err, data) => {
        num_processed++;
        if (err) {
            if (err.statusCode === 404) {
                console.log(`${key} hasn't been loaded into ${bucketName} yet.`)
            } else {
                console.error(err);
            }
        } else {
            fs.writeFileSync(filePath, data.Body.toString());
            console.log(`${filePath} has been created!`);
        }

        if (num_processed === data_files.length) {
            const astorage = new AvalwynStorage();
            send_message_to_active_channel(release_notes_embed, client)
        }
    });
};