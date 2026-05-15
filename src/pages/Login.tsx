import { type ChangeEvent, type SyntheticEvent, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'
import FormLayout from '@/shared/ui/FormLayout'
import TextInput from '@/shared/ui/TextInput'
import PasswordInput from '@/shared/ui/PasswordInput'

export default function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [, setIsLoggedIn] =
    useOutletContext<[boolean, (value: boolean) => void]>()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    localStorage.setItem('username', form.username)
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    void navigate('/')
  }

  return (
    <FormLayout
      title="Bon retour !"
      subtitle="Connectez-vous pour accéder à votre bibliothèque et découvrir de nouveaux livres"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          name="username"
          type="username"
          value={form.username}
          onChange={handleChange}
          placeholder="johndoe123"
          label="Nom d'utilisateur"
        />

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="input-password"
              className="text-primary text-sm font-medium md:text-base"
            >
              Mot de passe
            </label>
            <Link
              to="#"
              className="text-secondary hover:text-primary text-xs underline underline-offset-2 transition-colors md:text-sm"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-background hover:bg-primary/90 active:bg-primary/80 mt-2 w-full rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors md:py-3 md:text-base"
        >
          Se connecter
        </button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-xs md:text-sm">
        Pas encore de compte ?{' '}
        <Link
          to="/register"
          className="text-primary font-semibold underline underline-offset-2"
        >
          S'inscrire
        </Link>
      </p>
    </FormLayout>
  )
}
