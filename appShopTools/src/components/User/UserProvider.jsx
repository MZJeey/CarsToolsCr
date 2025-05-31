import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../context/UserContext';



export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const saveUser = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    setUser({});
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };
  const decodeToken = () => {
    if (user && Object.keys(user).length > 0) {
      const decodedToken = jwtDecode(user);
      
      return decodedToken;
    } else {
      return {};
    }
  };

  //requiredRoles=['Administrador','Cliente']
  const autorize = ({ requiredRoles }) => {
    const userData = decodeToken();
    if (userData && requiredRoles) {
      console.log(
        userData && userData.rol && requiredRoles.includes(userData.rol.name),
      );
      return (
        userData && userData.rol && requiredRoles.includes(userData.rol.name)
      );
    }
    return false;
  };

  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        saveUser,
        clearUser,
        autorize,
        decodeToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
