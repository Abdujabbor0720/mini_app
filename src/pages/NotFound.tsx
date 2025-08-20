import React from 'react';
import '../App.css';

const NotFound: React.FC = () => {
    return (
        <div className="page fade-in">
            <div className="page-header text-center">
                <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-lg)' }}>
                    🤖
                </div>
                <h1 className="page-title">404 - Sahifa topilmadi</h1>
                <p className="page-subtitle">
                    Kechirasiz, siz qidirayotgan sahifa mavjud emas
                </p>
            </div>

            <div className="card text-center">
                <div className="card-content">
                    <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--secondary-text)' }}>
                        Bu sahifa o'chirilgan, ko'chirilgan yoki hech qachon mavjud bo'lmagan bo'lishi mumkin.
                    </p>

                    <div className="grid grid-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.hash = '/'}
                        >
                            🏠 Bosh sahifa
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => window.history.back()}
                        >
                            ← Orqaga
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Foydali havolalar</h2>
                </div>
                <div className="card-content">
                    <div className="list">
                        <a
                            href="#/"
                            className="list-item hover-lift"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '1.2rem' }}>🏠</span>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Bosh sahifa</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                        Asosiy sahifaga qaytish
                                    </div>
                                </div>
                            </div>
                        </a>

                        <a
                            href="#/goals"
                            className="list-item hover-lift"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Maqsadlar</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                        Maqsadlaringizni boshqaring
                                    </div>
                                </div>
                            </div>
                        </a>

                        <a
                            href="#/files"
                            className="list-item hover-lift"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '1.2rem' }}>📄</span>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Fayl konvertatsiya</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                        Fayllarni konvertatsiya qiling
                                    </div>
                                </div>
                            </div>
                        </a>

                        <a
                            href="#/statistics"
                            className="list-item hover-lift"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '1.2rem' }}>📊</span>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Statistika</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                        Yutuqlaringizni ko'ring
                                    </div>
                                </div>
                            </div>
                        </a>

                        <a
                            href="#/settings"
                            className="list-item hover-lift"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Sozlamalar</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                        Ilovani sozlang
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
