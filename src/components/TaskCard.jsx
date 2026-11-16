import React from "react";

/**
 * Memformat deadline dalam WIB, contoh: "03 Jul 2026, 23.59".
 *
 * @param {Date} deadline Waktu deadline.
 * @returns {string}
 */
function formatDeadline(deadline) {
  return deadline.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatRemainingTime(deadline) {
  const remaining = deadline.getTime() - Date.now();
  if (remaining === 0) return "Jatuh tempo sekarang";
  if (!Number.isFinite(remaining) || remaining < 0) return "Mendekati deadline";

  const totalMinutes = Math.floor(remaining / 60_000);
  if (totalMinutes === 0) return "Kurang dari 1 menit";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  return `${parts.join(" ")} lagi`;
}

/**
 * Card satu tugas pada halaman Daftar Tugas.
 *
 * @param {object} props
 * @param {object} props.task Data tugas dari API (termasuk `mata_kuliah` dan `status_deadline`).
 * @param {(task: object) => void} props.onToggleStatus Dipanggil saat tombol status ditekan.
 * @param {(id: number) => void} props.onDelete Dipanggil saat tombol hapus ditekan.
 */
export default function TaskCard({ task, onToggleStatus, onDelete }) {
  // API mengirim deadline dalam WIB tanpa offset.
  const deadlineDateTime = `${task.deadline}+07:00`;
  const deadline = new Date(deadlineDateTime);
  const hasDeadline = !Number.isNaN(deadline.getTime());
  const deadlineStatus = task.status_deadline;

  return (
    <div className="card task-card">
      <div className="task-content">
        <strong>{task.judul}</strong>
        <div className="meta">{task.mata_kuliah}</div>
        <div className="meta task-deadline">
          <span>
            Deadline: {hasDeadline ? (
              <time dateTime={deadlineDateTime}>{formatDeadline(deadline)} WIB</time>
            ) : "—"}
          </span>
          {deadlineStatus === "due_soon" && (
            <span className="badge due-soon">{formatRemainingTime(deadline)}</span>
          )}
          {deadlineStatus === "overdue" && <span className="badge overdue">Lewat deadline</span>}
        </div>
        {task.deskripsi && <div className="meta">{task.deskripsi}</div>}
      </div>
      <div className="task-actions">
        <span className={`badge ${task.status}`}>
          {task.status === "selesai" ? "Selesai" : "Belum"}
        </span>
        <div className="task-buttons">
          <button className="btn" onClick={() => onToggleStatus(task)}>
            {task.status === "selesai" ? "Tandai Belum" : "Tandai Selesai"}
          </button>
          <button className="btn" onClick={() => onDelete(task.id)}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
