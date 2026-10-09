import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/url";

const App = () => {
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const fetchUrls = async () => {
    try {
      const response = await axios.get(API_URL);
      setUrls(response.data?.data?.urls || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load URLs.");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(API_URL, {
        url: inputValue.trim(),
      });

      const createdUrl = response.data?.data;
      if (createdUrl) {
        setUrls((prev) => [
          {
            _id: Date.now().toString(),
            originalUrl: createdUrl.originalUrl,
            shortCode: createdUrl.shortCode,
            clicks: 0,
          },
          ...prev,
        ]);
      }

      setInputValue("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (shortCode) => {
    const shortUrl = `http://localhost:3000/${shortCode}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(shortCode);
      setTimeout(() => setCopiedId(""), 1500);
    } catch (err) {
      console.error(err);
      setError("Copy failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUrls((prev) => prev.filter((url) => url._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to delete URL.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            URL Shortener
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Shorten long links smartly
          </h1>
          <p className="mt-3 text-slate-600">
            Create concise links and keep all your shortened URLs in one place.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl shadow-slate-900/5"
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste long URL here..."
              className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        </form>

        <div className="space-y-4">
          {urls.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-slate-500">
              No shortened URLs yet. Add your first one above.
            </div>
          ) : (
            urls.map((url) => {
              const shortUrl = `http://localhost:3000/${url.shortCode}`;

              return (
                <div
                  key={url._id || url.shortCode}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-lg shadow-slate-900/5 transition hover:border-teal-300"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-teal-700">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-500" />
                        Short URL
                      </div>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-lg font-semibold text-teal-700 underline-offset-4 hover:underline"
                      >
                        {shortUrl}
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleCopy(url.shortCode)}
                        className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                      >
                        {copiedId === url.shortCode ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => handleDelete(url._id)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Original URL
                    </p>
                    <p className="mt-2 break-all text-sm text-slate-700">
                      {url.originalUrl}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>Clicks: {url.clicks || 0}</span>
                    <span className="rounded-full bg-teal-50 px-2 py-1 text-teal-800">
                      {url.shortCode}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
