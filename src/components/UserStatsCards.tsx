interface UserProfile {
    display_name: string;
    email: string;
    images: { url: string }[];
    followers: { total: number };
    country: string;
    product: string;
}

interface UserStatsCardsProps {
    user: UserProfile;
}

export function UserStatsCards({ user }: UserStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-4">
                    {user.images?.[0]?.url ? (
                        <img
                            src={user.images[0].url}
                            alt={user.display_name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-green-500">
                            <span className="text-2xl font-bold text-white">{user.display_name?.[0]}</span>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.display_name}</h2>
                        <p className="text-zinc-400 text-sm">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Followers Card */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Followers</p>
                <p className="text-3xl font-bold text-white">{user.followers?.total || 0}</p>
            </div>

            {/* Subscription Card */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Abonnement</p>
                <p className={`text-3xl font-bold capitalize ${user.product === "premium" ? "text-green-400" : "text-white"}`}>
                    {user.product || "Free"}
                </p>
                <p className="text-zinc-500 text-sm">{user.country}</p>
            </div>
        </div>
    );
}
