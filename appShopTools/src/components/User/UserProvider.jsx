import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../context/UserContext";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const saveUser = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    console.log('Entro a limpiar el usuario');
    setUser({});
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  // const decodeToken = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return {};

  //   try {
  //     const decoded = jwtDecode(token);
  //     return {
  //       ...decoded,
  //       // Asegúrate de que esta estructura coincide con lo que esperas
  //       rol: decoded.rol?.nombre || decoded.rol, // 👈 Maneja ambos casos
  //     };
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //     return {};
  //   }
  // };

  const decodeToken = () => {
    if (user && Object.keys(user).length > 0) {
      const decodedToken = jwtDecode(user);

      return decodedToken;
    } else {
      return {};
    }
  };

  //requiredRoles=['Administrador','Cliente']
  // const autorize = (requiredRoles) => {
  //   if (!requiredRoles || !Array.isArray(requiredRoles)) return false;

  //   const userData = decodeToken();
  //   console.log("autorize:", userData);
  //   // Verificar si el usuario tiene alguno de los roles requeridos
  //   return requiredRoles.includes(userData.rol);
  // };

  const autorize = ({ requiredRoles }) => {
    const userData = decodeToken();
    if (userData && requiredRoles) {
      console.log('DATOS DEL ROL->',
        userData && userData.rol && requiredRoles.includes(userData.rol.nombre)
      );
      return (
        userData && userData.rol && requiredRoles.includes(userData.rol.nombre)
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
