# README Modulo2
​
# Project Name
​
## Description
​
Describe your project in one/two lines.
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
User profile: - see my profile - upload my profile picture - see other users profile - list of events created by the user - list events the user is attending
​
Geo Location: - add geolocation to events when creating - show event in a map in event detail page - show all events in a map in the event list page
​
Homepage: - …
​
## ROUTES:
​
[Untitled](https://www.notion.so)
​
## Models
​
User model
​
    {
    	username: String
    	password: String
    }
​
Event model
​
    { 
    	owner: ObjectId<User>
    	name: String
    	description: String
    	date: Date
    	location: String
    	+
    
    }
​
## Links
​
### Trello
​
Link to Trello
​
### Git
​
The url to your repository and to your deployed project
​
[Repository Link](http://github.com/)
​
[Deploy Link](http://heroku.com/)
​
### Slides
​
[Slides Link](http://slides.com/)
