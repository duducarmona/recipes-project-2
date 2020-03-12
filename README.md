# README Modulo2
​
# ReciApp – Recipetoire – Smash Your Fridge – Fridge Fattener … ?
​
## Description
​
[PROJECT-NAME] is a recipes app for helping you keep track of your recipes and discover new ones. You can create your own recipes, find new ones, check if the ingredients are healthy or are suitable for vegans, vegetarians, celiacs, diabetics, people with allergies, etc. You can also get ideas  on what to cook each day with the random recipe functionality… and much more.
​
## User Stories
**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

**Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup

**Sign up** - As a user I want to sign up on the webpage so that I can see the recipes and interact with them

**Login** - As a user I want to be able to log in on the webpage so that I can get back to my account

**Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account  

​**Recipe – list** - As a user I want to see all the recipes available so that I can choose which ones I want to cook  

**Recipe – create** - As a user I want to create a recipe

**Recipe – detail** - As a user I want to see the recipe details

**Recipe – delete** - As a user I want to delete a recipe  

**Recipe – edit** - As a user I want to edit a recipe

​
## Backlog

### List of other features outside of the MVP scope

**Ingredients** - get ingredients from Spoonacular API

**Survival** – check what you can cook (Spoonacular) with only a few ingredients from your fridge

**Zombie apocalypse** - find recipes that don't require perishable goods

**One more ingredient** – check what recipes you could make (Spoonacular) if you had just one more ingredient

**Star ingredient** - find top recipes (Spoonacular) using a specific ingredient ("I'd like to make something with kale")

**Weekly menu** – the user can make a menu for every day of the week with different recipes

**Filter recipes by type of cuisine** – the user can search for different types of cuisine (Asian, Mexican, traditional, Moroccan, ec.)

**Other recipe filters** – vegan, vegetarian, celiac, allergens, diets (keto, low-carb, etc.), health (low-calorie, low in sodium, low in saturated fat, etc.), dish type (dessert, starter, main, etc.), ease of preparation (easy / medium / hard, X minutes)

**Substitutions** - find substitutions if you're missing an ingredient, or transform your recipe into something healthier, vegetarian, etc.

**Recipe sharing** – recipes created by one user can be seen by other users

**Nutrition** - see nutrition information for your recipe (calories, fat / carb / protein, types of sugars, glycemic index, etc.)

**Cost** - see how much your recipe costs (need API for ingredient cost)

**Geolocation** – add geolocation to help the user to find cheapest or hard-to-find  ingredients nearby (need API)

​
## ROUTES:

[Login](https://www.notion.so) PENDING

[Recipe list](https://www.notion.so) PENDING

[Create/Update recipe](https://www.notion.so) PENDING

[Recipe detail](https://www.notion.so) PENDING

Method  | Endpoint  | Description  |
|---|---|---|
| GET  | /  |  HomePage |
| GET  | /login  | Login page  |
|  POST | /login  | Send user info and logged in  |
​

## Models
​
```Javascript
User model
​
    {
      userId: ObjectId,
    	username: String (required, unique),
    	password: String
    }
​
Ingredient model
​
    { 
    	ingredientId: ObjectId,
      name: String (required, unique)
    }
​
Recipe model

    { 
      recipeId: ObjectId,
      userId: ObjectId<User>,
      name: String (required, unique),
      image: String,
      ingredients: Array of Object {
        ingredientId: ingredientID<User>,
        quantity: Number,
        unit: text,
      }
    }
```

## Links
​
### Trello

[Trello board](https://trello.com/b/5ZZUmgcL/recipe-app)
​
### Git

[GitHub repository](https://github.com/duducarmona/recipes-project-2)

[Deploy Link](http://heroku.com/) PENDING
​
### Slides
​
[Slides Link](http://slides.com/) PENDING
