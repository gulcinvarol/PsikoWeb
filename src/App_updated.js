// [Imports and Constants]
import React, { useRef, useEffect, useState, useMemo } from "react";
// face-api.js kütüphanesini window'dan alıyoruz
// eslint-disable-next-line
const faceapi = window.faceapi;

// --- HERO IMAGE URL ---
const HERO_IMAGE_URL = "BURAYA_CALISAN_HARICI_URL_YI_YAPISTIRIN"; 

const DEBOUNCE_TIME_MS = 10000; 
const DETECTION_INTERVAL_MS = 300; 

const EMOTION_CONTENT = {
    happy: {
        title: "Harika Bir Gün! Enerjini Kullan.",
        message: "Motivasyonel içerik: Bu enerjini yeni bir şey öğrenmeye veya üretmeye odaklayabilirsin. Kendini şımartmayı unutma!",
        buttonText: "Pozitifliği Paylaş",
        styles: {
            titleColor: "text-gray-900",
            buttonBg: "bg-green-500 hover:bg-green-600",
            animation: "animate-bounce-once",
        }
    },
    sad: {
        title: "Şu An Üzgün Hissediyorsun.",
        message: "Destekleyici, sade içerik: Hislerini anlıyoruz. Küçük bir mola vermek ya da rahatlatıcı bir müzik dinlemek iyi gelebilir. Yanınızdayız.",
        buttonText: "Kendine İyi Bak",
        styles: {
            titleColor: "text-indigo-700", 
            buttonBg: "bg-gray-400 hover:bg-gray-500", 
            animation: "animate-none",
        }
    },
    angry: {
        title: "Derin Bir Nefes Al. Sakinleşelim.",
        message: "Net ve az bilgi: Dikkat dağıtıcı ögelerden kaçın. Sorunun kaynağına odaklanmak için sade bir arayüz seni rahatlatabilir. Birkaç dakika uzaklaşmayı dene.",
        buttonText: "Sakinleşme Egzersizi",
        styles: {
            titleColor: "text-gray-800", 
            buttonBg: "bg-slate-600 hover:bg-slate-700", 
            animation: "animate-none",
        }
    },
    surprised: {
        title: "Yeni Bir Şey mi Öğrendin?",
        message: "Rehberli içerik: Bu şaşkınlığı öğrenme arayışına dönüştürebiliriz. Hangi konuya odaklanmak istersin?",
        buttonText: "Rehberliği Başlat",
        styles: {
            titleColor: "text-purple-700", 
            buttonBg: "bg-purple-400 hover:bg-purple-500", 
            animation: "animate-pulse-slow",
        }
    },
    neutral: {
        title: "Nasıl Bir Gün Geçirmek İstersin?",
        message: "Bilgilendirici içerik: Minimal tasarım ile güncel konulara odaklanabilirsin. Arayüz nötr ve kullanıma hazır. Başlamak için butona tıkla.",
        buttonText: "Başla",
        styles: {
            titleColor: "text-slate-700", 
            buttonBg: "bg-blue-500 hover:bg-blue-600", 
            animation: "animate-none",
        }
    },
    fearful: {
        title: "Güvendesin. Odaklanalım.",
        message: "Derin nefes alıp ver. Sakin ve huzurlu bir ortam yaratmak için arayüzü sade tuttuk. Korkunun üstesinden gelmek için adım atabilirsin.",
        buttonText: "Adım Adım İlerle",
        styles: {
            titleColor: "text-indigo-800",
            buttonBg: "bg-indigo-400 hover:bg-indigo-500",
            animation: "animate-none",
        }
    },
    disgusted: {
        title: "Rahatsız mı Oldun?",
        message: "Hoşlanmadığın bir şeyle karşılaştığında mola vermek en iyisidir. Destekleyici ve doğal tonlarla sana eşlik ediyoruz.",
        buttonText: "Mola Ver",
        styles: {
            titleColor: "text-green-800",
            buttonBg: "bg-lime-500 hover:bg-lime-600",
            animation: "animate-none",
        }
    }
};

const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

const customStyles = `
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js"></script>
<style>
  @keyframes bounce-once {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce-once { animation: bounce-once 1s ease-in-out 1; }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }

  html, body, #root {
      margin: 0; padding: 0; box-sizing: border-box; 
      overflow-x: hidden; min-height: 100vh; width: 100%;
  }
</style>
`;

const waitForFaceApi = async () => {
    let attempts = 0;
    while (typeof window.faceapi === 'undefined' && attempts < 40) {
        await new Promise(resolve => setTimeout(resolve, 250));
        attempts++;
    }
    return typeof window.faceapi !== 'undefined';
};

const PROBLEM_DATA = [
    {
        title: "DEPRESYONDA HİSSEDİYORUM",
        color: "bg-red-600 hover:bg-red-700",
        message: "Sürekli üzüntü ve ilgi kaybı, depresyon belirtisi olabilir. Yalnız değilsiniz.",
        solution: {
            başlık: "Depresyon Belirtileri ve Çözüm Yolları",
            içerik: [
                "1. Belirtiler: İki haftadan uzun süren mutsuzluk, uyku düzeni bozuklukları, enerji eksikliği.",
                "2. Çözüm: Uzman desteği almak, düzenli egzersiz, küçük hedefler belirlemek."
            ]
        }
    },
    {
        title: "YOĞUN ANKSİYETE / KAYGI",
        color: "bg-yellow-500 hover:bg-yellow-600",
        message: "Endişe ve panik ataklar yaşam kalitenizi düşürüyorsa, kontrolü geri alabiliriz.",
        solution: {
            başlık: "Anksiyete Yönetimi ve Belirtileri",
            içerik: [
                "1. Belirtiler: Kalp çarpıntısı, nefes darlığı, sürekli gerginlik hissi, kaçınma davranışları.",
                "2. Çözüm: Nefes egzersizleri, farkındalık meditasyonu, tetikleyicileri belirleme ve uzmanla çalışma."
            ]
        }
    },
    {
        title: "STRES VE TÜKENMİŞLİK",
        color: "bg-blue-600 hover:bg-blue-700",
        message: "İş/yaşam dengesizliği sizi yoruyor mu? Enerjinizi yeniden kazanma yollarını keşfedin.",
        solution: {
            başlık: "Stres ve Tükenmişlikle Başa Çıkma",
            içerik: [
                "1. Belirtiler: Kronik yorgunluk, odaklanma güçlüğü, sinirlilik ve performansta düşüş.",
                "2. Çözüm: Sınır koyma, hobi edinme, uyku düzenine dikkat etme ve gerekirse profesyonel destek alma."
            ]
        }
    },
    {
        title: "İLİŞKİ PROBLEMLERİ",
        color: "bg-green-600 hover:bg-green-700",
        message: "İletişim kopuklukları veya çatışmalar ilişkilerinizi yıpratıyorsa, sağlıklı bağlar kurabiliriz.",
        solution: {
            başlık: "Sağlıklı İlişki Kurma İpuçları",
            içerik: [
                "1. Belirtiler: Sürekli tartışma, küs kalma, duygusal ihtiyaçların karşılanmaması.",
                "2. Çözüm: Empati kurma, aktif dinleme, 'ben' dili kullanma ve çift terapisini değerlendirme."
            ]
        }
    }
];

// Navigation Bar
const Navigation = () => {
    const [showAboutTooltip, setShowAboutTooltip] = useState(false);
    const navItems = ["HAKKIMIZDA", "HİZMETLER", "UZMANLARIMIZ", "BLOG", "İLETİŞİM"];
    
    return (
        <nav className="w-full bg-white shadow-md z-50 sticky top-0"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start h-16">
                <div className="flex items-center space-x-12">
                    <div className="flex-shrink-0"> 
                        <span className="text-2xl font-extrabold text-indigo-700">PsikoWeb</span>
                    </div>

                    <div className="hidden sm:flex items-center space-x-6"> 
                        {navItems.map(item => {
                            const isAbout = item === "HAKKIMIZDA";
                            return (
                                <div key={item} className="relative">
                                    <a 
                                        href={`#${item.toLowerCase()}`} 
                                        className="border-transparent text-gray-600 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-150 whitespace-nowrap"
                                        onMouseEnter={() => isAbout && setShowAboutTooltip(true)}
                                        onMouseLeave={() => isAbout && setShowAboutTooltip(false)}
                                    >
                                        {item}
                                    </a>
                                    {isAbout && showAboutTooltip && (
                                        <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-2xl p-4 z-50 border-l-4 border-indigo-600">
                                            <h3 className="font-bold text-indigo-700 mb-2">PsikoWeb Geçmişi</h3>
                                            <p className="text-sm text-gray-700 mb-2"><strong>Kuruluş:</strong> 2020 yılında mental sağlık farkındalığını artırmak amacıyla kurulmuştur.</p>
                                            <p className="text-sm text-gray-700 mb-2"><strong>Misyon:</strong> Herkes için ulaşılabilir psikolojik destek ve eğitim sağlamak.</p>
                                            <p className="text-sm text-gray-700 mb-3"><strong>Vizyon:</strong> Toplumun ruh sağlığında olumlu değişim yaratmak.</p>
                                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 border-l-2 border-indigo-400">
                                                <p className="mb-2 italic">"Depresyondan çıkmamı PsikoWeb'e borçluyum. Buradaki bilgiler ve destek beni kurtardı." - Ayşe K., 28</p>
                                                <p className="italic">"İç huzuru bulmam için bu platforma çok teşekkürler." - Mehmet T., 35</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0 ml-auto"> 
                    <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150 shadow-lg whitespace-nowrap">
                        RANDEVU AL
                    </button>
                </div>
            </div>
        </nav>
    );
};

const StatsCard = () => (
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xs w-full lg:mt-0 mt-8 text-center border-t-4 border-indigo-500">
        <div className="text-5xl font-extrabold text-indigo-700 mb-2">1000+</div>
        <p className="text-lg font-semibold text-gray-700 mb-4">Mutlu Kullanıcı</p>
        <p className="text-sm text-gray-500 mb-4">Her gün sayfamız sayesinde kendini daha iyi hissediyor ve huzurla buluşuyor.</p>
        <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600 text-left">
            <p className="text-sm text-gray-700 italic">"Bu sayfa sayesinde depresyondan çıktım ve iç huzurumu buldum. PsikoWeb'e çok teşekkürler!"</p>
            <p className="text-xs text-gray-600 mt-2 font-semibold">- Kullanıcı Testimonial</p>
        </div>
    </div>
);

const HeroSection = () => (
    <div className="bg-gray-50 flex items-center w-full min-h-[70vh]"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between py-16"> 
            
            <div className="lg:max-w-md py-10 text-left text-gray-900"> 
                <p className="text-sm tracking-widest mb-2 opacity-80 text-indigo-600 font-medium">İYİLİĞİ VE ANLAYIŞI YAYMAK İÇİN BURADAYIZ</p>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">İç Huzurunuzun Anahtarı Sizsiniz</h1>
                <p className="text-base mb-8 opacity-90 max-w-md">
                    Yaşam karmaşıktır. Kişinin psikolojisini etkileyen dış faktörleri (stres, aile baskısı, iş yükü...) her zaman anlıyor ve size özel destek sunuyoruz.
                </p>
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full opacity-100"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full opacity-50"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full opacity-50"></div>
                </div>
            </div>

            <div className="hidden lg:flex justify-center items-center w-full max-w-lg lg:mx-8">
                <img 
                    src={HERO_IMAGE_URL || 'https://placehold.co/400x400/fff/000?text=PSIKOWEB+Gorsel'} 
                    alt="PsikoWeb Huzur Görseli"
                    className="rounded-full shadow-xl object-cover w-72 h-72 xl:w-96 xl:h-96"
                />
            </div>
            
            <div className="flex-shrink-0 lg:w-auto w-full flex justify-center lg:block">
                <StatsCard />
            </div>

        </div>
    </div>
);

const ProblemCards = () => {
    const [selectedProblem, setSelectedProblem] = useState(null);

    const Card = ({ problem }) => (
        <div 
            className={`${problem.color} p-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out cursor-pointer text-white flex flex-col justify-between h-full`}
            onClick={() => setSelectedProblem(problem)}
        >
            <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
            <p className="text-sm opacity-90 mb-4">{problem.message}</p>
            <span className="text-xs font-semibold uppercase opacity-70">Çözüm Yollarını Keşfet →</span>
        </div>
    );
    
    const SolutionViewer = ({ problem, onClose }) => (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[110] p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-xl w-full relative transform transition duration-300">
                <button 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold text-indigo-700 mb-4">{problem.solution.başlık}</h2>
                {problem.solution.içerik.map((line, index) => (
                    <p key={index} className="text-gray-700 mb-4 border-l-4 border-indigo-300 pl-4 leading-relaxed">
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Yaygın Psikolojik Sorunlar</h2>
            
            <div style={{ gridTemplateColumns: "repeat(4, 1fr)" }} className="grid gap-6">
                {PROBLEM_DATA.map((problem, index) => (
                    <Card key={index} problem={problem} />
                ))}
            </div>

            {selectedProblem && (
                <SolutionViewer problem={selectedProblem} onClose={() => setSelectedProblem(null)} />
            )}
        </div>
    );
};

const BookRecommendations = () => {
    const books = [
        {
            title: "Duygusal Zeka",
            author: "Daniel Goleman",
            color: "bg-indigo-500",
            description: "Zihinsel sağlığımız ve duygularımızı anlama rehberi"
        },
        {
            title: "Düşüncelerimizi Yönetmek",
            author: "David D. Burns",
            color: "bg-purple-500",
            description: "Depresyon ve anksiyeteyi yönetmek için bilişsel teknikler"
        },
        {
            title: "Farkındalık Üzerine",
            author: "Jon Kabat-Zinn",
            color: "bg-pink-500",
            description: "Meditasyon ve mindfulness pratiğinin gücü"
        },
        {
            title: "Bağlanma Teorisi",
            author: "John Bowlby",
            color: "bg-rose-500",
            description: "İlişkilerimizi anlamak için temel bilgiler"
        }
    ];

    return (
        <div className="w-full bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Önerilen Psikoloji Kitapları</h2>
                <p className="text-center text-gray-600 mb-8">Ruh sağlığınız hakkında daha fazla bilgi almak için</p>
                
                <div style={{ gridTemplateColumns: "repeat(4, 1fr)" }} className="grid gap-6">
                    {books.map((book, index) => (
                        <div key={index} className={`${book.color} p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 text-white`}>
                            <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                            <p className="text-sm font-semibold opacity-90 mb-3">{book.author}</p>
                            <p className="text-sm opacity-85">{book.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BookQuote = () => (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <p className="text-white text-lg italic mb-2">"Kitap okumak ruhun gıdasıdır. Bir kitap açtığında, dünyanın kapıları açılır."</p>
                <p className="text-indigo-100 text-sm">- Anonim</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                {[
                    { title: "Şu Anı Yaşa", desc: "Kitaplar bize şimdiye odaklanmayı öğretir" },
                    { title: "İçsel Huzur", desc: "Bilgi ve hikaye sayesinde iç barış buluruz" },
                    { title: "Hayat Değişimi", desc: "Kitaplar bize yeni perspektifler sunar" },
                    { title: "Ruh Beslemesi", desc: "Okuma, ruh sağlığı için terapidir" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 text-white text-center hover:bg-white/20 transition">
                        <h4 className="font-bold mb-1">{item.title}</h4>
                        <p className="text-xs opacity-90">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const MainContent = () => {
    const { displayedEmotion, currentTheme, colorMap, modelsLoaded, currentRawEmotion } = React.useContext(AppContext); 
    
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div id="tez-kart" className="flex flex-col items-center justify-center pt-8">
                <div 
                    className="w-full max-w-lg p-10 rounded-2xl bg-white/95 shadow-2xl transition-all duration-1000 ease-in-out z-50 text-center mx-auto my-8"
                    style={{
                        boxShadow: `0 10px 30px ${currentTheme.styles.titleColor.replace('text-', '').replace('-', '/').replace('900', '40')}`,
                    }}
                >
                    <h1 className={`text-4xl sm:text-5xl font-extrabold mb-5 transition-colors duration-1000 ${currentTheme.styles.titleColor}`}>
                        {currentTheme.title}
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        {currentTheme.message}
                    </p>
                    
                    <button
                        className={`text-white py-3 px-8 rounded-xl text-xl font-semibold cursor-pointer shadow-lg active:scale-95 transition-all duration-500 transform ${currentTheme.styles.buttonBg} ${currentTheme.styles.animation}`} 
                    >
                        {currentTheme.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AppContext = React.createContext();

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectTimerRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentRawEmotion, setCurrentRawEmotion] = useState('neutral');
  const [displayedEmotion, setDisplayedEmotion] = useState('neutral');
  
  const currentTheme = useMemo(() => {
    return EMOTION_CONTENT[displayedEmotion] || EMOTION_CONTENT.neutral;
  }, [displayedEmotion]);

  const colorMap = useMemo(() => ({
    happy:      "#FFD600",
    sad:        "#42A5F5",
    angry:      "#263238", 
    surprised:  "#FFA726", 
    neutral:    "#CFD8DC",
    fearful:    "#7E57C2",
    disgusted:  "#8BC34A",
  }), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const apiReady = await waitForFaceApi();
        if (!apiReady) return;

        const faceapi = window.faceapi;

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        if (!mounted) return;
        setModelsLoaded(true);
        await startVideo();
      } catch (err) {
        console.error("Model loading error:", err);
      }
    })();
    return () => {
      mounted = false;
      stopVideo();
    };
  }, []);
  
  useEffect(() => {
      if (currentRawEmotion === displayedEmotion) return; 
      const timer = setTimeout(() => {
          setDisplayedEmotion(currentRawEmotion);
      }, DEBOUNCE_TIME_MS); 
      return () => clearTimeout(timer);
  }, [currentRawEmotion, displayedEmotion]); 

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((e) => console.error("Video playback error:", e));
      }
    } catch (err) {
      console.error("Camera access denied! Error:", err.name, err.message);
    }
  };

  const stopVideo = () => {
    if (detectTimerRef.current) {
      clearInterval(detectTimerRef.current);
      detectTimerRef.current = null;
    }
    const v = videoRef.current;
    if (v?.srcObject) {
      v.srcObject.getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
  };

  const handleVideoReady = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const faceapi = window.faceapi;

    if (!video || !canvas || !modelsLoaded || !faceapi) return;
    if (!video.videoWidth || !video.videoHeight || video.readyState < 2) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    
    canvas.width = displaySize.width;
    canvas.height = displaySize.height; 
    faceapi.matchDimensions(canvas, displaySize);

    if (detectTimerRef.current) clearInterval(detectTimerRef.current);

    detectTimerRef.current = setInterval(async () => {
      try {
        if (video.paused || video.ended) return;

        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections && detections.length > 0) {
          const expr = detections[0].expressions;
          const [label] = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];
          setCurrentRawEmotion(label);
        } else {
          setCurrentRawEmotion('neutral');
        }
      } catch (e) {
        //
      }
    }, DETECTION_INTERVAL_MS); 
  };
  
  const contextValue = {
      displayedEmotion,
      currentTheme,
      colorMap,
      modelsLoaded,
      currentRawEmotion, 
  };

  return (
    <AppContext.Provider value={contextValue}>
        <div className="min-h-screen">
            <div dangerouslySetInnerHTML={{ __html: customStyles }} />
            <Navigation />
            <HeroSection />

            <div style={{ backgroundColor: colorMap[displayedEmotion] || colorMap.neutral }} className="w-full flex flex-col items-center justify-start relative transition-colors duration-1000 min-h-[50vh]"> 
                <ProblemCards />
                <BookRecommendations />
                <BookQuote />
                <MainContent />
                
                <div className="absolute bottom-4 right-4 z-10 opacity-0 pointer-events-none w-[1px] h-[1px]">
                    <video
                        ref={videoRef}
                        onLoadedMetadata={handleVideoReady}
                        onPlay={handleVideoReady}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: '1px', height: '1px', position: 'absolute' }}
                    />
                    <canvas 
                        ref={canvasRef} 
                        style={{ width: '1px', height: '1px', position: 'absolute' }}
                    />
                </div>
                
                <div className="fixed bottom-4 left-4 p-3 bg-gray-900/80 text-white rounded-lg shadow-xl z-50 text-left">
                    <p className="m-0 font-bold text-lg">
                        Displayed Emotion: <span style={{ color: colorMap[displayedEmotion] }}>{displayedEmotion.toUpperCase()}</span>
                    </p>
                    <p className="m-0 text-sm opacity-80 mt-1">
                        Raw Detected: <span className="font-bold">{currentRawEmotion.toUpperCase()}</span>
                    </p>
                    <p className="m-0 text-xs opacity-60">(Color updates every 10 seconds)</p>
                    {!modelsLoaded && (
                        <p className="m-0 mt-1 text-sm text-yellow-300 font-bold">AI Models Loading...</p>
                    )}
                </div>

            </div>
        </div>
    </AppContext.Provider>
    );
}
