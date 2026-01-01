import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <SignIn 
        path="/login"
        routing="path"
        appearance={{
        elements: {
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "shadow-none border border-border bg-card",
          headerTitle: "text-card-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-background border border-input hover:bg-accent hover:text-accent-foreground",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-background border-input",
          footerActionText: "text-muted-foreground",
          footerActionLink: "text-primary hover:text-primary/90"
        }
      }} />
    </div>
  )
}
