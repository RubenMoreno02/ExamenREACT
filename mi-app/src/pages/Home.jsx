
import { useState } from "react";
import { useAuth } from '../auth/AuthContext.jsx';
import AltaModal from './AltaModal.jsx';



const COLORS = [
  { cls: "note-yellow", hex: "#FFF9C4" },
  { cls: "note-pink",   hex: "#F8BBD0" },
  { cls: "note-blue",   hex: "#BBDEFB" },
  { cls: "note-green",  hex: "#C8E6C9" },
  { cls: "note-orange", hex: "#FFE0B2" },
];

const NOTE_BG = {
  "note-yellow": "#FFF9C4",
  "note-pink":   "#F8BBD0",
  "note-blue":   "#BBDEFB",
  "note-green":  "#C8E6C9",
  "note-orange": "#FFE0B2",
};

function noteRot(id) {
  return ((id * 7919) % 9) - 4;
}


const Home = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const currentUserId = user?.id?.toString() ?? user?.email ?? user?.name ?? null;
  const currentUserName = user?.name ?? user?.email ?? "Usuario";

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveNote = (noteData) => {
    const newNote = {
      id: Date.now(),
      text: noteData.text,
      color: noteData.color,
      date: new Date().toLocaleDateString(),
      userName: currentUserName,
      userId: currentUserId,
      done: false,
    };
    setNotes([...notes, newNote]);
    handleCloseModal();
  };

  const handleToggleDone = (noteId) => {
    const note = notes.find((item) => item.id === noteId);
    if (!note || note.userId !== currentUserId) {
      alert("Solo el creador puede marcar o desmarcar esta nota.");
      return;
    }
    setNotes((prevNotes) =>
      prevNotes.map((item) =>
        item.id === noteId ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDeleteNote = (noteId) => {
    const note = notes.find((item) => item.id === noteId);
    if (!note || note.userId !== currentUserId) {
      alert("Solo el creador puede eliminar esta nota.");
      return;
    }
    setNotes((prevNotes) => prevNotes.filter((item) => item.id !== noteId));
  };

  return (
        <>
          <AltaModal isOpen={modalOpen} onClose={handleCloseModal} onSave={handleSaveNote} />

          {/* Posar just abans del </> del component principal */}
          <button
            className="btn btn-dark rounded-circle shadow"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '56px',
              height: '56px',
              fontSize: '1.5rem',
              zIndex: 1000,
            }}
            onClick={handleOpenModal}
            title="Nova nota"
          >
            <i className="bi bi-plus-lg"></i>
          </button>






         {/* Contenido sobre el corcho */}
           <div className="position-relative p-2" style={{ zIndex: 1 }}>

          {notes.length === 0 ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
                   style={{ color: "rgba(80,40,5,0.45)" }}>
                <span style={{ fontSize: 36 }}>📌</span>
                <p className="mb-0" style={{ fontSize: 13 }}>No hay notas todavía. ¡Añade la primera!</p>
              </div>
            ) : (
             <div className="d-flex flex-wrap gap-3" style={{ alignContent: "flex-start" }}>
                {notes.map(note => {
                  const isOwner = note.userId && note.userId === currentUserId;
                  return (
                    <div key={note.id} className="col">
                    <div
                      className={`tablon-note${note.done ? " done" : ""}`}
                      style={{
                        background: NOTE_BG[note.color],
                        transform: `rotate(${noteRot(note.id)}deg)`,
                      }}
                    >
                      <div className="tablon-note-pin" />
                      <div className={`tablon-note-text${note.done ? " done" : ""}`}>
                        {note.text}
                      </div>
                      <div className="tablon-note-date">{note.date}</div>
                      <div className="tablon-note-user">{note.userName}</div>
                      <div className="tablon-note-actions">
                        <button
                          type="button"
                          className="tablon-note-btn done-btn"
                          disabled={!isOwner}
                          title={isOwner ? "" : "Solo el creador puede completar esta nota"}
                          aria-label={note.done ? "Marcar pendiente" : "Marcar completada"}
                          onClick={() => handleToggleDone(note.id)}
                        >
                          {note.done ? "↺" : "✓"}
                        </button>
                        <button
                          type="button"
                          className="tablon-note-btn del-btn"
                          disabled={!isOwner}
                          title={isOwner ? "" : "Solo el creador puede eliminar esta nota"}
                          aria-label="Eliminar nota"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>



    </>
    );
}

export default Home;    