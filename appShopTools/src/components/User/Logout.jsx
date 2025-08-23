
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';


// export function Logout() {
//   console.log('Entro en el logout');
//   const navigate = useNavigate();
//   const { clearUser } = useContext(UserContext);
//   useEffect(() => {
//     clearUser();
//     return navigate('/user/login');
//   }, [])
//   return null;
// }

export function Logout() {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);

  useEffect(() => {
    // Primero limpia el usuario
    clearUser();

    // Luego navega
    navigate("/user/login");
  }, []);

  return null;
}