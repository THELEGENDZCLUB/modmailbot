const express = require('express');
const app = express();
const config = require('./config');
const path = require('path');
const mongoose = require('mongoose');
var database;
module.exports = (db) => database = db;
if(!database) {
    (async () => {
    try {
    await mongoose.connect(config.databaseURI, { useUnifiedTopology: true, useNewUrlParser: true });
    database = mongoose.model("modmail_logs", new mongoose.Schema({ Id: String, Channel: String, User: String, Timestamp: Number, Messages: Array }));
    }catch(e) {
        console.log(e)
    }
})();
}

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.enable('trust proxy'); 
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    console.log(await database.find({}))
    res.send("OK")
})
app.get('/:id/raw', async (req,res) => {
    const data = await database.findOne({ Id: req.params.id });
    if(!data)return res.json({ message: 'This log does not exist.' });
    res.json({
       Id: data.Id,
       User: data.User,
       Channel: data.Channel,
       Messages: data.Messages
    });
})

app.get('/:id', async (req,res) => {
    const data = await database.findOne({ Id: req.params.id });
    if(!data)return res.json({ message: 'This log does not exist.' });
    var content = '';
    data?.Messages?.forEach((e) => {
     for(i in e) {
      content += `
      <div class="message-group hide-overflow">
      <div class="avatar-large" style="background-image: url(${e[i].avatar})"></div>
      <div class="comment">
          <div class="message" style="height: 25px;">
             <strong class="username">${i}</strong>
                  <span class="timestamp">${e[i].timestamp}</span>
          </div>
          ${e[i].content}
      </div>
  </div>
      `
}

    })
    res.render('log', { content });
})
app.listen(config?.port);   
