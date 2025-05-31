import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import Tooltip from '@mui/material/Tooltip';
import { SelectActors } from './SelectActors';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

ActorsForm.propTypes = {
  data: PropTypes.array,
  control: PropTypes.object,
  index: PropTypes.number,
  onRemove: PropTypes.func,
  disableRemoveButton: PropTypes.bool,
  field: PropTypes.object,
};

export function ActorsForm({
  data,
  control,
  index,
  onRemove,
  disableRemoveButton,
  // eslint-disable-next-line no-unused-vars
  field,
}) {
  return (
    <section key={index}>
      <Grid size={12} md={12}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Tooltip title={`Actor ${index + 1}`}>
                <IconButton>
                  <DirectionsRunIcon />
                </IconButton>
              </Tooltip>
            </ListItemIcon>
            <ListItemText>
              <Controller
                key={index}
                name={`actors.${index}.actor_id`}
                control={control}
                render={({ field }) => (
                  <SelectActors field={field} data={data} />
                )}
              />
            </ListItemText>
            <ListItemText sx={{ m: 1 }}>
              <Controller
                key={index}
                name={`actors.${index}.role`}
                control={control}
                render={({ field }) => <TextField {...field} label="Rol" />}
              />
            </ListItemText>
            <ListItemIcon>
              <Tooltip title={`Eliminar Actor ${index + 1}`}>
                <span>
                  <IconButton
                    key={index}
                    edge="end"
                    disabled={disableRemoveButton}
                    onClick={() => onRemove(index)}
                    aria-label="Eliminar"
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemIcon>
          </ListItem>
        </List>
      </Grid>
    </section>
  );
}
