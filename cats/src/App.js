import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('all');
    const [cats, setCats] = useState([]);
    const [favoriteCats, setFavoriteCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const catApiDomainV1 = "https://api.thecatapi.com/v1";
    const catApiRandom = "/images/search?size=small&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=10";
    const catApiFavorites = `${catApiDomainV1}/favourites`;
    const catApiXApiKey = "live_6DxmkjIvGIKZwdDgNRRkzlO6ZZQLhfRfWiGwlWqIt0rhHNWWrTXZtzaguLLzvgV7";
    const catApiUserId = "vk.com/id41864819";

    const createHeaders = () => {
        return new Headers({
            "Content-Type": "application/json",
            "x-api-key": catApiXApiKey,
        });
    };

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const headers = createHeaders();
            const requestOptions = { method: "GET", headers: headers, redirect: "follow" };
            const response = await fetch(catApiFavorites, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setFavoriteCats(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (imageId) => {
        try {
            const headers = createHeaders();
            const body = { image_id: imageId, sub_id: catApiUserId };
            const requestOptions = {
                method: "POST",
                headers: headers,
                redirect: "follow",
                body: JSON.stringify(body),
            };
            const response = await fetch(catApiFavorites, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const removeFromFavorites = async (favouriteId) => {
        try {
            const headers = createHeaders();
            const requestOptions = {
                method: "DELETE",
                headers: headers,
                redirect: "follow",
            };
            const response = await fetch(
                `${catApiFavorites}/${favouriteId}`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        const fetchCats = async () => {
            const headers = createHeaders();
            const requestOptions = {
                method: 'GET',
                headers: headers,
                redirect: 'follow',
            };
            try {
                setLoading(true);
                const response = await fetch(catApiDomainV1 + catApiRandom, requestOptions);
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

    useEffect(() => {
        if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleFavoriteClick = async (cat) => {
        const isFavorite = favoriteCats.some(favCat => favCat.image_id === cat.id);

        if (isFavorite) {
            try {
                const headers = createHeaders();
                const requestOptions = { method: "GET", headers: headers, redirect: "follow" };
                const response = await fetch(catApiFavorites, requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

                const favoriteRecord = result.find(item=>item.image_id === cat.id)

                if(favoriteRecord){
                    await removeFromFavorites(favoriteRecord.id);
                    setFavoriteCats(favoriteCats.filter((favCat) => favCat.image_id !== cat.id));

                }
            } catch (error) {
                setError(error.message);
            }
        } else {
            await addToFavorites(cat.id);
            try {
                const headers = createHeaders();
                const requestOptions = { method: "GET", headers: headers, redirect: "follow" };
                const response = await fetch(catApiFavorites, requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const favCat = result.find(item=>item.image_id === cat.id)
                setFavoriteCats([...favoriteCats, favCat]);
            } catch (error) {
                setError(error.message);
            }
        }
    };


    return (
        <div className="app-container">
            <header>
                <div className="tabs">
                    <button
                        type="button"
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => handleTabClick('all')}
                    >
                        Все котики
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'favorites' ? 'active' : ''}
                        onClick={() => handleTabClick('favorites')}
                    >
                        Любимые котики
                    </button>
                </div>
            </header>
            <main>
                {loading && <p>Загрузка...</p>}
                {error && <p>Ошибка: {error}</p>}
                {!loading && !error && (
                    <>
                        {activeTab === 'all' && (
                            <AllCatsContent
                                cats={cats}
                                favoriteCats={favoriteCats}
                                handleFavoriteClick={handleFavoriteClick}
                            />
                        )}
                        {activeTab === 'favorites' && (
                            <FavoriteCatsContent
                                favoriteCats={favoriteCats}
                                handleFavoriteClick={handleFavoriteClick}
                                loading={loading}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

function CatItem({ cat, favoriteCats, handleFavoriteClick }) {
    const isFavorite = favoriteCats.some(favCat => favCat.image_id === cat.id);

    return (
        <div className="cat-item">
            <img src={cat.url} alt="Cat" />
            <button
                type="button"
                className={isFavorite ? "favorite-y" : "favorite-n"}
                onClick={() => handleFavoriteClick(cat)}
            >
                {
                    //isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'
                }
            </button>
        </div>
    );
}

function AllCatsContent({ cats, favoriteCats, handleFavoriteClick }) {
    return (
        <div>
            <div className="cat-list">
                {cats.map((cat) => (
                    <CatItem
                        key={cat.id}
                        cat={cat}
                        favoriteCats={favoriteCats}
                        handleFavoriteClick={handleFavoriteClick}
                    />
                ))}
            </div>
        </div>
    );
}

function FavoriteCatsContent({ favoriteCats, handleFavoriteClick, loading }) {
    return (
        <div>
            <div className="cat-list">
                {favoriteCats.length === 0 ? ( <p>У вас нет любимых котиков</p>) : (
                    <>{loading && <p>Загрузка...</p>}
                        {!loading && favoriteCats.map((favCat) => (
                            <CatItem
                                key={favCat.id}
                                cat={{url:favCat.image.url, id:favCat.image_id}}
                                favoriteCats={favoriteCats}
                                handleFavoriteClick={handleFavoriteClick}
                            />
                        ))}</>
                )}
            </div>
        </div>
    );
}

export default App;