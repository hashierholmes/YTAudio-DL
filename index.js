const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));

// SERVE STATIC FILES FROM 'web' FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE TO HANDLE AUDIO DOWNLOADS
app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = path.join('/tmp', `${title}.mp3`);

    const options = {
      quality: 'lowestaudio',
      filter: 'audioonly',
    };

    const stream = ytdl(url, options).pipe(fs.createWriteStream(filePath));

    stream.on('finish', () => {
      res.download(filePath, `${title}.mp3`, (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
