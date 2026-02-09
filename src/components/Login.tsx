import Orb from "./Orb"

function generateCodeVerifier(length: number): string {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function Login() {
    const handleSpotifyLogin = async () => {
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_REDIRECT_URI;
        const scopes = "user-read-private user-read-email user-top-read user-read-recently-played";

        const codeVerifier = generateCodeVerifier(64);
        localStorage.setItem("code_verifier", codeVerifier);

        const codeChallenge = await generateCodeChallenge(codeVerifier);

        const params = new URLSearchParams({
            client_id: clientId,
            response_type: "code",
            redirect_uri: redirectUri,
            scope: scopes,
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
            {/* Orb Background */}
            <div className="absolute inset-0 z-0">
                <Orb hue={120} hoverIntensity={0} rotateOnHover={true} backgroundColor="#000000" />
            </div>

            {/* Content */}
            <div className="w-full max-w-md text-center relative z-10">
                {/* Logo Spotify */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
                        <svg className="w-12 h-12 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Spotify Stats</h1>
                    <p className="text-gray-400">Decouvrez vos statistiques d'ecoute</p>
                </div>

                {/* Bouton Spotify */}
                <button
                    onClick={() => handleSpotifyLogin()}
                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Se connecter avec Spotify
                </button>

                <p className="text-gray-500 text-sm mt-6">
                    En continuant, vous acceptez les conditions d'utilisation de Spotify
                </p>
            </div>
        </div>
    );
}

export default Login;
