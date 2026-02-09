import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Hello World Web</h1>
            <Badge variant="secondary">v1.0.1</Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-10">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
            <p className="text-muted-foreground">
              A demo React 19 + Vite + TailwindCSS v4 application with shadcn/ui components.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>

          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>shadcn/ui Card</CardTitle>
              <CardDescription>
                This card uses shadcn/ui components with Tailwind CSS v4.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Components include: Button, Card, Badge, and more. All styled with Tailwind CSS v4
                and fully support dark/light mode.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default App;
