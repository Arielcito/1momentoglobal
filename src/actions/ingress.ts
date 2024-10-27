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

const roomService = new RoomServiceClient(process.env.LIVEKIT_API_URL!, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!)

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export async function createIngress(ingressType: IngressInput) {
    const self = await getSelf()

    if (!self?.id) {
        throw new Error("Unauthorized")
    }

    const options: CreateIngressOptions = {
        name: self.name ?? "",
        roomName: self.id,
        participantName: self.name ?? "",
        participantIdentity: self.id,
    }
    
    if (ingressType === IngressInput.WHIP_INPUT) {
        options.enableTranscoding = true
    } else {
        const videoOptions = new IngressVideoOptions({
            name: "camera",
            source: TrackSource.CAMERA,
        })
        videoOptions.encodingOptions = {
            case: "preset",
            value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS
        }
        options.video = videoOptions

        const audioOptions = new IngressAudioOptions({
            name: "microphone",
            source: TrackSource.MICROPHONE,
        })
        audioOptions.encodingOptions = {
            case: "preset",
            value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
        }
        options.audio = audioOptions
    }

    const ingress = await ingressClient.createIngress(ingressType, options)

    if(!ingress || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress")
    }

    await prisma.stream.update({
        where: {
            userId: self.id
        },
        data: {
            ingressId: ingress.ingressId,
            serverUrl: ingress.url,
            streamKey: ingress.streamKey
        }
    })
    
    revalidatePath("/user/keys");

    return ingress
}
