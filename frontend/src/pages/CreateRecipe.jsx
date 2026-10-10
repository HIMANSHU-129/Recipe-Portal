import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateRecipe() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const author_id = localStorage.getItem('userId');
    
    try {
      await axios.post(`${API_URL}/recipes`, {
        title,
        ingredients,
        instructions,
        image_url: imageUrl,
        author_id
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-recipe-container card glassmorphism">
      <button className="back-btn text-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Back to Home
      </button>
      
      <h2>Create New Recipe 🍳</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label>Recipe Title</label>
          <input 
            type="text" 
            placeholder="e.g. Spicy Chicken Curry" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Cover Image URL (Optional)</label>
          <input 
            type="url" 
            placeholder="https://example.com/image.jpg" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Ingredients (comma separated or multiline)</label>
          <textarea 
            rows="4"
            placeholder="e.g. 2 cups rice, 1 chicken breast..." 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <textarea 
            rows="6"
            placeholder="Step by step instructions..." 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="primary-btn full-width" disabled={loading}>
          {loading ? 'Saving...' : <><Save size={18} /> Publish Recipe</>}
        </button>
      </form>
    </div>
  );
}
