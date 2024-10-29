"use server"

import { getSelf } from "@/lib/auth"
import { AccessToken } from "livekit-server-sdk";
import { v4 } from "uuid"

export const createViewerToken = async (hostIdentity: string) => {
    let self;

    try {
        self = await getSelf();
    } catch (error) {
        const id = v4();
        const username = `guest-${id.slice(0, 8)}`;
        self = {
            id,
            username
        };
    }

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: self?.id,
            name: self?.username,
        }
    );

    token.addGrant({
        room: hostIdentity,
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