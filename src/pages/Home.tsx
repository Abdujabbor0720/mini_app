import React, { useState, useEffect } from 'react';
import '../App.css';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface HomeProps {
    user: TelegramUser | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
    const [greeting, setGreeting] = useState('');
    const [quickStats, setQuickStats] = useState({
        totalGoals: 0,
        completedGoals: 0,
        filesConverted: 0,
        streakDays: 0
    });
    const [recentActivity, setRecentActivity] = useState<Array<{ text: string, time: string }>>([]);

    const API_URL = 'https://server001.alwaysdata.net//api/v1';

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

        // Statistikani va faoliyatni backenddan olish
        fetch(`${API_URL}/statistics/home`)
            .then(res => res.json())
            .then(data => {
                setQuickStats({
                    totalGoals: data.totalGoals,
                    completedGoals: data.completedGoals,
                    filesConverted: data.filesConverted,
                    streakDays: data.streakDays
                });
                setRecentActivity(data.recentActivity || []);
            })
            .catch(() => {
                setQuickStats({
                    totalGoals: 0,
                    completedGoals: 0,
                    filesConverted: 0,
                    streakDays: 0
                });
                setRecentActivity([]);
            });
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
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="back-btn" onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                    ←
                </button>
                <div>
                    <h1 className="page-title">
                        {greeting} {user?.first_name || 'Foydalanuvchi'}!
                    </h1>
                    <p className="page-subtitle">
                        OptimalBot bilan maqsadlaringizga erishing va fayl konvertatsiya qiling
                    </p>
                </div>
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
                        {recentActivity.length === 0 ? (
                            <li className="list-item">
                                <div>Faoliyat topilmadi</div>
                            </li>
                        ) : (
                            recentActivity.map((item, idx) => (
                                <li key={idx} className="list-item">
                                    <div>
                                        <strong>{item.text}</strong>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                            {item.time}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
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
