import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    // Credenciales de prueba
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState('demo');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="login-container">
            <h2>Bienvenido a DeepBlue Connect</h2>
            <p>Usa **demo** / **demo** para entrar al prototipo.</p>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;