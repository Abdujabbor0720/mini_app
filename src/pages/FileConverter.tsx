import React, { useState, useRef } from 'react';
import '../App.css';

interface FileConversionResult {
    id: string;
    originalName: string;
    convertedName: string;
    size: number;
    status: 'processing' | 'completed' | 'error';
    downloadUrl?: string;
    error?: string;
    timestamp: Date;
}

const FileConverter: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [conversions, setConversions] = useState<FileConversionResult[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [converting, setConverting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supportedFormats = {
        'PDF': ['docx', 'doc', 'txt', 'rtf', 'odt'],
        'DOCX': ['pdf', 'txt', 'rtf', 'odt'],
        'PNG': ['jpg', 'jpeg', 'webp', 'bmp'],
        'JPG': ['png', 'webp', 'bmp'],
        'WEBP': ['jpg', 'jpeg', 'png', 'bmp']
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const convertFiles = async () => {
        if (files.length === 0) return;

        setConverting(true);

        if (files.length === 0) return;
        setConverting(true);
        const conversionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newConversion: FileConversionResult = {
            id: conversionId,
            originalName: files.map(f => f.name).join(', '),
            convertedName: 'Birlashtirilgan.pdf',
            size: files.reduce((sum, f) => sum + f.size, 0),
            status: 'processing',
            timestamp: new Date()
        };
        setConversions(prev => [newConversion, ...prev]);
        try {
            // Bir nechta faylni birlashtirib backendga yuborish
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            formData.append('targetFormat', 'pdf');
            formData.append('merge', 'true');
            const response = await fetch(`${process.env.REACT_APP_API_URL || '/api/v1'}/files/convert`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Konvertatsiya qilishda xatolik yuz berdi');
            }
            const result = await response.json();
            setConversions(prev => prev.map(conv =>
                conv.id === conversionId
                    ? {
                        ...conv,
                        status: 'completed',
                        downloadUrl: result.downloadUrl,
                        convertedName: result.convertedName || newConversion.convertedName
                    }
                    : conv
            ));
        } catch (error: any) {
            setConversions(prev => prev.map(conv =>
                conv.id === conversionId
                    ? {
                        ...conv,
                        status: 'error',
                        error: error.message || 'Kutilmagan xatolik'
                    }
                    : conv
            ));
        }
        setFiles([]);
        setConverting(false);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf': return '📄';
            case 'docx': case 'doc': return '📝';
            case 'txt': return '📋';
            case 'jpg': case 'jpeg': case 'png': case 'webp': case 'bmp': return '🖼️';
            case 'xlsx': case 'xls': return '📊';
            case 'pptx': case 'ppt': return '📈';
            default: return '📁';
        }
    };

    const downloadFile = (conversion: FileConversionResult) => {
        if (conversion.downloadUrl) {
            window.open(conversion.downloadUrl, '_blank');
        }
    };

    return (
        <div className="page fade-in">
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="back-btn" onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                    ←
                </button>
                <div>
                    <h1 className="page-title">📄 Fayl konvertatsiya</h1>
                    <p className="page-subtitle">Fayllarni turli formatlarga o'giring</p>
                </div>
            </div>

            {/* Supported Formats */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Qo'llab-quvvatlanadigan formatlar</h2>
                </div>
                <div className="card-content">
                    <div className="grid grid-2">
                        {Object.entries(supportedFormats).map(([format, supported]) => (
                            <div
                                key={format}
                                className="stat-card format-card"
                                tabIndex={0}
                                style={{
                                    transition: 'box-shadow 0.3s, background 0.3s',
                                    cursor: 'pointer',
                                }}
                                onFocus={e => e.currentTarget.classList.add('active')}
                                onBlur={e => e.currentTarget.classList.remove('active')}
                                onMouseDown={e => e.currentTarget.classList.add('active')}
                                onMouseUp={e => e.currentTarget.classList.remove('active')}
                                onMouseLeave={e => e.currentTarget.classList.remove('active')}
                                onMouseEnter={e => e.currentTarget.classList.add('hovered')}
                                onMouseOut={e => e.currentTarget.classList.remove('hovered')}
                            >
                                <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                    {getFileIcon(format.toLowerCase())} {format}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                    {supported.join(', ')} dan
                                </div>
                            </div>
                            /* CSS: format-card uchun animatsiya va rang effektlari */
                            // .format-card:hover, .format-card.hovered {
                            //   box-shadow: 0 0 0 3px var(--accent-color);
                            //   background: rgba(0,123,255,0.08);
                            //   transform: scale(1.03);
                            // }
                            // .format-card.active {
                            //   box-shadow: 0 0 0 3px var(--success-color);
                            //   background: rgba(40,167,69,0.12);
                            //   transform: scale(1.05);
                            // }
                        ))}
                    </div>
                </div>
            </div>

            {/* File Upload Area */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Fayllarni yuklash</h2>
                </div>
                <div className="card-content">
                    <div
                        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragOver ? 'var(--accent-color)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-xl)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: dragOver ? 'rgba(0, 123, 255, 0.1)' : 'var(--card-bg)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                            📁
                        </div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Fayllarni bu erga tashlang yoki bosing
                        </h3>
                        <p style={{ color: 'var(--secondary-text)' }}>
                            Maksimal hajm: 50 MB
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                            accept=".pdf,.docx,.doc,.txt,.rtf,.odt,.jpg,.jpeg,.png,.webp,.bmp,.xlsx,.xls,.pptx,.ppt"
                            max="52428800"
                        />
                    </div>

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                                Tanlangan fayllar ({files.length})
                            </h3>
                            <div className="list">
                                {files.map((file, index) => (
                                    <div key={index} className="list-item">
                                        <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                            <span style={{ fontSize: '1.2rem' }}>
                                                {getFileIcon(file.name)}
                                            </span>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{file.name}</div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                                    {formatFileSize(file.size)}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-error"
                                            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                            onClick={() => removeFile(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="btn btn-primary btn-large btn-block"
                                style={{ marginTop: 'var(--spacing-md)' }}
                                onClick={convertFiles}
                                disabled={converting}
                            >
                                {converting ? '🔄 Konvertatsiya qilinmoqda...' : '🔄 Konvertatsiya qilish'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Conversion History */}
            {conversions.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Konvertatsiya tarixi</h2>
                    </div>
                    <div className="card-content">
                        <div className="list">
                            {conversions.map((conversion) => (
                                <div key={conversion.id} className="list-item">
                                    <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                        <span style={{ fontSize: '1.2rem' }}>
                                            {getFileIcon(conversion.originalName)}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500' }}>
                                                {conversion.originalName} → {conversion.convertedName}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                                                {formatFileSize(conversion.size)} • {conversion.timestamp.toLocaleTimeString('uz-UZ')}
                                            </div>
                                            {conversion.error && (
                                                <div style={{ fontSize: '0.875rem', color: 'var(--error-color)' }}>
                                                    {conversion.error}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex align-center" style={{ gap: 'var(--spacing-sm)' }}>
                                        {conversion.status === 'processing' && (
                                            <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                                        )}

                                        {conversion.status === 'completed' && (
                                            <>
                                                <span style={{ color: 'var(--success-color)', fontSize: '1.2rem' }}>✅</span>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                                    onClick={() => downloadFile(conversion)}
                                                >
                                                    📥 Yuklab olish
                                                </button>
                                            </>
                                        )}

                                        {conversion.status === 'error' && (
                                            <span style={{ color: 'var(--error-color)', fontSize: '1.2rem' }}>❌</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">💡 Maslahatlar</h2>
                </div>
                <div className="card-content">
                    <ul style={{ paddingLeft: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                        <li>Fayllar avtomatik ravishda PDF formatiga konvertatsiya qilinadi</li>
                        <li>Bir vaqtning o'zida bir nechta faylni yuklash mumkin</li>
                        <li>Konvertatsiya qilingan fayllar 24 soat davomida mavjud bo'ladi</li>
                        <li>Maksimal fayl hajmi 50 MB dan oshmasligi kerak</li>
                        <li>Rasm fayllarini PDF ga birlashtirish mumkin</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FileConverter;
