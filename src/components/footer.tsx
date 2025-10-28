export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ for better diabetes care through Ayurveda. © {new Date().getFullYear()} SwasthPrameh.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}