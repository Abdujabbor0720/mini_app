import React, { useState, useEffect } from 'react';
import '../App.css';

interface UserSettings {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
        goals: boolean;
        files: boolean;
        achievements: boolean;
        daily: boolean;
    };
    privacy: {
        shareStats: boolean;
        showOnline: boolean;
    };
    fileSettings: {
        autoDownload: boolean;
        maxFileSize: number;
        preferredFormats: string[];
    };
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings>({
        language: 'uz',
        theme: 'auto',
        notifications: {
            goals: true,
            files: true,
            achievements: true,
            daily: false
        },
        privacy: {
            shareStats: false,
            showOnline: true
        },
        fileSettings: {
            autoDownload: true,
            maxFileSize: 10,
            preferredFormats: ['pdf', 'docx']
        }
    });

    const [user] = useState({
        firstName: 'Foydalanuvchi',
        lastName: '',
        username: '@username',
        joinDate: '2025-01-15'
    });
    const [appInfo, setAppInfo] = useState({
        version: '1.0.0',
        lastUpdate: new Date().toISOString().split('T')[0],
        developer: 'OptimalBot Team'
    });

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load settings from backend API
        fetch(`${process.env.REACT_APP_API_URL || '/api/v1'}/settings`)
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                document.documentElement.setAttribute('data-theme', data.theme === 'auto' ? 'light' : data.theme);
            })
            .catch(() => {
                // Fallback to localStorage if API fails
                const savedSettings = localStorage.getItem('optimalbot-settings');
                if (savedSettings) {
                    setSettings(JSON.parse(savedSettings));
                }
                document.documentElement.setAttribute('data-theme', settings.theme === 'auto' ? 'light' : settings.theme);
            });
        // Ilova haqida ma'lumotni backenddan olish
        fetch(`${process.env.REACT_APP_API_URL || '/api/v1'}/app-info`)
            .then(res => res.json())
            .then(data => {
                setAppInfo({
                    version: data.version || '1.0.0',
                    lastUpdate: data.lastUpdate || new Date().toISOString().split('T')[0],
                    developer: data.developer || 'OptimalBot Team'
                });
            })
            .catch(() => {
                setAppInfo({
                    version: '1.0.0',
                    lastUpdate: new Date().toISOString().split('T')[0],
                    developer: 'OptimalBot Team'
                });
            });
    }, []);

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('optimalbot-settings', JSON.stringify(updated));

        // Apply theme immediately
        if (newSettings.theme) {
            document.documentElement.setAttribute('data-theme', newSettings.theme === 'auto' ? 'light' : newSettings.theme);
        }

        // Save to backend
        fetch(`${process.env.REACT_APP_API_URL || '/api/v1'}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        }).catch(() => { });
    };

    const saveSettings = async () => {
        setSaving(true);
        await fetch(`${process.env.REACT_APP_API_URL || '/api/v1'}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        setSaving(false);

        // Show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = 'Sozlamalar saqlandi!';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.zIndex = '1000';
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 3000);
    };

    const resetSettings = () => {
        if (showResetConfirm) {
            const defaultSettings: UserSettings = {
                language: 'uz',
                theme: 'auto',
                notifications: {
                    goals: true,
                    files: true,
                    achievements: true,
                    daily: false
                },
                privacy: {
                    shareStats: false,
                    showOnline: true
                },
                fileSettings: {
                    autoDownload: true,
                    maxFileSize: 10,
                    preferredFormats: ['pdf', 'docx']
                }
            };

            setSettings(defaultSettings);
            localStorage.setItem('optimalbot-settings', JSON.stringify(defaultSettings));
            setShowResetConfirm(false);
        } else {
            setShowResetConfirm(true);
        }
    };

    const exportData = () => {
        const data = {
            settings,
            user,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimalbot-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1 className="page-title">⚙️ Sozlamalar</h1>
                <p className="page-subtitle">Profil va ilovani sozlang</p>
            </div>

            {/* Profile Info */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">👤 Profil ma'lumotlari</h2>
                </div>
                <div className="card-content">
                    <div className="d-flex align-center" style={{ gap: 'var(--spacing-lg)' }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--accent-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                color: 'white'
                            }}
                        >
                            {user.firstName.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>
                                {user.firstName} {user.lastName}
                            </h3>
                            <p style={{ color: 'var(--secondary-text)', marginBottom: 'var(--spacing-xs)' }}>
                                {user.username}
                            </p>
                            <p style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>
                                Qo'shilgan: {new Date(user.joinDate).toLocaleDateString('uz-UZ')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🌐 Til sozlamalari</h2>
                </div>
                <div className="card-content">
                    <div className="form-group">
                        <label className="form-label">Interfeys tili</label>
                        <select
                            className="form-control"
                            style={{ color: 'var(--primary-text)', background: 'var(--card-bg)' }}
                            value={settings.language}
                            onChange={(e) => updateSettings({ language: e.target.value })}
                        >
                            <option value="uz">O'zbek tili</option>
                            <option value="ru">Русский язык</option>
                            <option value="en">English</option>
                            <option value="tr">Türkçe</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Theme Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🎨 Mavzu sozlamalari</h2>
                </div>
                <div className="card-content">
                    <div className="form-group">
                        <label className="form-label">Interfeys mavzusi</label>
                        <div className="grid grid-3">
                            <button
                                className={`btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => updateSettings({ theme: 'light' })}
                            >
                                ☀️ Yorqin
                            </button>
                            <button
                                className={`btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => updateSettings({ theme: 'dark' })}
                            >
                                🌙 Qorong'u
                            </button>
                            <button
                                className={`btn ${settings.theme === 'auto' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => updateSettings({ theme: 'auto' })}
                            >
                                🤖 Avto
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🔔 Bildirishnoma sozlamalari</h2>
                </div>
                <div className="card-content">
                    <div className="list">
                        <div className="list-item">
                            <div>
                                <strong>Maqsad bildirshnomalari</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Maqsadlar haqida eslatmalar
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.goals}
                                    onChange={(e) => updateSettings({
                                        notifications: { ...settings.notifications, goals: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="list-item">
                            <div>
                                <strong>Fayl bildirishnomalari</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Fayl konvertatsiya haqida xabarlar
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.files}
                                    onChange={(e) => updateSettings({
                                        notifications: { ...settings.notifications, files: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="list-item">
                            <div>
                                <strong>Yutuq bildirishnomalari</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Yangi yutuqlar haqida xabarlar
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.achievements}
                                    onChange={(e) => updateSettings({
                                        notifications: { ...settings.notifications, achievements: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="list-item">
                            <div>
                                <strong>Kunlik eslatmalar</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Har kuni maqsadlar haqida eslatma
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.daily}
                                    onChange={(e) => updateSettings({
                                        notifications: { ...settings.notifications, daily: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">🔒 Maxfiylik sozlamalari</h2>
                </div>
                <div className="card-content">
                    <div className="list">
                        <div className="list-item">
                            <div>
                                <strong>Statistikalarni ulashish</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Boshqalar bilan statistikalarni ulashing
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.shareStats}
                                    onChange={(e) => updateSettings({
                                        privacy: { ...settings.privacy, shareStats: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="list-item">
                            <div>
                                <strong>Onlayn holatni ko'rsatish</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Boshqalarga onlayn ekanligingizni ko'rsating
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.privacy.showOnline}
                                    onChange={(e) => updateSettings({
                                        privacy: { ...settings.privacy, showOnline: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">📁 Fayl sozlamalari</h2>
                </div>
                <div className="card-content">
                    <div className="form-group">
                        <label className="form-label">Maksimal fayl hajmi (MB)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={settings.fileSettings.maxFileSize}
                            onChange={(e) => updateSettings({
                                fileSettings: { ...settings.fileSettings, maxFileSize: Number(e.target.value) }
                            })}
                            min="1"
                            max="50"
                        />
                    </div>

                    <div className="list">
                        <div className="list-item">
                            <div>
                                <strong>Avtomatik yuklab olish</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    Konvertatsiya qilingan fayllarni avtomatik yuklab olish
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.fileSettings.autoDownload}
                                    onChange={(e) => updateSettings({
                                        fileSettings: { ...settings.fileSettings, autoDownload: e.target.checked }
                                    })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">💾 Ma'lumotlar boshqaruvi</h2>
                </div>
                <div className="card-content">
                    <div className="grid grid-2">
                        <button className="btn btn-secondary" onClick={exportData}>
                            📤 Ma'lumotlarni eksport qilish
                        </button>
                        <button
                            className={`btn ${showResetConfirm ? 'btn-error' : 'btn-warning'}`}
                            onClick={resetSettings}
                        >
                            {showResetConfirm ? '⚠️ Tasdiqlash' : '🔄 Sozlamalarni tiklash'}
                        </button>
                    </div>

                    {showResetConfirm && (
                        <div className="alert alert-warning" style={{ marginTop: 'var(--spacing-md)' }}>
                            <strong>Diqqat!</strong> Barcha sozlamalar standart holatga qaytariladi.
                            <button
                                className="btn btn-secondary"
                                style={{ marginLeft: 'var(--spacing-md)' }}
                                onClick={() => setShowResetConfirm(false)}
                            >
                                Bekor qilish
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="card">
                <div className="card-content">
                    <button
                        className="btn btn-primary btn-large btn-block"
                        onClick={saveSettings}
                        disabled={saving}
                    >
                        {saving ? '💾 Saqlanmoqda...' : '💾 Sozlamalarni saqlash'}
                    </button>
                </div>
            </div>

            {/* App Info */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">ℹ️ Ilova haqida</h2>
                </div>
                <div className="card-content">
                    <div className="list">
                        <div className="list-item">
                            <span>Versiya</span>
                            <span>{appInfo.version}</span>
                        </div>
                        <div className="list-item">
                            <span>Oxirgi yangilanish</span>
                            <span>{appInfo.lastUpdate}</span>
                        </div>
                        <div className="list-item">
                            <span>Dasturchi</span>
                            <span>{appInfo.developer}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div className="grid grid-2">
                            <a className="btn btn-secondary" href="tel:+998770131725">
                                📞 Qo'llab-quvvatlash
                                <br />
                                <span style={{ fontSize: '0.9rem', color: 'var(--primary-text)' }}>+998770131725</span>
                            </a>
                            <button className="btn btn-secondary">
                                ⭐ Baholash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
