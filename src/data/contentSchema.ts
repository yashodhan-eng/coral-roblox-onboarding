export const contentSchema = {
  redirectUrl: "https://www.coralacademy.com/class/codewithroblox-8d3c97ce-42bb-4040-b8ae-bff07b51db90",
  logoSrc: "/src/assets/coral-academy-logo.png",
  q1: {
    title: "How soon are you looking to try our free classes?",
    subtext: "Let your child explore the world of reptiles and amphibians",
    options: [
      "Right away",
      "In 1–2 weeks",
      "Next month",
      "Just exploring"
    ]
  },
  q2: {
    title: "What topics is your child interested in?",
    subtext: "Select multiple and submit.",
    options: [
      "Entrepreneurship",
      "Science",
      "Coding",
      "AI",
      "Drawing",
      "Logic",
      "History",
      "Finance"
    ]
  },
  name: {
    title: "What's your name?",
    label: "Enter your name",
    button: "Next"
  },
  email: {
    title: "Kindly share your email address",
    label: "Enter Your Email",
    button: "Next"
  },
  phone: {
    title: "Would you like a quick call to help you get started?",
    subtext: "Optional — share your phone number if you'd like a short 2–5 min call to help you get started with Coral Academy.",
    label: "Enter your phone number (optional)",
    button: "Skip & Submit",
    buttonWithPhone: "Finish",
    callbackTitle: "When's a good time for us to call you?",
    callbackSubtext: "Choose your preferred day and time.",
    dayOptions: ["Weekdays", "Weekends", "Any Day"],
    timeOptions: [
      "9:00 AM – 11:00 AM",
      "11:00 AM – 1:00 PM",
      "1:00 PM – 3:00 PM",
      "3:00 PM – 5:00 PM",
      "5:00 PM – 7:00 PM",
      "7:00 PM - 9:00 PM"
    ]
  },
  thankyou: {
    title: "Thanks! You're all set.",
    subtext: "Taking you to the class page…",
    subtextWithCallback: "We will reach out at your preferred time to help you get started. Redirecting you to our class page…",
    delayMs: 1800
  }
};

export type OnboardingAnswers = {
  q1?: string;
  q2?: string;
  name?: string;
  email?: string;
  phone?: string;
  preferred_day?: string;
  preferred_time?: string;
  timestamp?: number;
};
