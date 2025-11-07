import React from "react";
import NavBarUser from "@/components/ui/NavBarUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import CopyButton from "@/components/ui/CopyButton";
import { mockStore } from "@/store/mockInstructor";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, ExternalLink } from "lucide-react";
import bgCircuit from "@/assets/background.png"; // your background image

export default function InstructorDashboard() {
  const nav = useNavigate();
  const top = mockStore.listClassrooms().slice(0,3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
              {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgCircuit})` }}
      />
      {/* dark overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

        <NavBarUser onLogout={() => console.log("logout")} />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader
          title="Instructor Dashboard"
          subtitle="Quick overview and actions"
          right={
            <div className="flex gap-2">
              <Link to="/instructor/classrooms">
                <Button variant="outline" className="border-slate-700 text-slate-200">View All Classrooms</Button>
              </Link>
              <Button onClick={() => nav("/instructor/classrooms?create=1")} className="bg-cyan-500 text-slate-900 hover:bg-cyan-400">
                <Plus className="h-4 w-4 mr-1" /> Create Classroom
              </Button>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: My Classrooms */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-6">
            <h2 className="text-xl font-semibold mb-1">My Classrooms</h2>
            <p className="text-slate-400 mb-4">You have {mockStore.listClassrooms().length} classrooms</p>

            {top.length === 0 ? (
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
                <p className="text-slate-300">You don’t have any classrooms yet.</p>
                <Button onClick={() => nav("/instructor/classrooms?create=1")} className="mt-3 bg-cyan-500 text-slate-900 hover:bg-cyan-400">
                  <Plus className="h-4 w-4 mr-1" /> Create your first classroom
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {top.map(c => (
                  <div key={c.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.code || "No code"} • Created {new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Users className="h-3.5 w-3.5" /> {c.membersCount}
                        </span>
                        <CopyButton text={c.joinCode} />
                        <Link to={`/instructor/classrooms/${c.id}`}>
                          <Button size="sm" variant="outline" className="border-slate-700 text-slate-200">
                            <ExternalLink className="h-4 w-4 mr-1" /> Open
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">Join Code: <span className="font-mono">{c.joinCode}</span></div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right: Quick Actions */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button onClick={() => nav("/instructor/classrooms?create=1")} className="w-full h-11 bg-cyan-500 text-slate-900 hover:bg-cyan-400">
                <Plus className="h-4 w-4 mr-1" /> Create New Classroom
              </Button>
              <Button disabled className="w-full h-11 border-slate-700 text-slate-400" variant="outline">
                New Assignment (coming soon)
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-sm font-medium mb-2">Pending Review</div>
              <div className="text-slate-400 text-sm">No items.</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
