import React, { useState, useEffect } from 'react';
import '../App.css';

interface HomeProps {
    user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
    };
}

const Home: React.FC<HomeProps> = ({ user }) => {
    const [greeting, setGreeting] = useState('');
    const [quickStats, setQuickStats] = useState({
        totalGoals: 0,
        completedGoals: 0,
        filesConverted: 0,
        streakDays: 0
    });

    const API_URL = 'https://optimal-bot-api.vercel.app/api/v1';

    useEffect(() => {
        // Set greeting based on time
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Xayrli tong!');
        } else if (hour < 18) {
            setGreeting('Xayrli kun!');
        } else {
            setGreeting('Xayrli kech!');
        }

        // Load quick stats (mock data for now)
        setQuickStats({
            totalGoals: 5,
            completedGoals: 3,
            filesConverted: 12,
            streakDays: 7
        });

        if (user) {
            fetch(`${API_URL}/auth/telegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId: user.id,
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    language: user.language_code,
                    initData: window.Telegram?.WebApp?.initData || '',
                }),
            })
                .then(res => res.json())
                .then(data => {
                    // You can store token or user info in state if needed
                    console.log('Auth response:', data);
                })
                .catch(err => {
                    console.error('Auth error:', err);
                });
        }
    }, [user]);

    const quickActions = [
        {
            title: 'Yangi maqsad',
            description: 'Yangi maqsad qo\'shing',
            action: '/goals',
            icon: '🎯',
            color: 'var(--accent-color)'
        },
        {
            title: 'Fayl konvertatsiya',
            description: 'PDF yoki hujjat konvertatsiya qiling',
            action: '/files',
            icon: '📄',
            color: 'var(--success-color)'
        },
        {
            title: 'Statistika',
            description: 'Yutuqlaringizni ko\'ring',
            action: '/statistics',
            icon: '📊',
            color: 'var(--warning-color)'
        },
        {
            title: 'Sozlamalar',
            description: 'Profil va tilni sozlang',
            action: '/settings',
            icon: '⚙️',
            color: 'var(--secondary-text)'
        }
    ];

    return (
        <div className="page fade-in">
            {/* Welcome Section */}
            <div className="page-header">
                <h1 className="page-title">
                    {greeting} {user?.first_name || 'Foydalanuvchi'}!
                </h1>
                <p className="page-subtitle">
                    OptimalBot bilan maqsadlaringizga erishing va fayl konvertatsiya qiling
                </p>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid mb-4">
                <div className="stat-card hover-lift">
                    <span className="stat-value">{quickStats.totalGoals}</span>
                    <span className="stat-label">Jami maqsadlar</span>
                </div>
                <div className="stat-card hover-lift">
                    <span className="stat-value">{quickStats.completedGoals}</span>
                    <span className="stat-label">Bajarilgan</span>
                </div>
                <div className="stat-card hover-lift">
                    <span className="stat-value">{quickStats.filesConverted}</span>
                    <span className="stat-label">Fayllar</span>
                </div>
                <div className="stat-card hover-lift">
                    <span className="stat-value">{quickStats.streakDays}</span>
                    <span className="stat-label">Kun ketma-ket</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Tezkor amallar</h2>
                </div>
                <div className="card-content">
                    <div className="grid grid-2">
                        {quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.action}
                                className="btn btn-secondary hover-lift"
                                style={{
                                    textDecoration: 'none',
                                    borderColor: action.color,
                                    color: action.color
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Navigate using React Router or Telegram WebApp navigation
                                    window.location.hash = action.action;
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                                    {action.icon}
                                </span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600' }}>{action.title}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                        {action.description}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">So'nggi faoliyat</h2>
                </div>
                <div className="card-content">
                    <ul className="list">
                        <li className="list-item">
                            <div>
                                <strong>📚 "Kitob o'qish" maqsadi yaratildi</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    2 soat oldin
                                </div>
                            </div>
                        </li>
                        <li className="list-item">
                            <div>
                                <strong>📄 Resume.docx → PDF konvertatsiya qilindi</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    5 soat oldin
                                </div>
                            </div>
                        </li>
                        <li className="list-item">
                            <div>
                                <strong>🎯 "Sport" maqsadi bajarildi</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    1 kun oldin
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Tips Card */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">💡 Maslahat</h2>
                </div>
                <div className="card-content">
                    <p>
                        Har kuni kam bo'lsa ham bitta maqsadingizga ishlang.
                        Kichik qadamlar katta yutuqlarga olib keladi!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
