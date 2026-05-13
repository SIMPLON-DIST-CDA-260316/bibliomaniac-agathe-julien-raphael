import { type ChangeEvent, type SyntheticEvent, useState } from 'react'
import { Link } from 'react-router'
import FormLayout from '@/shared/ui/FormLayout'
import TextInput from '@/shared/ui/TextInput'
import PasswordInput from '@/shared/ui/PasswordInput'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Add validation and registration logic
  }

  return (
    <FormLayout
      title="Créer un compte"
      subtitle="Rejoignez la communauté de lecteurs"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="johndoe123"
          label="Nom d'utilisateur"
        />

        <TextInput
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="vous@exemple.com"
          label="Adresse e-mail"
        />

        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          label="Mot de passe"
        />

        <PasswordInput
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          label="Confirmer le mot de passe"
        />

        <button
          type="submit"
          className="bg-primary text-background hover:bg-primary/90 active:bg-primary/80 mt-2 w-full rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors md:py-3 md:text-base"
        >
          Créer mon compte
        </button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-xs md:text-sm">
        Déjà un compte ?{' '}
        <Link
          to="/login"
          className="text-primary font-semibold underline underline-offset-2"
        >
          Se connecter
        </Link>
      </p>
    </FormLayout>
  )
}
