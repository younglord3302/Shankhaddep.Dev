import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-950 dark:to-dark-900 px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#22c55e',
            colorBackground: '#0a0a0a',
            colorText: '#ffffff',
            colorTextSecondary: '#a3a3a3',
            colorInputBackground: '#171717',
            colorInputText: '#ffffff',
            borderRadius: '0.75rem',
          },
          elements: {
            rootBox: "mx-auto",
            card: "bg-black border border-dark-800 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.1)]",
            headerTitle: "text-white font-black tracking-tight",
            headerSubtitle: "text-dark-400",
            socialButtonsBlockButton: "border-dark-800 hover:bg-dark-800 text-white",
            formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white font-bold",
            footerActionLink: "text-green-400 hover:text-green-300",
          },
        }}
      />
    </div>
  );
}
