import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import { ListMovies } from "./components/Movie/ListMovies";
import { DetailMovie } from "./components/Movie/DetailMovie";
import ListRentals from "./components/Rental/ListRentals";
import DetailRental from "./components/Rental/DetailRental";
import TableMovies from "./components/Movie/TableMovies";
import { CreateMovie } from "./components/Movie/CreateMovie";
import { UpdateMovie } from "./components/Movie/UpdateMovie";
import { CatalogMovies } from "./components/Movie/CatalogMovies";
import { MovieUploadImage } from "./components/Movie/MovieUploadImage";
import { CreateMovieRental } from "./components/Rental/CreateMovieRental";
import { GraphRetal } from "./components/Rental/GraphRental";
import UserProvider from "./components/User/UserProvider";
import { Unauthorized } from "./components/User/Unauthorized";
import { Login } from "./components/User/Login";
import { Logout } from "./components/User/Logout";
import { Signup } from "./components/User/Signup";
import { Auth } from "./components/User/Auth";
const rutas=createBrowserRouter(
  [
    {
      element: <App />,
      children:[
        {
          path:'/',
          element: <Home />
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        //Grupos de rutas a autorizar
        //Grupo 1: Administrador
        //Grupo 2: Cliente
        //Grupo 3: Administrador y el Cliente
        {
          //Grupo 1
          path:'/',
          element: <Auth requiredRoles={['Administrador']} />,
          children:[
            {
              path:'/movie-table',
              element: <TableMovies />
            },
            {
              path:'/movie/crear/',
              element: <CreateMovie />
            },
            {
              path:'/movie/update/:id',
              element: <UpdateMovie />
            },
          ]
        },
        {
          path:'/movie/',
          element: <ListMovies />
        },
        {
          path: '/catalog-movies/',
          element: <CatalogMovies />,
        },
        {
          path:'/movie/:id',
          element: <DetailMovie />
        },
        {
          path: 'movie/image/',
          element: <MovieUploadImage />
        },
        
        {
          path:'/rental',
          element: <ListRentals />
        },
        {
          path:'/retal/:id',
          element: <DetailRental />
        },
       
        {
          path: '/rental/crear/',
          element: <CreateMovieRental />,
        },
        {
          path: '/rental/graph',
          element: <GraphRetal />,
        },
        {
          path: '/unauthorized',
          element: <Unauthorized />
        },
        {
          path: '/user/login',
          element: <Login />
        },
        {
          path:'/user/logout',
          element: <Logout />
        },
        {
          path: '/user/create',
          element: <Signup />
        }
      ]
    }
  ]
)

createRoot(document.getElementById("root")).render(
  <StrictMode> 
    <UserProvider>
      <RouterProvider router={rutas} /> 
    </UserProvider>
</StrictMode>, 
);
