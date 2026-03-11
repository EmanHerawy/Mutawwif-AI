export interface FaqItem {
  id: string;
  category: string;
  keywords: string[];
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  source: string | null;
  genderSpecific: 'male' | 'female' | null;
}

export const FAQ_OFFLINE: FaqItem[] = [
  {
    id: 'female_halq',
    category: 'taqsir',
    keywords: ['female', 'woman', 'shave', 'halq', 'hair', 'taqsir', 'أنثى', 'حلق', 'تقصير', 'شعر', 'امرأة'],
    questionAr: 'هل يجب على المرأة حلق رأسها؟',
    questionEn: 'Does a woman need to shave her head?',
    answerAr: 'للمرأة التقصير فقط — يُقص من أطراف الشعر بمقدار أنملة تقريباً. الحلق حرام للمرأة في الحج والعمرة.',
    answerEn: 'For women, only Taqsir (shortening) is required — trim approximately a fingertip length. Shaving is forbidden for women.',
    source: 'Abu Dawud 1985, Ibn Majah 3031',
    genderSpecific: 'female',
  },
  {
    id: 'raml_who',
    category: 'tawaf',
    keywords: ['raml', 'رمل', 'jogging', 'first', 'three', 'laps', 'tawaf', 'male', 'ذكر'],
    questionAr: 'ما هو الرمل وعلى من يجب؟',
    questionEn: 'What is Raml and who must do it?',
    answerAr: 'الرمل هو الإسراع في المشي في الأشواط الثلاثة الأولى من الطواف، وهو سنة للرجال فقط. المرأة لا ترمل.',
    answerEn: 'Raml is brisk walking in the first three laps of Tawaf. It is Sunnah for men only. Women do not perform Raml.',
    source: 'Bukhari 1603, Muslim 1261',
    genderSpecific: 'male',
  },
  {
    id: 'idtiba_who',
    category: 'tawaf',
    keywords: ['idtiba', 'اضطباع', 'shoulder', 'ihram', 'tawaf', 'male', 'ذكر'],
    questionAr: 'ما هو الاضطباع؟',
    questionEn: 'What is Idtiba?',
    answerAr: 'الاضطباع هو وضع وسط الرداء تحت الإبط الأيمن وطرفيه على الكتف الأيسر. يُستحب للرجال في طواف القدوم فقط.',
    answerEn: 'Idtiba is placing the middle of the Rida\' (upper garment) under the right armpit and its ends over the left shoulder. Recommended for men during Tawaf Al-Qudum only.',
    source: 'Abu Dawud 1883, Tirmidhi 859',
    genderSpecific: 'male',
  },
  {
    id: 'talbiyah_female',
    category: 'talbiyah',
    keywords: ['talbiyah', 'تلبية', 'female', 'woman', 'أنثى', 'امرأة', 'loud', 'quiet', 'voice'],
    questionAr: 'هل تُجهر المرأة بالتلبية؟',
    questionEn: 'Does a woman recite Talbiyah loudly?',
    answerAr: 'المرأة تُلبي بصوت تسمعه هي فقط، لا تجهر به حتى لا تُفتن.',
    answerEn: 'A woman recites Talbiyah only audible to herself — she does not raise her voice.',
    source: 'Ibn Qudamah, Al-Mughni 3/228',
    genderSpecific: 'female',
  },
  {
    id: 'niqab_ihram',
    category: 'ihram',
    keywords: ['niqab', 'نقاب', 'face', 'veil', 'female', 'أنثى', 'ihram', 'إحرام', 'gloves'],
    questionAr: 'هل تلبس المرأة النقاب في الإحرام؟',
    questionEn: 'Can a woman wear Niqab in Ihram?',
    answerAr: 'لا يجوز للمرأة المحرمة لبس النقاب ولا القفازين. تكشف وجهها ويديها وإن مرّ بها رجال غطت وجهها بثوبها.',
    answerEn: 'A woman in Ihram may not wear Niqab or gloves. She uncovers her face and hands; if men pass by, she may cover her face with her garment.',
    source: 'Bukhari 1838, Abu Dawud 1827',
    genderSpecific: 'female',
  },
  {
    id: 'delay_tawaf_heat',
    category: 'health',
    keywords: ['heat', 'hot', 'temperature', 'delay', 'rest', 'tawaf', 'حر', 'حرارة', 'تأخير', 'طواف', 'راحة'],
    questionAr: 'هل يجوز تأخير الطواف بسبب الحر الشديد؟',
    questionEn: 'Is it permissible to delay Tawaf due to extreme heat?',
    answerAr: 'نعم، يجوز تأخير الطواف والسعي بسبب الحر الشديد إذا خُشي على النفس الضرر. حفظ النفس واجب شرعي. ابحث عن ظل وتناول الماء واستأنف عند انخفاض الحرارة.',
    answerEn: 'Yes, it is permissible to delay Tawaf and Sa\'i if extreme heat poses a risk to health. Preserving life is a religious obligation. Seek shade, drink water, and resume when the temperature drops.',
    source: 'Based on principles of Maqasid al-Shariah — [CONSULT_SCHOLAR_FOR_SPECIFIC_FATWA]',
    genderSpecific: null,
  },
  {
    id: 'zamzam_direction',
    category: 'zamzam',
    keywords: ['zamzam', 'زمزم', 'drink', 'direction', 'قبلة', 'facing', 'كيفية'],
    questionAr: 'كيف يُشرب ماء زمزم؟',
    questionEn: 'How should Zamzam water be drunk?',
    answerAr: 'يُستحب شرب ماء زمزم وأنت قائم، مستقبل القبلة، على ثلاثة أنفاس، مع ذكر اسم الله والدعاء.',
    answerEn: 'It is Sunnah to drink Zamzam while standing, facing the Qiblah, in three breaths, with Bismillah and du\'a.',
    source: '[SOURCE_NEEDED] — commonly reported practice',
    genderSpecific: null,
  },
  {
    id: 'ihram_prohibitions',
    category: 'ihram',
    keywords: ['ihram', 'إحرام', 'prohibitions', 'محظورات', 'allowed', 'forbidden', 'rules'],
    questionAr: 'ما هي محظورات الإحرام؟',
    questionEn: 'What are the Ihram prohibitions?',
    answerAr: 'محظورات الإحرام: قص الشعر والأظافر، الطيب، لبس المخيط (للرجل)، تغطية الرأس (للرجل)، النقاب والقفازات (للمرأة)، الصيد، عقد الزواج، الجماع، الفسوق والجدال.',
    answerEn: 'Ihram prohibitions: cutting hair/nails, wearing perfume, stitched clothing (men), covering the head (men), Niqab and gloves (women), hunting, contracting marriage, intercourse, and immoral conduct.',
    source: 'Al-Baqarah 2:197, agreed-upon hadiths',
    genderSpecific: null,
  },
  {
    id: 'sai_direction',
    category: 'sai',
    keywords: ['sai', 'سعي', 'safa', 'marwa', 'الصفا', 'المروة', 'direction', 'odd', 'even', 'laps'],
    questionAr: 'ما ترتيب أشواط السعي؟',
    questionEn: 'What is the order of Sa\'i trips?',
    answerAr: 'السعي 7 أشواط. الأشواط الفردية (1، 3، 5، 7) من الصفا إلى المروة. الأشواط الزوجية (2، 4، 6) من المروة إلى الصفا. يُختم بالمروة.',
    answerEn: "Sa'i is 7 trips. Odd trips (1, 3, 5, 7) go from Safa to Marwa. Even trips (2, 4, 6) go from Marwa to Safa. Ends at Marwa.",
    source: 'Muslim 1218',
    genderSpecific: null,
  },
];
