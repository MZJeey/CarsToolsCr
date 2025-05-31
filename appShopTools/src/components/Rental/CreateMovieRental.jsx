import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ShopRentalService from '../../services/ShopRentalService';
import { Cart } from './Cart';
import RentalService from '../../services/RentalService';
import { format, parse } from 'date-fns';
import UserService from '../../services/UserService';
import { useCart } from '../../hooks/useCart';
//https://www.npmjs.com/package/@hookform/resolvers

export function CreateMovieRental() {
  const navigate = useNavigate();
  //Identificador de la Tienda
  let idShopRental = 1;
  
  

// Obtener fecha actual en formato dd/MM/yyyy
const currentDate = format(new Date(), 'dd/MM/yyyy');
  // Esquema de validación
  const movieRentalSchema = yup.object({
    customer_id: yup
      .number()
      .typeError('Seleccione un cliente')
      .required('El cliente es requerido'),
    rental_date: yup
      .string()
      .required('Especifique una fecha')
      .matches(/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/,'Formato día/mes/año dd/mm/yyyy')
      .test('is-future-date', 'La fecha no puede ser menor a la actual', (value) => {
        const inputDate = parse(value, 'dd/MM/yyyy', new Date());
        const today = parse(currentDate, 'dd/MM/yyyy', new Date());
        return inputDate >= today;
      })
  });
  const {cart,getTotal }=useCart()
  const {
    control, //register
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shop_id: '',
      shop_name: '',
      customer_id: '',
      rental_date: currentDate,
      //**Detalle de compra
      movies: cart,
      total: 0,
    },
    // Asignación de validaciones
    resolver: yupResolver(movieRentalSchema),
  });
 
 
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (data) => {
    try {
      if (movieRentalSchema.isValid()) {
       
        // Convertir fecha al formato de la BD (yyyy-mm-dd)
        const [day,month,year]=getValues("rental_date").split('/')
        const dateFormatDB=`${year}-${month}-${day}`
        
        const dataForm={
          ...data,
          rental_date:dateFormatDB,
          //Asignar total
          total:getTotal(cart)          
        }
         
        console.log('Formulario:',dataForm);
        //Crear alquiler
         RentalService.createRental(dataForm)
          .then((response) => {
            setError(response.error)
            //Respuesta al usuario de creación
            if (response.data != null) {
              //{id, shop_id, customer_id, rental_date, total, movies}
              toast.success(`Alquiler creado #${response.data.id}`, {
                duration: 4000,
                position: 'top-center',
              });
              //Borrar carrito de compras
              

             // Redireccion a la tabla
             return navigate('/rental');
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error('Respuesta no válida del servidor');
            }
          }) 
      }
    } catch (e) {
      //Error
      console.error(e);
    }
  };

  //Lista de ShopRentales
  const [dataShopRental, setDataShopRental] = useState({});
  const [loadedShopRental, setLoadedShopRental] = useState(false);
  //Lista de clientes por tienda
  const [dataUsers, setDataUsers] = useState({});
  const [loadedUsers, setLoadedUsers] = useState(false);
  useEffect(() => {
    ShopRentalService.getShopRentalById(idShopRental)
      .then((response) => {
        console.log(response);
        setDataShopRental(response.data);
        setLoadedShopRental(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedShopRental(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
      UserService.getCustomerbyShopRental(idShopRental)
      .then((response) => {
        console.log(response);
        setDataUsers(response.data);
        setLoadedUsers(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedUsers(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, [idShopRental]);
  
  useEffect(() => {
    if (loadedShopRental) {
      setValue('shop_id', dataShopRental.id);
      setValue('shop_name', dataShopRental.name);
     
    }
  }, [loadedShopRental, dataShopRental]);
 

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Crear Alquiler de Peliculas
            </Typography>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="rental_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha"
                    error={Boolean(errors.rental_date)}
                    helperText={
                      errors.rental_date ? errors.rental_date.message : ' '
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="shop_id"
                control={control}
                render={({ field }) => (
                  <>
                    <input type="hidden" {...field} />
                  </>
                )}
              />
              <Controller
                name="shop_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tienda"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de clientes */}
              {loadedUsers && (
                <Controller
                  name="customer_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel id="customer">Cliente</InputLabel>
                      <Select
                        {...field}
                        labelId="customer"
                        label="Cliente"
                        defaultValue=""
                        value={field.value}
                      >
                        {dataUsers &&
                          dataUsers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </>
                  )}
                />
              )}
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.customer_id ? errors.customer_id.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12} sm={8}>
            <Typography variant="h5" gutterBottom>
              Peliculas
            </Typography>
            {/* Detalle de Compra */}
            <Cart />
          </Grid>

          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
