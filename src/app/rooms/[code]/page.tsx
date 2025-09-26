import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { getPlayerAtRoom } from "@/app/actions";

export default async function Home({ params }: { params: { code: string } }) {
  const { code } = params;
  const players: Player[] = await getPlayerAtRoom(code);

  function getInitials(name: string) {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials;
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-purple-950 p-4 text-white">
      <h1 className="text-4xl font-bold mb-8">Stopify</h1>

      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Sala: {code}
      </h2>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Pessoas Presentes</CardTitle>
          <CardDescription>Quando todos ingressarem, clique em "Iniciar Partida"</CardDescription>
        </CardHeader>
        <CardContent>
          {
            players.map((player) => (
              <div className="flex items-center mb-4" key={player.id}>
                <Avatar>
                  <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                </Avatar>
                <p className="ml-4 inline-block align-middle">{player.name}</p>
              </div>
            ))}
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button asChild variant={"secondary"}>
            <a href="/">Sair da Sala</a>
          </Button>
          <Button>Iniciar Partida</Button>
        </CardFooter>
      </Card>

    </main>
  );
}
