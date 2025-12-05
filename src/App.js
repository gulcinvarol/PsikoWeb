import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const AppContext = React.createContext();

const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=500&fit=crop";
const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
const EMOTION_COLORS = {
    happy: '#FFD700', sad: '#A0CFE9', angry: '#1A237E', surprised: '#E1BEE7',
    neutral: '#F9F9F9', fearful: '#D7BDE2', disgusted: '#A9DFBF'
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

// ChatBot
const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ id: 1, text: "Merhaba! 💬 Ben PsikoWeb Copilot.", sender: 'bot' }]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const getBotResponse = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('depres')) return "Depresyon önemli bir konudur. Profesyonel yardım alabilirsiniz.";
        if (lower.includes('anksiyete') || lower.includes('kaygi')) return "Anksiyete yönetimi için meditasyon ve terapiler etkilidir.";
        return "Anladım. Daha fazla bilgi için sayfamıza bakabilirsiniz.";
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: inputValue, sender: 'user' }]);
            setInputValue('');
            setTimeout(() => {
                setMessages(prev => [...prev, { id: prev.length + 1, text: getBotResponse(inputValue), sender: 'bot' }]);
            }, 500);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {isOpen && (
                <div className="bg-white rounded-xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold">PsikoWeb Copilot 🤖</h3>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 bg-gray-100 flex gap-2">
                        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Mesaj..." className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Gönder</button>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl">💬</button>
        </div>
    );
};

// Navigation
const Navigation = () => {
    return (
        <nav className="sticky top-0 z-40 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">PsikoWeb</Link>
                <div className="flex gap-4">
                    <Link to="/" className="hover:text-blue-600 font-semibold">Ana Sayfa</Link>
                    <Link to="/hakkimizda" className="hover:text-blue-600 font-semibold">Hakkımızda</Link>
                    <Link to="/hizmetler" className="hover:text-blue-600 font-semibold">Hizmetler</Link>
                    <Link to="/uzmanlar" className="hover:text-blue-600 font-semibold">Uzmanlar</Link>
                    <Link to="/blog" className="hover:text-blue-600 font-semibold">Blog</Link>
                    <Link to="/iletisim" className="hover:text-blue-600 font-semibold">İletişim</Link>
                </div>
            </div>
        </nav>
    );
};

// HomePage
const HomePage = () => {
    const context = React.useContext(AppContext);
    const { displayedEmotion, colorMap } = context;

    return (
        <div style={{ backgroundColor: colorMap[displayedEmotion] || colorMap.neutral, transition: 'background-color 1s ease-in-out' }} className="min-h-screen flex flex-col">
                <div dangerouslySetInnerHTML={{ __html: customStyles }} />
                <div className="py-16 max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-12">
                    <div className="flex-1">
                        <h1 className="text-6xl font-bold text-gray-900 mb-6">İç Huzurunuzun Anahtar Burada</h1>
                        <p className="text-xl text-gray-700 mb-4">PsikoWeb, modern ruh sağlığı hizmetlerinin kapısı. Uzman psikologlarımız buradayız.</p>
                        <p className="text-lg text-gray-600 mb-4">Günümüzün hızlı yaşamında stresi, anksiyeteyi, depresyonu ve ilişki sorunlarını yönetmek zorlaşmıştır. İç dünyamızda yaşanan türbülans, dış dünyamızı etkilemektedir. PsikoWeb, bu zorlu dönem de sizin yanınızda olmak, profesyonel rehberlikle size ışık tutmak için kurulmuştur.</p>
                        <p className="text-lg text-gray-600 mb-4">Güvenli, gizli ve profesyonel ortamda, yaşadığınız zorlukları çözmek için biz siziniz. Psikologlarımız, size sadece tavsiye vermekle kalmaz, sizinle birlikte adım adım ilerleyerek sağlıklı bir ruh haline ulaşmanıza yardımcı olur.</p>
                        <p className="text-lg text-gray-600 mb-8">Yüzlerce kişinin yaşam kalitesini iyileştirmiş olan testimonial'ler, bizim başarı hikayesidir. Siz de bu başarı hikayelerinin bir parçası olabilirsiniz. İlk adımı atmaktan korkmayın.</p>
                        <Link to="/iletisim" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg transition text-lg inline-block">Şimdi Başla - İlk Adımı At</Link>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-8">
                        <img src={HERO_IMAGE_URL} alt="Meditation" className="rounded-lg shadow-lg w-80 h-80 object-cover" />
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center w-full">
                            <h3 className="text-5xl font-bold text-green-600 mb-3">+1000</h3>
                            <p className="text-xl text-gray-700 font-semibold mb-3">Mutlu Kullanıcı</p>
                            <p className="text-lg text-gray-600 mb-4">Hayatlarında olumlu değişim yaşayan insanlar</p>
                            <p className="text-sm text-blue-600 font-semibold">Siz de bu başarı hikayelerinin parçası olabilirsiniz ✨</p>
                        </div>
                    </div>
                </div>
                <ChatBot />
                
                {/* Psikolojik Sorun Kartları */}
                <div className="py-16 max-w-7xl mx-auto px-6 w-full">
                    <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center">Belirtiler Tanıyın, Çözümü Bulun</h2>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">😔</span>
                                <h3 className="text-2xl font-bold text-blue-600">Depresyonda mıyım?</h3>
                            </div>
                            <div className="mb-6 pb-6 border-b-2 border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-3">Belirtiler:</h4>
                                <ul className="text-gray-700 space-y-2 text-sm">
                                    <li>• Sürekli üzüntü ve boşluk hissi</li>
                                    <li>• Enerji kaybı ve bitkinlik</li>
                                    <li>• Uyku ve iştah değişiklikleri</li>
                                    <li>• Konsantrasyon güçlüğü</li>
                                    <li>• Umutsuzluk ve değersizlik hissi</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3">Çözüm:</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">Profesyonel terapist ile görüşün, bilişsel davranış terapisi (BDT) deneyin, fiziksel aktivite yapın, sosyal destek alın ve düzenli uyku rutini oluşturun.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">😰</span>
                                <h3 className="text-2xl font-bold text-blue-600">Anksiyete Bozukluğu?</h3>
                            </div>
                            <div className="mb-6 pb-6 border-b-2 border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-3">Belirtiler:</h4>
                                <ul className="text-gray-700 space-y-2 text-sm">
                                    <li>• Aşırı endişe ve kaygı</li>
                                    <li>• Kalp çarpıntısı ve nefes darlığı</li>
                                    <li>• Kasılı kaslar ve terleme</li>
                                    <li>• Uyku problemleri</li>
                                    <li>• Dikkat dağınıklığı ve irritabilite</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3">Çözüm:</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">Nefes egzersizleri ve mindfulness meditasyonu yapın, progresif kas gevşetme tekniği öğrenin, anksiyeteyi tetikleyen durumlardan kaçınmayın ve terapist desteği alın.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">💔</span>
                                <h3 className="text-2xl font-bold text-blue-600">İlişki Sorunları</h3>
                            </div>
                            <div className="mb-6 pb-6 border-b-2 border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-3">Belirtiler:</h4>
                                <ul className="text-gray-700 space-y-2 text-sm">
                                    <li>• Sık çatışmalar ve anlaşmazlıklar</li>
                                    <li>• İletişim kopukluğu</li>
                                    <li>• Duygusal uzaklaşma</li>
                                    <li>• Güven sorunu</li>
                                    <li>• Cinsel ilişkide sorunlar</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-3">Çözüm:</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">Çift terapisine başlayın, açık ve dürüst iletişim kurun, empati geliştirin, profesyonel danışmanlık alın ve ilişkinize yeniden yatırım yapın.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kitap Önerileri */}
                <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 w-full">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center">Psikoloji Kitap Önerileri</h2>
                        <p className="text-center text-gray-700 text-lg mb-12 max-w-2xl mx-auto">Ruh sağlığı ve kendini anlamak için önerdiğimiz kapsamlı rehber niteliğindeki kitaplar. Bu kitaplar, yaşadığınız sorunları anlamanıza ve çözüm bulmanıza yardımcı olabilir.</p>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                                <div className="flex gap-4">
                                    <div className="text-5xl">📚</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">Beden Taraması: Duygularını Tanı</h3>
                                        <p className="text-sm text-gray-600 mb-3 font-semibold">Yazar: Bessel van der Kolk</p>
                                        <p className="text-gray-700 leading-relaxed mb-4">Travma ve stres nasıl bedenimizi etkiler, bedenimizin belirtileri nasıl anlayacağımız hakkında derinlemesine bir inceleme. Bedenin hafızasını anlamak, psikolojik iyileşmenin ilk adımıdır.</p>
                                        <p className="text-sm text-blue-600 font-semibold">Uygun: Travma, TSSB, stresin fiziksel belirtileri için</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                                <div className="flex gap-4">
                                    <div className="text-5xl">🧠</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">Düşüncelerinin Sahibi Ol</h3>
                                        <p className="text-sm text-gray-600 mb-3 font-semibold">Yazar: David D. Burns</p>
                                        <p className="text-gray-700 leading-relaxed mb-4">Bilişsel Davranış Terapisinin (BDT) temel prensiplerini açıklayan bu kitap, olumsuz düşüncelerinizi nasıl değiştirebileceğinizi, depresyon ve anksiyeteyi nasıl yönetebileceğinizi öğretir.</p>
                                        <p className="text-sm text-blue-600 font-semibold">Uygun: Depresyon, anksiyete, olumsuz düşünceler için</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                                <div className="flex gap-4">
                                    <div className="text-5xl">💑</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">Dört Anlaşma: Özgürleşme Yolu</h3>
                                        <p className="text-sm text-gray-600 mb-3 font-semibold">Yazar: Miguel Ruiz</p>
                                        <p className="text-gray-700 leading-relaxed mb-4">Kendini ve ilişkilerini dönüştürmek için gerekli dört temel anlaşmayı sunur. Pozitif iletişim, sağlıklı sınırlar ve öz-saygı geliştirmede pratik rehber.</p>
                                        <p className="text-sm text-blue-600 font-semibold">Uygun: İlişki sorunları, öz-saygı, iletişim becerileri için</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                                <div className="flex gap-4">
                                    <div className="text-5xl">🎯</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">Saygıyla Yaşamak: Kendini Kabul Etme</h3>
                                        <p className="text-sm text-gray-600 mb-3 font-semibold">Yazar: Kristin Neff</p>
                                        <p className="text-gray-700 leading-relaxed mb-4">Öz-şefkat ve kendini kabul etmenin, mental sağlık ve refahın merkezinde olduğunu gösterir. Öz-eleştiri ile başa çıkmak ve kendine karşı iyilik geliştirmek için kapsamlı kılavuz.</p>
                                        <p className="text-sm text-blue-600 font-semibold">Uygun: Öz-saygı, kabul, öz-şefkat için</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
    );
};

// Hakkımızda Sayfası
const HakkimizdaPage = () => {
    const context = React.useContext(AppContext);
    const bgColor = context?.colorMap?.[context?.displayedEmotion] || '#F9F9F9';
    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen transition-colors duration-1000">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Hakkımızda</h2>
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Kimiz Biz?</h3>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">PsikoWeb, modern ruh sağlığı ve psikolojik danışmanlık hizmetleri sunan, Türkiye'nin öncü dijital psikoloji platformudur. Uzman psikologlarımız, klinik psikologlar, ve lisanslı terapistlerimiz, her bireyin kendine özgü, eşsiz ihtiyaçlarına uygun, kişiselleştirilmiş çözümler sağlamak için 24/7 çalışmaktadır. Akademik eğitimi en yüksek standartlarda tamamlamış, mesleki deneyimi zengin uzmanlarımız, sizin ruh sağlığınız için sadece birer profesyonel değil, birer rehber olarak hizmet vermektedir.</p>
                    
                    <h3 className="text-2xl font-bold text-blue-600 mb-4 mt-8">Misyonumuz</h3>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">Misyonumuz, ruh sağlığını bir lüks değil, temel bir insan hakkı olarak görmek ve herkesin erişebileceği profesyonel psikolojik destek sağlamaktır. Türkiye'de psikolojik destek almak isteyenlerin yolunun açılması, stigmanın kaldırılması ve her yaştan bireyin mental sağlığına yatırım yapması bizim temel hedefimizdir. Gizlilik, etik, profesyonellik ve empati bizim temel değerlerimizdir.</p>
                    
                    <h3 className="text-2xl font-bold text-blue-600 mb-4 mt-8">Başarı Hikayelerimiz</h3>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">Kuruluşundan bu yana 1000+ kişinin hayatına dokundum. Depresyondan, anksiyeteden, ilişki sorunlarından kurtulmuş insanların başarı hikayeleri bizim en büyük motivasyonumuz. Her gün aldığımız mesajlar - "Hayatımı değiştirdiniz", "Tekrar umut buldum", "Artık kendimi anlamaya başladım" - bizim çalışmaya devam etme nedenimizdir. PsikoWeb'de sadece tedavi değil, yaşam kalitesinde iyileşme sağlıyoruz.</p>
                    
                    <h3 className="text-2xl font-bold text-blue-600 mb-4 mt-8">Neden PsikoWeb'i Seçmelisiniz?</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">Uzman ekibimiz, en modern terapi tekniklerini (Bilişsel Davranış Terapisi, Diyalektik Davranış Terapisi, Psikodynamik Terapi gibi) kullanarak, size kişiselleştirilmiş bir tedavi planı hazırlar. Çevrim içi ortamda rahat ve güvenli bir şekilde, bulunduğunuz yerden hizmet alabilirsiniz. Tamamen gizli ve KVKK uyumlu sistemimiz, sizin mahremiyetinizi korur.</p>
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

// Hizmetler Sayfası
const HizmetlerPage = () => {
    const context = React.useContext(AppContext);
    const bgColor = context?.colorMap?.[context?.displayedEmotion] || '#F9F9F9';
    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen transition-colors duration-1000">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Hizmetlerimiz</h2>
                <div className="mb-8 bg-white rounded-lg shadow-lg p-8">
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">PsikoWeb, çeşitli psikolojik sorunlar ve ihtiyaçlara yönelik kapsamlı hizmetler sunmaktadır. Her hizmet, en güncel araştırmalar ve kanıt tabanı terapi yöntemleri kullanılarak dizayn edilmiştir. Uzman psikologlarımız, sizin yaşadığınız sorunu anlamak, köküne inmek ve kalıcı çözümler bulmak için siz sizin rehberiniz olacaktır.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { title: "Bireysel Terapi", description: "Kişiye özel psikolojik danışmanlık ve tedavi seansları. Depresyon, anksiyete, fobia, travma ve diğer psikolojik sorunlar için bire bir terapi. Sessiyon başına 60-90 dakika olan seanslarımızda, terapist-danışan ilişkisinin güvenini ve gizliliğini koruyarak, sizin sorunlarınıza odaklanırız." },
                        { title: "Grup Terapileri", description: "Benzer sorunlarla karşılaşan kişilerle grup ortamında çalışma. Grup ortamında başkalarının deneyimleriyle birlikte olmak, isolation hissini azaltır ve dayanışma duygusunu güçlendirir. Sosyal anksiyete, bağımlılılık, travma sonrası stres bozukluğu ve diğer konularda grup seansları düzenlenmektedir." },
                        { title: "Meditasyon Programları", description: "Stres yönetimi ve iç huzur için rehberli meditasyon. Mindfulness-tabanı stres azaltma (MBSR) programlarımız, nörolojik araştırmalar tarafından kanıtlanmış etkilidir. Düzenli meditasyon pratikleri, anksiyete, depresyon semptomlarını azaltır ve yaşam kalitesini artırır." },
                        { title: "İlişki Danışmanlığı", description: "Çift ve aile terapisi hizmetleri. Romantik ilişkilerdeki çatışmalar, aile sorunları, ebeveyn-çocuk ilişkilerindeki gerilimler için profesyonel danışmanlık. Pozitif iletişim tekniklerini öğrenerek, ilişkilerinizi güçlendirmenize yardımcı oluruz." }
                    ].map((service, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-blue-600 mb-3">{service.title}</h3>
                            <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

// Uzmanlar Sayfası
const UzmanlarPage = () => {
    const context = React.useContext(AppContext);
    const bgColor = context?.colorMap?.[context?.displayedEmotion] || '#F9F9F9';
    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen transition-colors duration-1000">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Uzmanlarımız</h2>
                <div className="mb-8 bg-white rounded-lg shadow-lg p-8">
                    <p className="text-gray-700 text-lg leading-relaxed">PsikoWeb'in ekibi, Türkiye'nin en deneyimli ve iyi eğitimli psikoloji profesyonellerinden oluşmaktadır. Her bir uzmanımız, kendi alanında titiz bir eğitim almış, etik standartlara bağlı kalarak hizmet vermektedir. Sizin terapisti seçerken, sorunlarınıza ve ihtiyaçlarınıza en uygun uzmanı belirlemenize yardımcı oluruz.</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { name: "Dr. Ayşe Kaya", specialty: "Depresyon Uzmanı", experience: "15 yıl", bio: "Ege Üniversitesi Psikoloji Bölümü'nde doktorasını tamamlamıştır. Bilişsel Davranış Terapisi ve Psikodynamik terapi konularında uzmanlaşmıştır." },
                        { name: "Psk. Mehmet Demir", specialty: "İlişki Danışmanlığı", experience: "12 yıl", bio: "Boğaziçi Üniversitesi mezunu. Çift terapisi ve aile danışmanlığında uzmandır. Savatherapy tekniklerini kullanarak, ilişkileri daha sağlıklı hale getirmeyi amaçlar." },
                        { name: "Psk. Fatma Yılmaz", specialty: "Aile Terapisi", experience: "10 yıl", bio: "Marmara Üniversitesi Psikoloji Bölümü öğretim görevlisidir. Aile sistemleri terapisi ve travma tedavisi konularında geniş deneyime sahiptir." }
                    ].map((expert, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <h3 className="text-2xl font-bold text-blue-600 mb-2">{expert.name}</h3>
                            <p className="text-gray-700 font-semibold mb-2">{expert.specialty}</p>
                            <p className="text-sm text-gray-600 mb-4">Deneyim: {expert.experience}</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{expert.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

// Blog Sayfası
const BlogPage = () => {
    const context = React.useContext(AppContext);
    const bgColor = context?.colorMap?.[context?.displayedEmotion] || '#F9F9F9';
    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen transition-colors duration-1000">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Blog</h2>
                <div className="space-y-6">
                    {[
                        { title: "Depresyonla Başa Çıkma Yolları", date: "2024-12-01", excerpt: "Depresyon belirtilerini tanımak ve profesyonel yardım almak önemlidir. Depresyon sadece üzüntü değil; bitkinlik, enerji kaybı, uyku ve iştah değişiklikleri gibi fiziksel belirtileri de içerir. Eğer bu belirtileri 2 haftadan fazla yaşıyorsanız, bir profesyonal ile görüşmelisiniz. Ayrıca günlük yaşamda yapabilecekleriniz vardır: Fiziksel aktivite, sosyal destek almak, beslenme ve uyku rutini oluşturmak depresyonun belirtilerini hafifletmeye yardımcı olur." },
                        { title: "Anksiyete Yönetimi İçin İpuçları", date: "2024-11-28", excerpt: "Anksiyete yönetimi için meditasyon ve mindfulness anksiyeteyi azaltmada etkilidir. Nefes egzersizleri (4-7-8 nefes tekniği), kademeli kas gevşetme, ve body scan meditasyonları kan basıncınızı düşürür ve merkezi sinir sisteminizi sakinleştirir. Anksiyeteli olduğunuzda, bedeninizin tepkisini fark etmek (titreme, kalp çarpıntısı) ve bunları kabullenmeyi öğrenmek, zamanla anksiyetenin azalmasına yardımcı olur." },
                        { title: "Sağlıklı İlişkiler İçin İletişim", date: "2024-11-25", excerpt: "Açık ve dürüst iletişim ilişkileri güçlendirir. İlişkideki sorunların çoğu, yetersiz iletişim nedeniyle ortaya çıkar. Partner'ınızla duygularınızı paylaşırken, suçlamadan çok gözlemlerden bahsedin. 'Sen her zaman beni dinlemezsin' yerine 'Ben, konuştuğumda daha çok işitilme ihtiyacı hissediyorum'. İyi iletişim becerileri kazanmak, sadece ilişkinizi kurtarmakla kalmaz, kişisel büyümenizi de destekler." }
                    ].map((article, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-blue-600 mb-2">{article.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{article.date}</p>
                            <p className="text-gray-700 text-lg leading-relaxed">{article.excerpt}</p>
                        </div>
                    ))}
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

// İletişim/Randevu Sayfası
const IletisimPage = () => {
    const context = React.useContext(AppContext);
    const bgColor = context?.colorMap?.[context?.displayedEmotion] || '#F9F9F9';
    const [appointment, setAppointment] = useState({ name: '', email: '', phone: '', date: '', time: '', service: '' });
    const [bookedSlots, setBookedSlots] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const slotKey = `${appointment.date}-${appointment.time}`;
        if (bookedSlots.includes(slotKey)) {
            alert('Bu saat zaten dolu! Başka bir saat seçin.');
            return;
        }
        setBookedSlots([...bookedSlots, slotKey]);
        alert(`Randevunuz ${appointment.date} ${appointment.time} saatinde alındı!`);
        setAppointment({ name: '', email: '', phone: '', date: '', time: '', service: '' });
    };

    const getAvailableTimes = () => {
        const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        return times.filter(time => !bookedSlots.includes(`${appointment.date}-${time}`));
    };

    return (
        <div style={{ backgroundColor: bgColor }} className="min-h-screen transition-colors duration-1000">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">İletişim & Randevu Al</h2>
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="name" value={appointment.name} onChange={handleChange} placeholder="Adınız" required className="px-4 py-2 border rounded-lg" />
                            <input type="email" name="email" value={appointment.email} onChange={handleChange} placeholder="Email" required className="px-4 py-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="tel" name="phone" value={appointment.phone} onChange={handleChange} placeholder="Telefon" required className="px-4 py-2 border rounded-lg" />
                            <input type="date" name="date" value={appointment.date} onChange={handleChange} required className="px-4 py-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select name="time" value={appointment.time} onChange={handleChange} required className="px-4 py-2 border rounded-lg">
                                <option value="">Saat Seçin</option>
                                {getAvailableTimes().map(time => (<option key={time} value={time}>{time}</option>))}
                            </select>
                            <select name="service" value={appointment.service} onChange={handleChange} required className="px-4 py-2 border rounded-lg">
                                <option value="">Hizmet Seçin</option>
                                <option value="bireysel">Bireysel Terapi</option>
                                <option value="grup">Grup Terapisi</option>
                                <option value="meditasyon">Meditasyon</option>
                                <option value="iliski">İlişki Danışmanlığı</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">Randevuyu Onayla</button>
                    </form>
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

// Main App
export default function App() {
    const [displayedEmotion, setDisplayedEmotion] = useState('neutral');
    const [currentRawEmotion, setCurrentRawEmotion] = useState('neutral');
    const colorMap = EMOTION_COLORS;
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detectTimerRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    // Load models and start video - runs once when app starts
    useEffect(() => {
        const loadModels = async () => {
            if (await waitForFaceApi()) {
                const faceapi = window.faceapi;
                try {
                    console.log("Models loading...");
                    await Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                    ]);
                    console.log("Models loaded successfully!");
                    setModelsLoaded(true);
                    startVideo();
                } catch (e) { console.error("Model loading error:", e); }
            } else {
                console.error("Face-API not loaded!");
            }
        };
        loadModels();
        return stopVideo;
    }, []);

    // Debounce effect
    useEffect(() => {
        if (currentRawEmotion === displayedEmotion) return;
        const timer = setTimeout(() => setDisplayedEmotion(currentRawEmotion), 3000);
        return () => clearTimeout(timer);
    }, [currentRawEmotion, displayedEmotion]);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(e => console.error("Video error:", e));
            }
        } catch (err) { console.error("Camera error:", err); }
    };

    const stopVideo = () => {
        if (detectTimerRef.current) clearInterval(detectTimerRef.current);
        const v = videoRef.current;
        if (v?.srcObject) {
            v.srcObject.getTracks().forEach(t => t.stop());
            v.srcObject = null;
        }
    };

    const handleVideoReady = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const faceapi = window.faceapi;

        if (!video || !canvas || !modelsLoaded || !faceapi || !video.videoWidth || !video.videoHeight) {
            console.error("Video not ready:", { video: !!video, canvas: !!canvas, modelsLoaded, faceapi: !!faceapi, videoWidth: video?.videoWidth, videoHeight: video?.videoHeight });
            return;
        }

        console.log("Video ready, starting detection...");
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        faceapi.matchDimensions(canvas, displaySize);

        if (detectTimerRef.current) clearInterval(detectTimerRef.current);

        detectTimerRef.current = setInterval(async () => {
            try {
                if (video.paused || video.ended) {
                    console.log("Video paused or ended");
                    return;
                }
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.1 })).withFaceLandmarks().withFaceExpressions();
                if (detections && detections.length > 0) {
                    const expr = detections[0].expressions;
                    const [label] = Object.entries(expr).sort((a, b) => b[1] - a[1])[0];
                    console.log("Emotion detected:", label);
                    setCurrentRawEmotion(label);
                } else {
                    console.log("No face detected");
                    setCurrentRawEmotion('neutral');
                }
            } catch (e) { console.error("Detection error:", e); }
        }, 500);
    };

    const contextValue = { displayedEmotion, colorMap, setCurrentRawEmotion };

    return (
        <AppContext.Provider value={contextValue}>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/hakkimizda" element={<HakkimizdaPage />} />
                    <Route path="/hizmetler" element={<HizmetlerPage />} />
                    <Route path="/uzmanlar" element={<UzmanlarPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/iletisim" element={<IletisimPage />} />
                </Routes>
            </Router>
            {/* Hidden video and canvas for emotion detection - always running */}
            <div className="absolute bottom-4 right-4 z-10 opacity-0 pointer-events-none w-[1px] h-[1px]">
                <video ref={videoRef} onLoadedMetadata={handleVideoReady} onPlay={handleVideoReady} autoPlay muted playsInline style={{ width: '1px', height: '1px' }} />
                <canvas ref={canvasRef} style={{ width: '1px', height: '1px' }} />
            </div>
        </AppContext.Provider>
    );
}
