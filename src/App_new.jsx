import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Issues from "./components/Issues";
import TaskStatus from "./components/TaskStatus";
import ResolvedList from "./components/ResolvedList";
import Footer from "./components/Footer";
import Container from "./components/Container";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./context/AuthContext";
import apiClient from "./utils/api";

function App() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [inProgressOTs, setInProgressOTs] = useState([]);
  const [completedOTs, setCompletedOTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { user, token, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch dashboard stats and OTs
  useEffect(() => {
    if (token && user) {
      fetchDashboardData();
      // Refresh every 30 seconds to stay in sync
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, myOTsRes] = await Promise.all([
        apiClient.get('/ot-requests/stats/my-dashboard'),
        apiClient.get('/ot-requests/my-ots'),
      ]);

      setDashboardStats(statsRes.data);
      
      // Filter OTs by status
      const allOTs = myOTsRes.data || [];
      setInProgressOTs(allOTs.filter(ot => ot.status === 'IN_PROGRESS'));
      setCompletedOTs(allOTs.filter(ot => ot.status === 'CLOSED'));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || !token) {
    return <Login />;
  }

  const displayInProgressCount = dashboardStats?.created.inProgress || 0;
  const displayResolvedCount = dashboardStats?.created.closed || 0;
  const displayAssignedCount = dashboardStats?.assigned.total || 0;
  const displayAssignedInProgress = dashboardStats?.assigned.inProgress || 0;

  return (
    <div>
      <Navbar user={user} onLogout={logout} />      
      <Container>
        {/* Admin Dashboard */}
        {user.role === 'ADMIN' ? (
          <AdminDashboard />
        ) : (
          <>
            {/* User Personal Dashboard */}
            {dashboardStats && (
              <Hero 
                inProgressCount={displayInProgressCount} 
                resolvedCount={displayResolvedCount}
                assignedCount={displayAssignedCount}
                assignedInProgress={displayAssignedInProgress}
              />
            )}

            <h1 className="hidden lg:block text-2xl font-bold text-[#34485A] px-10 mb-4">{t("My_Work_Orders")}</h1>

            <div className="flex flex-col-reverse lg:flex-row">
              <Issues onDataRefresh={fetchDashboardData} />
              <h1 className="block lg:hidden text-2xl font-bold text-[#34485A] px-10 mb-4">{t("My_Work_Orders")}</h1>
              <div className="flex flex-col gap-4">
                <TaskStatus tasks={inProgressOTs} onRefresh={fetchDashboardData} />
                <ResolvedList resolved={completedOTs} />
              </div>
            </div>
          </>
        )}
      </Container>
      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
