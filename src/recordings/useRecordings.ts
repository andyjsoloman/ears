import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getRecordings, getRecordingById } from "@/services/apiRecordings";
import supabase from "../lib/supabaseClient";

export function useRecordings(recordingId?: number) {
  // Fetch all recordings
  const {
    isLoading: loadingRecordings,
    data: recordings,
    error: recordingsError,
  } = useQuery({
    queryKey: ["recordings"],
    queryFn: getRecordings,
  });

  // Fetch a specific recording if recordingId is provided
  const {
    isLoading: loadingRecording,
    data: recording,
    error: recordingError,
  } = useQuery({
    queryKey: ["recording", recordingId],
    queryFn: () => (recordingId ? getRecordingById(recordingId) : null),
    enabled: !!recordingId, // Only run if recordingId exists
  });

  return {
    loadingRecordings,
    recordings,
    recordingsError,
    loadingRecording,
    recording,
    recordingError,
  };
}

// Admin-specific: all recordings, sorted
export function useAdminRecordings() {
  return useQuery({
    queryKey: ["admin-recordings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recordings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error("Failed to fetch admin recordings");
      }
      return data;
    },
  });
}

// Admin: delete recording and invalidate cache

export function useDeleteRecording() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("recordings").delete().eq("id", id);
      if (error) throw new Error("Failed to delete recording");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recordings"] });
    },
  });
}
