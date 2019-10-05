const router = require('express').Router();
const ServiceMessages = require('../services/ServiceMessages');

router.post('/sendMessage', (req, res) => {
  try {
    new ServiceMessages().getMessage(req.body.message)
      .then(value => {
        res.send(value);
      })
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;