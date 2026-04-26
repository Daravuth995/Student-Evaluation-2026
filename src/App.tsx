import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";
import type { StudentData } from "./types";

interface Session {
  student: StudentData;
  password: string;
  points: number;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  if (!session) {
    return (
      <LoginScreen
        onSuccess={(student, points) =>
          setSession({
            student,
            password: student.Password || "",
            points,
          })
        }
      />
    );
  }

  return (
    <Dashboard
      student={session.student}
      password={session.password}
      initialPoints={session.points}
      onLogout={() => setSession(null)}
    />
  );
}
