import { useTranslation } from "react-i18next";

const Hero = ({ inProgressCount, resolvedCount, assignedCount = 0, assignedInProgress = 0 }) => {
  const {t} = useTranslation();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 mb-10 min-h-[30vh] items-stretch">
      <div className="flex flex-col justify-center items-center text-white rounded-xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #003D7A 0%, #00275A 100%)' }}>
        <h2 className="text-lg font-semibold">{t("in_progress")}</h2>
        <p className="text-4xl font-bold">{inProgressCount}</p>
      </div>
      <div className="flex flex-col justify-center items-center text-white rounded-xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #003D7A 0%, #00275A 100%)' }}>
        <h2 className="text-lg font-semibold">{t("completed")}</h2>
        <p className="text-4xl font-bold">{resolvedCount}</p>
      </div>
      {assignedCount > 0 && (
        <div className="flex flex-col justify-center items-center text-white rounded-xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)' }}>
          <h2 className="text-lg font-semibold">Assigned to Me</h2>
          <p className="text-4xl font-bold">{assignedCount}</p>
        </div>
      )}
      {assignedInProgress > 0 && (
        <div className="flex flex-col justify-center items-center text-white rounded-xl p-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
          <h2 className="text-lg font-semibold">Assigned In Progress</h2>
          <p className="text-4xl font-bold">{assignedInProgress}</p>
        </div>
      )}
    </section>
  );
};

export default Hero;