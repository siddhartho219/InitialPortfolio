"use client";

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { getClientDb } from "@/firebase";

type FieldType = "text" | "textarea" | "number" | "list" | "date";

type FieldConfig = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
};

type CmsRecord = {
  id: string;
  [key: string]: unknown;
};

type CollectionManagerProps = {
  collectionName: "projects" | "skills" | "experience" | "blogs";
  title: string;
  description: string;
  fields: FieldConfig[];
};

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value instanceof Timestamp) {
    return value.toDate().toLocaleDateString();
  }

  if (value && typeof value === "object" && "seconds" in value) {
    return new Date(Number(value.seconds) * 1000).toLocaleDateString();
  }

  return value ? String(value) : "-";
}

function emptyForm(fields: FieldConfig[]) {
  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});
}

function normalizeValue(value: string, type: FieldType = "text") {
  if (type === "list") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (type === "number") {
    return Number(value) || 0;
  }

  return value.trim();
}

export default function CollectionManager({
  collectionName,
  description,
  fields,
  title,
}: CollectionManagerProps) {
  const [items, setItems] = useState<CmsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [form, setForm] = useState(() => emptyForm(fields));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const db = getClientDb();
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        setItems(
          snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [collectionName]);

  const visibleFields = useMemo(() => fields.slice(0, 4), [fields]);

  function openCreateModal() {
    setEditing(null);
    setForm(emptyForm(fields));
    setModalOpen(true);
  }

  function openEditModal(item: CmsRecord) {
    setEditing(item);
    setForm(
      fields.reduce<Record<string, string>>((acc, field) => {
        const value = item[field.key];
        acc[field.key] = Array.isArray(value)
          ? value.join(", ")
          : value
            ? String(value)
            : "";
        return acc;
      }, {}),
    );
    setModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const payload = fields.reduce<Record<string, unknown>>((acc, field) => {
      acc[field.key] = normalizeValue(form[field.key] ?? "", field.type);
      return acc;
    }, {});

    const db = getClientDb();
    if (!db) {
      setSaving(false);
      return;
    }

    try {
      if (editing) {
        await updateDoc(doc(db, collectionName, editing.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this entry?");

    if (confirmed) {
      const db = getClientDb();
      if (!db) return;
      await deleteDoc(doc(db, collectionName, id));
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          onClick={openCreateModal}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add entry
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                {visibleFields.map((field) => (
                  <th className="px-4 py-3 font-medium" key={field.key}>
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                    Loading entries...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                    No entries yet.
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr className="border-b border-border/70 last:border-0" key={item.id}>
                  {visibleFields.map((field) => (
                    <td className="max-w-xs truncate px-4 py-3" key={field.key}>
                      {formatValue(item[field.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label="Edit entry"
                        className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => openEditModal(item)}
                        type="button"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete entry"
                        className="rounded-md border border-border p-2 text-destructive"
                        onClick={() => handleDelete(item.id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-8">
          <form
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-5 shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit entry" : "Add entry"}
              </h3>
              <button
                aria-label="Close modal"
                className="rounded-md border border-border p-2 text-muted-foreground"
                onClick={() => setModalOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label
                  className={field.type === "textarea" ? "sm:col-span-2" : ""}
                  key={field.key}
                >
                  <span className="mb-2 block text-sm text-muted-foreground">
                    {field.label}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      required={field.required}
                      value={form[field.key] ?? ""}
                    />
                  ) : (
                    <input
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      required={field.required}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={form[field.key] ?? ""}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-border px-4 py-2 text-sm"
                onClick={() => setModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving..." : "Save entry"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
