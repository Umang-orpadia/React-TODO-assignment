import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTask = async (e) => {
    e.preventDefault();
    await API.post("/tasks", form);
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <h3>Add Task</h3>
      <form onSubmit={addTask}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        /><br />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        /><br />
        <button type="submit">Add</button>
      </form>

      <h3>My Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            <b>{t.title}</b>: {t.description}
            <button onClick={() => deleteTask(t._id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
