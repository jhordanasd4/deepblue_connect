import React, { useState, useEffect } from 'react';

const comunidadStyles = `
.comunidad-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.comunidad-modal {
  background: linear-gradient(135deg, #0a2540 0%, #001a33 100%);
  border: 1px solid rgba(0, 170, 255, 0.3);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.comunidad-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 170, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #0a2540 0%, #001a33 100%);
  z-index: 1;
}

.comunidad-title {
  font-size: 24px;
  font-weight: 700;
  color: #7dd3fc;
  margin: 0;
}

.comunidad-close {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.comunidad-close:hover {
  background: rgba(239, 68, 68, 0.3);
}

.comunidad-content {
  padding: 24px;
}

.referral-card {
  background: rgba(0, 30, 55, 0.6);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 170, 255, 0.2);
}

.referral-link-container {
  background: rgba(0, 15, 30, 0.8);
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.referral-link {
  font-family: monospace;
  font-size: 14px;
  color: #7dd3fc;
  word-break: break-all;
  margin: 8px 0;
}

.copy-button {
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.2s;
}

.copy-button:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.stat-card {
  background: rgba(0, 40, 70, 0.6);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid rgba(125, 211, 252, 0.3);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #7dd3fc;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.referrals-list {
  margin-top: 20px;
}

.referral-item {
  background: rgba(0, 40, 70, 0.4);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(125, 211, 252, 0.2);
}

.referral-name {
  color: #bfe9ff;
  font-weight: 600;
}

.referral-reward {
  color: #10b981;
  font-weight: 700;
  font-size: 14px;
}

.info-box {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-title {
  color: #10b981;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
}

.info-text {
  color: #d1eaff;
  font-size: 14px;
  line-height: 1.6;
}
`;

const ComunidadMarina = ({ onClose, userData }) => {
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarned: 0,
    referrals: []
  });
  const [loading, setLoading] = useState(true);

  const referralCode = userData?.id || 'unknown';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000';

  useEffect(() => {
    const loadReferralStats = async () => {
      if (!userData?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/referrals/${userData.id}`);
        const result = await response.json();
        
        if (response.ok && result.success) {
          setReferralStats({
            totalReferrals: result.data.totalReferrals || 0,
            totalEarned: result.data.totalEarned || 0,
            referrals: (result.data.referrals || []).map(ref => ({
              name: ref.name || ref.username,
              email: ref.email,
              earned: ref.earned || 0,
              date: ref.date
            }))
          });
        }
      } catch (error) {
        console.error('Error cargando estadísticas de referidos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReferralStats();
  }, [userData, API_BASE_URL]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Error al copiar el enlace');
    }
  };

  const handleOpenReferralLink = () => {
    // Copiar el enlace al portapapeles primero
    navigator.clipboard.writeText(referralLink).catch(() => {});
    
    // Mostrar mensaje
    alert('📋 Enlace copiado al portapapeles.\n\n🔗 Compártelo con tus amigos para que se registren.\n\nCuando peguen el enlace en su navegador, serán dirigidos al formulario de registro.');
  };

  return (
    <div className="comunidad-overlay" onClick={onClose}>
      <style>{comunidadStyles}</style>
      <div className="comunidad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comunidad-header">
          <h2 className="comunidad-title">🤝 Comunidad Marina - Programa de Referidos</h2>
          <button className="comunidad-close" onClick={onClose}>
            ✕ Cerrar
          </button>
        </div>

        <div className="comunidad-content">
          {/* Información del programa */}
          <div className="info-box">
            <div className="info-title">💰 ¡Gana 15% de comisión por cada referido!</div>
            <div className="info-text">
              Comparte tu enlace de referido con amigos. Cuando se registren y compren gotas,
              recibirás automáticamente el 15% del monto de su compra como recompensa.
            </div>
          </div>

          {/* Tu enlace de referido */}
          <div className="referral-card">
            <h3 style={{ color: '#7dd3fc', marginBottom: '12px', fontSize: '18px' }}>
              🔗 Tu Enlace de Referido
            </h3>
            <div className="referral-link-container">
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                Código de referido: <strong style={{ color: '#7dd3fc' }}>{referralCode}</strong>
              </div>
              <div className="referral-link">{referralLink}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button className="copy-button" onClick={handleCopyLink}>
                  {copied ? '✓ ¡Copiado!' : '📋 Copiar Enlace'}
                </button>
                <button 
                  className="copy-button" 
                  onClick={handleOpenReferralLink}
                  style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}
                >
                  📤 Compartir Enlace
                </button>
              </div>
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>
                  💡 Cómo funciona:
                </div>
                <div style={{ fontSize: '12px', color: '#d1eaff', lineHeight: '1.5' }}>
                  1. Copia tu enlace de referido<br/>
                  2. Compártelo con tus amigos<br/>
                  3. Cuando se registren usando tu enlace, aparecerán aquí<br/>
                  4. Gana 15% de comisión cuando compren gotas
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{referralStats.totalReferrals}</div>
              <div className="stat-label">Usuarios Registrados</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{referralStats.totalEarned.toFixed(1)}</div>
              <div className="stat-label">Gotas Ganadas</div>
            </div>
          </div>

          {/* Lista de referidos */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Cargando estadísticas...
            </div>
          ) : referralStats.referrals.length > 0 ? (
            <div className="referrals-list">
              <h3 style={{ color: '#7dd3fc', marginBottom: '12px', fontSize: '18px' }}>
                📊 Usuarios Registrados con tu Enlace
              </h3>
              {referralStats.referrals.map((ref, index) => (
                <div key={index} className="referral-item">
                  <div style={{ flex: 1 }}>
                    <div className="referral-name">{ref.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      📧 {ref.email || 'Email no disponible'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      📅 Registrado: {new Date(ref.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="referral-reward">
                    +{ref.earned.toFixed(1)} gotas
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              color: '#94a3b8' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌊</div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Aún no se ha registrado nadie con tu enlace
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>
                ¡Comparte tu enlace de referido y comienza a ganar el 15% de comisión!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComunidadMarina;