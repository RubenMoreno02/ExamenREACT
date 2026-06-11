
import { useState, useEffect } from "react";
import { useAuth } from '../auth/AuthContext.jsx';
import AltaModal from './AltaModal.jsx';
import axios from "axios";

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

const loadNotesFromStorage = () => {
  try {
    const stored = localStorage.getItem('notes');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

const saveNotesToStorage = (notes) => {
  try {
    localStorage.setItem('notes', JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

const Home = () => {
  const { user, token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const urlApi = import.meta.env.VITE_API_URL;
  const notesAllPath = import.meta.env.VITE_NOTES_ALL;
  const notesUserPath = import.meta.env.VITE_NOTES_USER;
  const notesTogglePath = import.meta.env.VITE_NOTES_TOGGLE;
  const notesDeletePath = import.meta.env.VITE_NOTES_DELETE;

  const getAxiosConfig = () => ({
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${urlApi}${notesAllPath}`, getAxiosConfig());
        
        const apiNotes = response.data.data ?? response.data ?? [];
        setNotes(Array.isArray(apiNotes) ? apiNotes : []);
      } catch (error) {
        console.error('Error loading notes from API:', error);
        const loadedNotes = loadNotesFromStorage();
        setNotes(loadedNotes);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadNotes();
    }
  }, [token]);

  const currentUserId = user?.id?.toString() ?? user?.email ?? user?.name ?? null;
  const currentUserName = user?.name ?? user?.email ?? "Usuario";

  const isOwner = (note) => {
    if (!note || !note.userId) return false;
    return note.userId.toString() === currentUserId?.toString();
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveNote = async (noteData) => {
    try {
      const newNote = {
        text: noteData.text,
        color: noteData.color,
      };
      
      const response = await axios.post(
        `${urlApi}${notesUserPath}`,
        newNote,
        getAxiosConfig()
      );
      
      const savedNote = response.data.data ?? response.data ?? newNote;
      const noteWithMetadata = {
        ...savedNote,
        date: new Date().toLocaleDateString(),
        userName: currentUserName,
        userId: currentUserId,
        done: false,
      };
      
      const updatedNotes = [...notes, noteWithMetadata];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving note to API:', error);
      alert('Error al guardar la nota');
    }
  };

  const handleToggleDone = async (noteId) => {
    try {
      const note = notes.find((item) => item.id === noteId);
      if (!note || !isOwner(note)) {
        alert("Solo el creador puede marcar o desmarcar esta nota.");
        return;
      }
      
      await axios.patch(
        `${urlApi}${notesTogglePath}/${noteId}`,
        { done: !note.done },
        getAxiosConfig()
      );
      
      const updatedNotes = notes.map((item) =>
        item.id === noteId ? { ...item, done: !item.done } : item
      );
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    } catch (error) {
      console.error('Error toggling note in API:', error);
      alert('Error al actualizar la nota');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const note = notes.find((item) => item.id === noteId);
      if (!note) {
        alert("Nota no encontrada.");
        return;
      }
      if (!window.confirm("¿Quieres eliminar este anuncio?")) {
        return;
      }
      
      await axios.delete(
        `${urlApi}${notesDeletePath}/${noteId}`,
        getAxiosConfig()
      );
      
      const updatedNotes = notes.filter((item) => item.id !== noteId);
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    } catch (error) {
      console.error('Error deleting note from API:', error);
      if (error.response?.status === 403) {
        alert('No tienes permiso para eliminar esta nota');
      } else {
        alert('Error al eliminar la nota');
      }
    }
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

          {loading ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
                   style={{ color: "rgba(80,40,5,0.45)" }}>
                <span style={{ fontSize: 36 }}>⏳</span>
                <p className="mb-0" style={{ fontSize: 13 }}>Cargando anuncios...</p>
              </div>
            ) : notes.length === 0 ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
                   style={{ color: "rgba(80,40,5,0.45)" }}>
                <span style={{ fontSize: 36 }}>📌</span>
                <p className="mb-0" style={{ fontSize: 13 }}>No hay notas todavía. ¡Añade la primera!</p>
              </div>
            ) : (
             <div className="d-flex flex-wrap gap-3" style={{ alignContent: "flex-start" }}>
                {notes.map(note => {
                  const canEdit = isOwner(note);
                  return (
                    <div key={note.id} className="col">
                    <div
                      className={`tablon-note${note.done ? " done" : ""}`}
                      style={{
                        background: NOTE_BG[note.color],
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
                          disabled={!canEdit}
                          title={canEdit ? "" : "Solo el creador puede completar esta nota"}
                          aria-label={note.done ? "Marcar pendiente" : "Marcar completada"}
                          onClick={() => handleToggleDone(note.id)}
                        >
                          {note.done ? "↺" : "✓"}
                        </button>
                        <button
                          type="button"
                          className="tablon-note-btn del-btn"
                          disabled={false}
                          title="Eliminar nota"
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