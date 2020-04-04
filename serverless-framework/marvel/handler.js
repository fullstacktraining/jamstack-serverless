'use strict';
const crypto = require('crypto');

const getCharacterInfo = characterName => {
  // hash - a md5 digest of the ts parameter, your private key and your public key (e.g. md5(ts+privateKey+publicKey)
  const timestamp = new Date().getTime();
  const publickey = '';
  const privatekey = '';
  const hash = crypto.createHash('md5').update(`${timestamp}${privatekey}${publickey}`).digest('hex');
  const url = `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publickey}&hash=${hash}&name=${characterName}`;

  return new Promise((resolve, reject) => {
    const https = require('https');
    const request = https.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode + ' hash: ' + hash + ' url: ' + url));
       }
      const body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  });
};

module.exports.characters = async event => {
  const characterName = JSON.parse(event.body).name;
  try {
    const response = await getCharacterInfo(characterName);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString()
    }
  }
};
