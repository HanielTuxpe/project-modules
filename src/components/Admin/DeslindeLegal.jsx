import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Card, CardContent, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { toast } from 'react-toastify';
import { useReducer } from 'react';

const API_URL = 'http://localhost:3001/deslinde'; // Cambia por la URL de tu API

const PoliticasPrivacidad = () => {
    const [items, setItems] = useState([]);
    const [newPolicy, setNewPolicy] = useState('');
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [newSectionList, setNewSectionList] = useState([]);
    const [newListItem, setNewListItem] = useState('');
    const [newArchivos, setNewArchivos] = useState('null');

    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);
    const [editingListItemIndex, setEditingListItemIndex] = useState(null); // Nuevo estado para editar el ítem
    const [editingPolicyId, setEditingPolicyId] = useState(null);

    const [file, setFile] = useState(null); // Guardar el archivo seleccionado
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0); // Define forceUpdate

    useEffect(() => {

        const fetchPolicies = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setItems(data);
                }
                //toast.success('Políticas Cargadas');
            } catch (error) {
                toast.error('Error al cargar Deslindes');
            }
        };

        fetchPolicies();
    }, []);

    const handleFileChange = (event) => {

        const selectedFile = event.target.files[0];

        // Verificar si se ha seleccionado un archivo
        if (selectedFile) {
            // Verificar que el archivo sea PDF
            const fileType = selectedFile.type;
            if (fileType !== 'application/pdf') {
                toast.error('El archivo debe ser un PDF.');
                setFile(null);
                return;
            }

            // Verificar que el tamaño del archivo no sea mayor a 10MB
            const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB en bytes
            if (selectedFile.size > maxSizeInBytes) {
                toast.warning('El archivo debe ser de 10MB o menos.');
                setFile(null);
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleView = (archivoBuffer) => {
        // Convertir el Buffer en un Blob de tipo PDF
        const blob = new Blob([new Uint8Array(archivoBuffer.data)], { type: 'application/pdf' });

        // Crear una URL a partir del Blob
        const fileURL = URL.createObjectURL(blob);

        // Abrir el archivo en una nueva pestaña del navegador
        window.open(fileURL, '_blank');

        // Liberar la URL del Blob cuando ya no se necesite (opcional)
        setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    };

    const handleDownload = (archivoBuffer, nombreArchivo) => {
        // Convertir el Buffer a una cadena Base64
        const base64String = btoa(
            new Uint8Array(archivoBuffer.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Crear la URL del archivo en formato PDF para descargarlo
        const fileURL = `data:application/pdf;base64,${base64String}`;

        // Crear un enlace temporal para la descarga
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = nombreArchivo;

        // Agregar el enlace al DOM, hacer clic para iniciar la descarga y luego eliminarlo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const addPolicy = async () => {
        if (newPolicy.trim() === '' || sections.length === 0) {
            toast.warning('Por favor, ingresa un nombre para el Deslinde y agrega al menos una sección.');
            return;
        }

        const countResponse = await fetch(`${API_URL}/count`); // Endpoint para contar políticas
        const { count } = await countResponse.json();
        const version = count + 1;


        // Crear un objeto FormData para enviar tanto texto como archivo
        const formData = new FormData();
        formData.append('titulo_deslinde', newPolicy);
        formData.append('secciones', JSON.stringify(sections));

        // Configura los campos adicionales
        formData.append('fechaSubida', new Date().toISOString()); // Fecha actual en formato ISO
        formData.append('version', version); // Puedes ajustar la versión inicial
        formData.append('estadoVigencia', true); // Estado de vigencia por defecto
        formData.append('estado', true); // Estado por defecto

        // Verificar si se ha seleccionado un archivo para agregarlo
        if (file) {
            formData.append('archivo', file); // 'Archivo' es el nombre del campo que el servidor espera
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData, // Enviar formData en lugar de JSON
            });

            if (response.ok) {
                const createdPolicy = await response.json();
                setItems((prevItems) => [...prevItems, createdPolicy]);
                clearForm();
                toast.success('Deslinde Agregado');
            } else {
                toast.warning('Error al agregar el Deslinde.');
            }
        } catch (error) {
            toast.error('Hubo un problema con la solicitud.');
        }
    };

    const deletePolicy = async () => {
        if (editingPolicyId === null) return;

        try {
            // Create a FormData instance to handle both text and optional file data
            const formData = new FormData();
            formData.append('estado', false);
            formData.append('fechaSubida', new Date().toISOString()); // Fecha actual en formato ISO

            const response = await fetch(`${API_URL}/${editingPolicyId}`, {
                method: 'PATCH',
                body: formData, // Use FormData as the body when sending
            });



            if (!response.ok) {
                //console.error(`Error: ${response.status} - ${response.statusText}`);
                //toast.warning(`Error ${response.status}: ${response.statusText}`);
            } else {
                response.json().then(data => {
                    toast.success('Deslinde Eliminado con éxito');
                }).catch(error => {
                    toast.warning('Error al obtener la respuesta');
                });
            }

            const updatedPolicy = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedPolicy : item
            );

            setItems(updatedItems);
            clearForm();
            toast.success('Deslinde Eliminado con éxito');
        } catch (error) {

        }
    };

    const PolicyNoVigente = async (index) => {

        const policy = items[index];

        if (policy) {
            setEditingPolicyId(policy._id);
        }

        if (editingPolicyId === null) return;

        try {

            // Create a FormData instance to handle both text and optional file data
            const formData = new FormData();
            formData.append('estadoVigencia', false);
            formData.append('fechaSubida', new Date().toISOString()); // Fecha actual en formato ISO


            const response = await fetch(`${API_URL}/${editingPolicyId}`, {
                method: 'PATCH',
                body: formData, // Use FormData as the body when sending
            });



            if (!response.ok) {
                //console.error(`Error: ${response.status} - ${response.statusText}`);
                //toast.warning(`Error ${response.status}: ${response.statusText}`);
            } else {
                response.json().then(data => {
                    toast.success('Deslinde No Vigente');
                }).catch(error => {
                    toast.warning('Error al obtener la respuesta');
                });
            }

            const updatedPolicy = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedPolicy : item
            );

            setItems(updatedItems);
            clearForm();
            toast.success('Deslinde No Vigente');
        } catch (error) {

        }
    };

    const PolicyVigente = async (index) => {

        const policy = items[index];

        if (policy) {
            setEditingPolicyId(policy._id);
        }

        if (editingPolicyId === null) return;

        try {

            // Create a FormData instance to handle both text and optional file data
            const formData = new FormData();
            formData.append('estadoVigencia', true);
            formData.append('fechaSubida', new Date().toISOString()); // Fecha actual en formato ISO


            const response = await fetch(`${API_URL}/${editingPolicyId}`, {
                method: 'PATCH',
                body: formData, // Use FormData as the body when sending
            });



            if (!response.ok) {
                //console.error(`Error: ${response.status} - ${response.statusText}`);
                //toast.warning(`Error ${response.status}: ${response.statusText}`);
            } else {
                response.json().then(data => {
                    toast.success('Deslinde Vigente');
                }).catch(error => {
                    toast.warning('Error al obtener la respuesta');
                });
            }

            const updatedPolicy = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedPolicy : item
            );

            setItems(updatedItems);
            clearForm();
            toast.success('Deslinde Vigente');
        } catch (error) {

        }
    };

    const addSection = async () => {
        if (newSectionTitle.trim() === '' || newSectionDescription.trim() === '') {
            toast.warning('Por favor, ingresa un título y una descripción para la sección.');
            return;
        }

        const newSection = {
            titulo_seccion: newSectionTitle,
            description: newSectionDescription,
            list: newSectionList,
        };

        if (editingSectionIndex !== null) {
            const updatedSections = [...sections];
            updatedSections[editingSectionIndex] = newSection;
            setSections(updatedSections);
            setEditingSectionIndex(null);
        } else {
            setSections((prevSections) => [...prevSections, newSection]);
        }
        clearSectionForm();
    };

    const deleteSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const editSection = (index) => {
        const section = sections[index];
        setNewSectionTitle(section.titulo_seccion);
        setNewSectionDescription(section.description);
        setNewSectionList(section.list); // Actualizar con la lista de la sección editada
        setEditingSectionIndex(index);
    };

    const addListItem = () => {
        if (newListItem.trim() === '') {
            toast.warning('Por favor, ingresa un ítem para la lista.');
            return;
        }

        if (editingListItemIndex !== null) {
            // Si está editando un ítem, lo actualiza
            const updatedList = [...newSectionList];
            updatedList[editingListItemIndex] = newListItem;
            setNewSectionList(updatedList);
            setEditingListItemIndex(null); // Resetear el índice de edición
        } else {
            // Si no está editando, lo agrega
            setNewSectionList((prevList) => [...prevList, newListItem]);
        }
        setNewListItem('');

    };

    const deleteListItem = (index) => {
        const updatedList = newSectionList.filter((_, i) => i !== index);
        setNewSectionList(updatedList);
    };

    const editListItem = (index) => {
        const listItem = newSectionList[index];
        setNewListItem(listItem);
        setEditingListItemIndex(index); // Guardar el índice del ítem que se está editando
    };

    const editPolicy = (index) => {
        setIsEditing(true);
        setEditingIndex(index);
        const policy = items[index];

        if (policy) {
            setNewPolicy(policy.titulo_deslinde);
            setSections(policy.secciones);
            setNewArchivos(Array.isArray(policy.Archivo) ? policy.Archivo : [policy.Archivo]);
            setEditingPolicyId(policy._id);
        }
    };

    const editPolicyCancelar = () => {
        setNewPolicy('');                 // Limpiar el título de la política
        setNewSectionTitle('');            // Limpiar el título de la sección
        setNewSectionDescription('');      // Limpiar la descripción de la sección
        setNewListItem('');                // Limpiar el ítem de la lista
        setNewSectionList([]);             // Limpiar la lista de ítems de la sección

        setIsEditing(false);               // Salir del modo de edición
        setEditingSectionIndex(null);
        setEditingListItemIndex(null);

        // Forzar renderizado completo
        forceUpdate();

    };

    const updatePolicy = async () => {
        if (editingPolicyId === null) return;

        try {
            // Create a FormData instance to handle both text and optional file data
            const formData = new FormData();
            formData.append('titulo_deslinde', newPolicy);
            formData.append('secciones', JSON.stringify(sections));
            formData.append('fechaSubida', new Date().toISOString()); // Fecha actual en formato ISO
            // Check if a file is selected; if so, include it in the request
            if (file) {
                formData.append('archivo', file);

            }

            const response = await fetch(`${API_URL}/${editingPolicyId}`, {
                method: 'PATCH',
                body: formData, // Use FormData as the body when sending
            });



            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                toast.warning(`Error ${response.status}: ${response.statusText}`);
            } else {
                response.json().then(data => {

                    toast.success('Deslinde Actualizado con exito');
                }).catch(error => {

                    toast.warning('Error al obtener la respuesta');
                });
            }

            const updatedPolicy = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedPolicy : item
            );

            setItems(updatedItems);
            clearForm();
            toast.success('Deslinde Actualizado con exito');
        } catch (error) {

        }
    };;

    const saveChanges = async () => {
        if (isEditing) {
            await updatePolicy();
        } else {
            await addPolicy();
        }
    };

    const clearForm = () => {
        setNewPolicy('');
        setSections([]);
        setIsEditing(false);
        setEditingIndex(null);
        setEditingPolicyId(null);
    };

    const clearSectionForm = () => {
        setNewSectionTitle('');
        setNewSectionDescription('');
        setNewSectionList([]);
    };

    const deleteArchivo = (index) => {
        const updatedArchivos = newArchivos.filter((_, i) => i !== index);
        setNewArchivos(updatedArchivos);
    };


    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Configuración predeterminada en columna
                    justifyContent: 'space-between',
                    padding: '20px',
                    minHeight: '100vh',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    '@media (min-width: 1000px)': {
                        flexDirection: 'row', // Cambia a dos columnas (fila) cuando la pantalla es mayor a 1000 px
                    },
                }}
            >
                {/* formulario de las políticas */}
                <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: { xs: '20px', sm: '0' } }}>
                    {/* Sección para agregar/editar Deslinde */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" color="primary" gutterBottom>
                                {isEditing ? 'Editar Deslinde Legal' : 'Agregar Nuevo Deslinde Legal'}
                            </Typography>
                            <TextField
                                label="Título del Deslinde"
                                variant="outlined"
                                value={newPolicy}
                                onChange={(e) => setNewPolicy(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: '20px' }}
                            />

                            <Box sx={{ display: 'flex', gap: '100px' }}>
                                <Button variant="contained" color="primary" onClick={saveChanges}>
                                    {isEditing ? 'Actualizar Deslinde' : 'Agregar Deslinde'}
                                </Button>

                                {isEditing && (
                                    <Button variant="contained" color="primary" onClick={editPolicyCancelar}>
                                        Cancelar
                                    </Button>
                                )}
                            </Box>

                        </CardContent>
                    </Card>

                    {/* Secciones */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                            marginTop: '20px',
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" color="primary" gutterBottom>
                                Secciones
                            </Typography>
                            <List sx={{ marginTop: '20px' }}>
                                {sections.map((section, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`Titulo: ${section.titulo_seccion}`}
                                            secondary={`Descripción: ${section.description}`}
                                        />


                                        <Tooltip title="Editar Seccion" arrow>
                                            <IconButton onClick={() => editSection(index)}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Eliminar Seccion" arrow>
                                            <IconButton onClick={() => deleteSection(index)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Tooltip>


                                    </ListItem>
                                ))}
                            </List>
                            <TextField
                                label="Título de la Sección"
                                variant="outlined"
                                value={newSectionTitle}
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: '10px' }}
                            />
                            <TextField
                                label="Descripción de la Sección"
                                variant="outlined"
                                value={newSectionDescription}
                                onChange={(e) => setNewSectionDescription(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: '10px' }}
                            />
                            <List>
                                {newSectionList.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={item} />


                                        <Tooltip title="Editar Item" arrow>
                                            <IconButton onClick={() => editListItem(index)}>
                                                <EditIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Eliminar Item" arrow>
                                            <IconButton onClick={() => deleteListItem(index)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Tooltip>


                                    </ListItem>
                                ))}
                            </List>
                            <TextField
                                label="Ítem de Lista"
                                variant="outlined"
                                value={newListItem}
                                onChange={(e) => setNewListItem(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: '10px' }}
                            />
                            <Button variant="contained" color="secondary" onClick={addListItem}>
                                {editingListItemIndex !== null ? 'Actualizar Item' : 'Agregar Item'}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={addSection}
                                sx={{ marginLeft: '10px' }}
                            >
                                {editingSectionIndex !== null ? 'Actualizar Sección' : 'Agregar Sección'}
                            </Button>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                            padding: '20px',
                        }}
                    >
                        <Typography variant="h5" color="primary" gutterBottom>
                            Agregar Archivo De Deslinde
                        </Typography>

                        {isEditing && newArchivos && (

                            <div>
                                {Array.isArray(newArchivos) && newArchivos.filter(archivo => archivo && archivo.archivo).length > 0 ? (
                                    <List>
                                        {newArchivos.filter(archivo => archivo && archivo.archivo).map((archivo, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={archivo.nombre} />

                                                <Tooltip title="Eliminar Archivo" arrow>
                                                    <IconButton onClick={() => deleteArchivo(index)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </Tooltip>

                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <TextField
                                        type="file"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleFileChange}
                                        sx={{ marginBottom: '20px' }}
                                    />
                                )}
                            </div>

                        )}

                        {!isEditing && (
                            <TextField
                                type="file"
                                variant="outlined"
                                fullWidth
                                onChange={handleFileChange}
                                sx={{ marginBottom: '20px' }}
                            />
                        )
                        }
                    </Card>
                </Box>



                {/* vista de todas las políticas */}
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" color="primary" gutterBottom>
                                Deslinde Legal
                            </Typography>
                            <List>
                                {items.map((policy, index) => (
                                    <ListItem key={policy._id} alignItems="flex-start">


                                        <Box >

                                            <Box display="flex" alignItems="center" gap={2}>
                                                {policy.estadoVigencia ? (
                                                    <Typography variant="subtitle1" color="primary">
                                                        Vigente
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="subtitle1" color="textSecondary">
                                                        No vigente
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" color="textSecondary">
                                                    {new Date(policy.fechaSubida).toLocaleString('es-ES', {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        day: 'numeric',
                                                        month: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Versión: {policy.version}
                                                </Typography>

                                                <Tooltip title="Editar Deslinde" arrow>
                                                    <IconButton onClick={() => editPolicy(index)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Eliminar Deslinde" arrow>
                                                    <IconButton onClick={() => deletePolicy(index)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </Tooltip>

                                                {policy.estadoVigencia ? (
                                                    <Tooltip title="Poner como No Vigente" arrow>
                                                        <IconButton onClick={() => PolicyNoVigente(index)}>
                                                            <CheckCircleIcon color="success" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Poner como Vigente" arrow>
                                                        <IconButton onClick={() => PolicyVigente(index)}>
                                                            <CancelIcon color="primary" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                            </Box>


                                            <ListItemText
                                                primary={policy.titulo_deslinde}
                                                secondary={
                                                    <Box>
                                                        {policy.secciones &&
                                                            policy.secciones.map((section) => (
                                                                <Box key={section._id} mb={2}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="textSecondary"
                                                                        sx={{
                                                                            marginBottom: '10px',
                                                                            overflowWrap: 'break-word',  // Asegura que el texto se ajuste dentro del contenedor
                                                                            wordBreak: 'break-word'      // Rompe las palabras largas si es necesario
                                                                        }}
                                                                    >
                                                                        Sección: {section.titulo_seccion}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="textSecondary"
                                                                        sx={{
                                                                            marginBottom: '10px',
                                                                            overflowWrap: 'break-word',
                                                                            wordBreak: 'break-word'
                                                                        }}
                                                                    >
                                                                        Descripción: {section.description}
                                                                    </Typography>
                                                                    <List dense>
                                                                        {section.list &&
                                                                            section.list.map((listItem, listItemIndex) => (
                                                                                <ListItem key={listItemIndex}>
                                                                                    <ListItemText primary={listItem} />
                                                                                </ListItem>
                                                                            ))}
                                                                    </List>
                                                                </Box>
                                                            ))}

                                                        {policy.Archivo && Array.isArray(policy.Archivo) && policy.Archivo[0] && (
                                                            <>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {policy.Archivo[0].nombre}
                                                                </Typography>

                                                                <Box sx={{ display: 'flex', gap: '100px' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        startIcon={<DownloadIcon />}
                                                                        onClick={() => handleDownload(policy.Archivo[0].archivo, policy.Archivo[0].nombre)}
                                                                    >
                                                                        Descargar
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        startIcon={<VisibilityIcon />}
                                                                        onClick={() => handleView(policy.Archivo[0].archivo)}
                                                                    >
                                                                        Ver
                                                                    </Button>
                                                                </Box>
                                                            </>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </Box>

                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>

            </Box>
        </Box>
    );



};

export default PoliticasPrivacidad;
