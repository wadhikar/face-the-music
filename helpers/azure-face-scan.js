const express = require('express');
const { FaceClient, FaceModels } = require("@azure/cognitiveservices-face");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const dotenv = require('dotenv');

dotenv.config();

const faceKey = process.env.FACE_KEY;
const faceEndPoint = process.env.FACE_END_POINT;
const cognitiveServiceCredentials = new CognitiveServicesCredentials(faceKey);

module.exports.faceDetectFromStreamOptionalParams = {
    recognitionModel: 'recognition_03',
    returnFaceAttributes: ['age', 'gender', 'emotion', 'glasses']
};
module.exports.faceClient = new FaceClient(cognitiveServiceCredentials, faceEndPoint);

module.exports.getHighestEmotion = function (emotionObject) {

    let highestEmotionValue = -1;
    let highestEmotion = '';
    for (const emotion in emotionObject) {
        if (emotionObject[emotion] > highestEmotionValue) {
            highestEmotion = emotion;
            highestEmotionValue = emotionObject[emotion];
        }
    }
    return highestEmotion;
}

