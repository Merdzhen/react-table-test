const express = require('express');
const morgan = require('morgan');

const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { sequelize, MyTable } = require('./db/models');

const app = express();

const PORT = process.env.PORT ?? 3000;

const corsConfig = {
  // Домены которым разрешен доступ к файлам
  origin: ['http://localhost:3000'],
};

app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/table', async (req, res) => {
  try {
    const tableData = await MyTable.findAll({ raw: true });
    res.json(tableData);
  } catch (error) {
    console.log(error);
  }
});

async function tryconnect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

app.listen(PORT, () => {
  console.log(`server started on PORT: ${PORT}`);
  tryconnect();
});
