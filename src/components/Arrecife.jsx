// deepblue-frontend/src/components/Arrecife.jsx

import React, { useState } from 'react';
import MisSolicitudes from './MisSolicitudes';
import MisRetiros from './MisRetiros';
import ComunidadMarina from './ComunidadMarina';

// Componente para representar cada objeto en el arrecife
const ArrecifeItem = ({ item, onClick }) => {
  const style = {
    position: 'absolute',
    left: `${item.pos_x}%`,
    bottom: `${item.pos_y}%`,
    cursor: 'pointer',
    zIndex: 10,
    transition: 'transform 0.2s',
  };

  return (
    <div 
      style={style} 
      title={item.nombre}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.nombre}
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '12px',
            border: '3px solid rgba(125, 211, 252, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}
        />
      ) : (
        <div style={{ fontSize: '48px' }}>
          {item.tipo === 'coral' ? '🪸' : item.tipo === 'alga' ? '🌿' : '🐠'}
        </div>
      )}
    </div>
  );
};

// Modal para ver items en detalle
const ItemDetailModal = ({ items, currentIndex, onClose, onNext, onPrev }) => {
  if (!items || items.length === 0) return null;
  
  const item = items[currentIndex];
  const hasMultiple = items.length > 1;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          maxWidth: '800px',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen principal */}
        <img 
          src={item.image} 
          alt={item.nombre}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh',
            objectFit: 'contain',
            borderRadius: '16px',
            border: '4px solid rgba(125, 211, 252, 0.8)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          }}
        />

        {/* Información del item */}
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          color: '#7dd3fc',
          fontSize: '24px',
          fontWeight: '700',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
        }}>
          {item.nombre}
        </div>

        {/* Contador si hay múltiples items */}
        {hasMultiple && (
          <div style={{
            marginTop: '8px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '16px',
          }}>
            {currentIndex + 1} de {items.length}
          </div>
        )}

        {/* Botones de navegación */}
        {hasMultiple && (
          <>
            <button
              onClick={onPrev}
              style={{
                position: 'absolute',
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(125, 211, 252, 0.2)',
                border: '2px solid rgba(125, 211, 252, 0.6)',
                color: '#7dd3fc',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(125, 211, 252, 0.4)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(125, 211, 252, 0.2)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ‹
            </button>

            <button
              onClick={onNext}
              style={{
                position: 'absolute',
                right: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(125, 211, 252, 0.2)',
                border: '2px solid rgba(125, 211, 252, 0.6)',
                color: '#7dd3fc',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(125, 211, 252, 0.4)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(125, 211, 252, 0.2)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ›
            </button>
          </>
        )}

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'rgba(239, 68, 68, 0.8)',
            border: '2px solid #ef4444',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          ✕ Cerrar
        </button>
      </div>
    </div>
  );
};

// Componente para mostrar items comprados en carrusel
const PurchasedItemsCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentItem = items[currentIndex];
  
  // Obtener fecha y hora de compra del ID del item
  const purchaseTimestamp = currentItem.id ? parseInt(currentItem.id.split('-')[1]) : Date.now();
  const purchaseDate = new Date(purchaseTimestamp);

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      background: 'rgba(0, 30, 55, 0.95)',
      border: '2px solid rgba(125, 211, 252, 0.6)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      minWidth: '280px',
      maxWidth: '400px',
    }}>
      <div style={{
        textAlign: 'center',
        color: '#7dd3fc',
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        🎁 Items Comprados
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            style={{
              background: 'rgba(125, 211, 252, 0.2)',
              border: '2px solid rgba(125, 211, 252, 0.6)',
              color: '#7dd3fc',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(125, 211, 252, 0.4)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(125, 211, 252, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ‹
          </button>
        )}

        <div style={{ flex: 1, textAlign: 'center' }}>
          {currentItem.image && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={currentItem.image}
                alt={currentItem.nombre}
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '2px solid rgba(125, 211, 252, 0.4)',
                  marginBottom: '8px',
                }}
              />
              {/* Fecha y hora de compra sobre la imagen */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#7dd3fc',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)',
              }}>
                📅 {purchaseDate.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })} • 🕐 {purchaseDate.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}
          <div style={{
            color: '#bfe9ff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '4px',
          }}>
            {currentItem.nombre}
          </div>
          {items.length > 1 && (
            <div style={{
              color: '#94a3b8',
              fontSize: '12px',
            }}>
              {currentIndex + 1} de {items.length}
            </div>
          )}
        </div>

        {items.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              background: 'rgba(125, 211, 252, 0.2)',
              border: '2px solid rgba(125, 211, 252, 0.6)',
              color: '#7dd3fc',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(125, 211, 252, 0.4)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(125, 211, 252, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

// Arrecife alineado con App.jsx: usa nombre, nivel, gotas, perlas y agrega onLogout
const Arrecife = ({ userData, onExplore, onOpenMarket, onOpenFondo, onOpenWithdraw, onLogout, requests = [], withdrawals = [] }) => {
  const [showMisSolicitudes, setShowMisSolicitudes] = useState(false);
  const [showMisRetiros, setShowMisRetiros] = useState(false);
  const [showComunidad, setShowComunidad] = useState(false);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  if (!userData) {
    return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Cargando datos del Arrecife...</div>;
  }

  const { nombre, nivel, gotas, perlas, arrecife_items = [] } = userData;
  
  // Contar solicitudes pendientes del usuario (buscar por userId o user)
  const pendingCount = requests.filter(r => 
    (r.user === nombre || r.userId === userData.id) && r.status === 'pending'
  ).length;

  const handleItemClick = (index) => {
    setCurrentItemIndex(index);
    setShowItemDetail(true);
  };

  const handleNextItem = () => {
    setCurrentItemIndex((prev) => (prev + 1) % arrecife_items.length);
  };

  const handlePrevItem = () => {
    setCurrentItemIndex((prev) => (prev - 1 + arrecife_items.length) % arrecife_items.length);
  };

  return (
    <div className="arrecife-container">
      <header className="header">
        <div className="profile">
          Capitán {nombre} | Nivel {nivel}
          <button onClick={onLogout} className="btn-logout" style={{ marginLeft: '15px' }}>
            Salir
          </button>
        </div>
        <div className="resources">
          💧 Gotas: {gotas} | 💎 Perlas: {perlas}
        </div>
      </header>

      {/* Barra de equivalencias debajo de Gotas/Perlas */}
      <div className="equivalences-bar" style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        background: 'rgba(0, 30, 55, 0.85)',
        borderTop: '1px solid rgba(125, 211, 252, 0.25)',
        borderBottom: '1px solid rgba(125, 211, 252, 0.25)'
      }}>
        <div style={{ fontWeight: 700 }}>Equivalencias:</div>
        <div>💧 1 Gota = 1 USDT</div>
        <div>•</div>
        <div>💎 1 Perla = 15 USDT</div>
        <div style={{ fontSize: 12, color: '#9dd3fc' }}>
          La Perla se obtiene al comprar mínimo un ítem de cada producto marino.
        </div>
      </div>

      <div className="escena-marina">
        {/* Mostrar items comprados arriba del botón de explorar */}
        {arrecife_items.length > 0 && (
          <PurchasedItemsCarousel items={arrecife_items} />
        )}

        {arrecife_items.map((item, index) => (
          <ArrecifeItem 
            key={item.id} 
            item={item} 
            onClick={() => handleItemClick(index)}
          />
        ))}

        <button className="explore-button" onClick={onExplore}>
          💧 Recarga Gotas
        </button>
      </div>

      {showItemDetail && arrecife_items.length > 0 && (
        <ItemDetailModal
          items={arrecife_items}
          currentIndex={currentItemIndex}
          onClose={() => setShowItemDetail(false)}
          onNext={handleNextItem}
          onPrev={handlePrevItem}
        />
      )}

      <footer className="footer">
        <nav>
          <button className="nav-button" onClick={onOpenMarket}>
            🛒 Mercado Submarino
          </button>
          <button className="nav-button" onClick={() => setShowMisSolicitudes(true)}>
            📋 Mis Solicitudes {pendingCount > 0 && `(${pendingCount})`}
          </button>
          <button className="nav-button" onClick={onOpenFondo}>🌊 Fondo Marino</button>
          <button className="nav-button" onClick={() => setShowComunidad(true)}>
            🤝 Comunidad Marina
          </button>
          <button className="nav-button" onClick={onOpenWithdraw}>💸 Retirar</button>
          <button className="nav-button" onClick={() => setShowMisRetiros(true)}>💵 Mis Retiros</button>
        </nav>
      </footer>

      {showMisSolicitudes && (
        <MisSolicitudes
          onClose={() => setShowMisSolicitudes(false)}
          requests={requests}
          userName={nombre}
          userId={userData.id}
        />
      )}

      {showComunidad && (
        <ComunidadMarina
          onClose={() => setShowComunidad(false)}
          userData={userData}
        />
      )}

      {showMisRetiros && (
        <MisRetiros onClose={() => setShowMisRetiros(false)} withdrawals={withdrawals} userId={userData.id} />
      )}
    </div>
  );
};

export default Arrecife;