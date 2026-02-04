import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Background from "./ColorBends.tsx";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

interface Album {
    id: string;
    name: string;
    release_date: string;
    images: { url: string }[];
    external_urls: { spotify: string };
}

function Search() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        const authParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                "grant_type=client_credentials&client_id=" +
                clientId +
                "&client_secret=" +
                clientSecret,
        };

        fetch("https://accounts.spotify.com/api/token", authParams)
            .then((result) => result.json())
            .then((data) => {
                setAccessToken(data.access_token);
            });
    }, []);

    async function search() {
        const artistParams = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
        };

        // Get Artist
        const artistID = await fetch(
            "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
            artistParams
        )
            .then((result) => result.json())
            .then((data) => {
                return data.artists.items[0].id;
            });

        // Get Artist Albums
        await fetch(
            "https://api.spotify.com/v1/artists/" +
            artistID +
            "/albums?include_groups=album&market=US&limit=50",
            artistParams
        )
            .then((result) => result.json())
            .then((data) => {
                setAlbums(data.items);
            });
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <Background
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
            />

            <div className="relative z-10 p-8">
                {/* Navigation */}
                <nav className="flex justify-between items-center mb-8">
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Dashboard
                    </Link>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-white mb-4">API SPOTIFY</h1>
                    <p className="text-xl text-gray-300">Recherchez vos artistes préférés</p>
                </div>

                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search For Artist"
                            aria-label="Search for an Artist"
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    search();
                                }
                            }}
                            onChange={(event) => setSearchInput(event.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={search}
                            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                            Search
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className="bg-black rounded-lg overflow-hidden border border-white/10 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                                <img
                                    src={album.images[0]?.url}
                                    alt={album.name}
                                    className="w-full aspect-square object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                                        {album.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Release Date: <br />
                                        <span className="text-white">{album.release_date}</span>
                                    </p>
                                    <a
                                        href={album.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                    >
                                        Album Link
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
