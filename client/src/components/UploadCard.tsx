import { useState } from "react";
import api from "../lib/api";

interface Props {
  onUploaded: () => void;
}

const UploadCard = ({ onUploaded }: Props) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a CSV file");
      return;
    }
    setError(null);
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    if (name) form.append("name", name);
    try {
      await api.post("/trips/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setFile(null);
      onUploaded();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Upload Trip CSV</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-600">Trip name (optional)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Morning delivery route"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">CSV file</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadCard;

