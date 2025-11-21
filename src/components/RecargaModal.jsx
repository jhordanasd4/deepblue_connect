import React, { useState } from 'react';

// Modal de Recarga sin QR: selector de red, dirección y subida de comprobante
// Props: onClose, onSubmit, defaultNetwork
const NETWORKS = [
  { id: 'trc20-usdt', label: 'TRC20-USDT', address: 'TU5UZGajWY2pSBbAbxsD4Ua7NZNmtohCpY' },
  { id: 'bep20-usdt', label: 'BEP20-USDT', address: '0x41622D3A30cE0A3C9cDa279395A03B73440dB17a' },
  { id: 'bnb', label: 'BNB', address: '0x41622D3A30cE0A3C9cDa279395A03B73440dB17a' },
  { id: 'polygon-usdt', label: 'POLYGON-USDT', address: '0x41622D3A30cE0A3C9cDa279395A03B73440dB17a' },
];

const chipStyle = (active) => ({
  padding: '8px 12px',
  borderRadius: 20,
  border: '1px solid #4b5563',
  background: active ? '#ef4444' : '#1f2937',
  color: active ? '#fff' : '#d1d5db',
  cursor: 'pointer',
  fontWeight: 600,
});

const RecargaModal = ({ onClose, onSubmit, defaultNetwork = 'trc20-usdt' }) => {
  const [network, setNetwork] = useState(defaultNetwork);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const selected = NETWORKS.find(n => n.id === network) || NETWORKS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.address);
      // opcional: feedback visual
      alert('Dirección copiada');
    } catch {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Sube la imagen del comprobante.');
      return;
    }
    onSubmit({ network, address: selected.address, amount, note, file });
  };

  return (
    <div className="mercado-overlay">
      <div className="mercado-modal" style={{ maxWidth: 720 }}>
        <h2>Recarga de Gotas</h2>

        {/* Tipo de recarga */}
        <div style={{ textAlign: 'left', marginBottom: 10, color: '#d1d5db' }}>Tipo de recarga</div>
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

        {/* Dirección de depósito */}
        <div style={{ textAlign: 'left', marginBottom: 8, color: '#d1d5db' }}>Dirección de depósito</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          <input
            type="text"
            readOnly
            value={selected.address}
            style={{ width: '100%', maxWidth: 520, padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
          />
          <button type="button" className="nav-button" onClick={handleCopy} style={{ whiteSpace: 'nowrap' }}>Copiar</button>
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Monto (opcional)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}z
              placeholder="Ingrese el monto"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb' }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Nota </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ingrese nombre completo"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151', background: '#111827', color: '#e5e7eb', resize: 'vertical' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#d1d5db' }}>Subir imagen del comprobante </label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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

export default RecargaModal;
