import { toast } from "react-toastify";
import { themeStyles, colors } from "../theme/colors";
import { useTranslation } from "react-i18next";
import apiClient from "../utils/api";

const TaskStatus = ({ tasks, onRefresh }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return { bg: '#FFF3E0', border: '#FF9800', text: '#F57C00' };
      case 'IN_PROGRESS':
        return { bg: '#FCE4EC', border: '#E91E63', text: '#C2185B' };
      case 'CLOSED':
        return { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' };
      case 'REJECTED':
        return { bg: '#FFEBEE', border: '#F44336', text: '#C62828' };
      default:
        return { bg: '#F5F5F5', border: '#9E9E9E', text: '#424242' };
    }
  };

  const handleComplete = async (task) => {
    try {
      await apiClient.post(`/ot-requests/${task.id}/complete`, {});
      toast.success(`${task.title} ${t('mark_complete')}`);
      onRefresh?.();
    } catch (error) {
      toast.error(error.response?.data?.message || t('form_submission_error'));
    }
  };
console.log('tasks in TaskStatus:', tasks);
  return (
    <section className="w-full px-4">
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary.main }}>
        {t('in_progress_orders')}
      </h2>
      {tasks.length === 0 && (
        <p className="text-base font-medium text-[#627382]">
          {t('no_in_progress_orders')}
        </p>
      )}
      <div className="space-y-3">
        {tasks.map((task) => {
          const statusColor = getStatusColor(task.status || 'OPEN');
          return (
            <div
              key={task.id}
              className="rounded-lg p-4 mb-3 flex flex-col gap-3 transition-shadow hover:shadow-lg"
              style={{
                backgroundColor: statusColor.bg,
                borderLeft: `4px solid ${statusColor.border}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: statusColor.text }}>
                    {task.title}
                  </h3>
                  {task.lotNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                      Lot: <span className="font-mono">{task.lotNumber}</span>
                    </p>
                  )}
                  {task.workPlace && (
                    <p className="text-sm text-gray-600">
                      Place: {task.workPlace}
                    </p>
                  )}
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: statusColor.border }}
                >
                  {task.status || 'OPEN'}
                </span>
              </div>

              {task.comment && (
                <p className="text-sm italic text-gray-700">"{task.comment}"</p>
              )}

              {task.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleComplete(task)}
                  className="text-white px-3 py-2 rounded w-full cursor-pointer transition-colors font-semibold"
                  style={{
                    backgroundColor: colors.secondary[500],
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.target.style.opacity = '1')}
                >
                  {t('mark_complete')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TaskStatus;