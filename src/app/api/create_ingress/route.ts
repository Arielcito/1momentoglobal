import { createIngress } from "@/actions/ingress"

import { NextResponse } from "next/server"

export const POST = async () => {
    const ingress = await createIngress()
    return NextResponse.json(ingress)
}