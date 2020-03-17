const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Ingredient = require('../models/Ingredient');
const ingredients = require('../bin/ingredient-data');

dotenv.config();

const user = new User({
  _id: new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca'),
  username: 'TestUser',
  hashedPassword: '1234567890',
});

const recipes = [
  {
    title: 'Mongolian Beef',
    userId: user,
    image: 'https://dinnerthendessert.com/wp-content/uploads/2017/02/Mongolian-Beef-4.jpg',
    ingredients: [
      {
        spoonacularId: 1,
        amount: 1,
        unit: 'pound',
      },
    ],
    steps: [
      {
        number: 1,
        step: 'Slice the flank steak against the grain (the grain is the length of the steak) the long way 1/4 inch think pieces and add it to a ziploc bag with the cornstarch.',
      },
      {
        number: 2,
        step: 'Press the steak around in the bag making sure each piece is fully coated with cornstarch and leave it to sit.',
      },
      {
        number: 3,
        step: 'Add the canola oil to a large frying pan and heat on medium high heat.',
      },
      {
        number: 4,
        step: 'Add the steak, shaking off any excess corn starch, to the pan in a single layer and cook on each side for 1 minute.',
      },
      {
        number: 5,
        step: 'If you need to cook the steak in batches because your pan isn\'t big enough do that rather than crowding the pan, you want to get a good sear on the steak and if you crowd the pan your steak with steam instead of sear.',
      },
      {
        number: 6,
        step: 'When the steak is done cooking remove it from the pan.',
      },
      {
        number: 7,
        step: 'Add the ginger and garlic to the pan and sauté for 10-15 seconds.',
      },
      {
        number: 8,
        step: 'Add the soy sauce, water and dark brown sugar to the pan and let it come to a boil.',
      },
      {
        number: 9,
        step: 'Add the steak back in and let the sauce thicken for 20-30 seconds.',
      },
      {
        number: 10,
        step: 'The cornstarch we used on the steak should thicken the sauce, if you find it isn\'t thickening enough add 1 tablespoon of cornstarch to 1 tablespoon of cold water and stir to dissolve the cornstarch and add it to the pan.',
      },
      {
        number: 11,
        step: 'Add the green onions, stir to combine everything, and cook for a final 20-30 seconds.',
      },
      {
        number: 12,
        step: 'Serve immediately.',
      },
    ],
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

// User.create(user)
//   .then((response) => {
//     console.log(`Added ${response}`);
//   })
//   .catch((error) => {
//     console.log('An error happened while adding user: ', error);
//   });

Ingredient.create(ingredients)
  .then((response) => {
    console.log(`Added ${response.length} ingredients`);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('An error happened while adding ingredients: ', error);
    mongoose.connection.close();
  });

// Recipe.create(recipes)
//   .then((response) => {
//     console.log(`Added ${response}`);
// mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.log('An error happened while adding recipe: ', error);
//     mongoose.connection.close();
//   });
