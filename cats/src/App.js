import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('all');
    const [cats, setCats] = useState([]);
    const [favoriteCats, setFavoriteCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const headers = new Headers({
            "Content-Type": "application/json",
            "x-api-key": "live_6DxmkjIvGIKZwdDgNRRkzlO6ZZQLhfRfWiGwlWqIt0rhHNWWrTXZtzaguLLzvgV7"
        });

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        const fetchCats = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=10", requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setCats(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCats();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleFavoriteClick = (cat) => {
        const isFavorite = favoriteCats.some((favCat) => favCat.id === cat.id);
        if (isFavorite) {
            setFavoriteCats(favoriteCats.filter(favCat => favCat.id !== cat.id));
        } else {
            setFavoriteCats([...favoriteCats, cat]);
        }
    };


    return (
        <div className="app-container">
            <div className="tabs">
                <button
                    className={activeTab === 'all' ? 'active' : ''}
                    onClick={() => handleTabClick('all')}
                >
                    Все котики
                </button>
                <button
                    className={activeTab === 'favorites' ? 'active' : ''}
                    onClick={() => handleTabClick('favorites')}
                >
                    Любимые котики
                </button>
            </div>

            <div className="content">
                {loading && <p>Загрузка...</p>}
                {error && <p>Ошибка: {error}</p>}
                {!loading && !error && (
                    <>
                        {activeTab === 'all' && (
                            <AllCatsContent cats={cats} favoriteCats={favoriteCats} handleFavoriteClick={handleFavoriteClick} />
                        )}
                        {activeTab === 'favorites' && (
                            <FavoriteCatsContent favoriteCats={favoriteCats} handleFavoriteClick={handleFavoriteClick} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function CatItem({ cat, favoriteCats, handleFavoriteClick }) {
    const isFavorite = favoriteCats.some((favCat) => favCat.id === cat.id);
    return (
        <div className="cat-item">
            <img src={cat.url} alt="Cat" />
            <button onClick={() => handleFavoriteClick(cat)} >
                {isFavorite ? 'Удалить из любимых' : 'Добавить в любимые'}
            </button>
        </div>
    );
}

function AllCatsContent({ cats, favoriteCats, handleFavoriteClick }) {
    return (
        <div>
            <h2>Все котики</h2>
            <div className="cat-list">
                {cats.map((cat) => (
                    <CatItem key={cat.id} cat={cat} favoriteCats={favoriteCats} handleFavoriteClick={handleFavoriteClick} />
                ))}
            </div>
        </div>
    );
}

function FavoriteCatsContent({ favoriteCats, handleFavoriteClick }) {
    return (
        <div>
            <h2>Любимые котики</h2>
            <div className="cat-list">
                {favoriteCats.length === 0 ? (
                    <p>У вас нет любимых котиков</p>
                ) : (
                    favoriteCats.map(cat => (
                        <CatItem key={cat.id} cat={cat} favoriteCats={favoriteCats} handleFavoriteClick={handleFavoriteClick} />
                    ))
                )}
            </div>
        </div>
    );
}


export default App;