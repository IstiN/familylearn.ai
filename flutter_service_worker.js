'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"terms-ru.html": "0a69f320849635939c8f21867a4aba72",
"parental-control-learning/index.html": "d7c83163e8fb4d4e861e2d74f3bb7f21",
"locales/vi.json": "f118ba8f8572cfd4f83e1647070161fb",
"locales/ar.json": "0612ccbc7bb4e895178b6104b39a5784",
"locales/nl.json": "5355bc34378a72109969959b0424c312",
"locales/he.json": "f4ef2b5bfa07fb7b432b2beb9f160f6c",
"locales/hr.json": "62978c57363182e0186f92ff8985e22f",
"locales/sk.json": "b0af5e625ba8cd7a36f37cbfdb5a5493",
"locales/zh-Hant.json": "94211d482836cd7f8635ecb3655bcdbf",
"locales/default.json": "ee54a4eabe0bfa3a3ecc4a77a3ed28e3",
"locales/ja.json": "53d78894af946528f338de7c651a1ee3",
"locales/hi.json": "1cf58297dcc4e6961f5285d742ce6ae5",
"locales/tr.json": "5babdbdd59e0164ed96d5633cd820c6a",
"locales/fr.json": "23484749f742692a59652d5f7b1bdeaf",
"locales/de.json": "3b3936158e2807bae229fe6d0b448934",
"locales/da.json": "9fae11be7526633ab57cc5d8b8c6174b",
"locales/el.json": "a513e1408b415c1492e519bdd62f4104",
"locales/en.json": "ca5821a877933205b409bcca0342d464",
"locales/sv.json": "b29fd697650306811ce73babad84dda4",
"locales/uk.json": "9d3c28d312217d017190c3c114928361",
"locales/es.json": "5f39f20daaf6100ed55d37f11b01caf1",
"locales/es-419.json": "018454ba48e5ac98dd6a0d5d4cf35f74",
"locales/no.json": "dd162a66800e6f87640e66713dec3d6b",
"locales/ms.json": "69e1ff136197f31bd93104529eb58f39",
"locales/fi.json": "2c2e1d629220fd86a584a9dc6ce5afd0",
"locales/ro.json": "603c056f56c12ee24875b7bc40de33c4",
"locales/pt-BR.json": "5019a2cecb37e125816a02a33b9e3d1b",
"locales/th.json": "7efece78d24cf9e7ae1b93249c3b66ef",
"locales/it.json": "30b7948211dc89b7278518d260f0bba9",
"locales/locale_catalog.json": "783ca7a4d81b2b0b33d1ae05b5421682",
"locales/ru.json": "4e0a608d5778dcb76391480577b1dc5a",
"locales/README.md": "55d722f2a6f299c2412206473e424dcf",
"locales/ko.json": "e95a4a6ae8aa389d2978465d98963f62",
"locales/pl.json": "d25ca391ff2ecd52d4cd850b8b23f55f",
"locales/zh-Hans.json": "12da36ec56318433d0407aca9b529583",
"locales/id.json": "ca7d806910fa37763b2ebe97aded374a",
"locales/ca.json": "2727ba1adcc9fe4eb4d81521d634a4dc",
"locales/cs.json": "8df45c999a4ec63fea2eef249e57f264",
"locales/hu.json": "bb9294eb1656b898267da348d9a834ba",
"privacy-policy-de.html": "389b0ec20f2645097ae35d781340ae08",
"terms-en.html": "f4d838fd36c3b7f428ed1854d1141a61",
"manifest.json": "414d4dbca97e6e83eaca4e01dbb2a9e6",
"privacy-policy-es.html": "ad04d6c904cb2453d924c1b5e18e7851",
"qa/index.html": "eb2b65e12c870b89dfe353cf30fb82b5",
"apple-touch-icon.png": "56867def6aa0ecd49d7ef5f06592d5f5",
"og-image-twitter.jpg": "7e3ff4d57ce42af97fc9eb9fa3e5b68e",
"privacy-policy-fr.html": "b7ed6f4819d0f6ac1d8532fe25ec5c6d",
"version.json": "267bcfee25ff575569974b3924f25772",
"family-chat/index.html": "1f9b4a92d336d89a6ca015754189cf12",
"generate_lang_html.sh": "2f0dd98711f7d1e5ccbef7afc91c5668",
"og-image-small.jpg": "12e6ddf5deeae5044a870672a1079bcf",
"og-image.jpg": "9c128486e3380ffaaf7ebf4f8a07c490",
"ai-checks-homework/index.html": "3695a0baad2932e195afeabf93eaa075",
"robots.txt": "1b0eea6752046508dc4e92e60aa6690b",
"og-image-whatsapp.jpg": "3f22fb1ff15cef8c77a168e0c38decdf",
"main.dart.js": "40213f21fbe2c3f6fb642ea2affa6af7",
"flutter_bootstrap.js": "a15c481beaf9f882555424e95d162056",
"sitemap.xml": "f895dfecc51df92ba7b0b58eeaa75954",
"icons/Icon-maskable-512.png": "86fd0959c22fc6191988c8923753f97a",
"icons/Icon-192.png": "f3e16cf3764095a5444756fbd1b7730c",
"icons/Icon-maskable-192.png": "f3e16cf3764095a5444756fbd1b7730c",
"icons/Icon-512.png": "86fd0959c22fc6191988c8923753f97a",
"privacy-policy-ru.html": "951006b80c605d19d5588ea9c4e7f484",
"CNAME": "fa8f11d1fedd08a329f4879f984b3017",
"favicon.png": "16f957091952004661e307cb82d5f9b2",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"icon.svg": "e4cf681e93b180468148812a3c5e3a50",
"index.html": "5d80b721fc2312a5176bbcb56b3f2ce8",
"/": "5d80b721fc2312a5176bbcb56b3f2ce8",
"exam-prep-podcast/index.html": "5cb3338cafa1baca282545f32f7fdd59",
"templates/public_course_seo.html": "f6f07101e74d8ed5307d08e2d9abe326",
"scripts/generate_landing_pages.js": "e6b748d336223752788f9453869a45a3",
"scripts/generate_public_seo.js": "e24cd339a704dd63ed946173e7bb431e",
"auth/callback/index.html": "3e71a5a85eed7f802aaa68369b242593",
".well-known/assetlinks.json": "eff647f92dab84101e6126ea66b08c08",
".well-known/apple-app-site-association": "6963fbf135b08d96e9c614e554811c3a",
"privacy-policy-en.html": "0e0f675f6b2cc24757e501fd54901ebe",
"blog/best-ai-homework-apps-2025.html": "3db0687d5986075c26455c67f0d8b9c5",
"blog/help-child-math-homework.html": "6e81c7707db94336ad4c889cc69266ec",
"blog/how-parents-monitor-ai-chat.html": "bec41b835afaa346a5c31b8c260f9a30",
"blog/index.html": "688d262710c0b407bd19559e11132192",
"blog/ai-tutor-vs-traditional-tutor.html": "a31fd7e72d2048bb223f91d524cb37b0",
"blog/is-chatgpt-safe-for-kids.html": "5b3c1654ece279d486810584189ed68b",
"js/landing.js": "567aba72105939c51676193b182a742d",
"css/landing.css": "7a251efe8b8716f03a6ba0a8fa7a2945",
"og-image.png": "549ae3345328d32ded401bed6f37babb",
"firebase-messaging-sw.js": "4336b3ca6f4afc91198e39638d6cd8ee",
"ai-homework-helper/index.html": "54bdf6e06ea7132e7222280881f87a41",
"googlea398c066732dac6b.html": "f75564296a6bbfa56885e4d40d21635a",
"glossary/index.html": "e86fbf9261309a24e083517f3ff3c0a1",
"assets/AssetManifest.bin": "98077aa37f0ce1323b2efa36cdfc8d7d",
"assets/fonts/MaterialIcons-Regular.otf": "12309c21d3d997335831e6ef74e160f0",
"assets/landing/en/web_device_mockups.png": "5cf4f31fd230a5b804661ed909a0fe96",
"assets/landing/en/web_ratings.png": "7e2085cb845c72995d16a847cdcfddbd",
"assets/landing/en/web_family_dashboard.png": "08c8c1af01b3f43cdc9cfdd7fa93f856",
"assets/landing/en/web_ai_chat.png": "4fb7c58399ba8ef6f2e05e7c977914cc",
"assets/landing/subject-2.svg": "502b301d6e34983ef477f0794db46e82",
"assets/landing/hero_light_1800.jpg": "87518364ae96ce829a1408d880785666",
"assets/landing/hero_dark_2400.jpg": "604e95db3eb3e58bbef69a736a97358f",
"assets/landing/hero_light_original.jpg": "6252ded77d37886d3af78f1bfe36ca74",
"assets/landing/hero_dark_2400.webp": "af605b54ed0adb05499af68ca3de8293",
"assets/landing/hero_dark_1800.webp": "7b9533639780245a99fb57a7a84a8a0e",
"assets/landing/de/web_device_mockups.png": "5cf4f31fd230a5b804661ed909a0fe96",
"assets/landing/de/web_ratings.png": "7e2085cb845c72995d16a847cdcfddbd",
"assets/landing/de/web_family_dashboard.png": "08c8c1af01b3f43cdc9cfdd7fa93f856",
"assets/landing/de/web_ai_chat.png": "4fb7c58399ba8ef6f2e05e7c977914cc",
"assets/landing/fr/web_device_mockups.png": "5cf4f31fd230a5b804661ed909a0fe96",
"assets/landing/fr/web_ratings.png": "7e2085cb845c72995d16a847cdcfddbd",
"assets/landing/fr/web_family_dashboard.png": "08c8c1af01b3f43cdc9cfdd7fa93f856",
"assets/landing/fr/web_ai_chat.png": "4fb7c58399ba8ef6f2e05e7c977914cc",
"assets/landing/ru/web_device_mockups.png": "5cf4f31fd230a5b804661ed909a0fe96",
"assets/landing/ru/web_ratings.png": "7e2085cb845c72995d16a847cdcfddbd",
"assets/landing/ru/web_family_dashboard.png": "08c8c1af01b3f43cdc9cfdd7fa93f856",
"assets/landing/ru/web_ai_chat.png": "4fb7c58399ba8ef6f2e05e7c977914cc",
"assets/landing/hero_light_2400.webp": "764e62b4f2a6461cc2a00fc7ae52d01d",
"assets/landing/hero_dark_original.jpg": "bae04b923d5ee3327ded52e66088600c",
"assets/landing/hero_dark_1800.jpg": "9a30555fd3204dc0081991f9d3e02645",
"assets/landing/subject-1.svg": "afc0f356450699f55d5ac632ec0a7b29",
"assets/landing/hero_dark_900.webp": "bed202899f02c7f24404da2e734979ec",
"assets/landing/hero_dark_1200.jpg": "104978a14f3e6e6c510ee13171ba7e9f",
"assets/landing/hero_light_900.webp": "e4edb29bc654c41e3b945364eeb210ee",
"assets/landing/hero_light_600.jpg": "cdd5ae1ff218b2e48d1b119afba404b8",
"assets/landing/es/web_device_mockups.png": "5cf4f31fd230a5b804661ed909a0fe96",
"assets/landing/es/web_ratings.png": "7e2085cb845c72995d16a847cdcfddbd",
"assets/landing/es/web_family_dashboard.png": "08c8c1af01b3f43cdc9cfdd7fa93f856",
"assets/landing/es/web_ai_chat.png": "4fb7c58399ba8ef6f2e05e7c977914cc",
"assets/landing/hero_visual1.png": "e302fe235fcdccecc73fa7f4a9259e6a",
"assets/landing/hero_light_1800.webp": "f0b10d80518ab5d3f44de6db6a0bb1ba",
"assets/landing/logo-icon.svg": "71b76bdb67141ccfbaedde347b81440c",
"assets/landing/hero_light_900.jpg": "833d5d97c36e1af67b2138e1176716bd",
"assets/landing/hero_dark_900.jpg": "6abcead6218aa9fe1838c52b83533eb2",
"assets/landing/hero_light_600.webp": "6b4d0bbcce2ecb4213c33a8a467b703f",
"assets/landing/hero_dark_600.jpg": "db2876e9ff4b5c4443d18017fc630470",
"assets/landing/hero_dark_1200.webp": "3c76ff8b069a8225c840f74f88c5469a",
"assets/landing/hero_light_1200.jpg": "7025bbc0ce6e74df508a56979411f7cb",
"assets/landing/subject-3.svg": "f5e2635782e9fefbd90eb6eb567705b1",
"assets/landing/hero_light_1200.webp": "996613a620f872d50c501c5e58ac55d2",
"assets/landing/hero_light_2400.jpg": "2febbf7942ddf013f527631ed66e1c53",
"assets/landing/hero_dark_600.webp": "098723208fb8739e81608a5dcab49ad2",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin.json": "3a532896b388ce7f237fe5710c996129",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/AssetManifest.json": "d9f48fa63dacf36cccb88e1028952c5d",
"assets/assets/navigation/learn-ai-icon-filled.svg": "d0e27a8e240aefd62d3866e6e9a05134",
"assets/assets/navigation/family-icon-rounded.svg": "f721b3a489af1aeab306d8499b338afa",
"assets/assets/navigation/profile-icon-rounded.svg": "b17103e6721cf960c4451ffcd7ebd092",
"assets/assets/navigation/profile-icon-outline.svg": "2a9e9f095b9804727b793e02e30ff6b8",
"assets/assets/navigation/subjects-icon-outline.svg": "cf1515cbd48e9c152dd480c2e1fdeb8c",
"assets/assets/navigation/homework-icon-outline.svg": "ad7e94b527acc78020e1397f66c45bc3",
"assets/assets/navigation/dashboard-icon-outline.svg": "4541d5d76684e7b1537116f00cf26317",
"assets/assets/navigation/summary-icon-filled.svg": "51a4029fbb17a62637fbcdcfaa151e34",
"assets/assets/navigation/family-icon-outline.svg": "ade27908822777406c468262e15d2728",
"assets/assets/navigation/homework-icon-rounded.svg": "965c1dd801d08f6818c09e0a770dcfb6",
"assets/assets/navigation/dashboard-icon-rounded.svg": "711f6745df27c378f334052a1eb13e90",
"assets/assets/navigation/subjects-icon-filled.svg": "09b4a3fbf73ea895e093e8aeccf1689a",
"assets/assets/navigation/subjects-icon-rounded.svg": "f3db0473874ac03ea06f13217a01a19e",
"assets/assets/navigation/profile-icon-filled.svg": "14a182244ae502c2860b11a9fea879e8",
"assets/assets/navigation/dashboard-icon-filled.svg": "4988c5d3b2eab5da49543541394e3680",
"assets/assets/navigation/summary-icon-outline.svg": "cf1e111b6674013a685508aea110f9ae",
"assets/assets/navigation/learn-ai-icon-outline.svg": "2ffc34ebd11ad43876f5b862cfb20ef5",
"assets/assets/navigation/family-icon-filled.svg": "aba862e6092973ca17dd6715ce836e68",
"assets/assets/navigation/homework-icon-filled.svg": "2dbfe2558992487e5fc2ddaf9d0cea4b",
"assets/assets/navigation/homework-details-icon.svg": "2c3ac972e6540803dd000687808940f3",
"assets/assets/icon/learn_ai_icon_foreground.png": "d2cfa616dc95f154d947e05852a51478",
"assets/assets/icon/learn_ai_icon_background.png": "339fdd6d21401ce9d797c1dc1fba59e4",
"assets/assets/icon/learn_ai_icon.png": "b834e1faa7258ccc4c04d258e2d45f92",
"assets/assets/onboarding/schedule.webp": "cfcdd1464399eef2af4b07afcbefef0e",
"assets/assets/onboarding/2.0x/schedule.webp": "2a36da16e44e6c225f16553735223aee",
"assets/assets/onboarding/2.0x/parent.webp": "06962d7c04f47c064fbb690f7e9efd20",
"assets/assets/onboarding/2.0x/learning.webp": "62e0942ded7588b1199c4d1f6b1ab59e",
"assets/assets/onboarding/parent.webp": "92bb6fb4e16d246396191f9c31f01d28",
"assets/assets/onboarding/3.0x/schedule.webp": "a23ea4cd41ccb3b88b41ed55d83dc7aa",
"assets/assets/onboarding/3.0x/parent.webp": "6e23b0fa237d0d8fb9d3a7060e559903",
"assets/assets/onboarding/3.0x/learning.webp": "feeac1f99921e37add7280e577d64b34",
"assets/assets/onboarding/README.md": "5d611f035521f32e6d438d4a7fbc4947",
"assets/assets/onboarding/learning.webp": "e158fb5f959d8b63d0731bac6b892638",
"assets/assets/splash/splash_icon.png": "3d5538c8986170a26529b7f3ba6b577e",
"assets/assets/animated/final_icon_animated.svg": "b84f4fa18162a5371de42b8b8b65cbab",
"assets/assets/animated/final_icon_static.svg": "6e9b2b7554ec4b7d63b7aa201b5f4428",
"assets/assets/logo/user_avatar.svg": "8a4f32239d6fcc5a6f0061ea26df7667",
"assets/assets/logo/logo-icon.svg": "900689d6f6dcc8a1a1a40028d2c63b23",
"assets/assets/partners/openrouter.svg": "5b94695e497aefdad896f5380aec9701",
"assets/assets/partners/gemini.svg": "9263d4979ea33495cb5cf9c2c8aa99e7",
"assets/assets/partners/ollama.svg": "ec544a29ec699952f51a029a8456cd61",
"assets/assets/privacy/privacy_el.md": "87e205d380d62c1c0b0345812b1068d5",
"assets/assets/privacy/privacy_sk.md": "feca61ba0398014a43fa978e97a44087",
"assets/assets/privacy/privacy_uk.md": "c19fdf12f057da8d0bb617c605819b44",
"assets/assets/privacy/privacy_zh.md": "8ba9c1efab2a5c8eae080e8de97d3cf7",
"assets/assets/privacy/privacy_da.md": "af4931e5f076b3c54e36bcafcce37b5b",
"assets/assets/privacy/privacy_it.md": "02e68075f4058c5ff4769fff66bd0ed6",
"assets/assets/privacy/privacy_fi.md": "d61c56a9f97e52661de08f45300f68c9",
"assets/assets/privacy/privacy_de.md": "8ac0099ebdcf2d65228beb41664a16d2",
"assets/assets/privacy/privacy_ko.md": "c5fe1c2f753ce07277512cc562d2085e",
"assets/assets/privacy/privacy_no.md": "997a7b91d70fd3c06b26be16e218512a",
"assets/assets/privacy/privacy_sv.md": "7b1b66d9571263cb78b40ab0ad5d4753",
"assets/assets/privacy/privacy_ar.md": "977d57b87958f794f2c2cc7ee070ca3f",
"assets/assets/privacy/privacy_vi.md": "bb2fa2afdf5cc3166c10605b613db0ba",
"assets/assets/privacy/privacy_hr.md": "1c4add1f2a674645bd2e94c5e3782e31",
"assets/assets/privacy/privacy_ro.md": "3a87569f6eb7dd3b061bf84b5d1ce51c",
"assets/assets/privacy/privacy_ru.md": "314f2282f86d5ed2192280177b3f7762",
"assets/assets/privacy/privacy_he.md": "ee6a1eed048db659c67097bf5da13ba1",
"assets/assets/privacy/privacy_pl.md": "c22da64334885a480850bc5332377e39",
"assets/assets/privacy/privacy_pt.md": "f9df533dcb086273305aea76e9274218",
"assets/assets/privacy/privacy_cs.md": "12f84c6e7d0da0c6d41dd11dcd15bfbd",
"assets/assets/privacy/privacy_ja.md": "b02ff2510d3bbe4e440b6ac5b34bee68",
"assets/assets/privacy/privacy_ca.md": "5525cde06b23409e107920b17d829a6b",
"assets/assets/privacy/privacy_fr.md": "463ac464782fd62742ecf12f70aae23e",
"assets/assets/privacy/privacy_en.md": "14c47cf12a4e8d16076331db6a21af92",
"assets/assets/privacy/privacy_th.md": "9f007d4e25629cd165c883e72098f27a",
"assets/assets/privacy/privacy_ms.md": "2502e772f544cc7d26ed05ccd83ef768",
"assets/assets/privacy/privacy_hi.md": "dde5bc4f1250595634087f32bae793fc",
"assets/assets/privacy/privacy_hu.md": "3a4ebe74adec1e3d32e24be5d85e4531",
"assets/assets/privacy/privacy_tr.md": "2539ece3c8f3ee470a2a78e88f2c60b4",
"assets/assets/privacy/privacy_es.md": "164db11ea2d6697c6d933f1e030528f0",
"assets/assets/privacy/privacy_id.md": "31d54d2ad4fa8d05a641e7d4f4707c0e",
"assets/assets/privacy/privacy_nl.md": "4f3dce271d91a7dc7b884a15bfff918c",
"assets/assets/subjects/chemistry.svg": "dab3b7192f35e26c415ce7747c07a014",
"assets/assets/subjects/science.svg": "9dbb25e7fc10d23219447eb88d73a9e7",
"assets/assets/subjects/physics.svg": "7bf1ff157cb502e4577686417d5af24d",
"assets/assets/subjects/english.svg": "059ebd4c6ca16a039d2979d8ec0afac5",
"assets/assets/subjects/biology.svg": "d6fdc0a18f5dbbfc61272cce9565ae43",
"assets/assets/subjects/music.svg": "5b460bb839190a579ca808d701ba8eb1",
"assets/assets/subjects/history.svg": "87e4c3237d0a7de0ed988b6f6b6f7883",
"assets/assets/subjects/art.svg": "5bf10355edec4dd83bd9ee48db4b7ab0",
"assets/assets/subjects/geography.svg": "ca06a5293090cf34b624e6018dc84e29",
"assets/assets/subjects/language.svg": "f86350251fcde82f5b5bdaba52dae06e",
"assets/assets/subjects/literature.svg": "c830e6a62814dc1a18d2791ffa07e174",
"assets/assets/subjects/computer.svg": "2f2f72eaf7b9e0b03c955add3f47a4ce",
"assets/assets/subjects/math.svg": "df49ffe560d08297eebfdc3ab63adef7",
"assets/assets/subjects/pe.svg": "c84c8cd9bf5d413e015a63d1817dfab0",
"assets/assets/fonts/Inter-Regular.ttf": "a1c48d34ae1d9cf297b1e522e4ece60b",
"assets/assets/fonts/Inter-Variable.ttf": "7cb3faa88d8ea8661601dfbe2c0da2db",
"assets/assets/fonts/ArialUnicode.ttf": "08adce08054b4ba550495747b2dbbce5",
"assets/assets/icons/app_bar/support.svg": "c5a9729bc2fbcd9eec1eebbd72c97cc8",
"assets/assets/icons/app_bar/arrow_back.svg": "20e71ce09e3b2e5f9b3b5d562481f7cd",
"assets/assets/icons/app_bar/add.svg": "23887d0ce350e83781edfd9b0fe53187",
"assets/assets/icons/app_bar/person_add.svg": "e92bd9edd28495feeee1478efda5cd65",
"assets/assets/icons/app_bar/delete.svg": "b7976c45af758366e9104a5b27c20101",
"assets/assets/icons/app_bar/check.svg": "fced69b072accff36ceef2996154364c",
"assets/assets/icons/app_bar/person.svg": "1da059890c618d0c8e245fe6bf68b6d6",
"assets/assets/icons/app_bar/unarchive.svg": "79e6e4b5008d5493881345e158256562",
"assets/assets/icons/app_bar/admin.svg": "0b1dba875cf1b66790ed7ab22cb88e70",
"assets/assets/icons/app_bar/history.svg": "8b0eee252659b53e2a754157e83621ca",
"assets/assets/icons/app_bar/archive.svg": "62accfcbc2b6de8d7a1e359300286995",
"assets/assets/icons/app_bar/school.svg": "d8e9fb0b556e975aa2abdeb1bd51d796",
"assets/assets/icons/app_bar/edit.svg": "5139d586da09285a75d2633e5ddba47b",
"assets/assets/icons/app_bar/save.svg": "d9dbcf81e02ca229d856acd1bdcd10ba",
"assets/assets/icons/app_bar/settings.svg": "c242054cac7b59228cf2d4c4a922c12b",
"assets/assets/icons/oauth/apple.svg": "5f76854ae32707fac3d8118c24811c21",
"assets/assets/icons/oauth/microsoft.svg": "f36b107d4c70d111919080c50ca804f5",
"assets/assets/icons/oauth/google.svg": "1fa587e336d8f5e66e60596034fa6dca",
"assets/assets/icons/oauth/github.svg": "117df22648492dbf629d476dde8598f0",
"assets/assets/icons/bolt.svg": "cb8e76c0075148ae00b924b7ae32b8ee",
"assets/assets/images/family_silhouette.svg": "3fddd94939842b819e9e85fff15110a9",
"assets/assets/images/empty_state_hammock.svg": "b2b44f5c8ac6b38cb7732f303dd4a0a8",
"assets/FontManifest.json": "d6c6afd197d91d66876020651d35bed1",
"assets/NOTICES": "42366399990e3ab2d9f7be01231fbb16",
"flutter.js": "888483df48293866f9f41d3d9274a779"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
