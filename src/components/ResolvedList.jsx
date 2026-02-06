import { useTranslation } from "react-i18next";
import { colors } from "../theme/colors";

const ResolvedList = ({ resolved }) => {
  const { t } = useTranslation();
console.log('resolved tasks in ResolvedList:', resolved);
  return (
    <section className="w-full mt-6 px-4 mb-10">
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary.main }}>{t("completed_orders")}</h2>
      {resolved.length === 0 && (
        <p className="text-base font-medium text-[#627382]">{t("no_completed_orders")}</p>
      )}
      <div className="space-y-3">
        {resolved.map((task) => (
          <div
            key={task.id}
            className="rounded-lg p-4 shadow-lg flex flex-col gap-2 transition-shadow hover:shadow-xl"
            style={{
              backgroundColor: '#E8F5E9',
              borderLeft: `4px solid #4CAF50`,
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                {task.lotNumber && (
                  <p className="text-sm text-gray-600">
                    Lot: <span className="font-mono">{task.lotNumber}</span>
                  </p>
                )}
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#4CAF50' }}
              >
                {t('status_closed')}
              </span>
            </div>
            {task.comment && (
              <p className="text-sm text-gray-700 italic">"{task.comment}"</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResolvedList;