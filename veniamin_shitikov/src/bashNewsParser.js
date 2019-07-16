const request = require('request');
const cheerio = require('cheerio');

const URL = 'https://bash.im/';
const SEPARATOR = '============================================';

const requestHandler = (err, responce, body) => {
  if (err || !responce || responce.statusCode !== 200) {
    throw new Error('Произошла ошибка при запросе данных!');
  }

  const $ = cheerio.load(body);
  const postsNodes = $('.quote__body');
  const posts = nodesToArray(postsNodes).slice(1); // skip first

  posts.forEach(post => printPost(post, SEPARATOR));
};

const nodesToArray = nodes => {
  if (!nodes || !nodes.length) return [];

  const resultLength = nodes.length;

  return Array.from(new Array(resultLength),
    (_, index) => nodes.eq(index));
};

const printPost = (post, separator) => {
  post.find('br').replaceWith('\n');
  const postText = post
    .text()
    .trim()
    .split('\n')
    .filter(Boolean)
    .join('\n');

  console.log(separator);
  console.log(postText);
  console.log(separator);
};

request(URL, requestHandler);
