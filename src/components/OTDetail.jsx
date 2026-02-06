import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { colors } from "../theme/colors";
import apiClient from "../utils/api";
import OTStatusTimeline from "./OTStatusTimeline";

const StatusBadge = ({ status }) => {
  const map = {
    OPEN: { bg: "#E6F2FF", color: "#0B66FF" },
    IN_PROGRESS: { bg: "#E6FFF0", color: "#059669" },
    CLOSED: { bg: "#F3F4F6", color: "#6B7280" },
    REJECTED: { bg: "#FFF1F2", color: "#DC2626" },
  };
  const s = map[status] || map.OPEN;
  return (
    <span
      className="px-3 py-1 rounded-lg font-bold text-sm"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
};

export default function OTDetail({ id, onClose, onUpdated }) {
  const [ot, setOt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAssignPanel, setShowAssignPanel] = useState(false);

  const fetchOT = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/ot-requests/${id}`);
      setOt(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load work order");
      onClose();
    } finally {
      setLoading(false);
    }
  };
  console.log("OTDetail render", ot);
  const fetchTeams = async () => {
    try {
      const res = await apiClient.get("/ot-requests/teams/list");
      setTeams(res.data || []);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOT();
      fetchTeams();
    }
  }, [id]);

  const actingUserId = () => {
    if (!ot) return null;
    return ot.intervenants?.[0]?.user?.id || ot.creator?.id;
  };

  const handleStart = async () => {
    const userId = actingUserId();
    if (!userId) return toast.error("No user available to start");
    try {
      await apiClient.post(`/ot-requests/${id}/start`, { userId });
      toast.success("Work order started");
      await fetchOT();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to start");
    }
  };

  const handleComplete = async () => {
    const userId = actingUserId();
    if (!userId) return toast.error("No user available to complete");
    try {
      await apiClient.post(`/ot-requests/${id}/complete`, { userId });
      toast.success("Work order completed");
      await fetchOT();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to complete");
    }
  };

  const handleReject = async () => {
    const userId = actingUserId();
    if (!userId) return toast.error("No user available to reject");
    const reason = window.prompt("Provide rejection reason");
    if (!reason) return;
    try {
      await apiClient.post(`/ot-requests/${id}/reject`, { userId, reason });
      toast.success("Work order rejected");
      await fetchOT();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to reject");
    }
  };

  const handleAssign = () => {
    setShowAssignPanel(true);
    if (teams.length && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
      setSelectedUserId(teams[0].users?.[0]?.id || null);
    }
  };

  const performAssign = async (startAfter = false) => {
    if (!selectedUserId) return toast.error("Select a user to assign");
    try {
      await apiClient.post(`/ot-requests/${id}/assign`, {
        intervenants: [selectedUserId],
        assignedById: ot.creator?.id,
      });
      if (startAfter) {
        await apiClient.post(`/ot-requests/${id}/start`, {
          userId: selectedUserId,
        });
      }
      toast.success("User assigned" + (startAfter ? " and started" : ""));
      setShowAssignPanel(false);
      await fetchOT();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to assign");
    }
  };

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 z-10 overflow-y-auto max-h-[90vh]">
        {loading || !ot ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-2xl font-bold">{ot.title}</h2>
              <div className="flex gap-3 flex-wrap">
                <StatusBadge status={ot.status} />
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* OT Info */}
            {/* ================= OT DETAILS ================= */}

            <div className="space-y-6">
              {/* GENERAL INFO */}

              <div className="bg-gray-50 border rounded-xl p-5">
                <h3 className="font-semibold mb-4">General Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Lot</p>
                    <p className="font-medium">{ot.lotNumber}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Priority</p>
                    <p className="font-medium">{ot.priority}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Status</p>
                    <StatusBadge status={ot.status} />
                  </div>

                  <div>
                    <p className="text-gray-500">Workplace</p>
                    <p className="font-medium">{ot.workPlace}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Work date</p>
                    <p>
                      {ot.workDate
                        ? new Date(ot.workDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Created by</p>
                    <p>{ot.creator?.name}</p>
                  </div>
                </div>
              </div>

              {/* ACTION + DESCRIPTION */}

              <div className="bg-gray-50 border rounded-xl p-5">
                <h3 className="font-semibold mb-3">Work Details</h3>

                <p className="mb-2">
                  <strong>Action:</strong> {ot.action}
                </p>

                {ot.impact && (
                  <p className="mb-2">
                    <strong>Impact:</strong> {ot.impact}
                  </p>
                )}

                {ot.comment && (
                  <div className="whitespace-pre-line text-gray-700">
                    <strong>Comment:</strong> {ot.comment}
                  </div>
                )}
              </div>

              {/* INTERVENANTS */}

              <div className="bg-gray-50 border rounded-xl p-5">
                <h3 className="font-semibold mb-3">Intervenants</h3>

                <div className="flex flex-wrap gap-2">
                  {ot.intervenants?.length ? (
                    ot.intervenants.map((i) => (
                      <span
                        key={i.id}
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
                      >
                        {i.user?.name || i.userId}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No intervenants</span>
                  )}
                </div>
              </div>

              {/* CUSTOM FIELDS */}

              {ot.customFields?.length > 0 && (
                <div className="bg-gray-50 border rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Custom Fields</h3>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {ot.customFields.map((cf, index) => (
                      <div key={index}>
                        <p className="text-gray-500 text-xs">{cf.name}</p>
                        <p className="font-medium">{cf.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ATTACHMENTS */}

              {ot.attachments?.length > 0 && (
                <div className="bg-gray-50 border rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Attachments</h3>

                  <div className="space-y-2">
                    {ot.attachments?.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        className="block border rounded-lg px-3 py-2 hover:bg-gray-100"
                      >
                        📎 {file.filename || file.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="overflow-x-auto py-4">
              <OTStatusTimeline
                ot={ot}
                creatorName={ot.creator?.name}
                layout="horizontal"
              />
            </div>

            {/* Actions */}
            {ot.status === "OPEN" && (
              <div className="flex flex-col sm:flex-row gap-3">
                {!showAssignPanel ? (
                  <>
                    <button
                      onClick={handleAssign}
                      className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                      Assign
                    </button>
                    <button
                      onClick={handleStart}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Start
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 p-3 border rounded">
                    <select
                      className="p-2 border rounded flex-1"
                      value={selectedTeamId || ""}
                      onChange={(e) => {
                        const tid = e.target.value;
                        setSelectedTeamId(tid);
                        const team = teams.find((t) => t.id === tid);
                        setSelectedUserId(team?.users?.[0]?.id || null);
                      }}
                    >
                      <option value="">Select team</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="p-2 border rounded flex-1"
                      value={selectedUserId || ""}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                      <option value="">Select user</option>
                      {(
                        teams.find((t) => t.id === selectedTeamId)?.users || []
                      ).map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => performAssign(false)}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => performAssign(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Assign & Start
                      </button>
                      <button
                        onClick={() => {
                          setShowAssignPanel(false);
                          setSelectedTeamId(null);
                          setSelectedUserId(null);
                        }}
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {ot.status === "IN_PROGRESS" && (
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Complete
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            )}

            {ot.status === "REJECTED" && (
              <div className="mt-4 p-3 rounded bg-red-50 text-red-600">
                <strong>Rejected:</strong>{" "}
                {ot.rejectionReason || "No reason provided"}
              </div>
            )}

            {ot.status === "CLOSED" && (
              <div className="mt-4 p-3 rounded bg-gray-100 text-gray-700">
                <strong>Closed on:</strong>{" "}
                {ot.closedAt ? new Date(ot.closedAt).toLocaleString() : "—"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
