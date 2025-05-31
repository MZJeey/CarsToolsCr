import { useContext } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export function Auth(requiredRoles) {
  const location = useLocation();
  const { user, autorize } = useContext(UserContext);
  let render = null;
  // Especificar el render si el usuario esta autorizado
  if (user && autorize(requiredRoles)) {
    render = <Outlet />;
  } else {
    render = <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  return <div>{render}</div>;
}
