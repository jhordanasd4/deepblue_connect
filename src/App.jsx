import React, { useState } from 'react';
import Login from './components/Login';
import Arrecife from './components/Arrecife';
import Mercado from './components/Mercado'; // NUEVA IMPORTACIÓN

const API_BASE_URL = 'https://deepblue-appi-repo.onrender.com'; // URL Permanente de Render

function App() {
    // Estado para gestionar el usuario autenticado
    const [userData, setUserData] = useState(null);
    // Estado para controlar la visibilidad del Mercado
    const [mostrarMercado, setMostrarMercado] = useState(false); // NUEVO ESTADO

    // 1. Manejo del Login (conexión con la API)
    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Si la respuesta no es 200 (OK), lanza un error con el mensaje de la API
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido en el servidor.');
            }

            const data = await response.json();
            // Guarda la información completa del usuario (incluyendo gotas_agua)
            setUserData(data.user); 
            // Cierra el mensaje de error si existía
            return { success: true }; 

        } catch (error) {
            console.error("Error de autenticación:", error.message);
            return { success: false, message: error.message };
        }
    };

    // 2. Manejo de la acción "Explorar Aguas"
    const handleExplore = () => {
        if (!userData) return;

        // Simulación: Aumenta las gotas localmente en 10
        const newGotas = userData.gotas_agua + 10;
        
        // Actualiza el estado del usuario con las nuevas gotas
        setUserData({ 
            ...userData, 
            gotas_agua: newGotas 
        });

        alert(`¡Exploraste las aguas y ganaste 10 Gotas! Gotas totales: ${newGotas}`);
    };

    // 3. Manejo de la acción "Comprar Pez" desde el Mercado (NUEVA FUNCIÓN)
    const handleBuy = (costo, nombrePez) => {
        if (!userData) return;

        const currentGotas = userData.gotas_agua;
        if (currentGotas >= costo) {
            const newGotas = currentGotas - costo;
            
            // Actualiza el estado de las gotas
            setUserData({ 
                ...userData, 
                gotas_agua: newGotas 
            });

            alert(`🎉 ¡Compraste el ${nombrePez}! Gotas restantes: ${newGotas}`);
            
            // Cierra el mercado después de la compra exitosa
            setMostrarMercado(false); 

        } else {
            alert("¡Gotas insuficientes! Inténtalo de nuevo.");
        }
    };

    // -------------------------------------------------------------
    // RENDERIZADO PRINCIPAL
    // -------------------------------------------------------------

    return (
        <div className="app-container">
            {userData ? (
                // Si hay datos de usuario, muestra el Arrecife
                <>
                    <Arrecife 
                        userData={userData}
                        onExplore={handleExplore}
                        // Función para abrir el mercado (pasada como prop a Arrecife)
                        onOpenMarket={() => setMostrarMercado(true)} 
                    />
                    
                    {/* Renderizado Condicional del Mercado */}
                    {mostrarMercado && (
                        <Mercado 
                            userData={userData} 
                            onBuy={handleBuy} // Función de compra
                            onClose={() => setMostrarMercado(false)} // Función para cerrar
                        />
                    )}
                </>
            ) : (
                // Si no hay datos de usuario, muestra el Login
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;