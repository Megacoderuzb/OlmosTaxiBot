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
// addcard(5033207519, 7777777777777777);
//db connection_

// variables
let user;
let yandexData;
let user_balance;
let myBalance;
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
const keyboard = Markup.keyboard([
  Markup.button.callback(user?.lang == "uz" ? "ortga" : "назат ", isUtf8),
])
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
  Markup.button.contactRequest(
    user?.lang == "uz"
      ? "Telefon raqamingizni yuboring"
      : "Отправьте номер телефона"
  ),
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
let regtoken = { text: "qq" };
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
    user?.lang == "uz"
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
let ortga = Markup.button.callback("ortga", isUtf8);
let nazat = Markup.button.callback("назат", isUtf8);
let ortgabtn = Markup.keyboard([
  Markup.button.callback("ortga", isUtf8),
  Markup.button.callback("hidden", isUtf8, true),
])
  .oneTime()
  .resize()
  .selective();
let nazatbtn = Markup.keyboard([
  Markup.button.callback("назат", isUtf8),
  Markup.button.callback("hidden", isUtf8, true),
])
  .oneTime()
  .resize()
  .selective();
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
    console.log(ctx.message?.text);
    ctx.message?.text === "ortga" ? ctx.scene.leave() : null;
    ctx.message?.text === "ortga" ? null : null;
    ctx.wizard.state.contactData.lang = ctx.message?.text;
    // let rozichilik = Markup.keyboard([
    //   Markup.button.text(
    //     ctx.wizard.state.contactData.lang == "uz" ? "Ha" : "Да"
    //   ),
    //   Markup.button.text(
    //     ctx.wizard.state.contactData.lang == "uz" ? "Yo'q" : "Нет"
    //   ),
    // ])
    // .oneTime()
    // .resize()
    // .selective();

    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "Ushbu botdan foydalanishni davom ettirib, siz ommaviy taklif shartlariga rozilik bildirasiz: \n https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link"
        : "Продолжая ползоваться данным ботом вы соглошаетесь с условиями публичной офёртой:\n https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link",
      Markup.keyboard([
        Markup.button.text(
          ctx.wizard.state.contactData.lang == "uz" ? "Ha" : "Да"
        ),
        Markup.button.text(
          ctx.wizard.state.contactData.lang == "uz" ? "Yo'q" : "Нет"
        ),
        ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
      ])
        .oneTime()
        .resize()
        .selective()
    );

    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          `Assalomu Alaykum Botimizga Xush kelibsiz! Tilni tanlang:\n\nПривет и добро пожаловать в наш бот! Выберите язык:`,
          language
        )
      : null;
    if (ctx.message.text !== "Ha" && ctx.message.text !== "Да") {
      ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Uzur biz siz bilan ishlay olmaymiz!"
          : "Извините, мы не можем с вами работать!"
      );
      return;
    }
    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "Telefon raqamingizni tugmani bosish orqali jo'nating"
        : "Отправьте свой номер телефона одним нажатием кнопки",
      Markup.keyboard([
        Markup.button.contactRequest(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Telefon raqamingizni yuboring"
            : "Отправьте номер телефона"
        ),
        ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
      ])
        .oneTime()
        .resize()
        .selective()
    );
    // ctx.wizard.state.contactData.lang = ctx.message.text;
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Ushbu botdan foydalanishni davom ettirib, siz ommaviy taklif shartlariga rozilik bildirasiz: \n https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link"
            : "Продолжая ползоваться данным ботом вы соглошаетесь с условиями публичной офёртой:\n https://drive.google.com/file/d/1ugnBdSmlYsXyuQ3i-lH1H7rEbBaDtuy0/view?usp=drive_link",
          Markup.keyboard([
            Markup.button.text(
              ctx.wizard.state.contactData.lang == "uz" ? "Ha" : "Да"
            ),
            Markup.button.text(
              ctx.wizard.state.contactData.lang == "uz" ? "Yo'q" : "Нет"
            ),
            ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
          ])
            .oneTime()
            .resize()
            .selective()
        )
      : null;
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomNumber = getRandomInt(100000, 999999);
    ctx.wizard.state.contactData.phone = ctx.message?.contact?.phone_number;
    ctx.wizard.state.contactData.code = randomNumber;
    if (!ctx.wizard.state.contactData.phone) {
      return;
    }
    console.log(ctx.wizard.state.contactData.phone);
    console.log(ctx.wizard.state.contactData.code);

    const url =
      "http://api.smsuz.uz/v1/sms/send?token=0b0143b1-f076-44ea-822b-6359c2a0e422";

    const data = {
      message: {
        recipients: [`${ctx.wizard.state.contactData.phone}`],
      },
      priority: "default",
      sms: {
        content: `OlmosTaxi uchun tasdiqlash kodi : ${randomNumber}`,
      },
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Yuborgan telefon raqamingizga kelgan kodni kiriting: "
            : "Введите код, пришедший на отправленный вами номер телефона:",
          ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
        );
      })
      .catch((error) => {
        console.error(error);
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? `SMS yuborilmadi. Siz ko´p marotaba urindingiz, keyinroq urinib koring `
            : "СМС не отправлено. Вы пытались сделать это слишком много раз, повторите попытку позже.",
          keyboard
        );
      });

    // ctx.reply("raqamingizga sms yubordik wuni tasdiqlang");
    return ctx.wizard.next();
  },
  async (ctx) => {
    // validation
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Telefon raqamingizni tugmani bosish orqali jo'nating"
            : "Отправьте свой номер телефона одним нажатием кнопки",
          Markup.keyboard([
            Markup.button.contactRequest(
              ctx.wizard.state.contactData.lang == "uz"
                ? "Telefon raqamingizni yuboring"
                : "Отправьте номер телефона"
            ),
            ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
          ])
            .oneTime()
            .resize()
            .selective()
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    if (ctx.message.text * 1 == NaN) {
      ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Faqat raqamlarni kiriting"
          : "Введите только цифры"
      );
      return;
    }
    if (ctx.message.text.length < 6) {
      ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Noto'g'ri raqam"
          : "Неправильный номер"
      );
      return;
    }
    if (ctx.message.text * 1 !== ctx.wizard.state.contactData.code) {
      ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Noto'g'ri raqam"
          : "Неправильный номер"
      );
      return;
    }
    if (ctx.message.text * 1 === ctx.wizard.state.contactData.code) {
      ///
      // const clientId = "taxi/park/b756b1c971a64253b201829adcedf3ea";
      // const apiKey = "QCqYmRRKAtzWdhrjqYnRllvsYAFtDYBQh";
      // const partnerId = "b756b1c971a64253b201829adcedf3ea";

      // const url =
      //   "https://fleet-api.taxi.yandex.net/v1/parks/driver-profiles/list";
      // const headers = {
      //   "X-Client-ID": clientId,
      //   "X-Api-Key": apiKey,
      // };

      // const data = {
      //   query: {
      //     park: {
      //       id: partnerId,
      //     },
      //   },
      // };

      // let found = false;
      // try {
      //   const response = await axios.post(url, data, { headers });
      //   const resData = response.data;
      //   // console.log(resData);

      //   // ctx.reply("Malumotlar keldi");

      //   // const luqmonovich = "+998990222228";
      //   // const ahmadjonovich = "+998935206680";
      //   // const yaroqsizNomer = "+998904024707";
      //   // const gapborovich = "+998940229020";

      //   async function topish(phoneNumber) {
      //     //

      //     //
      //     for (let i = 0; i < resData.driver_profiles.length; i++) {
      //       if (
      //         resData.driver_profiles[i].driver_profile.phones.includes(
      //           phoneNumber
      //         )
      //       ) {
      //         yandexData = resData.driver_profiles[i];
      //         // console.log(user.driver_profile);
      //         // const yandexUserId = user.driver_profile.id;

      //         user_balance =
      //           yandexData.accounts[0].balance >= 20000.0
      //             ? yandexData.accounts[0].balance - 20000.0
      //             : 0;

      //         let myBalance = yandexData.accounts[0].balance;
      //         console.log(myBalance);
      //         found = true;

      await ctx.reply(
        "Raqamingiz tasdiqlandi"
        //           ctx.wizard.state.contactData.lang == "uz"
        //             ?
        //             : "Ваш номер подтвержден"
      );
      //         // break;
      //       }
      //     }
      //     if (!found) {
      //       // ctx.reply(`+${userPhoneNumber}`);
      //       ctx.wizard.selectStep(ctx.wizard.cursor - 3);
      //       // ctx.reply(
      //       //   "Royhatdan o'tishni davom ettirish uchun pastdagi tugma orqali raqamingizni jonating",
      //       //   telKeyboardUz
      //       // );
      //       return ctx.reply(
      //         ctx.wizard.state.contactData.lang == "uz"
      //           ? "Bunday foydalanuvchi topilmadi 🤷🏼‍♂️, qaytadan urinib ko'ring 🔄"
      //           : "Пользователь не найден 🤷🏼‍♂️, попробуйте еще раз 🔄",
      //         Markup.keyboard([
      //           Markup.button.contactRequest(
      //             ctx.wizard.state.contactData.lang == "uz"
      //               ? "Telefon raqamingizni yuboring"
      //               : "Отправьте номер телефона"
      //           ),
      //         ])
      //           .oneTime()
      //           .resize()
      //           .selective()
      //       );
      //     }
      //   }
      // const userPhoneNumber = ctx.session.userPhoneNumber;
      // console.log(ctx.wizard.state.contactData.phone);
      // topish(`${ctx.wizard.state.contactData.phone}`);

      // topish(gapborovich);
      // } catch (error) {
      //   console.error(error);
      //   // Stop
      //   ctx.reply(
      //     ctx.wizard.state.contactData.lang == "uz"
      //       ? "Xatolik yuz berdi: " + error.message
      //       : "Произошла ошибка: " + error.message
      //   );
      // }
      ///

      // found
      //   ?
      ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Pasport turini tanlang"
          : "Выберите тип паспорта",
        Markup.keyboard([
          Markup.button.text(
            ctx.wizard.state.contactData.lang == "uz"
              ? "ID pasport"
              : "ID паспорт"
          ),
          Markup.button.text(
            ctx.wizard.state.contactData.lang == "uz"
              ? "Biometrik pasport"
              : "Биометрический паспорт"
          ),
          // ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
        ])
          .oneTime()
          .resize()
          .selective()
      );
      // : null;

      ctx.wizard.next();
    }
    return ctx.wizard.next();
  },

  (ctx) => {
    console.log(ctx.message.text, "passportturi");
    // ctx.message.text === "ortga" || ctx.message.text === "назат"
    //   ? ctx.wizard.selectStep(ctx.wizard.cursor - 1)
    //   : null;
    //     ? "ID pasport"
    //     : "ID паспорт"
    // ? "Biometrik pasport"
    //     : "Биометрический паспорт"
    if (
      ctx.message.text !== "ID pasport" ||
      ctx.message.text !== "Biometrik pasport" ||
      ctx.message.text !== "ID паспорт" ||
      ctx.message.text !== "Биометрический паспорт"
    ) {
      ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Bunday variant yo'q"
          : "Нет такого варианта"
      );
      return;
    }
    ctx.wizard.state.contactData.passtype = ctx.message.text;

    console.log(ctx.wizard.state.contactData.passtype, "bu passtype");
    return ctx.wizard.next();
  },
  (ctx) => {
    console.log(ctx.message.text, "passportturi");
    // ctx.message.text === "ortga" || ctx.message.text === "назат"
    //   ? ctx.wizard.selectStep(ctx.wizard.cursor - 1)
    //   : null;

    ctx.wizard.state.contactData.passtype = ctx.message.text;
    // let buttons = ;
    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "Siz o'z o'zingizni ish bilan taminlaganmisiz"
        : "Вы самозаняты",
      Markup.keyboard([
        Markup.button.text(
          ctx.wizard.state.contactData.lang == "uz" ? "Ha" : "Да"
        ),
        Markup.button.text(
          ctx.wizard.state.contactData.lang == "uz" ? "Yo'q" : "Нет"
        ),
        ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
      ])
        .oneTime()
        .resize()
        .selective()
    );
    console.log(ctx.wizard.state.contactData.passtype, "bu passtype");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Pasport turini tanlang"
            : "Выберите тип паспорта",
          Markup.keyboard([
            Markup.button.text(
              ctx.wizard.state.contactData.lang == "uz"
                ? "ID pasport"
                : "ID паспорт"
            ),
            Markup.button.text(
              ctx.wizard.state.contactData.lang == "uz"
                ? "Biometrik pasport"
                : "Биометрический паспорт"
            ),
            // ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
          ])
            .oneTime()
            .resize()
            .selective()
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "Pasport seria va raqamini kiriting"
        : "Введите серию и номер паспорта слитно на латинском",
      ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
    );
    ctx.wizard.state.contactData.samozanyate = ctx.message.text;
    console.log(ctx.message.text, "bu samozanyate");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Siz o'z o'zingizni ish bilan taminlaganmisiz"
            : "Вы самозаняты",
          Markup.keyboard([
            Markup.button.text(
              ctx.wizard.state.contactData.lang == "uz" ? "Ha" : "Да"
            ),
            Markup.button.text(
              ctx.wizard.state.contactData.lang == "uz" ? "Yo'q" : "Нет"
            ),
            ctx.wizard.state.contactData.lang == "uz" ? ortga : nazat,
          ])
            .oneTime()
            .resize()
            .selective()
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "PNFL ni kiriting"
        : "Введите ПНФЛ",
      ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
    );
    ctx.wizard.state.contactData.passportSeria = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Pasport seria va raqamini kiriting"
            : "Введите серию и номер паспорта слитно на латинском",
          ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "Tugilgan yilingizni kiriting"
        : "Введите дату рождения",
      ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
    );
    ctx.wizard.state.contactData.pnfl = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "PNFL ni kiriting"
            : "Введите ПНФЛ",
          ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    // if (ctx.message.text === "ortga" || ctx.message.text === "назат" || ctx.message.text === "назат") {
    //   ctx.scene.leave();
    // }
    // ctx.wizard.back();
    // return;
    // ctx.wizard.back();
    ctx.reply(
      ctx.wizard.state.contactData.lang == "uz"
        ? "Passportni rasmini yuklang. (Rasmni file shaklida yuklamang!!!) 📥"
        : "Загрузите фото лицевой стороны паспорта. (Hе загружайте фото как файл!!!)📥",
      ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
    );
    ctx.wizard.state.contactData.birthday = ctx.message.text;
    console.log(ctx.message.text);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Tugilgan yilingizni kiriting"
            : "Введите дату рождения",
          ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    const photo = ctx.message?.photo;
    console.log("this is photos", photo);
    if (!photo) {
      return;
    }
    console.log(ctx.chat.first_name, ctx.chat.username);
    // ctx.chat.first_name + " " + ctx.chat.last_name ? ctx.chat.last_name : "";
    let username = ctx.chat.username ? ctx.chat.username : " ";
    let fname = ctx.from.first_name;
    let lname = ctx.from.last_name;
    let name = fname ? fname : username + " " + lname ? lname : "";
    // console.log(name, "full_name");
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `Oт ${name}: \n @${username} \n паспорт`,
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
    if (
      ctx.wizard.state.contactData.samozanyate == "Ha" ||
      ctx.wizard.state.contactData.samozanyate == "Да"
    ) {
      await ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "O'z-o'zini ish bilan ta'minlash sertifikatini rasmini yuklang. (Rasmni file shaklida yuklamang!!!)"
          : "Загрузите фото сертификат самозянотости. (Hе загружайте фото как файл!!!)",
        ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
      );
      return ctx.wizard.next();
    } else {
      await ctx.reply(
        ctx.wizard.state.contactData.lang == "uz"
          ? "Haydovchilik guvohnomasining old qismining fotosuratni yuklang.(Rasmni file shaklida yuklamang!!!)"
          : "Загрузите фото лицевой части водительских прав. (Hе загружайте фото как файл!!!)",
        ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
      );
      return ctx.wizard.selectStep(ctx.wizard.cursor + 1);
    }
  },
  async (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Passportni rasmini yuklang. (Rasmni file shaklida yuklamang!!!) 📥"
            : "Загрузите фото паспорта. (Hе загружайте фото как файл!!!) 📥",
          ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    const photo = ctx.message?.photo;
    console.log("this is photos", photo);
    if (!photo) {
      return;
    }
    console.log(ctx.chat.first_name, ctx.chat.username);
    let username = ctx.chat.username ? ctx.chat.username : " ";
    let fname = ctx.from.first_name;
    let lname = ctx.from.last_name;
    let name = fname ? fname : username + " " + lname ? lname : "";
    // let username = ctx.chat.username ? ctx.chat.username : " ";
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `Oт ${name}: \n @${username} \n сертификат самозянотости`,
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
      ctx.wizard.state.contactData.lang == "uz"
        ? "Haydovchilik guvohnomasining old qismining fotosuratni yuklang. (Rasmni file shaklida yuklamang!!!)"
        : "Загрузите фото лицевой части водительских прав. (Hе загружайте фото как файл!!!)",
      ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
    );
    return ctx.wizard.next();
  },

  async (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.state.contactData.samozanyate == "Ha" || "Да"
        ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
          ctx.reply(
            ctx.wizard.state.contactData.lang == "uz"
              ? "O'z-o'zini ish bilan ta'minlash sertifikatini rasmini yuklang. (Rasmni file shaklida yuklamang!!!)"
              : "Загрузите фото сертификат самозянотости. (Hе загружайте фото как файл!!!)",
            ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
          )
        : // ctx.wizard.state.contactData.samozanyate ==  &
          ctx.wizard.selectStep(ctx.wizard.cursor - 2) &
          ctx.reply(
            ctx.wizard.state.contactData.lang == "uz"
              ? "Passportni rasmini yuklang. (Rasmni file shaklida yuklamang!!!) 📥"
              : "Загрузите фото паспорта. (Hе загружайте фото как файл!!!)📥",
            ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
          )
      : null;

    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    const photo = ctx.message.photo;
    console.log("this is photos", photo);

    console.log(ctx.chat.first_name, ctx.chat.username);
    let username = ctx.chat.username ? ctx.chat.username : " ";
    let fname = ctx.from.first_name;
    let lname = ctx.from.last_name;
    let name = fname ? fname : username + " " + lname ? lname : "";
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `Oт ${name}: \n @${username} \n лицевой части водительских прав 🪪`,
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
      ctx.wizard.state.contactData.lang == "uz"
        ? "Haydovchilik guvohnomasining orqa qismining fotosuratni yuklang.(Rasmni file shaklida yuklamang!!!) 🪪"
        : "Загрузите фото обратной части водительских прав. (Hе загружайте фото как файл!!!)🪪"
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? // ? ctx.wizard.state.contactData.samozanyate == "Ha" || "Да"
        ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Haydovchilik guvohnomasining old qismining fotosuratni yuklang. (Rasmni file shaklida yuklamang!!!)"
            : "Загрузите фото лицевой части водительских прав.(Hе загружайте фото как файл!!!)",
          ctx.wizard.state.contactData.lang == "uz" ? ortgabtn : nazatbtn
        )
      : null;
    if (ctx.message.text === "ortga" || ctx.message.text === "назат") {
      return;
    }
    const photo = ctx.message.photo;
    console.log("this is photos", photo);

    let username = ctx.chat.username ? ctx.chat.username : " ";
    let fname = ctx.from.first_name;
    let lname = ctx.from.last_name;
    let name = fname ? fname : username + " " + lname ? lname : "";
    const media = photo.map((p) => ({
      media: p.file_id,
      type: "photo",
      caption: `Oт ${name}: \n @${username} \n  обратной части водительских прав 🪪`,
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
      ctx.wizard.state.contactData.lang == "uz"
        ? "Barcha malumotlaringiz adminlarga jonatildi📤. Tasdiqlanishini kuting 🧘🏼"
        : "Вся ваша информация отправлена ​​администраторам📤. Ждите подтверждения 🧘🏼"
    );
    let user = ctx.chat.username ? ctx.chat.username : " ";
    let fname2 = ctx.from.first_name;
    let lname2 = ctx.from.last_name;
    let ism = fname2 ? fname2 : username + " " + lname2 ? lname2 : "";
    console.log(ctx.wizard.state.contactData.passtype);
    let self_employment =
      ctx.wizard.state.contactData.samozanyate == "Ha" ? true : false;
    self_employment =
      ctx.wizard.state.contactData.samozanyate == "Да" ? true : false;
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
contactData.action(
  "russian",
  (ctx) => {
    if (ctx.wizard.state.contactData.lang) {
      ctx.wizard.state.contactData.lang = "ru";
      ctx.reply("Язык успешно измененo!✅");
      return;
    }

    ctx.wizard.state.contactData.lang = "ru";
    ctx.reply(
      "Язык выбран успешно! ✅\nДля регистрации отправьте свой номер с помощью кнопки ниже и подтвердите с помощью смс-уведомления.🤝",
      telKeyboardRu
    );
  },
  async (ctx) => {
    ctx.message.text === "ortga" || ctx.message.text === "назат"
      ? ctx.wizard.selectStep(ctx.wizard.cursor - 1) &
        ctx.reply(
          ctx.wizard.state.contactData.lang == "uz"
            ? "Passportni rasmini yuklang. (Rasmni file shaklida yuklamang!!!) 🖼"
            : "Загрузите фото паспорта 🖼"
        )
      : null;
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
      ctx.wizard.state.contactData.lang == "uz"
        ? "Barcha malumotlaringiz adminlarga jonatildi✈️. Tasdiqlanishini kuting 🧘🏼"
        : "Вся ваша информация отправлена ​​администраторам✈️. Ждите подтверждения 🧘🏼"
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
  if (ctx.wizard.state.contactData.lang) {
    ctx.wizard.state.contactData.lang = "ru";
    ctx.reply("Язык успешно измененo!✅");
    return;
  }

  ctx.wizard.state.contactData.lang = "ru";
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
    ctx.reply("Подтвержденный ✅");
    ctx.telegram.sendMessage(
      updated.tg_id,
      updated.lang == "uz"
        ? "Sizning so'rovingiz tasdiqlandi ✅"
        : "Ваш запрос потверждён ✅"
    );

    // Buttonni tasdiqlash
  } else if (action === "cancel") {
    const deleted = await User.findByIdAndUpdate(
      id,
      { is_deleted: true, is_complated: false },
      { new: true }
    );
    console.log(deleted);
    ctx.reply("Отменено ❌");
    ctx.telegram.sendMessage(
      deleted.tg_id,
      ctx.wizard.state.contactData.lang == "uz"
        ? "Sizning so'rovingiz bekor qilindi ❌"
        : "Ваш запрос отменено ❌"
    );
    // Buttonni bekor qilish
  }

  ctx.answerCbQuery();
});
// contactData.action("uzbek", (ctx) => {
//   if (user?.lang) {
//     user?.lang = "uz";
//     ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
//     return;
//   }
//   // console.log(ctx.wizard.state.contactData.code);
//   user?.lang = "uz";
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
  async (ctx) => {
    console.log(user?.lang);

    if (!user) {
      return;
    }
    let cards = await Card.find({ tg_id: user.tg_id });
    if (!cards) {
      return;
    }
    let rows = [];
    for (let i = 0; i < cards.length; i++) {
      const e = cards[i];
      console.log(e.numbers);
      rows.push(e.numbers);
    }
    let markup = rows.map((e) => {
      return `${e}`;
    });
    console.log("markup", markup);
    const buttons = [];
    markup.forEach((option) => {
      buttons.push(Markup.button.text(option));
    });

    const card_buttons = Markup.keyboard([
      ...buttons,
      // Markup.button.text("Yangi karta qo'shish"),
      user.lang ? ortga : nazat,
    ])
      .oneTime()
      .resize()
      .selective();

    ctx.reply(
      user?.lang == "uz"
        ? "Iltimos karta raqamini kiriting yoki tanlang 👇"
        : "Пожалуйста, введите или выберите номер карты 👇",
      card_buttons
    );
    return ctx.wizard.next();
    // Stop
  },
  async (ctx) => {
    ctx.wizard.state.cardInfo = {};
    if (!ctx.message?.text) {
      return;
    }
    if (ctx.message.text == "ortga" || ctx.message.text == "назат ") {
      ctx.reply(user?.lang == "uz" ? "Bekor qilindi" : "Отменено");
      ctx.scene.leave();
    }
    ctx.wizard.state.cardInfo.userCardInfo = ctx.message?.text;
    console.log(ctx.wizard.state.cardInfo.userCardInfo);

    // const regtoken = ctx.session.regToken;
    const userCardInfo = ctx.wizard.state.cardInfo.userCardInfo;
    const isNumeric = /^\d+$/.test(userCardInfo);

    if (userCardInfo.length !== 16 || !isNumeric) {
      console.log(userCardInfo);
      delete ctx.wizard.state["cardInfo"]; // clear state to start over again
      return ctx.reply(
        user?.lang == "uz"
          ? "Karta raqami xato"
          : "Неверный формат номера карты"
        // user?.lang == "uz" ? telKeyboardUz : telKeyboardRu
      );
    }

    // another

    let data = JSON.stringify({
      card_number: userCardInfo,
    });

    if (!regtoken) {
      return ctx.reply(
        user?.lang == "uz"
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
          user?.lang == "uz"
            ? `👤 Egasi: ${info.name}; \n 💳 Karta Raqami: ${info.pan}; \n 📞 Telefon Raqami: ${info.phone}; \n 🏦 Bank Nomi: ${info.bank_name}; \n 💳 Karta Turi: ${info.processing_type}`
            : `👤 Владелец: ${info.name}; \n 💳 Номер карты: ${info.pan}; \n 📞  Номер телефона: ${info.phone}; \n 🏦 банк: ${info.bank_name}; \n 💳 Тип карты: ${info.processing_type}`
        );
        ctx.wizard.state.cardInfo.card_id = response.data.data.id;
      } else {
        return ctx.reply(
          user?.lang == "uz"
            ? "Siz kiritgan karta raqami mavjud emas iltimos qayta urunib ko'ring."
            : "Введенный вами номер карты не существует. Повторите попытку",
          keyboard
        );
      }
    } catch (error) {
      console.log(error);
      return ctx.reply(
        user?.lang == "uz"
          ? "Siz kiritgan karta raqami mavjud emas iltimos qayta urunib ko'ring."
          : "Введенный вами номер карты не существует. Повторите попытку",
        keyboard
      );
    }

    ctx.reply(
      user?.lang
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
    ctx.wizard.state.cardInfo.amountMoney = ctx.message?.text;
    const yandexBalance = yandexData.accounts[0].balance;
    console.log(yandexBalance, "yb");
    if (amountMoney === "/start") {
      ctx.scene.leave();
      // return ctx.reply(
      // ctx.session = {};

      // );
    }
    if (amountMoney > yandexBalance) {
      // ctx.scene.leave();
      return ctx.reply(
        user?.lang == "uz"
          ? ` Siz bu summani yecha olmaysiz! Sizning hisobingizda ${Math.trunc(
              user_balance
            )} UZS mablag' bor `
          : ` Вы не можете снять эту сумму! У вас на счету ${Math.trunc(
              user_balance
            )} сум `
      );
    }

    if (isNaN(amountMoney)) {
      console.log("Harflar yozmang faqat son kiriting");
      return ctx.reply(
        user?.lang == "uz"
          ? "Harflar yozmang faqat son kiriting"
          : "Не пишите буквы, только цифры",
        keyboard
      );
    }

    if (yandexBalance <= 0) {
      return ctx.reply(
        user?.lang == "uz"
          ? "Siz pul yecha olmaysiz !"
          : "Вы не можете снять деньги !",
        keyboard
      );
    }

    if (amountMoney < 1000) {
      return ctx.reply(
        user?.lang == "uz"
          ? "O'tkazma miqdori juda kam. Minimal o'tkazma 1000 so'm, kamida 1000 so'm yechmoqchisiz."
          : "Сумма перевода слишком маленькая. Минимальная сумма перевода 1000 сум, можно снять не менее 1000 сум.",
        keyboard
      );
    }

    if (!regtoken) {
      return ctx.reply(
        user?.lang == "uz"
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
        ctx.session.tranzactionId = tranzactionId;
        ctx.wizard.state.cardInfo.transaction_id = response.data.transaction_id;
      })
      .catch((error) => {
        console.log(error);

        // return (user?.lang = "uz"
        //   ? "Tranzaksiya yaratilmadi Tranzaksiya yaraatishda xatolik "
        //   : "Tranzaksiya yaratilmadi Tranzaksiya yaraatishda xatolik ");

        ctx.reply(error.message);
      });

    ctx.reply(
      user?.lang == "uz"
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
const CardScene = new Scenes.WizardScene(
  "add_card",
  (ctx) => {
    console.log(user?.lang);
    ctx.reply(
      user?.lang == "uz"
        ? "Iltimos karta raqamini kiriting"
        : "Пожалуйста, введите номер карты",
      keyboard
    );
    return ctx.wizard.next();
    // Stop
  },
  async (ctx) => {
    if (ctx?.message?.text == "ortga" || ctx?.message?.text == "назат") {
      ctx.reply(user?.lang == "uz" ? "Bekor qilindi" : "Отменено");
      ctx.scene.leave();
      return;
    }
    ctx.wizard.state.cardInfo = {};
    if (!ctx.message?.text) {
      return;
    }
    ctx.wizard.state.cardInfo.userCardInfo = ctx.message?.text;
    console.log(ctx.wizard.state.cardInfo.userCardInfo);

    // const regtoken = ctx.session.regToken;
    const userCardInfo = ctx.wizard.state.cardInfo.userCardInfo;
    const isNumeric = /^\d+$/.test(userCardInfo);

    if (userCardInfo.length !== 16 || !isNumeric) {
      console.log(userCardInfo);
      delete ctx.wizard.state["cardInfo"]; // clear state to start over again
      return ctx.reply(
        user?.lang == "uz"
          ? "Karta raqami xato"
          : "Неверный формат номера карты"
        // user?.lang == "uz" ? telKeyboardUz : telKeyboardRu
      );
    }

    // another

    let data = JSON.stringify({
      card_number: userCardInfo,
    });

    if (!regtoken) {
      return ctx.reply(
        user?.lang == "uz"
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
          user?.lang == "uz"
            ? `👤 Egasi: ${info.name}; \n 💳 Karta Raqami: ${info.pan}; \n 📞 Telefon Raqami: ${info.phone}; \n 🏦 Bank Nomi: ${info.bank_name}; \n 💳 Karta Turi: ${info.processing_type}`
            : `👤 Владелец: ${info.name}; \n 💳 Номер карты: ${info.pan}; \n 📞  Номер телефона: ${info.phone}; \n 🏦 банк: ${info.bank_name}; \n 💳 Тип карты: ${info.processing_type}`
        );
        // ctx.wizard.state.cardInfo.card_id = response.data.data.id;
      } else {
        return ctx.reply(
          user?.lang == "uz"
            ? "Siz kiritgan karta raqami mavjud emas iltimos qayta urunib ko'ring."
            : "Введенный вами номер карты не существует. Повторите попытку",
          keyboard
        );
      }
    } catch (error) {
      console.log(error);
      return ctx.reply(
        user?.lang == "uz"
          ? "Siz kiritgan karta raqami mavjud emas iltimos qayta urunib ko'ring."
          : "Введенный вами номер карты не существует. Повторите попытку",
        keyboard
      );
    }
    //wetga userCardInfo
    addcard(ctx.from.id, userCardInfo);
    ctx.reply(
      user?.lang == "uz"
        ? "Karta muvaffaqiyatli qo‘shildi"
        : "Карта успешно добавлена",
      keyboard
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx?.message?.text == "ortga" || ctx?.message?.text == "назат") {
      ctx.reply(user?.lang == "uz" ? "Bekor qilindi" : "Отменено");
      ctx.scene.leave();
      return;
    }
  }
);

const getAll = new Scenes.WizardScene(
  "getAllMyBalance",
  async (ctx) => {
    const keyboard = Markup.keyboard([
      Markup.button.callback(user?.lang == "uz" ? "ortga" : "назат ", isUtf8),
    ])
      .oneTime()
      .resize()
      .selective();
    if (!user) {
      return;
    }
    let cards = await Card.find({ tg_id: user.tg_id });
    if (!cards) {
      return;
    }
    let rows = [];
    for (let i = 0; i < cards.length; i++) {
      const e = cards[i];
      console.log(e.numbers);
      rows.push(e.numbers);
    }
    let markup = rows.map((e) => {
      return `${e}`;
    });
    console.log("markup", markup);
    const buttons = [];
    markup.forEach((option) => {
      buttons.push(Markup.button.text(option));
    });

    const card_buttons = Markup.keyboard([
      ...buttons,
      // Markup.button.text("Yangi karta qo'shish"),
      Markup.button.text(user?.lang == "uz" ? "ortga" : "назат"),
    ])
      .oneTime()
      .resize()
      .selective();

    ctx.reply(
      user?.lang == "uz"
        ? "Iltimos karta raqamini kiriting yoki tanlang 👇"
        : "Пожалуйста, введите или выберите номер карты 👇",
      card_buttons
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.cardInfo = {};
    ctx.wizard.state.cardInfo.userCardInfo = ctx.message?.text;
    console.log(ctx.wizard.state.cardInfo.userCardInfo);
    const userCardInfo = ctx.wizard.state.cardInfo.userCardInfo;

    const regToken = regtoken;
    const isNumeric = /^\d+$/.test(userCardInfo);

    if (userCardInfo === "/start") {
      ctx.scene.leave();
      ctx.session = {};
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

    if (userCardInfo.length !== 16 && !isNumeric) {
      return ctx.reply(
        user?.lang == "uz"
          ? "Karta raqami Xato "
          : "Неверный формат номера карты"
      );
      // delete ctx.wizard.state["cardInfo"]; // clear state to start over again
      // return ctx.scene.leave();
    } else {
      let data = JSON.stringify({
        card_number: `${ctx.wizard.state.cardInfo?.userCardInfo}`,
      });

      if (!regToken) {
        ctx.reply(
          user?.lang == "uz"
            ? "Qaytadan ro´yhatdan o'ting"
            : "Зарегистрируйтесь снова"
        );
      } else {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.atmos.uz/out/1.0.0/asl/info",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer `
            Authorization: `Bearer ${regToken}`,
          },
          data: data,
        };

        await axios
          .request(config)
          .then((response) => {
            let info = response.data.data;
            console.log(info);
            ctx.reply(
              user?.lang == "uz"
                ? `👤 Egasi: ${info.name}; \n 💳 Karta Raqami: ${info.pan}; \n 📞 Telefon Raqami: ${info.phone}; \n 🏦 Bank Nomi: ${info.bank_name}; \n 💳 Karta Turi: ${info.processing_type}`
                : `👤 Владелец: ${info.name}; \n 💳 Номер карты: ${info.pan}; \n 📞  Номер телефона: ${info.phone}; \n 🏦 банк: ${info.bank_name}; \n 💳 Тип карты: ${info.processing_type}`
            );
            ctx.wizard.state.cardInfo.card_id = info.id;
          })
          .catch((error) => {
            // ctx.reply(error);
            console.log(error);
          });

        let myBalance = yandexData.accounts[0].balance;
        console.log(myBalance, "mybalance");
        const yandexBalance = user_balance;
        if (yandexBalance[0] == "-") {
          ctx.reply(
            user?.lang == "uz"
              ? "Siz pul yecha olmaysiz sababi qarzsiz !"
              : "Вы не можете снять деньги, потому что вы в долгах !"
          );
          ctx.scene.leave();
        } else if (myBalance) {
          if (yandexBalance <= 0) {
            return ctx.reply(
              user?.lang == "uz"
                ? "Siz pul yecha olmaysiz ! Balansingizda pul kam"
                : "Вы не можете снять деньги !"
            );
          } else if (yandexBalance[0] != "-") {
            let balance = myBalance;

            if (balance < "1000") {
              ctx.reply(
                user?.lang == "uz"
                  ? "O´tkazma miqdori noto'g'ri yoki juda kam minimal o'tkazma 1000 so'm kamida 1000 so'm yecha olasiz. "
                  : "Сумма перевода очень маленькая, минимальная сумма перевода 1000 сум, снять можно не менее 1000 сум."
              );
            } else {
              // ctx.wizard.state.getAmountInfo = getAmountInfo;
              console.log(
                ctx.session.myBalance,
                ctx.wizard.state.cardInfo.card_id
              );

              let data = JSON.stringify({
                card_id: ctx.wizard.state.cardInfo.card_id,
                amount: new Number((balance - 20000.0) * 100),
                ext_id: `${Date.now()}`,
              });
              console.log(JSON.stringify(data));
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://api.atmos.uz/out/1.0.0/asl/create",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${regToken}`,
                },
                data: data,
              };

              await axios
                .request(config)
                .then((response) => {
                  console.log(JSON.stringify(response.data));
                  // ctx.reply(JSON.stringify(response.data));
                  const tranzactionId = response.data.data.transaction_id;
                  ctx.session.tranzactionId = tranzactionId;

                  ctx.wizard.state.cardInfo.transaction_id =
                    response.data.transaction_id;
                })

                .catch((error) => {
                  console.log(error);
                  ctx.reply(error.message);
                });
            }
            ctx.reply(
              user?.lang == "uz"
                ? `Siz ${
                    ctx.wizard.state.cardInfo.userCardInfo
                  } ga ${Math.trunc(
                    myBalance - 20000.0
                  )} so´m yechmoqchisiz , Ma´lumotlar togriligini tasdiqlang`
                : `Вы хотите вывести ${
                    ctx.wizard.state.cardInfo.userCardInfo
                  } на ${Math.trunc(
                    myBalance - 20000.0
                  )}, пожалуйста, подтвердите правильность информации`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [{ text: "❌", callback_data: "reject" }],
                    [{ text: "✅", callback_data: "apply" }],
                  ],
                },
              }

              //
            );

            // bot.command("cancel", (ctx) => {
            //   ctx.reply(`Scenedan chiqdim `);
            //   return ctx.scene.leave("getAllMyBalance");
            // });

            return ctx.scene.leave();
          }
        }
      }
    }
  }
);

const stage = new Scenes.Stage([contactData, wizardScene, CardScene, getAll]);
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
    ctx.reply(user?.lang == "uz" ? "Harakatni tanlang" : "Выберите действие", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: user?.lang == "uz" ? "Tilni o'zgartirish" : "Сменить язык",
              callback_data: `lang`,
            },
          ],
          [
            {
              text: user?.lang == "uz" ? "Balans" : "Мой баланс",
              callback_data: `balance`,
            },
          ],
          [
            {
              text: user?.lang == "uz" ? "Mening kartalarim" : "Мои карты",
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

bot.action("russian", (ctx) => {
  if (user?.lang) {
    User.findByIdAndUpdate(user._id, { lang: "ru" }, { new: true })
      .then((data) => {
        ctx.reply("Язык успешно измененo!✅");
        console.log(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    // user?.lang = "ru";
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
  // user?.lang = "ru";
});

bot.action("uzbek", (ctx) => {
  if (user?.lang) {
    User.findByIdAndUpdate(user._id, { lang: "uz" }, { new: true })
      .then((data) => {
        ctx.reply("Til muvaffaqiyatli o'zgartirildi!✅");
        console.log(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
    // user?.lang = "uz";
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
bot.action("balance", async (ctx) => {
  const clientId = "taxi/park/b756b1c971a64253b201829adcedf3ea";
  const apiKey = "QCqYmRRKAtzWdhrjqYnRllvsYAFtDYBQh";
  const partnerId = "b756b1c971a64253b201829adcedf3ea";

  const url = "https://fleet-api.taxi.yandex.net/v1/parks/driver-profiles/list";
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
  const response = await axios.post(url, data, { headers });
  const resData = response.data;
  const gapborovich = "+998940229020";
  console.log(resData, "RESDATA");
  async function topish(phoneNumber) {
    let found = false;
    // console.log(user);
    // console.log(yandexData);
    for (let i = 0; i < resData.driver_profiles.length; i++) {
      if (
        resData.driver_profiles[i].driver_profile.phones.includes(phoneNumber)
      ) {
        yandexData = resData.driver_profiles[i];
        console.log(yandexData, "yandexdata");
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
        ctx.reply(
          user?.lang == "uz"
            ? `📝 ${yandexData.driver_profile.first_name} ${
                yandexData.driver_profile.middle_name
              } ${
                yandexData.driver_profile.last_name
              } siz tizimga muvaffaqiyatli kirdingiz. \n 💰 Sizni hisobingizda ${Math.trunc(
                yandexData.accounts[0].balance
              )} ${
                yandexData.accounts[0].currency
              } mavjud \n 🏦 Eslatma balansda 20000.0 ${
                yandexData.accounts[0].currency
              } qolishi kerak \n\n Siz ${Math.trunc(
                yandexData.accounts[0].balance - 20000.0
              )}  ${
                yandexData.accounts[0].currency
              } yecha olasiz \n Yechish uchun pastdagi tugmalardan foydalaning `
            : `📝 ${yandexData.driver_profile.first_name} ${
                yandexData.driver_profile.middle_name
              } ${
                yandexData.driver_profile.last_name
              } вы успешно вошли в систему. \n 💰 На балансе существует ${Math.trunc(
                yandexData.accounts[0].balance
              )} ${
                yandexData.accounts[0].currency
              } \n 🏦 Обратите внимание на балансe 20000.0 ${
                yandexData.accounts[0].currency
              } должен остаться \n\n ${Math.trunc(
                yandexData.accounts[0].balance - 20000.0
              )} ${
                yandexData.accounts[0].currency
              } можете снять \n Используйте кнопки ниже, чтобы снять `,

          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${Math.trunc(
                      yandexData.accounts[0].balance - 20000.0
                    )}  ${yandexData.accounts[0].currency} `,
                    callback_data: "getall",
                  },
                ],
                [{ text: `✍️ `, callback_data: "another" }],
              ],
            },
          }
        );

        break;
      }
    }
    if (!found) {
      // ctx.reply(`+${userPhoneNumber}`);
      ctx.reply(
        user?.lang == "uz"
          ? "Bunday foydalanuvchi topilmadi 🤷🏼‍♂️, qaytadan urinib ko'ring 🔄"
          : "Пользователь не найден 🤷🏼‍♂️, попробуйте еще раз 🔄"
      );
    }
  }
  // const userPhoneNumber = ctx.session.userPhoneNumber;

  // console.log(ctx.wizard.state.contactData.phone);
  // topish(`${ctx.wizard.state.contactData.phone}`);

  topish(gapborovich);
  // console.log(yandexData);
});
bot.action("getall", async (ctx) => {
  ctx.scene.enter("getAllMyBalance");
});
bot.action("cards", async (ctx) => {
  if (!user) {
    return;
  }
  let cards = await Card.find({ tg_id: ctx.from.id });
  if (!cards) {
    return;
  }
  let rows = [];
  for (let i = 0; i < cards.length; i++) {
    const e = cards[i];
    console.log(e.numbers);
    rows.push(e.numbers);
  }
  let markup = rows.map((e) => {
    return `${e}`;
  });
  console.log("markup", markup);
  const buttons = [];
  markup.forEach((option) => {
    buttons.push(Markup.button.text(option));
  });

  const card_buttons = Markup.keyboard([
    ...buttons,
    Markup.button.text(
      user?.lang == "uz" ? "Yangi karta qo'shish" : "Добавить карту"
    ),
    Markup.button.text(user?.lang == "uz" ? "ortga" : "назат"),
  ])
    .oneTime()
    .resize()
    .selective();

  ctx.reply("Mening kartalarim", card_buttons);
});
bot.hears("Yangi karta qo'shish", (ctx) => {
  ctx.scene.enter("add_card");
});
bot.hears("Добавить карту", (ctx) => {
  ctx.scene.enter("add_card");
});
bot.action("getall", (ctx) => {
  // ctx.scene.leave();
  ctx.scene.enter("getAllMyBalance");
});

bot.action("another", (ctx) => {
  // ctx.scene.leave();
  ctx.scene.enter("getCardInfo");
});
bot.action("reject", (ctx) => {
  ctx.session.tranzactionId = null;
  ctx.reply(
    ctx.session.language == "uz"
      ? "Tranzaksiya bekor qilindi"
      : "Транзакция отменена"
  );
});

bot.action("apply", async (ctx) => {
  try {
    const regToken = regtoken;
    const tranzactionId = ctx.session.tranzactionId;

    if (!regToken || !tranzactionId) {
      await ctx.reply(
        ctx.session.language == "uz"
          ? "Tranzaksiya yaratishda muammo yuz berdi, qayta urinib ko'ring!"
          : "При создании транзакции возникла проблема, попробуйте еще раз!"
      );
    } else {
      const data = JSON.stringify({
        transaction_id: tranzactionId,
      });
      const config = {
        method: "post",
        url: "https://api.atmos.uz/out/1.0.0/asl/apply",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${regToken}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      const responseData = response.data;
      // ctx.reply("tolandi");
      console.log(responseData);

      if (responseData.message != "OK") {
        // ctx.reply("To`landi lekin Yandexdan ayirilmadi");
        console.log("To`landi lekin Yandexdan ayirilmadi");
      } else {
        const yandexUser = user.driver_profile.id;
        console.log(yandexData);
        const driverMiddleName = user.driver_profile.middle_name;
        const balance = user_balance;

        console.log("BALANS", balance);
        const url =
          "https://fleet-api.taxi.yandex.net/v2/parks/driver-profiles/transactions";
        const clientId = "taxi/park/b756b1c971a64253b201829adcedf3ea";
        const apiKey = "QCqYmRRKAtzWdhrjqYnRllvsYAFtDYBQh";
        const cryptoToken = crypto.randomUUID();
        const idempotencyToken = cryptoToken;
        // Sizda yetarlicha mablag' yo'q
        const amountMoney = ctx.session.amountMoney;

        console.log("amountMoney", amountMoney);
        console.log(Math.trunc(amountMoney), "TRUNC DATA");
        console.log(`amountMoney: ${amountMoney}`);
        const cutData = {
          amount: amountMoney != undefined ? `-${amountMoney}` : `-${balance}`,
          category_id: "partner_service_manual_6",
          description: driverMiddleName,
          driver_profile_id: `${yandexUser}`,
          park_id: "b756b1c971a64253b201829adcedf3ea",
        };

        axios
          .post(url, cutData, {
            headers: {
              "X-Client-ID": clientId,
              "X-API-Key": apiKey,
              "X-Idempotency-Token": idempotencyToken,
            },
          })
          .then((response) => {
            console.log("Response:", response.data);
            // ctx.reply(
            //   "To'lov muvaffaqiyatli amalga oshirildi Yandex dan ham ayirildi "
            // );
          })
          .catch((error) => {
            console.error("Error:", error);
            // ctx.reply("Yandex hisobidan ayirishda Xato yuz berdi");
          });
        ctx.reply(
          ctx.session.language == "uz"
            ? "To'lov muvaffaqiyatli amalga oshirildi"
            : "Платеж прошел успешно"
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
});
//actions_
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

bot.launch();
console.log("Bot ishladi");
