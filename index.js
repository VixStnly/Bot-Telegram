
const TelegramBot = require('node-telegram-bot-api');
const imagePath  = './asset/img/qris.jpg'
const startImage = './asset/img/preview.jpg'
require ('dotenv').config();
const token = process.env.TELEGRAM_BOT_TOKEN ;
const channelLink = process.env.CHANEL_LINK;
const contactLink = process.env.CONTACT_LINK;
const path =require('path');
const axios = require('axios')

const fs = require("fs");
const ffmpegPath = require('ffmpeg-static');
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const command = ffmpeg();
const youtubeApiKey = process.env.YOUTUBE_APIKEY;
const bot = new TelegramBot(token, { polling: true });
const { createCanvas, loadImage } = require('canvas');

const userVerification = new Map();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Ikuti Saluran Kami 🚀',
            url: channelLink
          }
        ],
        [
          {
            text: 'Saya Sudah Mengikuti ✅',
            callback_data: 'verify_follow'
          }
        ]
      ]
    }
  };

  // Mengirim teks dan gambar bersama-sama
  bot.sendPhoto(chatId, startImage, {
    caption: '🎉 Selamat datang di Vix Bot 💰 \n\n\n Terima kasih sudah bergabung dengan kami! 💬 Silakan ikuti saluran kami untuk update terbaru dan informasi penting seputar pembayaran dan layanan kami. Jangan ragu untuk menanyakan apa pun kepada kami di sini! 🌟.',
    reply_markup: opts.reply_markup
  });
});

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;

  if (callbackQuery.data === 'verify_follow') {
    userVerification.set(chatId, true);
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Melakukan Pembayaran💰',
              callback_data: 'make_payment'
            }
          ],
          [
            {
              text: 'Coba Fitur Lain',
              callback_data: 'fitur_fitur'
            }
          ]
        ]
      }
    };
    bot.sendMessage(chatId, 'Terima kasih telah mengikuti saluran kami! 🚀😊 \n\n Apa yang bisa kami bantu hari ini?', opts);
  }else if (callbackQuery.data === 'fitur_fitur') {
    // Logic for when user clicks "Melakukan Pembayaran"
    const fiturOpts = {
     
    };
    bot.sendMessage(chatId, '──────『 OPEN FITUR 』────── \n\n Jangan Pergunakan Bot Ini Untuk Hal Hal Negatif!! \n\n  /play (untuk memutar lagu)\n contoh / play penjaga hati \n /youtubeDL ( untuk download video youtube )', fiturOpts);
  }  else if (callbackQuery.data === 'make_payment') {
    // Logic for when user clicks "Melakukan Pembayaran"
    const paymentOpts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'DANA',
              callback_data: 'payment_dana'
            },
            {
              text: 'GOPAY',
              callback_data: 'payment_gopay'
            },
            {
              text: 'SEABANK',
              callback_data: 'payment_seabank'
            },
            {
              text: 'QRIS',
              callback_data: 'payment_qris'
            },
            {
              text: 'SHOPEEPAY',
              callback_data: 'payment_shopeepay'
            }
          ]
        ]
      }
    };
    bot.sendMessage(chatId, 'Anda ingin melakukan Pembayaran? 🎉 Silakan pilih opsi pembayaran berikut:', paymentOpts);
  } else if (callbackQuery.data === 'payment_dana' || callbackQuery.data === 'payment_gopay' || callbackQuery.data === 'payment_shopeepay') {
    // Logic for different payment methods
    const paymentMethod = callbackQuery.data.substr(8).toUpperCase(); // Extract payment method from callback_data
    const paymentMessage = `❗️SILAHKAN TRANSFER KE \n NOMOR : 085774335792 \n ATAS NAMA : M***** R***** ❗️ \n\n 💌 KIRIM BUKTI PEMBAYARAN KLIK TOMBOL DI BAWAH 💌`;

    const paymentConfirmationOpts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Konfirmasi Telah Transfer ✅',
              url: contactLink
            }
          ]
        ]
      }
    };

    bot.sendMessage(chatId, paymentMessage, paymentConfirmationOpts);
  }else if (callbackQuery.data === 'payment_qris') {
    // Logic for different payment methods
  
   
    const paymentConfirmationOpts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Kirim Bukti Pembayaran✅',
              url: contactLink
            }
          ]
        ]
      }
    };

     bot.sendPhoto(chatId, imagePath, paymentConfirmationOpts,)
     
    .then(() => {
      console.log('Pesan dengan gambar berhasil dikirim');
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
  }
  else if (callbackQuery.data === 'payment_seabank') {
    // Logic for different payment methods
  
    const paymentMessage = `❗️SILAHKAN TRANSFER SEABANK KE \n NOMOR REKENING : 901248780058  \n ATAS NAMA : M***** R***** ❗️ \n\n 💌 KIRIM BUKTI PEMBAYARAN KLIK TOMBOL DI BAWAH 💌`;
    const paymentConfirmationOpts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Kirim Bukti Pembayaran✅',
              url: contactLink
            }
          ]
        ]
      }
    };
    bot.sendMessage(chatId, paymentMessage, paymentConfirmationOpts);
  }
});

//handler play youtube 


// Set path for ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

bot.onText(/\/youtubeDL/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "──────『 FITUR YOUTUBE DOWNLOADER 』─────\n\n 📎 Silahkan Salin Link Youtube Yang Ingin Di Download \n\n 📨noted: kirim link yang awalan (https://www.youtube.com/watch?) "
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (!messageText || typeof messageText !== 'string') {
    return; // Jika pesan tidak ada atau bukan string, keluar dari handler
  }

  if (messageText.includes("youtube.com")) {
    bot.sendMessage(chatId, "Video Anda Sedang Di Proses...✈️").then(async (sentMessage) => {
      const messageId = sentMessage.message_id;

      try {
        const videoId = ytdl.getURLVideoID(messageText);
        const downloadLink = `https://www.youtube.com/watch?v=${videoId}`;

        // Get video details
        const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            id: videoId,
            key: youtubeApiKey,
            part: 'snippet,contentDetails'
          }
        });

        const videoDetails = videoDetailsResponse.data.items[0];
        const videoTitle = videoDetails.snippet.title;
        const videoThumbnail = videoDetails.snippet.thumbnails.high.url;
        const videoChannel = videoDetails.snippet.channelTitle;
        const videoDuration = videoDetails.contentDetails.duration;

        const mp4DownloadPath = `./video_${videoId}.mp4`;
        const mp4DownloadStream = ytdl(downloadLink, {
          filter: (format) => format.container === "mp4",
          quality: "highest",
        });

        const mp4FileStream = fs.createWriteStream(mp4DownloadPath);
        mp4DownloadStream.pipe(mp4FileStream);

        mp4DownloadStream.on("end", () => {
          const mp3DownloadPath = `./audio_${videoId}.mp3`;
          const mp3DownloadStream = ytdl(downloadLink, {
            filter: (format) => format.container === "mp4",
            quality: "highestaudio",
          });
          const mp3FileStream = fs.createWriteStream(mp3DownloadPath);

          mp3DownloadStream.pipe(mp3FileStream);

          mp3DownloadStream.on("end", () => {
            const mergedFilePath = `./merged_${videoId}.mp4`;
            const command = ffmpeg()
              .input(mp4DownloadPath)
              .input(mp3DownloadPath)
              .output(mergedFilePath)
              .on("end", () => {
                const videoData = fs.readFileSync(mergedFilePath);

                bot.sendVideo(chatId, videoData, {
                  caption: `❖━━━[ SUDAH BERES ]━━❖\n\n🎵 Judul: ${videoTitle}\n\n📅 Durasi: ${videoDuration}\n\n👤 Pencipta: ${videoChannel}`,
                  thumb: videoThumbnail,
                }).then(() => {
                  bot.deleteMessage(chatId, messageId); // Hapus pesan "Video Anda Sedang Di Proses..."
                  fs.unlinkSync(mp4DownloadPath);
                  fs.unlinkSync(mp3DownloadPath);
                  fs.unlinkSync(mergedFilePath);
                });

              })
              .on("error", (error) => {
                console.error("Error merging files: ", error);
                bot.sendMessage(chatId, "An error occurred while merging the files.");

                fs.unlinkSync(mp4DownloadPath);
                fs.unlinkSync(mp3DownloadPath);
                fs.unlinkSync(mergedFilePath);
              })
              .run();
          });

          mp3DownloadStream.on("error", (error) => {
            console.error("Error downloading audio: ", error);
            bot.sendMessage(chatId, "An error occurred while downloading the audio.");
          });
        });

        mp4DownloadStream.on("error", (error) => {
          console.error("Error downloading video: ", error);
          bot.sendMessage(chatId, "An error occurred while downloading the video.");
        });

      } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'Maaf, saya tidak bisa memproses video tersebut. Silakan coba lagi nanti.');
      }
    });
  }
});

ffmpeg.setFfmpegPath(ffmpegPath);

bot.onText(/\/play (.+)/, async (msg, match) => {
 
  const chatId = msg.chat.id;
  const query = match[1]; // The query after the command

  bot.sendMessage(chatId, "Lagu Anda Sedang Di Proses...✈️").then(async (sentMessage) => {
    const messageId = sentMessage.message_id;

    try {
      // Search for the video on YouTube
      const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: query,
          key: youtubeApiKey,
          part: 'snippet',
          type: 'video',
          maxResults: 1
        }
      });

      const videoId = searchResponse.data.items[0].id.videoId;
      const videoTitle = searchResponse.data.items[0].snippet.title;
      const videoThumbnail = searchResponse.data.items[0].snippet.thumbnails.high.url;
      const videoChannel = searchResponse.data.items[0].snippet.channelTitle;

      const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          id: videoId,
          key: youtubeApiKey,
          part: 'contentDetails'
        }
      });

      const videoDuration = videoDetailsResponse.data.items[0].contentDetails.duration;

      const downloadLink = `https://www.youtube.com/watch?v=${videoId}`;

      const mp3DownloadPath = path.resolve(__dirname, `audio_${videoId}.mp3`);
      const stream = ytdl(downloadLink, { filter: 'audioonly' });

      ffmpeg(stream)
        .audioBitrate(128)
        .save(mp3DownloadPath)
        .on('end', () => {
          bot.sendAudio(chatId, mp3DownloadPath, {
            caption: `❖━━━[ SUDAH BERES ]━━❖ \n\n🎵 Judul: ${videoTitle}\n\n📅 Durasi: ${videoDuration}\n\n👤 Pencipta: ${videoChannel} \n\n JANGAN LUPA IKUTI CHANNEL = @VixProjectbot`,
            thumb: videoThumbnail,
            title: videoTitle,
            performer: videoChannel,
          }).then(() => {
            bot.deleteMessage(chatId, messageId); // Hapus pesan "Video Anda Sedang Di Proses..."
            fs.unlinkSync(mp3DownloadPath); // Hapus file setelah dikirim
          });
        })
        .on('error', (err) => {
          console.error('Error:', err);
          bot.sendMessage(chatId, 'Maaf, saya tidak bisa memproses lagu tersebut. Silakan coba lagi nanti.');
        });
    } catch (error) {
      console.error('Error:', error);
      bot.sendMessage(chatId, 'Maaf, saya tidak bisa memproses lagu tersebut. Silakan coba lagi nanti.');
    }
  });
});
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;

  const menuText = `──────『 OPEN FITUR 』──────\n\nJangan Pergunakan Bot Ini Untuk Hal Hal Negatif!!\n\n
  > /play (untuk memutar lagu)\n📨contoh: /play penjaga hati
  > /youtubeDL (untuk download video youtube)
  > /anonchat (ngobrol dengan orang random)`;

  bot.sendMessage(chatId, menuText).catch((error) => {
    console.error('Error sending menu:', error);
    bot.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam menampilkan menu.');
  });
});

const waitingUsers = [];
const activeChats = new Map();

// Fungsi untuk menghubungkan dua pengguna
function connectUsers(user1, user2) {
  activeChats.set(user1, user2);
  activeChats.set(user2, user1);

  bot.sendMessage(user1, 'Anda sekarang terhubung dengan pengguna anonim. Ketik /stop untuk mengakhiri obrolan.');
  bot.sendMessage(user2, 'Anda sekarang terhubung dengan pengguna anonim. Ketik /stop untuk mengakhiri obrolan.');
}

// Handler untuk perintah /startchat
bot.onText(/\/anonchat/, (msg) => {
  const chatId = msg.chat.id;

  if (activeChats.has(chatId)) {
    bot.sendMessage(chatId, 'Anda sudah terhubung dengan pengguna lain. Ketik /stop untuk mengakhiri obrolan.');
    return;
  }

  if (waitingUsers.length > 0) {
    const partnerId = waitingUsers.shift();
    connectUsers(chatId, partnerId);
  } else {
    waitingUsers.push(chatId);
    bot.sendMessage(chatId, 'Menunggu pengguna lain untuk terhubung...');
  }
});

// Handler untuk perintah /stop
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;

  if (!activeChats.has(chatId)) {
    bot.sendMessage(chatId, 'Anda tidak sedang terhubung dengan pengguna mana pun.');
    return;
  }

  const partnerId = activeChats.get(chatId);

  activeChats.delete(chatId);
  activeChats.delete(partnerId);

  bot.sendMessage(chatId, 'Obrolan anonim Anda telah dihentikan.');
  bot.sendMessage(partnerId, 'Pengguna anonim telah menghentikan obrolan. ketik /anonchat untuk mencari teman lagi');
});

// Meneruskan pesan antara pengguna yang terhubung
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (activeChats.has(chatId) && msg.text !== '/anonchat' && msg.text !== '/stop') {
    const partnerId = activeChats.get(chatId);
    bot.sendMessage(partnerId, msg.text);
  }
});