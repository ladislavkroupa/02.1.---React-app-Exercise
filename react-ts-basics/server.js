import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import pg from "pg";
import passport from "passport";
import { Strategy } from "passport-local";
import session, { Cookie } from "express-session";
import env from "dotenv";
import bcrypt from "bcrypt";
import GoogleStrategy from "passport-google-oauth2";
import { format } from "date-fns";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type"], // this is needed for sending JSON
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 30 },
  })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializace Passport
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

async function getUserFromDb(email) {
  try {
    const response = await db.query(
      "select * from users u join users_detail ud on ud.fk_user_id = u.id where u.email=$1",
      [email]
    );

    if (response.rowCount > 0) {
      return JSON.stringify(response.rows[0]);
    } else {
      console.log("nok");
      return null;
    }
  } catch (error) {
    console.log(error);
    console.log("Cannot get users from DB.");
  }
}

app.get("/", (req, res) => {
  res.redirect("http://localhost:5173");
});

app.get("/welcome", async (req, res) => {
  res.sendStatus(401);
});

app.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.sendStatus(204);
});

function getAge(dateString) {
  const birthDate = new Date(dateString);

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  console.log(`Age is: ${age}`);
  return age;
}

app.post("/register", async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const userDetail = req.body.userDetail;

  try {
    const checkResult = await db.query("SELECT * FROM users where email = $1", [
      username,
    ]);
    if (checkResult.rows.length > 0) {
      console.log("user is already reigstered");
      res.status(400).json({ error: "User is already registered" });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error while hashing password:", err);
        } else {
          const actualAge = getAge(userDetail.age);
          const newUser = await db.query(
            "INSERT INTO users (email, password, name, surname, phone, age, birthdate) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *",
            [
              username,
              hash,
              userDetail.name,
              userDetail.surname,
              userDetail.phone,
              actualAge,
              userDetail.age,
            ]
          );
          const userData = newUser.rows[0];
          userData.birthdate = format(
            new Date(userData.birthdate),
            "dd.MM.yyyy"
          );
          console.log(userData);
          req.login(userData, (err) => {
            console.log(userData);
            res.redirect("/profile");
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!user) {
      console.log(info);
      return res.status(400).json({ error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      return res.redirect("/profile");
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.sendStatus(200);
  });
});

app.put("/edit-user-info/:id", async (req, res) => {
  const { name, surname, phone, birthdate } = req.body;
  const userId = req.params.id;
  console.log("PUT | Request body:");
  console.log(req.body);

  const age = getAge(birthdate);

  try {
    const response = await db.query(
      "update users set name=$1, surname=$2, phone=$3, birthdate=$4, age=$5 where id = $6 RETURNING *",
      [name, surname, phone, birthdate, age, userId]
    );
    const newUserData = response.rows[0];
    console.log("Put " + " " + newUserData);
    newUserData.birthdate = format(
      new Date(newUserData.birthdate),
      "dd.MM.yyyy"
    );
    req.session.passport.user = newUserData;
    console.log(req.session.passport.user);
    req.session.save((err) => {
      if (err) {
        return res.status(500).send("Error saving session");
      }
      res.status(200).json(newUserData);
    });
  } catch (error) {
    console.log("Error while db quereing, ");
    console.log(error);
    res.status(400).json({ error: "Couldnt find user" });
  }
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, done) {
    try {
      const result = await db.query("select * from users where email=$1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        user.age = getAge(user.birthdate);
        user.birthdate = format(new Date(user.birthdate), "dd.MM.yyyy");
        console.log(user);
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error while comparing password:", err);
            return done(err);
          } else {
            if (valid) {
              console.log(user);
              console.log("Success");
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid password" });
            }
          }
        });
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.listen(port, () => {
  console.log(`App is listnening on port: ${port}`);
});
