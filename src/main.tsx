import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './App.css';

// Initialize Telegram WebApp
declare global {
    interface Window {
        Telegram: {
            WebApp: {
                ready(): void;
                close(): void;
                expand(): void;
                MainButton: {
                    show(): void;
                    hide(): void;
                    setText(text: string): void;
                    onClick(callback: () => void): void;
                };
                BackButton: {
                    show(): void;
                    hide(): void;
                    onClick(callback: () => void): void;
                };
                initData: string;
                initDataUnsafe: {
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                    };
                };
                colorScheme: 'light' | 'dark';
                themeParams: {
                    bg_color?: string;
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                };
            };
        };
    }
}

// Initialize Telegram WebApp
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
