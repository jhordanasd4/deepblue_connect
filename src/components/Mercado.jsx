// deepblue-frontend/src/components/Mercado.jsx

import React from 'react';

const Mercado = ({ gotas, setGotas, onClose }) => {
  // Función que maneja la compra de un pez
  const comprarPez = (costo, nombrePez) => {
    if (gotas >= costo) {
      // Resta el costo de las gotas
      setGotas(gotas - costo);
      alert(`¡Compra exitosa! Has comprado el ${nombrePez}. Te quedan ${gotas - costo} Gotas.`);
    } else {
      alert("¡Gotas insuficientes! Necesitas más para comprar este pez.");
    }
  };

  return (
    // Estilo modal para superponerse a la pantalla
    <div className="mercado-overlay">
      <div className="mercado-modal">
        <h2>🐟 Mercado Submarino</h2>
        <p>Tus Gotas actuales: **{gotas}**</p>
        
        <div className="mercado-items">
          {/* Pez Globo (50 Gotas) */}
          <div className="mercado-item">
            <h3>Pez Globo</h3>
            <p>Costo: 50 Gotas</p>
            <button 
              onClick={() => comprarPez(50, 'Pez Globo')} 
              disabled={gotas < 50}
              className={gotas < 50 ? 'disabled' : ''}
            >
              Comprar
            </button>
          </div>

          {/* Pez Martillo (90 Gotas) */}
          <div className="mercado-item">
            <h3>Pez Martillo</h3>
            <p>Costo: 90 Gotas</p>
            <button 
              onClick={() => comprarPez(90, 'Pez Martillo')}
              disabled={gotas < 90}
              className={gotas < 90 ? 'disabled' : ''}
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