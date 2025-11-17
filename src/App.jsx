import React, { useState } from 'react';
import Arrecife from './components/Arrecife';
import Login from './components/Login';
import './App.css'; 

// URL CRÍTICA: La conexión al Backend que debe estar corriendo en otra terminal
const API_BASE_URL = 'http://localhost:3000'; 

function App() {
    // 1. Estados iniciales (isLoggedIn es FALSE por defecto)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false); 

    // --- FUNCIÓN PARA CARGAR DATOS DEL ARRECIFE ---
    const fetchUserData = async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/arrecife/${userId}`);
            const result = await response.json();
            if (result.success) {
                setUserData(result.data);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("Error al conectar con la API del Backend. ¿Está corriendo en http://localhost:3000?");
        } finally {
            setLoading(false);
        }
    };

    // --- MANEJO DEL LOGIN (POST) ---
    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            const result = await response.json();
            if (result.success) {
                fetchUserData(result.user_id);
            } else {
                alert('Error de login. Usa "demo" / "demo".');
            }
        } catch (error) {
             console.error("Error de conexión:", error);
             alert("No se pudo conectar con el servidor de login. Verifica el Backend.");
        }
    };

    // --- SIMULACIÓN DE INTERACCIÓN CRÍTICA (Gana Gotas) ---
    const handleExplore = () => {
        if (userData) {
            setUserData(prevData => ({
                ...prevData,
                gotas_agua: prevData.gotas_agua + 10,
            }));
        }
    };

    // 2. Lógica de renderizado
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />; // Muestra el Login por defecto
    }
    
    return (
        <div className="App">
            <Arrecife userData={userData} onExplore={handleExplore} /> // Muestra el Arrecife
        </div>
    );
}

export default App;