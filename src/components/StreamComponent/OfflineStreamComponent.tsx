import { Loader2 } from "lucide-react";
import Image from "next/image";

interface OfflineStreamComponentProps {
  username?: string;
  thumbnailUrl?: string;
}

const OfflineStreamComponent = ({
  username,
  thumbnailUrl,
}: OfflineStreamComponentProps) => {
  return (
    <div className="relative aspect-video border-b group bg-neutral-950 flex flex-col items-center justify-center">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt="Stream offline"
          fill
          className="object-cover opacity-50"
        />
      ) : (
        <div className="h-full w-full bg-neutral-800 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
        </div>
      )}
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-2xl font-bold text-white">
          {username ? `${username} está` : "Stream"} offline
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Vuelve más tarde para ver el stream en vivo
        </p>
      </div>
    </div>
  );
};

export default OfflineStreamComponent; 