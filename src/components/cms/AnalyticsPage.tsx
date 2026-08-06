"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { Activity, Database, Layers3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getClientDb } from "@/firebase";

const collections = ["projects", "skills", "experience"] as const;
const chartColors = ["#3B82F6", "#14B8A6", "#F59E0B"];

type Entry = {
  id: string;
  collection: string;
  createdAt?: { seconds?: number };
};

function lastSevenDays() {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      writes: 0,
    };
  });
}

export default function AnalyticsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getClientDb();
    if (!db) {
      setLoading(false);
      return;
    }

    const cache = new Map<string, Entry[]>();
    const unsubscribers = collections.map((name) =>
      onSnapshot(
        collection(db, name),
        (snapshot) => {
          cache.set(
            name,
            snapshot.docs.map((doc) => ({
              id: doc.id,
              collection: name,
              ...doc.data(),
            })),
          );
          setEntries(Array.from(cache.values()).flat());
          setLoading(false);
        },
        () => setLoading(false),
      ),
    );

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const collectionBreakdown = useMemo(
    () =>
      collections.map((name) => ({
        name,
        value: entries.filter((entry) => entry.collection === name).length,
      })),
    [entries],
  );

  const dailyWrites = useMemo(() => {
    const days = lastSevenDays();
    const byDay = new Map(days.map((day) => [day.key, day]));

    entries.forEach((entry) => {
      if (!entry.createdAt?.seconds) {
        return;
      }

      const key = new Date(entry.createdAt.seconds * 1000)
        .toISOString()
        .slice(0, 10);
      const day = byDay.get(key);

      if (day) {
        day.writes += 1;
      }
    });

    return days;
  }, [entries]);

  const totalEntries = entries.length;
  const sevenDayWrites = dailyWrites.reduce((sum, day) => sum + day.writes, 0);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live Firestore totals, recent writes, and collection mix.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={Database} label="Total entries" value={totalEntries} />
        <Metric icon={Activity} label="Writes, 7d" value={sevenDayWrites} />
        <Metric icon={Layers3} label="Collections" value={collections.length} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold">Daily writes</h3>
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={dailyWrites}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#94A3B8" />
                <YAxis allowDecimals={false} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="writes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold">Collection breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  data={collectionBreakdown}
                  dataKey="value"
                  innerRadius={68}
                  nameKey="name"
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {collectionBreakdown.map((entry, index) => (
                    <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Syncing Firestore...</p>}
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  );
}
