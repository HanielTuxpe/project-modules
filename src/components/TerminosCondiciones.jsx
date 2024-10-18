import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = 'http://localhost:3001/terminos'; // Cambia por la URL de tu API

const Terminos = () => {
    const [items, setItems] = useState([]);
    const [newTerm, setNewTerm] = useState('');
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [newSectionList, setNewSectionList] = useState([]);
    const [newListItem, setNewListItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);
    const [editingListItemIndex, setEditingListItemIndex] = useState(null);
    const [editingTermId, setEditingTermId] = useState(null);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    console.error('La respuesta de la API no es un arreglo:', data);
                }
            } catch (error) {
                console.error('Error al cargar términos:', error);
            }
        };

        fetchTerms();
    }, []);

    const addTerm = async () => {
        try {
            if (newTerm.trim() === '' || sections.length === 0) {
                alert('Por favor, ingresa un nombre para el término y agrega al menos una sección.');
                return;
            }

            const newTermObj = { titulo_termino: newTerm, secciones: sections };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTermObj),
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
            }

            const createdTerm = await response.json();
            setItems((prevItems) => [...prevItems, createdTerm]);
            clearForm();
        } catch (error) {
            console.error('Error al agregar el término:', error);
            alert('Ocurrió un error al agregar el término. Verifica la consola para más detalles.');
        }
    };

    const deleteTerm = async (index) => {
        const termToDelete = items[index];
        const response = await fetch(`${API_URL}/${termToDelete._id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setItems((prevItems) => prevItems.filter((_, i) => i !== index));
        } else {
            alert('Error al eliminar el término.');
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
        setNewSectionList(section.list);
        setEditingSectionIndex(index);
    };

    const addListItem = () => {
        if (newListItem.trim() === '') {
            alert('Por favor, ingresa un ítem para la lista.');
            return;
        }

        if (editingSectionIndex !== null) {
            if (editingListItemIndex !== null) {
                const updatedList = [...newSectionList];
                updatedList[editingListItemIndex] = newListItem;
                setNewSectionList(updatedList);
                setEditingListItemIndex(null);
            } else {
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
        setEditingListItemIndex(index);
    };

    const editTerm = (index) => {
        setIsEditing(true);
        setEditingIndex(index);
        const term = items[index];

        if (term) {
            setNewTerm(term.titulo_termino);  // Cambiar a título del término
            setSections(term.secciones);
            setEditingTermId(term._id);
        }
    };

    const updateTerm = async () => {
        if (editingTermId === null) return;

        try {
            const response = await fetch(`${API_URL}/${editingTermId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo_termino: newTerm,  // Asegúrate de usar el campo correcto
                    secciones: sections,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const updatedTerm = await response.json();
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? updatedTerm : item
            );

            setItems(updatedItems);
            clearForm();
        } catch (error) {
            console.error('Error al actualizar el término:', error);
        }
    };

    const saveChanges = async () => {
        if (isEditing) {
            await updateTerm();
        } else {
            await addTerm();
        }
    };

    const clearForm = () => {
        setNewTerm('');
        setSections([]);
        setIsEditing(false);
        setEditingIndex(null);
        setEditingTermId(null);
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
                            Términos y Condiciones
                        </Typography>
                        <List>
                            {items.map((term, index) => (
                                <ListItem key={term._id} alignItems="flex-start">
                                    <ListItemText
                                        primary={term.titulo_termino} // Usar el campo correcto
                                        secondary={
                                            <Box>
                                                {term.secciones && term.secciones.map((section) => (
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
                                    <IconButton onClick={() => editTerm(index)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteTerm(index)}>
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
                            {isEditing ? 'Editar Término' : 'Agregar Nuevo Término'}
                        </Typography>
                        <TextField
                            label="Título del Término"
                            variant="outlined"
                            value={newTerm}
                            onChange={(e) => setNewTerm(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: '20px' }}
                        />
                        <Button variant="contained" color="primary" onClick={saveChanges}>
                            {isEditing ? 'Actualizar Término' : 'Agregar Término'}
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
                        <TextField
                            label="Ítem de Lista"
                            variant="outlined"
                            value={newListItem}
                            onChange={(e) => setNewListItem(e.target.value)}
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
                        <Button variant="contained" color="secondary" onClick={addListItem}>
                            Agregar Ítem
                        </Button>
                        <Button variant="contained" color="primary" onClick={addSection}>
                            {editingSectionIndex !== null ? 'Actualizar Sección' : 'Agregar Sección'}
                        </Button>




                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Terminos;
