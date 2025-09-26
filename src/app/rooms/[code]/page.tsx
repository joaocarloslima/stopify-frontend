import { getPlayerAtRoom } from "@/app/actions";
import PlayerList from "./player-list";

export default async function Home({ params }: { params:Promise<{ code: string }> } ) {
  const { code } = await params;
  const players: Player[] = await getPlayerAtRoom(code);

  return <PlayerList code={code} initialPlayers={players} />
  
}
