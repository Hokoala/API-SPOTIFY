import { countryFlag } from "./worldMapPaths"

interface CountryTooltipProps {
    code: string
    name: string
    artists: string[]
    x: number
    y: number
}

export function CountryTooltip({ code, name, artists, x, y }: CountryTooltipProps) {
    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{ left: x + 16, top: y - 16 }}
        >
            <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl px-4 py-3 shadow-2xl shadow-black/50 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{countryFlag(code)}</span>
                    <p className="text-white font-bold text-sm">{name}</p>
                    <span className="ml-auto text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
                        {artists.length}
                    </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {artists.slice(0, 6).map((a) => (
                        <span
                            key={a}
                            className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md"
                        >
                            {a}
                        </span>
                    ))}
                    {artists.length > 6 && (
                        <span className="text-xs px-2 py-0.5 text-zinc-500">
                            +{artists.length - 6}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
