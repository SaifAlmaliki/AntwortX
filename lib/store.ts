import { create } from 'zustand';

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type KnowledgeBaseItem = {
  id: string;
  question: string;
  answer: string;
};

interface AppState {
  messages: Message[];
  knowledgeBase: KnowledgeBaseItem[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addToKnowledgeBase: (items: Omit<KnowledgeBaseItem, 'id'>[]) => void;
  clearMessages: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: [
    {
      id: "welcome",
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ],
  knowledgeBase: [],
  
  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      },
    ],
  })),
  
  addToKnowledgeBase: (items) => set((state) => ({
    knowledgeBase: [
      ...state.knowledgeBase,
      ...items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      })),
    ],
  })),
  
  clearMessages: () => set((state) => ({
    messages: [
      {
        id: "welcome",
        content: "Hello! How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
  })),
}));
