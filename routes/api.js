'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
        const { text, locale } = req.body;
        console.log(text);
        console.log(locale);
        if (text === undefined || locale === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (text.trim() === "") {
        return res.json({ error: 'No text to translate' });
      }

      if (!['american-to-british', 'british-to-american'].includes(locale)) {
        return res.json({ error: 'Invalid value for locale field' });
      }

      const result = translator.translate(text, locale);
      res.json(result);
      
    });
};
