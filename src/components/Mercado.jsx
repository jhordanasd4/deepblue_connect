import React from 'react';

// El componente ahora recibe userData (para leer las gotas) y onBuy (para comprar)
const Mercado = ({ userData, onBuy, onClose }) => {
  // Accede a las gotas_agua desde el objeto userData
  const gotasActuales = userData.gotas_agua;

  return (
    // Estilo modal para superponerse a la pantalla
    <div className="mercado-overlay">
      <div className="mercado-modal">
        <h2>🐟 Mercado Submarino</h2>
        <p>Tus Gotas actuales: **{gotasActuales}** 💧</p> 
        
        <div className="mercado-items">
          
          {/* Pez Globo (50 Gotas) */}
          <div className="mercado-item">
            <h3>Pez Globo</h3>
            mnv 
            <p>Costo: 50 Gotas</p>
            <button 
              // Llama a la función onBuy que está definida en App.jsx
              onClick={() => onBuy(50, 'Pez Globo')} 
              disabled={gotasActuales < 50}
              className={gotasActuales < 50 ? 'disabled' : ''}
            >
              Comprar
            </button>
          </div>

          {/* Pez Martillo (90 Gotas) */}
          <div className="mercado-item">
            <h3>Pez Martillo</h3>
            <p>Costo: 90 Gotas</p>
            <button 
              // Llama a la función onBuy que está definida en App.jsx
              onClick={() => onBuy(90, 'Pez Martillo')}
              disabled={gotasActuales < 90}
              className={gotasActuales < 90 ? 'disabled' : ''}
            >
              Comprar
            </button>
          </div>
        </div>

        <button className="close-button" onClick={onClose}>Cerrar Mercado</button>
      </div>
    </div>
  );
};

export default Mercado;