import { StreamComponent } from "@/components/StreamComponent/index";

export default function StreamPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4">
      <StreamComponent streamId={params.id} />
    </div>
  )
}
