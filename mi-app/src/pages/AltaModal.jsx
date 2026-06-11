import { useFormik } from 'formik';
import * as Yup from 'yup';

const COLORS = [
  { cls: "note-yellow", hex: "#FFF9C4" },
  { cls: "note-pink",   hex: "#F8BBD0" },
  { cls: "note-blue",   hex: "#BBDEFB" },
  { cls: "note-green",  hex: "#C8E6C9" },
  { cls: "note-orange", hex: "#FFE0B2" },
];

const AltaModal = ({ isOpen, onClose, onSave }) => {
  const formik = useFormik({
    initialValues: {
      text: '',
      color: 'note-yellow',
    },
    validationSchema: Yup.object({
      text: Yup.string()
        .min(10, 'La nota debe tener al minimo 10 caracteres')
        .max(200, 'La nota no puede superar 200 caracteres')
        .required('El texto de la nota es obligatorio'),
      color: Yup.string()
        .oneOf(COLORS.map((c) => c.cls), 'Color inválido')
        .required('Selecciona un color de nota'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSave(values);
      resetForm();
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return (
    
  <>
                    {/* MODAL */}
            {isOpen && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: "rgba(0,0,0,0.45)", zIndex: 10 }}
                onClick={e => { if (e.target === e.currentTarget) handleCancel(); }}
              >
                <div
                  className="bg-white rounded-3 p-4"
                  style={{ width: 280, border: "0.5px solid rgba(0,0,0,0.12)" }}
                  role="dialog"
                  aria-modal="true"
                >
                  <p className="fw-500 mb-3" style={{ fontSize: 14, color: "#111" }}>
                    Nueva nota
                  </p>
                  <form onSubmit={formik.handleSubmit} noValidate>
                    <textarea
                      name="text"
                      className="form-control mb-3"
                      style={{
                        height: 90, fontSize: 13, resize: "none",
                        background: "#f5f5f5", color: "#111",
                        border: "0.5px solid rgba(0,0,0,0.2)",
                      }}
                      placeholder="Escribe tu nota aquí..."
                      maxLength={200}
                      value={formik.values.text}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoFocus
                    />
                    {formik.touched.text && formik.errors.text && (
                      <div className="text-danger mb-2" style={{ fontSize: 12 }}>
                        {formik.errors.text}
                      </div>
                    )}
                    <div className="d-flex gap-2 mb-3">
                      {COLORS.map(c => (
                        <div
                          key={c.cls}
                          className={`tablon-color-dot${formik.values.color === c.cls ? " selected" : ""}`}
                          style={{ background: c.hex }}
                          onClick={() => formik.setFieldValue('color', c.cls)}
                          role="radio"
                          aria-checked={formik.values.color === c.cls}
                          tabIndex={0}
                        />
                      ))}
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="tablon-modal-btn-cancel border rounded-2 px-3 py-1"
                        style={{ fontSize: 13, cursor: "pointer" }}
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="tablon-modal-btn-confirm border-0 rounded-2 px-3 py-1"
                        style={{ fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}  
  
  </>

  )
}

export default AltaModal
