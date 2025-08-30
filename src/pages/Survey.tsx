import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Survey = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    // Here you would typically submit the survey data
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