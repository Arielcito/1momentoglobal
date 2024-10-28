import { GenerateKeysDialog } from "@/components/GenerateKeysDialog";
import Urlcard from "@/components/Card/Urlcard";
import Streamcard from "@/components/Card/Streamcard";

export default function KeysPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Keys & URLs</h1>
        <GenerateKeysDialog />
      </div>
      <Urlcard userId={""}/>
      <Streamcard userId={""}/>
    </div>
  )
}
