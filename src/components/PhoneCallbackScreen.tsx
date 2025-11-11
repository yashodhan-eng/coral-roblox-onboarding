import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft } from "lucide-react";
import { contentSchema } from "@/data/contentSchema";

interface PhoneCallbackScreenProps {
  step: number;
  onSubmit: (phone: string, preferredDay: string, preferredTime: string, recaptchaToken: string | null) => void;
  onBack: () => void;
  heroImage?: string;
}

export const PhoneCallbackScreen = ({ 
  step, 
  onSubmit, 
  onBack,
  heroImage 
}: PhoneCallbackScreenProps) => {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [preferredDay, setPreferredDay] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  const countryOptions = [
    { code: "+1", flag: "🇺🇸", name: "US" },
    { code: "+1", flag: "🇨🇦", name: "CA" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
    { code: "+91", flag: "🇮🇳", name: "IN" },
    { code: "+61", flag: "🇦🇺", name: "AU" },
  ];

  const hasPhoneNumber = phone.trim().length > 0;
  const buttonText = hasPhoneNumber ? contentSchema.phone.buttonWithPhone : contentSchema.phone.button;

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Render reCAPTCHA widget
  useEffect(() => {
    const renderRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render) {
        try {
          const container = document.getElementById('recaptcha-container');
          if (container && !recaptchaWidgetId) {
            const widgetId = window.grecaptcha.render(container, {
              sitekey: '6LdaKJ4qAAAAAKh-mW_nJG8NW8WGBfgF2Jzl1l6V',
              callback: (token: string) => {
                setRecaptchaToken(token);
              }
            });
            setRecaptchaWidgetId(widgetId);
          }
        } catch (err) {
          console.error('Error rendering reCAPTCHA:', err);
        }
      }
    };

    if (window.grecaptcha) {
      window.grecaptcha.ready(renderRecaptcha);
    } else {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          window.grecaptcha.ready(renderRecaptcha);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [recaptchaWidgetId]);

  const validatePhone = (phoneNumber: string): boolean => {
    // Basic phone validation - at least 10 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }

    // If phone is provided, validate it and require callback preferences
    if (hasPhoneNumber) {
      if (!validatePhone(phone)) {
        setError('Please enter a valid phone number');
        return;
      }
      if (!preferredDay || !preferredTime) {
        setError('Please select your preferred day and time');
        return;
      }
    }

    setError("");
    onSubmit(phone, preferredDay, preferredTime, recaptchaToken);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (error) setError("");
  };

  const isSubmitDisabled = !recaptchaToken || (hasPhoneNumber && (!preferredDay || !preferredTime));

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 pt-2 md:pt-4 animate-fade-in">
      {/* Hero Image */}
      {heroImage && (
        <div className="mb-4 md:mb-6">
          <img 
            src={heroImage} 
            alt="Parent on a quick call" 
            className="w-full h-auto max-h-[30vh] md:max-h-[35vh] object-cover rounded-2xl shadow-lg"
            loading="eager"
          />
        </div>
      )}

      <div className="bg-card rounded-3xl shadow-lg p-6 md:p-10 border border-border/50">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-4 md:mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-poppins text-sm md:text-base">Back</span>
        </button>

        {/* Optional Badge */}
        <div className="mb-3 md:mb-4">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs md:text-sm font-poppins font-medium">
            Optional
          </span>
        </div>

        {/* Title */}
        <h2 className="font-fredoka text-xl md:text-2xl font-semibold text-foreground mb-2 md:mb-3 leading-tight">
          {contentSchema.phone.title}
        </h2>

        {/* Subtext */}
        <p className="font-poppins text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
          {contentSchema.phone.subtext}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="phone" 
              className="font-poppins text-sm md:text-base text-foreground font-medium"
            >
              {contentSchema.phone.label}
            </Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] h-12 md:h-14 rounded-[10px] border-[#D6DAE6] bg-[#F8FAFF] font-poppins">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{countryOptions.find(c => c.code === countryCode)?.flag}</span>
                      <span className="text-sm md:text-base">{countryCode}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border-[#D6DAE6] rounded-lg shadow-lg z-50">
                  {countryOptions.map((country) => (
                    <SelectItem 
                      key={`${country.code}-${country.name}`} 
                      value={country.code}
                      className="font-poppins hover:bg-[#F2F4FF] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm">{country.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="flex-1 h-12 md:h-14 text-base md:text-lg font-poppins rounded-[10px] border-[#D6DAE6] bg-[#F8FAFF] focus:border-[#4A6FFF] focus-visible:ring-[#4A6FFF]"
              />
            </div>
          </div>

          {/* Conditional Callback Preferences */}
          {hasPhoneNumber && (
            <div className="space-y-4 pt-4 border-t border-border/50 animate-fade-in">
              <div>
                <h3 className="font-fredoka text-lg md:text-xl font-semibold text-foreground mb-2">
                  {contentSchema.phone.callbackTitle}
                </h3>
                <p className="font-poppins text-sm md:text-base text-muted-foreground mb-4">
                  {contentSchema.phone.callbackSubtext}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preferred Day */}
                <div className="space-y-2">
                  <Label className="font-poppins text-sm text-[#3A3A3A] font-medium">
                    Preferred day
                  </Label>
                  <Select value={preferredDay} onValueChange={setPreferredDay}>
                    <SelectTrigger className="h-12 font-poppins text-sm md:text-base bg-white border-[#D6DAE6] rounded-[10px] shadow-sm text-[#3A3A3A]">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#D6DAE6] rounded-lg shadow-lg z-50">
                      {contentSchema.phone.dayOptions.map((day) => (
                        <SelectItem 
                          key={day} 
                          value={day} 
                          className="font-poppins text-[#3A3A3A] hover:bg-[#F2F4FF] cursor-pointer"
                        >
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Time */}
                <div className="space-y-2">
                  <Label className="font-poppins text-sm text-[#3A3A3A] font-medium">
                    Preferred time
                  </Label>
                  <Select value={preferredTime} onValueChange={setPreferredTime}>
                    <SelectTrigger className="h-12 font-poppins text-sm md:text-base bg-white border-[#D6DAE6] rounded-[10px] shadow-sm text-[#3A3A3A]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#D6DAE6] rounded-lg shadow-lg z-50">
                      {contentSchema.phone.timeOptions.map((time) => (
                        <SelectItem 
                          key={time} 
                          value={time} 
                          className="font-poppins text-xs md:text-sm text-[#3A3A3A] hover:bg-[#F2F4FF] cursor-pointer"
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* reCAPTCHA */}
          <div className="flex justify-center pt-4">
            <div id="recaptcha-container"></div>
          </div>

          {/* Error Message */}
          {error && touched && (
            <p className="text-destructive text-sm font-poppins animate-fade-in">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full h-12 md:h-14 text-base md:text-lg font-poppins font-semibold rounded-full
                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ 
              background: 'linear-gradient(180deg, #FF513A 0%, #E6432E 100%)',
              color: 'white'
            }}
          >
            {buttonText}
          </Button>
        </form>
      </div>
    </div>
  );
};
