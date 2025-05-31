import React from 'react'; 
import Container from '@mui/material/Container'; 
import Typography from '@mui/material/Typography'; 
export function Home() { 
  return ( 
    <Container sx={{ p: 2 }} maxWidth="sm"> 
      <Typography 
        component="h1" 
        variant="h2" 
        align="center" 
        color="text.primary" 
        gutterBottom 
      > 
        CarsToolsCr 
        </Typography> 
      <Typography variant="h5" align="center" color="text.secondary"> 
       Todo  lo que tu vehiculo necesita hasta la puerta de tu garaje. 
       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, ducimus! Blanditiis error iure autem harum enim, esse praesentium perferendis? Sapiente inventore asperiores, corrupti facilis aspernatur repellendus quisquam hic quam beatae.</p>
      </Typography> 
    </Container> 
  ); 
} 