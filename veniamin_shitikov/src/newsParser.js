const cheerio = require('cheerio');

const newsParser = body => {
  const $ = cheerio.load(body);
  const postsNodes = $('.quote__body');
  const posts = nodesToArray(postsNodes).slice(1); // skip first

  return posts.map(post => post.html());
};

const nodesToArray = nodes => {
  if (!nodes || !nodes.length) return [];

  const resultLength = nodes.length;

  return Array.from(new Array(resultLength),
    (_, index) => nodes.eq(index));
};

module.exports = newsParser;
