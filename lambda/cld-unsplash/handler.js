/*
Make sure to grab an API key from https://unsplash.com/developers
*/
function _getImage(term) {
  const url = `https://api.unsplash.com/photos/random?query=${term}&client_id=${process.env.UNSPLASH_API_KEY}`;
  return new Promise((resolve, reject) => {
    const https = require('https');
    const request = https.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      const body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  });
}

/*
Don't forget to register for a Cloudinary account and grab the cloud name,
API key and API secret from https://cloudinary.com
*/
module.exports.image = async event => {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  if (event.queryStringParameters && event.queryStringParameters.term) {
    const term = event.queryStringParameters.term;
    const response = await _getImage(term);
    const r = JSON.parse(response);
    const result = await cloudinary.uploader.upload(r.urls.full)
    const unsplashUser = r.user.name;
    const publicId = result.public_id;
    const url = cloudinary.url(publicId, {
      secure: true,
      fetch_format: 'auto',
      quality: 'auto',
      transformation: [
        { width: 600, height: 400, crop: 'fill' },
    { overlay: 'jamstack-training-sticker', width: '100', crop: 'fill', x: 10, y:10, gravity: 'south_east', opacity: 75 },
    {width: 200, y: 80, x: 10, height: 150, gravity: 'south_east', overlay: {font_family: 'Indie Flower', font_size: 20, text: `${unsplashUser}`}, opacity: 75, crop: 'fit'}
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        original: result.secure_url,
        transformed: url
      })
    };
  }
};