import React from 'react';
import marketItems from '../constants/marketItems';

// Mercado alineado con App.jsx: usa userData.gotas y llama onBuy con el id del ítem
const Mercado = ({ userData, onBuy, onClose, onNeedRecharge }) => {
  const gotasActuales = userData?.gotas ?? 0;

  return (
    <div className="mercado-overlay">
      <div className="mercado-modal">
        <h2>🐟 Mercado Submarino</h2>
        <p>Tus Gotas actuales: {gotasActuales} 💧</p>

        <div className="mercado-items">
          {marketItems.map(item => (
            <div className="mercado-item" key={item.id}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  width={320}
                  height={180}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                  loading="lazy"
                />
              )}
              <h3>{item.name}</h3>
              <p className="text-sm">{item.description}</p>
              <p>Costo: {item.cost} Gotas</p>
              <p>Recompensa: {item.reward}</p>
              {gotasActuales < item.cost ? (
                <button onClick={() => onNeedRecharge?.(item)} className={'disabled'}>
                  Faltan {item.cost - gotasActuales} Gotas — Recargar
                </button>
              ) : (
                <button onClick={() => onBuy(item.id)}>
                  Comprar
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="close-button" onClick={onClose}>Cerrar Mercado</button>
      </div>
    </div>
  );
};

export default Mercado;