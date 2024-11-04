"use server"

import { getSelf } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { 
  type CreateIngressOptions, 
  IngressClient, 
  IngressInput
} from "livekit-server-sdk"
import { revalidatePath } from "next/cache";

// Ensure the LiveKit URL has the correct format (should start with 'wss://' or 'https://')
const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_URL?.startsWith('wss://') || process.env.NEXT_PUBLIC_LIVEKIT_URL?.startsWith('https://')
  ? process.env.NEXT_PUBLIC_LIVEKIT_URL
  : `https://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`;

const ingressClient = new IngressClient(
  livekitHost,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function createIngress() {
    try {
        const self = await getSelf()
        if (!self?.id) {
            throw new Error("Unauthorized")
        }

        // First check if user already has a stream
        const existingStream = await prisma.stream.findUnique({
            where: { userId: self.id }
        });

        if (existingStream?.streamKey && existingStream?.serverUrl) {
            return {
                streamKey: existingStream.streamKey,
                url: existingStream.serverUrl,
                ingressId: existingStream.ingressId,
            };
        }

        const ingressOptions: CreateIngressOptions = {
            name: `stream-${self.username || self.id}`,
            roomName: self.id,
            participantIdentity: self.id,
            participantName: self.username || self.name || self.id,
        };

        const ingress = await ingressClient.createIngress(
            IngressInput.RTMP_INPUT,
            ingressOptions
        );

        if (!ingress?.streamKey || !ingress?.url) {
            throw new Error("Failed to create ingress");
        }

        const stream = await prisma.stream.create({
            data: {
                userId: self.id,
                ingressId: ingress.ingressId,
                serverUrl: ingress.url,
                streamKey: ingress.streamKey,
                name: `${self.username || self.id}'s stream`,
                isLive: false
            }
        });

        revalidatePath("/user/keys");
        return {
            stream,
            ...ingress,
            userId: self.id,
            shouldInvalidate: true
        };

    } catch (error: any) {
        console.error("Error creating ingress:", error);
        
        if (error?.message?.includes("429")) {
            throw new Error("Stream creation is rate limited. Please try again in a few minutes.");
        }
        
        if (error?.message?.includes("Unauthorized")) {
            throw new Error("You must be logged in to create a stream.");
        }

        throw new Error("Failed to create stream. Please try again later.");
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
