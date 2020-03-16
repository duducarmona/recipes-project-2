const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

const recipes = [
  {
  },
];

mongoose
  .connect(process.env.MONGO_PATH, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: '${x.connections[0].name}'`,
    );
  })
  .catch((err) => console.error('Error connecting to mongo', err));

Recipe.create(recipes)
  .then((added) => {
    console.log(`Added ${added.length} recipes`);
    mongoose.connection.close();
  })
  .catch((error) => console.log('An error happened while adding movie: ', error));
