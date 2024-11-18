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
            {/* formulario */}
            <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: { xs: '20px', sm: '0' } }}>
                {/* Sección para agregar/editar Deslindes */}
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
                            { sections.map((section, index) => (
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
                        Agregar Archivo De Deslindes
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
                            Deslinde Lega
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

                                            <Tooltip title="Editar Termino" arrow>
                                                <IconButton onClick={() => editPolicy(index)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Eliminar Politica" arrow>
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
                                                                    onClick={() => handleDownload(policy.Archivo[0].archivo, policy.Archivo[0].nombre)}
                                                                >
                                                                    Descargar
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleView(policy.Archivo[0].archivo)}
                                                                >
                                                                    ver
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