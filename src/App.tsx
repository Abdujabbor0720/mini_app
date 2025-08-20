import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Goals from './pages/Goals';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import FileConverter from './pages/FileConverter';
import NotFound from './pages/NotFound';
import './App.css';

// Telegram WebApp types
interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface AppState {
    user: TelegramUser | null;
    theme: 'light' | 'dark';
    isLoading: boolean;
}

const App: React.FC = () => {
    const [state, setState] = useState<AppState>({
        user: null,
        theme: 'light',
        isLoading: true,
    });

    // Initialize Telegram WebApp
    useEffect(() => {
        const initializeApp = () => {
            try {
                if (window.Telegram?.WebApp) {
                    const webApp = window.Telegram.WebApp;

                    // Get user data
                    const user = webApp.initDataUnsafe.user;
                    const theme = webApp.colorScheme || 'light';

                    // Apply theme
                    document.documentElement.setAttribute('data-theme', theme);

                    // Ready the app
                    webApp.ready();
                    webApp.expand();

                    setState({
                        user,
                        theme,
                        isLoading: false
                    });
                } else {
                    // Fallback for development
                    setState({
                        user: {
                            id: 123456789,
                            first_name: 'Test',
                            last_name: 'User',
                            username: 'testuser',
                            language_code: 'uz'
                        },
                        theme: 'light',
                        isLoading: false
                    });
                }
            } catch (error) {
                console.error('Error initializing Telegram WebApp:', error);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initializeApp();
    }, []);

    if (state.isLoading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <HashRouter>
            <div className="app telegram-safe-area">
                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home user={state.user} />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/files" element={<FileConverter />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <p>&copy; 2024 OptimalBot. Barcha huquqlar himoyalangan.</p>
                </footer>
            </div>
        </HashRouter>
    );
};

export default App;
