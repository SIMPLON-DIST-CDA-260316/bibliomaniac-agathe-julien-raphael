import { useNavigate, useOutletContext } from 'react-router'
import { LogOut, User } from 'lucide-react'
import FormLayout from '@/shared/ui/FormLayout'

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] =
    useOutletContext<[boolean, (value: boolean) => void]>()
  const navigate = useNavigate()

  if (!isLoggedIn) {
    return (
      <FormLayout
        title="Accès refusé"
        subtitle="Vous devez être connecté pour accéder à cette page"
      >
        <p className="text-foreground text-center">
          Veuillez vous connecter pour voir votre profil.
        </p>
      </FormLayout>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    void navigate('/login')
  }

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-md md:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <User className="text-primary h-8 w-8" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-bold md:text-3xl">
                {localStorage.getItem('username')}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Profil utilisateur
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-md md:p-8">
          <h2 className="text-foreground mb-6 text-xl font-semibold">
            Informations personnelles
          </h2>

          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-primary mb-2 block text-sm font-medium md:text-base">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nom d'utilisateur
                </div>
              </label>
              <p className="text-foreground px-4 py-2.5 text-base md:text-base">
                {localStorage.getItem('username')}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors md:py-3 md:text-base"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
