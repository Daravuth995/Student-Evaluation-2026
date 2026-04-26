import type {
  StudentData,
  CommentItem,
  PerformanceHistoryItem,
  PointsTransfer,
  CouponResult,
  PointsLogin,
  SendPointsResult,
} from "../types";

export const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw_hGdyYmWukTCzaZoxuKMv34mYpQMXd7JtSFzpMpRjGd947eM70u-a1xTUJYA894FwAQ/exec";

export const POINTS_BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbzRktKyql2I_FbPESNRpCrFDlse-qNd9_Opv9si-g-j2lcanOUPP49IzcyA59lFqVycdA/exec";

function buildUrl(base: string, params: Record<string, string | number>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => search.append(k, String(v)));
  search.append("t", String(Date.now()));
  return `${base}?${search.toString()}`;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET", redirect: "follow" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

async function postQuery<T>(
  base: string,
  params: Record<string, string | number>,
): Promise<T> {
  const res = await fetch(buildUrl(base, params), {
    method: "POST",
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  // Fetch by ID only — backend returns the full record including Password.
  studentData(studentId: string) {
    return getJSON<StudentData>(
      buildUrl(SCRIPT_URL, { action: "getStudentData", studentId }),
    );
  },

  passwordHint(studentId: string) {
    return getJSON<{ hint?: string; error?: string }>(
      buildUrl(SCRIPT_URL, { action: "getPasswordHint", studentId }),
    );
  },

  validateCoupon(couponCode: string, studentId: string) {
    return getJSON<CouponResult>(
      buildUrl(SCRIPT_URL, {
        action: "validateCoupon",
        studentId,
        couponCode,
      }),
    );
  },

  comments(studentId: string) {
    return getJSON<CommentItem[]>(
      buildUrl(SCRIPT_URL, { action: "getStudentComments", studentId }),
    );
  },

  history(studentId: string) {
    return getJSON<PerformanceHistoryItem[]>(
      buildUrl(SCRIPT_URL, { action: "getPerformanceHistory", studentId }),
    );
  },

  // Points endpoints — note: param name is `id`, NOT `studentId`.
  pointsLogin(id: string, password: string) {
    return getJSON<PointsLogin>(
      buildUrl(POINTS_BACKEND_URL, { action: "login", id, password }),
    );
  },

  recentTransfers(id: string) {
    return getJSON<{ success: boolean; history?: PointsTransfer[] }>(
      buildUrl(POINTS_BACKEND_URL, { action: "getRecentTransfers", id }),
    );
  },

  sendPoints(args: {
    id: string;
    password: string;
    receiverId: string;
    amount: number;
  }) {
    return postQuery<SendPointsResult>(POINTS_BACKEND_URL, {
      action: "sendPoints",
      id: args.id,
      password: args.password,
      receiverId: args.receiverId,
      amount: args.amount,
    });
  },
};
