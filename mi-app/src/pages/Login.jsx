import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const urlApi = import.meta.env.VITE_API_URL;
const loginPath = import.meta.env.VITE_AUTH_LOGIN;

const validationSchema = Yup.object({
  email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');

      try {
        const response = await axios.post(`${urlApi}${loginPath}`, values, {
          headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;
        const token = data.token ?? data.data?.token ?? data.jwt ?? data.data?.jwt ?? data.accessToken ?? data.data?.accessToken;

        if (!token) {
          setError(data.message || 'Error al iniciar sesión');
          return;
        }

        login(token);
        navigate('/home');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
      }
    },
  });

  return (
    <>
      <div className="position-relative p-2" style={{ zIndex: 1 }}>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6 col-lg-4 p-4">
            <form onSubmit={formik.handleSubmit} noValidate>
              <div className="login-field mb-3">
                <label className="login-label form-label" htmlFor="email">
                  Correu electrònic
                </label>
                <div className="login-input-wrap">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="nom@empresa.com"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className="text-danger">{formik.errors.email}</span>
                )}
              </div>

              <div className="login-field mb-4">
                <div className="login-label-row">
                  <label className="login-label form-label" htmlFor="password">
                    Contrasenya
                  </label>
                </div>
                <div className="login-input-wrap">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-danger">{formik.errors.password}</span>
                )}
              </div>

              {error && <p className="text-danger">{error}</p>}

              <button
                type="submit"
                className="tablon-btn-add d-flex align-items-center gap-2 border-0 rounded-2 px-3 py-2 fw-500"
                style={{ background: '#F5E6C8', color: '#3B1F07', fontSize: 13, cursor: 'pointer' }}
              >
                Iniciar sesión
              </button>

              <div className="mt-3">
                <p className="mb-0">
                  ¿No tienes cuenta? <NavLink to="/registro">Regístrate</NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
