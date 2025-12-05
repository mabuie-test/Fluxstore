import { useEffect, useState } from 'react';
import useSession from '../state/useSession.js';
import { markNotification } from '../api/client.js';

function NotificationTray() {
  const { notifications, token, setNotifications } = useSession();
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open || !token) return;
    Promise.all(
      notifications.filter((n) => !n.read).map((n) => markNotification(token, n._id || n.id))
    ).then(() => setNotifications(notifications.map((n) => ({ ...n, read: true }))));
  }, [open, notifications, setNotifications, token]);

  return (
    <div
      className="glass"
      style={{ position: 'fixed', bottom: 24, right: 24, padding: 16, width: 320, border: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setOpen((v) => !v)}>
        <div className="pill">Centro de alertas</div>
        {unread > 0 && <span style={{ color: '#19f5c1', fontWeight: 700 }}>{unread} novo(s)</span>}
        <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>{open ? 'Esconder' : 'Ver'}</span>
      </div>
      {open && (
        <div className="grid" style={{ marginTop: 12, maxHeight: 240, overflowY: 'auto' }}>
          {notifications.map((note) => (
            <div key={note._id || note.id} className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{note.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>{note.message}</div>
              <div className="pill" style={{ marginTop: 8 }}>{note.role || 'geral'}</div>
            </div>
          ))}
          {notifications.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center' }}>Sem notificações</div>}
        </div>
      )}
    </div>
  );
}

export default NotificationTray;
