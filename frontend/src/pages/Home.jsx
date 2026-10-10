import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, ChefHat } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API_URL}/recipes`);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Discover Recipes</h2>
        <Link to="/create" className="primary-btn sm-btn">
          <PlusCircle size={18} /> New Recipe
        </Link>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state card glassmorphism">
          <ChefHat size={48} />
          <h3>No recipes yet</h3>
          <p>Be the first to share your culinary masterpiece!</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card card glassmorphism">
              {recipe.image_url && (
                <div className="recipe-image-container">
                  <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
                </div>
              )}
              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <div className="recipe-meta">
                  <span className="author">By: {recipe.author_phone || 'Anonymous'}</span>
                </div>
                
                <button 
                  className="text-btn expand-btn"
                  onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
                >
                  {expandedId === recipe.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedId === recipe.id && (
                  <div className="recipe-details">
                    <div className="detail-section">
                      <h4>Ingredients</h4>
                      <p>{recipe.ingredients}</p>
                    </div>
                    <div className="detail-section">
                      <h4>Instructions</h4>
                      <p>{recipe.instructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
