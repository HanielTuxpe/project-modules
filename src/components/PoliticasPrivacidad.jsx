import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const PoliticasPrivacidad = () => {
    const [items, setItems] = useState([]);
    const [newPolicy, setNewPolicy] = useState('');
    const [sections, setSections] = useState([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [newSectionList, setNewSectionList] = useState([]);
    const [newListItem, setNewListItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);

    const addPolicy = () => {
        if (newPolicy.trim() === '' || sections.length === 0) {
            alert('Por favor, ingresa un nombre para la política y agrega al menos una sección.');
            return;
        }

        const newPolicyObj = { name: newPolicy, sections };
        setItems([...items, newPolicyObj]);
        clearForm();
    };

    const deletePolicy = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const addSection = () => {
        if (newSectionTitle.trim() === '' || newSectionDescription.trim() === '') {
            alert('Por favor, ingresa un título y una descripción para la sección.');
            return;
        }

        const newSection = {
            title: newSectionTitle,
            description: newSectionDescription,
            list: newSectionList,
        };

        if (editingSectionIndex !== null) {
            const updatedSections = [...sections];
            updatedSections[editingSectionIndex] = newSection;
            setSections(updatedSections);
            setEditingSectionIndex(null);
        } else {
            setSections([...sections, newSection]);
        }
        clearSectionForm();
    };

    const deleteSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const editSection = (index) => {
        const section = sections[index];
        setNewSectionTitle(section.title);
        setNewSectionDescription(section.description);
        setNewSectionList(section.list);
        setEditingSectionIndex(index);
    };

    const addListItem = () => {
        if (newListItem.trim() === '') {
            alert('Por favor, ingresa un ítem para la lista.');
            return;
        }

        setNewSectionList([...newSectionList, newListItem]);
        setNewListItem('');
    };

    const deleteListItem = (index) => {
        const updatedList = newSectionList.filter((_, i) => i !== index);
        setNewSectionList(updatedList);
    };

    const editPolicy = (index) => {
        setIsEditing(true);
        setEditingIndex(index);
        const policy = items[index];
        setNewPolicy(policy.name);
        setSections(policy.sections);
    };

    const saveChanges = () => {
        const updatedPolicies = [...items];
        updatedPolicies[editingIndex] = { name: newPolicy, sections };
        setItems(updatedPolicies);
        clearForm();
    };

    const clearForm = () => {
        setNewPolicy('');
        setSections([]);
        setIsEditing(false);
        setEditingIndex(null);
    };

    const clearSectionForm = () => {
        setNewSectionTitle('');
        setNewSectionDescription('');
        setNewSectionList([]);
    };

    return (
        <Box
            sx={{
                display: 'flex',          // Alinea los elementos en una fila
                justifyContent: 'space-between',  // Espacio entre los elementos
                padding: '20px',
                minHeight: '100vh',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}
        >
            {/* Primer Box */}
            <Box sx={{ flex: 1, marginRight: '20px', overflowY: 'auto' }}>  {/* Ajusta el margen derecho y agrega scroll vertical */}
                <Card
                    sx={{
                        borderRadius: '16px',
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" color="primary" gutterBottom>
                            Políticas de Privacidad
                        </Typography>
                        <List>
                            {items.map((policy, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemText
                                        primary={policy.name}
                                        secondary={
                                            <Box>
                                                {policy.sections.map((section, sectionIndex) => (
                                                    <Box key={sectionIndex} mb={2}>
                                                        <Typography variant="subtitle1" color="textSecondary">
                                                            Sección: {section.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Descripción: {section.description}
                                                        </Typography>
                                                        <List dense>
                                                            {section.list.map((listItem, listItemIndex) => (
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
                                    <IconButton onClick={() => editPolicy(index)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deletePolicy(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>

            {/* Segundo Box */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>  {/* Ajusta el espacio proporcional y agrega scroll vertical */}
                <Card
                    sx={{
                        padding: 2,
                        marginBottom: '20%',
                        borderRadius: '16px',
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <CardContent>
                        <Typography variant="h6">{isEditing ? 'Editar Política' : 'Agregar Nueva Política'}</Typography>
                        <TextField
                            value={newPolicy}
                            onChange={(e) => setNewPolicy(e.target.value)}
                            label="Título de la Política"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            label="Título de la Sección"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            value={newSectionDescription}
                            onChange={(e) => setNewSectionDescription(e.target.value)}
                            label="Descripción de la Sección"
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <Box>
                            <TextField
                                value={newListItem}
                                onChange={(e) => setNewListItem(e.target.value)}
                                label="Ítem de la lista"
                                fullWidth
                            />
                            <Button onClick={addListItem} color="primary" variant="outlined" sx={{ mt: 2 }}>
                                Agregar Ítem
                            </Button>

                            <List>
                                {newSectionList.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={item} />
                                        <IconButton onClick={() => deleteListItem(index)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Button
                            onClick={addSection}
                            color="primary"
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            {editingSectionIndex !== null ? 'Guardar Sección' : 'Agregar Sección'}
                        </Button>

                        <Button
                            onClick={isEditing ? saveChanges : addPolicy}
                            color="secondary"
                            variant="contained"
                            sx={{ mt: 2, ml: 2 }}
                        >
                            {isEditing ? 'Guardar Cambios' : 'Agregar Política'}
                        </Button>

                        <Box mt={4}>
                            <Typography variant="h6">Secciones Agregadas</Typography>
                            {sections.map((section, index) => (
                                <Box key={index} mb={2}>
                                    <Typography variant="subtitle1">{section.title}</Typography>
                                    <Typography variant="body2">{section.description}</Typography>
                                    <IconButton onClick={() => editSection(index)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteSection(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default PoliticasPrivacidad;
