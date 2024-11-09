import { useViewerToken } from "@/hooks/useViewerToken";

export default function StreamPlayer({ hostIdentity }: { hostIdentity: string }) {
    const { token, name, identity } = useViewerToken(hostIdentity);
    if(!token || !name || !identity) return <div>No puedes ver el stream</div>
    
  return <div>Puedes ver el stream</div>
}
