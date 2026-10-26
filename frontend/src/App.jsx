
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const API = "http://localhost:8001";
const URL = "/coworking";

const emptyForm = {
  spaceName: "",
  location: "",
  deskCount: "",
  monthlyFee: "",
};

export default function App() {
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // GET all coworking spaces
  const loadSpaces = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API}${URL}/all`);
      const data = response.data;

      setSpaces(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.data)
              ? data.data
              : []
      );

      setMessage("");
    } catch (error) {
      setMessage(
        "Unable to load records. Check backend status and CORS configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // POST add or PUT update
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      spaceName: form.spaceName.trim(),
      location: form.location.trim(),
      deskCount: Number(form.deskCount),
      monthlyFee: Number(form.monthlyFee),
    };

    try {
      if (editingId !== null) {
        await axios.put(
          `${API}${URL}/update/${editingId}`,
          payload
        );
        setMessage("Workspace updated successfully.");
      } else {
        await axios.post(`${API}${URL}/add`, payload);
        setMessage("Workspace added successfully.");
      }

      resetForm();
      await loadSpaces();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to save workspace. Check the backend error and request format."
      );
    } finally {
      setSaving(false);
    }
  };

  // Load selected record into the form
  const handleEdit = (space) => {
    setEditingId(space.id);

    setForm({
      spaceName: space.spaceName ?? "",
      location: space.location ?? "",
      deskCount: String(space.deskCount ?? ""),
      monthlyFee: String(space.monthlyFee ?? ""),
    });

    document.getElementById("register")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // DELETE workspace
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workspace?")) {
      return;
    }

    setMessage("");

    try {
      await axios.delete(`${API}${URL}/delete/${id}`);
      setMessage("Workspace deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadSpaces();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to delete workspace. Please check the backend."
      );
    }
  };

  // Search records
  const filteredSpaces = spaces.filter((space) =>
    [
      space.id,
      space.spaceName,
      space.location,
      space.deskCount,
      space.monthlyFee,
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    )
  );

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  return (
    <main className="simple-page">
      <header className="simple-header">
        <h1>Coworking Space Management</h1>
      </header>

      <section className="simple-section" id="register">
        <div className="section-heading">
          <h2>
            {editingId !== null
              ? "Update Coworking Space"
              : "Add Coworking Space"}
          </h2>

          <p>
            Enter the workspace details below. ID is generated automatically.
          </p>
        </div>

        <form className="simple-form" onSubmit={handleSubmit}>
          <input
            name="spaceName"
            placeholder="Space name"
            value={form.spaceName}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            maxLength={150}
            required
          />

          <input
            name="deskCount"
            type="number"
            min="1"
            placeholder="Number of desks"
            value={form.deskCount}
            onChange={handleChange}
            required
          />

          <input
            name="monthlyFee"
            type="number"
            min="0"
            step="0.01"
            placeholder="Monthly fee (₹)"
            value={form.monthlyFee}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Save Changes"
                : "Add Space"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      {message && (
        <div className="simple-message" role="status">
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <section className="simple-section" id="directory">
        <div className="simple-table-heading">
          <div className="section-heading">
            <h2>All Coworking Spaces</h2>
            <p>View and manage your registered workspaces.</p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={loadSpaces}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <input
          className="simple-search"
          placeholder="Search by ID, name, location or fee..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search coworking spaces"
        />

        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Space Name</th>
                <th>Location</th>
                <th>Desks</th>
                <th>Monthly Fee</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSpaces.length > 0 ? (
                filteredSpaces.map((space, index) => (
                  <tr key={space.id ?? index}>
                    <td>{space.id ?? "—"}</td>
                    <td>{space.spaceName}</td>
                    <td>{space.location}</td>
                    <td>{space.deskCount}</td>
                    <td>{formatMoney(space.monthlyFee)}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="edit-button"
                        disabled={space.id == null}
                        onClick={() => handleEdit(space)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        disabled={space.id == null}
                        onClick={() => handleDelete(space.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    {loading
                      ? "Loading coworking spaces..."
                      : search
                        ? "No matching workspaces found."
                        : "No coworking spaces found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="record-count">
          Showing {filteredSpaces.length} of {spaces.length} workspaces
        </p>
      </section>
    </main>
  );
}
