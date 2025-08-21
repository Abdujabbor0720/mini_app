import React, { useState, useEffect } from 'react';
import '../App.css';

interface StatData {
    goals: {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
        completionRate: number;
    };
    files: {
        totalConverted: number;
        todayConverted: number;
        weekConverted: number;
        monthConverted: number;
    };
    activity: {
        streakDays: number;
        lastActive: string;
        totalSessions: number;
        averageDaily: number;
    };
    categories: {
        [key: string]: number;
    };
}

const Statistics: React.FC = () => {
    const [stats, setStats] = useState<StatData | null>(null);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://server001.alwaysdata.net/api/v1/statistics?range=${timeRange}`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                setStats(null);
                console.error('Statistika olishda xatolik:', err);
            });
    }, [timeRange]);

    if (loading) {
        return (
            <div className="page">
                <div className="app-loading">
                    <div className="loading-spinner"></div>
                    <p>Statistika yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="page">
                <div className="alert alert-error">
                    Statistika ma'lumotlarini yuklashda xatolik yuz berdi.
                </div>
            </div>
        );
    }

    const achievementBadges = [
        {
            title: 'Dastlabki qadam',
            description: 'Birinchi maqsadni yaratdingiz',
            icon: '🎯',
            earned: true
        },
        {
            title: 'Utkir',
            description: '5 ta maqsadni bajardingiz',
            icon: '⚡',
            earned: stats.goals.completed >= 5
        },
        {
            title: 'Doimiylik',
            description: '7 kun ketma-ket faol',
            icon: '🔥',
            earned: stats.activity.streakDays >= 7
        },
        {
            title: 'Konvertor',
            description: '10 ta fayl konvertatsiya qildingiz',
            icon: '📄',
            earned: stats.files.totalConverted >= 10
        },
        {
            title: 'Ustoz',
            description: '50 ta maqsadni bajardingiz',
            icon: '👑',
            earned: stats.goals.completed >= 50
        }
    ];

    return (
        <div className="page fade-in">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="back-btn" onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                    ←
                </button>
                <div>
                    <h1 className="page-title">📊 Statistika</h1>
                    <p className="page-subtitle">Yutuqlaringiz va taraqqiyotingizni kuzating</p>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="nav-menu">
                <button
                    className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setTimeRange('week')}
                >
                    Hafta
                </button>
                <button
                    className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setTimeRange('month')}
                >
                    Oy
                </button>
                <button
                    className={`btn ${timeRange === 'year' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setTimeRange('year')}
                >
                    Yil
                </button>
            </div>

            {/* Main Stats */}
            <div className="stats-grid mb-4">
                <div className="stat-card hover-lift">
                    <span className="stat-value">{stats.goals.total}</span>
                    <span className="stat-label">Jami maqsadlar</span>
                </div>
                <div className="stat-card hover-lift">
                    <span className="stat-value" style={{ color: 'var(--success-color)' }}>
                        {stats.goals.completed}
                    </span>
                    <span className="stat-label">Bajarilgan</span>
                </div>
                <div className="stat-card hover-lift">
                    <span className="stat-value" style={{ color: 'var(--warning-color)' }}>
                        {stats.goals.completionRate}%
                    </span>
                    <span className="stat-label">Muvaffaqiyat</span>
                </div>
                <div className="stat-card hover-lift">
                    <span className="stat-value" style={{ color: 'var(--accent-color)' }}>
                        {stats.activity.streakDays}
                    </span>
                    <span className="stat-label">Kun ketma-ket</span>
                </div>
            </div>

            {/* Goals Breakdown */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Maqsadlar taqsimoti</h2>
                </div>
                <div className="card-content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value" style={{ color: 'var(--success-color)' }}>
                                {stats.goals.completed}
                            </span>
                            <span className="stat-label">✅ Bajarilgan</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value" style={{ color: 'var(--accent-color)' }}>
                                {stats.goals.inProgress}
                            </span>
                            <span className="stat-label">🔄 Jarayonda</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value" style={{ color: 'var(--warning-color)' }}>
                                {stats.goals.pending}
                            </span>
                            <span className="stat-label">⏳ Kutilmoqda</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div className="d-flex justify-between align-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <span>Umumiy taraqqiyot</span>
                            <span style={{ fontWeight: '600' }}>{stats.goals.completionRate}%</span>
                        </div>
                        <div
                            style={{
                                background: 'var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                height: '20px',
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                style={{
                                    background: `linear-gradient(90deg, var(--success-color) 0%, var(--accent-color) 100%)`,
                                    height: '100%',
                                    width: `${stats.goals.completionRate}%`,
                                    transition: 'width 0.5s ease'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* File Conversion Stats */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">📄 Fayl konvertatsiya</h2>
                </div>
                <div className="card-content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{stats.files.todayConverted}</span>
                            <span className="stat-label">Bugun</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.files.weekConverted}</span>
                            <span className="stat-label">Hafta</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.files.monthConverted}</span>
                            <span className="stat-label">Oy</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.files.totalConverted}</span>
                            <span className="stat-label">Jami</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Kategoriyalar bo'yicha</h2>
                </div>
                <div className="card-content">
                    <div className="list">
                        {Object.entries(stats.categories).map(([category, count]) => (
                            <div key={category} className="list-item">
                                <span>{category}</span>
                                <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                    <div
                                        style={{
                                            background: 'var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            height: '8px',
                                            width: '100px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: 'var(--accent-color)',
                                                height: '100%',
                                                width: `${(count / stats.goals.total) * 100}%`,
                                                transition: 'width 0.3s ease'
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontWeight: '600', minWidth: '20px' }}>{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🔥 Faollik</h2>
                </div>
                <div className="card-content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{stats.activity.streakDays}</span>
                            <span className="stat-label">Kun ketma-ket</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.activity.totalSessions}</span>
                            <span className="stat-label">Jami sessiyalar</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.activity.averageDaily}</span>
                            <span className="stat-label">Kunlik o'rtacha</span>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                        So'ngi faollik: {new Date(stats.activity.lastActive).toLocaleDateString('uz-UZ')}
                    </div>
                </div>
            </div>

            {/* Achievement Badges */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🏆 Yutuqlar</h2>
                </div>
                <div className="card-content">
                    <div className="grid grid-2">
                        {achievementBadges.map((badge, index) => (
                            <div
                                key={index}
                                className={`stat-card ${badge.earned ? 'hover-lift' : ''}`}
                                style={{
                                    opacity: badge.earned ? 1 : 0.5,
                                    background: badge.earned ? 'var(--card-bg)' : 'var(--border-color)'
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {badge.icon}
                                </div>
                                <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                    {badge.title}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    {badge.description}
                                </div>
                                {badge.earned && (
                                    <div style={{
                                        marginTop: 'var(--spacing-sm)',
                                        color: 'var(--success-color)',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        ✓ Qo'lga kiritildi
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Haftalik faollik</h2>
                </div>
                <div className="card-content">
                    <div className="d-flex justify-between align-center" style={{ height: '100px' }}>
                        {['D', 'S', 'C', 'P', 'J', 'S', 'Y'].map((day, index) => {
                            const activity = Math.floor(Math.random() * 5) + 1; // Mock data
                            return (
                                <div key={index} className="d-flex flex-column align-center" style={{ gap: 'var(--spacing-xs)' }}>
                                    <div
                                        style={{
                                            width: '30px',
                                            height: `${activity * 15}px`,
                                            background: activity > 3 ? 'var(--success-color)' : activity > 1 ? 'var(--warning-color)' : 'var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                        Oxirgi 7 kun davomidagi faollik
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
