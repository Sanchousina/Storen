import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

export const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
});

export const sendToS3 = async (file, fileName) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    const cmd = new PutObjectCommand(params);
    await s3.send(cmd);
}

export const deleteFromS3 = async (fileName) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
    }
    const cmd = new DeleteObjectCommand(params);
    await s3.send(cmd);
}

export const getS3Url = async (fileName) => {
    const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
    }
    const cmd = new GetObjectCommand(getObjectParams);
    let url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
    return url;
}

export const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');