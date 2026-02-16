import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom"

interface HeaderProps {
  user?: {
    name: string
    email: string
    image?: string
  }
  onLogout?: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span className="text-xl font-bold text-white">Spotify App</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              <Link to="/search">Search</Link>
            </Button>
            <Button variant="ghost" asChild className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              <Link to="/compare">Comparer</Link>
            </Button>

            {/* Plus dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Plus
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-zinc-800 border-zinc-700" align="start">
                <DropdownMenuLabel className="text-zinc-500 text-xs uppercase tracking-wider">Analyse</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/time-machine")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    Time Machine
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/mainstream")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    How Mainstream?
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wrapped")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    Wrapped
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuLabel className="text-zinc-500 text-xs uppercase tracking-wider">Fun</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/tierlist")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    Tier List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/leaderboard")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    Classement
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/map")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    Carte du monde
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuLabel className="text-zinc-500 text-xs uppercase tracking-wider">Social</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/reviews")} className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer">
                    Avis & Notes
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.image} alt={user?.name || "User"} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium text-white">{user?.name || "Guest"}</p>
              <p className="text-xs text-zinc-400">
                {user?.email || "Not logged in"}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:bg-zinc-700 focus:bg-zinc-700">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
