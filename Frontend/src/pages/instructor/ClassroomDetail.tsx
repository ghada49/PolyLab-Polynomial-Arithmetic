import React from "react";
import { useParams } from "react-router-dom";
import NavBarUser from "@/components/ui/NavBarUser";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/ui/CopyButton";
import { mockStore, Member } from "@/store/mockInstructor";
import { cn } from "@/lib/cn";
import { Shield, Trash2, UserPlus } from "lucide-react";
import bgCircuit from "@/assets/background.png"; // your background image

export default function ClassroomDetail() {
  const { classId } = useParams();
  const classroom = mockStore.getClassroom(classId!);

  const [members, setMembers] = React.useState<Member[]>([]);
  const [invite, setInvite] = React.useState("");

  React.useEffect(()=>{
    if (classId) setMembers(mockStore.listMembers(classId));
  }, [classId]);

  if (!classroom) {
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
          <main className="mx-auto max-w-3xl px-4 py-10">
            <div className="rounded-xl border border-rose-700/40 bg-rose-900/20 p-6">Classroom not found.</div>
          </main>
        </div>
      </div>
    );
  }

  function sendInvite() {
    if (!invite.trim() || !classId) return;
    mockStore.inviteMember(classId, invite.trim());
    setInvite("");
    setMembers(mockStore.listMembers(classId));
  }

  function promote(id: string) {
    if (!classId) return;
    mockStore.promoteToTA(classId, id);
    setMembers(mockStore.listMembers(classId));
  }

  function remove(id: string) {
    if (!classId) return;
    mockStore.removeMember(classId, id);
    setMembers(mockStore.listMembers(classId));
  }

  function regenCode() {
    mockStore.regenerateJoinCode(classroom.id);
    // force re-render
    (window as any).__force = Date.now();
  }

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
            title={classroom.name}
            subtitle={`Join code: ${classroom.joinCode}`}
            right={<CopyButton text={classroom.joinCode} />}
          />

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-slate-800/60">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="assignments" disabled>Assignments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Members */}
          <TabsContent value="members" className="mt-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm text-slate-400 mb-1">
                    {members.length} members • {members.filter(m=>m.status==="Pending").length} pending invites
                  </div>
                  <div className="flex gap-2">
                    <Input value={invite} onChange={e=>setInvite(e.target.value)} placeholder="student@email"
                           className="w-72 bg-slate-900/60 border-slate-700" />
                    <Button onClick={sendInvite} className="gap-2 bg-cyan-500 text-slate-900 hover:bg-cyan-400">
                      <UserPlus className="h-4 w-4" /> Send Invite
                    </Button>
                    <CopyButton text={classroom.joinCode} />
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-300">
                      <th scope="col" className="py-2 pr-4">Name</th>
                      <th scope="col" className="py-2 pr-4">Email</th>
                      <th scope="col" className="py-2 pr-4">Role</th>
                      <th scope="col" className="py-2 pr-4">Joined</th>
                      <th scope="col" className="py-2 pr-4">Status</th>
                      <th scope="col" className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length===0 && (
                      <tr><td colSpan={6} className="py-6 text-slate-400">No members yet. Share the join code or send invites.</td></tr>
                    )}
                    {members.map(m=>(
                      <tr key={m.id} className="border-t border-slate-800/80">
                        <td className="py-2 pr-4">{m.name || "-"}</td>
                        <td className="py-2 pr-4">{m.email}</td>
                        <td className="py-2 pr-4">
                          <RoleBadge role={m.role}/>
                        </td>
                        <td className="py-2 pr-4">{new Date(m.joinedAt).toLocaleDateString()}</td>
                        <td className="py-2 pr-4">
                          <StatusBadge status={m.status}/>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={()=>promote(m.id)} className="border-slate-700 text-slate-200">
                              <Shield className="h-4 w-4 mr-1" /> Promote to TA
                            </Button>
                            <Button size="sm" variant="outline" onClick={()=>remove(m.id)} className="border-slate-700 text-rose-300 hover:bg-rose-900/20">
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="mt-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="text-slate-300">Classroom Settings (mock)</div>
              <div className="flex items-center gap-3">
                <div>Join Code: <span className="font-mono">{classroom.joinCode}</span></div>
                <CopyButton text={classroom.joinCode}/>
                <Button variant="outline" onClick={regenCode} className="border-slate-700 text-slate-200">Regenerate</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: Member["role"] }) {
  const map = {
    Student: "bg-slate-800/70 text-slate-200 border-slate-700",
    TA: "bg-indigo-900/40 text-indigo-200 border-indigo-700/50",
    Instructor: "bg-cyan-900/40 text-cyan-200 border-cyan-700/50",
  };
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs", map[role])}>{role}</span>;
}
function StatusBadge({ status }: { status: Member["status"] }) {
  const map = {
    Active: "bg-emerald-900/30 text-emerald-200 border-emerald-700/40",
    Pending: "bg-amber-900/30 text-amber-200 border-amber-700/40",
    Removed: "bg-rose-900/30 text-rose-200 border-rose-700/40",
  };
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs", map[status])}>{status}</span>;
}
