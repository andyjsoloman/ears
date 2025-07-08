"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  useAdminRecordings,
  useDeleteRecording,
} from "@/recordings/useRecordings";
import supabase from "@/lib/supabaseClient";
import styled from "styled-components";

type Recording = {
  id: number;
  title: string;
  file_url: string;
  created_at: string;
};

const ADMIN_EMAIL = "andyjsoloman@gmail.com";

const Page = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const RecordingItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  flex: 1;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  border: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
`;

export default function AdminPage() {
  const {
    data: recordings,
    isLoading: loadingRecordings,
    error: recordingsError,
  } = useAdminRecordings();
  const { mutate: deleteRecording } = useDeleteRecording();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState<Recording | null>(
    null
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Login result", { data, error }); // 👈 Add this line

    if (error) {
      console.error("Login error:", error); // 👈 Add this
      setLoginError("Login failed. Check your credentials.");
    } else {
      setUser(data.user);
      setLoginError("");
    }
  };

  if (!user?.email || user.email !== ADMIN_EMAIL) {
    return (
      <ModalOverlay>
        <ModalContent>
          <h2>Admin Login</h2>
          <label>
            Email:
            <input
              style={{ display: "block", width: "100%", marginBottom: "1rem" }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              style={{ display: "block", width: "100%" }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {loginError && <p style={{ color: "red" }}>{loginError}</p>}
          <Button onClick={handleLogin}>Login</Button>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <>
      <Page>
        <h1>Admin Panel: Recordings</h1>
        {loadingRecordings && <p>Loading...</p>}
        {recordingsError && <p>Error loading recordings</p>}
        {recordings?.length === 0 && <p>No recordings found.</p>}
        {recordings?.map((rec) => (
          <RecordingItem key={rec.id}>
            <Info>
              <strong>{rec.title || "Untitled"}</strong>
              <p>Uploaded: {new Date(rec.created_at).toLocaleString()}</p>
            </Info>
            <Controls>
              <audio controls src={rec.file_url} />
              <Button
                onClick={() => {
                  setRecordingToDelete(rec);
                  setShowConfirmModal(true);
                }}
              >
                Delete
              </Button>
            </Controls>
          </RecordingItem>
        ))}
        <Button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload(); // force reload to trigger login modal
          }}
        >
          Logout
        </Button>
      </Page>
      {recordingToDelete && showConfirmModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this recording?</p>
            <p>
              <strong>{recordingToDelete.title || "Untitled"}</strong>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <Button
                onClick={() => {
                  setShowConfirmModal(false);
                  setRecordingToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteRecording(recordingToDelete.id);
                  setShowConfirmModal(false);
                  setRecordingToDelete(null);
                }}
              >
                Confirm
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
