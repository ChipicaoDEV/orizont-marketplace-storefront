import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-4xl font-bold uppercase tracking-tighter text-gray-900 mb-2">
        Bine ai revenit
      </h1>
      <p className="text-center text-gray-500 font-medium mb-8">
        Autentifică-te pentru o experiență de cumpărături optimizată.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="E-mail"
            name="email"
            type="email"
            title="Introdu o adresă de e-mail validă."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Parolă"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-8 bg-black text-white hover:bg-gray-800 transition-colors h-12 rounded-2xl font-bold uppercase tracking-widest text-xs">
          Autentificare
        </SubmitButton>
      </form>
      <span className="text-center text-gray-500 text-sm font-medium mt-8">
        Nu ești membru?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-gray-900 font-bold underline underline-offset-4 hover:text-black transition-colors"
          data-testid="register-button"
        >
          Alătură-te nouă
        </button>
        .
      </span>
    </div>
  )
}

export default Login
