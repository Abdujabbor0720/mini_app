import React, { useState, useEffect } from 'react';
import '../App.css';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
    action?: {
        label: string;
        url: string;
    };
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading notifications
        setTimeout(() => {
            setNotifications([
                {
                    id: '1',
                    title: 'Maqsad bajarildi! 🎉',
                    message: '"Kitob o\'qish" maqsadi muvaffaqiyatli bajarildi!',
                    type: 'success',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    read: false,
                    action: {
                        label: 'Ko\'rish',
                        url: '#/goals'
                    }
                },
                {
                    id: '2',
                    title: 'Fayl konvertatsiya tayyor',
                    message: 'Resume.docx fayli PDF formatiga konvertatsiya qilindi',
                    type: 'info',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                    read: false,
                    action: {
                        label: 'Yuklab olish',
                        url: '#/files'
                    }
                },
                {
                    id: '3',
                    title: 'Eslatma: Kunlik maqsad',
                    message: 'Bugun sport bilan shug\'ullanish vaqti keldi!',
                    type: 'warning',
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    read: true,
                    action: {
                        label: 'Maqsadlarni ko\'rish',
                        url: '#/goals'
                    }
                },
                {
                    id: '4',
                    title: 'Yangi yutuq qo\'lga kiritildi!',
                    message: 'Siz "Doimiylik" yutuqini qo\'lga kiritdingiz - 7 kun ketma-ket faol!',
                    type: 'success',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    read: true,
                    action: {
                        label: 'Yutuqlarni ko\'rish',
                        url: '#/statistics'
                    }
                },
                {
                    id: '5',
                    title: 'Tizim xabari',
                    message: 'OptimalBot ilovasi 1.0.1 versiyasiga yangilandi',
                    type: 'info',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    read: true
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'read') return notification.read;
        return true;
    });

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success': return 'var(--success-color)';
            case 'warning': return 'var(--warning-color)';
            case 'error': return 'var(--error-color)';
            default: return 'var(--accent-color)';
        }
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes} daqiqa oldin`;
        } else if (hours < 24) {
            return `${hours} soat oldin`;
        } else {
            return `${days} kun oldin`;
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="app-loading">
                    <div className="loading-spinner"></div>
                    <p>Bildirishnomalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1 className="page-title">🔔 Bildirishnomalar</h1>
                <p className="page-subtitle">
                    {unreadCount > 0
                        ? `${unreadCount} ta o'qilmagan bildirishnoma`
                        : 'Barcha bildirishnomalar o\'qilgan'
                    }
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="nav-menu">
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setFilter('all')}
                >
                    Barchasi ({notifications.length})
                </button>
                <button
                    className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setFilter('unread')}
                >
                    O'qilmagan ({unreadCount})
                </button>
                <button
                    className={`btn ${filter === 'read' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setFilter('read')}
                >
                    O'qilgan ({notifications.length - unreadCount})
                </button>
            </div>

            {/* Action Buttons */}
            {unreadCount > 0 && (
                <div className="mb-4">
                    <button
                        className="btn btn-secondary btn-block"
                        onClick={markAllAsRead}
                    >
                        Hammasini o'qilgan deb belgilash
                    </button>
                </div>
            )}

            {/* Notifications List */}
            <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                    <div className="card text-center">
                        <div className="card-content">
                            <p style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔔</p>
                            <h3>Bildirishnomalar topilmadi</h3>
                            <p className="text-secondary">
                                {filter === 'all'
                                    ? 'Hali bildirishnomalar yo\'q'
                                    : `${filter === 'unread' ? 'O\'qilmagan' : 'O\'qilgan'} bildirishnomalar yo'q`
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`card hover-lift ${!notification.read ? 'unread-notification' : ''}`}
                            style={{
                                borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                                opacity: notification.read ? 0.8 : 1
                            }}
                        >
                            <div className="card-header">
                                <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <h3
                                            className="card-title"
                                            style={{
                                                marginBottom: '4px',
                                                fontWeight: notification.read ? '500' : '700'
                                            }}
                                        >
                                            {notification.title}
                                        </h3>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                            {formatTime(notification.timestamp)}
                                            {!notification.read && (
                                                <span
                                                    style={{
                                                        marginLeft: 'var(--spacing-sm)',
                                                        color: 'var(--accent-color)',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    • Yangi
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-error"
                                    style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                    onClick={() => deleteNotification(notification.id)}
                                    title="O'chirish"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="card-content">
                                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                                    {notification.message}
                                </p>

                                <div className="d-flex" style={{ gap: 'var(--spacing-sm)' }}>
                                    {notification.action && (
                                        <a
                                            href={notification.action.url}
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                markAsRead(notification.id);
                                                window.location.hash = notification.action!.url;
                                            }}
                                        >
                                            {notification.action.label}
                                        </a>
                                    )}

                                    {!notification.read && (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            O'qilgan deb belgilash
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Notification Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">⚙️ Bildirishnoma sozlamalari</h2>
                </div>
                <div className="card-content">
                    <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--secondary-text)' }}>
                        Qaysi bildirishnomalarni olishni xohlaysiz?
                    </p>

                    <a
                        href="#/settings"
                        className="btn btn-secondary btn-block"
                    >
                        Sozlamalarni boshqarish
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Notifications;