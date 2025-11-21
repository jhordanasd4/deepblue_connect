import React, { useMemo, useState } from 'react';

const NETWORKS = [
  { id: 'trc20-usdt', label: 'TRC20-USDT' },
  { id: 'trx', label: 'TRX' },
  { id: 'bep20-usdt', label: 'BEP20-USDT' },
  { id: 'bnb', label: 'BNB' },
  { id: 'polygon-usdt', label: 'POLYGON-USDT' },
  { id: 'eth-usdt', label: 'ETH-USDT' },
];

const chipStyle = (active) => ({
  padding: '8px 12px', borderRadius: 20, border: '1px solid #4b5563',
  background: active ? '#10b981' : '#1f2937', color: active ? '#fff' : '#d1d5db', cursor: 'pointer', fontWeight: 600,
});

const RetiroModal = ({ onClose, onSubmit }) => {
  const [network, setNetwork] = useState('trc20-usdt');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const valid = useMemo(() => {
    const amt = parseFloat(amount || '0') || 0;
    return address.trim().length > 0 && amt >= 20;
  }, [address, amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) {
      alert('Monto mínimo 20 USDT y dirección requerida.');
      return;
    }
    onSubmit({ network, address, amount: parseFloat(amount || '0') || 0, note });
  };

  return (
    <div className="mercado-overlay">
      <div className="mercado-modal" style={{ maxWidth: 720 }}>
        <h2>Solicitud de Retiro</h2>
        <div style={{ color: '#fbbf24', marginBottom: 8 }}>Mínimo de retiro: 20 USDT</div>

        {/* Selección de red */}
        <div style={{ textAlign: 'left', marginBottom: 10, color: '#d1d5db' }}>Red de retiro</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, justifyContent: 'flex-start' }}>
          {NETWORKS.map(n => (
            <button
              key={n.id}
              type="button"
              onClick={() => setNetwork(n.id)}
              style={chipStyle(n.id === network)}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Monto (USDT)</label>
            <input
              type="number"
              min="20"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ingresa el monto a retirar (>= 20)"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Dirección / Enlace de tu wallet</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Pega tu dirección o enlace de wallet"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Nota (opcional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Algún detalle adicional"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="close-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="mercado-item" style={{ border: 'none', padding: 12 }}>Enviar solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RetiroModal;
