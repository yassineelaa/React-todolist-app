import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet, TextInput, Switch, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Input from './UI/Input';
import { TokenContext, UsernameContext } from '../Contexte/Context';
import { getTodoLists, createTodoList, deleteTodoList, updateTodoList, updateAllTodosForList } from '../api/api';

export default function TodoList({ navigation }) {
  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [switchStates, setSwitchStates] = useState({});
  const [progress, setProgress] = useState(0);

  const [token] = useContext(TokenContext);
  const [username] = useContext(UsernameContext);
  
  useEffect(() => {
    setLoading(true);
    getTodoLists(username, token)
      .then(lists => {
        setTodoLists(lists);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [username, token]);

  useEffect(() => {
    const allLists = todoLists.length;
    const completedLists = todoLists.filter(list => switchStates[list.id]).length;
    setProgress(allLists > 0 ? (completedLists / allLists) * 100 : 0);
  }, [switchStates, todoLists]);

  const checkAllItemsChange = (todoListId, isAllChecked) => {
    setSwitchStates(prevState => ({
      ...prevState,
      [todoListId]: isAllChecked,
    }));
  };

  const functionSwitchAllTodos = (todoListId, done) => {
    updateAllTodosForList(todoListId, done, token)
      .then(() => {
        setSwitchStates(prevState => ({
          ...prevState,
          [todoListId]: done,
        }));
      })
      .catch(err => setError(err.message));
  };

  const functionCreateTodoList = (title) => {
    createTodoList(username, title, token)
      .then(newList => {
        setTodoLists(prevLists => [...prevLists, newList]);
      })
      .catch(err => setError(err.message));
  };

  const functionDeleteTodoList = (id) => {
    deleteTodoList(id, token)
      .then(() => {
        setTodoLists(prevLists => prevLists.filter(list => list.id !== id));
      })
      .catch(err => setError(err.message));
  };

  const functionUpdateTodoList = (id, title) => {
    updateTodoList(id, title, token)
      .then(updatedList => {
        setTodoLists(prevLists =>
          prevLists.map(list => (list.id === id ? updatedList : list))
        );
        setEditingId(null); // Fin de l'édition
      })
      .catch(err => setError(err.message));
  };

return (
    <ImageBackground 
      source={require('../assets/backg.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Titre avant la barre de progression */}
        <Text style={styles.titleText}>What's your main goal for today?</Text>
        
        <View style={styles.progressContainer}>
          <Text style={{ color: 'white' }}>
            {todoLists.filter(list => switchStates[list.id]).length} / {todoLists.length} Completed Lists
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.box}>
          <Input placeholder="New TodoList" onSubmit={functionCreateTodoList} />

          {error && <Text style={styles.errorText}>{error}</Text>}

          {todoLists.length === 0 ? (
            <Text style={styles.centeredText}>Aucune TodoList trouvée</Text>
          ) : (
            <FlatList
              data={todoLists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Switch
                    value={switchStates[item.id] || false}
                    onValueChange={(value) => functionSwitchAllTodos(item.id, value)}
                  />
                  {editingId === item.id ? (
                    <TextInput
                      style={styles.input}
                      value={newTitle}
                      onChangeText={setNewTitle}
                      onSubmitEditing={() => functionUpdateTodoList(item.id, newTitle)}
                    />
                  ) : (
                    <View style={styles.textWithIconContainer}>
                      <TouchableOpacity onPress={() => 
                        navigation.navigate('TodoItems', { 
                          todoListId: item.id, 
                          checkChange: checkAllItemsChange 
                        })}
                      >
                        <Text 
                          style={[
                            styles.itemText, 
                            switchStates[item.id] && styles.doneText 
                          ]}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => functionDeleteTodoList(item.id)}>
                        <Image 
                          source={require('../assets/icon.jpg')} 
                          style={styles.deleteIcon} 
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.buttons}>
                    {editingId === item.id ? (
                      <Button title="Save" onPress={() => functionUpdateTodoList(item.id, newTitle)} />
                    ) : (
                      <TouchableOpacity onPress={() => {
                        setEditingId(item.id);
                        setNewTitle(item.title);
                      }}>
                        <Image
                          source={require('../assets/editList.png')}
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#D9D3CA',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
    width: '90%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
  },
  textWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    flex: 1,
    marginRight: 10,
  },
  buttons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  itemText: {
    fontSize: 18,
    marginRight: 10,
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  progressContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '30%',
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  centeredText: {
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 20,
  },
  editIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  titleText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  marginBottom: 15, 
},

});

