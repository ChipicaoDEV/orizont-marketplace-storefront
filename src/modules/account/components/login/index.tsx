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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Bun venit înapoi
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
        Introdu datele tale pentru a accesa contul <span className="font-semibold text-gray-900">Orizont</span>.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="Adresă E-mail"
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
        <SubmitButton data-testid="sign-in-button" className="w-full mt-8 bg-[#F27A1A] hover:bg-[#D4600E] text-white transition-all duration-200 h-12 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-sm shadow-orange-100">
          Conectare
        </SubmitButton>
      </form>
      <span className="text-center text-gray-500 text-sm font-medium mt-8">
        Nu ești membru?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-[#F27A1A] font-bold underline underline-offset-4 hover:text-[#D4600E] transition-colors"
          data-testid="register-button"
        >
          Creează un cont
        </button>
      </span>
    </div>
  )
}

export default Login
