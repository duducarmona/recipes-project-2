
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

dotenv.config();

console.log("mongo path is ", process.env.MONGO_PATH);

let user = new User({
  username: 'TestUser',
  hashedPassword: '123456789',
});

// const recipes = [
//   {
//     title: 'Mongolian Beef',
//     userId: 'Ava DuVernay',
//     stars: ['Storm Reid', 'Oprah Winfrey', 'Reese Witherspoon'],
//     image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMjMxNjQ5MTI3MV5BMl5BanBnXkFtZTgwMjQ2MTAyNDM@._V1_UX182_CR0,0,182,268_AL_.jpg',
//     description: 'Following the discovery of a new form of space travel as well as Meg\'s father\'s disappearance, she, her brother, and her friend must join three magical beings - Mrs. Whatsit, Mrs. Who, and Mrs. Which - to travel across the universe to rescue him from a terrible evil.',
//     showtimes: ['13:00', '15:30', '18:00', '20:10', '22:40'],
//   },
// ];


// mongoose
//   .connect(process.env.MONGO_PATH, {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((x) => {
//     console.log(
//       `Connected to Mongo! Database name: '${x.connections[0].name}'`,
//     );
//   })
//   .catch((err) => console.error('Error connecting to mongo', err));


// Recipe.create(recipes)
//   .then((added) => {
//     console.log(`Added ${added.length} recipes`);
//     mongoose.connection.close();
//   })
//   .catch((error) => console.log('An error happened while adding movie: ', error));
