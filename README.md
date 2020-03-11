# README Modulo2
​
# ReciApp
​
## Description
​
Our project is a recipes app to do everything with recipes. You can create your own recipes, find new ones, check if the ingredients are healthy or they are suitable for vegans, vegetarians, coeliacs, diabetics..., know what to cook every day with the random recipe functionality and much more.
​
## User Stories
​
**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
​
**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
​
**Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
​
**Sign up** - As a user I want to sign up on the webpage so that I can see the recipes and interact with them
​
**Login** - As a user I want to be able to log in on the webpage so that I can get back to my account
​
**Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
​
**Recipes list** - As a user I want to see all the recipes available so that I can choose which ones I want to cook
​
**Recipes create** - As a user I want to create a recipe
​
**Recipes detail** - As a user I want to see the recipe details
​
**Recipes delete** - As a user I want to delete a recipe

**Recipes edit** - As a user I want to edit a recipe
​
## Backlog
​
List of other features outside of the MVPs scope
​
Survival: - check what you can cook with a few ingredients from your fridge

Weekly menu: - the user can make a menu for every day of the week with different recipes

Types of food: - the user can look for all the types of foods (Asian, Mexican, traditional, Moroccan ...)
​
Geo Location: - add geolocation to help the user to find the cheapest and more specific ingredients
​
Homepage: - PENDING
​
## ROUTES:
​
[Untitled](https://www.notion.so) PENDING
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
​
[Trello board](https://trello.com/b/5ZZUmgcL/recipe-app)
​
### Git
​
[GitHub repository](https://github.com/duducarmona/recipes-project-2)
​
[Deploy Link](http://heroku.com/) PENDING
​
### Slides
​
[Slides Link](http://slides.com/) PENDING
