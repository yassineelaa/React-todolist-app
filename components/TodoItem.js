import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Switch, TextInput, Image, TouchableOpacity } from 'react-native';
import Input from '../components/UI/Input';
import { TokenContext } from '../Contexte/Context';
import { getTodos, createTodo, updateTodo, deleteTodo, updateAllTodos } from '../api/api';

export default function TodoItem({ route }) {
  const { todoListId, checkChange } = route.params;
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [token] = useContext(TokenContext);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    setLoading(true);
    getTodos(todoListId, token)
      .then(items => {
        setTodos(items);
        setLoading(false);
        checkAllItemsOk(items);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [todoListId, token]);

  const checkAllItemsOk = (items) => {
    if (items.length === 0) {
      checkChange(todoListId, false);
    } else {
      const allChecked = items.every(item => item.done);
      checkChange(todoListId, allChecked);
    }
  };

  const functionCreateTodo = (content) => {
    createTodo(content, todoListId, token)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        checkAllItemsOk([...todos, newTodo]);
      })
      .catch(err => setError(err.message));
  };

  const functionUpdateTodo = (id, content) => {
    const currentTodo = todos.find(todo => todo.id === id);
    updateTodo(id, currentTodo.done, content, token) 
      .then(updatedTodo => {
        const updatedTodos = todos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
        setEditingId(null);
      })
      .catch(err => setError(err.message));
  };

  const functionCheckAllItems = (done) => {
    updateAllTodos(todoListId, done, token)
      .then(updatedTodos => {
        setTodos(updatedTodos);
        checkAllItemsOk(updatedTodos);
      })
      .catch(err => setError(err.message));
  };

  const switchTodo = (id, done) => {
    const currentTodo = todos.find(todo => todo.id === id);
    updateTodo(id, done, currentTodo.content, token) 
      .then(updatedTodo => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
        checkAllItemsOk(updatedTodos);
      })
      .catch(err => setError(err.message));
  };

  const functionDeleteTodo = (id) => {
    deleteTodo(id, token)
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        checkAllItemsOk(updatedTodos);
      })
      .catch(err => setError(err.message));
  };

  const filterTodos = () => {
    if (filter === 'done') {
      return todos.filter(todo => todo.done);
    }
    if (filter === 'notDone') {
      return todos.filter(todo => !todo.done);
    }
    return todos; // 'all'
  };

  const allTodos = todos.length;
  const doneTodos = todos.filter(todo => todo.done).length;
  const progress = allTodos > 0 ? (doneTodos / allTodos) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Tasks</Text>
        <Image
          source={require('../assets/emoji.png')} 
          style={styles.titleIcon}
        />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{`${doneTodos} / ${allTodos} Completed tasks`}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonCheckAll]}
          onPress={() => functionCheckAllItems(true)}>
          <Text style={styles.buttonText}>Check All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonUncheckAll]}
          onPress={() => functionCheckAllItems(false)}>
          <Text style={styles.buttonText}>Uncheck All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonShowDone]}
          onPress={() => setFilter('done')}>
          <Text style={styles.buttonText}>Show Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonShowNotDone]}
          onPress={() => setFilter('notDone')}>
          <Text style={styles.buttonText}>Show Not Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonShowAll]}
          onPress={() => setFilter('all')}>
          <Text style={styles.buttonText}>Show All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <Input placeholder="New Task" onSubmit={functionCreateTodo} />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <FlatList
  data={filterTodos()}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.itemContainer}>
      <Switch
        value={item.done}
        onValueChange={(value) => switchTodo(item.id, value)}
      />
      {editingId === item.id ? (
        <TextInput
          style={styles.input}
          value={editContent}
          onChangeText={setEditContent}
          onSubmitEditing={() => functionUpdateTodo(item.id, editContent)}
        />
      ) : (
        <View style={styles.textWithIconContainer}>
          <Text
            style={[styles.itemText, item.done && styles.doneText]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.content}
          </Text>
          <TouchableOpacity onPress={() => functionDeleteTodo(item.id)}>
            <Image
              source={require('../assets/icon.jpg')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      )}
      {editingId === item.id ? (
        <TouchableOpacity onPress={() => functionUpdateTodo(item.id, editContent)}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setEditingId(item.id);
            setEditContent(item.content);
          }}
        >
          <Image
            source={require('../assets/edit.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  )}
/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#9E9E9E', 
    alignItems: 'center',
   
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5F5DC',
  },
  titleIcon: {
    width: 40,
    height: 40,
    marginLeft: 10, 
  },
  box: {
    backgroundColor: '#D9D3CA',
    padding: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  progressContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#795548',
    paddingHorizontal: 10,
  },
  textWithIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#A1887F',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#5D4037',
    flex: 1,
    marginRight: 10,
    color: '#5D4037',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: '#BF360C',
  },
  editIcon: {
    width: 24,
    height: 24,
    tintColor: '#5D4037',
    marginLeft: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonCheckAll: {
    backgroundColor: '#8D6E63',
  },
  buttonUncheckAll: {
    backgroundColor: '#BCAAA4',
  },
  buttonShowDone: {
    backgroundColor: '#6D4C41',
  },
  buttonShowNotDone: {
    backgroundColor: '#A1887F',
  },
  buttonShowAll: {
    backgroundColor: '#8D6E63',
  },
  errorText: {
    color: '#BF360C',
    marginVertical: 10,
  },
});

