import { Controller, type CreateIngressParams } from "@/lib/controller";
import { validateEnvVars } from "@/lib/env-check";

export async function POST(req: Request) {
  console.log('Starting POST request to create_ingress');
  
  try {
    // Validate environment variables before proceeding
    const env = validateEnvVars();
    console.log('Environment variables validated:', {
      hasApiKey: !!env.LIVEKIT_API_KEY,
      hasApiSecret: !!env.LIVEKIT_API_SECRET,
      hasWsUrl: !!env.LIVEKIT_WS_URL,
    });

    const controller = new Controller();
    const reqBody = await req.json();
    console.log('Request body:', JSON.stringify(reqBody, null, 2));
    
    const response = await controller.createIngress(
      reqBody as CreateIngressParams
    );

    console.log('Ingress created successfully:', JSON.stringify(response, null, 2));
    return Response.json(response);
    
  } catch (err) {
    console.error('Detailed error in create_ingress:', {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? err instanceof Error ? err.stack : undefined : undefined,
    });

    if (err instanceof Error) {
      return Response.json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
      }, { 
        status: 500 
      });
    }

    return Response.json({ 
      error: 'Unknown error occurred',
      details: JSON.stringify(err)
    }, { 
      status: 500 
    });
  }
}
