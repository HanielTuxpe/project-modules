import React, { useState, useMemo ,useEffect} from 'react';
import { Box, Typography, Tabs, Tab, Fade, TextField, IconButton, Button, List, ListItem, ListItemText, Avatar, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

const PerfilEmpresa = () => {
    const [nombreEmpresa, setNombreEmpresa] = useState('Nombre de la Empresa');
    const [imagen, setImagen] = useState(null);
    const [descripcion, setDescripcion] = useState('Descripción de la empresa.');
    const [mision, setMision] = useState('Misión de la empresa.');
    const [vision, setVision] = useState('Visión de la empresa.');
    const [direccion, setDireccion] = useState('Dirección de la empresa.');
    const [objetivo, setObjetivo] = useState('Objetivo de la empresa.');
    const [nuevoNombre, setNuevoNombre] = useState('');
  
    const [loading, setLoading] = useState(true);
    const [empresaId, setEmpresaId] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Control para activar/desactivar la edición de campos
    const [isEditingNombre, setIsEditingNombre] = useState(false); // Edición exclusiva para el nombre
  
    // Función para cargar los datos de la empresa con la API GET
    const cargarDatosEmpresa = async () => {
      try {
        const response = await fetch('http://localhost:3001/InformacionEmpresa');
        const data = await response.json();
  
        if (response.ok && data.length > 0) {
          const empresa = data[0];
          setNombreEmpresa(empresa.nombreEmpresa);
          setImagen(empresa.imagen);
          setDescripcion(empresa.descripcion);
          setMision(empresa.mision);
          setVision(empresa.vision);
          setDireccion(empresa.direccion);
          setObjetivo(empresa.objetivo);
          setEmpresaId(empresa._id); 
          setNuevoNombre(empresa.nombreEmpresa); // Para inicializar el campo de edición de nombre
        } else {
          console.error('No se encontraron datos de la empresa');
        }
      } catch (error) {
        console.error('Error al cargar los datos de la empresa:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // Llamar a cargarDatosEmpresa cuando se monte el componente
    useEffect(() => {
      cargarDatosEmpresa();
    }, []);
  
    // Función para manejar la actualización (PATCH) de la empresa
    const actualizarEmpresa = async (campo, valor) => {
      try {
        const response = await fetch(`http://localhost:3001/informacionEmpresa/${empresaId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [campo]: valor }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(`Campo ${campo} actualizado con éxito`, data);
  
          // Actualiza el estado local solo si la actualización fue exitosa
          switch (campo) {
            case 'nombreEmpresa':
              setNombreEmpresa(data.nombreEmpresa);
              break;
            case 'descripcion':
              setDescripcion(data.descripcion);
              break;
            case 'mision':
              setMision(data.mision);
              break;
            case 'vision':
              setVision(data.vision);
              break;
            case 'direccion':
              setDireccion(data.direccion);
              break;
            case 'objetivo':
              setObjetivo(data.objetivo);
              break;
            case 'imagen':
              setImagen(data.imagen);
              break;
            default:
              break;
          }
        } else {
          const errorData = await response.json();
          console.error('Error al actualizar el campo:', errorData.message);
        }
      } catch (error) {
        console.error('Error al actualizar la empresa:', error);
      }
    };
  
    // Función para manejar el cambio de imagen
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const nuevaImagen = reader.result;
          setImagen(nuevaImagen);
          actualizarEmpresa('imagen', nuevaImagen); // Actualiza la imagen en la API
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleEditNombre = () => {
      actualizarEmpresa('nombreEmpresa', nuevoNombre);
      setIsEditingNombre(false);
    };
  
    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };
  
    // Definir la función handleFieldChange
    const handleFieldChange = (campo, valor) => {
      actualizarEmpresa(campo, valor); // Llamada a la función para actualizar
    };
  
    if (loading) {
      return <div>Cargando datos de la empresa...</div>;
    }
  
    return (
      <Box sx={{ padding: 2, marginBottom: '20%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h4" color="primary" gutterBottom>
            {isEditingNombre ? (
              <Box display="flex" alignItems="center">
                <TextField
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  onBlur={handleEditNombre}
                  autoFocus
                />
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                {nombreEmpresa}
                <Tooltip title="Editar Nombre" arrow>
                  <IconButton onClick={() => setIsEditingNombre(true)} color="primary" sx={{ ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Typography>
        </Box>
  
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src={imagen}
            alt="Imagen de la empresa"
            sx={{
              width: 200,
              height: 200,
              border: '2px solid #ccc',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
          />
        </Box>
  
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-image"
          type="file"
          onChange={handleImageChange}
          disabled={!isEditing}
        />
        <label htmlFor="upload-image">
          <Button variant="contained" component="span" disabled={!isEditing}>
            Cambiar Imagen
          </Button>
        </label>
  
        <Box mt={3}>
          <Typography variant="h6">Dirección</Typography>
          <TextField
            value={direccion}
            onChange={(e) => handleFieldChange('direccion', e.target.value)}
            multiline
            rows={2}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
  
        <Box mt={3}>
          <Typography variant="h6">Descripción</Typography>
          <TextField
            value={descripcion}
            onChange={(e) => handleFieldChange('descripcion', e.target.value)}
            multiline
            rows={3}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
  
        <Box mt={3}>
          <Typography variant="h6">Misión</Typography>
          <TextField
            value={mision}
            onChange={(e) => handleFieldChange('mision', e.target.value)}
            multiline
            rows={2}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
  
        <Box mt={3}>
          <Typography variant="h6">Visión</Typography>
          <TextField
            value={vision}
            onChange={(e) => handleFieldChange('vision', e.target.value)}
            multiline
            rows={2}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
  
        <Box mt={3}>
          <Typography variant="h6">Objetivo</Typography>
          <TextField
            value={objetivo}
            onChange={(e) => handleFieldChange('objetivo', e.target.value)}
            multiline
            rows={2}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
  
        <Button variant="contained" onClick={toggleEditing} sx={{ mt: 3 }}>
          {isEditing ? 'Guardar' : 'Editar Información'}
        </Button>
      </Box>
    );
  };


  export default PerfilEmpresa;