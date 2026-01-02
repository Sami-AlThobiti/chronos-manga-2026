import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, Image as ImageIcon, Settings, 
  Cpu, User, Paintbrush, Share2, Download, 
  Maximize2, Zap, BookOpen, PenTool, Globe,
  MessageSquare, Layers, Home, Twitter, Instagram, Youtube, RefreshCcw,
  Sun, Moon
} from 'lucide-react';

/**
 * CHRONOS MANGA 2026 - SAMCO EDITION
 * تطبيق توليد قصص الأنمي والمانجا المستقبلي
 * Update: FIXED Image Generation Bug (English Style Mapping)
 */

// --- Constants & Assets ---

const THEMES = [
  {
    id: 'cyberpunk',
    name: 'سايبر بانك 2077',
    // English prompt for the image generator to avoid errors
    promptStyle: 'cyberpunk 2077, neon city, futuristic, high tech, sci-fi',
    bg: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1920&auto=format&fit=crop',
    primary: 'from-cyan-500 to-blue-600',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/50'
  },
  {
    id: 'dark_fantasy',
    name: 'فانتازيا مظلمة',
    promptStyle: 'dark fantasy, gothic, gloomy, foggy atmosphere, mysterious, magic',
    bg: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1920&auto=format&fit=crop',
    primary: 'from-red-900 to-purple-900',
    accent: 'text-red-500',
    border: 'border-red-500/50'
  },
  {
    id: 'ethereal',
    name: 'عالم الأرواح',
    promptStyle: 'ethereal, dreamlike, pastel colors, galaxy, spirit world, soft lighting',
    bg: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1920&auto=format&fit=crop',
    primary: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-300',
    border: 'border-emerald-400/50'
  },
  {
    id: 'mecha',
    name: 'حرب الآلات',
    promptStyle: 'mecha, giant robots, machinery, industrial, steel, warfare',
    bg: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920&auto=format&fit=crop',
    primary: 'from-orange-500 to-amber-600',
    accent: 'text-orange-400',
    border: 'border-orange-500/50'
  },
  {
    id: 'slice_of_life',
    name: 'شريحة من الحياة',
    promptStyle: 'slice of life, school anime, peaceful, sunny day, vibrant colors, studio ghibli style',
    bg: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1920&auto=format&fit=crop',
    primary: 'from-pink-400 to-rose-500',
    accent: 'text-pink-300',
    border: 'border-pink-400/50'
  }
];

const AI_MODELS = [
  { id: 'gpt-4o', name: 'ChatGPT-4o (Story Mode)', icon: <Zap className="w-4 h-4" /> },
  { id: 'gemini-3', name: 'Gemini 3.0 Pro (Creative)', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'copilot', name: 'Copilot X (Balanced)', icon: <Cpu className="w-4 h-4" /> }
];

const STYLES = [
  { id: 'shonen', name: 'شونين (Shonen)', desc: 'أكشن، مغامرة، قوة' },
  { id: 'shojo', name: 'شوجو (Shojo)', desc: 'رومانسية، مشاعر' },
  { id: 'seinen', name: 'سينين (Seinen)', desc: 'ناضج، نفسي، عميق' },
  { id: 'isekai', name: 'إيسيكاي (Isekai)', desc: 'عالم آخر، سحر' },
  { id: 'horror', name: 'رعب (Junji Ito)', desc: 'غموض، ظلام' }
];

// --- Smart Story Generator Engine (Multi-Scene) ---
const generateMockStory = (keyword, style, language) => {
  const isAr = language === 'ar';
  
  // Logic to create a 3-part story structure
  const storyStructure = [
    // PART 1: The Beginning (Discovery/Setting)
    {
      text: isAr
        ? `البداية: في عالم غامض، ظهرت الـ"${keyword}" فجأة من العدم. البطل، وهو شاب طموح، وجد هذا الشيء الغريب ملقى في زاوية مهجورة. لم يكن يعلم أن لمسه سيغير مصير العالم للأبد.`
        : `The Beginning: In a mysterious world, the "${keyword}" suddenly appeared out of nowhere. The hero, an ambitious youth, found this strange object lying in a desolate corner. He didn't know that touching it would change the world's fate forever.`,
      imagePrompt: `anime masterpiece, cinematic wide shot, hero discovering a glowing mysterious ${keyword} object in a dark ancient ruins, atmospheric lighting, detailed background, 8k, highly detailed, sharp focus`
    },
    // PART 2: The Climax (Action/Conflict)
    {
      text: isAr
        ? `الذروة: بمجرد أن حمل الـ"${keyword}"، تجمعت قوى الظلام حوله. وحش عملاق ظهر من السماء محاولاً سرقتها! بدأت المعركة المحتدمة، واستخدم البطل قوة الـ${keyword} الكامنة للدفاع عن نفسه.`
        : `The Climax: As soon as he held the "${keyword}", dark forces gathered. A giant monster appeared from the sky trying to steal it! A fierce battle began, and the hero unleashed the latent power of the ${keyword} to defend himself.`,
      imagePrompt: `anime action shot, dynamic angle, intense battle, hero fighting a giant shadow monster using a magical ${keyword} weapon, special effects, explosions, debris, high contrast`
    },
    // PART 3: The Resolution (Aftermath/Ending)
    {
      text: isAr
        ? `النهاية: بعد انقشاع الغبار، وقف البطل منتصراً والـ"${keyword}" تلمع بضوء ذهبي هادئ. لقد أدرك الآن أن رحلته الحقيقية قد بدأت للتو، وأن هذا الغرض يحمل أسراراً أعمق مما تخيل.`
        : `The Ending: After the dust settled, the hero stood victorious, the "${keyword}" glowing with a calm golden light. He realized his true journey had just begun, and this object held secrets deeper than he ever imagined.`,
      imagePrompt: `anime emotional scene, close up or medium shot, hero holding the ${keyword} looking at sunset, peaceful atmosphere, wind blowing hair, golden hour lighting, hopeful expression`
    }
  ];

  return storyStructure;
};

// --- Custom Components ---

const TikTokIcon = ({ size = 24, className }) => (
  <svg 
    width={size}
    height={size}
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SocialButton = ({ icon: Icon, href, colorClass, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      group relative flex items-center justify-center p-3 rounded-xl 
      bg-white/5 border border-white/10 overflow-hidden transition-all duration-300
      hover:scale-110 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
    `}
    title={label}
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-tr ${colorClass}`} />
    <Icon size={20} className="relative z-10 text-gray-300 group-hover:text-white transition-colors" />
  </a>
);

const SectionHeader = ({ icon: Icon, title, theme, isDark }) => (
  <div className={`
    relative flex items-center gap-3 p-3 mb-4 rounded-xl border transition-all duration-500 overflow-hidden
    ${isDark ? 'bg-black/40' : 'bg-white/60'}
    ${theme.border}
  `}>
    <div className={`absolute inset-0 opacity-5 bg-gradient-to-r ${theme.primary}`} />
    <div className={`
      relative z-10 p-1.5 rounded-lg shadow-sm text-white
      bg-gradient-to-br ${theme.primary} shadow-lg
    `}>
      <Icon size={14} />
    </div>
    <h3 className={`relative z-10 text-xs font-black uppercase tracking-widest ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>
      {title}
    </h3>
    <div className={`absolute right-0 top-0 bottom-0 w-1 opacity-30 bg-gradient-to-b ${theme.primary}`} />
  </div>
);

const ImageGeneratorBtn = ({ prompt, styleName, onGenerate, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors self-start px-3 py-1 rounded-full border ${isDark ? 'text-white/70 hover:text-white bg-white/5 border-white/10' : 'text-gray-600 hover:text-black bg-black/5 border-black/10'}`}
      >
        <ImageIcon size={14} />
        توليد المشهد (Generate Scene)
      </button>
      
      {isOpen && (
        <div className={`flex flex-wrap gap-2 animate-fadeIn p-3 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
          {[
            { label: 'سينمائي (16:9)', w: 1280, h: 720, icon: 'rectangle-horizontal' },
            { label: 'بورتريه (9:16)', w: 720, h: 1280, icon: 'rectangle-vertical' },
            { label: 'مربع (1:1)', w: 1024, h: 1024, icon: 'square' }
          ].map((ratio, idx) => (
            <button
              key={idx}
              onClick={() => onGenerate(prompt, ratio.w, ratio.h)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded text-xs text-white font-medium transition-all transform hover:scale-105"
            >
              <Maximize2 size={12} />
              {ratio.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StoryCard = ({ segment, theme, isDark }) => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);

  const handleGenerateImage = (basePrompt, w, h) => {
    setLoadingImg(true);
    
    // --- RADICAL FIX: Using English Prompt for Style ---
    // Instead of using `theme.name` (which might be Arabic), we use `theme.promptStyle`
    const fluxPrompt = `${basePrompt}. Style: ${theme.promptStyle}. High quality, detailed, masterpiece.`;
    const enhancedPrompt = encodeURIComponent(fluxPrompt);
    const seed = Math.floor(Math.random() * 99999);
    
    const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=${w}&height=${h}&seed=${seed}&nologo=true&model=flux`;
    
    setTimeout(() => {
      setGeneratedImage(url);
      setLoadingImg(false);
    }, 1500);
  };

  return (
    <div className={`group relative backdrop-blur-md border rounded-2xl p-6 mb-6 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] ${
      isDark 
        ? 'bg-black/40 border-white/10 hover:border-white/30 text-gray-100' 
        : 'bg-white/70 border-white/40 hover:border-white/60 text-gray-900 shadow-sm'
    }`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
      </div>

      <div className="prose prose-lg max-w-none">
        <p className={`text-lg leading-relaxed font-light ${isDark ? 'text-gray-100' : 'text-gray-900'}`} dir="auto">
          {segment.text}
        </p>
      </div>

      <div className={`mt-6 border-t pt-4 ${isDark ? 'border-white/10' : 'border-black/5'}`}>
        {!generatedImage && !loadingImg && (
          <ImageGeneratorBtn 
            prompt={segment.imagePrompt} 
            styleName={theme.name}
            onGenerate={handleGenerateImage}
            isDark={isDark}
          />
        )}

        {loadingImg && (
          <div className={`w-full h-64 rounded-xl flex flex-col items-center justify-center border animate-pulse ${isDark ? 'bg-black/50 border-white/5' : 'bg-gray-100 border-black/5'}`}>
            <Cpu className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
            <span className="text-xs text-cyan-400 font-mono">RENDERING WITH FLUX ENGINE...</span>
          </div>
        )}

        {generatedImage && (
          <div className={`relative mt-4 rounded-xl overflow-hidden border shadow-2xl group-image ${isDark ? 'border-white/20' : 'border-black/10'}`}>
            <img 
              src={generatedImage} 
              alt="Generated Scene" 
              className="w-full object-cover animate-fadeIn"
              onError={(e) => {
                // Fallback if image fails
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/600x400/000000/FFF?text=Image+Generation+Error";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 flex justify-between items-end opacity-0 group-image-hover:opacity-100 transition-opacity">
              <span className="text-xs text-white/80 font-mono">Seed: {Math.floor(Math.random() * 9999)}</span>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm">
                <Download size={16} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChronosManga() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [language, setLanguage] = useState('ar');
  const [input, setInput] = useState('');
  const [story, setStory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [story]);

  const handleGenerate = () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    if (story.length > 0) setStory([]);
    
    setTimeout(() => {
      const scenes = generateMockStory(input, selectedStyle.id, language);
      
      scenes.forEach((scene, index) => {
        setTimeout(() => {
          const newSegment = {
            id: Date.now() + index,
            text: scene.text,
            imagePrompt: scene.imagePrompt,
            timestamp: new Date().toLocaleTimeString()
          };
          setStory(prev => [...prev, newSegment]);
          
          if (index === scenes.length - 1) {
            setIsGenerating(false);
          }
        }, index * 800);
      });
      
      setInput('');
    }, 1500);
  };

  const handleReset = () => {
    setStory([]);
    setInput('');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Dynamic Styles
  const themeStyles = {
    bgOverlay: 'bg-gradient-to-t from-black via-black/80 to-black/30',
    sidebar: isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/70 border-white/40',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    headingGradient: isDarkMode ? 'from-white to-gray-400' : 'from-slate-900 to-slate-600',
    cardBorder: isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-white/30 hover:bg-white/20',
    activeCard: isDarkMode ? 'bg-white/10' : 'bg-white/50',
    inputContainer: isDarkMode ? 'bg-white/5 border-white/10 focus-within:bg-black/80' : 'bg-white/60 border-white/40 focus-within:bg-white/90',
    inputText: isDarkMode ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-gray-500',
    iconButton: isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-600 hover:text-black',
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans transition-colors duration-500 bg-black text-white selection:bg-cyan-500/30 selection:text-cyan-200`}>
      
      {/* CSS Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Backgrounds */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 transform scale-105 opacity-60`}
        style={{ backgroundImage: `url(${activeTheme.bg})` }}
      />
      <div className={`absolute inset-0 z-0 backdrop-blur-[2px] transition-colors duration-500 ${themeStyles.bgOverlay}`} />
      <div className={`absolute inset-0 z-0 bg-gradient-to-br ${activeTheme.primary} opacity-20 mix-blend-overlay`} />

      {/* Main Layout */}
      <div className="relative z-10 flex h-full flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className={`w-80 hidden md:flex flex-col border-r backdrop-blur-xl transition-all h-full duration-300 ${themeStyles.sidebar}`}>
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
            <div>
              <h1 className={`text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${themeStyles.headingGradient}`}>
                CHRONOS<span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeTheme.primary}`}>MANGA</span>
              </h1>
              <p className={`text-[10px] tracking-[0.2em] mt-1 ${themeStyles.textSecondary}`}>AI STORY ENGINE v4.0.1</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${themeStyles.iconButton}`}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={handleReset} className={`p-2 rounded-full transition-colors ${themeStyles.iconButton}`}>
                <Home size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            <section>
              <SectionHeader icon={Globe} title="العوالم (Worlds)" theme={activeTheme} isDark={isDarkMode} />
              <div className="grid grid-cols-1 gap-2">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`relative overflow-hidden group p-3 rounded-xl border transition-all text-right ${
                      activeTheme.id === theme.id ? `${theme.border} ${themeStyles.activeCard} shadow-lg` : `border-transparent ${themeStyles.cardBorder}`
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className={`text-sm font-medium ${activeTheme.id === theme.id ? themeStyles.textMain : themeStyles.textSecondary}`}>
                        {theme.name}
                      </span>
                      {activeTheme.id === theme.id && <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primary} animate-pulse`} />}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <SectionHeader icon={Cpu} title="المحرك (AI Model)" theme={activeTheme} isDark={isDarkMode} />
              <div className="space-y-2">
                {AI_MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedModel.id === model.id ? `bg-gradient-to-r ${isDarkMode ? 'from-white/10 to-transparent border-white/20' : 'from-black/5 to-transparent border-black/10'} ${themeStyles.textMain}` : `border-transparent ${themeStyles.textSecondary} hover:text-current`
                    }`}
                  >
                    {model.icon}
                    <span className="text-xs font-mono">{model.name}</span>
                  </button>
                ))}
              </div>
            </section>
            
            <section>
              <SectionHeader icon={Paintbrush} title="أسلوب الرسم (Art Style)" theme={activeTheme} isDark={isDarkMode} />
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-2 rounded border text-center transition-all ${
                      selectedStyle.id === style.id ? `${isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}` : `bg-transparent ${isDarkMode ? 'border-white/10 hover:border-white/30 text-gray-400' : 'border-black/10 hover:border-black/30 text-gray-500'}`
                    }`}
                  >
                    <div className="text-xs font-bold">{style.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <SectionHeader icon={MessageSquare} title="اللغة (Language)" theme={activeTheme} isDark={isDarkMode} />
              <div className={`flex rounded-lg p-1 border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-200/50 border-black/5'}`}>
                <button onClick={() => setLanguage('ar')} className={`flex-1 py-1.5 text-xs rounded transition-all ${language === 'ar' ? (isDarkMode ? 'bg-white/20 text-white' : 'bg-white text-black shadow-sm') : 'text-gray-500'}`}>العربية</button>
                <button onClick={() => setLanguage('en')} className={`flex-1 py-1.5 text-xs rounded transition-all ${language === 'en' ? (isDarkMode ? 'bg-white/20 text-white' : 'bg-white text-black shadow-sm') : 'text-gray-500'}`}>English</button>
              </div>
            </section>

          </div>
          
          <div className={`p-4 border-t ${isDarkMode ? 'border-white/10 bg-black/40' : 'border-black/5 bg-white/40'}`}>
            <p className={`text-center text-[10px] mb-3 font-medium uppercase tracking-widest ${themeStyles.textSecondary}`}>
              تابع سامكو للمزيد من الأدوات
            </p>
            <div className="flex justify-center gap-2">
              <SocialButton icon={Twitter} href="https://x.com/designer_samco?s=21&t=dbffdoGcvgOluktAOa9LHA" colorClass="from-blue-400 to-blue-600" label="X (Twitter)" />
              <SocialButton icon={TikTokIcon} href="https://www.tiktok.com/@samco_designer?_t=ZS-90FZRdOXUiG&_r=1" colorClass="from-pink-500 to-cyan-500" label="TikTok" />
              <SocialButton icon={Instagram} href="https://www.instagram.com/samco_design?igsh=MXhiN2RjbG1ydHducg%3D%3D&utm_source=qr" colorClass="from-purple-500 to-orange-500" label="Instagram" />
              <SocialButton icon={Youtube} href="https://www.youtube.com/@samco-desing" colorClass="from-red-500 to-red-700" label="YouTube" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative h-full">
          <div className={`md:hidden p-4 backdrop-blur-md border-b flex justify-between items-center z-50 ${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/80 border-black/5'}`}>
             <div className="flex items-center gap-3">
               <button onClick={handleReset} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}><Home size={18} /></button>
               <h1 className="text-lg font-bold text-white">CHRONOS</h1>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>{isDarkMode ? <Sun size={18} className="text-white"/> : <Moon size={18} className="text-black"/>}</button>
                <Settings className="text-gray-400" size={20} />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" ref={scrollRef}>
            {story.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-80 min-h-[500px]">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${activeTheme.primary} blur-3xl absolute`} />
                <BookOpen size={64} className="relative z-10 mb-4 text-white/20" />
                <h2 className="text-2xl md:text-4xl font-black text-center mb-2 tracking-tighter text-white">ابدأ قصتك الأسطورية</h2>
                <p className="text-center max-w-md mb-8 text-gray-400">اكتب كلمة واحدة فقط (مثل: "سيف", "تنين", "مدرسة") ودع الذكاء الاصطناعي ينسج لك عالماً كاملاً بأسلوب المانجا.</p>
                
                <div className="md:hidden flex flex-col items-center gap-4 animate-fadeIn">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">تابع سامكو للمزيد من الأدوات</p>
                  <div className="flex gap-3">
                    <SocialButton icon={Twitter} href="https://x.com/designer_samco?s=21&t=dbffdoGcvgOluktAOa9LHA" colorClass="from-blue-400 to-blue-600" />
                    <SocialButton icon={TikTokIcon} href="https://www.tiktok.com/@samco_designer?_t=ZS-90FZRdOXUiG&_r=1" colorClass="from-pink-500 to-cyan-500" />
                    <SocialButton icon={Instagram} href="https://www.instagram.com/samco_design?igsh=MXhiN2RjbG1ydHducg%3D%3D&utm_source=qr" colorClass="from-purple-500 to-orange-500" />
                    <SocialButton icon={Youtube} href="https://www.youtube.com/@samco-desing" colorClass="from-red-500 to-red-700" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto pb-32">
                 {story.map((segment, index) => (
                   <div key={segment.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                     <StoryCard segment={segment} theme={activeTheme} isDark={isDarkMode} />
                   </div>
                 ))}
                 {isGenerating && (
                   <div className="flex items-center gap-3 text-gray-400 animate-pulse mt-4 justify-center">
                     <PenTool size={16} />
                     <span className="text-sm font-mono">WRITING NEXT SCENE...</span>
                   </div>
                 )}
              </div>
            )}
          </div>

          <div className={`relative p-4 md:p-6 transition-colors duration-500 z-20 bg-gradient-to-t from-black via-black to-transparent`}>
            <div className="max-w-3xl mx-auto">
              <div className={`flex items-center gap-4 backdrop-blur-xl border rounded-2xl p-2 pr-6 pl-2 transition-all ${themeStyles.inputContainer}`}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={language === 'ar' ? "اكتب كلمة لبدء القصة (مثال: انتقام)..." : "Enter a keyword (e.g., Revenge)..."}
                  className={`flex-1 bg-transparent border-none outline-none text-lg h-12 ${themeStyles.inputText}`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !input}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${!input ? 'bg-gray-500/10 text-gray-400 cursor-not-allowed' : `bg-gradient-to-tr ${activeTheme.primary} text-white shadow-lg hover:scale-105 active:scale-95`}`}
                >
                  {isGenerating ? <Cpu className="animate-spin" size={20} /> : <Send size={20} className={language === 'ar' ? 'rotate-180' : ''} />}
                </button>
              </div>
              <div className={`text-center mt-2 text-[10px] font-mono ${themeStyles.textSecondary}`}>POWERED BY SAMCO TOOLS • 2026 EDITION</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
