import React, { useState } from 'react';

const authStyles = `
/* --- Auth (Marine Theme) --- */
.auth-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(60% 40% at 50% 10%, #0a6abf 0%, #003b66 60%, #001a33 100%);
  padding: 20px;
  box-sizing: border-box;
}
.auth-card {
  width: 100%;
  max-width: 520px;
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 170, 255, 0.2);
  border-radius: 16px;
  padding: 26px;
  color: #e6f7ff;
  box-shadow: 0 10px 40px rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
}
.auth-title {
  margin: 0 0 6px 0;
  font-size: 28px;
  color: #7dd3fc;
  text-shadow: 0 2px 10px rgba(125,211,252,0.2);
}
.auth-subtitle {
  margin: 0 0 18px 0;
  opacity: 0.85;
}
.auth-tabs {
  display: flex;
  gap: 8px;
  background: rgba(0, 60, 100, 0.35);
  padding: 6px;
  border-radius: 12px;
  margin-bottom: 12px;
}
.auth-tab {
  flex: 1;
  border: none;
  background: transparent;
  color: #cfefff;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}
.auth-tab.active {
  background: #ff6347;
  color: #fff;
  box-shadow: 0 6px 20px rgba(255,99,71,0.35);
}
.auth-methods {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.auth-method {
  border: 1px solid rgba(0, 170, 255, 0.4);
  background: rgba(0, 40, 70, 0.6);
  color: #bfe9ff;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
}
.auth-method.active {
  background: #0ea5e9;
  color: #fff;
  border-color: #0ea5e9;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.auth-label {
  font-size: 13px;
  color: #bfe9ff;
}
.auth-input-group {
  position: relative;
}
.auth-input {
  width: 100%;
  padding: 12px 44px 12px 12px;
  background: rgba(0, 30, 55, 0.75);
  border: 1px solid rgba(0, 170, 255, 0.35);
  color: #e6f7ff;
  border-radius: 10px;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.auth-input:focus {
  border-color: #00ccff;
  box-shadow: 0 0 0 3px rgba(0,204,255,0.25);
}
.auth-eye {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #d1eaff;
  cursor: pointer;
  font-size: 18px;
}
.auth-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
}
.auth-btn.primary {
  flex: 1;
  background: linear-gradient(90deg, #ff7a59, #ff6347);
  border: none;
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(255,99,71,0.35);
}
.auth-btn.primary:hover {
  filter: brightness(1.05);
}
.auth-link {
  background: none;
  border: none;
  color: #7dd3fc;
  cursor: pointer;
  text-decoration: underline;
}
.auth-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #9cd9ff;
  opacity: 0.9;
}
.auth-legal {
  margin-top: 6px;
  font-size: 12px;
  color: #9cd9ff;
  opacity: 0.85;
}
@media (max-width: 480px) {
  .auth-card { padding: 18px; }
}
`;

const Login = ({ onLogin, onRegister }) => {
  // Si hay código de referido en URL, ir directo a registro
  const params = new URLSearchParams(window.location.search);
  const hasRefCode = params.get('ref');
  
  const [activeTab, setActiveTab] = useState(hasRefCode ? 'register' : 'login'); // 'login' | 'register'

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Register state
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSecurityPassword, setRegSecurityPassword] = useState('');
  const [regInvite, setRegInvite] = useState(() => {
    // Capturar código de referido de la URL
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || '';
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegSecurityPassword, setShowRegSecurityPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onLogin(loginEmail, loginPassword);
    if (!result?.success) {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    
    const result = await onRegister(regNombre, regApellido, regEmail, regPassword, regSecurityPassword, regInvite);
    
    setRegLoading(false);
    
    if (result?.success) {
      alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');
      // Cambiar a la pestaña de login y prellenar el usuario
      setActiveTab('login');
      setLoginEmail(regEmail);
      // Limpiar formulario de registro (excepto código de referido si vino de URL)
      const urlRef = new URLSearchParams(window.location.search).get('ref');
      setRegNombre('');
      setRegApellido('');
      setRegEmail('');
      setRegPassword('');
      setRegSecurityPassword('');
      setRegInvite(urlRef || '');
    } else {
      alert(result?.message || 'Error al registrar. Intenta de nuevo.');
    }
  };

  return (
    <div className="auth-wrapper">
      <style>{authStyles}</style>
      <div className="auth-card">
        <h1 className="auth-title">DeepBlue Connect</h1>
        <p className="auth-subtitle">Explora. Descubre. Conecta.</p>

        <div className="auth-tabs">
          <button type="button" className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Iniciar sesión</button>
          <button type="button" className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Registro</button>
        </div>

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label className="auth-label">Correo electrónico</label>
            <input
              className="auth-input"
              type="email"
              placeholder="ejemplo@gmail.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              disabled={loading}
            />

            <label className="auth-label">Contraseña</label>
            <div className="auth-input-group">
              <input
                className="auth-input"
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Contraseña de inicio de sesión"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowLoginPassword((v) => !v)}
                aria-label="Mostrar/ocultar contraseña"
              >
                {showLoginPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="auth-actions">
              <button type="submit" className="auth-btn primary" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
              <button type="button" className="auth-link" onClick={() => alert('Función de recuperación próximamente')}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Nota de pruebas eliminada por solicitud */}
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <label className="auth-label">Nombre</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Tu nombre"
              value={regNombre}
              onChange={(e) => setRegNombre(e.target.value)}
              required
            />

            <label className="auth-label">Apellido</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Tu apellido"
              value={regApellido}
              onChange={(e) => setRegApellido(e.target.value)}
              required
            />

            <label className="auth-label">Correo electrónico</label>
            <input
              className="auth-input"
              type="email"
              placeholder="ejemplo@gmail.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <label className="auth-label">Contraseña de inicio de sesión</label>
            <div className="auth-input-group">
              <input
                className="auth-input"
                type={showRegPassword ? 'text' : 'password'}
                placeholder="Contraseña de inicio de sesión"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowRegPassword((v) => !v)}
                aria-label="Mostrar/ocultar contraseña"
              >
                {showRegPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <label className="auth-label">Repita la contraseña</label>
            <div className="auth-input-group">
              <input
                className="auth-input"
                type={showRegSecurityPassword ? 'text' : 'password'}
                placeholder="Repita la contraseña de seguridad"
                value={regSecurityPassword}
                onChange={(e) => setRegSecurityPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowRegSecurityPassword((v) => !v)}
                aria-label="Mostrar/ocultar contraseña"
              >
                {showRegSecurityPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <label className="auth-label">Código de referido (opcional)</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Código de referido"
              value={regInvite}
              onChange={(e) => setRegInvite(e.target.value)}
            />
            {regInvite && (
              <div className="auth-hint" style={{ marginTop: '4px', color: '#10b981' }}>
                ✓ Código de referido aplicado
              </div>
            )}

            <button type="submit" className="auth-btn primary" disabled={regLoading}>
              {regLoading ? 'Registrando...' : 'Crear cuenta'}
            </button>
            <div className="auth-legal">Al registrarte aceptas nuestros Términos y Política de Privacidad</div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
