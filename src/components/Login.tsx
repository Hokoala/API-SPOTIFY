import { useState } from "react";

interface LoginProps {
    onLogin: (isLoggedIn: boolean) => void;
}

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulation d'authentification - à remplacer par votre logique
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (email && password) {
                onLogin(true);
            } else {
                setError("Veuillez remplir tous les champs");
            }
        } catch {
            setError("Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpotifyLogin = () => {
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI);
        const scopes = encodeURIComponent("user-read-private user-read-email");

        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md">
                {/* Logo / Titre */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                        <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
                    <p className="text-gray-400">Connectez-vous pour continuer</p>
                </div>

                {/* Formulaire */}
                <div className="bg-zinc-900 rounded-lg p-8 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email ou nom d'utilisateur
                            </label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email ou nom d'utilisateur"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Connexion...
                                </span>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-4 text-gray-500 text-sm">OU</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    {/* Spotify OAuth button */}
                    <button
                        onClick={handleSpotifyLogin}
                        className="w-full py-3 bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Continuer avec Spotify
                    </button>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-2">
                        <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                            Mot de passe oublié ?
                        </a>
                        <p className="text-gray-400 text-sm">
                            Pas encore de compte ?{" "}
                            <a href="#" className="text-white underline hover:text-green-500 transition-colors">
                                S'inscrire
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
