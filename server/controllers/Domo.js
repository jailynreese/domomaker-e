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

const updateAge = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    let newAge = docs.age + 1;
    const savePromise = docs.save();

    savePromise.then(() => res.json({ name: docs.name, age: newAge, owner: req.session.account._id, snack: docs.snack }));

    savePromise.catch(() => res.status(500).json({ err }));
    
    return newAge;
  });
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

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.updateAge = updateAge;
