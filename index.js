const sqlite3 = require("sqlite3");
const morgan = require("morgan");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const app = express();
const db = new sqlite3.Database(__dirname + "/database.sqlite");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MAIN ENTRY. Returns frontpage with usage description on /
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// CREATEING TABLES

//CREATE/DROP setup
const CREATE_RECIPE =
  "CREATE TABLE if not exists free_recipes (recipe_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, ingredient1 TEXT, amount1 TEXT, ingredient2 TEXT, amount2 TEXT, ingredient3 TEXT, amount3 TEXT, ingredient4 TEXT, amount4 TEXT, ingredient5 TEXT, amount5 TEXT, ingredient6 TEXT, amount6 TEXT, ingredient7 TEXT, amount7 TEXT, ingredient8 TEXT, amount8 TEXT, step_id_1 INTEGER, instruction1 TEXT, step_id_2 INTEGER, instruction2 TEXT, step_id_3 INTEGER, instruction3 TEXT, step_id_4 INTEGER, instruction4 TEXT, step_id_5 INTEGER, instruction5 TEXT );";
const DROP_RECIPE = "DROP TABLE if exists free_recipes;";

// GET STATEMENTS

//Creating the tables
app.get("/create", (req, res) => {
  db.run(CREATE_RECIPE);
  res.status(201).send("Table created");
});

//Dropping the tables
app.get("/drop", (req, res) => {
  db.run(DROP_RECIPE);
  res.status(204).send("Table dropped");
});

//Resets the tables
app.get("/reset", (req, res) => {
  db.run(DROP_RECIPE, () => {
    console.log("Table dropped ...");
    db.run(CREATE_RECIPE, () => {
      console.log("...  and re-created");
      db.run(
        `INSERT INTO free_recipes (name, category, ingredient1, amount1, ingredient2, amount2, ingredient3, amount3, ingredient4, amount4, ingredient5, amount5, ingredient6, amount6, ingredient7, amount7, ingredient8, amount8, step_id_1, instruction1, step_id_2, instruction2, step_id_3, instruction3, step_id_4, instruction4, step_id_5, instruction5) VALUES ("Easy Pancakes", "free", "flour", "100g plain flour", "egg", "2 large eggs", "milk", "300ml milk", "oil", "1 tbsp sunflower oil", ?, ?, ?, ?, ?, ?, ?, ?, 1 , "Put 100g plain flour, 2 large eggs, 300ml milk, 1 tbsp sunflower or vegetable oil and a pinch of salt into a bowl or large jug, then whisk to a smooth batter.", 2 , "Set aside for 30 mins to rest if you have time, or start cooking straight away.", 3 , "Set a medium frying pan or crêpe pan over a medium heat and carefully wipe it with some oiled kitchen paper.", 4 , "When hot, cook your pancakes for 1 min on each side until golden, keeping them warm in a low oven as you go.", 5 , "Serve with lemon wedges and caster sugar, or your favourite filling. Once cold, you can layer the pancakes between baking parchment, then wrap in cling film and freeze for up to 2 months.");`
      );
    });
  });

  res.sendStatus(205);
});

//Returns data stored in table for users
app.get("/recipes", (req, res) => {
  let recipe = [];
  db.serialize(() => {
    db.each(
      "SELECT DISTINCT * FROM free_recipes WHERE category == 'free' ;",
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns a chosen recipe by id. Details about name, category and ingredients
app.get("/recipe/:recipe_id", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT name, category, ingredient1, amount1, ingredient2, amount2, ingredient3, amount3, ingredient4, amount4, ingredient5, amount5 , ingredient6, amount6 , ingredient7, amount7 , ingredient8, amount8 FROM free_recipes WHERE category == 'free' AND recipe_id == ?;",
      recipe_id,
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns a chosen recipe by id, but with all the details.
app.get("/recipe/:recipe_id/all", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT * FROM free_recipes WHERE category == 'free' AND recipe_id == ?;",
      recipe_id,
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns a chosen step by single id. (bug - could not manage to get step_id_2 and so on...)
app.get("/recipe/:recipe_id/:step_id_1", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;
  let step_id_1 = req.params.step_id_1;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT step_id_1, instruction1 FROM free_recipes WHERE recipe_id == ? AND step_id_1 == ?;",
      recipe_id,
      step_id_1,
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//PREMIUM USERS ACCESS

//Returns data stored in tables for premium user (More recipes options)
app.get("/premium/recipes", (req, res) => {
  let recipe = [];
  db.serialize(() => {
    db.each(
      "SELECT DISTINCT * FROM free_recipes;",
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns a chosen recipe by id. Details about name, category and ingredients.
app.get("/premium/recipe/:recipe_id", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT name, category, ingredient1, amount1, ingredient2, amount2, ingredient3, amount3, ingredient4, amount4, ingredient5, amount5 , ingredient6, amount6 , ingredient7, amount7 , ingredient8, amount8 FROM free_recipes WHERE  recipe_id == ?;",
      recipe_id,
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns a chosen recipe by id, but with all the details.
app.get("/premium/recipe/:recipe_id/all", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT * FROM free_recipes WHERE recipe_id == ?;",
      recipe_id,
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns a chosen step by single id. (bug - could not manage to get step_id_2 and so on...)
app.get("/premium/recipe/:recipe_id/:step_id_1", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;
  let step_id_1 = req.params.step_id_1;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT step_id_1, instruction1 FROM free_recipes WHERE recipe_id == ? AND step_id_1 == ?;",
      recipe_id,
      step_id_1,
      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send({ recipe });
      }
    );
  });
});

//Returns all the recipes that contains that ingredient (bug - could not manage to get ingredient2 and so on...)
app.get("/premium/search/:ingredient1", (req, res) => {
  let recipe = [];
  let search = "";
  let ingredient1 = req.params.ingredient1;

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT name, recipe_id, ingredient1 FROM free_recipes WHERE ingredient1 == ?;",
      ingredient1,
      (err, row) => {
        recipe.push(` "/recipe/${row.recipe_id}/"`);
        search = row.ingredient1;
      },
      () => {
        res.status(200).send(`Search "${search}":
        Results: 
         ${recipe}`);
      }
    );
  });
});

//Returns all the ingredients that exists in the database
app.get("/premium/ingredients", (req, res) => {
  let recipe = [];

  db.serialize(() => {
    db.each(
      "SELECT DISTINCT ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6, ingredient7, ingredient8 FROM free_recipes;",

      (err, row) => {
        recipe.push(row);
      },
      () => {
        res.status(200).send(recipe);
      }
    );
  });
});

//POSTING RECIPES, usage: Postman

//Posts new recipes, specify in category which users that shall have access.
app.post("/recipe", (req, res) => {
  let {
    name,
    category,
    ingredient1,
    amount1,
    ingredient2,
    amount2,
    ingredient3,
    amount3,
    ingredient4,
    amount4,
    ingredient5,
    amount5,
    ingredient6,
    amount6,
    ingredient7,
    amount7,
    ingredient8,
    amount8,
    step_id_1,
    instruction1,
    step_id_2,
    instruction2,
    step_id_3,
    instruction3,
    step_id_4,
    instruction4,
    step_id_5,
    instruction5,
  } = req.body;

  db.run(
    "INSERT INTO free_recipes (name, category, ingredient1, amount1, ingredient2, amount2, ingredient3, amount3, ingredient4, amount4,   ingredient5, amount5, ingredient6, amount6, ingredient7, amount7, ingredient8, amount8, step_id_1, instruction1, step_id_2, instruction2, step_id_3, instruction3, step_id_4, instruction4, step_id_5, instruction5 ) VALUES ('" +
      name +
      "',  '" +
      category +
      "',  '" +
      ingredient1 +
      "',  '" +
      amount1 +
      "',  '" +
      ingredient2 +
      "',  '" +
      amount2 +
      "',  '" +
      ingredient3 +
      "',  '" +
      amount3 +
      "',  '" +
      ingredient4 +
      "',  '" +
      amount4 +
      "',  '" +
      ingredient5 +
      "',  '" +
      amount5 +
      "',  '" +
      ingredient6 +
      "',  '" +
      amount6 +
      "',  '" +
      ingredient7 +
      "',  '" +
      amount7 +
      "',  '" +
      ingredient8 +
      "',  '" +
      amount8 +
      "',  '" +
      step_id_1 +
      "',  '" +
      instruction1 +
      "',  '" +
      step_id_2 +
      "',  '" +
      instruction2 +
      "',  '" +
      step_id_3 +
      "',  '" +
      instruction3 +
      "',  '" +
      step_id_4 +
      "',  '" +
      instruction4 +
      "',  '" +
      step_id_5 +
      "',  '" +
      instruction5 +
      "');"
  );

  res.status(201).send("Saved");
});

//UPDATE RECIPES, usage: Postman

//Updates parts of the chosen recipe
app.patch("/recipe/:recipe_id", (req, res) => {
  let recipe_id = req.params.recipe_id;

  let {
    name,
    category,
    ingredient1,
    amount1,
    ingredient2,
    amount2,
    ingredient3,
    amount3,
    ingredient4,
    amount4,
    ingredient5,
    amount5,
    ingredient6,
    amount6,
    ingredient7,
    amount7,
    ingredient8,
    amount8,
    step_id_1,
    instruction1,
    step_id_2,
    instruction2,
    step_id_3,
    instruction3,
    step_id_4,
    instruction4,
    step_id_5,
    instruction5,
  } = req.body;

  db.run(
    "UPDATE free_recipes SET name = COALESCE(?, name), category = COALESCE(?, category), ingredient1 = COALESCE(?,ingredient1), amount1 = COALESCE(?,amount1), ingredient2 = COALESCE(?,ingredient2), amount2 = COALESCE(?,amount2), ingredient3 = COALESCE(?,ingredient3), amount3 = COALESCE(?,amount3), ingredient4 = COALESCE(?,ingredient4), amount4 =COALESCE(?,amount4), ingredient5 = COALESCE(?,ingredient5), amount5 = COALESCE(?,amount5), ingredient6 = COALESCE(?,ingredient6), amount6 = COALESCE(?,amount6), ingredient7 = COALESCE(?,ingredient7), amount7 = COALESCE(?,amount7), ingredient8 = COALESCE(?,ingredient8), amount8 = COALESCE(?,amount8), step_id_1 = COALESCE(?,step_id_1), instruction1 = COALESCE(?,instruction1), step_id_2 = COALESCE(?,step_id_2), instruction2 = COALESCE(?,instruction2), step_id_3 = COALESCE(?,step_id_3), instruction3 = COALESCE(?,instruction3), step_id_4 = COALESCE(?,step_id_4), instruction4 = COALESCE(?,instruction4), step_id_5 = COALESCE(?,step_id_5), instruction5 = COALESCE(?,instruction5) WHERE recipe_id == ?",
    [
      name,
      category,
      ingredient1,
      amount1,
      ingredient2,
      amount2,
      ingredient3,
      amount3,
      ingredient4,
      amount4,
      ingredient5,
      amount5,
      ingredient6,
      amount6,
      ingredient7,
      amount7,
      ingredient8,
      amount8,
      step_id_1,
      instruction1,
      step_id_2,
      instruction2,
      step_id_3,
      instruction3,
      step_id_4,
      instruction4,
      step_id_5,
      instruction5,
      recipe_id,
    ]
  );

  res.status(201).send("Saved");
});

//Replaces a chosen recipe
app.put("/recipe/:recipe_id", (req, res) => {
  let recipe_id = req.params.recipe_id;

  let {
    name,
    category,
    ingredient1,
    amount1,
    ingredient2,
    amount2,
    ingredient3,
    amount3,
    ingredient4,
    amount4,
    ingredient5,
    amount5,
    ingredient6,
    amount6,
    ingredient7,
    amount7,
    ingredient8,
    amount8,
    step_id_1,
    instruction1,
    step_id_2,
    instruction2,
    step_id_3,
    instruction3,
    step_id_4,
    instruction4,
    step_id_5,
    instruction5,
  } = req.body;

  db.run(
    "UPDATE free_recipes SET name == ?, category == ?, ingredient1 == ?, amount1 == ?, ingredient2 == ?, amount2 == ?, ingredient3 == ?, amount3 == ?, ingredient4 == ?, amount4 == ?, ingredient5 == ?, amount5 == ?, ingredient6 == ?, amount6 == ?, ingredient7 == ?, amount7 == ?, ingredient8 == ?, amount8 == ?, step_id_1 == ?, instruction1 == ?, step_id_2 == ?, instruction2 == ?, step_id_3 == ?, instruction3 == ?, step_id_4 == ?, instruction4 == ?, step_id_5 == ?, instruction5 == ? WHERE recipe_id == ?",
    [
      name,
      category,
      ingredient1,
      amount1,
      ingredient2,
      amount2,
      ingredient3,
      amount3,
      ingredient4,
      amount4,
      ingredient5,
      amount5,
      ingredient6,
      amount6,
      ingredient7,
      amount7,
      ingredient8,
      amount8,
      step_id_1,
      instruction1,
      step_id_2,
      instruction2,
      step_id_3,
      instruction3,
      step_id_4,
      instruction4,
      step_id_5,
      instruction5,
      recipe_id,
    ]
  );

  res.status(201).send("Saved");
});

// DELETE STATEMENT

//DELETING CHOSEN RECIPE on /:recipe_id
app.delete("/recipe/:recipe_id", (req, res) => {
  let recipe = [];
  let recipe_id = req.params.recipe_id;

  db.serialize(() => {
    db.each(
      "DELETE FROM free_recipes WHERE recipe_id == ?",
      recipe_id,
      (err, row) => {
        console.log(` ${row.name}, ${row.recipe_id}`);
        recipe.push(row);
      },
      () => {
        res.send("Deleted");
      }
    );
  });
});

app.use("/", router);
app.listen(port, () => console.log("Server is running on port:", port));
