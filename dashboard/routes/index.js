const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Dashboard'});
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
