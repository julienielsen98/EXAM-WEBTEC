# Mandatory Assignment - Web Technologies

## Description

Database with recipes.

Users:

- Access to recipes with category "free"
- Select single recipe id, with details
- Select a single step

Premium Users:

- All the regular user can, pluss:
  - Search by ingredient
  - Look up all the ingredients that exsists

Admin Users:

- Add recipe
- Update recipe
- Replace recipe
- Delete recipe

## Installation

Install dependancies:

```
npm install
```

Use start script:

```
npm start
```

## Usage

Express app, with SQLITE3 database.

### GET REQUESTS

## USAGE USERS

```bash
GET "/recipes" //Returns data stored in table for users
```

```bash
GET "/recipe/:recipe_id" //Returns a chosen recipe by id
```

```bash
GET "/recipe/:recipe_id" //Returns a chosen recipe by id. Details about name, category and ingredients.
```

```bash
GET "/recipe/:recipe_id/all" //Returns a chosen recipe by id, but with all the details.
```

```bash
GET "/recipe/:recipe_id/:step_id_1" //Returns a chosen step by single id. (bug - could not manage to get step_id_2 and so on...)
```

```bash
GET "/recipe/:recipe_id/:step_id_1" //Returns a chosen step by single id. (bug - could not manage to get step_id_2 and so on...)
```

## USAGE PREMIUM USER

```bash
GET "/premium/recipes" //Returns data stored in tables for premium user (More recipes options)
```

```bash
GET "/premium/recipe/:recipe_id" //Returns a chosen recipe by id. Details about name, category and ingredients.
```

```bash
GET "/premium/recipe/:recipe_id/all" //Returns a chosen recipe by id, but with all the details.
```

```bash
GET "/premium/recipe/:recipe_id/:step_id_1" //Returns a chosen step by single id. (bug - could not manage to get step_id_2 and so on...)
```

```bash
GET "/premium/search/:ingredient1" //Returns all the recipes that contains that ingredient (bug - could not manage to get ingredient2 and so on...)
```

```bash
GET "/premium/ingredients" //Returns all the ingredients that exists in the database
```

## USAGE ADMIN USER

USE POSTMAN!

### POST REQUEST

```bash
POST "/recipe" //Posts new recipes, specify in category which users that shall have access.
```

### PATCH REQUEST

```bash
PATCH "/recipe/:recipe_id" //Updates parts of the chosen recipe
```

### PUT REQUEST

```bash
PUT "/recipe/:recipe_id" //Replaces a chosen recipe
```

### DELETE REQUEST

```bash
DELETE "/recipe/:recipe_id" //Deletes a chosen recipe
```

## Dependencies

    "body-parser": "^1.20.1"
     - body-parser extracts the entire body portion of an incoming request stream and exposes it on req. body

    "express": "^4.18.2"
     - express is a node js web application framework to build web and mobile applications. It's a layer built on the top of the Node js that helps manage servers and routes.

    "express-router": "^0.0.1"
     - creates a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.

    "morgan": "^1.10.0"
     - Morgan is an HTTP request level Middleware for Node.js, great to use for debugging because it logs the requests.

    "path": "^0.12.7"
     - NodeJS path module is a core built-in module. It provides functionalities for accessing and interacting with files.

    "sqlite": "^4.1.2"
     - SQLite consist of a single file and a library to make your application interact with it. Used to to manage data and data definition in RDBMS.
     Example: "SELECT * FROM users WHERE name = 'Julie';"

    "sqlite3": "^5.1.2"
     - is just the version 3 of SQLite which provides - more compact format for database files. Supports both UTF-8 and UTF-16 text.

## Author

Julie Nielsen (@julienielsen98)

## License

[MIT](https://choosealicense.com/licenses/mit/)
