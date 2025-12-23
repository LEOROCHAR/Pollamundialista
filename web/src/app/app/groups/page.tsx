import { GroupsClient } from "@/app/app/groups/groups-client";

export default function GroupsPage() {
  return (
    <div>
      <div>
        <div className="text-sm font-semibold text-emerald-200/90">Grupos</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Tu liga, tu gente.</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Crea grupos con código o únete a uno existente. Las tablas se calculan con los puntos de
          cada miembro.
        </p>
      </div>

      <div className="mt-6">
        <GroupsClient />
      </div>
    </div>
  );
}

