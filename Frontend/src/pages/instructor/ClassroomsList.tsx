import React from "react";
import NavBarUser from "@/components/ui/NavBarUser";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStore } from "@/store/mockInstructor";
import CopyButton from "@/components/ui/CopyButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, Plus, Users } from "lucide-react";
import bgCircuit from "@/assets/background.png"; // your background image

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(()=>new URLSearchParams(search), [search]);
}

export default function ClassroomsList() {
  const nav = useNavigate();
  const q = useQuery();
  const [showCreate, setShowCreate] = React.useState(q.get("create")==="1");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<"recent"|"name">("recent");

  let classes = mockStore.listClassrooms();
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    classes = classes.filter(c => c.name.toLowerCase().includes(s) || (c.code||"").toLowerCase().includes(s));
  }
  if (sort==="name") classes = classes.sort((a,b)=>a.name.localeCompare(b.name));

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${bgCircuit})` }}
      />
      {/* dark overlay */}
      <div className="absolute inset-0 bg-slate-950/75 pointer-events-none" />
      <div className="relative z-10">
        <NavBarUser onLogout={() => console.log("logout")} />
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader
          title="My Classrooms"
          right={
            <div className="flex gap-2">
              <Input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} className="w-48 bg-slate-900/60 border-slate-700" />
              <select value={sort} onChange={e=>setSort(e.target.value as any)} className="h-10 rounded-md bg-slate-900/60 border border-slate-700 px-3 text-sm">
                <option value="recent">Recent</option>
                <option value="name">Name A–Z</option>
              </select>
              <Button onClick={()=>setShowCreate(true)} className="bg-cyan-500 text-slate-900 hover:bg-cyan-400">
                <Plus className="h-4 w-4 mr-1" /> Create Classroom
              </Button>
            </div>
          }
        />

        {classes.length===0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <div className="text-slate-300 mb-3">You don’t have any classrooms yet.</div>
            <Button onClick={()=>setShowCreate(true)} className="bg-cyan-500 text-slate-900 hover:bg-cyan-400">
              <Plus className="h-4 w-4 mr-1" /> Create your first classroom
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classes.map(c => (
              <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.code || "No code"} • {new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Users className="h-3.5 w-3.5" /> {c.membersCount}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="text-slate-400">Join: <span className="font-mono">{c.joinCode}</span></div>
                  <CopyButton text={c.joinCode}/>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/instructor/classrooms/${c.id}`}>
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-200">
                      <ExternalLink className="h-4 w-4 mr-1" /> Open
                    </Button>
                  </Link>
                  <Button size="sm" disabled variant="outline" className="border-slate-700 text-slate-400">More</Button>
                </div>
              </div>
            ))}
          </div>
        )}

          {showCreate && <CreateModal onClose={()=>{ setShowCreate(false); nav("/instructor/classrooms"); }} />}
        </main>
      </div>
    </div>
  );
}

function CreateModal({ onClose }: { onClose: ()=>void }) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [joinModel, setJoinModel] = React.useState<"code"|"invite">("code");

  function create() {
    if (!name.trim()) return;
    const c = mockStore.createClassroom({ name: name.trim(), code: code.trim() || undefined, description: desc.trim() || undefined, joinModel });
    onClose();
    // redirect happens in parent route if you want; here we just close
    window.location.assign(`/instructor/classrooms/${c.id}`);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="text-lg font-semibold mb-4">Create Classroom</div>

        <label className="text-sm text-slate-300">Classroom Name</label>
        <Input value={name} onChange={e=>setName(e.target.value)} className="mt-1 mb-3 bg-slate-900/60 border-slate-700" />

        <label className="text-sm text-slate-300">Course Code (optional)</label>
        <Input value={code} onChange={e=>setCode(e.target.value)} className="mt-1 mb-3 bg-slate-900/60 border-slate-700" />

        <label className="text-sm text-slate-300">Description (optional)</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3}
          className="mt-1 mb-3 w-full rounded-md bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm" />

        <div className="mb-4">
          <div className="text-sm text-slate-300 mb-1">Join Model</div>
          <div className="flex gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={joinModel==="code"} onChange={()=>setJoinModel("code")} />
              <span>Join by Code</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={joinModel==="invite"} onChange={()=>setJoinModel("invite")} />
              <span>Invite Only</span>
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-200">Cancel</Button>
          <Button onClick={create} className="bg-cyan-500 text-slate-900 hover:bg-cyan-400">Create</Button>
        </div>
      </div>
    </div>
  );
}
