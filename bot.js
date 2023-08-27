const { default: axios } = require("axios");
const { Telegraf, Markup, session, Scenes } = require("telegraf");
const crypto = require("crypto");
const fs = require("fs");
const { isUtf8 } = require("buffer");
const path = require("path");
const db = require("./db");
const User = require("./User");
require("dotenv/config");
const productionAtmosToken = process.env.ProductionAtmosToken;

//db connection
db();
async function usersFind() {
  let result = await User.create({
    first_name: "Muhammadjon",
    username: "qwertyuio",
    phone: "+999999999",
  });
  console.log(result);
  const users = await User.findOne({
    phone: "+999999999",
    is_deleted: false,
  }).select("-password -is_deleted");
  console.log(users);
  return users;
}
// usersFind();
//db connection_

// variables
// console.log(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
const langs = {
  uz: {
    test: "Pastdagi tugmalar yordamida o`zingizga kerakli usulni tanlang 👇",
  },
  ru: {
    test: "Выберите нужный вам способ с помощью кнопок ниже 👇",
  },
};

const language = Markup.keyboard([
  Markup.button.callback("uz", isUtf8),
  Markup.button.text("ru"),
])
  .oneTime()
  .resize()
  .selective();
const keyboard = Markup.keyboard([Markup.button.callback("/start ", isUtf8)])
  .oneTime()
  .resize()
  .selective();

const telKeyboardRu = Markup.keyboard([
  Markup.button.contactRequest("Отправьте свой номер телефона"),
])
  .oneTime()
  .resize()
  .selective();

const telKeyboardUz = Markup.keyboard([
  Markup.button.contactRequest("Telefon raqamingizni yuboring"),
])
  .oneTime()
  .resize()
  .selective();

// variables_end
// const keyboard = Markup.keyboard([Markup.button.callback("Kirish", isUtf8)])
//   .oneTime()
//   .resize()
//   .selective();

// ctx.reply(
// "Botga xush kelibsiz! \n Bot royhatdan otish uchun pastdagi tugmani bosing",
// keyboard
// );

//   await ctx.scene.enter("CONTACT_DATA");
//   contactData.enter((ctx) => {});
//bundan pasga yozilishi togri boladi

//commands
bot.command("lang", (ctx) => {
  ctx.reply(`Tilni tanlang:\n\nВыберите язык:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇷🇺 Русский язык", callback_data: "russian" }],
        [{ text: "🇺🇿 O'zbekcha", callback_data: "uzbek" }],
      ],
    },
  });
});

bot.command("help", (ctx) => {
  ctx.reply(
    ctx.session.language == "uz"
      ? `/start - Botni qayta ishga tushurish , \n/lang - Tilni alishtirish \n/help - Yordam .`
      : "/start - Перезапустить бота, \n/lang - Сменить язык,\n/help - Справка"
  );
});
bot.command("dev", (ctx) => {
  ctx.reply(
    "Ushbu Bot Saidqodirxon Rahimov && Muhammadjon Abduvaxobov tomonidan yozilgan ..."
  );
});
//commands_

//scenes

const contactData = new Scenes.WizardScene(
  "CONTACT_DATA",
  (ctx) => {
    ctx.reply(
      `Assalomu Alaykum Botimizga Xush kelibsiz! Tilni tanlang:\n\nПривет и добро пожаловать в наш бот! Выберите язык:`,
      language
      // {
      //   reply_markup: {
      //     inline_keyboard: [
      //       [{ text: "🇷🇺 Русский язык", callback_data: "russian" }],
      //       [{ text: "🇺🇿 O'zbekcha", callback_data: "uzbek" }],
      //     ],
      //   },
      // }
    );
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    let rozichilik = Markup.keyboard([
      Markup.button.text("ha"),
      Markup.button.text("yo'q"),
    ])
      .oneTime()
      .resize()
      .selective();
    ctx.reply("Oferta shartlari rozimisiz", rozichilik);

    ctx.wizard.state.contactData.lang = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text !== "ha") {
      ctx.reply("Unda pashol naxxuy");
      return;
    }
    ctx.reply(
      "Royhatdan o'tishni davom ettirish uchun pastdagi tugma orqali raqamingizni jonating",
      telKeyboardUz
    );
    ctx.wizard.state.contactData.lang = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomNumber = getRandomInt(100000, 999999);
    ctx.wizard.state.contactData.phone = ctx.message.contact.phone_number;
    ctx.wizard.state.contactData.code = randomNumber;

    console.log(ctx.wizard.state.contactData.phone);
    console.log(ctx.wizard.state.contactData.code);

    // const url =
    //   "http://api.smsuz.uz/v1/sms/send?token=0b0143b1-f076-44ea-822b-6359c2a0e422";

    // const data = {
    //   message: {
    //     recipients: [`${ctx.wizard.state.contactData.phone}`],
    //   },
    //   priority: "default",
    //   sms: {
    //     content: `OlmosTaxi uchun tasdiqlash kodi : ${randomNumber}`,
    //   },
    // };

    // axios
    //   .post(url, data)
    //   .then((response) => {
    //     console.log(response.data);
    //     ctx.reply(
    //       ctx.session.language == "uz"
    //         ? "Yuborgan telefon raqamingizga kelgan kodni kiriting: "
    //         : "Введите код, пришедший на отправленный вами номер телефона:",
    //       keyboard
    //     );
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     ctx.reply(
    //       ctx.session.language == "uz"
    //         ? `SMS yuborilmadi. Siz ko´p marotaba urindingiz, keyinroq urinib koring `
    //         : "СМС не отправлено. Вы пытались сделать это слишком много раз, повторите попытку позже.",
    //       keyboard
    //     );
    //   });

    // ctx.reply("raqamingizga sms yubordik wuni tasdiqlang");
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    // console.log(
    //   typeof ctx.message.text * 1 !== Number,
    //   ctx.message.text * 1 === NaN
    // );
    if (ctx.message.text * 1 === NaN) {
      ctx.reply("faqat raqamlarni kiriting");
      return;
    }
    if (ctx.message.text.length < 6) {
      ctx.reply("noto'g'ri raqam");
      return;
    }
    if (ctx.message.text * 1 !== ctx.wizard.state.contactData.code) {
      ctx.reply("notogri raqam");
      return;
    }
    if (ctx.message.text * 1 === ctx.wizard.state.contactData.code) {
      //   ctx.wizard.state.contactData.phone = ctx.message.text;
      ctx.reply("Raqamingiz tasdiqlandi");
      let passtypes = Markup.keyboard([
        Markup.button.text("id"),
        Markup.button.text("biometrik"),
      ])
        .oneTime()
        .resize()
        .selective();
      ctx.reply("passport turi", passtypes);
      // ctx.reply(ctx.wizard.state.contactData.lang);
      ctx.wizard.next();
    }
    return ctx.wizard.next();
  },
  // (ctx) => {
  //   // console.log("wetga keldi");

  //   // ctx.wizard.state.contactData.lang = ctx.message.text;
  //   return ctx.wizard.next();
  // },
  (ctx) => {
    // if (ctx.message.text !== "ha") {
    //   ctx.reply("Unda pashol naxxuy");
    //   return;
    // }
    let buttons = Markup.keyboard([
      Markup.button.text("ha"),
      Markup.button.text("yo'q"),
    ])
      .oneTime()
      .resize()
      .selective();
    ctx.reply("samozanyatemi", buttons);
    ctx.wizard.state.contactData.passtype = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("passport seria raqamini kiriting lotincada");
    ctx.wizard.state.contactData.samozanyate = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("pnflni kirgiz");
    ctx.wizard.state.contactData.passportSeria = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("tugilgan kuningiz");
    ctx.wizard.state.contactData.pnfl = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.reply("passportni rasmini tawa");
    ctx.wizard.state.contactData.birthday = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.reply("litsevoy birbalo vaditelskiy rasm tawa");
    const photo = ctx.message.photo;
    console.log("this is photos", photo);
    // const photoId = photo.file_id;

    // Get the admin's chat ID
    const adminChatId = "5033207519"; // Change it to the actual admin's chat ID

    console.log(ctx.chat.first_name, ctx.chat.username);
    let name =
      ctx.chat.first_name + " " + ctx.chat.last_name ? ctx.chat.last_name : ""; // Forward the photo to the admin

    let username = ctx.chat.username ? ctx.chat.username : " ";
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `From ${name}: \n @${username}`,
    }));
    // {
    //   caption: `From ${name}: \n @${username}`,
    // }
    function filterSameFileIds(data) {
      const fileIds = {};
      const filteredData = [];

      for (let item of data) {
        const fileId = item.file_id;

        if (!fileIds[fileId]) {
          fileIds[fileId] = true;
          filteredData.push(item);
        }
      }

      return filteredData;
    }
    let data = filterSameFileIds(media);
    await ctx.telegram.sendMediaGroup(adminChatId, data, {
      caption: "passport",
    });

    // Send a confirmation message to the user
    await ctx.reply("Your photo has been shared with the admin.");
    // });
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.contactData.email = ctx.message.text;
    ctx.reply("Thank you for your replies, we'll contact your soon");
    // await mySendContactDataMomentBeforeErase(ctx.wizard.state.contactData);
    return ctx.scene.leave();
  }
);
contactData.action("russian", (ctx) => {
  if (ctx.session.language) {
    ctx.session.language = "ru";
    ctx.reply("Язык успешно измененo!✅");
    return;
  }

  ctx.session.language = "ru";
  ctx.reply(
    "Язык выбран успешно! ✅\nДля регистрации отправьте свой номер с помощью кнопки ниже и подтвердите с помощью смс-уведомления.🤝",
    telKeyboardRu
  );
});

contactData.action("uzbek", (ctx) => {
  if (ctx.session.language) {
    ctx.session.language = "uz";
    ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
    return;
  }
  // console.log(ctx.wizard.state.contactData.code);
  ctx.session.language = "uz";
  let file = fs.readFileSync(
    path.join(__dirname + "/ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf")
  );
  console.log(ctx.chat.id);

  const oferta = fs.readFileSync(
    "./ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf",
    "utf8"
  );
  ctx.reply(
    "Til muvaffaqiyatli tanlandi!✅\nRo'yhatdan o'tish davom etishingiz mumkin.🤝",
    telKeyboardUz
  );
});
const stage = new Scenes.Stage([contactData]);
// const stage = new Scenes.Stage([wizardScene, getSMSCodScene, getAll]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter("CONTACT_DATA");
});
//scenes_

//actions
const warningWords = ["/start", "kirish", "aвторизоваться", "/help", "dev"]; // Taqiqlangan so'zlarning ro'yxati

bot.on("text", (ctx) => {
  const messageText = ctx.message?.text.toLowerCase();
  if (!warningWords.includes(messageText)) {
    ctx.reply(
      ctx.session.language == "uz"
        ? `Uzr, bu buyruqni tushunmayman, \n qayta /start bosing`
        : `Извините, я не понимаю эту команду,\n Нажмите /старт еще раз`
    );
  }
});

bot.action("russian", (ctx) => {
  if (ctx.session.language) {
    ctx.session.language = "ru";
    ctx.reply("Язык успешно измененo!✅");
    return;
  }

  ctx.session.language = "ru";
  ctx.reply(
    "Язык выбран успешно! ✅\nДля регистрации отправьте свой номер с помощью кнопки ниже и подтвердите с помощью смс-уведомления.🤝",
    telKeyboardRu
  );
});

bot.action("uzbek", (ctx) => {
  if (ctx.session.language) {
    ctx.session.language = "uz";
    ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
    return;
  }

  ctx.session.language = "uz";
  let file = fs.readFileSync(
    path.join(__dirname + "/ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf")
  );
  console.log(ctx.chat.id);

  const oferta = fs.readFileSync(
    "./ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf",
    "utf8"
  );
  ctx.reply(
    "Til muvaffaqiyatli tanlandi!✅\nRo'yhatdan o'tish davom etishingiz mumkin.🤝",
    telKeyboardUz
  );
});
// bot.hears("Kirish", (ctx) => {
//   console.log("hear qildi");
//   //   await ctx.scene.enter("CONTACT_DATA");
//   //   contactData.enter((ctx) => {});
//   ctx.scene.enter("CONTACT_DATA");
// });
//actions_

bot.launch();
console.log("Bot ishladi");
