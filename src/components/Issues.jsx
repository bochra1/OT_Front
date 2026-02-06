import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dot from "../assets/Ellipse 22.png";
import { colors } from "../theme/colors";
import { useTranslation } from "react-i18next";
import apiClient from "../utils/api";
import OTDetail from './OTDetail';

const Issues = ({ onDataRefresh }) => {
  const { t } = useTranslation();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [myOTs, setMyOTs] = useState([]);
  const [assignedOTs, setAssignedOTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const fetchOTs = async () => {
      setLoading(true);
      try {
        const [myRes, assignedRes] = await Promise.all([
          apiClient.get('/ot-requests/my-ots'),
          apiClient.get('/ot-requests/assigned-to-me'),
        ]);
        console.log('Fetched myOTs:', myRes.data);
        setMyOTs(myRes.data || []);
        setAssignedOTs(assignedRes.data || []);
      } catch (err) {
        console.error('Error fetching OTs:', err);
        toast.error(t("error_loading_ots") || "Erreur lors du chargement des ordres");
      } finally {
        setLoading(false);
      }
    };
    fetchOTs();
  }, [t]);

  const handleTicketClick = (ot, source) => {
    // open detail modal for this OT
    setSelectedTicketId(ot.id);
    setDetailOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const renderOTCard = (ot, source) => {
    const isSelected = selectedTicketId === ot.id;
    const statusColor =  colors.success[500];
    const priorityColor = ot.priority === 'URGENT' || 'HIGH' ? colors.danger[600] : colors.secondary[700];
    return (
      <div
        key={ot.id}
        className="rounded-lg p-4 transition-all"
        onClick={() => handleTicketClick(ot, source)}
        style={{
          cursor: isSelected ? 'not-allowed' : 'pointer',
          border: `3px solid ${isSelected ? colors.secondary[100] : colors.secondary[300]}`,
          backgroundColor: isSelected ? colors.secondary[50] : '#ffffff',
          background: isSelected 
            ? `linear-gradient(135deg, ${colors.secondary[50]} 0%, ${colors.secondary[100]} 100%)`
            : '#ffffff',
          boxShadow: isSelected 
            ? `0 0 0 4px ${colors.secondary[100]}, 0 10px 25px -5px rgba(0, 61, 122, 0.2)` 
            : '0 4px 6px -1px rgba(0, 61, 122, 0.1)',
          opacity: isSelected ? 1 : 1,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
          <h3 className="text-lg font-bold" style={{ color: colors.secondary[700] }}>{ot.title}</h3>
          <span 
            className="p-2 rounded-full flex justify-center items-center gap-2 whitespace-nowrap"
            style={{ 
              backgroundColor: isSelected ? statusColor : colors.secondary[100],
              color: isSelected ? '#ffffff' : statusColor,
              fontWeight: isSelected ? '700' : '500',
              transition: 'all 0.3s ease',
              fontSize: '0.875rem',
            }}
          >
            <img src={dot} alt="" />{ot.status}
          </span>
        </div>
        <p className="text-base mb-2" style={{ color: colors.accent[700] }}>{ot.action}</p>
        <div className="flex flex-col md:flex-row justify-between text-sm gap-2" style={{ color: colors.accent[700] }}>
          <div className="flex flex-col gap-1">
            <span className="font-medium" style={{ color: colors.secondary[700] }}>Lot: {ot.lotNumber}</span>
            <span style={{ color: priorityColor, fontWeight: '700' }}>{ot.priority || 'NORMAL'} PRIORITY</span>
          </div>
          <div className="flex flex-col gap-1 md:text-right">
            <span className="font-medium" style={{ color: colors.secondary[700] }}>{ot.workPlace}</span>
            <span className="flex gap-2" style={{ color: colors.secondary[700] }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 1v2h6V1h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1zm11 10H4v8h16zM7 5H4v4h16V5h-3v2h-2V5H9v2H7z"/>
              </svg>
              {formatDate(ot.createdAt)}
            </span>
          </div>
        </div>
        {source === 'assigned' && ot.creator && (
          <div className="mt-2 text-sm" style={{ color: colors.secondary[700] }}>
            Created by: <span style={{ fontWeight: '600' }}>{ot.creator.name}</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section 
        className="rounded-xl p-6 w-full"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 30px -5px rgba(0, 61, 122, 0.15)',
          border: `2px solid ${colors.secondary[500]}`,
          margin: '0 1.5rem',
        }}
      >
        <p style={{ color: colors.secondary[700] }}>Loading...</p>
      </section>
    );
  }

  const allOTs = [
    ...myOTs.map(ot => ({ ...ot, _source: 'created' })),
    ...assignedOTs.map(ot => ({ ...ot, _source: 'assigned' })),
  ];

  return (
    <section 
      className="rounded-xl p-6 w-full"
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 30px -5px rgba(0, 61, 122, 0.15)',
        border: `2px solid ${colors.secondary[500]}`,
        margin: '0 1.5rem',
      }}
    >
      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b pb-2">
        <button
          onClick={() => setSelectedTicketId(null)}
          className="font-semibold pb-2 transition-all"
          style={{ 
            color: colors.secondary[700],
            borderBottom: `3px solid ${colors.secondary[500]}`,
          }}
        >
          {t("My_Work_Orders")} ({myOTs.length})
        </button>
        <button
          className="font-semibold pb-2 transition-all"
          style={{ 
            color: colors.accent[700],
          }}
        >
          Assigné à moi ({assignedOTs.length})
        </button>
      </div>

      {/* My OTs Grid */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4" style={{ color: colors.secondary[700] }}>
          {t("My_Work_Orders")}
        </h3>
        {myOTs.length === 0 ? (
          <p style={{ color: colors.accent[700] }}>No work orders created yet</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myOTs.map(ot => renderOTCard(ot, 'created'))}
          </div>
        )}
      </div>

      {/* Assigned to Me Grid */}
      <div>
        <h3 className="font-bold text-lg mb-4" style={{ color: colors.secondary[700] }}>
          Assigned to Me
        </h3>
        {assignedOTs.length === 0 ? (
          <p style={{ color: colors.accent[700] }}>No work orders assigned to you</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignedOTs.map(ot => renderOTCard(ot, 'assigned'))}
          </div>
        )}
      </div>
      {detailOpen && selectedTicketId && (
        <OTDetail id={selectedTicketId} onClose={() => { setDetailOpen(false); setSelectedTicketId(null); }} onUpdated={async () => {
          // refresh lists and parent data
          try {
            const [myRes, assignedRes] = await Promise.all([
              apiClient.get('/ot-requests/my-ots'),
              apiClient.get('/ot-requests/assigned-to-me'),
            ]);
            setMyOTs(myRes.data || []);
            setAssignedOTs(assignedRes.data || []);
          } catch (err) {
            console.error('Error refreshing OTs:', err);
          }
          onDataRefresh?.();
        }} />
      )}
    </section>
  );
};

export default Issues;