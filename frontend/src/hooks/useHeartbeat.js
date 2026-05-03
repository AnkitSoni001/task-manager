import { useEffect } from "react";
import API from "../api/axios";

const useHeartbeat = (user, intervalMs = 45000) => {
  useEffect(() => {
    if (!user) return;

    // Send heartbeat immediately on mount
    const sendHeartbeat = async () => {
      try {
        await API.post("/users/heartbeat");
      } catch (err) {
        // Silently fail — not critical
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, intervalMs);

    return () => clearInterval(interval);
  }, [user, intervalMs]);
};

export default useHeartbeat;
