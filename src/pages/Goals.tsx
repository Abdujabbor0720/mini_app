import React, { useState, useEffect } from 'react';
import '../App.css';

interface Goal {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
    progress: number;
    createdAt: string;
}

const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium' as const,
        deadline: ''
    });
    // Backenddan maqsadlarni olish uchun useEffect va fetch
    // CRUD amallarini backendga bog'lash

    useEffect(() => {
        fetch('https://server001.alwaysdata.net/api/v1/goals')
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => {
                setGoals([]);
                console.error('Maqsadlarni olishda xatolik:', err);
            });
    }, []);

    const filteredGoals = goals.filter(goal => {
        if (activeTab === 'active') return goal.status !== 'completed';
        if (activeTab === 'completed') return goal.status === 'completed';
        return true;
    });

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.title.trim()) return;

        const goal: Goal = {
            id: Date.now(),
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            status: 'pending',
            priority: newGoal.priority,
            deadline: newGoal.deadline,
            progress: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };

        setGoals([goal, ...goals]);
        setNewGoal({
            title: '',
            description: '',
            category: 'personal',
            priority: 'medium',
            deadline: ''
        });
        setShowAddForm(false);
    };

    const updateProgress = (id: number, newProgress: number) => {
        setGoals(goals.map(goal =>
            goal.id === id
                ? {
                    ...goal,
                    progress: newProgress,
                    status: newProgress === 100 ? 'completed' : 'in_progress'
                }
                : goal
        ));
    };

    const deleteGoal = (id: number) => {
        if (confirm('Ushbu maqsadni o\'chirishni tasdiqlaysizmi?')) {
            setGoals(goals.filter(goal => goal.id !== id));
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'var(--error-color)';
            case 'medium': return 'var(--warning-color)';
            case 'low': return 'var(--success-color)';
            default: return 'var(--secondary-text)';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return '✅';
            case 'in_progress': return '🔄';
            default: return '⏳';
        }
    };

    return (
        <div className="page fade-in">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="back-btn" onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                    ←
                </button>
                <div>
                    <h1 className="page-title">🎯 Maqsadlarim</h1>
                    <p className="page-subtitle">Maqsadlaringizni boshqaring va kuzatib boring</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="nav-menu">
                <button
                    className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setActiveTab('all')}
                >
                    Barchasi ({goals.length})
                </button>
                <button
                    className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setActiveTab('active')}
                >
                    Faol ({goals.filter(g => g.status !== 'completed').length})
                </button>
                <button
                    className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'} nav-item`}
                    onClick={() => setActiveTab('completed')}
                >
                    Bajarilgan ({goals.filter(g => g.status === 'completed').length})
                </button>
            </div>

            {/* Add Goal Button */}
            <div className="mb-4">
                <button
                    className="btn btn-primary btn-large btn-block"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    ➕ Yangi maqsad qo'shish
                </button>
            </div>

            {/* Add Goal Form */}
            {showAddForm && (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Yangi maqsad yaratish</h2>
                    </div>
                    <div className="card-content">
                        <form onSubmit={handleAddGoal}>
                            <div className="form-group">
                                <label className="form-label">Maqsad nomi *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    placeholder="Masalan: Kitob o'qish"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tavsif</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                    placeholder="Maqsad haqida batafsil ma'lumot"
                                />
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Muhimlik darajasi</label>
                                    <select
                                        className="form-control"
                                        value={newGoal.priority}
                                        onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                                    >
                                        <option value="low">Past</option>
                                        <option value="medium">O'rta</option>
                                        <option value="high">Yuqori</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Muddat</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={newGoal.deadline}
                                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <button type="submit" className="btn btn-primary">
                                    Saqlash
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Goals List */}
            <div className="goals-list">
                {filteredGoals.length === 0 ? (
                    <div className="card text-center">
                        <div className="card-content">
                            <p style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎯</p>
                            <h3>Maqsadlar topilmadi</h3>
                            <p className="text-secondary">
                                {activeTab === 'all'
                                    ? 'Hali maqsad qo\'shilmagan. Birinchi maqsadingizni yarating!'
                                    : `${activeTab === 'active' ? 'Faol' : 'Bajarilgan'} maqsadlar topilmadi.`
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredGoals.map(goal => (
                        <div key={goal.id} className="card hover-lift">
                            <div className="card-header">
                                <div className="d-flex align-center">
                                    <span style={{ marginRight: 'var(--spacing-sm)', fontSize: '1.2rem' }}>
                                        {getStatusIcon(goal.status)}
                                    </span>
                                    <div>
                                        <h3 className="card-title" style={{ marginBottom: '4px' }}>
                                            {goal.title}
                                        </h3>
                                        <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: getPriorityColor(goal.priority),
                                                    color: 'white',
                                                    padding: '2px 8px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {goal.priority === 'high' ? 'Muhim' : goal.priority === 'medium' ? 'O\'rta' : 'Past'}
                                            </span>
                                            <span style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>
                                                {goal.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-error"
                                    style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                    onClick={() => deleteGoal(goal.id)}
                                >
                                    🗑️
                                </button>
                            </div>

                            <div className="card-content">
                                {goal.description && (
                                    <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--secondary-text)' }}>
                                        {goal.description}
                                    </p>
                                )}

                                {/* Progress Bar */}
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <div className="d-flex justify-between align-center" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                        <span style={{ fontSize: '0.875rem' }}>Taraqqiyot</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{goal.progress}%</span>
                                    </div>
                                    <div
                                        style={{
                                            background: 'var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            height: '8px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: goal.status === 'completed' ? 'var(--success-color)' : 'var(--accent-color)',
                                                height: '100%',
                                                width: `${goal.progress}%`,
                                                transition: 'width 0.3s ease'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Progress Controls */}
                                {goal.status !== 'completed' && (
                                    <div className="d-flex" style={{ gap: 'var(--spacing-sm)' }}>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => updateProgress(goal.id, Math.max(0, goal.progress - 10))}
                                            disabled={goal.progress <= 0}
                                        >
                                            -10%
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => updateProgress(goal.id, Math.min(100, goal.progress + 10))}
                                            disabled={goal.progress >= 100}
                                        >
                                            +10%
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => updateProgress(goal.id, 100)}
                                            disabled={goal.progress >= 100}
                                        >
                                            ✅ Tugallash
                                        </button>
                                    </div>
                                )}

                                {/* Deadline */}
                                {goal.deadline && (
                                    <div style={{ marginTop: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                        📅 Muddat: {new Date(goal.deadline).toLocaleDateString('uz-UZ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Goals;
