const API_URL = 'http://graphql.unicaen.fr:4000';
import fetch from "node-fetch";

const SIGN_IN = `
  mutation SignIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) 
  }
`;

export function signIn(username, password) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: SIGN_IN,
      variables: {
        username: username,
        password: password
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.signIn;
    })
    .catch(error => {
      throw error;
    });
}

const CREATE_TODOLIST = `
  mutation createTodoLists($input: [TodoListCreateInput!]!) {
    createTodoLists(input: $input) {
      todoLists {
        id
        title
      }
    }
  }
`;

const TODOLISTS = `
  query TodoLists($where: TodoListWhere) {
    todoLists(where: $where) {
      id
      title
    }
  }
`;

const DELETE_TODOLIST = `
  mutation DeleteTodoLists($where: TodoListWhere) {
    deleteTodoLists(where: $where) {
      nodesDeleted
    }
  }
`;

const UPDATE_TODOLIST = `
  mutation UpdateTodoLists($where: TodoListWhere, $update: TodoListUpdateInput!) {
    updateTodoLists(where: $where, update: $update) {
      todoLists {
        id
        title
      }
    }
  }
`;

const UPDATE_ALL_TODOS = `
  mutation UpdateTodos($where: TodoWhere, $update: TodoUpdateInput!) {
    updateTodos(where: $where, update: $update) {
      todos {
        id
        done
      }
    }
  }
`;

// Fonction pour récupérer les TodoLists
export const getTodoLists = (username, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: TODOLISTS,
      variables: {
        "where": {
          "owner": {
            "username": username
          }
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.todoLists;
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour créer une TodoList
export const createTodoList = (username, title, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: CREATE_TODOLIST,
      variables: {
        "input": [
          {
            "owner": {
              "connect": {
                "where": {
                  "username": username
                }
              }
            },
            "title": title
          }
        ]
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.createTodoLists.todoLists[0];
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour supprimer une TodoList
export const deleteTodoList = (id, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: DELETE_TODOLIST,
      variables: {
        "where": {
          "id": id
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.deleteTodoLists.nodesDeleted;
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour renommer une TodoList
export const updateTodoList = (id, newTitle, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: UPDATE_TODOLIST,
      variables: {
        "where": {
          "id": id
        },
        "update": {
          "title": newTitle
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.updateTodoLists.todoLists[0];
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour mettre à jour tous les items d'une TodoList
export const updateAllTodosForList = (todoListId, done, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: UPDATE_ALL_TODOS,
      variables: {
        "where": {
          "belongsTo": { "id": todoListId }
        },
        "update": {
          "done": done
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.data.updateTodos.todos)
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

const CREATE_TODO = `
mutation CreateTodos($input: [TodoCreateInput!]!) {
  createTodos(input: $input) {
    todos {
      id
      content
      done
    }
  }
}
`;

const TODOS = `
query Todos($where: TodoWhere) {
  todos(where: $where) {
    id
    content
    done
  }
}
`;

const UPDATE_TODO = `
mutation UpdateTodos($where: TodoWhere, $update: TodoUpdateInput) {
  updateTodos(where: $where, update: $update) {
    todos {
      id
      content
      done
    }
  }
}`;

const DELETE_TODO = `
mutation($id: ID!) {
  deleteTodos(where: { id: $id }) {
    nodesDeleted
  }
}
`;

// Fonction pour récupérer les TodoItems
export const getTodos = (todoListId, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: TODOS,
      variables: {
        "where": {
          "belongsTo": {
            "id": todoListId
          }
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.todos;
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour créer un TodoItem
export const createTodo = (content, todoListId, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: CREATE_TODO,
      variables: {
        "input": [
          {
            "belongsTo": {
              "connect": {
                "where": {
                  "id": todoListId
                }
              }
            },
            "content": content
          }
        ]
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.createTodos.todos[0];
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour mettre à jour un TodoItem (contenu ou état)
export const updateTodo = (todoId, done, content, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: UPDATE_TODO,
      variables: {
        "where": {
          "id": todoId
        },
        "update": {
          "done": done,
          "content": content
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.updateTodos.todos[0];
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour supprimer un TodoItem
export const deleteTodo = (id, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: DELETE_TODO,
      variables: {
        id: id
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.deleteTodos.nodesDeleted;
    })
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};

// Fonction pour changer l'état de tous les items (CheckAll, CheckNone, CheckDone)
export const updateAllTodos = (todoListId, done, token) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      query: UPDATE_TODO,
      variables: {
        "where": {
          "belongsTo": {
            "id": todoListId
          }
        },
        "update": {
          "done": done
        }
      }
    })
  })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.data.updateTodos.todos)
    .catch(error => {
      console.log('error API', error.message);
      throw error;
    });
};
const SIGN_UP = `
  mutation SignUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password)
  }
`;

export const signUp = (username, password) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: SIGN_UP,
      variables: {
        username: username,
        password: password,
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.signUp; // Retourne le token
    })
    .catch((error) => {
      throw error;
    });
};

