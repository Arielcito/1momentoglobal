

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import StreamComponent from "@/components/StreamComponent";


export default async function StreamPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <StreamComponent streamId={params.id} userName={session.user?.name || ''} />
  );
}
