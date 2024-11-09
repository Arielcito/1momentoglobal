"use client"
import { createViewerToken } from "@/actions/token";
import { useEffect, useState } from "react";
import { type JwtPayload, jwtDecode } from "jwt-decode";

export const useViewerToken = (hostIdentity: string) => {
    const [token, setToken] = useState<string | null>("");
    const [name, setName] = useState<string | null>("");
    const [identity, setIdentity] = useState<string | null>("");

    useEffect(() => {
        const createToken = async () => {
            try{

                const viewerToken = await createViewerToken(hostIdentity);
                
                setToken(viewerToken);
    
                const decodedToken = jwtDecode(viewerToken) as JwtPayload & {name?:string};
                const name = decodedToken.name;
                const identity = decodedToken.jti;
    
                if(name) setName(name);
                if(identity) setIdentity(identity);
            } catch (error) {
                console.error("[CREATE_VIEWER_TOKEN]", error);
            }
        }

        createToken();
    }, [hostIdentity]);

    return { token, name, identity };
}


