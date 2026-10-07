# Review log — Odia language edit

Pass 1 = correctness/naturalness, 2 = transliteration consistency, 3 = cross-unit `uses`, 4 = accept_en, 5 = English.

## u1.json (7 changes)

- [1] ksama-karantu: note "କ୍ଷ is pronounced roughly 'khya': khyama karantu." → "କ୍ଷ is pronounced 'khy' here: khyama karantu." (match tr)
- [1] asuchhi: accept_en ["bye", "i'll be off", "i am leaving", "see you"] → ["bye", "goodbye", "ill be off", "i am leaving"] (plain answers, no punctuation)
- [2] tr: 'bahuta' → 'bahut' (4×) (transliteration standard)
- [2] tr: 'ksama' → 'khyama' (3×) (transliteration standard)
- [4] kichhi-nahin: accept_en ['no problem', "it's nothing", 'never mind', "it's okay"] → ['no problem', 'its nothing', 'never mind', 'its okay']
- [4] tume-kemiti-achha: accept_en ['how are you', 'how are you doing', "how's it going"] → ['how are you', 'how are you doing', 'hows it going']
- [4] mun-bhala-achhi: accept_en ['i am fine', "i'm fine", 'i am well', "i'm good"] → ['i am fine', 'im fine', 'i am well', 'im good']

## u2.json (25 changes)

- [1] ମୋତେ ବି ଖୁସି ଲାଗିଲା।: od "ମୋତେ ବି।" → "ମୋତେ ବି ଖୁସି ଲାଗିଲା।" (fuller natural reply)
- [1] ମୋତେ ବି ଖୁସି ଲାଗିଲା।: tr "mote bi." → "mote bi khusi lagila." ()
- [2] tr: 'Bhubaneswara' → 'Bhubaneswar' (1×) (transliteration standard)
- [2] tr: 'Bhubaneswarare' → 'Bhubaneswarre' (2×) (transliteration standard)
- [2] tr: 'Dilli' → 'Delhi' (1×) (transliteration standard)
- [2] tr: 'Dilliru' → 'Delhiru' (2×) (transliteration standard)
- [2] tr: 'Jagannatha' → 'Jagannath' (1×) (transliteration standard)
- [2] tr: 'Kataka' → 'Cuttack' (1×) (transliteration standard)
- [2] tr: 'Katakare' → 'Cuttackre' (1×) (transliteration standard)
- [2] tr: 'Katakaru' → 'Cuttackru' (2×) (transliteration standard)
- [2] tr: 'Orisa' → 'Odisha' (1×) (transliteration standard)
- [2] tr: 'Orisaku' → 'Odishaku' (1×) (transliteration standard)
- [2] tr: 'Orisare' → 'Odishare' (1×) (transliteration standard)
- [2] tr: 'bahuta' → 'bahut' (1×) (transliteration standard)
- [3] uses "ଆପଣଙ୍କ ନାଁ କ'ଣ?": +['apana'] 
- [3] uses "ଆପଣଙ୍କୁ ଭେଟି ଖୁସି ଲାଗିଲା।": +['apana'] 
- [3] uses "ଆପଣ କେଉଁଠୁ ଆସିଛନ୍ତି?": +['apana'] 
- [3] uses "ମୁଁ କଟକରୁ ଆସିଛି।": +['mun'] 
- [3] uses "ମୁଁ ଭୁବନେଶ୍ୱରରେ ରହେ।": +['mun'] 
- [3] uses "ମୁଁ ଦିଲ୍ଲୀରୁ ଆସିଛି।": +['mun'] 
- [3] uses "ହଁ, ମୁଁ ଭଲ ଅଛି।": +['mun'] 
- [4] apananka-nan-kana: accept_en ['what is your name', "what's your name", 'your name'] → ['what is your name', 'whats your name', 'your name']
- [4] tuma-nan-kana: accept_en ['what is your name', "what's your name", 'your name'] → ['what is your name', 'whats your name', 'your name']
- [4] mun-ru-asichhi: accept_en ['i am from', "i'm from", 'i have come from'] → ['i am from', 'im from', 'i have come from']
- [4] nahin: accept_en ['no', "there isn't", 'is not', 'not'] → ['no', 'there isnt', 'is not', 'not']

## u3.json (9 changes)

- [1] u3-didi: note "ଅପା (apa) is also used for an elder sister, and politely for any woman a bit older than you." → "ଅପା (apa) and ନାନୀ (nani) are also common for an elder sister; ଅପା is also a polite way to address a woman a bit older than you." (add common Odia terms)
- [3] uses "ଏ ମୋ ସାନ ଭାଇ।": +['u3-bhai'] 
- [3] uses "ମୋ ଦିଦି କେଉଁଠି?": +['keunthi'] 
- [3] uses "ଭାଇନା, ମାଆ କେଉଁଠି?": +['keunthi'] 
- [3] uses "ଆପଣଙ୍କ ବଡ଼ ଭାଇ କେଉଁଠି?": +['apana', 'keunthi', 'u3-bhai'] 
- [3] uses "ଜେଜେ ମାଆ କେଉଁଠି?": +['keunthi'] 
- [3] uses "ଦାଦା ବାପାଙ୍କ ସାନ ଭାଇ।": +['u3-bhai'] 
- [3] uses "ଆପଣଙ୍କ ଘରେ କିଏ କିଏ ଅଛନ୍ତି?": +['apana', 'kie', 'u3-ghara'] 
- [3] uses "ମୁଁ ବିବାହିତ।": +['mun'] 

## u4.json (9 changes)

- [1] ଏଇଟା ବହୁତ ମହଙ୍ଗା।: od "ଏହା ବହୁତ ମହଙ୍ଗା।" → "ଏଇଟା ବହୁତ ମହଙ୍ଗା।" (spoken ଏଇଟା, not written ଏହା)
- [1] ଏଇଟା ବହୁତ ମହଙ୍ଗା।: tr "eha bahuta mahanga." → "eita bahut mahanga." ()
- [1] : text "As in Hindi, every number from 11 to 99 is its own word, not 'twenty-five' built from parts: ପଚିଶ (pachisa) = 25, ପଚାଶ (pachasa) = 50. Learn the tens first, then the in-between numbers you meet most, like ପଚିଶ. Ages use ବୟସ (age): ମୋ ବୟସ ପଚିଶ ବର୍ଷ = I'm twenty-five." → "Numbers from 11 to 99 are single words you learn one by one, not built like 'twenty-five': ପଚିଶ (pachisa) = 25, ପଚାଶ (pachasa) = 50. Learn the tens first, then the in-between numbers you meet most. Ages use ବୟସ (age): ମୋ ବୟସ ପଚିଶ ବର୍ଷ = I'm twenty-five." (drop Hindi comparison)
- [2] tr: 'bahuta' → 'bahut' (3×) (transliteration standard)
- [2] tr: 'tamato' → 'tomato' (1×) (transliteration standard)
- [3] uses "ଦୁଇଟା ଚା ଦିଅନ୍ତୁ।": +['diantu'] 
- [3] uses "ଏଇଟା ବହୁତ ମହଙ୍ଗା।": +['eita'] 
- [3] uses "କୋଡ଼ିଏ ଟଙ୍କା, ବହୁତ ଶସ୍ତା।": +['u4-tanka'] 
- [5] dlg "ଠିକ୍ ଅଛି, ତିରିଶ ଟଙ୍କା ଦିଅନ୍ତୁ।": en 'All right, give me thirty rupees.' → 'All right, thirty rupees then.' (clearer: seller is conceding)

## u5.json (26 changes)

- [1] : text "ବାର (bara) means 'day of the week'. As in English, the days are named after the sun, moon and planets: ରବି sun, ସୋମ moon, ମଙ୍ଗଳ Mars, ବୁଧ Mercury, ଗୁରୁ Jupiter, ଶୁକ୍ର Venus, ଶନି Saturn. Learn the first part and just add -ବାର." → "ବାର (bara) means 'day of the week'. The days are named after the sun, moon and planets: ରବି sun, ସୋମ moon, ମଙ୍ଗଳ Mars, ବୁଧ Mercury, ଗୁରୁ Jupiter, ଶୁକ୍ର Venus, ଶନି Saturn. Learn the first part and just add -ବାର." (removed inaccurate "as in English")
- [1] u5-paaradina: od "ପଅରଦିନ" → "ପରଶୁ" (main word for day after tomorrow)
- [1] u5-paaradina: tr "paaradina" → "parasu" ()
- [1] u5-paaradina: en "the day after tomorrow; the day before yesterday" → "the day after tomorrow" ()
- [1] u5-paaradina: accept_en ["day after tomorrow", "day before yesterday"] → ["day after tomorrow", "the day after tomorrow"] ()
- [1] u5-paaradina: note "Also ପରଶୁ (parasu). Like କାଲି, the tense shows which direction is meant." → "ପଅରଦିନ (paaradina) is also heard." (ପଅରଦିନ only as variant)
- [1] ପରଶୁ ମୁଁ ପୁରୀ ଯିବି।: od "ପଅରଦିନ ମୁଁ ପୁରୀ ଯିବି।" → "ପରଶୁ ମୁଁ ପୁରୀ ଯିବି।" (use ପରଶୁ)
- [1] ପରଶୁ ମୁଁ ପୁରୀ ଯିବି।: tr "paaradina mun puri jibi." → "parasu mun Puri jibi." ()
- [1] : text "Odia uses କାଲି for both tomorrow and yesterday, and ପଅରଦିନ for both two days ahead and two days back. Listen to the verb: ମୁଁ କାଲି ଆସିବି (will come) = tomorrow; ମୁଁ କାଲି ଆସିଥିଲି (came) = yesterday. Add -ଏ or -ରେ for 'in/at': ସକାଳେ, ସଞ୍ଜରେ, ରାତିରେ." → "Odia uses କାଲି for both tomorrow and yesterday. Listen to the verb: ମୁଁ କାଲି ଆସିବି (will come) = tomorrow; ମୁଁ କାଲି ଆସିଥିଲି (came) = yesterday. ପରଶୁ is the day after tomorrow. Add -ଏ or -ରେ for 'in/at': ସକାଳେ, ସଞ୍ଜରେ, ରାତିରେ." (removed uncertain two-way claim for ପଅରଦିନ)
- [1] u5-dina: en "day; daytime, midday" → "day; daytime" (ଦିନ alone is not "noon")
- [1] u5-dina: accept_en ["day", "daytime", "midday", "noon"] → ["day", "daytime"] ()
- [1] u5-dina: note "ଦିନରେ = in the daytime. The formal word for midday/noon is ମଧ୍ୟାହ୍ନ (madhyahna)." → "ଦିନରେ = in the daytime. Midday is ମଧ୍ୟାହ୍ନ (madhyahna) in formal Odia." ()
- [1] u5-panchata-bajila: accept_en ["its five oclock", "it is five oclock", "five oclock"] → ["its five oclock", "it is five oclock", "five oclock", "five o clock"] ()
- [2] tr: 'bas' → 'bus' (1×) (transliteration standard)
- [2] tr: 'katakare' → 'Cuttackre' (1×) (transliteration standard)
- [2] tr: 'minit' → 'minute' (3×) (transliteration standard)
- [3] uses "ମୁଁ କାଲି ଆସିବି।": +['mun'] 
- [3] uses "ମୁଁ କାଲି ଆସିଥିଲି।": +['mun'] 
- [3] uses "ପରଶୁ ମୁଁ ପୁରୀ ଯିବି।": +['mun', 'puri'] 
- [3] uses "ଆଜି ସଞ୍ଜରେ ଆସନ୍ତୁ।": +['asantu'] 
- [3] uses "ସାଢ଼େ ଚାରିଟା ବାଜିଲା।": +['u4-chari'] -['u5-panchata-bajila']
- [3] uses "ପାଖାପାଖି ଦଶଟା ବାଜିଲା।": +['u4-dasa'] -['u5-panchata-bajila']
- [3] uses "ଶୀଘ୍ର ଆସନ୍ତୁ।": +['asantu'] 
- [3] uses "ଦୁଇ ଘଣ୍ଟା ଲାଗିବ।": +['u4-dui'] 
- [3] uses "ଆଉ ଦଶ ମିନିଟ୍।": +['u4-dasa'] 
- [4] u5-pakhapakhi: en 'about, approximately' → 'about; approximately' (separator style)

## u6.json (27 changes)

- [1] u6-sakahari: note "In eateries people also simply say ଭେଜ୍ (bhej)." → "In eateries people also simply say ଭେଜ୍ (veg)." (loanword spelling)
- [1] u6-amisa: note "In eateries people also say ନନ୍-ଭେଜ୍ (nan-bhej)." → "In eateries people also say ନନ୍-ଭେଜ୍ (non-veg)." (loanword spelling)
- [1] u6-mote-bhoka-laguchhi: accept_en ["im hungry", "i am hungry"] → ["im hungry", "i am hungry", "hungry"] ()
- [1] u6-peta-purigala: accept_en ["im full", "i am full", "full"] → ["im full", "i am full", "full", "my stomach is full"] ()
- [1] ଭାଇ, ଗୋଟେ ଚା ଦିଅନ୍ତୁ।: od "ଦୁଇଟା ଚା ଦିଅନ୍ତୁ।" → "ଭାଇ, ଗୋଟେ ଚା ଦିଅନ୍ତୁ।" (was a duplicate of a u4 example and did not contain the item)
- [1] ଭାଇ, ଗୋଟେ ଚା ଦିଅନ୍ତୁ।: tr "duita cha diantu." → "bhai, gote cha diantu." ()
- [1] ଭାଇ, ଗୋଟେ ଚା ଦିଅନ୍ତୁ।: en "Two teas, please." → "One tea, please." ()
- [1] : text "Odia doesn't say 'I want' with a changing verb. Instead: ମୋତେ (to me) + thing + ଦରକାର (needed): ମୋତେ ପାଣି ଦରକାର. It works just like ମୋତେ ଭୋକ ଲାଗୁଛି. For a polite order, name the item and add ଦିଅନ୍ତୁ; ଦୟାକରି (please) is optional." → "A very common way to say 'I want' or 'I need' is ମୋତେ (to me) + thing + ଦରକାର (needed): ମୋତେ ପାଣି ଦରକାର. It works just like ମୋତେ ଭୋକ ଲାଗୁଛି. For a polite order, name the item and add ଦିଅନ୍ତୁ; ଦୟାକରି (please) is optional." (removed wrong claim that Odia has no changing verb for want)
- [2] tr: 'bahuta' → 'bahut' (6×) (transliteration standard)
- [2] tr: 'bil' → 'bill' (3×) (transliteration standard)
- [3] uses "ମୁଁ ଭାତ ଡାଲି ଖାଏ।": +['mun'] 
- [3] uses "ମୁଁ ରାତିରେ ରୁଟି ଖାଏ।": +['mun'] 
- [3] uses "ଚା, ପାଣି ନା କ୍ଷୀର?": +['pani'] 
- [3] uses "ମୋତେ ଶୋଷ ଲାଗୁଛି, ପାଣି ଦିଅ।": +['pani'] 
- [3] uses "ବସନ୍ତୁ, ଖାଆନ୍ତୁ।": +['basantu'] -['u6-basa']
- [3] uses "ଆଉ ଟିକେ ମିଠା ଦିଅନ୍ତୁ।": +['diantu'] 
- [3] uses "ମେନୁ ଦିଅନ୍ତୁ।": +['diantu'] 
- [3] uses "ଭାଇ, ଗୋଟେ ଚା ଦିଅନ୍ତୁ।": +['diantu', 'u3-bhai'] 
- [3] uses "ଆମିଷ କ'ଣ ଅଛି?": +['kana'] 
- [3] uses "ଝାଲ କମ୍ ଦେବେ।": +['u6-jhala'] 
- [3] uses "ଦୟାକରି ବିଲ୍ ଦିଅନ୍ତୁ।": +['dayakari', 'diantu'] 
- [4] u6-bhata: accept_en ['rice', 'cooked rice', 'meal'] → ['rice', 'cooked rice', 'meal', 'a meal']
- [4] u6-tarakari: accept_en ['curry', 'vegetable curry', 'vegetables'] → ['curry', 'vegetable curry', 'vegetables', 'cooked vegetable dish']
- [4] u6-mitha: accept_en ['sweet', 'sweets', 'dessert'] → ['sweet', 'sweets', 'dessert', 'a sweet dish']
- [4] u6-dali: en 'dal, lentils' → 'dal; lentils' (separator style)
- [4] u6-ruti: en 'flatbread, roti' → 'flatbread; roti' (separator style)
- [5] ex "ଆଉ ଟିକେ ମିଠା ଦିଅନ୍ତୁ।": en 'Please give me a little more of the sweet.' → 'A little more of the sweet, please.' (more natural English)

## u7.json (19 changes)

- [1] u7-souchalaya: note "This is the standard word you will see on signs. In speech many people simply say ଟଏଲେଟ (toileta) or ବାଥରୁମ (batharuma)." → "The standard word you will see on signs. In speech many people simply say ଟଏଲେଟ୍ (toilet) or ବାଥରୁମ (bathroom)." (loanword spelling)
- [1] u7-chhaka: note "Many neighbourhoods are named after their ଛକ, so it is a handy landmark when giving directions." → "Busy junctions are everyday landmarks, so ଛକ is very useful when asking or giving directions." (removed unverifiable naming claim)
- [2] tr: 'ato' → 'auto' (2×) (transliteration standard)
- [2] tr: 'bahuta' → 'bahut' (4×) (transliteration standard)
- [2] tr: 'bas' → 'bus' (7×) (transliteration standard)
- [2] tr: 'paain' → 'pain' (3×) (transliteration standard)
- [2] tr: 'standa' → 'stand' (5×) (transliteration standard)
- [2] tr: 'stesana' → 'station' (6×) (transliteration standard)
- [2] tr: 'taksi' → 'taxi' (1×) (transliteration standard)
- [2] tr: 'tiket' → 'ticket' (2×) (transliteration standard)
- [3] uses "ଷ୍ଟେସନ କେଉଁଠି?": +['keunthi'] 
- [3] uses "ଶୌଚାଳୟ କେଉଁଠି ଅଛି?": +['keunthi'] 
- [3] uses "ବସ୍ ଷ୍ଟାଣ୍ଡ କେତେ ଦୂର?": +['u4-kete'] 
- [3] uses "ନିକଟରେ ଡାକ୍ତରଖାନା ଅଛି କି?": +['ki'] 
- [3] uses "ବଜାର ଯିବା ପାଇଁ କେତେ ନେବେ?": +['u4-kete'] 
- [3] uses "ଭାଇ, ଏଠି ରଖନ୍ତୁ।": +['u3-bhai'] 
- [3] uses "କେଉଁ ବସ୍ ପୁରୀ ଯିବ?": +['puri'] 
- [3] uses "ଦୁଇଟା ଟିକେଟ୍ ଦିଅନ୍ତୁ।": +['diantu', 'u4-dui'] 
- [4] u7-nikatare: accept_en ['nearby', 'near', 'close by', 'near here'] → ['nearby', 'near', 'close by', 'near here', 'close to']

## u8.json (25 changes)

- [1] u8-lala: od "ଲାଲ" → "ନାଲି" (ନାଲି is the everyday word for red)
- [1] u8-lala: tr "lala" → "nali" ()
- [1] u8-lala: note "ନାଲି (nali) is the other everyday word for red; you will hear both." → "ଲାଲ (lala) is also used; you will hear both." ()
- [1] ନାଲି ନା ସବୁଜ?: od "ଲାଲ ନା ସବୁଜ?" → "ନାଲି ନା ସବୁଜ?" (red = ନାଲି)
- [1] ନାଲି ନା ସବୁଜ?: tr "lala na sabuja?" → "nali na sabuja?" ()
- [1] ନାଲି ବ୍ୟାଗ୍ ଅଛି କି?: od "ଲାଲ ବ୍ୟାଗ୍ ଅଛି କି?" → "ନାଲି ବ୍ୟାଗ୍ ଅଛି କି?" (red = ନାଲି)
- [1] ନାଲି ବ୍ୟାଗ୍ ଅଛି କି?: tr "lala byag achhi ki?" → "nali bag achhi ki?" ()
- [1] : text "Colour words go before the thing they describe and never change form: ଲାଲ ଫୁଲ \"red flower\", ଲାଲ ଫୁଲ ସବୁ \"red flowers\". To say \"it is blue\" you can use the colour alone (ଏଇଟା ନୀଳ) or add ରଙ୍ଗ, \"colour\" (ଏଇଟା ନୀଳ ରଙ୍ଗ)." → "Colour words go before the thing they describe and never change form: ନାଲି ଫୁଲ \"red flower\", ନାଲି ଫୁଲ ସବୁ \"red flowers\". To say \"it is blue\" you can use the colour alone (ଏଇଟା ନୀଳ) or add ରଙ୍ଗ, \"colour\" (ଏଇଟା ନୀଳ ରଙ୍ଗ)." (red = ନାଲି)
- [2] tr: 'bahuta' → 'bahut' (2×) (transliteration standard)
- [2] tr: 'saij' → 'size' (1×) (transliteration standard)
- [2] tr: 'tamato' → 'tomato' (4×) (transliteration standard)
- [3] uses "ଏଇଟା ନୀଳ ରଙ୍ଗ।": +['eita'] -['u8-eita-keun-ranga']
- [3] uses "ଏଇଟା ଧଳା ନା କଳା?": +['eita'] 
- [3] uses "ମୋତେ ଗୋଲାପୀ ଫୁଲ ଦରକାର।": +['u6-mote-darakara'] 
- [3] uses "ହଳଦିଆ ଫୁଲ ଦିଅନ୍ତୁ।": +['diantu'] 
- [3] uses "ଆଳୁ କିଲୋ କେତେ?": +['u4-kete'] 
- [3] uses "ଏକ କିଲୋ ପିଆଜ ଦିଅନ୍ତୁ।": +['diantu', 'u4-eka'] 
- [3] uses "ଅଧ କିଲୋ ଟମାଟୋ ଦିଅନ୍ତୁ।": +['diantu', 'u8-kilo'] 
- [3] uses "ପରିବା ତାଜା ଅଛି କି?": +['ki'] 
- [3] uses "ମୋଟ କେତେ ହେଲା?": +['u4-kete'] 
- [3] uses "ଅନ୍ୟ ରଙ୍ଗ ଅଛି କି?": +['ki'] 
- [3] uses "ଏଇଟା ବହୁତ ବଡ଼।": +['eita'] 
- [3] uses "ଛୋଟ ସାଇଜ୍ ଅଛି କି?": +['ki'] 
- [3] uses "ଠିକ୍ ଅଛି, ମୁଁ ଏଇଟା ନେବି।": +['thik-achhi', 'mun', 'eita'] 
- [3] uses "ନା, ମୋତେ ଦରକାର ନାହିଁ।": +['na', 'nahin'] 

## phrasebook.json (66 changes)

- [1] essentials-yes: note "To an elder, ହଁ ଆଜ୍ଞା (han ajnya) is more respectful." → "To an elder, ହଁ ଆଜ୍ଞା (han agyan) is more respectful." (tr of ଆଜ୍ଞା)
- [1] essentials-sorry: note "More formal: କ୍ଷମା କରିବେ." → "More formal: କ୍ଷମା କରିବେ (khyama karibe)." ()
- [1] essentials-speak-english: note "Often pronounced 'ingraji'." → "" (tr now ingraji, note redundant)
- [1] essentials-what-in-odia: od "ଏହାକୁ ଓଡ଼ିଆରେ କ'ଣ କହନ୍ତି?" → "ଏଇଟାକୁ ଓଡ଼ିଆରେ କ'ଣ କହନ୍ତି?" (spoken ଏଇଟା)
- [1] essentials-what-in-odia: tr "ehaku Odiare kana kahanti?" → "eitaku Odiare kana kahanti?" ()
- [1] auto-taxi-how-much-to: note "Put the place name in the blank, e.g. ଷ୍ଟେସନ (stesan)." → "Put the place name in the blank, e.g. ଷ୍ଟେସନ (station)." ()
- [1] auto-taxi-right: en "Turn right" → "Go to the right" (matches Odia (no "turn" verb))
- [1] auto-taxi-left: en "Turn left" → "Go to the left" (matches Odia)
- [1] auto-taxi-slowly: od "ଟିକିଏ ଧୀରେ ଚଲାନ୍ତୁ" → "ଟିକିଏ ଧୀରେ ଚଳାନ୍ତୁ" (spelling ଚଳାନ୍ତୁ (as u7))
- [1] shopping-bigger-size: od "ଏହାଠୁ ବଡ଼ ସାଇଜ ଅଛି କି?" → "ଏଇଟାଠୁ ବଡ଼ ସାଇଜ୍ ଅଛି କି?" (spoken ଏଇଟାଠୁ; ସାଇଜ୍ spelling)
- [1] shopping-bigger-size: tr "ehathu bara saij achhi ki?" → "eitathu bara size achhi ki?" ()
- [1] temple-jay-jagannath: tr "jaya jagannatha" → "jay Jagannath" (common spelling)
- [1] emergency-lost-wallet: note "Also ମନିବ୍ୟାଗ (manibyag) for a wallet." → "Also ମନିବ୍ୟାଗ୍ (moneybag) for a wallet." ()
- [1] emergency-i-am-lost: od "ମୁଁ ବାଟ ହରାଇଦେଇଛି" → "ମୁଁ ବାଟ ଭୁଲିଯାଇଛି" (more natural than ହରାଇଦେଇଛି)
- [1] emergency-i-am-lost: tr "mun bata haraideichhi" → "mun bata bhulijaichhi" ()
- [1] work-see-you-tomorrow: od "ଆସୁଛି, କାଲି ଦେଖାହେବା" → "ଆସୁଛି, କାଲି ଦେଖା ହେବ" (spacing/form as u1 ଦେଖା ହେବ)
- [1] work-see-you-tomorrow: tr "asuchhi, kali dekhaheba" → "asuchhi, kali dekha heba" ()
- [1] train-bus: odia "ଟ୍ରେନ ଓ ବସ" → "ଟ୍ରେନ ଓ ବସ୍" (halant spelling as in units)
- [1] train-bus-which-bus: od "… ଯିବା ବସ କେଉଁଠୁ ମିଳିବ?" → "… ଯିବା ବସ୍ କେଉଁଠୁ ମିଳିବ?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] train-bus-does-this-go: od "ଏ ବସ … ଯିବ କି?" → "ଏ ବସ୍ … ଯିବ କି?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] train-bus-ticket-counter: od "ଟିକେଟ କାଉଣ୍ଟର କେଉଁଠି?" → "ଟିକେଟ୍ କାଉଣ୍ଟର କେଉଁଠି?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] train-bus-one-ticket: od "… ପାଇଁ ଗୋଟିଏ ଟିକେଟ ଦିଅନ୍ତୁ" → "… ପାଇଁ ଗୋଟିଏ ଟିକେଟ୍ ଦିଅନ୍ତୁ" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] train-bus-next-bus: od "ଆଉ ବସ କେତେବେଳେ ଆସିବ?" → "ଆଉ ବସ୍ କେତେବେଳେ ଆସିବ?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] directions-bus-stop: od "ପାଖରେ ବସ ଷ୍ଟପ କେଉଁଠି ଅଛି?" → "ପାଖରେ ବସ୍ ଷ୍ଟପ୍ କେଉଁଠି ଅଛି?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] shopping-how-much: od "ଏଇଟାର ଦାମ କେତେ?" → "ଏଇଟାର ଦାମ୍ କେତେ?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] shopping-final-price: od "ଶେଷ ଦାମ କେତେ?" → "ଶେଷ ଦାମ୍ କେତେ?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] shopping-bag: od "ଗୋଟିଏ ବ୍ୟାଗ ଦେବେ କି?" → "ଗୋଟିଏ ବ୍ୟାଗ୍ ଦେବେ କି?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] hotel-leave-bag: od "ମୋ ବ୍ୟାଗ ଏଠି ଟିକିଏ ରଖିପାରିବି କି?" → "ମୋ ବ୍ୟାଗ୍ ଏଠି ଟିକିଏ ରଖିପାରିବି କି?" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [1] emergency-bag-stolen: od "ମୋ ବ୍ୟାଗ ଚୋରି ହୋଇଗଲା" → "ମୋ ବ୍ୟାଗ୍ ଚୋରି ହୋଇଗଲା" (halant spelling ବସ୍/ଟିକେଟ୍/ବ୍ୟାଗ୍/ଦାମ୍ as in units)
- [2] tr: 'alarji' → 'allergy' (1×) (transliteration standard)
- [2] tr: 'ambulans' → 'ambulance' (1×) (transliteration standard)
- [2] tr: 'bahuta' → 'bahut' (6×) (transliteration standard)
- [2] tr: 'bas' → 'bus' (4×) (transliteration standard)
- [2] tr: 'bathrum' → 'bathroom' (1×) (transliteration standard)
- [2] tr: 'bil' → 'bill' (1×) (transliteration standard)
- [2] tr: 'buk' → 'book' (1×) (transliteration standard)
- [2] tr: 'byag' → 'bag' (3×) (transliteration standard)
- [2] tr: 'chek-aut' → 'check-out' (1×) (transliteration standard)
- [2] tr: 'chek-in' → 'check-in' (1×) (transliteration standard)
- [2] tr: 'dama' → 'dam' (2×) (transliteration standard)
- [2] tr: 'esi' → 'AC' (1×) (transliteration standard)
- [2] tr: 'etiem' → 'ATM' (1×) (transliteration standard)
- [2] tr: 'imraji' → 'ingraji' (1×) (transliteration standard)
- [2] tr: 'kard' → 'card' (1×) (transliteration standard)
- [2] tr: 'kauntar' → 'counter' (1×) (transliteration standard)
- [2] tr: 'lyaptap' → 'laptop' (1×) (transliteration standard)
- [2] tr: 'mahaprasada' → 'mahaprasad' (1×) (transliteration standard)
- [2] tr: 'mapha' → 'maph' (1×) (transliteration standard)
- [2] tr: 'mitarare' → 'meterre' (1×) (transliteration standard)
- [2] tr: 'miting' → 'meeting' (1×) (transliteration standard)
- [2] tr: 'mobail' → 'mobile' (1×) (transliteration standard)
- [2] tr: 'myapare' → 'mapre' (1×) (transliteration standard)
- [2] tr: 'pars' → 'purse' (1×) (transliteration standard)
- [2] tr: 'parsal' → 'parcel' (1×) (transliteration standard)
- [2] tr: 'pasward' → 'password' (1×) (transliteration standard)
- [2] tr: 'phon' → 'phone' (1×) (transliteration standard)
- [2] tr: 'platpharmare' → 'platformre' (1×) (transliteration standard)
- [2] tr: 'polis' → 'police' (2×) (transliteration standard)
- [2] tr: 'rum' → 'room' (4×) (transliteration standard)
- [2] tr: 'sar' → 'sir' (1×) (transliteration standard)
- [2] tr: 'sit' → 'seat' (2×) (transliteration standard)
- [2] tr: 'stesan' → 'station' (1×) (transliteration standard)
- [2] tr: 'tawel' → 'towel' (1×) (transliteration standard)
- [2] tr: 'tiket' → 'ticket' (2×) (transliteration standard)
- [2] tr: 'tren' → 'train' (3×) (transliteration standard)
- [2] tr: 'waiphai' → 'wifi' (1×) (transliteration standard)

## Global decisions

- tr: ବହୁତ → bahut; କ'ଣ → kana; କ୍ଷମା → khyama, କ୍ଷୀର → khira; ଇଂରାଜୀ → ingraji; ଆଜ୍ଞା → agyan; ପାଇଁ → pain; ଦାମ୍ → dam.
- tr: proper nouns/loanwords use English spelling (Odisha, Cuttack, Bhubaneswar, Delhi, Puri, Jagannath, station, bus, ticket, bill, phone, police, platform, size, bag, toilet, auto, taxi, minute, tomato, room, seat …); case endings are appended directly (Cuttackru, Bhubaneswarre, Odishare, platformre, meterre).
- od: loanword spellings unified on the units' forms ବସ୍, ଟିକେଟ୍, ବ୍ୟାଗ୍, ସାଇଜ୍, ଦାମ୍, ଷ୍ଟପ୍.
- uses: recomputed by token matching (allowing case endings -ରେ -ରୁ -କୁ -ଙ୍କ -ଟା -ଟି -େ etc. and … slots), restricted to items from the same or earlier lesson; ନା counted only as 'no' (clause-initial), କି only as clause-final question marker; ମାଆ/ବାପା not counted inside ଜେଜେ ମାଆ/ଜେଜେ ବାପା.
- accept_en: lowercased, apostrophes removed (im, its, whats), each item's main English gloss added when missing.
- Unicode check: no precomposed ଡ଼/ଢ଼ (U+0B5C/5D), no stray spaces before punctuation; ୟ/ଯ usage verified.
