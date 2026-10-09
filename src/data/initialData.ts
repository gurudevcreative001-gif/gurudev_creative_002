import { PricingPlan, ServiceItem, SupportContact, VideoOrder } from '../types';

export const WHATSAPP_SUPPORT_NUMBERS: SupportContact[] = [
  {
    number: '6353894486',
    displayNumber: '+91 6353894486',
    waLink: 'https://wa.me/916353894486',
    labelGu: 'મુખ્ય સપોર્ટ હેલ્પલાઇન',
    labelEn: 'Primary WhatsApp Support',
    primary: true
  },
  {
    number: '990940414',
    displayNumber: '+91 990940414',
    waLink: 'https://wa.me/91990940414',
    labelGu: 'કસ્ટમ પ્રોજેક્ટ સપોર્ટ',
    labelEn: 'Project & Inquiry Support'
  },
  {
    number: '9714171301',
    displayNumber: '+91 9714171301',
    waLink: 'https://wa.me/919714171301',
    labelGu: 'ઓર્ડર અને એડિટર સપોર્ટ',
    labelEn: 'Order Tracking & Editor Support'
  }
];

export const GURUDEV_SERVICES: Record<'video' | 'design', ServiceItem[]> = {
  video: [
    { name: "Instagram Reel Editing", price: 150, category: 'video' },
    { name: "Gujarati Status Video", price: 150, category: 'video' },
    { name: "Birthday Video Editing", price: 200, category: 'video' },
    { name: "YouTube Video Editing", price: 300, category: 'video' },
    { name: "Instagram Promotional Video", price: 300, category: 'video' },
    { name: "Event Video Editing", price: 500, category: 'video' },
    { name: "Wedding Highlights Video", price: 1000, category: 'video' },
    { name: "Professional Video Editing", price: 1500, category: 'video' },
    { name: "Special Video Project", price: 2000, category: 'video' }
  ],
  design: [
    { name: "Instagram Post", price: 100, category: 'design' },
    { name: "Instagram Story", price: 100, category: 'design' },
    { name: "YouTube Thumbnail", price: 100, category: 'design' },
    { name: "Festival Poster", price: 100, category: 'design' },
    { name: "Birthday Poster", price: 100, category: 'design' },
    { name: "Business Promotion Poster", price: 100, category: 'design' },
    { name: "Logo Design", price: 100, category: 'design' },
    { name: "Visiting Card Design", price: 100, category: 'design' },
    { name: "Banner Design", price: 100, category: 'design' },
    { name: "Other Design", price: 100, category: 'design' }
  ]
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'reels_shorts',
    nameGu: 'ઇન્સ્ટાગ્રામ રીલ્સ અને શોર્ટ્સ',
    nameEn: 'Viral Reels & Shorts',
    priceMin: 150,
    priceMax: 350,
    priceLabel: '₹150 - ₹350',
    taglineGu: 'હાઇ-એન્ગેજમેન્ટ વર્ટિકલ વીડિયો (30 થી 60 સેકન્ડ)',
    taglineEn: 'High-retention vertical edits (30 to 60 sec)',
    category: 'reels_shorts',
    popular: true,
    featuresGu: [
      'આકર્ષક ગુજરાતી / હિન્દી / અંગ્રેજી સબટાઈટલ્સ (Auto/Animated Captions)',
      'ટ્રેન્ડિંગ સાઉન્ડ ઇફેક્ટ્સ (SFX) અને બેકગ્રાઉન્ડ મ્યુઝિક',
      'ઝૂમ-ઇન્સ, હાઇ-પેસ કટ્સ અને કલર બૂસ્ટ',
      '24 કલાકમાં એક્સપ્રેસ ડિલિવરી વિકલ્પ',
      '1 વખત ફ્રી રિવિઝન'
    ],
    featuresEn: [
      'Dynamic Gujarati / Hindi / English animated captions',
      'Viral sound design (SFX) & synced background music',
      'Zoom cuts, speed ramps & punchy color pop',
      '24-hour express delivery option',
      '1 complimentary revision included'
    ]
  },
  {
    id: 'youtube_vlog',
    nameGu: 'યૂટ્યુબ વ્લોગ અને વિડિયો',
    nameEn: 'YouTube & Content Videos',
    priceMin: 400,
    priceMax: 850,
    priceLabel: '₹400 - ₹850',
    taglineGu: 'લોંગ ફોર્મ કન્ટેન્ટ અને પોડકાસ્ટ એડિટિંગ (3 થી 10 મિનિટ)',
    taglineEn: 'Long-form vlogs & storytelling (3 to 10 mins)',
    category: 'youtube_vlog',
    popular: false,
    featuresGu: [
      'જમ્પ કટ ક્લીનઅપ (અનાવશ્યક પોઝ અને અટકાવ દૂર)',
      'હાઇ ક્વોલિટી B-Roll ફૂટેજ અને ગ્રાફિક્સ ઇન્સર્શન',
      'ઓડિયો નોઈઝ રીડક્શન અને પ્રોફેશનલ વોઈસ માસ્ટરિંગ',
      'ઇન્ટ્રો, આઉટ્રો અને લોઅર થર્ડ્સ એનિમેશન',
      '1080p FHD / 4K રેન્ડરિંગ'
    ],
    featuresEn: [
      'Seamless jump-cut cleanup & breath removal',
      'Curated B-roll footage & stock asset insertion',
      'Studio audio denoise & voice leveling',
      'Animated intro, outro & lower-thirds',
      'Crisp 1080p FHD / 4K export'
    ]
  },
  {
    id: 'brand_commercial',
    nameGu: 'બિઝનેસ અને પ્રોડક્ટ એડ',
    nameEn: 'Commercial & Brand Promo',
    priceMin: 900,
    priceMax: 1499,
    priceLabel: '₹900 - ₹1,499',
    taglineGu: 'બિઝનેસ જાહેરાત અને સોશિયલ મીડિયા એડ્સ',
    taglineEn: 'High-conversion business promo & ad creatives',
    category: 'brand_commercial',
    popular: false,
    featuresGu: [
      'કન્વર્ઝન-ફોકસ્ડ હૂક અને સ્ટોરીલાઇન પેસિંગ',
      'કિનેટિક ટાઇપોગ્રાફી અને 3D ટેક્સ્ટ મોશન',
      'પ્રીમિયમ લાયસન્સ્ડ સાઉન્ડટ્રેક અને વોઇસઓવર સિન્ક',
      'બ્રાન્ડ કલર પેલેટ મુજબ પ્રો કલર ગ્રેડિંગ',
      'સોશિયલ મીડિયા માટે 16:9 + 9:16 બંને ફોર્મેટ'
    ],
    featuresEn: [
      'High-conversion hook pacing for ad ROAS',
      'Kinetic typography & smooth motion graphics',
      'Licensed commercial soundtrack & VO sync',
      'Brand palette color grading & logo stinger',
      'Both 16:9 YouTube & 9:16 Meta/Reels cut available'
    ]
  },
  {
    id: 'cinematic_wedding',
    nameGu: 'સિનેમેટિક વેડિંગ અને ઇવેન્ટ હાઇલાઇટ',
    nameEn: 'Cinematic Wedding & Events',
    priceMin: 1200,
    priceMax: 2000,
    priceLabel: '₹1,200 - ₹2,000',
    taglineGu: 'લગ્ન, સગાઈ અને ઇવેન્ટ્સની યાદગાર ફિલ્મ',
    taglineEn: 'Magical wedding teaser & celebration highlight',
    category: 'cinematic_wedding',
    popular: false,
    featuresGu: [
      'હોલીવુડ સ્ટાઇલ સિનેમેટિક કલર ગ્રેડિંગ (LUTs & Log Profile)',
      'ઇમોશનલ બેકગ્રાઉન્ડ મ્યુઝિક અને બીટ-મેચ્ડ સ્લો મોશન',
      'ડ્રોન શોટ્સ અને 4K અલ્ટ્રા HD માસ્ટર એક્સપોર્ટ',
      'ટીઝર + ફૂલ હાઇલાઇટ્સ બંને વર્ઝન સપોર્ટ',
      'લાઇફટાઇમ પ્રીમિયમ ક્લાઉડ ડાઉનલોડ લિંક'
    ],
    featuresEn: [
      'Cinematic Log-to-Rec709 color grading with custom LUTs',
      'Emotional soundtrack pacing & 120fps slow-mo ramping',
      'Drone cinematic matching & 4K Ultra HD master',
      'Quick Instagram teaser + Full length highlight cut',
      'High-speed cloud download link'
    ]
  }
];

export const INITIAL_ORDERS: VideoOrder[] = [
  {
    id: 'GC-2026-8801',
    clientName: 'હાર્દિક પટેલ (Hardik Patel)',
    clientPhone: '9825145890',
    clientEmail: 'hardik.patel@gmail.com',
    city: 'અમદાવાદ (Ahmedabad)',
    category: 'reels_shorts',
    title: 'ફિટનેસ ટિપ્સ ઇન્સ્ટાગ્રામ રીલ (Fitness Gym Reel)',
    description: 'જિમ વર્કઆઉટ ફૂટેજ છે. ફાસ્ટ બીટ પર કટિંગ, હાઇલાઇટેડ સબટાઈટલ અને પાવરફુલ સાઉન્ડ ઇફેક્ટ્સ આપો.',
    aspectRatio: '9:16',
    durationMinutes: 0.5,
    rushDelivery: true,
    includeSubtitles: true,
    soundDesign: true,
    colorGrading: true,
    uploadMethod: 'cloud_link',
    cloudFootageUrl: 'https://drive.google.com/drive/folders/sample-footage-hardik',
    rawFilesCount: 4,
    rawFilesNames: ['workout_clip_01.mp4', 'dumbell_curl_4k.mp4', 'voiceover_hardik.wav', 'music_reference.mp3'],
    fileData: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileName: 'hardik_raw_workout_clip.mp4',
    rawFiles: [
      { name: 'workout_clip_01.mp4', size: 34500000, type: 'video/mp4', dataUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { name: 'dumbell_curl_4k.mp4', size: 52100000, type: 'video/mp4', dataUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
    ],
    estimatedPrice: 250,
    finalPrice: 250,
    paymentStatus: 'paid',
    status: 'completed',
    statusLogs: [
      {
        id: 'log-1',
        status: 'received',
        timestamp: '2026-10-07 10:15 AM',
        note: 'ઓર્ડર સફળતાપૂર્વક સ્વીકારાયો. કાચી ફૂટેજ પ્રાપ્ત થઈ.',
        updatedBy: 'Admin'
      },
      {
        id: 'log-2',
        status: 'verified',
        timestamp: '2026-10-07 11:30 AM',
        note: 'ગૂગલ ડ્રાઇવ લિંક ચકાસાઈ. બધી 4 ફાઇલ્સ ડાઉનલોડ કરી લીધી.',
        updatedBy: 'Admin'
      },
      {
        id: 'log-3',
        status: 'editing',
        timestamp: '2026-10-07 02:45 PM',
        note: 'રફ કટ પૂર્ણ. બીટ્સ અનુસાર ફાસ્ટ કટ્સ અને ટ્રાન્ઝિશન સેટ કર્યા.',
        updatedBy: 'Admin'
      },
      {
        id: 'log-4',
        status: 'grading',
        timestamp: '2026-10-07 04:30 PM',
        note: 'કલર ગ્રેડિંગ અને હાઇ-ઇન્ટેન્સિટી સાઉન્ડ ડિઝાઇન સંપન્ન.',
        updatedBy: 'Admin'
      },
      {
        id: 'log-5',
        status: 'completed',
        timestamp: '2026-10-07 06:10 PM',
        note: 'ફાઇનલ 1080x1920 60FPS વીડિયો રેન્ડર થઈ ગયો છે. ડાઉનલોડ માટે ઉપલબ્ધ!',
        updatedBy: 'Admin'
      }
    ],
    finalVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    finalVideoDownloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    finalData: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    finalName: 'GC-2026-8801-Final-Edited-Reel.mp4',
    finalVideoResolution: '1080x1920 (9:16 Vertical FHD)',
    finalVideoFileSize: '48.2 MB',
    deliveryDate: '2026-10-07',
    createdAt: '2026-10-07T10:15:00Z',
    updatedAt: '2026-10-07T18:10:00Z',
    revisionCount: 0
  },
  {
    id: 'GC-2026-8802',
    clientName: 'પ્રિયા શાહ (Priya Shah)',
    clientPhone: '9712398450',
    clientEmail: 'priya.events@gmail.com',
    city: 'સુરત (Surat)',
    category: 'cinematic_wedding',
    title: 'રોયલ વેડિંગ સિનેમેટિક ટીઝર (Royal Wedding Teaser)',
    description: 'લગ્ન અને વરમાળાનો 2 મિનિટનો ભાવુક અને સિનેમેટિક ટીઝર. ગોલ્ડન અવર ટોન અને ધીમી ગતિએ રોમેન્ટિક મ્યુઝિક.',
    aspectRatio: '16:9',
    durationMinutes: 2,
    rushDelivery: false,
    includeSubtitles: false,
    soundDesign: true,
    colorGrading: true,
    uploadMethod: 'cloud_link',
    cloudFootageUrl: 'https://www.dropbox.com/sh/priya-wedding-raw-clips',
    rawFilesCount: 12,
    rawFilesNames: ['varghodo_drone_4k.mov', 'varmala_sony_a7s3.mov', 'mandap_rituals.mov', 'audio_shehnai_track.wav'],
    fileData: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    fileName: 'priya_royal_wedding_raw.mp4',
    estimatedPrice: 1800,
    finalPrice: 1800,
    paymentStatus: 'advance_paid',
    status: 'editing',
    statusLogs: [
      {
        id: 'log-10',
        status: 'received',
        timestamp: '2026-10-08 09:00 AM',
        note: 'ઓર્ડર રજીસ્ટર થયો. 12 ફાઇલ્સ ડ્રોપબોક્સ લિંકથી ચેક કરી.',
        updatedBy: 'Admin'
      },
      {
        id: 'log-11',
        status: 'verified',
        timestamp: '2026-10-08 11:15 AM',
        note: 'Sony S-Log3 પ્રોફાઇલ ફૂટેજ કન્ફર્મ. ટાઇમલાઇન સેટઅપ પૂર્ણ.',
        updatedBy: 'Admin'
      },
      {
        id: 'log-12',
        status: 'editing',
        timestamp: '2026-10-08 03:30 PM',
        note: 'સિનેમેટિક પેસિંગ અને વરમાળા સ્લો-મોશન સીન કટિંગ ચાલુ છે.',
        updatedBy: 'Admin'
      }
    ],
    deliveryDate: '2026-10-10',
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-08T15:30:00Z',
    revisionCount: 0
  },
  {
    id: 'GC-2026-8803',
    clientName: 'જયેશ પ્રજાપતિ (Jayesh Prajapati)',
    clientPhone: '9428512340',
    clientEmail: 'jayesh.tech@gmail.com',
    city: 'રાજકોટ (Rajkot)',
    category: 'youtube_vlog',
    title: 'ટેક ગેજેટ અનબોક્સિંગ વિડીયો (Tech Unboxing Vlog)',
    description: 'નવા સ્માર્ટફોનનું 6 મિનિટનું રિવ્યુ વિડીયો. સ્પષ્ટીકરણ માટે ટેક્સ્ટ ગ્રાફિક્સ અને સ્પીક કટ્સ જરૂરી.',
    aspectRatio: '16:9',
    durationMinutes: 6,
    rushDelivery: false,
    includeSubtitles: true,
    soundDesign: true,
    colorGrading: true,
    uploadMethod: 'file',
    rawFilesCount: 3,
    rawFilesNames: ['main_talking_head.mp4', 'b_roll_macro_camera.mp4', 'mic_audio.wav'],
    fileData: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fileName: 'jayesh_main_talking_head.mp4',
    rawFiles: [
      { name: 'main_talking_head.mp4', size: 84000000, type: 'video/mp4', dataUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
      { name: 'b_roll_macro_camera.mp4', size: 42000000, type: 'video/mp4', dataUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }
    ],
    estimatedPrice: 650,
    paymentStatus: 'pending',
    status: 'verified',
    statusLogs: [
      {
        id: 'log-20',
        status: 'received',
        timestamp: '2026-10-08 01:20 PM',
        note: 'ઓર્ડર નોંધાયો.',
        updatedBy: 'System'
      },
      {
        id: 'log-21',
        status: 'verified',
        timestamp: '2026-10-08 02:40 PM',
        note: 'ઓડિયો અને વિડીયો ફાઇલ્સ ઇન્ટેક્ટ છે. એડિટર ક્યૂમાં મૂકાયો.',
        updatedBy: 'Admin'
      }
    ],
    deliveryDate: '2026-10-09',
    createdAt: '2026-10-08T13:20:00Z',
    updatedAt: '2026-10-08T14:40:00Z',
    revisionCount: 0
  }
];

export const PORTFOLIO_SAMPLES = [
  {
    id: 'sample-1',
    titleGu: 'પ્રીમિયમ સિનેમેટિક એડિટિંગ સ્ટુડિયો વર્કફ્લો',
    titleEn: 'Cinematic Studio Color Grading & Timeline Post-Production',
    category: 'studio',
    categoryLabelGu: 'સ્ટુડિયો ડેસ્ક',
    categoryLabelEn: 'Studio Suite',
    priceEstimate: '₹800 - ₹2000',
    turnaround: '24-48 Hours',
    image: '/src/assets/images/hero_video_editing_studio_1791513305504.jpg',
    descriptionGu: 'ડા-વિંચી રિઝોલ્વ અને પ્રીમિયર પ્રો સાથે ડ્યુઅલ કલર ગ્રેડિંગ મોનિટર પર પર્ફેક્ટ કટિંગ.'
  },
  {
    id: 'sample-2',
    titleGu: 'વાયરલ ઇન્સ્ટાગ્રામ રીલ્સ અને શોર્ટ્સ માસ્ટરક્લાસ',
    titleEn: 'Viral High-Retention Vertical Reels & Shorts',
    category: 'reels',
    categoryLabelGu: 'ઇન્સ્ટા રીલ્સ',
    categoryLabelEn: 'Instagram Reel',
    priceEstimate: '₹150 - ₹350',
    turnaround: '12-24 Hours',
    image: '/src/assets/images/reel_short_editing_preview_1791513322861.jpg',
    descriptionGu: 'એનિમેટેડ સબટાઈટલ, સાઉન્ડ એફએક્સ અને હાઈ એન્ગેજમેન્ટ ટ્રાન્ઝિશન સાથે વાયરલ ફોર્મેટ.'
  },
  {
    id: 'sample-3',
    titleGu: 'રોયલ કલ્ચરલ વેડિંગ સિનેમેટિક હાઇલાઇટ',
    titleEn: 'Traditional Royal Wedding Film & Golden Hour Teaser',
    category: 'wedding',
    categoryLabelGu: 'વેડિંગ ફિલ્મ',
    categoryLabelEn: 'Wedding Film',
    priceEstimate: '₹1200 - ₹2000',
    turnaround: '48-72 Hours',
    image: '/src/assets/images/wedding_cinematic_edit_1791513332978.jpg',
    descriptionGu: 'ગોલ્ડન અવર નેચરલ લાઇટિંગ, 4K સિનેમેટિક કલર ટોન અને ઇમોશનલ મ્યુઝિક સિન્ક.'
  }
];
