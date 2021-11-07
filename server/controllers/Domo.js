const models = require('../models');

const { Domo } = models;

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.snack) {
    return res.status(400).json({ error: 'RAWR! Name, age, and snack are required.' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    snack: req.body.snack,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists. ' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const getDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findDomo(
    req.session.account._id, 
    req.session.account.name, 
    req.session.account.age, 
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.getDomo = getDomo;
module.exports.make = makeDomo;