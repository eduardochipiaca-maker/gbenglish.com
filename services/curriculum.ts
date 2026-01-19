import { Lesson, LevelType } from '../types';

// Syllabus structure defined in the prompt
const SYLLABUS = {
  Basic: [
    "Alfabeto e pronúncia", "Cumprimentos (Greetings)", "Verb to be", "Pronomes Pessoais", 
    "Artigos (A/An/The)", "Demonstratives (This/That)", "Perguntas Simples (What/Where)", 
    "Presente Simples (Affirmative)", "Presente Simples (Negative)", "Presente Simples (Questions)",
    "Vocabulário: Família", "Vocabulário: Comida", "Números 1-100", "Dias da Semana e Meses",
    "Adjetivos Básicos", "Preposições de Lugar (In/On/At)", "Possessivos (My/Your)", 
    "There is / There are", "Can / Can't (Habilidade)", "Imperativo (Ordens)",
    "Present Continuous (Affirmative)", "Present Continuous (Negative)", "Roupas e Cores",
    "Horas (Telling Time)", "Verbos de Rotina", "Adverbs of Frequency", "Object Pronouns",
    "Wh- Questions", "Conjunctions (And/But/Or)", "Revisão Básico"
  ],
  Intermediate: [
    "Past Simple (Regular Verbs)", "Past Simple (Irregular Verbs)", "Past Simple (Questions)",
    "Future with 'Going to'", "Future with 'Will'", "Comparatives", "Superlatives",
    "Countable Nouns", "Uncountable Nouns", "Quantifiers (Some/Any)", "How much / How many",
    "Prepositions of Time", "Prepositions of Movement", "Modal Verbs (Should/Must)",
    "Past Continuous", "Daily Routines Advanced", "Shopping & Money", "Health & Body",
    "Directions & Travel", "Small Talk Basics", "Ordering in a Restaurant", "Describing People",
    "Feelings & Emotions", "Weather & Seasons", "Technology Vocabulary", "Movies & Music",
    "Email Writing Basics", "Telephone English", "Making Appointments", "Revisão Intermediário"
  ],
  Advanced: [
    "Present Perfect (Introduction)", "Present Perfect vs Past Simple", "Present Perfect (Ever/Never)",
    "Present Perfect (For/Since)", "First Conditional", "Second Conditional", "Third Conditional",
    "Passive Voice (Present)", "Passive Voice (Past)", "Reported Speech (Statements)",
    "Reported Speech (Questions)", "Phrasal Verbs (Separable)", "Phrasal Verbs (Inseparable)",
    "Relative Clauses (Who/Which)", "Modals of Deduction", "Used to / Would",
    "Future Continuous", "Future Perfect", "Gerunds vs Infinitives", "Idioms: Business",
    "Idioms: Social", "Suffixes & Prefixes", "Formal vs Informal Writing", "Linking Words (However/Although)",
    "Revisão Avançado"
  ],
  Fluent: [
    "Conversação: Opiniões Complexas", "Debating Techniques", "Interview Skills (Behavioral)",
    "Business Negotiations", "Presentation Skills", "Slang & Colloquialisms", "Understanding Accents",
    "Subtleties of Meaning", "Humor in English", "Cultural References", "News & Media Literacy",
    "Academic Writing", "Storytelling Advanced", "Hypothetical Situations", "Revisão Fluência"
  ]
};

// Helper to create a specific lesson
const createLesson = (id: number, level: LevelType, topic: string): Lesson => {
  // In a real app, this would fetch from a database. 
  // Here we procedurally generate plausible content based on the topic.
  
  return {
    id,
    level,
    title: `Lesson ${id}: ${topic}`,
    topic,
    content: {
      pt: `Nesta aula de nível ${level}, vamos focar em: ${topic}. É essencial para sua fluência.`,
      en: `In this ${level} level lesson, we will focus on: ${topic}. This is essential for your fluency.`,
      grammarNote: "Memorize the pattern and try to use it in your own sentences."
    },
    quiz: {
      question: `Translate related to ${topic}: "Eu estou aprendendo."`,
      answer: "I am learning", // Placeholder for logic
      options: ["I am learn", "I am learning", "I learning", "I do learn"]
    }
  };
};

// Override specific early lessons to have real content for the demo
const OVERRIDES: Record<number, Partial<Lesson>> = {
  1: {
    content: {
      pt: "O alfabeto e sons são a base. Em inglês, as vogais têm sons diferentes dependendo da palavra.",
      en: "The alphabet and sounds are the foundation. In English, vowels have different sounds depending on the word.",
      grammarNote: "A (ei), E (i), I (ai), O (ou), U (iu)"
    },
    quiz: {
      question: "Which letter sounds like 'Di'?",
      answer: "D",
      options: ["G", "J", "D", "T"]
    }
  },
  2: {
    content: {
      pt: "Cumprimentos são essenciais. 'Hello' é formal, 'Hi' é informal. 'Good morning' usa-se até o meio-dia.",
      en: "Greetings are essential. 'Hello' is formal, 'Hi' is informal. 'Good morning' is used until noon.",
    },
    quiz: {
      question: "Translate: Bom dia",
      answer: "Good morning",
      options: ["Good night", "Good afternoon", "Good morning", "Hello"]
    }
  },
  3: {
    content: {
      pt: "O Verbo To Be significa 'Ser' ou 'Estar'. I am (Eu sou/estou), You are (Você é/está).",
      en: "The Verb To Be means 'Ser' or 'Estar'. I am, You are, He is.",
    },
    quiz: {
      question: "Complete: She ___ happy.",
      answer: "is",
      options: ["are", "am", "is", "be"]
    }
  }
};

export const generateCurriculum = (): Lesson[] => {
  let lessons: Lesson[] = [];
  let idCounter = 1;

  (Object.keys(SYLLABUS) as LevelType[]).forEach(level => {
    const topics = SYLLABUS[level];
    topics.forEach(topic => {
      let lesson = createLesson(idCounter, level, topic);
      
      // Apply overrides if they exist for this ID
      if (OVERRIDES[idCounter]) {
        lesson = { ...lesson, ...OVERRIDES[idCounter] };
      }

      lessons.push(lesson);
      idCounter++;
    });
  });

  // Trim to exactly 100 if syllabus varies, or fill if short
  return lessons.slice(0, 100);
};

export const curriculum = generateCurriculum();