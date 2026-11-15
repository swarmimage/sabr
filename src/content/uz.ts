// O‘zbekcha kontent. QORALAMA TARJIMA: nashrdan oldin til egasi va ilm ahli tekshirishi shart.
// Oyat va hadislar — ma’noning qisqacha bayoni, manbasi bilan.
import type { Dhikr, Dua, Quote, Story } from "./ru";

/** «Xavfli vaqt» ekranida ko‘rsatiladigan toifalar. */
export const CALM = ["Ko‘rsatma", "Ishonch"];

export const QUOTES: Quote[] = [
  {
    c: "Ko‘rsatma",
    t: "Istak — bu to‘lqin. U ko‘tariladi, bir necha daqiqa turadi va pasayadi. Men undan o‘taman.",
  },
  {
    c: "Oyat",
    t: "Mo‘min erkaklarga ayt: ko‘zlarini tiysinlar va iffatlarini saqlasinlar. Shu ular uchun pokroqdir.",
    s: "ma’nosi, Qur’on 24:30",
  },
  {
    c: "Mardlik",
    t: "Erkak — hech kim tekshirmayotganda ham o‘ziga bergan so‘zida turadigan kishi.",
  },
  {
    c: "Hadis",
    t: "Kuchli — kurashda yengadigan emas. Kuchli — o‘zini tuta oladigan kishi.",
    s: "ma’nosi, al-Buxoriy 6114, Muslim 2609",
  },
  {
    c: "Ishonch",
    t: "Hech kim ko‘rmayapti. Alloh ko‘rib turibdi. To‘xtash uchun shuning o‘zi yetarli.",
  },
  {
    c: "Oyat",
    t: "Kim Robbining huzurida turishdan qo‘rqqan va nafsini havodan qaytargan bo‘lsa, uning joyi jannatdir.",
    s: "ma’nosi, Qur’on 79:40–41",
  },
  {
    c: "Ko‘rsatma",
    t: "Menga butunlay yengish shart emas. Menga hozir yengish kerak.",
  },
  {
    c: "Hadis",
    t: "Alloh uchun nimani tark etsang, Alloh uni sen uchun yaxshirog‘i bilan almashtiradi.",
    s: "ma’nosi, Ahmad 23074",
  },
  {
    c: "Mardlik",
    t: "O‘ziga hukmi o‘tmaganni boshqalar boshqaradi: algoritmlar, ekranlar, birovning puli.",
  },
  {
    c: "Oyat",
    t: "Ey o‘zlariga zulm qilgan bandalarim! Allohning rahmatidan noumid bo‘lmanglar. Alloh barcha gunohlarni kechiradi.",
    s: "ma’nosi, Qur’on 39:53",
  },
  { c: "Ishonch", t: "Nigohim — omonat. Uni pok holda qaytarmoqchiman." },
  {
    c: "Hadis",
    t: "Har bir Odam farzandi xato qiladi, xato qiluvchilarning yaxshisi — tavba qiluvchilardir.",
    s: "ma’nosi, at-Termiziy 2499",
  },
  {
    c: "Ko‘rsatma",
    t: "Men xohishimning quli emasman. Men Allohning bandasiman va erkinligim shunda.",
  },
  {
    c: "Oyat",
    t: "Biz uchun jiddu jahd qilganlarni albatta O‘z yo‘llarimizga boshlaymiz.",
    s: "ma’nosi, Qur’on 29:69",
  },
  { c: "Mardlik", t: "Bo‘lajak rafiqang faqat unga qaraydigan erga loyiq." },
  {
    c: "Hadis",
    t: "Kim menga ikki jag‘i orasidagi va ikki oyog‘i orasidagi narsaga kafil bo‘lsa, men unga jannatga kafil bo‘laman.",
    s: "ma’nosi, al-Buxoriy 6474",
  },
  {
    c: "Ishonch",
    t: "Ko‘rgan narsamni keyin boshimda olib yuraman. Nimani olib yurishni o‘zim tanlayman.",
  },
  {
    c: "Oyat",
    t: "Alloh hech bir jonga toqatidan ortiq narsani yuklamaydi.",
    s: "ma’nosi, Qur’on 2:286",
  },
  {
    c: "Ko‘rsatma",
    t: "Zerikish xavfli emas. Charchoq xavfli emas. Men shu tuyg‘u bilan shunchaki tura olaman.",
  },
  {
    c: "Hadis",
    t: "Mujohid — Allohga itoat yo‘lida o‘z nafsi bilan kurashgan kishidir.",
    s: "ma’nosi, at-Termiziy 1621",
  },
  {
    c: "Mardlik",
    t: "O‘ziga hurmat hech kim bilmaydigan kichik g‘alabalardan quriladi.",
  },
  {
    c: "Oyat",
    t: "Kim Allohdan qo‘rqsa, U unga chiqish yo‘lini beradi va o‘ylamagan tomonidan rizq beradi.",
    s: "ma’nosi, Qur’on 65:2–3",
  },
  {
    c: "Ishonch",
    t: "Lazzat daqiqalarda o‘tadi, uyat kunlab qoladi. Bu almashuv foydasiz.",
  },
  {
    c: "Hadis",
    t: "Qayerda bo‘lsang ham Allohdan qo‘rq, yomon ishdan keyin yaxshi ish qil: u uni o‘chiradi.",
    s: "ma’nosi, at-Termiziy 1987",
  },
  {
    c: "Ko‘rsatma",
    t: "Men shu daqiqadagi xohishni emas, bir yildan keyingi o‘zimni tanlayman.",
  },
  {
    c: "Oyat",
    t: "Albatta, qiyinchilik bilan birga yengillik bor.",
    s: "ma’nosi, Qur’on 94:5–6",
  },
  {
    c: "Mardlik",
    t: "O‘g‘ling sen yolg‘iz qolganda qiladigan ishingga o‘xshaydi.",
  },
  {
    c: "Hadis",
    t: "Boshqa soya bo‘lmaydigan kunda Allohning soyasida bo‘ladigan yetti toifadan biri: obro‘li va go‘zal ayol chaqirganda «Men Allohdan qo‘rqaman» degan erkak.",
    s: "ma’nosi, al-Buxoriy 660, Muslim 1031",
  },
  {
    c: "Ishonch",
    t: "Ekrandagi odamlar — kimningdir qizlari va opa-singillari. Men buning bir qismi bo‘lishni xohlamayman.",
  },
  {
    c: "Oyat",
    t: "Nafsini poklagan kishi najot topdi, uni bulg‘agan kishi ziyon ko‘rdi.",
    s: "ma’nosi, Qur’on 91:9–10",
  },
  {
    c: "Ko‘rsatma",
    t: "Qoqilish bosib o‘tilgan yo‘lni bekor qilmaydi. Lekin bugun men qoqilmayman.",
  },
  {
    c: "Hadis",
    t: "Alloh bandasining tavbasidan sahroda yo‘qotgan tuyasini barcha yuki bilan topgan yo‘lovchidan ham ko‘proq xursand bo‘ladi.",
    s: "ma’nosi, al-Buxoriy 6309, Muslim 2747",
  },
  { c: "Mardlik", t: "Asragan kuchingni ishga, tanangga va oilangga sarfla." },
  {
    c: "Oyat",
    t: "Yaxshiliklar yomonliklarni ketkazadi.",
    s: "ma’nosi, Qur’on 11:114",
  },
  {
    c: "Ishonch",
    t: "Xohishning o‘zi gunoh emas. Gunoh — bu qadam. Qadamni esa tashlamasligim mumkin.",
  },
  {
    c: "Oyat",
    t: "Alloh tavba qiluvchilarni va poklanuvchilarni yaxshi ko‘radi.",
    s: "ma’nosi, Qur’on 2:222",
  },
  {
    c: "Mardlik",
    t: "Qiyin bo‘lsa — demak o‘syapsan. Oson bo‘lgani faqat pastga dumalash edi.",
  },
  {
    c: "Hadis",
    t: "Hayo iymondandir.",
    s: "ma’nosi, al-Buxoriy 24, Muslim 36",
  },
  {
    c: "Ko‘rsatma",
    t: "Har bir yengilgan to‘lqin keyingisini kuchsizroq qiladi.",
  },
  {
    c: "Oyat",
    t: "Bilingki, qalblar Allohning zikri bilan orom topadi.",
    s: "ma’nosi, Qur’on 13:28",
  },
  {
    c: "Hadis",
    t: "Bandam Menga yurib kelsa, Men unga shoshib boraman.",
    s: "hadisi qudsiy ma’nosi, al-Buxoriy 7405, Muslim 2675",
  },
];

export const DUAS: Dua[] = [
  {
    h: "Istak kelgan paytda",
    ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    tr: "A’uzu billahi minash-shaytonir-rojim",
    m: "Quvilgan shaytondan Allohdan panoh so‘rayman.",
    s: "Qur’on 41:36 shayton vasvasa qilganda Allohdan panoh so‘rashni buyuradi",
  },
  {
    h: "Quloq, ko‘z va shahvat yomonligidan",
    ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ سَمْعِي، وَمِنْ شَرِّ بَصَرِي، وَمِنْ شَرِّ لِسَانِي، وَمِنْ شَرِّ قَلْبِي، وَمِنْ شَرِّ مَنِيِّي",
    tr: "Allohumma inni a’uzu bika min sharri sam’i, va min sharri basari, va min sharri lisani, va min sharri qalbi, va min sharri maniyyi",
    m: "Allohim, qulog‘im, ko‘zim, tilim, qalbim yomonligidan va shahvatim yomonligidan Sendan panoh so‘rayman.",
    s: "Abu Dovud 1551, at-Termiziy 3492",
  },
  {
    h: "Iffat haqida",
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    tr: "Allohumma inni as’alukal-huda vat-tuqo val-’afafa val-g‘ino",
    m: "Allohim, Sendan hidoyat, taqvo, iffat va odamlarga muhtoj bo‘lmaslikni so‘rayman.",
    s: "Muslim 2721",
  },
  {
    h: "Mag‘firat, pok qalb, himoya",
    ar: "اللَّهُمَّ اغْفِرْ ذَنْبِي، وَطَهِّرْ قَلْبِي، وَحَصِّنْ فَرْجِي",
    tr: "Allohummag‘fir zanbi, va tohhir qalbi, va hassin farji",
    m: "Allohim, gunohimni kechir, qalbimni pokla va iffatimni saqla.",
    s: "Payg‘ambar ﷺ shu so‘zlar bilan bir yigit haqqiga duo qilganlar (Ahmad 22211); bu yerda birinchi shaxsda",
  },
  {
    h: "Qalb sabotligi haqida",
    ar: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    tr: "Ya muqollibal-qulub, sabbit qalbi ’ala dinik",
    m: "Ey qalblarni aylantiruvchi Zot, qalbimni diningda sobit qil.",
    s: "at-Termiziy 2140",
  },
  {
    h: "Qoqilgandan keyin",
    ar: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    tr: "Robbana zolamna anfusana va in lam tag‘fir lana va tarhamna lanakunanna minal-xosirin",
    m: "Robbimiz, biz o‘zimizga zulm qildik. Agar bizni kechirmasang va rahm qilmasang, albatta ziyon ko‘rganlardan bo‘lamiz.",
    s: "Odam alayhissalomning duosi. Qur’on 7:23",
  },
  {
    h: "Qalb og‘ib ketmasligi uchun",
    ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    tr: "Robbana la tuzig‘ qulubana ba’da iz hadaytana va hab lana min ladunka rohma, innaka antal-Vahhob",
    m: "Robbimiz, bizni hidoyat qilganingdan keyin qalblarimizni og‘dirma va bizga O‘z huzuringdan rahmat ato et. Albatta, Sen ko‘p ato etuvchisan.",
    s: "Qur’on 3:8",
  },
  {
    h: "Ibodatda yordam so‘rash",
    ar: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    tr: "Allohumma a’inni ’ala zikrika va shukrika va husni ’ibadatik",
    m: "Allohim, Seni zikr qilishda, Senga shukr qilishda va Senga chiroyli ibodat qilishda menga yordam ber.",
    s: "Abu Dovud 1522",
  },
];

export const DHIKR: Dhikr[] = [
  {
    id: "subhan",
    n: "Subhanalloh",
    ar: "سُبْحَانَ اللَّهِ",
    m: "Alloh pokdir",
    g: 33,
  },
  {
    id: "hamd",
    n: "Alhamdulillah",
    ar: "الْحَمْدُ لِلَّهِ",
    m: "Allohga hamd bo‘lsin",
    g: 33,
  },
  {
    id: "akbar",
    n: "Allohu akbar",
    ar: "اللَّهُ أَكْبَرُ",
    m: "Alloh buyukdir",
    g: 34,
  },
  {
    id: "istigfar",
    n: "Astag‘firulloh",
    ar: "أَسْتَغْفِرُ اللَّهَ",
    m: "Allohdan mag‘firat so‘rayman",
    g: 100,
  },
  {
    id: "tahlil",
    n: "La ilaha illalloh",
    ar: "لَا إِلٰهَ إِلَّا اللَّهُ",
    m: "Allohdan o‘zga iloh yo‘q",
    g: 100,
  },
  {
    id: "hawla",
    n: "La havla va la quvvata illa billah",
    ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    m: "Kuch va quvvat faqat Allohdandir",
    g: 33,
  },
  {
    id: "salawat",
    n: "Salovat",
    ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    m: "Allohim, Muhammadga salovat ayt",
    g: 100,
  },
];

export const MYTHS: [string, string][] = [
  [
    "Bir marta hisobga o‘tmaydi.",
    "Har bir tomosha odatni mustahkamlaydi: miya istak mukofot bilan tugashini eslab qoladi. «Faqat bir marta» — uzoq orqaga ketishdan oldingi eng ko‘p uchraydigan fikr.",
  ],
  [
    "Taslim bo‘lmagunimcha istak kuchayaveradi.",
    "Istak to‘lqin bo‘lib keladi. Uni xayol va ekran bilan oziqlantirmasang, odatda 10–20 daqiqada susayadi. Har bir yengilgan to‘lqin keyingisini kuchsizroq qiladi.",
  ],
  [
    "Qoqildim — demak hammasi bekor, noldan boshlayman.",
    "Taymer nolga tushadi, ko‘nikma va o‘zgarishlar esa yo‘q. Tavba eshigi ochiq: «Allohning rahmatidan noumid bo‘lmanglar» (Qur’on 39:53). Qoqilgandan keyingi umidsizlik qoqilishning o‘zidan xavfliroq.",
  ],
  [
    "Pornodan tiyilish sog‘liqqa zarar.",
    "Pornografiyadan voz kechish organizmga zarar qilishi haqida ma’lumot yo‘q. Tana o‘zini o‘zi tartibga soladi, jumladan uyquda ham.",
  ],
  [
    "Tiyilish g‘ayrioddiy qobiliyat beradi.",
    "Mo‘jiza bo‘lmaydi. Ko‘proq vaqt, tiniq fikr, xotirjam vijdon va o‘ziga hurmat bo‘ladi. Shuning o‘zi yetarli.",
  ],
  [
    "Faqat iroda kuchi kerak.",
    "Iroda kechga borib charchaydi. Muhit ishlaydi: telefon yotoqxonadan tashqarida, filtrlar, band kun, uyqu, yoningdagi odamlar. Imkoniyatni olib tashla — iroda ancha kam kerak bo‘ladi.",
  ],
  [
    "Men yolg‘iz shundayman, menda nimadir noto‘g‘ri.",
    "Muammo keng tarqalgan, jumladan dinga amal qiladigan musulmonlar orasida ham. Uyat jim turishga majbur qiladi, jimlik esa uni oziqlantiradi. Gunohni odamlardan yashirish to‘g‘ri, lekin ishonchli kishidan yordam so‘rash mumkin va kerak.",
  ],
  [
    "Menda xohish bor ekan, men allaqachon gunohkorman.",
    "Mayl Alloh tomonidan yaratilgan va o‘zi gunoh emas. Davom ettirgan nigohing va tashlagan qadaming uchun so‘ralasan.",
  ],
  [
    "Uylansam, hammasi o‘zi o‘tib ketadi.",
    "Nikoh — himoya, lekin ekranga o‘rganish odam bilan birga nikohga ko‘chadi. Uni nikohdan oldin tashlash kerak, unga umid bog‘lash emas.",
  ],
  [
    "Shuncha qoqilgandan keyin Alloh meni kechirmaydi.",
    "Hadisi qudsiyda banda qayta-qayta gunoh qilib, tavba qiladi va har safar Alloh: «Bandam gunohni kechiradigan Robbi borligini bildi», deydi (al-Buxoriy 7507, Muslim 2758). Shart bitta: chin dildan tavba qilish va kurashni davom ettirish.",
  ],
];

export const STORIES: Story[] = [
  {
    h: "Yusuf alayhissalom va yopilgan eshiklar",
    p: "Yusuf yosh, ko‘rkam, begona yurtda va amaldorning uyida yashardi. Uy bekasi eshiklarni berkitib, uni chaqirdi. Guvoh yo‘q edi, rad etish esa balo keltirardi. U: «Alloh saqlasin!» dedi va eshik tomon yugurdi. Keyinroq bosim kuchayganda: «Robbim, ular meni chaqirayotgan narsadan ko‘ra zindon menga yaxshiroq», dedi.",
    l: "U vasvasa bilan turib bahslashmadi. U yugurdi. O‘rningdan turib xonadan chiqib ketish — g‘alabaning o‘zi.",
    s: "Qur’on 12:23–34",
  },
  {
    h: "Gunohga ruxsat so‘ragan yigit",
    p: "Bir yigit Payg‘ambar ﷺ huzuriga kelib, zinoga ruxsat so‘radi. Odamlar unga baqira boshladi. Payg‘ambar ﷺ uni yaqinroq chaqirib so‘radilar: «Buni onang uchun xohlarmiding? Qizing uchun? Singling uchun?» Yigit har safar: yo‘q, dedi. «Odamlar ham o‘z yaqinlari uchun buni xohlamaydi». So‘ng qo‘llarini uning ustiga qo‘yib, Allohdan gunohini kechirishni, qalbini poklashni va iffatini saqlashni so‘radilar. Shundan keyin yigit bunday narsaga qayrilib qaramadi.",
    l: "Seni haydashmagan bo‘lardi. Sen bilan gaplashib, haqqingga duo qilishardi. Ekrandagi ayollar esa kimningdir qizlari va singillari.",
    s: "Ahmad 22211",
  },
  {
    h: "G‘ordagi uch kishi",
    p: "Qoya g‘or og‘zini berkitdi va uch kishi eng yaxshi amallari hurmatidan Allohdan najot so‘radi. Biri aytdi: u amakisining qizini qattiq yaxshi ko‘rardi, ocharchilik yili qiz yordam so‘rab keldi. U yaqinlik sharti bilan pul berdi. Hammasi qo‘lida bo‘lgan paytda qiz: «Allohdan qo‘rq», dedi. U o‘rnidan turib, pulni qoldirib ketdi. Qoya surildi.",
    l: "Hamma narsa qo‘l ostida bo‘lib, hech kim ko‘rmayotgan lahzada Alloh uchun voz kechish — duolar qabul bo‘ladigan amal.",
    s: "al-Buxoriy 2272, Muslim 2743",
  },
  {
    h: "To‘qson to‘qqiz kishini o‘ldirgan odam",
    p: "U o‘zi uchun tavba bor-yo‘qligini so‘radi. Olim javob berdi: «Sen bilan tavba orasiga kim to‘sqinlik qila oladi? Falon yurtga bor, u yerda odamlar Allohga ibodat qiladi. O‘z yurtingga qaytma: u yomonlik yurtidir». U yo‘lda vafot etdi va rahmat farishtalari uni olib ketdi, chunki u borayotgan yurtiga yaqinroq chiqdi.",
    l: "O‘tmishing qanday bo‘lmasin, eshik ochiq. Maslahatning ikkinchi yarmi ham shunchalik muhim: gunoh qilgan muhitingni almashtir.",
    s: "al-Buxoriy 3470, Muslim 2766",
  },
];

export const PRACTICES: [string, string][] = [
  [
    "Ikkinchi nigoh",
    "Birinchi tasodifiy nigoh sening gunohing emas, ikkinchisi — sening tanloving (Abu Dovud 2149). Bitta harakatni mashq qil: ko‘rding — ko‘zingni olib qochding va o‘tkazib yubording. Ko‘chada, lentada, hamma joyda.",
  ],
  [
    "Tahorat va ikki rakat",
    "Istakni sezding — o‘rningdan tur, sovuq suv bilan yuvin, tahorat ol va ikki rakat o‘qi. Tana holatini o‘zgartiradi, diqqat ekrandan ketadi.",
  ],
  [
    "Ro‘za",
    "Payg‘ambar ﷺ uylanishga qodir bo‘lmagan yoshlarga ro‘za tutishni maslahat berganlar: ro‘za ular uchun qalqon (al-Buxoriy 5066). Dushanba va payshanbadan boshla.",
  ],
  [
    "Telefon yotoqxonadan tashqarida",
    "Quvvatlagich koridorda, budilnik alohida. Qoqilishlarning ko‘pi to‘shakda, tunda va ertalab sodir bo‘ladi.",
  ],
  [
    "Filtrlar",
    "Router va telefonga oilaviy DNS-filtr qo‘y (masalan, 1.1.1.3), qo‘zg‘atuvchi ilovalarni o‘chir, hammasi boshlanadigan akkauntlardan obunani bekor qil.",
  ],
  [
    "Istak to‘lqinida suzish",
    "Kurashma ham, oziqlantirma ham. Ovoz chiqarib ayt: «Bu istak, u o‘tib ketadi». Nafas ol va 10–15 daqiqa kuzat. SOS tugmasi buni qadam-baqadam olib boradi.",
  ],
  [
    "Tekshiruv: ochmisan, jahling chiqqanmi, yolg‘izmisan, charchaganmisan",
    "Istak ko‘pincha boshqa ehtiyojni yashiradi. Ovqatlan, dardingni ayt, odamlar orasiga chiq yoki uxla.",
  ],
  [
    "Og‘ir mashg‘ulot",
    "Haftada uch-to‘rt marta charchaguncha. Charchagan tana uxlaydi, dofamin qidirmaydi.",
  ],
  [
    "Sunnat bo‘yicha uyqu",
    "Xuftondan keyin — uxlash, bomdodga — turish. Ekran bilan tungi bedorlikni butunlay yo‘q qil.",
  ],
  [
    "«Agar — unda» rejasi",
    "Oldindan qaror qil: «Agar bosib kelsa, turaman, telefonni qoldiraman va ko‘chaga chiqaman». Istak paytida o‘ylashga kech, tayyor javob kerak.",
  ],
  [
    "Ekran bilan yolg‘iz qolma",
    "Kompyuterda umumiy xonada yoki eshik ochiq holda ishla. Kechqurun bo‘sh uyni masjid, zal yoki mehmonga almashtir.",
  ],
  [
    "Ishonchli birodar",
    "Haftada bir marta ishlaring qandayligini halol aytadigan bitta odam. Hammaga emas, bitta ishonchli kishiga.",
  ],
  [
    "Har kuni zikr va Qur’on",
    "Ertalabki va kechki zikrlar, hech bo‘lmasa bir sahifa Qur’on. Zikr bilan band qalbni boshqa narsa bilan band qilish qiyinroq.",
  ],
  [
    "Mutaxassis yordami",
    "Oylar davomida o‘zing eplay olmasang, qaramliklar bilan ishlaydigan psixolog yoki psixoterapevtga murojaat qil. Bu zaiflik emas, sababga yopishishdir.",
  ],
];

export const SOS_STEPS: string[] = [
  "O‘rnimdan turib, xonadan chiqdim",
  "Telefonni boshqa xonada qoldirdim, noutbukni yopdim",
  "«A’uzu billahi minash-shaytonir-rojim» dedim",
  "Sovuq suv bilan tahorat oldim",
  "Ikki rakat namoz o‘qidim",
  "20 marta otjimaniya yoki o‘tirib-turish qildim",
  "Bir stakan suv ichdim",
  "Yaqin odamga yozdim yoki qo‘ng‘iroq qildim",
  "Kamida 10 daqiqaga ko‘chaga chiqdim",
];

export const CELEBRATE: Record<number, [string, string]> = {
  7: [
    "Agar shukr qilsangiz, albatta sizga ziyoda qilaman.",
    "ma’nosi, Qur’on 14:7",
  ],
  30: [
    "Biz uchun jiddu jahd qilganlarni albatta O‘z yo‘llarimizga boshlaymiz.",
    "ma’nosi, Qur’on 29:69",
  ],
  40: [
    "Albatta, Alloh sabr qiluvchilar bilan birgadir.",
    "ma’nosi, Qur’on 2:153",
  ],
  90: [
    "Sabr qiluvchilarga ajrlari hisobsiz, to‘liq beriladi.",
    "ma’nosi, Qur’on 39:10",
  ],
};
export const CELEBRATE_DAYS = [90, 40, 30, 7];
