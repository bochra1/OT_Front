import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Issues from "./components/Issues";
import TaskStatus from "./components/TaskStatus";
import ResolvedList from "./components/ResolvedList";
import Footer from "./components/Footer";
import Container from "./components/Container";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resolved, setResolved] = useState([]);

  useEffect(() => {
    fetch("/tickets.json")
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);

  const addTask = (ticket) => {
    if (!tasks.find((t) => t.id === ticket.id)) {
      setTasks([...tasks, ticket]);
    }
  };

  const completeTask = (task) => {
    setTasks(tasks.filter((t) => t.id !== task.id));
    setResolved([...resolved, task]);
    setTickets(tickets.filter((t) => t.id !== task.id));
  };

  return (
    <div>
      <Navbar />
      <Container>
        <Hero inProgressCount={tasks.length} resolvedCount={resolved.length} />

        <h1 className="hidden lg:block text-2xl font-bold text-[#34485A] px-10 mb-4">Customer Tickets</h1>

        <div className="flex flex-col-reverse lg:flex-row">
          <Issues tickets={tickets} addTask={addTask} />
          <h1 className="block lg:hidden text-2xl font-bold text-[#34485A] px-10 mb-4">Customer Tickets</h1>
          <div className="flex flex-col gap-4">
            <TaskStatus tasks={tasks} completeTask={completeTask} />
            <ResolvedList resolved={resolved} />
          </div>
        </div>
      </Container>
      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;