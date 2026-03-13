import React from 'react';

export default function RiskBadge({ level }) {
  if (!level) return <span className="badge" style={{ background:'#f3f4f6', color:'#6b7280' }}>Unknown</span>;
  const isHigh = level.includes('High');
  const isMod  = level.includes('Moderate');
  const dot    = isHigh ? '🔴' : isMod ? '🟡' : '🟢';
  const cls    = isHigh ? 'badge badge-high' : isMod ? 'badge badge-mod' : 'badge badge-safe';
  return <span className={cls}>{dot} {level}</span>;
}
