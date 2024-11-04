"use server"

import { getSelf } from "@/lib/auth"
import { AccessToken } from "livekit-server-sdk";
import { userService } from "@/lib/user-service";

export const createViewerToken = async (hostIdentity: string) => {
    let self = await getSelf();

    const host = await userService.getUserById(hostIdentity);

    if(!host) throw new Error("User not found") 

    const isHost = host.id === self?.id;

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: isHost ? `host-${self?.id}` : self?.id,
            name: self?.username ,
        }
    );

    token.addGrant({
        room: host.id,
        roomJoin: true,
        canPublish: false,
        canPublishData: true,
        canSubscribe: true,
    });

    return await Promise.resolve(token.toJwt());
};

export const createHostToken = async (hostIdentity: string) => {
    const self = await getSelf();

    if (!self) {
        throw new Error("Unauthorized");
    }

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: self.id,
            name: self.username,
        }
    );

    token.addGrant({
        room: hostIdentity,
        roomJoin: true,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
    });

    return await Promise.resolve(token.toJwt());
};