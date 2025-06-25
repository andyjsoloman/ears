import { useQuery } from "@tanstack/react-query";
import { getRecordings, getRecordingById } from "@/services/apiRecordings";

export function useRecordings(recordingId) {
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
