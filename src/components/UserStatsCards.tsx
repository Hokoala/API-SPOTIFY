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
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
                <div className="flex items-center gap-4">
                    {user.images?.[0]?.url ? (
                        <img
                            src={user.images[0].url}
                            alt={user.display_name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-black">{user.display_name?.[0]}</span>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-black">{user.display_name}</h2>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Followers Card */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
                <p className="text-gray-500 text-sm mb-1">Followers</p>
                <p className="text-3xl font-bold text-black">{user.followers?.total || 0}</p>
            </div>

            {/* Subscription Card */}
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-lg">
                <p className="text-gray-500 text-sm mb-1">Abonnement</p>
                <p className="text-3xl font-bold capitalize text-black">{user.product || "Free"}</p>
                <p className="text-gray-500 text-sm">{user.country}</p>
            </div>
        </div>
    );
}
