import { Button } from "./components/button";
import { ThemeToggle } from "./components/theme-toggle";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-lg font-semibold">Hello World Web</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-10">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
            <p className="text-muted-foreground">
              A demo React 19 + Vite + TailwindCSS v4 application with dark/light mode support.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Card Component</h3>
            <p className="text-muted-foreground mt-2">
              This card uses the theme variables for background and foreground colors.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
