module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('app.js');
  eleventyConfig.addPassthroughCopy('style.css');
};