import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = 'http://localhost:3001/deslinde'; // Cambia por la URL de tu API

const DeslindeLegal = () => {
    const [items, setItems] = useState([]);
    const [newDeslinde, setNewDeslinde] = useState('');
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [newSectionList, setNewSectionList] = useState([]);
    const [newListItem, setNewListItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);
    const [editingListItemIndex, setEditingListItemIndex] = useState(null); // Nuevo estado para editar el ítem
    const [editingDeslindeId, setEditingDeslindeId] = useState(null);

    useEffect(() => {
        const fetchDeslindes = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setItems(data);
                    console.log('La respuesta de la API', data);
                } else {
                    console.error('La respuesta de la API no es un arreglo:', data);
                }
            } catch (error) {
                console.error('Error al cargar deslindes:', error);
            }
        };

        fetchDeslindes();
    }, []);

    const addDeslinde = async () => {
        if (newDeslinde.trim() === '' || sections.length === 0) {
            alert('Por favor, ingresa un nombre para el deslinde y agrega al menos una sección.');
            return;
        }

        const newDeslindeObj = { titulo_deslinde: newDeslinde, secciones: sections };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDeslindeObj),
        });

        if (response.ok) {
            const createdDeslinde = await response.json();
            setItems((prevItems) => [...prevItems, createdDeslinde]);
            clearForm();
        } else {
            alert('Error al agregar el deslinde.');
        }
    };

    const deleteDeslinde = async (index) => {
        const deslindeToDelete = items[index];
        const response = await fetch(`${API_URL}/${deslindeToDelete._id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setItems((prevItems) => prevItems.filter((_, i) => i !== index));
        } else {
            alert('Error al eliminar el deslinde.');
        }
    };

    const addSection = async () => {
        if (newSectionTitle.trim() === '' || newSectionDescription.trim() === '') {
            alert('Por favor, ingresa un título y una descripción para la sección.');
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
            alert('Por favor, ingresa un ítem para la lista.');
            return;
        }

        if (editingSectionIndex !== null) {
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
        } else {
            alert('No puedes agregar ítems si no estás editando una sección.');
        }
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

    const editDeslinde = (index) => {
        setIsEditing(true);
        setEditingIndex(index);
        const deslinde = items[index];

        if (deslinde) {
            setNewDeslinde(deslinde.titulo_deslinde);
            setSections(deslinde.secciones);
            setEditingDeslindeId(deslinde._id);
        }
    };

    const updateDeslinde = async () => {
        if (editingDeslindeId === null) return;

        try {
            const response = await fetch(`${API_URL}/${editingDeslindeId}`, {
                method: 'PATCH', // Asegúrate de usar PATCH ya que esa es la ruta correcta en tu backend
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo_deslinde: newDeslinde,
                    secciones: sections,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const updatedDeslinde = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedDeslinde : item
            );

            setItems(updatedItems);
            clearForm();
        } catch (error) {
            console.error('Error al actualizar el deslinde:', error);
        }
    };

    const saveChanges = async () => {
        if (isEditing) {
            await updateDeslinde();
        } else {
            await addDeslinde();
        }
    };

    const clearForm = () => {
        setNewDeslinde('');
        setSections([]);
        setIsEditing(false);
        setEditingIndex(null);
        setEditingDeslindeId(null);
    };

    const clearSectionForm = () => {
        setNewSectionTitle('');
        setNewSectionDescription('');
        setNewSectionList([]);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px',
                minHeight: '100vh',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}
        >
            {/* Primer Box */}
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
                            {items.map((deslinde, index) => (
                                <ListItem key={deslinde._id} alignItems="flex-start">
                                    <ListItemText
                                        primary={deslinde.titulo_deslinde} // Usar el campo correcto
                                        secondary={
                                            <Box>
                                                {deslinde.secciones && deslinde.secciones.map((section) => (
                                                    <Box key={section._id} mb={2}>
                                                        <Typography variant="subtitle1" color="textSecondary">
                                                            Sección: {section.titulo_seccion}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Descripción: {section.description}
                                                        </Typography>
                                                        <List dense>
                                                            {section.list && section.list.map((listItem, listItemIndex) => (
                                                                <ListItem key={listItemIndex}>
                                                                    <ListItemText primary={listItem} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Box>
                                                ))}
                                            </Box>
                                        }
                                    />
                                    <IconButton onClick={() => editDeslinde(index)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteDeslinde(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>

            {/* Segundo Box */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Card
                    sx={{
                        borderRadius: '16px',
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {isEditing ? 'Editar Deslinde' : 'Agregar Nuevo Deslinde'}
                        </Typography>
                        <TextField
                            label="Título del Deslinde"
                            variant="outlined"
                            value={newDeslinde}
                            onChange={(e) => setNewDeslinde(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: '20px' }}
                        />
                        <Button variant="contained" color="primary" onClick={saveChanges}>
                            {isEditing ? 'Actualizar Deslinde' : 'Agregar Deslinde'}
                        </Button>
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
                        <List sx={{ marginTop: '20px' }}>
                            {sections.map((section, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={section.titulo_seccion}
                                        secondary={`Descripción: ${section.description}`}
                                    />
                                    <IconButton onClick={() => editSection(index)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteSection(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h5" color="primary" gutterBottom>
                            Secciones
                        </Typography>
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
                                    <IconButton onClick={() => editListItem(index)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteListItem(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
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
                            Agregar Ítem
                        </Button>
                        <Button variant="contained" color="primary" onClick={addSection} sx={{ marginLeft: '10px' }}>
                            {editingSectionIndex !== null ? 'Actualizar Sección' : 'Agregar Sección'}
                        </Button>


                    </CardContent>
                </Card>
            </Box>
        </Box>
    );

};

export default DeslindeLegal;
