import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import apiClient from "../utils/api";
import { useDropzone } from "react-dropzone";
import { colors } from "../theme/colors";
// ===== Helper Components =====

// Section wrapper (style moderne)
const Section = ({ title, children }) => {
  return (
    <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
};

// Grid responsive intelligente
const Grid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {children}
    </div>
  );
};

const OTForm = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    workPlace: "",
    action: "",
    workDate: "",
    contactTT: "",
    teamId: "",
    intervenants: [],
    impact: "",
    comment: "",
    priority: "NORMAL",
    customFields: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Fetch teams (with users) for team -> intervenants selection
  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const response = await apiClient.get("/ot-requests/teams/list");
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoadingTeams(false);
      }
    };
    if (isOpen) fetchTeams();
  }, [isOpen, t]);

  // Helper: users for currently selected team
  const currentTeamUsers =
    teams.find((tt) => tt.id === formData.teamId)?.users || [];

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    // reset intervenants when team changes
    setFormData((prev) => ({ ...prev, teamId, intervenants: [] }));
  };
  const toggleIntervenant = (userId) => {
    setFormData((prev) => ({
      ...prev,
      intervenants: prev.intervenants.includes(userId)
        ? prev.intervenants.filter((id) => id !== userId)
        : [...prev.intervenants, userId],
    }));
  };

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const filesWithId = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        filename: file.name,
      }));
      setUploadedFiles((prev) => [...prev, ...filesWithId]);
    },
  });

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Sanitization
  const sanitizeInput = (value) => {
    if (typeof value !== "string") return "";
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitized }));
  };

  // Handle intervenants multi-select
  const handleIntervenantsChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, intervenants: selectedOptions }));
  };

  // Handle custom field
  const handleCustomFieldChange = (index, field, value) => {
    const sanitized = sanitizeInput(value);
    const updated = [...formData.customFields];
    updated[index] = { ...updated[index], [field]: sanitized };
    setFormData((prev) => ({ ...prev, customFields: updated }));
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { name: "", value: "" }],
    }));
  };

  const removeCustomField = (index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  // Validate simple required fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t("field_required");
    if (!formData.workPlace.trim()) newErrors.workPlace = t("field_required");
    if (!formData.action.trim()) newErrors.action = t("field_required");
    if (!formData.workDate) newErrors.workDate = t("field_required");
    if (!formData.contactTT.trim()) newErrors.contactTT = t("field_required");
    if (!formData.teamId) newErrors.teamId = t("field_required");
    if (formData.intervenants.length === 0)
      newErrors.intervenants = t("field_required");

    // Custom fields
    formData.customFields.forEach((f, idx) => {
      if (f.name && !f.value)
        newErrors[`customField_${idx}_value`] = t("field_required");
      if (!f.name && f.value)
        newErrors[`customField_${idx}_name`] = t("field_required");
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t("form_validation_error"));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      // Fixed + dynamic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "customFields") payload.append(key, JSON.stringify(value));
        else if (key === "intervenants")
          payload.append(key, JSON.stringify(value));
        else payload.append(key, value);
      });

      // Files
      uploadedFiles.forEach((f) => payload.append("attachments", f.file));

      const res = await apiClient.post("/ot-requests", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("ot_created_success"));
      onClose();
      setFormData({
        title: "",
        workPlace: "",
        action: "",
        workDate: "",
        contactTT: "",
        teamId: "",
        intervenants: [],
        impact: "",
        comment: "",
        priority: "NORMAL",
        customFields: [],
      });
      setUploadedFiles([]);
      setErrors({});

      if (onSubmit) onSubmit(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t("form_submission_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ===================== INFORMATIONS ===================== */}

          <Section title={t("informations_generales")}>
            <Grid>
              {[
                { name: "title", label: t("titre"), type: "text" },
                { name: "workPlace", label: t("lieu_travaux"), type: "text" },
                { name: "workDate", label: t("date_travaux"), type: "date" },
                { name: "contactTT", label: t("contact_tt"), type: "email" },
                { name: "impact", label: t("impact_traffic"), type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              {/* textarea full width */}
              <div className="md:col-span-2 xl:col-span-3">
                <label className="block text-sm font-medium mb-1">
                  {t("action")}
                </label>

                <textarea
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </Grid>
          </Section>
          {/* ===================== CUSTOM FIELDS ===================== */}

          <Section title={t("custom_fields")}>
            <button
              type="button"
              onClick={addCustomField}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              + {t("add_field")}
            </button>

            <div className="space-y-3">
              {formData.customFields.map((field, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    className="w-48 border rounded-lg px-2 py-1"
                    placeholder={t("field_name")}
                    value={field.name}
                    onChange={(e) =>
                      handleCustomFieldChange(idx, "name", e.target.value)
                    }
                  />

                  <input
                    className="flex-1 border rounded-lg px-2 py-1"
                    placeholder={t("field_value")}
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(idx, "value", e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeCustomField(idx)}
                    className="bg-red-100 text-red-600 px-3 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </Section>
          {/* ===================== TEAM ===================== */}

          <Section title={t("team")}>
            <Grid>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("select_team")}
                </label>

                <select
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleTeamChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">--</option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("priority")}
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </Grid>

            {/* intervenants chips layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {currentTeamUsers.map((user) => {
                const selected = formData.intervenants.includes(user.id);

                return (
                  <button
                    type="button"
                    key={user.id}
                    onClick={() => toggleIntervenant(user.id)}
                    className={`
    border rounded-lg px-3 py-2 text-left transition
    ${selected ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-100"}
  `}
                  >
                    {user.name}
                  </button>
                );
              })}
            </div>
          </Section>
          {/* ===================== ATTACHMENTS ===================== */}

          <Section title={t("attachments")}>
            <div
              {...getRootProps()}
              className="
    border-2 border-dashed border-gray-300
    rounded-xl
    p-6
    text-center
    cursor-pointer
    transition
    hover:border-blue-500
    hover:bg-blue-50
  "
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center gap-2">
                {/* icon simple */}
                <div className="text-3xl">📎</div>

                <p className="text-sm text-gray-600">
                  {t("drag_drop_or_click")}
                </p>
              </div>
            </div>

            {/* LIST FILES */}

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f) => (
                  <div
                    key={f.id}
                    className="
   flex items-center justify-between
   bg-gray-50
   border
   rounded-lg
   px-3 py-2
 "
                  >
                    <div className="flex items-center gap-2">
                      <span>📄</span>

                      <span className="text-sm truncate max-w-xs">
                        {f.filename}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className=" text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <div className="md:col-span-2 xl:col-span-3">
            <label className="block text-sm font-medium mb-1">
              {t("commentaire")}
            </label>

            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {/* ===================== ACTIONS ===================== */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              {t("create_ot")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTForm;
