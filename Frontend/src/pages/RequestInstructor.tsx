import React, { useState } from "react";
import StudentNavbar from "@/components/ui/StudentNavbar";
import { Loader2, FileUp, ShieldCheck } from "lucide-react";

export default function RequestInstructor() {
  const [institution, setInstitution] = useState("American University of Beirut");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [country, setCountry] = useState("Lebanon");
  const [instEmail, setInstEmail] = useState("");           // e.g., name@aub.edu.lb
  const [profileUrl, setProfileUrl] = useState("");         // staff directory link
  const [supervisorEmail, setSupervisorEmail] = useState("");  
  const [courses, setCourses] = useState("");
  const [note, setNote] = useState("");
  const [attest, setAttest] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attest || !file) return;

    setSubmitting(true);
    try {
      // build form-data for file + fields
      const form = new FormData();
      form.append("institution", institution);
      form.append("role_title", roleTitle);
      form.append("department", department);
      form.append("country", country);
      form.append("institution_email", instEmail);
      form.append("profile_url", profileUrl);
      form.append("supervisor_email", supervisorEmail);
      form.append("courses", courses);
      form.append("note", note);
      form.append("proof", file);

      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 900));

      // redirect or toast
      alert("Request submitted. You’ll be notified after review.");
      history.back();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StudentNavbar onLogout={() => console.log("logout")} />
      
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Request Instructor Verification</h1>
        <p className="mt-2 text-slate-400">
          Fill this form to verify your academic affiliation. Admins will review your submission.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Institution</label>
              <input value={institution} onChange={(e)=>setInstitution(e.target.value)}
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Country</label>
              <input value={country} onChange={(e)=>setCountry(e.target.value)}
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Role Title</label>
              <input value={roleTitle} onChange={(e)=>setRoleTitle(e.target.value)}
                     placeholder="Lecturer / Professor / TA"
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Department</label>
              <input value={department} onChange={(e)=>setDepartment(e.target.value)}
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Institutional Email</label>
              <input value={instEmail} onChange={(e)=>setInstEmail(e.target.value)}
                     placeholder="name@aub.edu.lb"
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-300">Profile URL (optional)</label>
              <input value={profileUrl} onChange={(e)=>setProfileUrl(e.target.value)}
                     placeholder="https://www.aub.edu.lb/faculty/..."
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1 text-slate-300">Supervisor/Dept Contact (optional)</label>
              <input value={supervisorEmail} onChange={(e)=>setSupervisorEmail(e.target.value)}
                     placeholder="chair@aub.edu.lb"
                     className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Course(s) you plan to teach (optional)</label>
            <input value={courses} onChange={(e)=>setCourses(e.target.value)}
                   className="h-10 w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3"/>
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Proof Document (PDF/JPG/PNG, ≤10MB)</label>
            <label className="group relative block">
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="peer sr-only"
                     onChange={(e)=>setFile(e.target.files?.[0] ?? null)}/>
              <div className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-slate-300">
                <FileUp className="h-4 w-4" />
                <span className="truncate">{file?.name ?? "Choose File"}</span>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Additional Note (optional)</label>
            <textarea value={note} onChange={(e)=>setNote(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg bg-slate-900/70 border border-slate-700/70 px-3 py-2"/>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={attest} onChange={(e)=>setAttest(e.target.checked)} />
            <span>I certify that the provided information is accurate.</span>
          </label>

          <button
            type="submit"
            disabled={!file || !attest || submitting}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 font-medium text-slate-900 hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Submit for Review
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-500">
          We review requests manually. We may contact your department to confirm affiliation.
        </p>
      </main>
    </div>
  );
}
