import type { DiepteDocument } from './types';

/**
 * The Andaism reference text in Turkish. The prayer to Mengü was written in
 * Turkish, so this locale shows it once, in its original form, and has no
 * translated prayer section.
 */
export const tr: DiepteDocument = {
  locale: 'tr',
  title: 'Andaizm',
  lead: [
    {
      type: 'paragraph',
      text: '**Andaizm**, **Mengü** ya da **Sonsuz Gökyüzü** etrafında şekillenen modern bir dini ve felsefi gelenektir. Mengü kişisel bir tanrı olarak değil, her yerde var olan kutsal bir gerçeklik olarak anlaşılır: doğanın, düşüncenin, yaşamın, ölümün, topluluğun ve insan kavrayışının ötesindeki bilinmeyenin sonsuzluğu.',
    },
    {
      type: 'paragraph',
      text: 'Gelenek, yemin ya da ant anlamına gelen **and** kelimesinden türeyen, yemine dayalı bir sistem olan **Ands** üzerine kuruludur. Andaizmde inanç, sabit dogmalardan çok tekrarlanan yeminlerle dile gelir: onurla yaşamak, gözlerini Mengü’den ayırmamak, belirsizliği kabullenmek, doğaya saygı duymak, korunmaya muhtaç olanları korumak ve iyiye dönmeyi sürdürmek.',
    },
    {
      type: 'paragraph',
      text: 'Andaizmin ayırt edici bir özelliği, dini belirsizliği kabul etmesidir. Hiçbir insanın Tanrı, ölüm, varoluş ya da hayatın anlamı hakkındaki nihai gerçeği tam olarak bilemeyeceğini öğretir. Bu da Andaizme agnostik bir karakter kazandırır: **Anda** kesinliğe ulaştığı için değil, inanç, yemin ve ritüel bilinmeyenin altında anlamla ve iç huzurla yaşamanın bir yolunu sunduğu için and içer.',
    },
    {
      type: 'paragraph',
      text: 'Andaizmin bağlılarına **Anda** denir. Manevi önderlerine **Onba**, ibadet evlerine ise “Gök Evi” anlamına gelen **Gökevi** adı verilir.',
    },
  ],
  parts: {
    foundations: 'Temeller',
    'oath-and-texts': 'Yemin ve metinler',
    'six-pillars': 'Altı Sütun',
    'prayer-and-ritual': 'Dua ve ritüel',
    community: 'Topluluk',
    'ethics-and-life': 'Ahlak ve yaşam',
    origins: 'Kökenler',
  },
  sections: {
    overview: {
      title: 'Genel bakış',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm; din, yaşam felsefesi, yemin geleneği, doğaya saygı, müzik, topluluk ritüeli, bilimle barışık düşünce ve varoluşsal düşünümü bir araya getirir. İnsanların nihai gerçeği bilmediğini kabul ederek başlar, ama yine de anlama, yöne, huzura ve aidiyete ihtiyaç duyduklarını bilir.',
        },
        {
          type: 'paragraph',
          text: 'Belirsizliğe verdiği temel yanıt geri çekilmek, umutsuzluğa kapılmak ya da katı bir kesinliğe sarılmak değildir. Yanıtı yemin ve yaşamdır.',
        },
        {
          type: 'quote',
          lines: [
            '**Haydi yaşayalım!**',
          ],
        },
        {
          type: 'paragraph',
          text: 'Bu söz Andaizmin temel tutumlarından birini dile getirir: hayat gizemini koruduğuna göre, ona verilecek doğru yanıt onurla, açıklıkla, cesaretle ve bağ kurarak yaşamaktır.',
        },
        {
          type: 'paragraph',
          text: 'Andaizm insanın kusursuz olması gerektiğini öğretmez. Bir Anda yeminini bozabilir, bir ilkeye uymayı başaramayabilir ya da yönünü kaybedebilir. Önemli olan, Anda’nın Ands’e geri dönüp dönmediğidir. Kimse kusursuz olmadığından, dönüş bu geleneğin merkezinde yer alır.',
        },
      ],
    },
    etymology: {
      title: 'Köken ve terimler',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin temel terimleri şunlardır:',
        },
        {
          type: 'paragraph',
          text: '**Mengü**: Sonsuz Gökyüzü; varoluşun içindeki ve çevresindeki kutsal sonsuzluk.',
        },
        {
          type: 'paragraph',
          text: '**And**: tek bir yemin ya da ant.',
        },
        {
          type: 'paragraph',
          text: '**Ands**: Andaizmin yemine dayalı sistemi; aynı zamanda resmi metinlerin, yeminlerin, duaların ve öğretilerin bütünü.',
        },
        {
          type: 'paragraph',
          text: '**Anda**: Andaizme bağlı olan kişi.',
        },
        {
          type: 'paragraph',
          text: '**Onba**: manevi önder, rehber ya da din adamı niteliğinde bir kişi.',
        },
        {
          type: 'paragraph',
          text: '**Gökevi**: ibadet evi ya da Gök Evi.',
        },
        {
          type: 'paragraph',
          text: '**Esen**: huzur, esenlik ve iyi dilek taşıyan bir selam ya da hayır dua.',
        },
        {
          type: 'paragraph',
          text: '**And** kelimesi yemin ya da ant anlamıyla bağlantılıdır. Andaizmde bu fikir dini yaşamın temeli olur. Kişi yalnızca inancını beyan etmez, Mengü’nün altında hayatına bir yön vermeye and içer.',
        },
      ],
    },
    mengu: {
      title: 'Mengü',
      blocks: [
        {
          type: 'paragraph',
          text: '**Mengü**, yani Sonsuz Gökyüzü, Andaizmin merkezindeki kutsal kavramdır. Yalnızca fiziksel gökyüzü değil, sonsuzluğun kendisinin adıdır.',
        },
        {
          type: 'paragraph',
          text: 'Mengü; evreni, doğayı, düşünceyi, belleği, ölümü, sevgiyi, korkuyu, belirsizliği, zamanı ve insan kavrayışını aşan her şeyi kapsar. İnsanın üstündedir, ama aynı zamanda insanın içindedir.',
        },
        {
          type: 'paragraph',
          text: 'Bu yüzden Andaizm, gerçek yargının toplumdan, utançtan, dedikodudan ya da kamuoyundan gelmediğini öğretir. Yalnızca Mengü yargılayabilir.',
        },
        {
          type: 'paragraph',
          text: 'Bu yargı göksel bir mahkeme değil, kişinin Ands’e dönmeyi sürdürüp sürdürmediğinin ölçüsüdür. Her içten dönüş Anda’yı Mengü’ye ve sonsuz olmaya biraz daha yaklaştırır.',
        },
        {
          type: 'paragraph',
          text: 'Andalar için Mengü hem kozmik hem de içtendir: dünyanın üzerindeki enginlik ve benliğin içindeki sessiz tanık.',
        },
      ],
    },
    ands: {
      title: 'Ands',
      blocks: [
        {
          type: 'paragraph',
          text: '**Ands**, Andaizmin merkezindeki, yemine dayalı sistemdir. Yemin ya da ant anlamına gelen **and** kelimesi üzerine kuruludur.',
        },
        {
          type: 'paragraph',
          text: 'Bir **and**, Mengü’nün altında verilen kutsal bir sözdür. **Ands** ise bu yeminlerin oluşturduğu daha geniş yapıdır. Kişi Ands aracılığıyla hayatına yön verir.',
        },
        {
          type: 'paragraph',
          text: 'Esas olarak inanç beyanlarına odaklanan dini sistemlerin aksine, Andaizm yeminle bağlanmış niyete odaklanır. Anda yalnızca neye inandığını söylemez. Nasıl yaşamak istediğine and içer.',
        },
        {
          type: 'paragraph',
          text: 'Ands katı bir hukuk düzeni değildir. Bir dönüş yapısıdır. Bir Anda yeminini bozduğunda amaç kalıcı bir suçluluk değil, fark etmek, onarmak ve geri dönmektir.',
        },
        {
          type: 'paragraph',
          text: 'Başarısızlığın ardından Ands’e dönmek Andaizmdeki en önemli eylemlerden biridir. Gelenek kimsenin kusursuz olmadığını ve bir hayatın yönünün tek bir düşüşten daha önemli olduğunu öğretir.',
        },
      ],
    },
    'becoming-endless': {
      title: 'Sonsuz olmak',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin temel amaçlarından biri **sonsuz olmaktır**. Bu, geleneğin ana öğretilerinden biri ve Ands’i izlemenin başlıca amaçlarından biridir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizmde sonsuz olmak, bedenen ölümsüzleşmek, kusursuzlaşmak ya da başkalarından üstün olmak demek değildir. Anda’nın ölümden kaçacağına, tanrısallaşacağına ya da sıradan hayatın ötesinde kusursuz bir hâle ulaşacağına dair bir vaat değildir. Sonsuz olmak, benliği korkunun, utancın, egonun, yalnızlığın ve sahte kesinliğin ötesine genişleterek Mengü’ye yaklaşmak demektir.',
        },
        {
          type: 'paragraph',
          text: 'Andalar için hayat, insanın gerçekten bildiği tek şeydir. Başka hayatlar, âlemler, dünyalar ya da varoluş hâlleri olabilir, ama Andaizm kimsenin bunu kesin olarak bilemeyeceğini öğretir. Bu yüzden Andaizmin odağı bu hayattan kaçmak değil, onun içinde daha tam var olmaktır. Anda burada, şimdi, Mengü’nün altında yaşamaya çağrılır.',
        },
        {
          type: 'paragraph',
          text: 'Bu, sonsuz olmaya pratik bir anlam kazandırır. Sonsuz olmak yalnızca ölüm ya da sonsuzluk hakkında bir öğreti değildir. Gündelik hayatta daha az korkuyla yaşamanın da bir yoludur. İnsanlar çoğu zaman başarısızlığın, utancın, yargılanmanın, belirsizliğin, pişmanlığın ve varoluşun kendisine duyulan korkunun ağırlığı altında acı çeker. Andaizm bu yüklerin her zaman kusursuz yanıtlarla çözülemeyeceğini öğretir. Bu yükler, Ands’e dönüldükçe hafifler.',
        },
        {
          type: 'paragraph',
          text: 'Sonsuz olmak, bu korkuların pençesini gevşetmektir. Tek bir kötü günün bir hayatı tanımlamadığını, başarısızlığın yolun bir parçası olduğunu, belirsizliğin bir düşman olmadığını ve başkalarının görüşlerinin benliğin son ölçüsü olmadığını kavramaktır. Anda insani zayıflıktan kaçarak değil, onunla barış içinde yaşamayı öğrenerek sonsuz olur.',
        },
        {
          type: 'paragraph',
          text: 'Ands bu sonsuzluğa giden yoldur. Her yemin yön verir. Her dua bir dönüştür. Dik durmaya, korunmaya muhtaç olanları korumaya, doğaya saygı duymaya, belirsizliği kabullenmeye, verilen zararı onarmaya ve açık bir yürekle yaşamaya yönelik her içten çaba Anda’yı Mengü’ye yaklaştırır.',
        },
        {
          type: 'paragraph',
          text: 'Bu yüzden sonsuz olmak hem manevi hem de psikolojiktir. Manevi açıdan Mengü’ye yaklaşmak ve doğayla, düşünceyle, toplulukla, dünyayla ve varoluşla daha çok bütünleşmek demektir. Psikolojik açıdan stresin, utancın, korkunun ve mutlak kesinlik ihtiyacının daha az tutsağı olmak demektir. Anda bilinmeyenin içinde nefes almayı öğrenir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizmde sonsuz olmak hayattayken başlayabilir. Huzur, cesaret, müzik, doğa, dua, bağışlama, konukseverlik ve derin bağ anlarında yaşanır. Kişi kendi belirsizliğiyle savaşmayı bıraktığında, başarısızlığın ardından özür dilediğinde, kendinden zayıf birini koruduğunda, korkunun ardından dik durduğunda ya da gökyüzünün altına oturup kendinden daha geniş bir şeyin parçası olduğunu hissettiğinde duyulabilir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizm, ölümden sonra kişinin Mengü’ye döndüğünü öğretir. Ayrı benlik Sonsuz Gökyüzü’nde çözülür. Ama ölümün ötesindeki gelecek kesin olarak bilinemediği için Andaizm Anda’dan yalnızca başka bir dünya için yaşamasını istemez. Bu hayatı dolu dolu, dürüstçe ve huzurla yaşamasını ister.',
        },
        {
          type: 'paragraph',
          text: 'Sonsuz olmak hayatı geride bırakmak değildir. Hayatı öylesine derin yaşamaktır ki benlik korkusundan daha geniş olur.',
        },
      ],
    },
    uncertainty: {
      title: 'Belirsizlik',
      blocks: [
        {
          type: 'paragraph',
          text: 'Belirsizlik Andaizmi tanımlayan öğelerden biridir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizm, hiçbir insanın varoluşun neden var olduğunu, ölümden sonra ne olduğunu, Tanrı’nın var olup olmadığını ya da Andaizmin kendisinin doğru olup olmadığını mutlak bir kesinlikle kanıtlayamayacağını öğretir. Mengü bile, tam olarak bilinemeyecek bir şeye verilmiş kusurlu bir insan adı olabilir.',
        },
        {
          type: 'paragraph',
          text: 'Bu belirsizlik bir zayıflık sayılmaz. Geleneğin bir parçası ve yeminin bir parçasıdır.',
        },
        {
          type: 'paragraph',
          text: 'Anda her şüphe ortadan kalktığı için and içmez. Şüpheyi kabul ederek and içer ve inancı bilinmeyenin altında anlamlı bir yol olarak seçer.',
        },
        {
          type: 'paragraph',
          text: 'Bu da Andaizme agnostik bir renk verir. İnanç nihai bilginin sahipliği olarak değil, seçilmiş bir yöneliş olarak sunulur: dünyaya anlam vermenin, iç huzuru bulmanın ve sorumlu yaşamanın bir yolu.',
        },
        {
          type: 'paragraph',
          text: 'Bu yüzden Andaizm, büyük ölçüde nihai kesinlik konusundaki tekelci iddialara dayanan geleneklerden ayrılır. İnancın ve şüphenin bir arada var olmasına izin verir. Bir Anda nihai gerçeğin bilinmediğini kabul ederken bile derinden inanabilir.',
        },
      ],
    },
    texts: {
      title: 'Metinler',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin resmi metinlerine **Ands** denir. Bu nedenle terim hem yemine dayalı sistemi hem de öğrenimde, duada ve ritüelde kullanılan kutsal ya da resmi metinlerin yaşayan bütününü ifade eder.',
        },
        {
          type: 'paragraph',
          text: 'En önemli metin, Andaizmin merkezi yemini olan **ana And**’dır. Ana And’ın yanı sıra başka andlar da yazılabilir, eklenebilir, incelenebilir ve dua oturumlarında, okumalarda, düşünüm anlarında ve Gökevi’ndeki buluşmalarda kullanılabilir.',
        },
        {
          type: 'paragraph',
          text: 'Bu, Andaizmi yaşayan bir metin geleneği yapar. Metinlerine saygı duyulur, ama onlar birer hapishane olarak görülmez. Belirsizlik geleneğin bir parçası olduğundan Ands büyümeyi sürdürebilir; yeter ki yeni metinler Mengü, dönüş, açıklık, doğa, içtenlik ve sonsuz olma gibi temel ilkelerle uyumlu kalsın.',
        },
      ],
    },
    'the-main-and': {
      title: 'Ana And',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin temel kişisel yeminine **And** denir.',
        },
        {
          type: 'paragraph',
          text: 'And’ın Türkçedeki yaygın biçimi şöyledir:',
        },
        {
          type: 'quote',
          lines: [
            'Göçebe olacağıma, kalbimi herkese açacağıma ant içerim.',
            '',
            'Gözlerim Sonsuz Gökyüzünde, omuzlarım dik; onurlu, sağlıklı bir beden ve berrak bir zihinle yaşayacağıma ant içerim.',
            '',
            'Sonsuzlukla bir olacağıma ant içerim.',
            '',
            'Belirsizlikle yaşamayı öğreneceğime ant içerim.',
            '',
            'Doğaya saygı duyacağıma ve dünyayı daha yeşil bırakacağıma ant içerim.',
            '',
            'Kırışıklıklarımı ve çatlaklarımı saklamayacağıma; bunun beni eksiltmediğine, sadece çoğalttığına ant içerim.',
            '',
            'Ant içerim.',
            'Ant içerim.',
            'Ant içerim.',
          ],
        },
        {
          type: 'paragraph',
          text: 'And tek başına, bir Onba’nın önünde, bir Gökevi’nde ya da bir topluluk töreninde söylenebilir. Bağlayıcılığını dışarıdan bir yaptırımdan değil, içtenlikten alır.',
        },
      ],
    },
    'becoming-anda': {
      title: 'Anda olmak',
      blocks: [
        {
          type: 'paragraph',
          text: 'Kişi ana And’ı söyleyip ardından bir **Gökevi**’ne giderek **Anda** olur.',
        },
        {
          type: 'paragraph',
          text: 'Bunun için bir Onba gerekmez. Yemin, Mengü’nün altında insanın kendisiyle yaptığı bir ahittir; bu yüzden yeminin geçerli olması için kişinin yanında bir manevi önderin durmasına gerek yoktur.',
        },
        {
          type: 'paragraph',
          text: 'Bu, Andaizmin temel bir inancını yansıtır: anlam kişiye dışarıdan zorla verilemez. Benliğin içinde karşılaşılması gerekir. Topluluk tanıklık edebilir, kucaklayabilir ve destek olabilir, ama yemin onu söyleyen kişiye aittir.',
        },
        {
          type: 'paragraph',
          text: 'İnsanlar And’ı resmi olarak içmeden önce de Gökevi buluşmalarına katılabilir, Ands’i inceleyebilir, Andalar ya da Onba ile konuşabilir ve topluluk hayatına katılabilir.',
        },
      ],
    },
    'daily-practice': {
      title: 'Günlük uygulama',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andalar her gün Ands’e dönmeye teşvik edilir.',
        },
        {
          type: 'paragraph',
          text: 'Yaygın bir uygulama düzeni şöyledir:',
        },
        {
          type: 'list',
          ordered: false,
          items: [
            'sabah uyandıktan sonra;',
            'gece uyumadan önce;',
            'tercihen öğleden sonra da bir kez.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Bu anlar dua, bir andın okunması, Altı Sütun üzerine düşünme, sessizlik, müzik ya da yeminin yalın bir biçimde yenilenmesini içerebilir. Amaç kusursuzluk sergilemek değil, yöne geri dönmektir.',
        },
        {
          type: 'paragraph',
          text: 'Günlük uygulama Anda’nın Mengü’yü hatırlamasına, belirsizliği tanımasına, korkuyu gevşetmesine ve sonsuz olmaya doğru çabalamayı sürdürmesine yardım eder.',
        },
      ],
    },
    'six-pillars': {
      title: 'Ands’in Altı Sütunu',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin ahlaki ve manevi yaşamı altı sütun üzerine kuruludur. Bunlar katı, hukuki anlamda emirler değil, bir Anda’nın tekrar tekrar döndüğü yönlerdir.',
        },
        {
          type: 'paragraph',
          text: 'Altı Sütun şunlardır:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Göçebelik**',
            '**Düz Bir Sırt**',
            '**Sonsuzluk**',
            '**Belirsizlik**',
            '**Doğaya Saygı**',
            '**İplik Olarak Niyet**',
          ],
        },
        {
          type: 'paragraph',
          text: 'Birlikte bir Anda’nın yolunu anlatırlar: açıklık, onur, alçakgönüllülük, doğa, sorumluluk ve süren niyet.',
        },
      ],
    },
    nomadism: {
      title: 'Göçebelik',
      blocks: [
        {
          type: 'paragraph',
          text: '**Göçebelik** Ands’in birinci sütunudur.',
        },
        {
          type: 'paragraph',
          text: 'Andaizmde göçebelik yalnızca bedenen dolaşmak anlamına gelmez. Açık bir yüreği ve hareket hâlindeki bir zihni ifade eder. Göçebe farklı kültürlere, insanlara, ülkelere, geleneklere, fikirlere ve yollara açık kalır.',
        },
        {
          type: 'paragraph',
          text: 'Göçebelik sadeliği de öğretir. Bir göçebe bir dilim ekmekle yaşayabilir, ama dolu bir sofranın da tadını çıkarabilir. Göçebe yürek, kendini yitirmeden birden fazla yere ait olabilir.',
        },
        {
          type: 'paragraph',
          text: 'Andalar için göçebelik, ruhen kapana kısılmayı reddetmektir. Yürek çevresine dar gelmeye başladığında yeni bir yol açılmalıdır.',
        },
      ],
    },
    'straight-back': {
      title: 'Düz Bir Sırt',
      blocks: [
        {
          type: 'paragraph',
          text: '**Düz Bir Sırt** Ands’in ikinci sütunudur.',
        },
        {
          type: 'paragraph',
          text: 'Onuru, cesareti, dürüstlüğü, disiplini, beden sağlığını ve zihin gücünü temsil eder. Çoğu zaman şu imgeyle özetlenir:',
        },
        {
          type: 'quote',
          lines: [
            'Omuzların dik.',
            'Göğsün ileri.',
            'Gözlerin Mengü’de.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Düz Bir Sırt kibir ya da duygusal katılık anlamına gelmez. Onur demektir. Korktuğunda, utandığında, emin olamadığında ya da yaralandığında bile dik durmak demektir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizmde güç, insanın kendi içindeki zayıflık da dahil olmak üzere zayıflığı korumaya gönüllü olmayı içerir.',
        },
      ],
    },
    infinity: {
      title: 'Sonsuzluk',
      blocks: [
        {
          type: 'paragraph',
          text: '**Sonsuzluk** Ands’in üçüncü sütunudur.',
        },
        {
          type: 'paragraph',
          text: 'Sonsuzluk, gerçekliğin tek bir insandan, tek bir ulustan, tek bir dinden, tek bir gezegenden ya da tek bir fikirden daha büyük olduğunu öğretir. Dünya tek gezegen değildir ve insanın hakikati tek bir gelenekle bitmez.',
        },
        {
          type: 'paragraph',
          text: 'Bu yüzden Andaizm, insanların Sonsuz Gökyüzü’ne pek çok yoldan yaklaşabileceğini öğretir: tek bir Tanrı’ya ya da birçok tanrıya inançla, felsefeyle, bilimle, müzikle, doğayla, sanatla, sessizlikle, meditasyonla, hatta inançsızlıkla.',
        },
        {
          type: 'paragraph',
          text: 'Anda başkalarından üstün değildir, ama aşağı da değildir. Her insan aynı Sonsuz Gökyüzü’nün altında yaşar.',
        },
      ],
    },
    'reverence-for-nature': {
      title: 'Doğaya Saygı',
      blocks: [
        {
          type: 'paragraph',
          text: '**Doğaya Saygı** Ands’in beşinci sütunudur.',
        },
        {
          type: 'paragraph',
          text: 'Andaizm, insanın doğanın bir parçası, doğanın da insanın bir parçası olduğunu öğretir. Ağaçlar, toprak, hayvanlar, rüzgâr, su, taş, mevsimler ve sessizlik yalnızca bir manzara değildir. İnsanın kendini tanıyabileceği aynalardır.',
        },
        {
          type: 'paragraph',
          text: 'Bir ağaca dokunup gözlerini kapatmak yalın bir manevi eylem olabilir. Doğada yürüyüş çoğu zaman sessizlik ya da yalnızlık içinde tercih edilir; bu, Anda’nın Mengü’yü daha açık hissetmesini sağlar.',
        },
        {
          type: 'paragraph',
          text: 'Doğa her acının çaresi gibi yüceltilmez. Teselli edebilir, ama insanı kendisiyle yüzleştirebilir de. Yine de insanın akrabası olarak kalır.',
        },
        {
          type: 'paragraph',
          text: 'Bu sütun ekolojik bir görev içerir:',
        },
        {
          type: 'quote',
          lines: [
            'Dünyayı bulduğundan daha yeşil bırak.',
          ],
        },
      ],
    },
    'intention-as-thread': {
      title: 'İplik Olarak Niyet',
      blocks: [
        {
          type: 'paragraph',
          text: '**İplik Olarak Niyet** Ands’in altıncı sütunudur.',
        },
        {
          type: 'paragraph',
          text: 'Bu sütun, hiçbir insanın çatlaksız yaşamadığını öğretir. İnsanların yaraları, kötü günleri, utançları, öfkeleri, başarısızlıkları, ayartılmaları, kafa karışıklıkları ve tekrar düştükleri anlar vardır. Andaizm bunları bir insanın değersiz olduğunun kanıtı saymaz.',
        },
        {
          type: 'paragraph',
          text: 'Kusursuzluk hatasızlık değildir. Kusursuzluk, süren niyettir.',
        },
        {
          type: 'paragraph',
          text: 'Niyet, insanın çatlaklarının arasından geçen ve onu yeniden iyiye doğru getiren ipliktir. İnsan tek bir düşüşle değil, yeniden kalkmayı sürdürdüğü yönle tanımlanır.',
        },
        {
          type: 'paragraph',
          text: 'Çatlak utanç değildir. Çatlak tarihtir.',
        },
      ],
    },
    prayer: {
      title: 'Dua',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmde dua Ands ile yakından bağlantılıdır. Pek çok dua esas olarak Mengü’den bir şey dilemek olarak değil, Mengü’nün altında tekrarlanan yeminler olarak kurulur.',
        },
        {
          type: 'paragraph',
          text: 'Anda yalnızca yardım için dua etmez. Farklı yaşamaya and içer.',
        },
        {
          type: 'paragraph',
          text: 'Bu, Andaist duayı edilgen değil etkin kılar. Dua bir hizalanma ritüelidir: dua eden kişi kendini Mengü’nün önüne koyar ve yaşamak istediği yönü yineler.',
        },
        {
          type: 'paragraph',
          text: 'Andalar kendi dillerinde dua eder. Andaizmde zorunlu tek bir kutsal dil yoktur. Dua Türkçe, İngilizce, Felemenkçe ya da başka herhangi bir dilde edilebilir. Anlam, varlık ve niyet dilin kendisinden daha önemli sayılır.',
        },
      ],
    },
    'prayer-to-mengu': {
      title: 'Mengü’ye Dua',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin temel dualarından biri ilk olarak Türkçe yazılmıştır. Mengü’ye bir selam, bir dizi yemin, korkunun dile getirildiği bir eğilme anı ve dürüstlüğün, korumanın, birliğin ve yaşamın dik durarak dile getirildiği bir onaylama içerir.',
        },
      ],
    },
    'prayer-original': {
      title: 'Özgün metin',
      blocks: [
        {
          type: 'quote',
          lang: 'tr',
          lines: [
            'Hoş geldin Mengü.',
            'Gözlerimi sonsuz gökyüzünden ayırmayacağıma and içerim.',
            'Dik duracağıma, and içerim.',
            'Duru bir usla, sağlıklı yaşayacağıma, and içerim.',
            'Göçebe gibi yüreğimi bütün evrene açacağıma, and içerim.',
            'Düşünce başkasının değil, düşünce ben olduğunu, and içerim.',
            '',
            'Eğiliyoruz.',
            'Korkularını söyle....',
            '',
            'Sonra dik durarak:',
            '',
            'Dik duracağız.',
            'Dürüst olacağız.',
            'Güçsüz olanları, özümüz dahil, koruyacağız.',
            '',
            'Haydi sonsuz olalım, Andalar!',
            'Haydi bir olalım, Andalar!',
            'Haydi yaşayalım, Andalar!',
          ],
        },
      ],
    },
    'prayer-translated': null,
    'ritual-movement': {
      title: 'Ritüel hareket',
      blocks: [
        {
          type: 'paragraph',
          text: 'Mengü’ye Dua iki temel beden hareketi içerir: eğilmek ve dik durmak.',
        },
        {
          type: 'paragraph',
          text: 'Eğilme anı bir aşağılanma eylemi değildir. Bir dürüstlük eylemidir. Anda korkuyu, belirsizliği, acıyı, utancı ya da zayıflığı kabul etmek için eğilir. Bazı törenlerde katılımcılar korkularını yüksek sesle ya da içinden söyleyebilir.',
        },
        {
          type: 'paragraph',
          text: 'İkinci hareket dik durmaktır. Korku kabul edildikten sonra Anda doğrulur. Kişi korku ortadan kalktığı için değil, korku tanındığı için ayağa kalkar.',
        },
        {
          type: 'paragraph',
          text: 'Bu hareket Andaizmin temel örüntülerinden birini dile getirir:',
        },
        {
          type: 'quote',
          lines: [
            'İçindekini tanı.',
            'Sonra dik dur.',
          ],
        },
      ],
    },
    gokevi: {
      title: 'Gökevi',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin ibadet evine “Gök Evi” anlamına gelen **Gökevi** denir.',
        },
        {
          type: 'paragraph',
          text: 'Bir Gökevi genellikle sıcak, ortak, yurt benzeri bir mekân olarak düşünülür. Yer halıyla kaplıdır ve ziyaretçiler içeri girmeden önce ayakkabılarını çıkarır. Ortam huzurlu, konuksever ve samimidir.',
        },
        {
          type: 'paragraph',
          text: 'Gökevi dua, müzik, sohbet, yemek, içmek, öğrenim, barışma ve topluluk hayatı için kullanılır. Yalnızca kutsal bir yapı değil, bir aidiyet evidir.',
        },
        {
          type: 'paragraph',
          text: 'Gökevi yalnızca Andalara değil; konuklara, arayanlara, başka dinlerden insanlara ve inanmayanlara da açıktır.',
        },
      ],
    },
    'friday-ceremony': {
      title: 'Cuma töreni',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cuma, Andaizmin kutsal topluluk günüdür. Andalar dua, müzik, düşünüm, öğrenim ve konukseverlik için Gökevi’nde buluşur.',
        },
        {
          type: 'paragraph',
          text: 'Bir tören **Esen** ile selamlaşmayı, sessizliği ya da hafif bir müziği, Mengü’ye Dua’yı, eğilme anını, korkuların dile getirilmesini, dik durmayı, ortak onaylamayı, şarkıyı ya da çalgı müziğini, And’ın okunmasını ve ardından yiyecek ya da içecek ikramını içerebilir.',
        },
        {
          type: 'paragraph',
          text: 'Törenin ardından gelen sohbet ve buluşma dini eylemden ayrı sayılmaz. Andaizmde konukseverliğin kendisi kutsaldır.',
        },
      ],
    },
    music: {
      title: 'Müzik',
      blocks: [
        {
          type: 'paragraph',
          text: 'Müzik Andaizmde merkezi bir rol oynar.',
        },
        {
          type: 'paragraph',
          text: 'Andaist müzik **bağlama** ve **kopuz** gibi çalgılardan ilham alır. Gırtlak şarkısının huzurlu biçimleri de yer alabilir. Gırtlak şarkısının savaşçı ya da sert biçimlerinin aksine, Andaist ses ifadesi meditatif, topraktan ve topluluğa dönüktür.',
        },
        {
          type: 'paragraph',
          text: 'Müzik birliğe giden bir yol sayılır. Ritim, ses ve ortak nefes aracılığıyla Anda toplulukla, doğayla, düşünceyle ve Mengü’yle daha derin bir bağ kurabilir.',
        },
      ],
    },
    onba: {
      title: 'Onba',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmin manevi önderlerine **Onba** denir.',
        },
        {
          type: 'paragraph',
          text: 'Bir Onba’dan manevi açıdan ciddi, onurlu, yardımsever ve toplulukta etkin olması beklenir. Bir Onba öğretebilir, duaya önderlik edebilir, ailelere destek olabilir, anlaşmazlıklarda arabuluculuk yapabilir, metinleri koruyabilir, topluluğa danışmanlık edebilir ve insanların başarısızlık ya da zorluk sonrasında Ands’e dönmesine yardım edebilir.',
        },
        {
          type: 'paragraph',
          text: 'Bir Onba’nın bir ruhu mahkûm etme yetkisi yoktur. Gerçekten yalnızca Mengü yargılayabilir. Bu yüzden Onba’nın rolü egemenlik değil, rehberliktir.',
        },
      ],
    },
    'ranks-of-onba': {
      title: 'Onba dereceleri',
      blocks: [
        {
          type: 'paragraph',
          text: 'Onba sorumluluk düzeylerine göre örgütlenebilir. Unvanların tam adları değişebilir, ama yapı egemenliğe değil; hizmete, güvene ve manevi olgunluğa dayanır.',
        },
        {
          type: 'paragraph',
          text: 'Olası bir yapı şöyledir:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Birinci Onba**: duada, öğrenimde ve topluluğun gözetiminde yardımcı olan, tanınmış bir manevi hizmetkâr.',
            '**Yüce Onba**: öğretimde, törende ve rehberlikte daha büyük sorumluluk taşıyan, güvenilir bir önder.',
            '**Ulu Onba**: uzun hizmeti, bilgeliği ve kendisine duyulan derin güvenle tanınan kıdemli bir manevi önder.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Yüksek derece kişisel bir üstünlük olarak anlaşılmaz. Daha ağır bir hizmet biçimidir.',
        },
      ],
    },
    safeguarding: {
      title: 'Koruma ve kötüye kullanım',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm tarikat davranışını, zorlamayı, yozlaşmayı ve manevi gücün kötüye kullanılmasını reddeder.',
        },
        {
          type: 'paragraph',
          text: 'Onba ve topluluktaki diğer kişilerden egemenlik kurmaları değil, hizmet etmeleri beklenir. Manevi otoritelerini cinsel erişim, manipülasyon, maddi sömürü ya da bir başkasının hayatı üzerinde denetim kurmak için kullanamazlar.',
        },
        {
          type: 'paragraph',
          text: 'Bu tür davranışlar Andaizmin ağır bir ihlali sayılır ve derhal resmi makamlara bildirilmelidir. Andaizmde manevi önderlik yasaların üstünde değildir.',
        },
      ],
    },
    ethics: {
      title: 'Ahlak',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizmde, bazı başka dinlerde bulunduğu biçimde bir **günah** öğretisi yoktur. Yanlış davranış kalıcı bir manevi leke ya da ilahi bir mahkemede tartılacak bir borç olarak anlaşılmaz.',
        },
        {
          type: 'paragraph',
          text: 'Yine de Andaizm iyiyi ve kötüyü inkâr etmez. Cinayet, zulüm, ihanet, aşağılama ve istismar gibi eylemler derinden yanlış sayılır. Andaizm, hayatı doğal bir kavrayışla anlayan her insanın doğru ile yanlışa dair bir farkındalığı zaten taşıdığını öğretir.',
        },
        {
          type: 'paragraph',
          text: 'Fark şudur: Andaizm ahlaki yaşamı bir süreç olarak ele alır. İnsanların iyi günleri ve kötü günleri olur. Acıdan, korkudan, öfkeden, kafa karışıklığından, arzudan ya da zayıflıktan hareket ederler. Bu başarısızlıklar bir insanı değersiz kılmaz.',
        },
        {
          type: 'paragraph',
          text: 'Önemli olan zaman içindeki niyettir. Kişi içtenlikle daha iyi olmayı istiyor, verdiği zararı fark ediyor, gerektiğinde özür diliyor, onarılabilecek olanı onarıyor ve iyiye dönüyorsa, niyetin ipliği kopmaz.',
        },
      ],
    },
    passion: {
      title: 'Tutku ve mizaç',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm tutkuyu, mizacı, yoğunluğu ve ateşi canlı olmanın bir parçası olarak kabul eder.',
        },
        {
          type: 'paragraph',
          text: 'Bir insan yoğun, dışa dönük, duygusal ve hırslı olabilir. Tutku kendi başına yanlış sayılmaz. İnsanın içinden akan hayatın bir işaretidir.',
        },
        {
          type: 'paragraph',
          text: 'Tutku zarara yol açarsa Anda bunu fark etmeli, üzerine düşünmeli, özür dilemeli ve onarmalıdır. Ama mizacın kendisi kınanmaz. Mengü’nün altında insan olma sürecine aittir.',
        },
      ],
    },
    hospitality: {
      title: 'Konukseverlik ve diğer dinler',
      blocks: [
        {
          type: 'paragraph',
          text: 'Konukseverlik Andaizmin temel erdemlerinden biridir.',
        },
        {
          type: 'paragraph',
          text: 'Gökevi yalnızca Andalara değil, başka dinlerden insanlara ve inanmayanlara da açıktır. Andaizm belirsizliği kabul ettiği için diğer bütün dinlerin yanlış olması gerektiğini iddia etmez.',
        },
        {
          type: 'paragraph',
          text: 'Andalar Hristiyanlarla, Müslümanlarla, Yahudilerle, Hindularla, Budistlerle, Tengricilerle, ateistlerle, agnostiklerle ve başkalarıyla konuşabilir. Saygıyla davrandıkları sürece başka dinlerin evlerinde meditasyon yapabilir ya da dua edebilirler.',
        },
        {
          type: 'paragraph',
          text: 'Bu açıklık, bütün insanların gökyüzünün çocukları olduğu inancından gelir.',
        },
      ],
    },
    'science-technology-ai': {
      title: 'Bilim, teknoloji ve yapay zekâ',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm bilimi, öğrenmeyi ve bilgiye katkıda bulunmayı güçlü biçimde teşvik eder. Andalara kanıta dayalı bilgiye saygı duymaları ve bilimsel bulgular dini ifadeler ya da yorumlarla çeliştiğinde bilimi seçmeleri öğretilir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizmde yaygın bir ilke şudur: Andaizmin sözleri bilimle uyuşmuyorsa bilim seçilmelidir. Bu, geleneğin belirsizliği kabul edişini ve hakikatten korkulmaması gerektiği inancını yansıtır.',
        },
        {
          type: 'paragraph',
          text: 'Andaizm yapay zekâ dahil modern teknolojiyle de ilgilenir. Yapay zekânın gelecekte pek çok insan rolünün yerini alabileceğini ya da bu rolleri dönüştürebileceğini kabul eder. Andalar yalnızca korkuyla karşılık vermek yerine birlikte var olmaya, uyum sağlamaya, etiğe ve insani anlamı korumaya odaklanmaya teşvik edilir.',
        },
        {
          type: 'paragraph',
          text: 'Bu bakışa göre insanın değeri yalnızca üretkenliğe, istihdama ya da ekonomik yararlılığa bağlı olmamalıdır. Makineler insan emeğinin rolünü değiştirirse Andalar anlamı topluluk, doğa, yaratıcılık, özen, öğrenme ve manevi yaşam aracılığıyla aramaya teşvik edilir.',
        },
      ],
    },
    'knowledge-study': {
      title: 'Bilgi ve öğrenim',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm öğrenime ve düşünsel açıklığa değer verir.',
        },
        {
          type: 'paragraph',
          text: 'Hakikat, insan sözleriyle sonsuza dek tam olarak yakalanmış bir şey olarak görülmez. Yeni keşifler eski inançları değiştirebilir. Belirsizlik sütunlardan biri olduğu için Andaizm öğrenmeyi, gözden geçirmeyi ve dürüst tartışmayı teşvik eder.',
        },
        {
          type: 'paragraph',
          text: 'Metinlere ve yeminlere saygı duyulur, ama onlar birer hapishane değildir. Ands büyüyebilir ve Andalar okumaya, incelemeye, tartışmaya ve anlayışlarını inceltmeye teşvik edilir.',
        },
      ],
    },
    'mental-health': {
      title: 'Ruh sağlığı ve anlam',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm kısmen kaygı, yalnızlık, kaybolmuşluk ve anlam yoksunluğu deneyimlerinden doğdu. Kendini belirsiz ya da ruhen yurtsuz hisseden insanlara ritüel, dil, topluluk ve yön sunar.',
        },
        {
          type: 'paragraph',
          text: 'Ancak Andaizm tıbbi ya da psikolojik bakımın yerine geçen bir şey olarak sunulmaz. Anlam, aidiyet ve düşünüm pratikleri sağlayabilir, ama ciddi ruh sağlığı sorunları uygun profesyonel destekle ele alınmalıdır.',
        },
        {
          type: 'paragraph',
          text: 'Geleneğin katkısı klinik değil, varoluşsaldır: her acının basit yanıtlarla çözülebileceğini iddia etmeden, insanlara belirsizlikle, başarısızlıkla, yalnızlıkla ve korkuyla yaşamanın bir yolunu sunar.',
        },
      ],
    },
    death: {
      title: 'Ölüm ve Mengü’ye dönüş',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm, bir insan öldüğünde **Mengü**’ye, yani Sonsuz Gökyüzü’ne döndüğünü öğretir.',
        },
        {
          type: 'paragraph',
          text: 'Andalar genel olarak, ruhun kişisel bir ilahi hükümdar tarafından yargılandığı cennet ve cehennemli bir ölüm sonrası yaşama inanmaz. Reenkarnasyona ya da kaçılması gereken bir yeniden doğuş döngüsüne de inanmaz.',
        },
        {
          type: 'paragraph',
          text: 'Bu dönüş çoğu zaman **boşluk** olarak anlatılır. Andaizmde boşluk ceza, yok oluş ya da anlamsızlık demek değildir. Sonsuzlukla huzurlu bir birlik demektir. Ayrı ego, sonsuz bütünün içinde çözülür.',
        },
        {
          type: 'paragraph',
          text: 'Bir insanın Mengü’yle, düşünceyle, doğayla, toplulukla, dünyayla ve çevresiyle bağı ne kadar güçlüyse, o insan sonsuzlukla o kadar derinden bir olur.',
        },
        {
          type: 'paragraph',
          text: 'Ölüm bir mahkeme değildir. Bir ödül ya da ceza düzeni değildir. Dönüştür.',
        },
        {
          type: 'paragraph',
          text: 'Ölümün ötesindeki gelecek kesin olarak bilinemediği için Andaizm büyük ölçüde bu hayata odaklanır. Anda, sonrasında gelebilecek olanın gizemine açık kalırken burada ve şimdi dolu dolu yaşamaya çağrılır.',
        },
      ],
    },
    'other-traditions': {
      title: 'Diğer geleneklerle ilişkisi',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm daha eski dinler ve felsefelerle ortak temalar paylaşır, ama hiçbirine tam olarak ait değildir.',
        },
        {
          type: 'paragraph',
          text: 'Gökyüzüne saygısı, bozkır sembolizmi ve doğa ile kozmik düzen arasında kurduğu bağ bakımından Tengriciliğe benzer. İçsel disipline ve belirsizliğe verdiği önemle Stoacılığa benzer. Anlam, kaygı ve belirsizlik altında yaşam üzerine düşünmesiyle varoluşçuluğa benzer. Kutsalın yalnızca insanın dışında değil, içinde de olduğunu öğretmesiyle bazı mistik geleneklere benzer.',
        },
        {
          type: 'paragraph',
          text: 'Ancak Andaizm, bir yemin sistemi olarak **Ands** fikrini merkeze koymasıyla, belirsizliği açıkça kabul etmesiyle, agnostik rengiyle, cezalandırıcı bir günah öğretisini reddetmesiyle, tutkuya olumlu bakışıyla ve niyeti imkânsız bir kusursuzluktan daha önemli saymasıyla pek çok gelenekten ayrılır.',
        },
      ],
    },
    'cultural-background': {
      title: 'Kültürel arka plan ve etkiler',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm, Hollanda ve Türk kültürleri arasındaki bir arka plandan doğdu. Bu yüzden hem Doğu’nun hem Batı’nın etkilerini taşır. Bozkır imgeleri, modern Avrupa yaşamı, Türk soyu, varoluşçu düşünce, bilim, teknoloji, müzik ve fantastik edebiyatla şekillenmiş bir eritme potası olarak anlaşılabilir.',
        },
        {
          type: 'paragraph',
          text: 'Önemli etkiler arasında Türk ve bozkır sembolizmi, yemin ve kan kardeşliği kavramı, gökyüzü merkezli maneviyat, gökyüzüne ve doğaya Tengriciliği andıran bir saygı, Stoacılığın disiplin ve iç güç fikirleri, agnostik ve varoluşçu düşünce, doğaya saygı, fantastik dünya kurgusu ve mitik hayal gücü, modern bilim ve teknoloji, Anadolu ve Türk müziğinin atmosferi sayılabilir.',
        },
        {
          type: 'paragraph',
          text: 'Andaizm bu etkileri doğrudan sahiplenme ya da basit bir devamlılık olarak sunmaz. Onları Mengü, Ands, belirsizlik ve sonsuz olma etrafında kurulmuş modern bir geleneğe dönüştürür.',
        },
      ],
    },
    history: {
      title: 'Tarihçe',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm **2024** yılında **Delft, Hollanda**’da, o sırada 26 yaşında olan **Merthan Tukuş** tarafından kuruldu. Tukuş Delft’te doğdu ve Türk kökenlidir. Andaizmin ilk şekillenişi, onun Hollanda ile Türkiye arasında yaşama ve ikisine de tam olarak ait olmadığını hissetme deneyiminden beslendi.',
        },
        {
          type: 'paragraph',
          text: 'Dünyalar arasında kalmışlık duygusu Andaizmin duygusal köklerinden biri oldu. Andaizm yurdu tümüyle tek bir ülkeye, etnik kökene ya da kültüre yerleştirmek yerine, insanın en derin yurdunun ve obasının Mengü’de bulunabileceği fikrini dile getirir. Bu anlamda Mengü, kendini bölünmüş, köksüz, yalnız ya da dünyada belirgin bir yeri olmayan biri gibi hisseden insanlar için manevi bir yurt olur.',
        },
        {
          type: 'paragraph',
          text: 'Tukuş, Andaizmin ilk şekillenişini kaygı, yalnızlık, anlam yoksunluğu ve amaç arayışıyla bağlantılı olarak anlatmıştır. Gelenek kısmen, belirsizlikle, başarısızlıkla, korkuyla ve kaybolmuşluk duygusuyla yaşamasına yardım edebilecek bir çerçeve kurma ihtiyacından doğdu.',
        },
        {
          type: 'paragraph',
          text: 'Böylece Andaizm hem kişisel bir yol hem de ortak bir felsefe olarak gelişti. Bütün insanlara dayatılan nihai bir hakikat olarak değil, ilkelerini uğruna yaşamaya, onları incelemeye, uygulamaya ve belki bir gün onlar için and içmeye değecek kadar anlamlı bulanlar için bir yaşam biçimi olarak sunulur.',
        },
      ],
    },
    founder: {
      title: 'Kurucu',
      blocks: [
        {
          type: 'paragraph',
          text: '**Merthan Tukuş** Andaizmin kurucusudur. TU Delft Bilgisayar Bilimi ve Mühendisliği mezunu, Hollanda’da doğmuş Türk kökenli biri ve fantastik türün bir hayranıdır. Bu öğeler Andaizmin bozkır sembolizmi, Doğu Batı kimliği, modern teknoloji, varoluşçu düşünce ve mitik hayal gücünün bir karışımı olan karakterinin şekillenmesine katkıda bulundu.',
        },
        {
          type: 'paragraph',
          text: "Tukuş çok küçük yaşlardan beri, özellikle fantastik edebiyat türünde, tutkulu bir okurdur. Yaklaşık 13 yaşına geldiğinde Conn Iggulden’ın **Cengiz Han romanlarını**, Brandon Sanderson’ın **Fırtınaışığı Arşivi** serisini ve Star Wars’taki **Jedi** hikâyelerini okumuştu. Daha sonra kendisi de bir kitap yazdı: **De Weg van Voetbal**.",
        },
        {
          type: 'paragraph',
          text: "Tukuş bu eserleri ilk ilham kaynakları arasında sayar ve onların izleri Andaizmde görülebilir. Iggulden’ın bozkırı, açık düzlükleri, klanları, kardeşler arasındaki yeminleri ve her şeyin üzerindeki gökyüzüyle Andaizmin kendi imgelerinde karşılık bulur. Işıltılı Şövalyelerin İdealleri, yani yalnızca söylenmeyen, yaşandıkça içine doğru büyünen yeminler, bir andın nasıl anlaşıldığını yansıtır. Jedi’ların disiplin, sükûnet ve başkalarına hizmet yolu da Andaizmin kendisini izleyenlerden istediği yaşamda tanınabilir.",
        },
        {
          type: 'paragraph',
          text: 'Tukuş bilgi teknolojileri alanında bir kariyer kurdu ve **Sensey** adlı bilişim şirketini kurdu. 28 yaşında, şirketi aracılığıyla yeterince para kazandıktan sonra, kendini tümüyle Andaizme ve Anda’ya adamak için olağan kariyerini bıraktı.',
        },
        {
          type: 'paragraph',
          text: 'Tukuş bir peygamber, ilahi bir figür, mesih, guru ya da nihai dini otorite olarak görülmeyi açıkça reddeder. Andaizmde kurucu nihai hakikatin kaynağı değildir. Anlamın bireyin içinde, Mengü’nün altında bulunduğu kabul edilir.',
        },
        {
          type: 'paragraph',
          text: 'Bu yüzden rolü kurtarıcı değil, destekleyici olarak tanımlanır. Başkalarına anlam veren biri olarak değil, sözler, ritüeller, yapı ve destek sunan biri olarak tanıtılır. Andaizmde insanlar birbirinin elinden tutabilir ve birbirine destek olabilir, ama hiç kimse bir başkasının nihai anlamına sahip olamaz.',
        },
      ],
    },
    summary: {
      title: 'Özet',
      blocks: [
        {
          type: 'paragraph',
          text: 'Andaizm, Mengü ya da Sonsuz Gökyüzü etrafında şekillenen modern bir din ve yaşam felsefesidir. Merkezi yapısı, bireyin Mengü’nün altında kutsal sözler verdiği yemine dayalı bir sistem olan **Ands**’tir.',
        },
        {
          type: 'paragraph',
          text: 'Bağlılarına Anda, manevi önderlerine Onba, ibadet evlerine Gökevi denir.',
        },
        {
          type: 'paragraph',
          text: 'Gelenek, insanların kusurlu, tutkulu, belirsizlik içinde ve tamamlanmamış olduğunu öğretir. Hiç başarısız olmamaya değil, geri dönmeye çağrılırlar. Her şeyi bilmeye değil, belirsizliğin altında dürüstçe yaşamaya çağrılırlar.',
        },
        {
          type: 'paragraph',
          text: 'Andaizmin temel amacı sonsuz olmaktır: insanların kesin olarak bildiği tek hayatta daha dolu, daha huzurlu ve daha içten yaşayarak Mengü’ye yaklaşmak.',
        },
        {
          type: 'paragraph',
          text: 'Temel şiarı şudur:',
        },
        {
          type: 'quote',
          lines: [
            '**Haydi yaşayalım!**',
          ],
        },
        {
          type: 'paragraph',
          text: 'Mengü’nün altında insan; yaşamaya, öğrenmeye, onarmaya, şarkı söylemeye, kucaklamaya, korumaya, ekmeye, dolaşmaya ve Sonsuz Gökyüzü’nün altında sonsuz olmaya çağrılır.',
        },
      ],
    },
  },
};
