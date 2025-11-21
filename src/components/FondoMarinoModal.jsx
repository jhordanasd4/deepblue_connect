import React, { useMemo, useState } from 'react';

// Fondo Marino: 45 días fijos, tasa diaria 4.5%, mínimo 15 USDT (15 gotas)
// Compra directa si el usuario tiene saldo suficiente. No genera solicitud.
// Muestra cálculo de ganancia total esperada y lista de fondos comprados.

const FondoMarinoModal = ({ onClose, onBuy, userData }) => {
  const [amount, setAmount] = useState(''); // USDT

  const dailyRate = 4.5; // % diario
  const days = 45; // fijo
  const minAmount = 15;

  const { validAmount, expected } = useMemo(() => {
    const a = parseFloat(amount || '0') || 0;
    const est = a * (dailyRate / 100) * days; // a * 4.5% * 45 = a * 2.025
    return { validAmount: a >= minAmount, expected: est };
  }, [amount]);

  const canAfford = useMemo(() => {
    const a = parseFloat(amount || '0') || 0;
    const balance = parseFloat(userData?.gotas || 0);
    return a > 0 && a <= balance;
  }, [amount, userData?.gotas]);

  const handleBuy = () => {
    if (!validAmount) {
      alert(`El monto mínimo para el Fondo es ${minAmount} USDT (gotas).`);
      return;
    }
    if (!canAfford) {
      alert('No tienes suficientes Gotas para comprar este Fondo.');
      return;
    }
    onBuy?.(parseFloat(amount));
  };

  return (
    <div className="mercado-overlay">
      <div className="mercado-modal" style={{ maxWidth: 720 }}>
        <h2>Fondo Marino</h2>

        <div style={{
          background: '#0b2740', border: '1px solid #1e3a5f', borderRadius: 10,
          padding: 16, marginBottom: 16
        }}>
          <div style={{ fontWeight: 700, color: '#9dd6ff', marginBottom: 8 }}>Características</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, color: '#e5e7eb' }}>
            <div>📅 Duración: <strong>{days} días</strong> (fija)</div>
            <div>📈 Tasa diaria: <strong>{dailyRate}%</strong></div>
            <div>💧 Equivalencia: <strong>1 Gota = 1 USDT</strong></div>
            <div>💰 Mínimo de inversión: <strong>{minAmount} USDT</strong></div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, textAlign: 'left', marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Monto (USDT)</label>
            <input
              type="number"
              min={minAmount}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Mínimo ${minAmount}`}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
            />
            <div style={{ color: '#9dd6ff', marginTop: 6 }}>Saldo actual: {userData?.gotas ?? 0} 💧</div>
          </div>
        </div>

        <div style={{
          background: '#0f1419', border: '1px solid #233244', borderRadius: 10, padding: 12,
          color: '#bfe9ff', textAlign: 'center', marginBottom: 12
        }}>
          <div style={{ fontSize: 14 }}>Gotas esperadas en 45 días</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
            {isFinite(expected) ? expected.toFixed(2) : '0.00'} 💧
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <button className="close-button" onClick={onClose}>Cerrar</button>
          <button className="mercado-item" style={{ border: 'none', padding: 12 }} onClick={handleBuy}>
            Comprar Fondo
          </button>
        </div>

        {/* Lista de fondos comprados */}
        <div style={{ marginTop: 18, textAlign: 'left' }}>
          <div style={{ fontWeight: 700, color: '#9dd6ff', marginBottom: 10 }}>Mis Fondos</div>
          {Array.isArray(userData?.fondos) && userData.fondos.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fondo #</th>
                    <th>Monto</th>
                    <th>Duración</th>
                    <th>Tasa diaria</th>
                    <th>Generará (45 días)</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.fondos.map((f, idx) => (
                    <tr key={f.id}>
                      <td>{idx + 1}</td>
                      <td>{f.amount}</td>
                      <td>{f.days} días</td>
                      <td>{f.daily_rate}%</td>
                      <td>{(f.expected_total).toFixed(2)} 💧</td>
                      <td>{new Date(f.start_date).toLocaleDateString()}</td>
                      <td>{new Date(f.end_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: '#94a3b8' }}>Aún no tienes fondos comprados.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FondoMarinoModal;
