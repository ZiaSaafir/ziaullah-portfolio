import { useEffect, useState } from "react";

export default function useApiResource(loader, initialData) {
  const [resource, setResource] = useState({
    data: initialData,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setResource({ data: initialData, loading: true, error: null });

    loader({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setResource({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted && error?.name !== "AbortError") {
          setResource((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : "An unexpected API error occurred.",
          }));
        }
      });

    return () => controller.abort();
  }, [initialData, loader]);

  return resource;
}
