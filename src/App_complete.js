import React, { useRef, useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const AppContext = React.createContext();

const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=500&fit=crop";
const DEBOUNCE_TIME_MS = 2000;
const DETECTION_INTERVAL_MS = 300;
const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

const EMOTION_CONTENT = {
    happy: { title: "Harika Bir Gün! Enerjini Kullan.", message: "Motivasyonel içerik: Bu enerjini yeni bir şey öğrenmeye veya üretmeye odaklayabilirsin.", buttonText: "Pozitifliği Paylaş", styles: { titleColor: "text-gray-900", buttonBg: "bg-green-500" } },
    sad: { title: "Şu An Üzgün Hissediyorsun.", message: "Destekleyici içerik: Hislerini anlıyoruz. Yanınızdayız.", buttonText: "Kendine İyi Bak", styles: { titleColor: "text-indigo-700", buttonBg: "bg-gray-400" } },
    angry: { title: "Derin Bir Nefes Al. Sakinleşelim.", message: "Net içerik: Dikkat dağıtıcılardan kaçın.", buttonText: "Sakinleşme Egzersizi", styles: { titleColor: "text-gray-800", buttonBg: "bg-slate-600" } },
    surprised: { title: "Yeni Bir Şey mi Öğrendin?", message: "Rehberli içerik: Bu şaşkınlığı öğrenme arayışına dönüştürebiliriz.", buttonText: "Rehberliği Başlat", styles: { titleColor: "text-purple-700", buttonBg: "bg-purple-400" } },
    neutral: { title: "Nasıl Bir Gün Geçirmek İstersin?", message: "Bilgilendirici içerik: Arayüz nötr ve kullanıma hazır.", buttonText: "Başla", styles: { titleColor: "text-slate-700", buttonBg: "bg-blue-500" } },
    fearful: { title: "Güvendesin. Odaklanalım.", message: "Derin nefes alıp ver. Sakin ortam yaratmak için arayüzü sade tuttuk.", buttonText: "Adım Adım İlerle", styles: { titleColor: "text-indigo-800", buttonBg: "bg-indigo-400" } },
    disgusted: { title: "Rahatsız mı Oldun?", message: "Hoşlanmadığın bir şeyle karşılaştığında mola vermek en iyisidir.", buttonText: "Mola Ver", styles: { titleColor: "text-green-800", buttonBg: "bg-lime-500" } }
};

const customStyles = `<script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js"></script>`;

const waitForFaceApi = async () => {
    let attempts = 0;
    while (typeof window.faceapi === 'undefined' && attempts < 40) {
        await new Promise(resolve => setTimeout(resolve, 250));
        attempts++;
    }
    return typeof window.faceapi !== 'undefined';
};

const PROBLEM_DATA = [
    { title: "DEPRESYONDA HİSSEDİYORUM", color: "bg-red-600 hover:bg-red-700", message: "Sürekli üzüntü ve ilgi kaybı, depresyon belirtisi olabilir." },
    { title: "YOĞUN ANKSİYETE / KAYGI", color: "bg-yellow-500 hover:bg-yellow-600", message: "Endişe ve panik ataklar yaşam kalitenizi düşürüyorsa, kontrol geri alabiliriz." },
    { title: "STRES VE TÜKENM İŞLİK", color: "bg-blue-600 hover:bg-blue-700", message: "İş/yaşam dengesizliği sizi yoruyor mu?" },
    { title: "İLİŞKİ PROBLEMLERİ", color: "bg-green-600 hover:bg-green-700", message: "İletişim kopuklukları veya çatışmalar ilişkilerinizi yıpratıyorsa." }
];

// ChatBot Bileşeni
const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Merhaba! 💬 Ben PsikoWeb Asistanı. Size nasıl yardımcı olabilirim?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const botResponses = {
        'merhaba': 'Merhaba! 💬 Size nasıl yardımcı olabilirim?',
        'yardım': 'Şu konularda destek verebilirim:\n🧠 Ruh Sağlığı\n❤️ İlişkiler\n📖 Kişisel Gelişim',
        'depresyon': '😢 Depresyon Belirtileri:\n• Mutsuzluk\n• Enerji kaybı\n• Uyku sorunu\n\nÇözümler: Egzersiz, Meditasyon, Profesyonel Destek',
        'anksiyete': '😰 Anksiyete Yönetimi:\n1. Derin nefes al\n2. Rahatlama egzersizi\n3. Meditasyon yap',
        'iletisim': '📞 Bize Ulaşın:\nEmail: info@psikiweb.com\nTel: +90 555 123 4567'
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const userMessage = { id: messages.length + 1, text: inputValue, sender: 'user' };
        setMessages([...messages, userMessage]);
        setInputValue('');

        setTimeout(() => {
            const lowerInput = inputValue.toLowerCase();
            let botResponse = '😊 Üzgünüm, anlamadım. Başka bir şey sormak ister misin?';
            
            Object.keys(botResponses).forEach(key => {
                if (lowerInput.includes(key)) {
                    botResponse = botResponses[key];
                }
            });

            setMessages(prev => [...prev, { id: prev.length + 1, text: botResponse, sender: 'bot' }]);
        }, 500);
    };

    return (
        <div className="fixed bottom-4 right-4 z-40">
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-[500px]">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-bold">PsikoWeb Asistanı 💬</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1">×</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Mesajınız..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Gönder</button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition transform hover:scale-110">
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
};

// Navigation
const Navigation = () => {
    const navItems = ["HAKKIMIZDA", "HİZMETLER", "UZMANLARIMIZ", "BLOG", "İLETİŞİM"];
    return (
        <nav className="w-full bg-white shadow-md z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Link to="/" className="text-2xl font-extrabold text-indigo-700 hover:text-indigo-900">PsikoWeb</Link>
                <div className="hidden sm:flex items-center space-x-6">
                    {navItems.map(item => (
                        <Link key={item} to={`/${item.toLowerCase().replace(/\s/g, '-')}`} className="text-gray-600 hover:text-indigo-700 font-medium transition">
                            {item}
                        </Link>
                    ))}
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">RANDEVU AL</button>
            </div>
        </nav>
    );
};

// Hero Section
const HeroSection = () => {
    const { colorMap, displayedEmotion } = React.useContext(AppContext);
    return (
        <div style={{ backgroundColor: colorMap[displayedEmotion] || colorMap.neutral, transition: 'background-color 1s ease-in-out' }} className="flex items-center w-full min-h-[70vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between py-16">
                <div className="lg:max-w-md text-left text-gray-900">
                    <p className="text-sm tracking-widest mb-2 text-indigo-600 font-medium">AYILLIGI VE ANLAYIŞI YAYMAK İÇİN BURADAYIZ</p>
                    <h1 className="text-5xl font-bold mb-4">İç Huzurunuzun Anahtar Sizsiniz</h1>
                    <p className="text-base mb-8 opacity-90">Yaşam karmaşıktır. Kişinin psikolojisini etkileyen dış faktörleri her zaman anlıyor ve size özel destek sunuyoruz.</p>
                </div>
                <div className="hidden lg:flex justify-center items-center">
                    <img src={HERO_IMAGE_URL} alt="Huzur Görseli" className="rounded-full shadow-xl object-cover w-72 h-72 xl:w-96 xl:h-96" />
                </div>
            </div>
        </div>
    );
};

// Problem Cards
const ProblemCards = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Yaygın Psikolojik Sorunlar</h2>
            <div style={{ gridTemplateColumns: "repeat(4, 1fr)" }} className="grid gap-6">
                {PROBLEM_DATA.map((problem, index) => (
                    <div key={index} className={`${problem.color} p-6 rounded-xl shadow-lg text-white cursor-pointer hover:shadow-2xl transition`}>
                        <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
                        <p className="text-sm opacity-90">{problem.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Book Recommendations
const BookRecommendations = () => {
    const books = [
        { title: "Duygusal Zeka", author: "Daniel Goleman", color: "bg-indigo-500" },
        { title: "Düşüncelerimizi Yönetmek", author: "David D. Burns", color: "bg-purple-500" },
        { title: "Farkındalık Üzerine", author: "Jon Kabat-Zinn", color: "bg-pink-500" },
        { title: "Bağlanma Teorisi", author: "John Bowlby", color: "bg-rose-500" }
    ];

    return (
        <div className="w-full bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Önerilen Psikoloji Kitapları</h2>
                <p className="text-center text-gray-600 mb-8">Ruh sağlığınız hakkında daha fazla bilgi almak için</p>
                <div style={{ gridTemplateColumns: "repeat(4, 1fr)" }} className="grid gap-6">
                    {books.map((book, index) => (
                        <div key={index} className={`${book.color} p-6 rounded-lg shadow-lg text-white hover:scale-105 transition`}>
                            <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                            <p className="text-sm font-semibold opacity-90">{book.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Content Card
const MainContent = () => {
    const { currentTheme } = React.useContext(AppContext);
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-lg p-10 rounded-2xl bg-white/95 shadow-2xl text-center">
                    <h1 className={`text-5xl font-extrabold mb-5 ${currentTheme.styles.titleColor}`}>{currentTheme.title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{currentTheme.message}</p>
                    <button className={`text-white py-3 px-8 rounded-xl text-xl font-semibold ${currentTheme.styles.buttonBg} shadow-lg hover:shadow-xl transition`}>
                        {currentTheme.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// About Section
const AboutSection = () => (
    <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Hakkımızda</h2>
            <p className="text-lg text-gray-700 mb-4">PsikoWeb, 2020 yılında mental sağlık farkındalığını artırmak amacıyla kurulmuştur. Misyonumuz: Herkes için uygun, profesyonel ve etkili destek sunmak.</p>
            <p className="text-lg text-gray-700">Vizyonumuz ise toplumun ruh sağlığında olumlu değişim yaratmaktır.</p>
        </div>
    </div>
);

// Detail Pages
const DetailPage = ({ title, children }) => {
    const [displayedEmotion] = useState('neutral');
    const colorMap = { happy: "#FFD700", sad: "#A0CFE9", angry: "#1A237E", surprised: "#E1BEE7", neutral: "#F9F9F9", fearful: "#D7BDE2", disgusted: "#A9DFBF" };
    const contextValue = { displayedEmotion, colorMap };

    return (
        <AppContext.Provider value={contextValue}>
            <div style={{ backgroundColor: colorMap[displayedEmotion], transition: 'background-color 1s ease-in-out' }} className="min-h-screen w-full flex flex-col">
                <Navigation />
                <div className="w-full p-8">{children}</div>
                <ChatBot />
            </div>
        </AppContext.Provider>
    );
};

const HakkimizdaPage = () => <DetailPage title="Hakkımızda"><AboutSection /></DetailPage>;
const HizmetlerPage = () => <DetailPage title="Hizmetler"><h1 className="text-4xl font-bold mb-4">Sunduğumuz Hizmetler</h1><p>Profesyonel psikolojik danışmanlık, eğitim, meditasyon ve daha fazlası...</p></DetailPage>;
const UzmanlarPage = () => <DetailPage title="Uzmanlarımız"><h1 className="text-4xl font-bold mb-4">Uzmanlarımız</h1><p>Deneyimli psikologlar ve danışmanlarımız her zaman yardımcı olmaya hazır.</p></DetailPage>;
const BlogPage = () => <DetailPage title="Blog"><h1 className="text-4xl font-bold mb-4">Blog ve Makaleler</h1><p>Ruh sağlığı, psikoloji ve yaşam kalitesi hakkında makaleler...</p></DetailPage>;
const IletisimPage = () => <DetailPage title="İletişim"><h1 className="text-4xl font-bold mb-4">İletişim</h1><p>Email: info@psikiweb.com | Tel: +90 555 123 4567</p></DetailPage>;

// HomePage
const HomePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detectTimerRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [currentRawEmotion, setCurrentRawEmotion] = useState('neutral');
    const [displayedEmotion, setDisplayedEmotion] = useState('neutral');

    const currentTheme = useMemo(() => EMOTION_CONTENT[displayedEmotion] || EMOTION_CONTENT.neutral, [displayedEmotion]);

    const colorMap = useMemo(() => ({
        happy: "#FFD700",
        sad: "#A0CFE9",
        angry: "#1A237E",
        surprised: "#E1BEE7",
        neutral: "#F9F9F9",
        fearful: "#D7BDE2",
        disgusted: "#A9DFBF",
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
        const timer = setTimeout(() => setDisplayedEmotion(currentRawEmotion), DEBOUNCE_TIME_MS);
        return () => clearTimeout(timer);
    }, [currentRawEmotion, displayedEmotion]);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch((e) => console.error("Video playback error:", e));
            }
        } catch (err) {
            console.error("Camera access denied!", err);
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
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })).withFaceLandmarks().withFaceExpressions();
                if (detections && detections.length > 0) {
                    const expr = detections[0].expressions;
                    const [label] = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];
                    setCurrentRawEmotion(label);
                } else {
                    setCurrentRawEmotion('neutral');
                }
            } catch (e) {}
        }, DETECTION_INTERVAL_MS);
    };

    const contextValue = { displayedEmotion, currentTheme, colorMap, modelsLoaded, currentRawEmotion };

    return (
        <AppContext.Provider value={contextValue}>
            <div style={{ backgroundColor: colorMap[displayedEmotion] || colorMap.neutral, transition: 'background-color 1s ease-in-out' }} className="min-h-screen w-full flex flex-col">
                <div dangerouslySetInnerHTML={{ __html: customStyles }} />
                <Navigation />
                <HeroSection />
                <div style={{ backgroundColor: colorMap[displayedEmotion] || colorMap.neutral }} className="w-full flex flex-col items-center justify-start">
                    <ProblemCards />
                    <BookRecommendations />
                    <MainContent />
                    <ChatBot />
                    <div className="absolute bottom-4 right-4 z-10 opacity-0 pointer-events-none w-[1px] h-[1px]">
                        <video ref={videoRef} onLoadedMetadata={handleVideoReady} onPlay={handleVideoReady} autoPlay muted playsInline style={{ width: '1px', height: '1px', position: 'absolute' }} />
                        <canvas ref={canvasRef} style={{ width: '1px', height: '1px', position: 'absolute' }} />
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

// Main App
export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hakkimizda" element={<HakkimizdaPage />} />
                <Route path="/hizmetler" element={<HizmetlerPage />} />
                <Route path="/uzmanlarimiz" element={<UzmanlarPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/iletisim" element={<IletisimPage />} />
            </Routes>
        </Router>
    );
}
