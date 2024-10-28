"use server"

import { getSelf } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { 
  type CreateIngressOptions, 
  IngressAudioEncodingPreset, 
  IngressClient, 
  IngressInput, 
  IngressVideoEncodingPreset, 
  RoomServiceClient, 
  TrackSource,
  IngressVideoOptions,
  IngressAudioOptions,
} from "livekit-server-sdk"
import { revalidatePath } from "next/cache";

const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
const ingressClient = new IngressClient(livekitHost, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!);

export async function createIngress() {
    try {
        const self = await getSelf()
        if (!self?.id) {
            throw new Error("Unauthorized")
        }

        const ingressOptions = {
            name: `stream-${self.username || self.id}`,
            roomName: self.id,
            participantIdentity: self.id,
            participantName: self.username || self.name || self.id,
          };
        console.log(ingressOptions)

        const ingress = await ingressClient.createIngress(IngressInput.RTMP_INPUT, ingressOptions);

        // Update or create stream record in database
        await prisma.stream.upsert({
            where: {
                userId: self.id
            },
            update: {
                ingressId: ingress.ingressId,
                serverUrl: ingress.url,
                streamKey: ingress.streamKey,
                isLive: false
            },
            create: {
                userId: self.id,
                ingressId: ingress.ingressId,
                serverUrl: ingress.url,
                streamKey: ingress.streamKey,
                name: `${self.username || self.id}'s stream`,
                isLive: false
            }
        })
        console.log("Ingress created successfully",ingress)
        revalidatePath("/user/keys");
        return ingress

    } catch (error) {
        console.error("Error creating ingress:", error)
        throw new Error("Failed to create ingress")
    }
}

export async function getIngressInfo(userId: string) {
    try {
        const stream = await prisma.stream.findUnique({
            where: { userId }
        })

        if (!stream?.ingressId) {
            throw new Error("Stream not found")
        }

        const ingress = await ingressClient.listIngress({
            ingressId: stream.ingressId
        })

        return ingress;

    } catch (error) {
        console.error("Error getting ingress info:", error)
        throw new Error("Failed to get ingress info")
    }
}
