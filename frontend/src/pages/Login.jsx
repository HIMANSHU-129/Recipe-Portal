import { useState } from 'react';
import axios from 'axios';
import { Phone, Lock, Send, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, { phone });
      alert(res.data.message); // For workshop, alert tells user to check console
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      window.location.href = '/'; // hard reload to update App state
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container card glassmorphism">
      <h2>Welcome Back 👋</h2>
      <p className="subtitle">Login with Minimoth OTP to share recipes</p>
      
      {error && <div className="error-message">{error}</div>}

      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <div className="input-group">
            <Phone className="input-icon" size={20} />
            <input 
              type="tel" 
              placeholder="Enter Phone Number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Sending...' : <><Send size={18} /> Send OTP</>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Enter 4-digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Verifying...' : <><CheckCircle size={18} /> Verify OTP</>}
          </button>
          <button type="button" className="text-btn" onClick={() => setStep(1)}>
            Change Phone Number
          </button>
        </form>
      )}
    </div>
  );
}
