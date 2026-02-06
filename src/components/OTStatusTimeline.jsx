import { colors } from '../theme/colors';

const StatusIcon = ({ status }) => {
  const iconMap = {
    OPEN: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
      </svg>
    ),
    IN_PROGRESS: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    CLOSED: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    REJECTED: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    ),
  };
  return iconMap[status] || iconMap.OPEN;
};

const getStatusColor = (status) => {
  const colorMap = {
    OPEN: { bg: '#E6F2FF', text: '#0B66FF', border: '#0B66FF' },
    IN_PROGRESS: { bg: '#E6FFF0', text: '#059669', border: '#059669' },
    CLOSED: { bg: '#F3F4F6', text: '#6B7280', border: '#6B7280' },
    REJECTED: { bg: '#FFF1F2', text: '#DC2626', border: '#DC2626' },
  };
  return colorMap[status] || colorMap.OPEN;
};

export default function OTStatusTimeline({ ot, creatorName }) {
  const events = [];

  // OPEN event - always present
  events.push({
    status: 'OPEN',
    timestamp: ot.createdAt,
    user: creatorName || 'System',
    label: 'Created',
    icon: 'OPEN',
  });

  // IN_PROGRESS event - if started
  if (ot.startedAt) {
    const starter = ot.startedBy?.name || ot.intervenants?.[0]?.user?.name || 'Intervenant';
    events.push({
      status: 'IN_PROGRESS',
      timestamp: ot.startedAt,
      user: starter,
      label: 'In Progress',
      icon: 'IN_PROGRESS',
    });
  }

  // Assignment events: show who assigned to whom
  if (ot.intervenants && ot.intervenants.length) {
    // add assignments before in-progress if present
    const assignEvents = ot.intervenants.map((iv) => ({
      status: 'ASSIGNED',
      timestamp: iv.assignedAt,
      user: iv.assignedBy?.name || 'System',
      label: `Assigned to ${iv.user?.name || iv.userId}`,
      icon: 'OPEN',
    }));

    // insert assign events after the OPEN event
    events.splice(1, 0, ...assignEvents);
  }

  // CLOSED or REJECTED event - if closed
  if (ot.closedAt) {
    if (ot.status === 'REJECTED') {
      const closer = ot.closedBy?.name || ot.intervenants?.[0]?.user?.name || 'Intervenant';
      events.push({
        status: 'REJECTED',
        timestamp: ot.closedAt,
        user: closer,
        label: 'Rejected',
        reason: ot.rejectionReason,
        icon: 'REJECTED',
      });
    } else if (ot.status === 'CLOSED') {
      const closer = ot.closedBy?.name || ot.intervenants?.[0]?.user?.name || 'Intervenant';
      events.push({
        status: 'CLOSED',
        timestamp: ot.closedAt,
        user: closer,
        label: 'Cloturé',
        icon: 'CLOSED',
      });
    }
  }

  const formatDateTime = (date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-GB'),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
      <h4 className="font-bold text-lg mb-6" style={{ color: colors.secondary[700] }}>
        Workflow Timeline
      </h4>

      <div className="relative">
        {/* Vertical line */}
        {events.length > 1 && (
          <div
            className="absolute left-0 right-0 top-7 h-0.5"
            style={{ backgroundColor: colors.secondary[200] }}
          />
        )}

        {/* Events */}
<div className="flex items-start gap-10">
          {events.map((event, idx) => {
            const { date, time } = formatDateTime(event.timestamp);
            const colors_map = getStatusColor(event.status);
            const isActive = event.status === ot.status;

            return (
              <div key={idx} className="relative flex flex-col items-center min-w-[160px]">
                {/* Icon circle */}
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-4"
                  style={{
                    backgroundColor: colors_map.bg,
                    borderColor: colors_map.border,
                    color: colors_map.text,
                  }}
                >
                  <StatusIcon status={event.icon} />
                </div>

                {/* Content */}
                <div className="pt-3 text-center">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-base"
                        style={{ color: colors_map.text }}
                      >
                        {event.label}
                      </span>
                      {isActive && (
                        <span
                          className="px-2 py-0.5 text-xs font-bold rounded"
                          style={{
                            backgroundColor: colors_map.bg,
                            color: colors_map.text,
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>

                    <div className="text-sm" style={{ color: colors.accent[700] }}>
                      <p className="font-medium">{event.user}</p>
                      <p className="text-xs" style={{ color: colors.accent[500] }}>
                        {date} at {time}
                      </p>
                    </div>

                    {event.reason && (
                      <div
                        className="mt-2 p-2 rounded text-sm"
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          borderLeft: '3px solid #DC2626',
                        }}
                      >
                        <strong>Reason:</strong> {event.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
