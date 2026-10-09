import axios from "axios";
import { useState, useEffect } from "react";
import "tailwindcss";

const App = () => {
  const [urls, setUrls] = useState([]);
  const [inputValue, setInpValue] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);

  const fetchUrls = async () => {
    const response = await axios.get("http://localhost:5173/api/url");
    console.log(response.data.data.urls);
    setUrls(response.data.data.urls);
  };

  const createShortUrl = async () => {
    const response = await axios.post("http://localhost:5173/api/url", {
      url: inputValue,
    });

    setCurrentUrl({
      originalUrl: response.data.data.originalUrl,
      shortCode: response.data.data.shortCode,
    });

    fetchUrls();
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">URL Shortener</h1>
        </div>

        <div className="flex w-full gap-3">
          <input
            value={inputValue}
            onChange={(e) => {
              setInpValue(e.target.value);
            }}
            type="text"
            placeholder="Paste your URL"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
          <button
            onClick={() => {
              createShortUrl();
            }}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Shorten
          </button>
        </div>

        <div className="flex w-full flex-col gap-4">
          {urls.map((url) => {
            return (
              <div
                key={url.shortCode}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <a
                
                  href={`http://localhost:3000/${url.shortCode}`}
                  target="_blank"
                  onClick={() => {fetchUrls()}
                }
                  className="mb-2 font-semibold text-blue-600"
                >
                  {url.shortCode}
                </a>

                <p className="mb-4 break-all text-sm text-gray-600 max-w-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                  {url.originalUrl}
                </p>

                <div className="flex justify-between">
                  <div className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white">
                    Clicks : {url.clicks}
                  </div>
                  <div className="flex gap-3">
                    <button className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300">
                      Copy
                    </button>

                    <button className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
