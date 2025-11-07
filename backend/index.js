
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Profile = sequelize.define('Profile', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.TEXT
  },
  bio: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  follower_count: {
    type: DataTypes.STRING
  },
  connection_count: {
    type: DataTypes.STRING
  }
});

app.post('/api/profiles', async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
