const express = require('express');
const router = express.Router();

const pages = [
  { slug: '/', name: 'Home Page' },
  { slug: '/add', name: 'Add Draft' },
  { slug: '/preview', name: 'Preview Drafts' },
];

router.get('/', (req, res) => {
  res.render('index', { title: 'Dashboard', nav: pages });
});

router.get('/add', (req, res) => {
  res.render('add', { title: 'Add Draft', nav: pages });
});

router.get('/preview', (req, res) => {
  res.render('preview.list', { title: 'Add Draft', nav: pages });
});

router.get('/preview/:domain/:slug', (req, res) => {
  res.render('preview', {
    domain: req.params.domain,
    slug: req.params.slug,
    title: 'Preview Draft: <there will be draft-name>',
    draft: 'There will be page preview html code',
  });
});

module.exports = router;
