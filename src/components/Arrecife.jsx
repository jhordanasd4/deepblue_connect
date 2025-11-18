// deepblue-frontend/src/components/Arrecife.jsx

import React from 'react';

// Componente para representar cada objeto en el arrecife
const ArrecifeItem = ({ item }) => {
    const style = {
        position: 'absolute',
        left: `${item.pos_x}%`, // Posicionamiento porcentual
        bottom: `${item.pos_y}%`,
        width: item.tipo === 'especie' ? '100px' : '150px', 
        zIndex: 10,
    };
    
    // Placeholder visual
    const displayChar = item.tipo === 'especie' ? '🐠' : '🍄';

    return (
        <div style={style} title={item.nombre}>
            {displayChar}
        </div>
    );
};

// Se añade onOpenMarket para manejar el clic del botón Mercado
const Arrecife = ({ userData, onExplore, onOpenMarket }) => {
    if (!userData) {
        return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Cargando datos del Arrecife...</div>;
    }

    return (
        <div className="arrecife-container">
            {/* -------------------- 1. HEADER (Barra Superior) -------------------- */}
            <header className="header">
                <span className="user-info">
                    🌊 {userData.username} | Nivel {userData.nivel}
                </span>
                <span className="resources">
                    💧 Gotas: **{userData.gotas_agua}** | 💎 Perlas: {userData.perlas}
                </span>
            </header>

            {/* -------------------- 2. ESCENA MARINA -------------------- */}
            <div className="escena-marina">
                {/* Renderizar ítems del arrecife desde data.json */}
                {userData.arrecife_items.map(item => (
                    <ArrecifeItem key={item.id} item={item} />
                ))}

                {/* Botón de Interacción Clave */}
                <button className="explore-button" onClick={onExplore}>
                    🐠 ¡Explorar Aguas y Ganar Gotas! (+10)
                </button>
            </div>

            {/* -------------------- 3. FOOTER (Navegación) -------------------- */}
            <footer className="footer">
                <nav>
                    {/* El botón ahora usa el prop onOpenMarket */}
                    <button className="nav-button" onClick={onOpenMarket}>
                        🛒 Mercado Submarino
                    </button>
                    <button className="nav-button">📜 Misiones Oceánicas</button>
                    <button className="nav-button">🤝 Comunidad Marina</button>
                </nav>
            </footer>
        </div>
    );
};

export default Arrecife;