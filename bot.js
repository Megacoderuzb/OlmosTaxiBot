const { default: axios } = require("axios");
const { Telegraf, Markup, session, Scenes } = require("telegraf");
const crypto = require("crypto");
const fs = require("fs");
const { isUtf8 } = require("buffer");
const path = require("path");
const db = require("./db");
const User = require("./User");
const Card = require("./Card");
require("dotenv/config");
const productionAtmosToken = process.env.ProductionAtmosToken;

//db connection
db();
async function usersFind(phone) {
  // let result = await User.create({
  //   full_name: "Muhammadjon",
  //   username: "mega_coder_uzb",
  //   phone: "+998916223406",
  // });
  // console.log(result);
  const users = await User.findOne({
    phone: phone,
  });
  console.log(users);
  return users;
}
// usersFind();
async function addcard(tg_id, numbers) {
  let card = await Card.create({ tg_id, numbers });
}
// addcard(5033207519,1234567898765432)
//db connection_

// variables
let user;
let yandexData;
let user_balance;
const adminChatId = "5033207519";
// console.log(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);

const language = Markup.keyboard([
  Markup.button.text("uz"),
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

//
async function getToken() {
  const response = await axios.post(
    "https://api.atmos.uz/token?grant_type=client_credentials",
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${productionAtmosToken}`,
      },
    }
  );
  return response.data[Object.keys(response.data)[0]];
}

// const regtoken = getToken();
//
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
    user.lang == "uz"
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
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    ctx.wizard.state.contactData.lang = ctx.message.text;
    let rozichilik = Markup.keyboard([
      Markup.button.text("ha"),
      Markup.button.text("yo'q"),
    ])
      .oneTime()
      .resize()
      .selective();

    ctx.reply(
      "Oferta shartlariga rozimisiz: \n https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link",
      rozichilik
    );

    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    if (ctx.message.text !== "ha") {
      ctx.reply("Unda uzur biz siz bilan ishlay olmaymiz");
      return;
    }
    ctx.reply(
      "Royhatdan o'tishni davom ettirish uchun pastdagi tugma orqali raqamingizni jonating",
      telKeyboardUz
    );
    // ctx.wizard.state.contactData.lang = ctx.message.text;
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
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
    //       user.lang == "uz"
    //         ? "Yuborgan telefon raqamingizga kelgan kodni kiriting: "
    //         : "Введите код, пришедший на отправленный вами номер телефона:",
    //       keyboard
    //     );
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     ctx.reply(
    //       user.lang == "uz"
    //         ? `SMS yuborilmadi. Siz ko´p marotaba urindingiz, keyinroq urinib koring `
    //         : "СМС не отправлено. Вы пытались сделать это слишком много раз, повторите попытку позже.",
    //       keyboard
    //     );
    //   });

    // ctx.reply("raqamingizga sms yubordik wuni tasdiqlang");
    return ctx.wizard.next();
  },
  async (ctx) => {
    // validation
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }

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
      ///
      const clientId = "taxi/park/b756b1c971a64253b201829adcedf3ea";
      const apiKey = "QCqYmRRKAtzWdhrjqYnRllvsYAFtDYBQh";
      const partnerId = "b756b1c971a64253b201829adcedf3ea";

      const url =
        "https://fleet-api.taxi.yandex.net/v1/parks/driver-profiles/list";
      const headers = {
        "X-Client-ID": clientId,
        "X-Api-Key": apiKey,
      };

      const data = {
        query: {
          park: {
            id: partnerId,
          },
        },
      };

      try {
        const response = await axios.post(url, data, { headers });
        const resData = response.data;
        // console.log(resData);

        // ctx.reply("Malumotlar keldi");

        // const luqmonovich = "+998990222228";
        // const ahmadjonovich = "+998935206680";
        const gapborovich = "+998940229020";
        // const yaroqsizNomer = "+998904024707";

        async function topish(phoneNumber) {
          let found = false;
          //

          //
          for (let i = 0; i < resData.driver_profiles.length; i++) {
            if (
              resData.driver_profiles[i].driver_profile.phones.includes(
                phoneNumber
              )
            ) {
              yandexData = resData.driver_profiles[i];
              // console.log(user.driver_profile);
              // const yandexUserId = user.driver_profile.id;
              // ctx.session.yandexUserId = yandexUserId;
              // ctx.session.driverFirstName = user.driver_profile.first_name;
              // ctx.session.driverLastName = user.driver_profile.last_name;
              // ctx.session.driverMiddleName = user.driver_profile.middle_name;

              user_balance =
                yandexData.accounts[0].balance >= 20000.0
                  ? yandexData.accounts[0].balance - 20000.0
                  : 0;

              // ctx.reply(`${userPhoneNumber}`);
              let myBalance = yandexData.accounts[0].balance;
              console.log(myBalance);
              // ctx.reply(`Tilni tanlang:\n\nВыберите язык:`);
              found = true;

              ctx.reply("Raqamingiz tasdiqlandi");
              // break;
            }
          }
          if (!found) {
            // ctx.reply(`+${userPhoneNumber}`);
            ctx.reply(
              "Bunday foydalanuvchi topilmadi 🤷🏼‍♂️, qaytadan urinib ko'ring 🔄\n Пользователь не найден 🤷🏼‍♂️, попробуйте еще раз 🔄"
            );
          }
        }
        // const userPhoneNumber = ctx.session.userPhoneNumber;

        // let dbData = await db
        //   .collection("Users")
        //   .find({ phone: userPhoneNumber })
        //   .toArray();
        // console.log(dbData, "wu yerdaku");
        console.log(ctx.wizard.state.contactData.phone);
        // topish(`${ctx.wizard.state.contactData.phone}`);

        topish(gapborovich);
      } catch (error) {
        console.error(error);
        // Stop
        ctx.reply(
          user.lang == "uz"
            ? "Xatolik yuz berdi: " + error.message
            : "Произошла ошибка: " + error.message
        );
      }
      ///

      let passtypes = Markup.keyboard([
        Markup.button.text("id"),
        Markup.button.text("biometrik"),
      ])
        .oneTime()
        .resize()
        .selective();
      ctx.reply("passport turi", passtypes);

      ctx.wizard.next();
    }
    return ctx.wizard.next();
  },

  (ctx) => {
    console.log(ctx.message.text, "passportturi");
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    if (ctx.message.text !== "id" || ctx.message.text !== "biometrik") {
      ctx.reply("bunaqa variant yoq");
      return;
    }
    ctx.wizard.state.contactData.passtype = ctx.message.text;

    console.log(ctx.wizard.state.contactData.passtype, "bu passtype");
    return ctx.wizard.next();
  },
  (ctx) => {
    console.log(ctx.message.text, "passportturi");
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }

    ctx.wizard.state.contactData.passtype = ctx.message.text;
    let buttons = Markup.keyboard([
      Markup.button.text("ha"),
      Markup.button.text("yo'q"),
    ])
      .oneTime()
      .resize()
      .selective();
    ctx.reply("samozanyatemi", buttons);
    console.log(ctx.wizard.state.contactData.passtype, "bu passtype");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    ctx.reply("passport seria raqamini kiriting lotincada");
    ctx.wizard.state.contactData.samozanyate = ctx.message.text;
    console.log(ctx.message.text, "bu samozanyate");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    ctx.reply("pnflni kirgiz");
    ctx.wizard.state.contactData.passportSeria = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    ctx.reply("tugilgan kuningiz");
    ctx.wizard.state.contactData.pnfl = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    ctx.reply("passportni rasmini yuklang");
    ctx.wizard.state.contactData.birthday = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    const photo = ctx.message.photo;
    console.log("this is photos", photo);

    console.log(ctx.chat.first_name, ctx.chat.username);
    let name =
      ctx.chat.first_name + " " + ctx.chat.last_name ? ctx.chat.last_name : "";
    let username = ctx.chat.username ? ctx.chat.username : " ";
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `From ${name}: \n @${username} \n Passport`,
    }));

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
    console.log("data", data);
    await ctx.telegram.sendMediaGroup("5033207519", data);

    await ctx.reply("litsevoy birbalo vaditelskiy rasm tawa");

    return ctx.wizard.next();
  },

  async (ctx) => {
    if (ctx.message.text === "/start") {
      ctx.scene.leave();
    }
    const photo = ctx.message.photo;
    console.log("this is photos", photo);

    console.log(ctx.chat.first_name, ctx.chat.username);
    let name =
      ctx.chat.first_name + " " + ctx.chat.last_name ? ctx.chat.last_name : "";
    let username = ctx.chat.username ? ctx.chat.username : " ";
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `From ${name}: \n @${username} \n litsevoy`,
    }));

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
    console.log("data", data);
    await ctx.telegram.sendMediaGroup("5033207519", data);
    await ctx.reply(
      "Barcha malumotlaringiz adminlarga jonatildi. Tasdiqlanishini kuting"
    );
    let ism =
      ctx.chat.first_name + " " + ctx.chat.last_name ? ctx.chat.last_name : "";
    let user = ctx.chat.username ? ctx.chat.username : " ";
    console.log(ism, user);
    console.log(ctx.wizard.state.contactData.passtype);
    let self_employment =
      ctx.wizard.state.contactData.samozanyate == "ha" ? true : false;
    let result = await User.create({
      full_name: ism,
      username: user,
      tg_id: ctx.from.id,
      phone: ctx.wizard.state.contactData.phone,
      lang: ctx.wizard.state.contactData.lang,
      pnfl: ctx.wizard.state.contactData.pnfl,
      passport_seria: ctx.wizard.state.contactData.passportSeria,
      self_employment: self_employment,
    });
    console.log(result);
    await ctx.telegram.sendMessage(
      adminChatId,
      `Murojatchi: ${ism}, \n Username: ${user} \n Telefon Raqami: ${ctx.wizard.state.contactData.phone} \n Passport Turi: ${ctx.wizard.state.contactData.passtype} \n samozanyate: ${ctx.wizard.state.contactData.samozanyate} \n Passport Seria Raqami: ${ctx.wizard.state.contactData.passportSeria} \n PNFL: ${ctx.wizard.state.contactData.pnfl} \n Tugilgan Sana: ${ctx.wizard.state.contactData.birthday} `,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅",
                callback_data: `approve_${result._id}`,
              },
              {
                text: "❌",
                callback_data: `cancel_${result._id}`,
              },
            ],
          ],
        },
      }
    );
    return ctx.scene.leave();
  }
);
contactData.action("russian", (ctx) => {
  if (user.lang) {
    user.lang = "ru";
    ctx.reply("Язык успешно измененo!✅");
    return;
  }

  user.lang = "ru";
  ctx.reply(
    "Язык выбран успешно! ✅\nДля регистрации отправьте свой номер с помощью кнопки ниже и подтвердите с помощью смс-уведомления.🤝",
    telKeyboardRu
  );
});

// contactData.action("cancel:(.*)", (ctx) => {
//   const id = ctx.match[1];
//   console.log("bekor qildi scenedan", id);
// });
// contactData.action("complate:(.*)", (ctx) => {
//   const id = ctx.match[1];
//   console.log("complate qildi qildi scenedan", id);
// });
// bot.action("cancel", (ctx) => {
//   const id = ctx.match[1];
//   console.log("bekor qildi tawqaridan", id);
// });
// bot.action("complate", (ctx) => {
//   const id = ctx.match[1];
//   console.log("complate qildi qildi tawqaridan", id);
// });
bot.action(/(approve|cancel)_/, async (ctx) => {
  const action = ctx.match[1];
  const id = ctx.callbackQuery.data.split("_")[1];
  console.log(id);
  if (action === "approve") {
    const updated = await User.findByIdAndUpdate(
      id,
      { is_complated: true, is_deleted: false },
      { new: true }
    );
    console.log(updated);
    ctx.reply("Tasdiqlandi ✅");
    // Buttonni tasdiqlash
  } else if (action === "cancel") {
    const deleted = await User.findByIdAndUpdate(
      id,
      { is_deleted: true, is_complated: false },
      { new: true }
    );
    console.log(deleted);
    ctx.reply("Bekor qilindi ❌");
    // Buttonni bekor qilish
  }

  ctx.answerCbQuery();
});
// contactData.action("uzbek", (ctx) => {
//   if (user.lang) {
//     user.lang = "uz";
//     ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
//     return;
//   }
//   // console.log(ctx.wizard.state.contactData.code);
//   user.lang = "uz";
//   let file = fs.readFileSync(
//     path.join(__dirname + "/ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf")
//   );
//   console.log(ctx.chat.id);

//   const oferta = fs.readFileSync(
//     "./ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf",
//     "utf8"
//   );
//   ctx.reply(
//     "Til muvaffaqiyatli tanlandi!✅\nRo'yhatdan o'tish davom etishingiz mumkin.🤝",
//     telKeyboardUz
//   );
// });
// const keyboard = Markup.keyboard([Markup.button.callback("/start ", isUtf8)])
//   .oneTime()
//   .resize()
//   .selective();
const wizardScene = new Scenes.WizardScene(
  "getCardInfo",
  (ctx) => {
    console.log(user.lang);
    ctx.reply(
      user.lang == "uz"
        ? "Iltimos karta raqamini kiriting"
        : "Пожалуйста, введите номер карты",
      keyboard
    );
    return ctx.wizard.next();
    // Stop
  },
  async (ctx) => {
    ctx.wizard.state.cardInfo = {};
    if (!ctx.message?.text) {
      return;
    }
    ctx.wizard.state.cardInfo.userCardInfo = ctx.message?.text;
    console.log(ctx.wizard.state.cardInfo.userCardInfo);

    // const regtoken = ctx.session.regToken;
    const userCardInfo = ctx.wizard.state.cardInfo.userCardInfo;
    const isNumeric = /^\d+$/.test(userCardInfo);

    if (userCardInfo === "/start") {
      ctx.scene.leave();
      // ctx.session = {};
      return ctx.reply(
        `Assalomu Alaykum Botimizga Xush kelibsiz! Tilni tanlang:\n\nПривет и добро пожаловать в наш бот! Выберите язык:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🇷🇺 Русский язык", callback_data: "russian" }],
              [{ text: "🇺🇿 O'zbekcha", callback_data: "uzbek" }],
            ],
          },
        }
      );
    }
    // /cancel
    if (userCardInfo.length !== 16 || !isNumeric) {
      console.log(userCardInfo);
      delete ctx.wizard.state["cardInfo"]; // clear state to start over again
      return ctx.reply(
        user.lang == "uz"
          ? "Karta raqami xato"
          : "Неверный формат номера карты",
        user.lang == "uz" ? telKeyboardUz : telKeyboardRu
      );
    }

    // another

    let data = JSON.stringify({
      card_number: userCardInfo,
    });

    if (!regtoken) {
      return ctx.reply(
        user.lang == "uz"
          ? "Qaytadan ro'yxatdan o'ting /start"
          : "Зарегистрируйтесь снова /start"
      );
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.atmos.uz/out/1.0.0/asl/info",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${regtoken}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      let info = response.data.data;
      console.log(info);
      if (info) {
        ctx.reply(
          user.lang == "uz"
            ? `👤 Egasi: ${info.name}; \n 💳 Karta Raqami: ${info.pan}; \n 📞 Telefon Raqami: ${info.phone}; \n 🏦 Bank Nomi: ${info.bank_name}; \n 💳 Karta Turi: ${info.processing_type}`
            : `👤 Владелец: ${info.name}; \n 💳 Номер карты: ${info.pan}; \n 📞  Номер телефона: ${info.phone}; \n 🏦 банк: ${info.bank_name}; \n 💳 Тип карты: ${info.processing_type}`
        );
        ctx.wizard.state.cardInfo.card_id = response.data.data.id;
      } else {
        return ctx.reply(
          user.lang == "uz"
            ? "Siz kiritgan karta raqami mavjud emas iltimos qayta urunib ko'ring."
            : "Введенный вами номер карты не существует. Повторите попытку",
          keyboard
        );
      }
    } catch (error) {
      console.log(error);
      return ctx.reply(
        user.lang == "uz"
          ? "Siz kiritgan karta raqami mavjud emas iltimos qayta urunib ko'ring."
          : "Введенный вами номер карты не существует. Повторите попытку",
        keyboard
      );
    }

    ctx.reply(
      user.lang
        ? "Endi o'tkazma summasini kiriting"
        : "Теперь введите сумму перевода",
      keyboard
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    // const regtoken = ctx.session.regToken;
    const amountMoney = ctx.message?.text;
    ctx.session.amountMoney = amountMoney;

    const yandexBalance = ctx.session?.balance;

    if (amountMoney === "/start") {
      ctx.scene.leave();
      // return ctx.reply(
      // ctx.session = {};
      return ctx.reply(
        `Assalomu Alaykum Botimizga Xush kelibsiz! Tilni tanlang:\n\nПривет и добро пожаловать в наш бот! Выберите язык:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🇷🇺 Русский язык", callback_data: "russian" }],
              [{ text: "🇺🇿 O'zbekcha", callback_data: "uzbek" }],
            ],
          },
        }
      );
      // );
    }
    if (amountMoney > yandexBalance) {
      // ctx.scene.leave();
      return ctx.reply(
        user.lang == "uz"
          ? ` Siz bu summani yecha olmaysiz! Sizning hisobingizda ${Math.trunc(
              user.balance
            )} UZS mablag' bor `
          : ` Вы не можете снять эту сумму! У вас на счету ${Math.trunc(
              user.balance
            )} сум `
      );
    }

    if (isNaN(amountMoney)) {
      console.log("Harflar yozmang faqat son kiriting");
      return ctx.reply(
        user.lang == "uz"
          ? "Harflar yozmang faqat son kiriting"
          : "Не пишите буквы, только цифры",
        keyboard
      );
    }

    if (yandexBalance <= 0) {
      return ctx.reply(
        user.lang == "uz"
          ? "Siz pul yecha olmaysiz !"
          : "Вы не можете снять деньги !",
        keyboard
      );
    }

    if (amountMoney < 1000) {
      return ctx.reply(
        user.lang == "uz"
          ? "O'tkazma miqdori juda kam. Minimal o'tkazma 1000 so'm, kamida 1000 so'm yechmoqchisiz."
          : "Сумма перевода слишком маленькая. Минимальная сумма перевода 1000 сум, можно снять не менее 1000 сум.",
        keyboard
      );
    }

    if (!regtoken) {
      return ctx.reply(
        user.lang == "uz"
          ? "Qaytadan ro'yxatdan o'ting"
          : "Зарегистрируйтесь снова"
      );
    }

    let data = JSON.stringify({
      card_id: ctx.wizard.state.cardInfo.card_id,
      amount: amountMoney * 100,
      ext_id: `${Date.now()}`,
    });

    // ctx.session.amountAllMoney = yandexBalance;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.atmos.uz/out/1.0.0/asl/create",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${regtoken}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const tranzactionId = response.data.data.transaction_id;
        // ctx.session.tranzactionId = tranzactionId;
        ctx.wizard.state.cardInfo.transaction_id = response.data.transaction_id;
      })
      .catch((error) => {
        console.log(error);

        // return (user.lang = "uz"
        //   ? "Tranzaksiya yaratilmadi Tranzaksiya yaraatishda xatolik "
        //   : "Tranzaksiya yaratilmadi Tranzaksiya yaraatishda xatolik ");

        ctx.reply(error.message);
      });

    ctx.reply(
      user.lang == "uz"
        ? `Siz ${ctx.wizard.state.cardInfo.userCardInfo} ga ${amountMoney} so'm yechmoqchisiz, Ma'lumotlar to'g'riligini tasdiqlang`
        : `Вы хотите вывести ${ctx.wizard.state.cardInfo.userCardInfo} на ${amountMoney} сум, пожалуйста, подтвердите правильность информации`,

      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌", callback_data: "reject" }],
            [{ text: "✅", callback_data: "apply" }],
          ],
        },
      }
    );

    return ctx.scene.leave();
  }
);

// const stage = new Scenes.Stage([wizardScene, getSMSCodScene, getAll]);

const stage = new Scenes.Stage([contactData, wizardScene]);
// const stage = new Scenes.Stage([wizardScene, getSMSCodScene, getAll]);

bot.use(session());
bot.use(stage.middleware());

//scenes_
// bot.command("sendpdf", async (ctx) => {
//   try {
//     const pdfPath = "./ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf";
//     const chatId = ctx.from.id;

//     await ctx.reply("Sending PDF ...");

//     const fileStream = fs.createReadStream(pdfPath, "utf-8");
//     ctx.telegram.sendDocument(
//       chatId,
//       fileStream
//       //   {
//       //   source:
//       //     "https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link",
//       // }
//     );
//     // document: "./ofertauz/MOLDE_Caja Huevo de Dinosaurio.pdf",
//     // "https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link"
//     await ctx.sendDocument(chatId, { source: fileStream });

//     await ctx.reply("PDF file sent successfully!");
//   } catch (error) {
//     console.error("Error sending PDF file:", error);
//     await ctx.reply("Failed to send PDF file.");
//   }
// });
//actions
bot.start(async (ctx) => {
  console.log(ctx.from.id);
  const userInDb = await User.findOne({
    tg_id: ctx.from.id,
  });
  console.log("ifdan oldin", userInDb);
  if (userInDb !== null && userInDb.is_complated) {
    console.log(userInDb.is_complated);
    user = userInDb;
    ctx.reply("Harakat tanla", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "til tanlash",
              callback_data: `lang`,
            },
          ],
          [
            {
              text: "balance",
              callback_data: `balance`,
            },
          ],
          [
            {
              text: "karta",
              callback_data: `cards`,
            },
          ],
        ],
      },
    });
    // ctx.scene.leave();
    return;
  }
  if (userInDb !== null && !userInDb.is_complated) {
    ctx.reply(
      "siz oldin royhatdan otgansiz iltimos admin tasdiqlashini kuting"
    );
    return;
  }
  ctx.scene.enter("CONTACT_DATA");
});
const warningWords = ["/start", "kirish", "aвторизоваться", "/help", "dev"]; // Taqiqlangan so'zlarning ro'yxati

bot.on("text", (ctx) => {
  const messageText = ctx.message?.text.toLowerCase();
  if (!warningWords.includes(messageText)) {
    ctx.reply(
      user?.lang == "uz"
        ? `Uzr, bu buyruqni tushunmayman, \n qayta /start bosing`
        : `Извините, я не понимаю эту команду,\n Нажмите /start еще раз`
    );
  }
});

bot.action("russian", (ctx) => {
  if (user.lang) {
    User.findByIdAndUpdate(user._id, { lang: "ru" }, { new: true })
      .then((data) => {
        ctx.reply("Язык успешно измененo!✅");
        console.log(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    // user.lang = "ru";
    return;
  }

  User.findByIdAndUpdate(user._id, { lang: "ru" }, { new: true })
    .then((data) => {
      ctx.reply("Язык успешно измененo!✅");
      user = data;
      console.log(data);
    })
    .catch((err) => {
      console.log("error", err);
      ctx.reply("xatolik! qayta urunib koring.");
    });
  // user.lang = "ru";
});

bot.action("uzbek", (ctx) => {
  if (user.lang) {
    User.findByIdAndUpdate(user._id, { lang: "uz" }, { new: true })
      .then((data) => {
        ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
        console.log(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    // user.lang = "uz";
    return;
  }

  User.findByIdAndUpdate(user._id, { lang: "uz" }, { new: true })
    .then((data) => {
      ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
      user = data;
      console.log(data);
    })
    .catch((err) => {
      console.log("error", err);
      ctx.reply("xatolik! qayta urunib koring.");
    });
});
bot.action("lang", (ctx) => {
  ctx.reply(`Tilni tanlang:\n\nВыберите язык:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇷🇺 Русский язык", callback_data: "russian" }],
        [{ text: "🇺🇿 O'zbekcha", callback_data: "uzbek" }],
      ],
    },
  });
});
bot.action("cards", async (ctx) => {
  if (!user) {
    return;
  }
  let cards = await Card.find({ tg_id: ctx.from.id });
  for (let i = 0; i < cards.length; i++) {
    const e = cards[i];
    console.log(e);
  }
  const card_buttons = Markup.keyboard([
    Markup.button.text("Yangi karta qoshish"),
    Markup.button.text("ortga"),
  ])
    .oneTime()
    .resize()
    .selective();
  // if (!cards) {
  ctx.reply("Mening kartalarim", card_buttons);
  // }
  // ctx.scene.enter("getCardInfo");
});
bot.action("new_cards", (ctx) => {
  ctx.scene.enter("getCardInfo");
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
